import { getNaverAuthUrl } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") ?? "/";
  const authUrl = getNaverAuthUrl(encodeURIComponent(redirectTo));
  return NextResponse.redirect(authUrl);
}
