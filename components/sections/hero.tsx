'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight, ArrowDown } from 'lucide-react';

const stats = [
  { label: '프로젝트', value: '26+' },
  { label: '서비스 중', value: '10+' },
  { label: '기술스택', value: '15+' },
];

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-40 pb-28 md:pt-56 md:pb-40">
      {/* 배경 네온 글로우 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full blur-[200px] opacity-10 bg-[#39FF14]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(57,255,20,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* 배지 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={springTransition}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(57,255,20,0.25)] bg-[rgba(57,255,20,0.08)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#39FF14]"
        >
          <Zap className="h-3.5 w-3.5" />
          아이디어를 실현하는 기술 파트너
        </motion.div>

        {/* 헤드라인 — 더 큰 임팩트 */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ ...springTransition, delay: 0.1 }}
          className="max-w-4xl text-5xl font-black leading-snug tracking-tighter sm:text-6xl md:text-[5.5rem] md:leading-[1.05]"
        >
          성공을 위해
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #39FF14, #00FFAA)" }}
          >
            계발자들과 협업
          </span>
          하세요.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ ...springTransition, delay: 0.2 }}
          className="mt-7 max-w-3xl text-base leading-relaxed text-white/50 break-keep sm:text-lg md:text-xl"
        >
          기획, 개발, 디자인, 마케팅까지 당신의 성공에 광적으로 집착하는
          <br className="hidden sm:block" />
          워커홀릭 전문가 그룹, 계발자들이 당신의 비즈니스에 합류합니다.
        </motion.p>

        {/* CTA 버튼 — 프리미엄 필 + 화살표 서클 래퍼 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ ...springTransition, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-3 rounded-full bg-[#39FF14] px-8 py-4 text-base font-bold text-black transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(57,255,20,0.3)]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            프로젝트 문의하기
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </button>
          <button
            onClick={() => {
              document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-bold backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            소식 보기
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </span>
          </button>
        </motion.div>

        {/* 통계 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...springTransition, delay: 0.5 }}
          className="mt-20 flex flex-wrap gap-12"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.6 + i * 0.1 }}
            >
              <div className="text-4xl font-black text-[#39FF14] md:text-5xl">{s.value}</div>
              <div className="mt-1.5 text-sm text-white/25 tracking-wide">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
