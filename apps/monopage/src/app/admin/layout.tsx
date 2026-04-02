"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import VibersBanner from "@/components/VibersBanner";
import { AdminSiteProvider } from "@/lib/admin-site-context";
import SiteSelector from "@/components/admin/SiteSelector";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname?.includes("/admin/login");

    return (
        <AdminSiteProvider>
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7704550771011130"
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Admin Header / Nav - Hide on login page */}
            {!isLoginPage && (
                <div className="bg-white border-b border-gray-200">
                <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="font-serif font-bold text-xl">
                            MONOPAGE ADMIN
                        </Link>
                        {/* 멀티사이트 선택 */}
                        <SiteSelector />
                        <nav className="flex gap-6 text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap pb-1">
                            <Link
                                href="/admin/dashboard"
                                className="hover:text-black transition-colors"
                            >
                                개요
                            </Link>
                            <Link
                                href="/admin/links"
                                className="hover:text-black transition-colors"
                            >
                                링크 관리
                            </Link>
                            <Link
                                href="/admin/exhibition"
                                className="hover:text-black transition-colors"
                            >
                                전시 관리
                            </Link>
                            <Link
                                href="/admin/artworks"
                                className="hover:text-black transition-colors"
                            >
                                작품 판매
                            </Link>
                            <Link
                                href="/admin/support"
                                className="hover:text-black transition-colors"
                            >
                                후원 내역
                            </Link>
                            <Link
                                href="/admin/value-settings"
                                className="hover:text-black transition-colors"
                            >
                                가치 설정
                            </Link>
                            <Link
                                href="/admin/settings"
                                className="hover:text-black transition-colors"
                            >
                                사이트 설정
                            </Link>
                        </nav>
                    </div>
                    <div>
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                나가기
                            </Button>
                        </Link>
                    </div>
                </div>
              </div>
            )}

            {children}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8 }}>계발자들 프로젝트</p>
                <VibersBanner size="medium" currentProject="monopage" />
            </div>
        </div>
        </AdminSiteProvider>
    );
}
