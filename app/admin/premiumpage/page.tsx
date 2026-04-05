import { fetchProjectResource } from "@/lib/admin/fetch-project";
import { BookOpen, ExternalLink, Globe } from "lucide-react";

interface Catalog {
  id: string;
  name: string;
  domain: string;
  description?: string;
  pageCount?: number;
  updatedAt?: string;
}

export default async function PremiumpageDashboard() {
  const catalogs = await fetchProjectResource<Catalog>("premiumpage", "catalogs");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">프리미엄페이지</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">대시보드</h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">premiumpage.kr</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
          <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">전체 카탈로그</p>
          <p className="text-3xl font-black text-amber-600">{catalogs.length}</p>
        </div>
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
          <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">활성 도메인</p>
          <p className="text-3xl font-black text-slate-600">{catalogs.length}</p>
        </div>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">카탈로그 목록</span>
        </div>

        {catalogs.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">카탈로그가 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {catalogs.map((catalog) => (
              <div key={catalog.id} className="flex items-center justify-between px-5 py-4 hover:bg-[var(--admin-bg)] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[var(--admin-text)]">{catalog.name}</p>
                  <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">{catalog.domain}</p>
                  {catalog.description && (
                    <p className="text-[12px] text-[var(--admin-text-muted)] mt-1 line-clamp-1">{catalog.description}</p>
                  )}
                </div>
                <a
                  href={`https://${catalog.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-medium text-amber-600 hover:text-amber-800 shrink-0 ml-4"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  방문
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
