import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { pool } from "./db";
import { SUPER_ADMIN_EMAILS, type Provider } from "./permissions";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "vibers-dev-secret-change-in-production"
);

export const COOKIE_NAME = "vibers_session";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibers.co.kr";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
}

// JWT 발급 (7일)
export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// JWT 검증
export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

// 쿠키에서 세션 읽기
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

// DB에 사용자 upsert + 소셜 계정 연동
export async function upsertUser(params: {
  email: string;
  name: string;
  picture: string;
  sub: string;
  provider: Provider;
}): Promise<SessionUser> {
  const role = SUPER_ADMIN_EMAILS.includes(params.email) ? 'super_admin' : undefined;

  const { rows } = await pool.query(
    `INSERT INTO vibers.users (email, name, avatar_url, role, last_login)
     VALUES ($1, $2, $3, COALESCE($4, 'member'), NOW())
     ON CONFLICT (email) DO UPDATE SET
       name = EXCLUDED.name,
       avatar_url = EXCLUDED.avatar_url,
       last_login = NOW(),
       role = CASE WHEN vibers.users.role = 'member' AND $4 IS NOT NULL THEN $4 ELSE vibers.users.role END
     RETURNING id, email, name, avatar_url, role`,
    [params.email, params.name, params.picture, role ?? null]
  );
  const u = rows[0];

  // 소셜 계정 연동 저장
  await pool.query(
    `INSERT INTO vibers.user_social_accounts (user_id, provider, provider_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider, provider_id) DO NOTHING`,
    [u.id, params.provider, params.sub]
  );

  return { id: u.id, email: u.email, name: u.name, avatarUrl: u.avatar_url, role: u.role };
}

// 소셜 계정 목록 조회
export async function getUserSocialAccounts(userId: string) {
  const { rows } = await pool.query(
    `SELECT provider, created_at FROM vibers.user_social_accounts WHERE user_id = $1`,
    [userId]
  );
  return rows as { provider: Provider; created_at: string }[];
}

// 소셜 계정 연동 해제
export async function unlinkSocialAccount(userId: string, provider: Provider) {
  const { rowCount } = await pool.query(
    `SELECT COUNT(*) FROM vibers.user_social_accounts WHERE user_id = $1`,
    [userId]
  );
  // 마지막 소셜 계정은 해제 불가
  if ((rowCount ?? 0) <= 1) return { error: '마지막 로그인 수단은 해제할 수 없습니다.' };

  await pool.query(
    `DELETE FROM vibers.user_social_accounts WHERE user_id = $1 AND provider = $2`,
    [userId, provider]
  );
  return { ok: true };
}

// ── Google ─────────────────────────────────────────────
export function getGoogleAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    ...(state ? { state } : {}),
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeGoogleCode(code: string) {
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return null;

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const u = await userRes.json();
    return { email: u.email, name: u.name, picture: u.picture, sub: u.sub };
  } catch {
    return null;
  }
}

// ── Naver ──────────────────────────────────────────────
export function getNaverAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.NAVER_CLIENT_ID!,
    redirect_uri: `${SITE_URL}/api/auth/callback/naver`,
    state: state ?? Math.random().toString(36).slice(2),
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params}`;
}

export async function exchangeNaverCode(code: string, state: string) {
  try {
    const tokenRes = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NAVER_CLIENT_ID!,
        client_secret: process.env.NAVER_CLIENT_SECRET!,
        redirect_uri: `${SITE_URL}/api/auth/callback/naver`,
        code,
        state,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return null;

    const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();
    const r = userData.response;
    if (!r) return null;
    return { email: r.email, name: r.name, picture: r.profile_image, sub: `naver_${r.id}` };
  } catch {
    return null;
  }
}

// ── Kakao ──────────────────────────────────────────────
export function getKakaoAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: `${SITE_URL}/api/auth/callback/kakao`,
    response_type: "code",
    ...(state ? { state } : {}),
  });
  return `https://kauth.kakao.com/oauth/authorize?${params}`;
}

export async function exchangeKakaoCode(code: string) {
  try {
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET ?? "",
        redirect_uri: `${SITE_URL}/api/auth/callback/kakao`,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return null;

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const u = await userRes.json();
    const profile = u.kakao_account?.profile;
    const email = u.kakao_account?.email ?? `kakao_${u.id}@kakao.local`;
    return {
      email,
      name: profile?.nickname ?? "카카오 사용자",
      picture: profile?.profile_image_url ?? "",
      sub: `kakao_${u.id}`,
    };
  } catch {
    return null;
  }
}
