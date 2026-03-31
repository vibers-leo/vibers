"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PlatformHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 밝은 테마 — 항상 다크 텍스트
  const textColor = "text-gray-900";
  const mutedTextColor = "text-gray-500";
  const logoBg = "bg-gray-900 text-white";
  const buttonClass = "bg-emerald-600 text-white hover:bg-emerald-500";

  const navItems = [
    { href: "/features", label: t.platform.nav.features || "기능" },
    { href: "/pricing", label: t.platform.nav.pricing || "가격" },
    { href: "/templates", label: t.platform.nav.demo || "템플릿" },
    { href: "/artists", label: "아티스트 동향" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-serif text-xl transition-colors ${logoBg}`}>
            A
          </div>
          <span className={`text-xl font-serif font-medium transition-colors ${textColor}`}>
            모노페이지
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 데스크톱 액션 버튼 */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin/login"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            {t.platform.nav.login || "로그인"}
          </Link>
          <Link
            href="/create"
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] ${buttonClass}`}
            style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <span>{t.platform.nav.start || "무료로 시작하기"}</span>
            <ArrowRight size={16} />
          </Link>

          {/* 언어 전환 버튼 */}
          <div className="pl-4 ml-2 border-l border-gray-200">
            <LanguageSwitcher />
          </div>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button
            className="p-2 text-gray-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-6 shadow-xl h-[100dvh]">
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg font-medium text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-gray-100" />
            <Link
              href="/admin/login"
              className="text-lg font-medium text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.platform.nav.login || "로그인"}
            </Link>
            <Link
              href="/create"
              className="py-3 bg-emerald-600 text-white rounded-full text-center text-lg font-medium hover:bg-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.platform.nav.start || "무료로 시작하기"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
