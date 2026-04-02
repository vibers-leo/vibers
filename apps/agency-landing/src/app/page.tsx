"use client";

import { themes } from "@/lib/themes";
import VibersBanner from "@/components/VibersBanner";
import Link from "next/link";
import { motion } from "framer-motion";

const typeLabels: Record<string, string> = {
  Professional: "프로페셔널",
  Creative: "크리에이티브",
  Minimal: "미니멀",
  Bold: "임팩트",
  Elegant: "엘레강스",
};

const fontLabels: Record<string, string> = {
  sans: "산세리프",
  serif: "세리프",
  mono: "모노스페이스",
};

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#09090b] text-neutral-100">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        {/* 메시 그래디언트 배경 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[10%] h-[600px] w-[600px] rounded-full bg-emerald-500/8 blur-[120px]" />
          <div className="absolute top-[10%] right-[5%] h-[400px] w-[400px] rounded-full bg-teal-400/5 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[40%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 네비게이션 */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                <span className="text-sm font-bold text-black">A</span>
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">
                Agency Landing
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-neutral-500">
                30가지 테마 쇼케이스
              </span>
            </div>
          </nav>

          {/* 히어로 콘텐츠 */}
          <div className="pb-20 pt-16 sm:pb-28 sm:pt-24 md:pb-36 md:pt-32">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">
                  프리랜서 마케터를 위한 디자인 솔루션
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl" style={{ textWrap: "balance" }}>
                마케팅 대행사를 위한
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  30가지 디자인 테마
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg md:text-xl">
                컬러, 폰트, 레이아웃이 최적화된
                프리미엄 랜딩 페이지 디자인을 미리보고 선택하세요.
                클릭 한 번으로 원하는 컨셉을 확인할 수 있습니다.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#themes"
                  className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
                >
                  테마 둘러보기
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>
                <span className="text-sm text-neutral-500">
                  5가지 스타일 · 6가지 컬러 · 3가지 폰트
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 하단 디바이더 */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </section>

      {/* 스타일 요약 스트립 */}
      <section className="border-b border-neutral-800/50 bg-[#09090b]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-px sm:grid-cols-5">
            {(["Bold", "Professional", "Minimal", "Creative", "Elegant"] as const).map(
              (type, i) => (
                <div
                  key={type}
                  className="flex flex-col items-center gap-1 py-6 text-center"
                >
                  <span className="text-2xl font-bold tabular-nums text-white">
                    {themes.filter((t) => t.type === type).length}
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    {typeLabels[type]}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* 테마 그리드 */}
      <section id="themes" className="scroll-mt-8 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-16"
          >
            <h2
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
              style={{ textWrap: "balance" }}
            >
              모든 테마 컬렉션
            </h2>
            <p className="mt-3 max-w-xl text-neutral-500">
              각 카드를 클릭하면 해당 디자인의 풀 페이지 프리뷰를 확인할 수 있습니다.
            </p>
          </motion.div>

          {/* 그리드 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
            {themes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.4,
                  delay: (index % 8) * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={`/design/${theme.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800/60 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5"
                >
                  {/* 프리뷰 헤더 */}
                  <div
                    className="relative h-36 w-full overflow-hidden p-4"
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    {/* 미니 UI 프리뷰 */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="h-2 w-2 rounded-full opacity-60"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="h-2 w-2 rounded-full opacity-40"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>

                    {/* 가상 콘텐츠 라인 */}
                    <div className="space-y-2">
                      <div
                        className="h-2.5 w-3/5 rounded-sm"
                        style={{
                          backgroundColor: theme.colors.foreground,
                          opacity: 0.8,
                        }}
                      />
                      <div
                        className="h-1.5 w-4/5 rounded-sm"
                        style={{
                          backgroundColor: theme.colors.mutedForeground,
                          opacity: 0.4,
                        }}
                      />
                      <div
                        className="h-1.5 w-2/3 rounded-sm"
                        style={{
                          backgroundColor: theme.colors.mutedForeground,
                          opacity: 0.3,
                        }}
                      />
                    </div>

                    {/* CTA 미니 버튼 */}
                    <div
                      className="absolute bottom-3 right-3 rounded px-3 py-1 text-[10px] font-bold"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                        borderRadius: theme.shape.radius === "9999px" ? "9999px" : theme.shape.radius,
                      }}
                    >
                      CTA
                    </div>
                  </div>

                  {/* 테마 정보 */}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                        {typeLabels[theme.type] || theme.type}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-neutral-600">
                        #{String(theme.id).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-[15px] font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-emerald-400">
                      {theme.name}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-1">
                      {/* 컬러 팔레트 */}
                      <div className="flex -space-x-1">
                        {[
                          theme.colors.primary,
                          theme.colors.secondary,
                          theme.colors.accent,
                          theme.colors.background,
                        ].map((color, ci) => (
                          <div
                            key={ci}
                            className="h-4 w-4 rounded-full border-2 border-neutral-900"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      {/* 폰트 & 라디우스 */}
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                        <span>{fontLabels[theme.typography.font]}</span>
                        <span className="text-neutral-700">·</span>
                        <span>R:{theme.shape.radius}</span>
                      </div>
                    </div>
                  </div>

                  {/* 호버 시 화살표 */}
                  <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="relative overflow-hidden border-t border-neutral-800/50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-[20%] h-[400px] w-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
                style={{ textWrap: "balance" }}
              >
                마음에 드는 디자인을 찾으셨나요?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base text-neutral-400 sm:text-lg">
                테마를 선택하고 바로 적용하세요.
                모든 디자인은 커스터마이징 가능합니다.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#themes"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  테마 선택하기
                </a>
                <a
                  href="#themes"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-neutral-500 hover:bg-neutral-800/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  다시 둘러보기
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vibers 크로스 프로모션 */}
      <div className="flex justify-center py-8">
        <VibersBanner size="leaderboard" currentProject="agency-landing" />
      </div>

      {/* 푸터 */}
      <footer className="border-t border-neutral-800/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500">
                <span className="text-[10px] font-bold text-black">A</span>
              </div>
              <span className="text-xs font-medium text-neutral-500">
                Agency Landing · 계발자들
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/privacy" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                개인정보처리방침
              </Link>
              <span className="text-neutral-700">|</span>
              <Link href="/terms" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                이용약관
              </Link>
            </div>
            <span className="text-xs text-neutral-600">
              © {new Date().getFullYear()} Vibers. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
