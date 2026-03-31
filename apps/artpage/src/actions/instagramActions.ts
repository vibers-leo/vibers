"use server";

/**
 * Instagram Feed를 가져오는 서버 액션 (stub)
 * 실제 Instagram Graph API 연동 시 구현 필요
 */
export async function fetchInstagramFeed(
  accessToken: string,
  userId?: string
): Promise<any[] | null> {
  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,username";
    const url = `https://graph.instagram.com/${userId || "me"}/media?fields=${fields}&access_token=${accessToken}&limit=50`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error("Instagram API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Instagram fetch error:", error);
    return null;
  }
}
