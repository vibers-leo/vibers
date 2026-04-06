'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AiRecipePost {
  id: string;
  source_id: string;
  title: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
  synced_at: string;
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export default function AiRecipeSection() {
  const [posts, setPosts] = useState<AiRecipePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ai-recipe/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-24 md:py-32 border-t border-[rgba(57,255,20,0.08)]">
      <div className="mx-auto max-w-screen-2xl px-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mb-14 flex items-end justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#39FF14]/20 bg-[#39FF14]/5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-[#39FF14]" />
              <span className="text-xs font-medium text-[#39FF14]/80 tracking-widest uppercase">AI레시피</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              AI레시피가 공유하는 최신 스킬
            </h2>
            <p className="mt-3 text-sm text-white/40">
              ai.vibers.co.kr에서 큐레이션한 레시피가 자동으로 동기화됩니다
            </p>
          </div>
          <a
            href="https://ai.vibers.co.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-[#39FF14]/70 md:flex"
          >
            ai.vibers.co.kr
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>

        {/* 카드 그리드 */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <motion.a
                key={post.id}
                href={`https://ai.vibers.co.kr/recipe/${post.source_id}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springTransition, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-[#39FF14]/20 hover:bg-white/[0.05]"
              >
                {/* 카테고리 */}
                {post.category && (
                  <span className="mb-3 inline-block text-xs font-medium text-[#39FF14]/60 tracking-widest uppercase">
                    {post.category}
                  </span>
                )}

                {/* 제목 */}
                <h3 className="mb-2 text-base font-semibold text-white/90 leading-snug group-hover:text-white transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* 설명 */}
                {post.description && (
                  <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                )}

                {/* 푸터 */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-white/20">
                    AI레시피
                  </span>
                  <ExternalLink className="h-3 w-3 text-white/20 transition-colors group-hover:text-[#39FF14]/50" />
                </div>

                {/* hover 글로우 */}
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-[#39FF14]/[0.03] to-transparent" />
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
