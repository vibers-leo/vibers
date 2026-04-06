import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { pool } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "vibers-dev-secret-change-in-production"
);

const COOKIE_NAME = "vibers_session";

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

// 쿠키에서 세션 읽기 (서버 컴포넌트용)
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

// Google OAuth URL 생성
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

// Google code → 사용자 정보 교환
export async function exchangeGoogleCode(code: string): Promise<{
  email: string;
  name: string;
  picture: string;
  sub: string;
} | null> {
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
    return userRes.json();
  } catch {
    return null;
  }
}

// DB에 사용자 upsert 후 반환
export async function upsertUser(googleUser: {
  email: string;
  name: string;
  picture: string;
  sub: string;
}): Promise<SessionUser> {
  const { rows } = await pool.query(
    `INSERT INTO vibers_admin.users (email, name, avatar_url, google_id, last_login)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (email) DO UPDATE SET
       name = EXCLUDED.name,
       avatar_url = EXCLUDED.avatar_url,
       google_id = EXCLUDED.google_id,
       last_login = NOW()
     RETURNING id, email, name, avatar_url, role`,
    [googleUser.email, googleUser.name, googleUser.picture, googleUser.sub]
  );
  const u = rows[0];
  return { id: u.id, email: u.email, name: u.name, avatarUrl: u.avatar_url, role: u.role };
}

export { COOKIE_NAME };
