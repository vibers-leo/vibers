'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Globe } from 'lucide-react';
import { getClient, getClientFeed, typeLabel, type FeedItem } from '@/lib/feed-data';

interface NewsModalProps {
  selected: FeedItem | null;
  onSelect: (item: FeedItem) => void;
  onClose: () => void;
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export default function NewsModal({ selected, onSelect, onClose }: NewsModalProps) {
  const detailRef = useRef<HTMLDivElement>(null);

  const client = selected ? getClient(selected.clientId) : null;
  const clientFeed = selected ? getClientFeed(selected.clientId) : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    detailRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selected?.id]);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <AnimatePresence>
      {selected && client && (
        <>
          {/* 오버레이 */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 모달 */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={springTransition}
            className="fixed inset-4 z-50 md:inset-8 lg:inset-x-[8%] lg:inset-y-[5%] xl:inset-x-[12%]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex h-full flex-col rounded-[2rem] bg-[#111] ring-1 ring-white/10 overflow-hidden"
              style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(57,255,20,0.08)' }}
            >
              {/* 모달 상단 헤더 — 클라이언트 정보 */}
              <div className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* 클라이언트 컬러 도트 */}
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: client.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white truncate">{client.name}</span>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ color: client.color, backgroundColor: `${client.color}15` }}
                      >
                        {client.type === 'internal' ? '자체 프로젝트' : '고객사'}
                      </span>
                    </div>
                    <p className="text-xs text-white/30 truncate">{client.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {client.url && (
                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      title="사이트 방문"
                    >
                      <Globe className="h-3.5 w-3.5 text-white/40" />
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-white/50" />
                  </button>
                </div>
              </div>

              {/* 2열 바디 */}
              <div className="flex flex-1 flex-col lg:flex-row min-h-0">

                {/* ── 왼쪽: 이 클라이언트의 소식 아카이브 ── */}
                <div className="lg:w-[280px] xl:w-[320px] shrink-0 flex flex-col border-b border-white/5 lg:border-b-0 lg:border-r lg:border-white/5">
                  <div className="px-4 py-3 border-b border-white/[0.04] shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                      {client.name} 소식 · {clientFeed.length}건
                    </span>
                  </div>

                  {/* 모바일: 가로 탭 */}
                  <div className="lg:hidden flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
                    {clientFeed.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                          selected.id === item.id
                            ? 'text-white'
                            : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                        style={selected.id === item.id ? {
                          backgroundColor: `${client.color}20`,
                          color: client.color,
                        } : {}}
                      >
                        {item.title.length > 12 ? item.title.slice(0, 12) + '…' : item.title}
                      </button>
                    ))}
                  </div>

                  {/* 데스크톱: 세로 목록 */}
                  <div className="hidden lg:flex flex-col flex-1 overflow-y-auto">
                    {clientFeed.map((item, i) => {
                      const isActive = selected.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => onSelect(item)}
                          className={`group w-full text-left px-4 py-3.5 border-b border-white/[0.04] transition-all duration-200 last:border-0 ${
                            isActive ? '' : 'hover:bg-white/[0.03]'
                          }`}
                          style={isActive ? { backgroundColor: `${client.color}08` } : {}}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* 타임라인 연결 표시 */}
                            <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                              <div
                                className="h-2 w-2 rounded-full transition-all"
                                style={{
                                  backgroundColor: isActive ? client.color : 'rgba(255,255,255,0.15)',
                                  boxShadow: isActive ? `0 0 6px ${client.color}60` : 'none',
                                }}
                              />
                              {i < clientFeed.length - 1 && (
                                <div className="w-px flex-1 min-h-[20px] bg-white/[0.06]" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 pb-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span
                                  className="text-[10px] font-bold"
                                  style={{ color: isActive ? client.color : 'rgba(255,255,255,0.25)' }}
                                >
                                  {typeLabel[item.type]}
                                </span>
                                <span className="text-[10px] text-white/20">{item.date}</span>
                              </div>
                              <p className={`text-sm font-medium leading-snug break-keep transition-colors ${
                                isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                              }`}>
                                {item.title}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── 오른쪽: 상세 내용 ── */}
                <div ref={detailRef} className="flex-1 overflow-y-auto overscroll-contain">
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="p-6 sm:p-8 lg:p-10 max-w-2xl"
                  >
                    {/* 타입 뱃지 + 날짜 */}
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full"
                        style={{ color: selected.color, backgroundColor: `${selected.color}15` }}
                      >
                        {typeLabel[selected.type]}
                      </span>
                      <span className="text-xs text-white/30">{selected.date}</span>
                    </div>

                    {/* 제목 */}
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug break-keep mb-6">
                      {selected.title}
                    </h2>

                    {/* 컬러 구분선 */}
                    <div
                      className="h-0.5 w-10 rounded-full mb-8"
                      style={{ backgroundColor: selected.color }}
                    />

                    {/* 본문 */}
                    <div className="text-sm sm:text-base text-white/55 leading-relaxed break-keep whitespace-pre-line mb-10">
                      {selected.fullBody ?? selected.body}
                    </div>

                    {/* 타임라인 */}
                    {selected.timeline && selected.timeline.length > 0 && (
                      <div className="mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-white/25 mb-5">
                          Timeline
                        </h3>
                        <div className="relative pl-5">
                          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/8" />
                          <div className="space-y-6">
                            {selected.timeline.map((event, i) => {
                              const isLast = i === selected.timeline!.length - 1;
                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.06, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                  className="relative"
                                >
                                  <div
                                    className="absolute -left-[1.125rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-[#111]"
                                    style={{ backgroundColor: isLast ? selected.color : 'rgba(255,255,255,0.2)' }}
                                  />
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span
                                      className="text-[11px] font-bold"
                                      style={{ color: isLast ? selected.color : 'rgba(255,255,255,0.4)' }}
                                    >
                                      {event.label}
                                    </span>
                                    <span className="text-[11px] text-white/20">{event.date}</span>
                                  </div>
                                  <p className="text-sm text-white/40 leading-relaxed break-keep">
                                    {event.body}
                                  </p>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 기사 스크랩 */}
                    {selected.articles && selected.articles.length > 0 && (
                      <div className="mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-white/25 mb-4">
                          관련 기사
                        </h3>
                        <div className="space-y-3">
                          {selected.articles.map((article, i) => (
                            <div
                              key={i}
                              className="rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-5"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-0.5 self-stretch rounded-full bg-[#39FF14] opacity-50 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-[10px] font-bold text-[#39FF14] uppercase tracking-[0.1em]">
                                    📰 {article.source}
                                  </span>
                                  <p className="mt-1.5 text-sm font-semibold text-white/60 mb-2 break-keep">
                                    {article.title}
                                  </p>
                                  <p className="text-sm text-white/40 leading-relaxed break-keep">
                                    <span className="text-[#39FF14] font-black mr-0.5">"</span>
                                    {article.quote}
                                    <span className="text-[#39FF14] font-black ml-0.5">"</span>
                                  </p>
                                  {article.url && (
                                    <a
                                      href={article.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 inline-flex items-center gap-1 text-xs text-[#39FF14] hover:opacity-70 transition-opacity"
                                    >
                                      원문 보기 <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 외부 링크 */}
                    {selected.url && (
                      <a
                        href={selected.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold transition-all duration-500 hover:bg-white/10 hover:border-[rgba(57,255,20,0.3)] hover:scale-[1.02]"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                      >
                        사이트 방문하기
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      </a>
                    )}
                  </motion.div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
