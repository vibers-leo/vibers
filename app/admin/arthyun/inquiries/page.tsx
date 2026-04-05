import { fetchProjectResource } from "@/lib/admin/fetch-project";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  content?: string;
  type: string;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new:        { label: "신규", color: "text-blue-600 bg-blue-50", icon: AlertCircle },
  inprogress: { label: "처리중", color: "text-amber-600 bg-amber-50", icon: Clock },
  resolved:   { label: "완료", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle },
};

export default async function ArthyunInquiriesPage() {
  const items = await fetchProjectResource<Inquiry>("arthyun", "inquiries");
  const newCount = items.filter((i) => i.status === "new").length;
  const inProgress = items.filter((i) => i.status === "inprogress").length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">아트현</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">문의 관리</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "전체", value: items.length, color: "text-slate-600" },
          { label: "신규", value: newCount, color: "text-blue-600" },
          { label: "처리중", value: inProgress, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
            <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">문의 목록</span>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">문의가 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {items.map((item) => {
              const st = statusConfig[item.status] ?? { label: item.status, color: "text-slate-500 bg-slate-50", icon: Clock };
              return (
                <div key={item.id} className="px-5 py-4 hover:bg-[var(--admin-bg)] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[var(--admin-text)]">{item.name}</span>
                        <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">{item.type}</span>
                      </div>
                      {item.content && (
                        <p className="text-[13px] text-[var(--admin-text-muted)] line-clamp-2">{item.content}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {item.email && <span className="text-[11px] text-[var(--admin-text-muted)]">{item.email}</span>}
                        {item.phone && <span className="text-[11px] text-[var(--admin-text-muted)]">{item.phone}</span>}
                        <span className="text-[11px] text-[var(--admin-text-muted)]">
                          {new Date(item.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.color}`}>
                      <st.icon className="w-3 h-3" />
                      {st.label}
                    </span>
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
