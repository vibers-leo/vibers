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
            계발자들?
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

        {/* KBS 뉴스 유튜브 임베드 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ ...springTransition, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-5">
            {/* 영상 — 60% */}
            <div className="w-full sm:w-[60%] rounded-2xl overflow-hidden ring-1 ring-white/10 shrink-0">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/duPaK-uxC7o?start=7"
                  title="KBS 뉴스 — AI가 사무실을 바꾼다, 기발자의 등장"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* 텍스트 — 40% */}
            <a
              href="https://news.kbs.co.kr/news/pc/view/view.do?ncd=8520973"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 flex flex-col justify-between rounded-2xl ring-1 ring-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:ring-[rgba(57,255,20,0.25)] hover:bg-white/[0.05]"
            >
              {/* 출처 */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(57,255,20,0.08)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#39FF14]">
                  📺 KBS 뉴스
                </span>
                <span className="text-[11px] text-white/25">박대기 기자</span>
              </div>

              {/* 제목 */}
              <p className="text-base font-bold text-white/80 break-keep leading-snug mb-4">
                AI가 사무실을 바꾼다<br />— '기발자'의 등장
              </p>

              {/* 인용 1 */}
              <p className="text-sm text-white/45 leading-relaxed break-keep mb-3">
                <span className="text-[#39FF14] font-black text-lg mr-0.5">"</span>
                기획과 개발을 같이 한다고 해서 <span className="text-white/70 font-semibold">'기발자'</span>라고 부릅니다.
                아예 기획자·개발자·디자이너 세 가지 일을 한 명이 하는 경우도 생겼습니다.
                <span className="text-[#39FF14] font-black text-lg ml-0.5">"</span>
              </p>

              {/* 인용 2 */}
              <p className="text-sm text-white/35 leading-relaxed break-keep mb-5">
                <span className="text-[#39FF14] font-black text-lg mr-0.5">"</span>
                예전 같으면 분리돼서 작업을 했었다면 이제는 한 AI 공간에서 저희가 같이 작업을 하고 있습니다.
                <span className="text-[#39FF14] font-black text-lg ml-0.5">"</span>
              </p>

              {/* 클릭 유도 */}
              <div className="flex items-center gap-1.5 text-xs text-white/20 group-hover:text-[#39FF14] transition-colors mt-auto">
                <ExternalLink className="w-3 h-3" />
                기사 원문 보기
              </div>
            </a>
          </div>
        </motion.div>

        {/* 마무리 문구 */}
        <motion.p
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ ...springTransition, delay: 0.15 }}
          className="mt-8 text-right text-base font-semibold text-white/60"
        >
          우리는 이미 계발자들로 활동하고 있습니다.
        </motion.p>
      </div>
    </section>
  );
}
