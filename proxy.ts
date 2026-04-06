import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const url = req.nextUrl;

  // admin.vibers.co.kr → /admin 라우트로 redirect
  if (hostname === "admin.vibers.co.kr") {
    if (!url.pathname.startsWith("/admin") && !url.pathname.startsWith("/api") && !url.pathname.startsWith("/login")) {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // app.vibers.co.kr → /app 라우트로 rewrite
  if (
    hostname === "app.vibers.co.kr" ||
    hostname === "app.localhost:3800"
  ) {
    url.pathname = `/app${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
