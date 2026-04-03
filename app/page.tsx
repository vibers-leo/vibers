import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/nav";
import HeroSection from "@/components/sections/hero";
import PortfolioSection from "@/components/sections/portfolio";
import ServicesSection from "@/components/sections/services";
import PricingSection from "@/components/sections/pricing";
import ContactSection from "@/components/sections/contact";
import CoupangBanner from "@/components/CoupangBanner";
import VibersBanner from "@/components/VibersBanner";

export const metadata: Metadata = {
  title: "계발자들 | 아이디어를 실현하는 기술 파트너",
  description: "웹사이트, 앱, AI 서비스까지 — 기획부터 개발, 운영까지 함께합니다.",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* 메시 그라디언트 배경 */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] h-[80vh] w-[60vw] rounded-full bg-[#39FF14] opacity-[0.015] blur-[150px]" />
        <div className="absolute -bottom-[30%] -right-[10%] h-[60vh] w-[50vw] rounded-full bg-[#00FFAA] opacity-[0.01] blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] h-[50vh] w-[40vw] rounded-full bg-[#6C63FF] opacity-[0.008] blur-[150px]" />
      </div>
      <Nav />
      <HeroSection />
      <PortfolioSection />
      <ServicesSection />
      <PricingSection />
      <ContactSection />

      {/* 푸터 */}
      <footer className="border-t border-white/5 py-10 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-center gap-4 mb-3">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              개인정보처리방침
            </Link>
            <span className="text-white/10">|</span>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              이용약관
            </Link>
          </div>
          <p className="text-sm text-white/20">
            © 2026 계발자들 (Vibers). Powered by D.Lab Corp.
          </p>
          <CoupangBanner />
          <div className="mt-4 flex justify-center">
            <VibersBanner size="leaderboard" currentProject="vibers" />
          </div>
        </div>
      </footer>
    </div>
  );
}
