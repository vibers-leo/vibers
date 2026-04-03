import type { Metadata } from "next";
import Nav from "@/components/nav";
import { Smartphone, Terminal, Code2, Zap, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "바이버스 앱 | 어디서든 코딩하다",
  description: "스마트폰으로 로컬 개발 환경을 제어하는 AI 코딩 작업실. 바이버스로 어디서든 코딩하세요.",
};

const features = [
  {
    icon: Smartphone,
    title: "모바일에서 터미널 실행",
    desc: "스마트폰으로 로컬 PC의 터미널 명령을 실행합니다. SSH 없이, 앱 하나로.",
  },
  {
    icon: Code2,
    title: "VSCode 실시간 동기화",
    desc: "모바일과 VSCode가 WebSocket으로 연결됩니다. 어디서든 코드를 보고 수정할 수 있습니다.",
  },
  {
    icon: Zap,
    title: "AI 코드 제안",
    desc: "AI가 현재 작업 컨텍스트를 이해하고 코드를 제안합니다. 바이브코딩의 시작.",
  },
  {
    icon: Terminal,
    title: "데스크톱 에이전트",
    desc: "백그라운드에서 동작하는 경량 에이전트가 모바일과 PC를 연결합니다. 포트 3456.",
  },
];

const ecosystem = [
  { name: "vibers-mobile", desc: "Expo (React Native) 모바일 앱", status: "개발 중" },
  { name: "vibers-desktop-agent", desc: "Node.js + Socket.io (포트 3456)", status: "안정" },
  { name: "vibers-relay-server", desc: "WebSocket 릴레이 (포트 3457)", status: "안정" },
  { name: "vibers-vscode-extension", desc: "VSCode 실시간 동기화 익스텐션", status: "개발 중" },
  { name: "vibers-telegram-bot", desc: "텔레그램 통합 봇", status: "개발 중" },
];

export default function AppPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-28 md:pt-56 md:pb-40">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full blur-[180px] opacity-15 bg-[#39FF14]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(57,255,20,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(57,255,20,0.25)] bg-[rgba(57,255,20,0.08)] px-4 py-1.5 text-sm font-semibold text-[#39FF14]">
            <Zap className="h-4 w-4" />
            by 주식회사디랩 · app.vibers.co.kr
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.1] tracking-tighter md:text-8xl mb-6">
            어디서든{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #39FF14, #00FFAA)" }}>
              코딩하다.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-[#888] leading-relaxed mb-10">
            바이버스(Vibers)는 스마트폰으로 로컬 개발 환경을 제어하는 AI 코딩 작업실입니다.
            터미널 실행, VSCode 동기화, AI 코드 제안 — 이제 책상 앞이 아니어도 됩니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 rounded-full bg-[#39FF14] px-8 py-3.5 text-base font-bold text-black transition-all hover:opacity-90 hover:scale-105"
            >
              얼리 액세스 신청 <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/juuuno-coder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-bold transition-all hover:bg-white/10"
            >
              <Github className="h-5 w-5" />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black md:text-5xl mb-3">주요 기능</h2>
            <p className="text-[#666]">모바일과 데스크톱을 연결하는 4가지 핵심</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[rgba(57,255,20,0.15)] bg-[rgba(57,255,20,0.04)] p-7"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#39FF14] text-black">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 생태계 */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-black md:text-3xl mb-2">바이버스 생태계</h2>
            <p className="text-[#666] text-sm">5개 컴포넌트가 유기적으로 연결</p>
          </div>
          <div className="space-y-3">
            {ecosystem.map((e) => (
              <div
                key={e.name}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4"
              >
                <div>
                  <span className="font-mono text-sm font-bold text-[#39FF14]">{e.name}</span>
                  <span className="ml-3 text-sm text-[#666]">{e.desc}</span>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{
                    color: e.status === "안정" ? "#39FF14" : "#6C63FF",
                    backgroundColor: e.status === "안정" ? "rgba(57,255,20,0.1)" : "rgba(108,99,255,0.1)",
                  }}
                >
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 얼리액세스 신청 */}
      <section id="waitlist" className="py-20 border-t border-[rgba(57,255,20,0.08)]">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-black md:text-5xl mb-4">베타 테스터 모집 중</h2>
          <p className="text-[#888] mb-10 leading-relaxed">
            바이버스 베타 버전에 먼저 참여할 수 있습니다.
            얼리 액세스 신청 또는 피드백을 보내주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@dlab.co.kr"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 font-bold transition-all hover:bg-white/10"
            >
              이메일 신청
            </a>
            <Link
              href="/projects/vibers"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#39FF14] px-8 py-4 font-bold text-black transition-all hover:opacity-90"
            >
              프로젝트 상세 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-white/5 py-10 text-center">
        <p className="text-sm text-[#333]">
          © 2026 주식회사디랩 (D.Lab Corp) · 바이버스(Vibers)
        </p>
      </footer>
    </div>
  );
}
