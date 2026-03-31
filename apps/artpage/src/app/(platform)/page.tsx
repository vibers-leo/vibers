// src/app/(platform)/page.tsx — monopage.kr 매니페스토 랜딩 페이지
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
  Youtube,
  Globe,
  ShoppingBag,
  Heart,
  Sparkles,
  BarChart3,
} from "lucide-react";
import LiveStats from "@/components/LiveStats";

export default function PlatformHomePage() {
  return (
    <div
      className="bg-white text-gray-900 relative overflow-hidden"
      style={{ fontFamily: "'Pretendard', system-ui, sans-serif" }}
    >
      {/* ── 1. Hero — The Manifesto ─────────────────────────── */}
      <section className="min-h-[100dvh] relative flex items-center">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-50/60 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gray-50/60 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* 왼쪽 — 매니페스토 텍스트 */}
            <div className="pt-24 lg:pt-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                A Social Art Experiment
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 text-gray-900"
                style={{ wordBreak: "keep-all" }}
              >
                이미지 홍수의 시대에,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
                  아티스트만을 위한
                </span>
                <br />
                단 하나의 페이지
              </h1>

              <p
                className="text-lg md:text-xl text-gray-500 max-w-lg mb-10 leading-relaxed font-light"
                style={{ wordBreak: "keep-all" }}
              >
                인스타그램과 유튜브를 연결하고, 작품을 판매하며,
                당신이 정한 가치로 운영되는 세계 유일의 실험.
                <br />
                관리는 쉽게, 서포트는 자유롭게.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  href="/create"
                  className="group relative px-8 py-4 bg-gray-900 text-white text-base font-semibold rounded-full overflow-hidden transition-all hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
                  style={{
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <span className="flex items-center gap-2">
                    실험에 참여하기
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </Link>

                <Link
                  href="/arthyun"
                  className="group px-8 py-4 text-base font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 transition-all flex items-center gap-2 rounded-full"
                >
                  데모 보기
                  <ArrowUpRight
                    size={16}
                    className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>

              {/* 컴팩트 통계 */}
              <div className="mt-14 pt-8 border-t border-gray-100">
                <LiveStats variant="compact" />
              </div>
            </div>

            {/* 오른쪽 — 비주얼 카드 */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-100 bg-white ring-1 ring-black/5 shadow-2xl shadow-black/10">
                <Image
                  src="https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?q=80&w=800&auto=format&fit=crop"
                  alt="monopage 아티스트 갤러리 미리보기"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/20" />
                {/* 오버레이 UI */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-gray-400 mb-1 font-mono">
                      monopage.kr/artist
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      아티스트를 위한 단 하나의 페이지
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-full font-medium">
                        인스타 연동
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-full">
                        유튜브 연동
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-full">
                        자율 수수료
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 플로팅 장식 */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-100 animate-[float_6s_ease-in-out_infinite]" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gray-50 border border-gray-100 animate-[float_8s_ease-in-out_infinite_1s]" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The Experiment — 실험 소개 ───────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono tracking-widest text-emerald-600 mb-6 uppercase">
            The Experiment
          </p>
          <blockquote className="mb-8">
            <p
              className="text-2xl md:text-3xl font-light text-gray-700 leading-relaxed"
              style={{ wordBreak: "keep-all", fontFamily: "'Noto Serif KR', Georgia, serif" }}
            >
              &ldquo;아티스트만을 위한 페이지가 필요해 보였다.
              <br />
              관리가 쉽고 서포트가 된다면,
              <br />
              얼마나 많은 아티스트들이 어떤 비율로
              <br />
              이 공간을 사용하기를 희망하는지 알아보고 싶었다.&rdquo;
            </p>
          </blockquote>
          <p className="text-sm text-gray-400 mb-12" style={{ wordBreak: "keep-all" }}>
            monopage.kr은 단순한 서비스가 아닙니다.
            <br />
            이 플랫폼 자체가 하나의 예술 실험이며, 모든 과정이 아카이빙됩니다.
            <br />
            수수료는 아티스트가 직접 설정합니다. 0%부터 100%까지. 그것이 실험입니다.
          </p>

          {/* Live Stats 전체 버전 */}
          <LiveStats variant="full" className="mb-8" />

          <div className="text-center">
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <BarChart3 size={14} />
              실험 아카이브 보기
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. 핵심 기능 ─────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
                Core features
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
                style={{ wordBreak: "keep-all" }}
              >
                관리는 쉽게,
                <br />
                연결은 자유롭게
              </h2>
            </div>
            <Link
              href="/features"
              className="text-sm text-gray-400 hover:text-emerald-600 flex items-center gap-1 transition-colors"
            >
              자세히 보기
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Instagram,
                title: "인스타그램 연동",
                desc: "계정만 연결하면 포스트가 자동으로 페이지에 반영됩니다. 별도 관리가 필요 없습니다.",
              },
              {
                icon: Youtube,
                title: "유튜브 연동",
                desc: "채널 ID만 입력하면 최신 영상이 자동으로 통합 피드에 나타납니다.",
              },
              {
                icon: ShoppingBag,
                title: "작품 판매",
                desc: "작품 등록부터 결제까지 한 곳에서. 수수료는 내가 정합니다.",
              },
              {
                icon: Heart,
                title: "자율 후원",
                desc: "방문자가 감동했을 때 자유롭게 응원할 수 있습니다. 모든 흐름은 투명합니다.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-gray-100 bg-white ring-1 ring-black/5 hover:shadow-lg hover:shadow-black/5 hover:border-gray-200 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                  <feature.icon size={22} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p
                  className="text-sm text-gray-500 leading-relaxed"
                  style={{ wordBreak: "keep-all" }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 왜 모노페이지인가 ─────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
              Why Monopage
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
              style={{ wordBreak: "keep-all" }}
            >
              왜 아티스트에게
              <br />
              전용 플랫폼이 필요할까요?
            </h2>
          </div>

          <div className="space-y-24">
            {[
              {
                subtitle: "CURATED CONTROL",
                title: "알고리즘이 아닌,\n아카이빙",
                desc: "SNS의 획일적인 피드는 작품을 흘려보냅니다. 모노페이지는 작가가 원하는 순서와 맥락으로 작품을 배치할 수 있는 큐레이션의 주권을 드립니다.",
                image:
                  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2971&auto=format&fit=crop",
                align: "right" as const,
              },
              {
                subtitle: "VALUE-BASED",
                title: "수수료가 아닌,\n가치 설정",
                desc: "모노페이지는 수수료를 정하지 않습니다. 아티스트가 직접 0%부터 100%까지 자유롭게 설정합니다. 이 자체가 하나의 예술적 실험입니다.",
                image:
                  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2968&auto=format&fit=crop",
                align: "left" as const,
              },
              {
                subtitle: "CIRCULATION",
                title: "수익금은 다시,\n아티스트에게",
                desc: "모인 수익금은 다른 아티스트와 로컬 크리에이터의 작품을 구매하고 응원하는 데 사용됩니다. 선순환이 이 실험의 핵심입니다.",
                image:
                  "https://images.unsplash.com/photo-1520423465871-0866049020b7?q=80&w=2800&auto=format&fit=crop",
                align: "right" as const,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${
                  item.align === "left" ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 space-y-6">
                  <span className="text-xs font-bold tracking-[0.3em] text-gray-400">
                    {item.subtitle}
                  </span>
                  <h3
                    className="text-3xl md:text-4xl font-bold leading-snug whitespace-pre-line text-gray-900"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-lg text-gray-500 leading-relaxed font-light"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {item.desc}
                  </p>
                </div>
                <div className="flex-1 relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-xl shadow-black/5 group">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Artist Showcase ─────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
              Artist showcase
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
              style={{ wordBreak: "keep-all" }}
            >
              이미 활동 중인 작가들
            </h2>
            <p
              className="text-gray-500 mt-4 max-w-lg mx-auto"
              style={{ wordBreak: "keep-all" }}
            >
              실제 모노페이지에서 운영 중인 아티스트 홈페이지를 살펴보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Art Hyun",
                slug: "arthyun",
                desc: "예술로 여는 도시재생 — 공공미술 전문",
                image:
                  "https://images.unsplash.com/photo-1578301978693-85fa9fd0c9c4?q=80&w=800&auto=format&fit=crop",
                domain: "arthyun.co.kr",
                tag: "공공미술",
              },
              {
                name: "Artway Gallery",
                slug: "art-way",
                desc: "부산 동구 문화 예술 공간",
                image:
                  "https://images.unsplash.com/photo-1544413164-5f1b361f5bfa?q=80&w=800&auto=format&fit=crop",
                domain: "monopage.kr/art-way",
                tag: "갤러리",
              },
            ].map((site) => (
              <Link
                key={site.slug}
                href={`/${site.slug}`}
                className="group relative rounded-2xl overflow-hidden ring-1 ring-black/5 hover:ring-black/10 shadow-lg shadow-black/5 hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={site.image}
                    alt={site.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-500/20 text-emerald-200 text-[11px] font-medium rounded-full mb-3 backdrop-blur-sm">
                    {site.tag}
                  </span>
                  <h3 className="text-xl font-bold mb-1 text-white group-hover:text-emerald-200 transition-colors">
                    {site.name}
                  </h3>
                  <p
                    className="text-sm text-white/70"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {site.desc}
                  </p>
                  <p className="text-xs text-white/40 font-mono mt-2">
                    {site.domain}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={14} className="text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA ──────────────────────────────────────── */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-gray-900"
            style={{ wordBreak: "keep-all" }}
          >
            당신만의 예술 세계를
            <br />
            만들어보세요
          </h2>
          <p
            className="text-lg text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed"
            style={{ wordBreak: "keep-all" }}
          >
            3분이면 완성됩니다. 수수료? 당신이 정합니다.
          </p>

          <Link
            href="/create"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white text-lg font-bold rounded-full hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10"
            style={{
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            무료로 시작하기
            <ArrowRight
              size={22}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <p className="text-xs text-gray-400 mt-6">
            가입 후 3분 내 페이지 완성 — 무료로 시작, 가치는 내가 설정
          </p>
        </div>
      </section>

      {/* 플로팅 애니메이션 키프레임 */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
