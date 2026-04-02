// Instagram 연결 시작 — OAuth URL로 리다이렉트
import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/instagram";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const siteSlug = searchParams.get("site_slug") || searchParams.get("instagram_id") || "new-user";
  const mode = searchParams.get("mode") || "connect";

  const authUrl = getAuthUrl(siteSlug, mode);
  return NextResponse.redirect(authUrl);
}
