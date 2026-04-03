'use client';

import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const managementPlans = [
  {
    name: 'Part-time',
    sub: '주 15시간 · 필요할 때 옆에',
    price: '80',
    credit: '96만',
    description: '전문 계발자를 파트타임으로\n활용하고 싶은 비즈니스',
    features: [
      '매월 96만 크레딧 지급',
      '주 15시간 내외 작업',
      '전담 매니저 배정',
      '기술 방향성 검토',
    ],
    recommended: false,
    color: '#888',
    cta: 'contact',
  },
  {
    name: 'Full-time',
    sub: '9 to 6 · 주 40시간 전담',
    price: '210',
    credit: '252만',
    description: '전담 계발자가 상주하는 것처럼\n실행력이 필요한 초기 스타트업',
    features: [
      '매월 252만 크레딧 지급',
      '주 40시간 풀타임 대응',
      '기획/디자인/개발 통합 지원',
      '정기 기술 보고서',
    ],
    recommended: true,
    color: '#39FF14',
    cta: 'contact',
  },
  {
    name: 'Leader',
    sub: '팀장급 전문가, 그런데 야근을 곁들인',
    price: '350',
    credit: '420만',
    description: '매니징과 실무가 동시에\n필요한 성장 궤도의 팀',
    features: [
      '매월 420만 크레딧 지급',
      '주간 화상 미팅',
      '서비스 고도화 전략',
      '협업 도구 최적화',
    ],
    recommended: false,
    color: '#A78BFA',
    cta: 'contact',
  },
  {
    name: 'CTO / Executive',
    sub: '최고 기술 경영자',
    price: '500+',
    credit: '600만+',
    description: '사업 전체의 기술 설계 및\n컨설팅 파트너가 필요한 기업',
    features: [
      '매월 600만+ 크레딧 지급',
      '24/7 핫라인 대응',
      '기술 실사 및 채용 지원',
      '사업 및 세무/법무 연계',
    ],
    recommended: false,
    color: '#FFD700',
    cta: 'contact',
  },
];

const singleProjects = [
  { name: '인프라 구축 자문', price: '50만원~' },
  { name: 'Web 구축', price: '100만원~' },
  { name: 'App 구축', price: '500만원~' },
];

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 lg:py-40 border-t border-[rgba(57,255,20,0.08)]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mb-14"
        >
          <span className="mb-4 inline-block rounded-full bg-[rgba(57,255,20,0.08)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#39FF14]">
            Pricing
          </span>
          <h2 className="text-4xl font-black leading-snug tracking-tight md:text-5xl">가격</h2>
          <p className="mt-3 text-white/30 break-keep">
            월 관리비부터 단건 의뢰까지
          </p>
        </motion.div>

        {/* 유지관리 서비스 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2 leading-snug">
            협업 플랜
          </h3>
          <p className="text-sm text-white/40 mb-8">
            사장님의 기술 파트너 — 협업 시작 후 매주 계획서/보고서 송부 공통
          </p>
        </div>

        {/* 3열 프리미엄 카드 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {managementPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: i * 0.1 }}
            >
              {/* 더블 베젤: 아우터 셸 */}
              <div className={`relative h-full rounded-[2rem] p-1.5 ring-1 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${
                plan.recommended
                  ? 'bg-[rgba(57,255,20,0.08)] ring-[rgba(57,255,20,0.4)] shadow-[0_0_60px_rgba(57,255,20,0.15)] md:scale-[1.03] md:hover:scale-[1.05]'
                  : 'bg-white/5 ring-white/10 hover:ring-[rgba(57,255,20,0.2)] hover:shadow-[0_0_40px_rgba(57,255,20,0.06)]'
              }`}
                   style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>

                {/* 추천 배지 */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-8 z-10 inline-flex items-center gap-1 rounded-full bg-[#39FF14] px-3 py-1 text-xs font-bold text-black shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                    <Star className="h-3 w-3" /> 추천
                  </div>
                )}

                {/* 이너 코어 */}
                <div className="h-full rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] p-6 transition-all duration-500 hover:bg-[rgba(255,255,255,0.05)]"
                     style={{
                       boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)',
                       transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                     }}>
                  <h4
                    className="text-2xl font-black leading-snug"
                    style={{ color: plan.color }}
                  >
                    {plan.name}
                  </h4>
                  <p className="text-xs font-medium text-white/40 mt-1">{plan.sub}</p>

                  <div className="mt-4">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="ml-1 text-sm text-white/40">만원/월</span>
                  </div>

                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Benefits</span>
                    <span className="text-sm font-bold text-[#39FF14]">{plan.credit} Credit</span>
                  </div>

                  <p className="mt-4 text-xs text-white/30 whitespace-pre-line leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mt-6 space-y-2.5">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2.5 text-sm text-white/50"
                      >
                        <Check className="h-3.5 w-3.5 text-[#39FF14] shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {plan.cta === 'signup' ? (
                    <Link
                      href="/signup"
                      className={`group mt-7 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold transition-all duration-500 ${
                        plan.recommended
                          ? 'bg-[#39FF14] text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                          : 'border border-white/15 bg-white/5 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                      시작하기
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${plan.recommended ? 'bg-black/10' : 'bg-white/10'}`}>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`group mt-7 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold transition-all duration-500 ${
                        plan.recommended
                          ? 'bg-[#39FF14] text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                          : 'border border-white/15 bg-white/5 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                      문의하기
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${plan.recommended ? 'bg-black/10' : 'bg-white/10'}`}>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-5 text-xs text-white/25">
          * 매월 결제액의 1.2배 크레딧이 지급되며, 크레딧은 한도 없이 매월 이월됩니다.<br />
          * 언제든 원하실 때 협업을 종료할 수 있습니다.
        </p>

        {/* 단건 의뢰 — 더블 베젤 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mt-16"
        >
          <div className="rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] p-8"
                 style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)' }}>
              <h3 className="text-xl font-bold mb-6 leading-snug">단건 의뢰</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {singleProjects.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border-b border-white/5 pb-4 sm:border-0 sm:pb-0 sm:flex-col sm:items-start sm:gap-2"
                  >
                    <span className="text-white/60 text-sm">{item.name}</span>
                    <span className="font-bold text-white text-lg">{item.price}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-white/25">
                * 규모/복잡도에 따라 변동 가능
              </p>
              <button
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-4 text-sm font-bold transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                프로젝트 문의하기
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
