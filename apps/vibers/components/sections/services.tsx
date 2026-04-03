'use client';

import { motion } from 'framer-motion';
import { Globe, Smartphone, Bot, Wrench } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: '웹사이트',
    description: '기획부터 배포까지\n랜딩페이지, 기업 사이트, 쇼핑몰',
    period: '3일 ~ 2주',
    color: '#6C63FF',
    span: 'sm:col-span-2 lg:col-span-1',
  },
  {
    icon: Smartphone,
    title: '앱 개발',
    description: 'iOS / Android\nExpo, React Native, 네이티브',
    period: '2주 ~ 2개월',
    color: '#0EA5E9',
    span: 'sm:col-span-1 lg:col-span-1',
  },
  {
    icon: Bot,
    title: 'AI 서비스',
    description: '챗봇, 자동화, 맞춤 AI\nLLM 통합, 데이터 분석',
    period: '협의',
    color: '#00C896',
    span: 'sm:col-span-1 lg:col-span-1',
  },
  {
    icon: Wrench,
    title: '기술 자문',
    description: 'CTO 유지관리 서비스\n기술 방향 설정, 아키텍처 설계',
    period: '월 50만원~',
    color: '#39FF14',
    span: 'sm:col-span-2 lg:col-span-1',
  },
];

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 lg:py-40 border-t border-[rgba(57,255,20,0.08)]">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mb-14"
        >
          {/* 아이브로우 태그 */}
          <span className="mb-4 inline-block rounded-full bg-[rgba(57,255,20,0.08)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#39FF14]">
            Services
          </span>
          <h2 className="text-4xl font-black leading-snug tracking-tight md:text-5xl">서비스</h2>
          <p className="mt-3 text-white/30 break-keep">
            우리가 할 수 있는 것들
          </p>
        </motion.div>

        {/* 벤토 그리드 레이아웃 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: i * 0.1 }}
              className={service.span}
            >
              {/* 더블 베젤 카드: 아우터 셸 */}
              <div className="h-full rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10 transition-all duration-500 hover:ring-[rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.08)] hover:scale-[1.02] active:scale-[0.98]"
                   style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                {/* 이너 코어 */}
                <div className="group h-full rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] p-6 transition-all duration-500 hover:bg-[rgba(255,255,255,0.06)]"
                     style={{
                       boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)',
                       transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                     }}>
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${service.color}15`, color: service.color }}
                  >
                    <service.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">{service.title}</h3>

                  <p className="mt-2 text-sm text-white/40 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>

                  <div className="mt-5 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-[#39FF14]">
                    {service.period}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
