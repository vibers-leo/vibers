'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { typeLabel, clients, type FeedItem } from '@/lib/feed-data';

export default function AdminNewsPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/news', {
        headers: { 'x-vibers-secret': process.env.NEXT_PUBLIC_VIBERS_ADMIN_SECRET ?? '' },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 소식을 삭제할까요?`)) return;
    await fetch(`/api/admin/news/${id}`, {
      method: 'DELETE',
      headers: { 'x-vibers-secret': process.env.NEXT_PUBLIC_VIBERS_ADMIN_SECRET ?? '' },
    });
    fetchItems();
  }

  useEffect(() => { fetchItems(); }, []);

  const getClientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.name ?? clientId;

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">소식 관리</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            랜딩 페이지 소식 피드 · 프로젝트 아카이빙
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchItems}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm text-neutral-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/news/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#39FF14] text-black text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            새 소식 작성
          </Link>
        </div>
      </div>

      {/* 목록 */}
      {loading && items.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">불러오는 중...</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-4 hover:border-neutral-700 transition-colors"
            >
              {/* 컬러 도트 */}
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ color: item.color, backgroundColor: `${item.color}15` }}
                  >
                    {typeLabel[item.type]}
                  </span>
                  <span className="text-xs text-neutral-500">{item.date}</span>
                  <span className="text-xs text-neutral-600">·</span>
                  <span className="text-xs text-neutral-500">{getClientName(item.clientId)}</span>
                </div>
                <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                <p className="text-xs text-neutral-500 truncate mt-0.5">{item.body}</p>
              </div>

              {/* 액션 */}
              <div className="flex items-center gap-1 shrink-0">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                    title="사이트 방문"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href={`/admin/news/${item.id}`}
                  className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="수정"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
