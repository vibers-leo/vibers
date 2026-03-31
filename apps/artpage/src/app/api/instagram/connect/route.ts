// Instagram 연결 시작 — OAuth URL로 리다이렉트
import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/instagram";

export async function GET(request: NextRequest) {
  const siteSlug = request.nextUrl.searchParams.get("site_slug");

  if (!siteSlug) {
    return NextResponse.json({ error: "site_slug 필수" }, { status: 400 });
  }

  const authUrl = getAuthUrl(siteSlug);
  return NextResponse.redirect(authUrl);
}
