'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronDown } from 'lucide-react';

type FeedType = 'launch' | 'update' | 'insight' | 'collab';

interface FeedItem {
  type: FeedType;
  title: string;
  brand?: string;
  date: string;
  body: string;
  tag: string;
  url?: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
}

const typeLabel: Record<FeedType, string> = {
  launch: '런칭',
  update: '업데이트',
  insight: '인사이트',
  collab: '협업',
};

const feedItems: FeedItem[] = [
  {
    type: 'launch',
    title: '올루올루 프랜차이즈 사이트 오픈',
    brand: '팬이지 (FanEasy)',
    date: '2025.11',
    body: '올루올루 브랜드의 프랜차이즈 전용 마케팅 웹사이트를 구축했습니다. 가맹 문의부터 브랜드 소개까지 한 페이지에 담았습니다.',
    tag: '#웹사이트 #프랜차이즈',
    url: 'https://oluolu.faneasy.kr',
    color: '#6C63FF',
    size: 'md',
  },
  {
    type: 'insight',
    title: '왜 지금 계발자가 필요한가',
    date: '2026.01',
    body: '아이디어는 있는데 팀이 없다? 기획자, 디자이너, 개발자, 마케터를 각각 구하는 대신, 네 역할을 동시에 수행할 수 있는 계발자와 협업하는 것이 더 빠르고 효율적인 이유.',
    tag: '#인사이트 #계발자',
    color: '#39FF14',
    size: 'lg',
  },
  {
    type: 'launch',
    title: '야화혼술바 홈페이지 오픈',
    brand: '팬이지 (FanEasy)',
    date: '2025.10',
    body: '프리미엄 혼술바 프랜차이즈 야화의 브랜드 웹사이트. 감성적인 비주얼과 가맹 안내 구조를 함께 설계했습니다.',
    tag: '#웹사이트 #F&B',
    url: 'https://yahwa.faneasy.kr',
    color: '#C5A55A',
    size: 'sm',
  },
  {
    type: 'launch',
    title: '메이트체크 — AI 궁합 분석 앱 출시',
    brand: '위로 (Wero)',
    date: '2025.09',
    body: 'AI가 두 사람의 성향을 분석해 궁합을 알려주는 서비스. 기획부터 디자인, 개발, 앱스토어 출시까지 계발자들이 함께했습니다.',
    tag: '#앱 #AI #위로',
    color: '#E94560',
    size: 'md',
  },
  {
    type: 'collab',
    title: 'Vibers 어드민킷 v1 릴리즈',
    brand: '계발자들 (Vibers)',
    date: '2026.03',
    body: '모든 협업 프로젝트의 기술 스택·상태를 중앙 어드민에서 실시간으로 모니터링할 수 있는 @vibers/admin-kit 패키지를 공개했습니다.',
    tag: '#기술 #오픈소스',
    color: '#00FFAA',
    size: 'sm',
  },
  {
    type: 'launch',
    title: '누수체크 서비스 오픈',
    brand: '누수체크',
    date: '2025.08',
    body: '누수 탐지·진단·수리 전문 플랫폼. 서비스 신청부터 전문가 매칭, 사후관리까지 원스톱으로 처리할 수 있는 구조로 기획했습니다.',
    tag: '#서비스사이트 #B2C',
    url: 'https://nusucheck.co.kr',
    color: '#0EA5E9',
    size: 'md',
  },
  {
    type: 'launch',
    title: '러너스커넥트 베타 런칭',
    brand: '디어스 (DUS)',
    date: '2025.07',
    body: '같은 페이스, 같은 목표의 러닝 크루를 매칭해주는 커뮤니티 플랫폼. 위치 기반 크루 탐색과 정기 런닝 일정 관리 기능을 구현했습니다.',
    tag: '#커뮤니티 #스포츠',
    color: '#00C896',
    size: 'sm',
  },
  {
    type: 'launch',
    title: '가보자고 — 모바일 초대장 메이커',
    brand: '디어스 (DUS)',
    date: '2025.06',
    body: '5분 만에 생일파티, 모임, 이벤트 초대장을 만들고 공유하는 모바일 앱. 감각적인 템플릿과 쉬운 편집 UX가 핵심이었습니다.',
    tag: '#앱 #이벤트',
    color: '#FFD700',
    size: 'md',
  },
  {
    type: 'insight',
    title: '빠른 실행이 완벽한 기획을 이긴다',
    date: '2026.02',
    body: '계발자들이 일하는 방식 — 기획 2일, 디자인 3일, 개발 1주. 린하게 만들고 시장 반응을 먼저 확인하는 것이 수개월의 준비보다 값지다.',
    tag: '#인사이트 #린스타트업',
    color: '#A78BFA',
    size: 'lg',
  },
  {
    type: 'update',
    title: 'FanEasy — 다중 브랜드 관리 기능 업데이트',
    brand: '팬이지 (FanEasy)',
    date: '2026.03',
    body: '하나의 대시보드에서 여러 프랜차이즈 브랜드를 동시에 관리할 수 있도록 플랫폼을 고도화했습니다.',
    tag: '#업데이트 #SaaS',
    color: '#6C63FF',
    size: 'sm',
  },
];

const INITIAL_COUNT = 6;

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

const minHeightMap = {
  sm: 'min-h-[160px]',
  md: 'min-h-[220px]',
  lg: 'min-h-[280px]',
};

export default function PortfolioSection() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? feedItems : feedItems.slice(0, INITIAL_COUNT);

  return (
    <section id="news" className="py-24 md:py-32 lg:py-40 border-t border-[rgba(57,255,20,0.08)]">
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
            News
          </span>
          <h2 className="text-4xl font-black leading-snug tracking-tight md:text-5xl">소식</h2>
          <p className="mt-3 text-white/30 break-keep">
            계발자들의 협업 사례와 최신 소식
          </p>
        </motion.div>

        {/* 피드 그리드 — masonry */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {visible.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ ...springTransition, delay: i * 0.06 }}
              className="mb-4 break-inside-avoid"
            >
              <div className={`group relative rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10 transition-all duration-500 hover:ring-[rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.08)] hover:scale-[1.02] active:scale-[0.98] ${minHeightMap[item.size]}`}
                   style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <div className="h-full rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] p-6 flex flex-col"
                     style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)' }}>
                  {/* 상단 컬러 바 */}
                  <div
                    className="mb-4 h-1 w-10 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />

                  {/* 타입 뱃지 + 날짜 */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
                      style={{
                        color: item.color,
                        backgroundColor: `${item.color}15`,
                      }}
                    >
                      {typeLabel[item.type]}
                    </span>
                    <span className="text-[11px] text-white/25">{item.date}</span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-base font-bold text-white leading-snug transition-colors duration-500 group-hover:text-[#39FF14]"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {item.title}
                  </h3>

                  {/* 브랜드 */}
                  {item.brand && (
                    <p className="mt-1 text-xs text-white/30">by {item.brand}</p>
                  )}

                  {/* 본문 */}
                  <p className="mt-3 text-sm text-white/40 leading-relaxed flex-1">
                    {item.body}
                  </p>

                  {/* 태그 + 링크 */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-white/20">{item.tag}</span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 inline-flex items-center gap-1 text-xs text-[#39FF14]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        방문 <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 더 보기 */}
        {!showAll && feedItems.length > INITIAL_COUNT && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-bold transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              더 보기 ({feedItems.length - INITIAL_COUNT}개)
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
