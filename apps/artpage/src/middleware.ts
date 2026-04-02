import { NextResponse, type NextRequest } from "next/server";

// 커스텀 도메인 → 내부 경로 매핑
const DOMAIN_MAP: Record<string, string> = {
  "arthyun.co.kr": "/arthyun",
  "www.arthyun.co.kr": "/arthyun",
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

  // 2. monopage.kr 동적 서브도메인 라우팅 (예: leo.monopage.kr → /leo)
  const isMonopage = hostname.endsWith(".monopage.kr") || hostname === "monopage.kr";
  
  if (isMonopage && hostname !== "monopage.kr") {
    const subdomain = hostname.split(".")[0];
    
    // 예약어 제외 (www 등)
    const reservedSubdomains = ["www", "admin", "api", "create", "pricing", "features", "templates"];
    
    if (subdomain && !reservedSubdomains.includes(subdomain.toLowerCase())) {
      // 내부적으로 /slug 로 리라이트. 
      // Next.js (artists)/[slug] 가 이를 처리함
      if (!pathname.startsWith(`/${subdomain}`)) {
        const url = request.nextUrl.clone();
        url.pathname = `/${subdomain}${pathname === "/" ? "" : pathname}`;
        return NextResponse.rewrite(url);
      }
    }
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
