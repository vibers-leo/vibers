'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { feedItems, typeLabel, getClient, type FeedItem } from '@/lib/feed-data';
import NewsModal from '@/components/news-modal';
import OgImage from '@/components/og-image';

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
  const [selected, setSelected] = useState<FeedItem | null>(null);
  const visible = showAll ? feedItems : feedItems.slice(0, INITIAL_COUNT);

  return (
    <>
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
              계발자들의 협업 사례와 최신 소식 — 눌러서 자세히 보기
            </p>
          </motion.div>

          {/* 피드 그리드 — masonry */}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {visible.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ ...springTransition, delay: i * 0.06 }}
                className="mb-4 break-inside-avoid"
              >
                <button
                  onClick={() => setSelected(item)}
                  className={`group relative w-full text-left rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10 transition-all duration-500 hover:ring-[rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.08)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${minHeightMap[item.size]}`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="h-full rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] flex flex-col overflow-hidden"
                       style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)' }}>
                    {/* OG 이미지 — url 있는 카드만 */}
                    {item.url && (
                      <div className="relative w-full h-36 shrink-0 overflow-hidden">
                        <OgImage url={item.url} color={item.color} alt={item.title} />
                        {/* 하단 페이드 */}
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[rgba(15,15,15,0.9)] to-transparent" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                    {/* 상단 컬러 바 — 이미지 없을 때만 */}
                    {!item.url && (
                      <div
                        className="mb-4 h-1 w-10 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    )}

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
                    <h3 className="text-base font-bold text-white leading-snug transition-colors duration-500 group-hover:text-[#39FF14] break-keep"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                      {item.title}
                    </h3>

                    {/* 클라이언트 */}
                    {(() => {
                      const c = getClient(item.clientId);
                      return c ? (
                        <p className="mt-1 text-xs text-white/30">
                          {c.name}
                          <span className="ml-1.5 opacity-50">
                            {c.type === 'internal' ? '· 자체' : '· 고객사'}
                          </span>
                        </p>
                      ) : null;
                    })()}

                    {/* 본문 */}
                    <p className="mt-3 text-sm text-white/40 leading-relaxed flex-1 break-keep">
                      {item.body}
                    </p>

                    {/* 태그 + 더보기 힌트 */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-white/20">{item.tag}</span>
                      <span className="text-[11px] text-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        자세히 →
                      </span>
                    </div>
                    </div>{/* p-6 wrapper 닫기 */}
                  </div>
                </button>
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

      {/* 뉴스 모달 */}
      <NewsModal
        selected={selected}
        onSelect={setSelected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
