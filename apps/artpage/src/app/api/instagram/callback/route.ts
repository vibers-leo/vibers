import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, getLongLivedToken, getUserProfile, getUserMedia } from "@/lib/instagram";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state") || "";
  const error = searchParams.get("error");

  let siteSlug = "";
  let mode = "connect";

  try {
    const state = JSON.parse(stateRaw);
    siteSlug = state.slug || "";
    mode = state.mode || "connect";
  } catch {
    siteSlug = stateRaw;
  }

  // 사용자가 권한 거부한 경우
  if (error) {
    const redirectPath = mode === "onboarding" ? "/" : `/admin/settings?instagram=denied`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // 1. 단기 토큰 교환
    const shortToken = await exchangeCode(code);
    if (!shortToken) throw new Error("Short-lived token failed");

    // 2. 장기 토큰 교환 (60일)
    const longToken = await getLongLivedToken(shortToken.access_token);
    if (!longToken) throw new Error("Long-lived token failed");

    const accessToken = longToken.access_token;
    const profile = await getUserProfile(accessToken);
    const username = profile?.username || "artist";

    // ── 온보딩 모드: 바로 사이트 생성 단계로 전달 ──
    if (mode === "onboarding") {
      // 인스타 게시물 가져오기
      const media = await getUserMedia(accessToken, 12); // 최근 12개
      const imageUrls = media?.map(m => m.media_url) || [];

      // 쿠키를 통해 이미지 데이터 전달 (대안: 템플릿 정보와 함께 세션에 저장)
      const cookieStore = await cookies();
      cookieStore.set("monopage_instagram_images", JSON.stringify(imageUrls), { maxAge: 3600 });
      cookieStore.set("monopage_onboarding_name", username, { maxAge: 3600 });

      // 커스터마이즈 페이지로 이동
      return NextResponse.redirect(
        new URL(`/create/customize?step=instagram&slug=${siteSlug}`, request.url)
      );
    }

    // ── 일반 연결 모드 (관리자 설정 등) ──
    const expiresAt = new Date(Date.now() + longToken.expires_in * 1000);
    await prisma.instagramConnection.upsert({
      where: { site_slug: siteSlug },
      update: {
        access_token: accessToken,
        user_id: shortToken.user_id,
        username,
        token_expires: expiresAt,
      },
      create: {
        site_slug: siteSlug,
        access_token: accessToken,
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
    return NextResponse.redirect(new URL("/", request.url));
  }
}
