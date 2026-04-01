"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PlatformHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/archive", label: "Archives" },
    { href: "/artists", label: "Artists" },
    { href: "/concierge", label: "Expert Service", icon: <Sparkles size={12} className="text-emerald-500" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || mobileMenuOpen
          ? "bg-white/70 backdrop-blur-xl border-b border-gray-100/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
        {/* 로고 — Supernova Style */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-serif text-xl border border-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500`}>
              M
            </div>
            {isScrolled && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tighter text-gray-900 uppercase">
            Monopage
          </span>
        </Link>

        {/* 데스크톱 네비게이션 — Minimalist */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-emerald-600 ${
                pathname === item.href ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {item.icon}
              {item.label}
              <span className={`block h-px bg-emerald-600 transition-all duration-300 ${
                pathname === item.href ? "w-full mt-0.5" : "w-0 group-hover:w-full mt-0.5"
              }`} />
            </Link>
          ))}
        </nav>

        {/* 데스크톱 액션 버튼 */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/admin/login"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/create"
            className="group relative px-6 py-2.5 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:scale-[1.05] active:scale-[0.98] shadow-xl shadow-black/10"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>

          {/* 언어 전환 버튼 */}
          <div className="pl-6 border-l border-gray-100">
            <LanguageSwitcher />
          </div>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            className="p-2 text-gray-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 — Fullscreen Glass */}
      <div className={`lg:hidden fixed inset-0 top-20 md:top-24 bg-white/95 backdrop-blur-2xl transition-all duration-500 ${
        mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}>
        <nav className="flex flex-col items-center justify-center h-full gap-10 px-10 pb-20">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-2xl font-bold uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <div className="w-full h-px bg-gray-100" />
          <Link
            href="/admin/login"
            className="text-xl font-bold uppercase tracking-[0.2em] text-gray-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/create"
            className="w-full py-5 bg-gray-900 text-white rounded-full text-center text-sm font-bold uppercase tracking-[0.2em] shadow-2xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
