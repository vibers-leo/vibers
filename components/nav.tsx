'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: "#portfolio", label: "포트폴리오" },
    { href: "#services", label: "서비스" },
    { href: "#pricing", label: "가격" },
    { href: "#contact", label: "문의" },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full">
      <div
        className={`mx-auto transition-all duration-500 ${
          scrolled
            ? 'mt-3 max-w-7xl rounded-2xl border border-white/10 bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mx-4 xl:mx-auto'
            : 'max-w-full border-b border-[rgba(57,255,20,0.08)] bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[#39FF14] flex items-center justify-center text-sm font-black text-black">
              계
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white group-hover:text-[#39FF14] transition-colors">
                계발자들
              </span>
              <span className="ml-2 text-xs text-white/40 hidden sm:inline">
                vibers.co.kr
              </span>
            </div>
          </Link>

          {/* 데스크탑 네비 */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-white/40 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/projects"
              className={`transition-colors ${
                pathname.startsWith("/projects") ? "text-[#39FF14]" : "text-white/40 hover:text-white"
              }`}
            >
              아카이브
            </Link>
            <button
              onClick={() => handleNavClick('#contact')}
              className="rounded-full border border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.08)] px-4 py-1.5 text-[#39FF14] text-xs font-bold hover:bg-[rgba(57,255,20,0.15)] transition-colors"
            >
              프로젝트 문의 →
            </button>

            {!loading && (
              user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#39FF14]/20 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#39FF14]" />
                      </div>
                    )}
                    <span className="max-w-[80px] truncate text-xs">{user.name ?? user.email}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#111] shadow-xl py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-white/10">
                        <p className="text-xs text-white/80 font-medium truncate">{user.name ?? '사용자'}</p>
                        <p className="text-xs text-white/30 truncate">{user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#39FF14] hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          관리자페이지
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        프로필 설정
                      </Link>
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  로그인
                </Link>
              )
            )}
          </nav>

          {/* 모바일 햄버거 */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {mobileOpen && (
          <div className={`md:hidden border-t border-[rgba(57,255,20,0.1)] bg-[rgba(10,10,10,0.95)] backdrop-blur-xl ${scrolled ? 'rounded-b-2xl' : ''}`}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-white/40 hover:text-white transition-colors text-sm font-medium"
                >
                  {link.label}
                </button>
              ))}
              <Link href="/projects" onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white transition-colors text-sm font-medium">
                아카이브
              </Link>
              {!loading && (
                user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-[#39FF14] text-sm font-medium flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        관리자페이지
                      </Link>
                    )}
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white text-sm font-medium flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      프로필 설정
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="text-left text-white/40 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[#39FF14] hover:underline text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    로그인 / 회원가입
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
