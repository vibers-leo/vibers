// Instagram OAuth 콜백 처리
// code → access_token 교환 → DB 저장

import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, getLongLivedToken, getUserProfile } from "@/lib/instagram";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const siteSlug = searchParams.get("state"); // state에 site_slug 전달됨
  const error = searchParams.get("error");

  // 사용자가 권한 거부한 경우
  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/settings?instagram=denied`, request.url)
    );
  }

  if (!code || !siteSlug) {
    return NextResponse.redirect(
      new URL(`/admin/settings?instagram=error&reason=missing_params`, request.url)
    );
  }

  try {
    // 1. 단기 토큰 교환
    const shortToken = await exchangeCode(code);
    if (!shortToken) {
      return NextResponse.redirect(
        new URL(`/admin/settings?instagram=error&reason=token_exchange`, request.url)
      );
    }

    // 2. 장기 토큰 교환 (60일)
    const longToken = await getLongLivedToken(shortToken.access_token);
    if (!longToken) {
      return NextResponse.redirect(
        new URL(`/admin/settings?instagram=error&reason=long_token`, request.url)
      );
    }

    // 3. 사용자 프로필 조회
    const profile = await getUserProfile(longToken.access_token);
    const username = profile?.username || "unknown";

    // 4. DB에 저장 (upsert)
    const expiresAt = new Date(Date.now() + longToken.expires_in * 1000);

    await prisma.instagramConnection.upsert({
      where: { site_slug: siteSlug },
      update: {
        access_token: longToken.access_token,
        user_id: shortToken.user_id,
        username,
        token_expires: expiresAt,
      },
      create: {
        site_slug: siteSlug,
        access_token: longToken.access_token,
        user_id: shortToken.user_id,
        username,
        token_expires: expiresAt,
      },
    });

    return NextResponse.redirect(
      new URL(`/admin/settings?instagram=connected&username=${username}`, request.url)
    );
  } catch (err) {
    console.error("Instagram callback error:", err);
    return NextResponse.redirect(
      new URL(`/admin/settings?instagram=error&reason=server`, request.url)
    );
  }
}
