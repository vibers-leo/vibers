import { fetchProjectResource } from "@/lib/admin/fetch-project";
import { Globe, ExternalLink, Eye, EyeOff } from "lucide-react";

interface FanSite {
  id: string;
  name?: string;
  slug?: string;
  domain?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  ownerEmail?: string;
}

export default async function FaneasySitesPage() {
  const items = await fetchProjectResource<FanSite>("faneasy", "sites");
  const active = items.filter((i) => i.isActive || i.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">패니지</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">사이트 관리</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "전체 사이트", value: items.length, color: "text-slate-600" },
          { label: "활성 사이트", value: active, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
            <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">사이트 목록</span>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">사이트가 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {items.map((item) => {
              const isActive = item.isActive || item.status === "active";
              const siteUrl = item.domain
                ? `https://${item.domain}`
                : item.slug
                ? `https://${item.slug}.faneasy.co.kr`
                : null;
              return (
                <div key={item.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--admin-bg)] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {isActive
                      ? <Eye className="w-4 h-4 text-emerald-500 shrink-0" />
                      : <EyeOff className="w-4 h-4 text-slate-300 shrink-0" />
                    }
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--admin-text)] truncate">{item.name ?? item.slug ?? item.id}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.domain && <span className="text-[11px] text-[var(--admin-text-muted)]">{item.domain}</span>}
                        {item.ownerEmail && <span className="text-[11px] text-[var(--admin-text-muted)]">{item.ownerEmail}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {item.status && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "active" ? "text-emerald-600 bg-emerald-50" :
                        item.status === "pending" ? "text-amber-600 bg-amber-50" :
                        "text-slate-500 bg-slate-50"
                      }`}>{item.status}</span>
                    )}
                    {siteUrl && (
                      <a href={siteUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800">
                        <ExternalLink className="w-3.5 h-3.5" />
                        방문
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
