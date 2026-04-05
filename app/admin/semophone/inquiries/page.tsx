import { fetchProjectResource } from "@/lib/admin/fetch-project";
import { MessageSquare } from "lucide-react";

interface Inquiry {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  type?: string;
  createdAt: string;
}

export default async function SemophoneInquiriesPage() {
  const items = await fetchProjectResource<Inquiry>("semophone", "inquiries");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">세모폰</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">문의 관리</h1>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
        <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">전체 문의</p>
        <p className="text-3xl font-black text-slate-600">{items.length}</p>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">문의 목록</span>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">문의가 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {items.map((item) => (
              <div key={item.id} className="px-5 py-4 hover:bg-[var(--admin-bg)] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[var(--admin-text)]">{item.name ?? "익명"}</span>
                      {item.type && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.type}</span>
                      )}
                    </div>
                    {item.message && (
                      <p className="text-[13px] text-[var(--admin-text-muted)] line-clamp-2">{item.message}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {item.email && <span className="text-[11px] text-[var(--admin-text-muted)]">{item.email}</span>}
                      {item.phone && <span className="text-[11px] text-[var(--admin-text-muted)]">{item.phone}</span>}
                    </div>
                  </div>
                  <span className="text-[11px] text-[var(--admin-text-muted)] shrink-0">
                    {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
