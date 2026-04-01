// src/app/features/page.tsx — 기능 상세 페이지 (밝은 톤)
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Upload,
  Sparkles,
  Palette,
  Check,
  Instagram,
  Globe,
  ShoppingBag,
  Shield,
  Link2,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FeaturesPage() {
  const { locale } = useLanguage();

  return (
    <div
      className="min-h-[100dvh] bg-white text-gray-900"
      style={{ fontFamily: "'Pretendard', system-ui, sans-serif" }}
    >
      <main>
        {/* 1. Hero — 기능 페이지 소개 */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          {/* 부드러운 배경 */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-50 blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gray-50 blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
              Features
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-gray-900"
              style={{ wordBreak: "keep-all" }}
            >
              이미지만 올리면,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
                AI가 홈페이지를
              </span>
              <br />
              만들어드립니다
            </h1>
            <p
              className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
              style={{ wordBreak: "keep-all" }}
            >
              예술가를 위한 무료 홈페이지.
              인스타 연동. 다국어 지원. 작품 판매까지.
              필요한 모든 것이 이미 준비되어 있습니다.
            </p>
          </div>
        </section>

        {/* 2. How it Works — 4단계 */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
                How it works
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
                style={{ wordBreak: "keep-all" }}
              >
                3분이면 완성됩니다
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  icon: Upload,
                  title: "이미지를 올리세요",
                  desc: "작품 사진이나 포트폴리오 이미지를 업로드하세요. 그것만으로 충분합니다.",
                },
                {
                  step: "02",
                  icon: Sparkles,
                  title: "AI가 분석합니다",
                  desc: "AI가 작품의 스타일, 색감, 분위기를 분석하고 최적의 디자인을 제안합니다.",
                },
                {
                  step: "03",
                  icon: Palette,
                  title: "디자인을 선택하세요",
                  desc: "여러 템플릿 중 마음에 드는 디자인을 고르세요. 커스터마이징도 가능합니다.",
                },
                {
                  step: "04",
                  icon: Check,
                  title: "완성!",
                  desc: "홈페이지가 즉시 생성됩니다. 도메인 연결부터 SEO까지 모두 자동입니다.",
                },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className="group relative p-6 rounded-2xl border border-gray-100 bg-white ring-1 ring-black/5 hover:shadow-lg hover:shadow-black/5 hover:border-gray-200 transition-all duration-500"
                >
                  {/* 스텝 넘버 */}
                  <span className="text-5xl font-bold text-gray-100 absolute top-4 right-4 font-mono">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                    <item.icon size={22} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                  <p
                    className="text-sm text-gray-500 leading-relaxed"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {item.desc}
                  </p>
                  {/* 연결선 (마지막 제외) */}
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. 기능 스토리텔링 (매거진 레이아웃) */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto space-y-28">
            <div className="text-center mb-8">
              <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
                Deep dive
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
                style={{ wordBreak: "keep-all" }}
              >
                기술이 아닌,
                <br />
                예술을 담았습니다
              </h2>
              <p
                className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed"
                style={{ wordBreak: "keep-all" }}
              >
                모노페이지는 복잡한 기능을 자랑하지 않습니다.
                오직 당신의 작품이 가장 빛나는 방법에 대해서만 고민했습니다.
              </p>
            </div>

            {[
              {
                subtitle: "IMMERSIVE EXPERIENCE",
                title: "작품, 그 이상의 감동을\n전달하는 갤러리",
                desc: "멈춰있는 그림이 아닌, 살아 숨 쉬는 이야기를 전하세요. 관람객의 손끝에서 깊어지는 공간감과 여운은, 당신의 예술을 단순한 감상을 넘어 하나의 완벽한 경험으로 완성합니다.",
                image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2800&auto=format&fit=crop",
                align: "right" as const,
              },
              {
                subtitle: "YOUR OWN ARCHIVE",
                title: "흘려보내지 마세요.\n차곡차곡 쌓아올린 역사",
                desc: "SNS의 피드는 시간과 함께 흘러가 버립니다. 모노페이지에서는 당신의 초기작부터 현재의 걸작까지, 당신이 원하는 맥락과 순서대로 작품을 영구히 보존할 수 있습니다.",
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2800&auto=format&fit=crop",
                align: "left" as const,
              },
              {
                subtitle: "BORDERLESS CONNECTION",
                title: "국경 없는 연결,\n세상과 만나는 가장 쉬운 길",
                desc: "언어와 화폐의 장벽을 넘으세요. 자동 번역되는 페이지와 전 세계 결제 시스템은 당신의 예술을 지구 반대편의 컬렉터와 연결합니다.",
                image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2800&auto=format&fit=crop",
                align: "right" as const,
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${
                  feature.align === "left" ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* 텍스트 */}
                <div className="flex-1 space-y-6">
                  <span className="text-xs font-bold tracking-[0.3em] text-gray-400">
                    {feature.subtitle}
                  </span>
                  <h3
                    className="text-3xl md:text-4xl font-bold leading-snug whitespace-pre-line text-gray-900"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-lg text-gray-500 leading-relaxed font-light"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {feature.desc}
                  </p>
                </div>

                {/* 이미지 */}
                <div className="flex-1 relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-xl shadow-black/5 group">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Features 벤토 그리드 */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
                All features
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
                style={{ wordBreak: "keep-all" }}
              >
                필요한 모든 것이
                <br />
                이미 준비되어 있습니다
              </h2>
            </div>

            {/* 벤토 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 큰 카드 — AI 자동 생성 */}
              <div className="md:col-span-2 md:row-span-2 relative p-8 md:p-10 rounded-2xl border border-gray-100 bg-white ring-1 ring-black/5 overflow-hidden group hover:shadow-lg hover:shadow-black/5 hover:border-gray-200 transition-all">
                <div className="absolute top-0 right-0 w-2/3 h-full opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop"
                    alt="AI 자동 생성 — 아티스트 작품 분석"
                    fill
                    className="object-cover object-right"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                    <Sparkles size={22} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                    AI 자동 생성
                  </h3>
                  <p
                    className="text-gray-500 leading-relaxed max-w-md text-base"
                    style={{ wordBreak: "keep-all" }}
                  >
                    이미지를 올리면 AI가 작품의 특성을 분석하여 세계적 수준의
                    홈페이지를 자동으로 만들어드립니다. 코딩 지식이 전혀 필요 없습니다.
                  </p>
                </div>
              </div>

              {/* 작은 카드들 */}
              {[
                {
                  icon: Instagram,
                  title: "인스타그램 연동",
                  desc: "인스타 계정만 연결하면 포스트가 자동으로 갤러리에 반영됩니다.",
                },
                {
                  icon: Globe,
                  title: "다국어 지원",
                  desc: "한국어, 영어, 일본어, 중국어. AI가 자연스러운 번역을 제공합니다.",
                },
                {
                  icon: ShoppingBag,
                  title: "작품 판매",
                  desc: "작품 등록부터 결제까지. 수수료 8%만으로 전문 쇼핑몰을 운영하세요.",
                },
                {
                  icon: Shield,
                  title: "전문가 보안 관리",
                  desc: "SSL 인증서, 자동 백업, DDoS 방어. 보안은 저희가 책임집니다.",
                },
                {
                  icon: Link2,
                  title: "커스텀 도메인",
                  desc: "나만의 도메인을 연결하세요. yourname.com으로 프로 작가처럼.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl border border-gray-100 bg-white ring-1 ring-black/5 hover:shadow-lg hover:shadow-black/5 hover:border-gray-200 transition-all duration-500 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                    <feature.icon
                      size={18}
                      className="text-gray-400 group-hover:text-emerald-600 transition-colors"
                    />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5 text-gray-900">
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm text-gray-400 leading-relaxed"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Pricing 비교 */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
                Pricing
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
                style={{ wordBreak: "keep-all" }}
              >
                무료로 시작하세요
              </h2>
              <p
                className="text-gray-500 mt-4 max-w-lg mx-auto"
                style={{ wordBreak: "keep-all" }}
              >
                작품이 팔릴 때만 수수료 8%. 나머지는 전부 무료입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* 모노페이지 카드 (메인) */}
              <div className="lg:col-span-1 relative p-8 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 ring-1 ring-emerald-100">
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                    무료
                  </span>
                </div>
                <h3 className="text-2xl font-bold mt-2 mb-1 text-gray-900">모노페이지</h3>
                <p className="text-gray-500 text-sm mb-6">예술가 전용 플랫폼</p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">0</span>
                  <span className="text-gray-400">원/월</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "무제한 갤러리 페이지",
                    "무제한 대역폭",
                    "모든 프리미엄 템플릿",
                    "인스타그램 자동 연동",
                    "다국어 지원 (4개 언어)",
                    "작품 판매 기능",
                    "커스텀 도메인",
                    "SSL 보안 인증서",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-gray-400 mb-6">작품 판매 시 수수료 8%</p>

                <Link
                  href="/create"
                  className="block w-full py-3.5 bg-emerald-600 text-white text-center font-semibold rounded-full hover:bg-emerald-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                  style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                  무료로 시작하기
                </Link>
              </div>

              {/* 비교 — 타 플랫폼 */}
              <div className="lg:col-span-2 p-8 rounded-2xl border border-gray-100 bg-white ring-1 ring-black/5">
                <h3 className="text-lg font-semibold mb-2 text-gray-500">타 플랫폼 비교</h3>
                <p
                  className="text-sm text-gray-400 mb-8"
                  style={{ wordBreak: "keep-all" }}
                >
                  같은 기능을 다른 플랫폼에서 사용하면 얼마나 들까요?
                </p>

                <div className="space-y-4">
                  {[
                    { name: "S사 (웹빌더)", monthly: "29,000", yearly: "348,000", missing: "작품 판매 별도" },
                    { name: "W사 (홈페이지)", monthly: "16,500", yearly: "198,000", missing: "다국어 유료" },
                    { name: "C사 (포트폴리오)", monthly: "22,000", yearly: "264,000", missing: "도메인 별도" },
                    { name: "직접 개발", monthly: "50,000+", yearly: "600,000+", missing: "관리 비용 별도" },
                  ].map((comp) => (
                    <div
                      key={comp.name}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-600">{comp.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{comp.missing}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-400 line-through decoration-red-400/60">
                          월 {comp.monthly}원
                        </p>
                        <p className="text-xs text-gray-400">연 {comp.yearly}원</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">모노페이지</p>
                      <p className="text-xs text-gray-500 mt-0.5">호스팅 + 디자인 + 기능 모두 포함</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">0원</p>
                      <p className="text-xs text-gray-400">영원히 무료</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-gray-900"
              style={{ wordBreak: "keep-all" }}
            >
              당신의 이야기는
              <br />
              이제 시작입니다
            </h2>
            <p
              className="text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed"
              style={{ wordBreak: "keep-all" }}
            >
              모노페이지라는 캔버스 위에 마음껏 그려나가세요.
            </p>
            <Link
              href="/create"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white text-lg font-bold rounded-full hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-600/20"
              style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              무료로 시작하기
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
