import { exchangeNaverCode, upsertUser, createSession, COOKIE_NAME } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";
  const redirectTo = state ? decodeURIComponent(state) : "/";

  if (!code) return NextResponse.redirect(new URL("/login?error=no_code", request.url));

  const naverUser = await exchangeNaverCode(code, state);
  if (!naverUser?.email) return NextResponse.redirect(new URL("/login?error=naver_failed", request.url));

  const user = await upsertUser({ ...naverUser, provider: "naver" });
  const token = await createSession(user);

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true, secure: true, sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, path: "/",
  });
  return response;
}
