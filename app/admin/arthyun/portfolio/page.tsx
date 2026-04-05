import { fetchProjectResource } from "@/lib/admin/fetch-project";
import { Image, ExternalLink, Eye, EyeOff, Star } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  client?: string;
  category?: string;
  categories: string[];
  image_url?: string;
  is_featured: boolean;
  is_visible: boolean;
  completion_date?: string;
  created_at: string;
}

export default async function ArthyunPortfolioPage() {
  const items = await fetchProjectResource<PortfolioItem>("arthyun", "portfolio");
  const visible = items.filter((i) => i.is_visible).length;
  const featured = items.filter((i) => i.is_featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">아트현</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)]">포트폴리오 관리</h1>
        </div>
        <a
          href="https://arthyun.com/admin/portfolio/write"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          새 작품 등록
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "전체", value: items.length, color: "text-slate-600" },
          { label: "노출 중", value: visible, color: "text-emerald-600" },
          { label: "피처드", value: featured, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
            <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <Image className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">작품 목록</span>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">데이터를 불러올 수 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--admin-bg)] transition-colors group">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-[var(--admin-border)] shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                    <Image className="w-5 h-5 text-pink-300" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--admin-text)] truncate">{item.title}</p>
                    {item.is_featured && <Star className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {item.client && <span className="text-[10px] text-[var(--admin-text-muted)]">{item.client}</span>}
                    {item.category && (
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">{item.category}</span>
                    )}
                    {item.completion_date && (
                      <span className="text-[10px] text-[var(--admin-text-muted)]">{item.completion_date}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.is_visible
                    ? <Eye className="w-4 h-4 text-emerald-500" />
                    : <EyeOff className="w-4 h-4 text-slate-300" />
                  }
                  <a
                    href={`https://arthyun.com/admin/portfolio/edit/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-[11px] font-medium text-[var(--admin-text-muted)] hover:text-pink-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    편집 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
