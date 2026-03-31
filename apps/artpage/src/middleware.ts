import { NextResponse, type NextRequest } from "next/server";

// 커스텀 도메인 → 내부 경로 매핑
const DOMAIN_MAP: Record<string, string> = {
  "arthyun.co.kr": "/arthyun",
  "www.arthyun.co.kr": "/arthyun",
};

// monopage.kr 서브도메인 → 슬러그 매핑
// 예: arthyun.monopage.kr → /arthyun
const MONOPAGE_SUBDOMAIN_MAP: Record<string, string> = {
  arthyun: "/arthyun",
  "art-way": "/art-way",
  artway: "/art-way",
};

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // 1. 커스텀 도메인 기반 라우팅 (arthyun.co.kr → /arthyun/...)
  const basePath = DOMAIN_MAP[hostname];
  if (basePath) {
    if (!pathname.startsWith(basePath)) {
      const url = request.nextUrl.clone();
      url.pathname = basePath + (pathname === "/" ? "" : pathname);
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 2. monopage.kr 서브도메인 라우팅 (arthyun.monopage.kr → /arthyun/...)
  const monopageMatch = hostname.match(/^([^.]+)\.monopage\.kr$/);
  if (monopageMatch) {
    const subdomain = monopageMatch[1];
    const slugPath = MONOPAGE_SUBDOMAIN_MAP[subdomain];
    if (slugPath && !pathname.startsWith(slugPath)) {
      const url = request.nextUrl.clone();
      url.pathname = slugPath + (pathname === "/" ? "" : pathname);
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 3. 세션 쿠키 가져오기
  const session = request.cookies.get("session")?.value;

  // 4. 보호할 경로 설정 (/admin 으로 시작하는 모든 경로)
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 5. 이미 로그인된 상태에서 로그인 페이지 접근 시 대시보드로 리다이렉트
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
