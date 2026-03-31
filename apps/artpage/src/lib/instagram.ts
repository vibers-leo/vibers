// Instagram Graph API 클라이언트
// OAuth 2.0 + 미디어 조회 + 토큰 갱신

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID!;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET!;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || "https://monopage.vibers.co.kr/api/instagram/callback";

// ── OAuth 인증 URL 생성 ──
export function getAuthUrl(siteSlug: string): string {
  const params = new URLSearchParams({
    client_id: INSTAGRAM_APP_ID,
    redirect_uri: REDIRECT_URI,
    scope: "instagram_business_basic,instagram_business_content_publish",
    response_type: "code",
    state: siteSlug, // site_slug를 state로 전달
  });
  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
}

// ── 단기 토큰 교환 (code → short-lived token) ──
export async function exchangeCode(code: string): Promise<{
  access_token: string;
  user_id: string;
} | null> {
  try {
    const res = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    if (!res.ok) {
      console.error("Instagram token exchange error:", await res.text());
      return null;
    }

    const data = await res.json();
    return {
      access_token: data.access_token,
      user_id: String(data.user_id),
    };
  } catch (error) {
    console.error("Instagram exchangeCode error:", error);
    return null;
  }
}

// ── 장기 토큰 교환 (short-lived → long-lived, 60일) ──
export async function getLongLivedToken(shortLivedToken: string): Promise<{
  access_token: string;
  expires_in: number;
} | null> {
  try {
    const params = new URLSearchParams({
      grant_type: "ig_exchange_token",
      client_secret: INSTAGRAM_APP_SECRET,
      access_token: shortLivedToken,
    });

    const res = await fetch(`https://graph.instagram.com/access_token?${params.toString()}`);
    if (!res.ok) {
      console.error("Instagram long-lived token error:", await res.text());
      return null;
    }

    const data = await res.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in, // 초 단위 (약 5,184,000 = 60일)
    };
  } catch (error) {
    console.error("Instagram getLongLivedToken error:", error);
    return null;
  }
}

// ── 토큰 갱신 (만료 전 refresh) ──
export async function refreshToken(currentToken: string): Promise<{
  access_token: string;
  expires_in: number;
} | null> {
  try {
    const params = new URLSearchParams({
      grant_type: "ig_refresh_token",
      access_token: currentToken,
    });

    const res = await fetch(`https://graph.instagram.com/refresh_access_token?${params.toString()}`);
    if (!res.ok) {
      console.error("Instagram refresh token error:", await res.text());
      return null;
    }

    const data = await res.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error("Instagram refreshToken error:", error);
    return null;
  }
}

// ── 사용자 미디어 조회 ──
export type InstagramMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  permalink: string;
  username: string;
};

export async function getUserMedia(
  accessToken: string,
  limit: number = 20
): Promise<InstagramMedia[] | null> {
  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,username";
    const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${accessToken}&limit=${limit}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error("Instagram getUserMedia error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Instagram getUserMedia error:", error);
    return null;
  }
}

// ── 사용자 프로필 조회 ──
export async function getUserProfile(accessToken: string): Promise<{
  id: string;
  username: string;
} | null> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
