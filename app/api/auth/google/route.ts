import { getGoogleAuthUrl } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") ?? "/admin";
  const authUrl = getGoogleAuthUrl(encodeURIComponent(redirectTo));
  return NextResponse.redirect(authUrl);
}
