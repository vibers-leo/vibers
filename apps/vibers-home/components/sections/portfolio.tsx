'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PortfolioItem {
  name: string;
  brand: string;
  category: string;
  tagline: string;
  url?: string;
  color: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    name: '올루올루 홈페이지',
    brand: '팬이지 (FanEasy)',
    category: '웹사이트',
    tagline: '프랜차이즈 마케팅 사이트',
    url: 'https://oluolu.faneasy.kr',
    color: '#6C63FF',
  },
  {
    name: '야화혼술바 홈페이지',
    brand: '팬이지 (FanEasy)',
    category: '웹사이트',
    tagline: '프리미엄 혼술바 프랜차이즈',
    url: 'https://yahwa.faneasy.kr',
    color: '#C5A55A',
  },
  {
    name: '메이트체크',
    brand: '위로 (Wero)',
    category: '앱 서비스',
    tagline: 'AI 궁합 분석 서비스',
    color: '#E94560',
  },
  {
    name: '누수체크',
    brand: '누수체크',
    category: '서비스 사이트',
    tagline: '누수 탐지·진단·수리 전문',
    url: 'https://nusucheck.co.kr',
    color: '#0EA5E9',
  },
  {
    name: '러너스커넥트',
    brand: '디어스 (DUS)',
    category: '커뮤니티',
    tagline: '러닝 크루 매칭 플랫폼',
    color: '#00C896',
  },
  {
    name: '가보자고',
    brand: '디어스 (DUS)',
    category: '모바일 초대장',
    tagline: '5분 만에 만드는 모바일 초대장',
    color: '#FFD700',
  },
];

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 md:py-32 lg:py-40 border-t border-[rgba(57,255,20,0.08)]">
      <div className="mx-auto max-w-6xl px-6">
        {/* 헤더 */}
        <div className="mb-14 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={springTransition}
          >
            <span className="mb-4 inline-block rounded-full bg-[rgba(57,255,20,0.08)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#39FF14]">
              Portfolio
            </span>
            <h2 className="text-4xl font-black leading-snug tracking-tight md:text-5xl">포트폴리오</h2>
            <p className="mt-3 text-white/30 break-keep">
              계발자들이 만든 실제 서비스들
            </p>
          </motion.div>
          <Link
            href="/projects"
            className="group hidden sm:flex items-center gap-2 text-sm text-[#39FF14] transition-all duration-500 hover:opacity-80"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            전체 보기
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(57,255,20,0.1)]">
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        {/* 메이슨리 스타일 그리드 — 교차 높이 */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {portfolioItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: i * 0.08 }}
              className="mb-4 break-inside-avoid"
            >
              {/* 더블 베젤 카드: 아우터 셸 */}
              <div className="rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10 transition-all duration-500 hover:ring-[rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.08)] hover:scale-[1.02] active:scale-[0.98]"
                   style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                {/* 이너 코어 */}
                <div className="group relative rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] p-6 transition-all duration-500 hover:bg-[rgba(255,255,255,0.06)]"
                     style={{
                       boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)',
                       transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                     }}>
                  {/* 상단 컬러 바 */}
                  <div
                    className="mb-5 h-1 w-12 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  {/* 카테고리 태그 */}
                  <span className="text-[11px] font-medium text-white/25 uppercase tracking-[0.12em]">
                    #{item.category}
                  </span>

                  {/* 프로젝트명 */}
                  <h3 className="mt-2 text-lg font-bold text-white leading-snug transition-colors duration-500 group-hover:text-[#39FF14]"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {item.name}
                  </h3>

                  {/* 브랜드 */}
                  <p className="mt-1 text-sm text-white/30">
                    by {item.brand}
                  </p>

                  {/* 설명 */}
                  <p className="mt-3 text-sm text-white/40 leading-relaxed">
                    {item.tagline}
                  </p>

                  {/* 링크 */}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#39FF14] opacity-0 transition-all duration-500 group-hover:opacity-100"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                      방문하기 <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 모바일 전체보기 */}
        <div className="mt-8 sm:hidden text-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-[#39FF14]"
          >
            전체 보기
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(57,255,20,0.1)]">
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
