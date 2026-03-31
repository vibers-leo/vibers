"use client";

// src/components/IntegratedFeed.tsx
// 인스타그램 + 유튜브 통합 Masonry 피드
import { useEffect, useState } from "react";
import Image from "next/image";
import { Instagram, Play, ExternalLink, Pin } from "lucide-react";

interface FeedItem {
  id: string;
  type: "instagram" | "youtube";
  thumbnail: string;
  title?: string;
  link: string;
  date: string;
}

interface IntegratedFeedProps {
  slug: string;
  maxItems?: number;
  showHeader?: boolean;
}

export default function IntegratedFeed({
  slug,
  maxItems = 24,
  showHeader = true,
}: IntegratedFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await fetch(`/api/feed/integrated/${slug}`);
        const data = await res.json();
        if (data.success) {
          setItems(data.data.slice(0, maxItems));
        } else {
          setError(data.error);
        }
      } catch (e) {
        setError("피드를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, [slug, maxItems]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return null; // 피드가 없으면 섹션 자체를 숨김
  }

  return (
    <section className="py-8">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            활동 피드
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Instagram size={12} /> Instagram
            </span>
            <span className="text-gray-200">·</span>
            <span className="flex items-center gap-1">
              <Play size={12} /> YouTube
            </span>
          </div>
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {items.map((item, idx) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block break-inside-avoid rounded-xl overflow-hidden
              ring-1 ring-black/5 hover:ring-black/10 transition-all duration-500
              hover:shadow-lg hover:shadow-black/5"
          >
            {/* 이미지 */}
            <div
              className={`relative w-full ${
                item.type === "youtube" ? "aspect-video" : "aspect-square"
              }`}
            >
              <Image
                src={item.thumbnail}
                alt={item.title || ""}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* 어두운 오버레이 (호버 시) */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            {/* 타입 아이콘 오버레이 */}
            <div className="absolute top-2 left-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md
                  ${item.type === "instagram"
                    ? "bg-gradient-to-br from-purple-500/80 to-pink-500/80"
                    : "bg-red-500/80"
                  }`}
              >
                {item.type === "instagram" ? (
                  <Instagram size={13} className="text-white" />
                ) : (
                  <Play size={13} className="text-white fill-white" />
                )}
              </div>
            </div>

            {/* 외부 링크 아이콘 (호버) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <ExternalLink size={13} className="text-gray-700" />
              </div>
            </div>

            {/* 제목 (유튜브만) */}
            {item.type === "youtube" && item.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-xs text-white font-medium line-clamp-2 leading-relaxed">
                  {item.title}
                </p>
              </div>
            )}

            {/* 첫 번째 아이템이 고정 피드인 경우 */}
            {idx === 0 && (
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2 py-0.5 bg-emerald-500/80 backdrop-blur-sm rounded-full text-[10px] text-white font-medium flex items-center gap-1">
                  <Pin size={10} /> 고정
                </div>
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
