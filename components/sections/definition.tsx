'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Palette, Code2, Megaphone, ExternalLink } from 'lucide-react';

const capabilities = [
  {
    icon: Lightbulb,
    label: '기획',
    desc: '아이디어를 구조화하고\n실현 경로를 설계한다',
    color: '#FFD700',
  },
  {
    icon: Palette,
    label: '디자인',
    desc: '사용자 경험과 브랜드\n아이덴티티를 시각화한다',
    color: '#A78BFA',
  },
  {
    icon: Code2,
    label: '개발',
    desc: '아이디어를 실제로 동작하는\n서비스로 만들어낸다',
    color: '#39FF14',
  },
  {
    icon: Megaphone,
    label: '마케팅',
    desc: '서비스가 고객에게\n닿을 수 있도록 퍼뜨린다',
    color: '#00FFAA',
  },
];

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export default function DefinitionSection() {
  return (
    <section className="py-24 md:py-32 lg:py-40 border-t border-[rgba(57,255,20,0.08)]">
      <div className="mx-auto max-w-7xl px-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mb-14"
        >
          <span className="mb-4 inline-block rounded-full bg-[rgba(57,255,20,0.08)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#39FF14]">
            Definition
          </span>
          <h2 className="text-4xl font-black leading-snug tracking-tight md:text-5xl">
            계발자란?
          </h2>
          <p className="mt-3 max-w-xl text-white/30 break-keep leading-relaxed">
            디자인 · 마케팅 · 개발 · 기획,
            네 가지 역량을 하나의 몸으로 실행하는 사람.
            <br />
            아이디어를 스스로 만들고, 팔고, 운영하는 실행력의 단위.
          </p>
        </motion.div>

        {/* 4개 역량 카드 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ ...springTransition, delay: i * 0.08 }}
              >
                <div className="h-full rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10 transition-all duration-500 hover:ring-[rgba(57,255,20,0.25)] hover:shadow-[0_0_40px_rgba(57,255,20,0.06)] hover:scale-[1.02] active:scale-[0.98]"
                     style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div className="h-full rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] p-6"
                       style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)' }}>
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${cap.color}18` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: cap.color }} />
                    </div>
                    <h3 className="text-xl font-black" style={{ color: cap.color }}>
                      {cap.label}
                    </h3>
                    <p className="mt-2 text-sm text-white/35 whitespace-pre-line leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* KBS 기사 스크랩 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ ...springTransition, delay: 0.3 }}
        >
          <a
            href="https://news.kbs.co.kr/news/pc/view/view.do?ncd=8520973"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10 transition-all duration-500 hover:ring-[rgba(57,255,20,0.25)] hover:shadow-[0_0_40px_rgba(57,255,20,0.06)]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] p-6 sm:p-8"
                 style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)' }}>
              <div className="flex items-start gap-6">
                {/* 수직 컬러 바 */}
                <div className="hidden sm:block w-1 self-stretch rounded-full bg-[#39FF14] shrink-0 opacity-60" />

                <div className="flex-1 min-w-0">
                  {/* 출처 뱃지 */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(57,255,20,0.08)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#39FF14]">
                      📰 KBS 뉴스
                    </span>
                    <span className="text-[11px] text-white/25">미디어 스크랩 · 박대기 기자</span>
                  </div>

                  {/* 기사 제목 */}
                  <p className="text-xs font-semibold text-white/40 mb-3 break-keep">
                    AI가 사무실을 바꾼다 — '기발자'의 등장
                  </p>

                  {/* 인용구 */}
                  <p className="text-base sm:text-lg font-medium text-white/70 leading-relaxed break-keep">
                    <span className="text-[#39FF14] text-2xl font-black leading-none mr-1">"</span>
                    기획과 개발을 같이 한다고 해서 <span className="text-white/90 font-bold">'기발자'</span>라고 부릅니다.
                    아예 기획자·개발자·디자이너 세 가지 일을 한 명이 하는 경우도 생겼습니다.
                    <span className="text-[#39FF14] text-2xl font-black leading-none ml-1">"</span>
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-white/25">
                      KBS 뉴스 · 원문 기사 보기
                    </p>
                    <ExternalLink className="h-4 w-4 text-white/20 transition-colors duration-300 group-hover:text-[#39FF14]" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
