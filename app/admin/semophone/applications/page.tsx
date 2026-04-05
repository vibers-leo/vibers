import { fetchProjectResource } from "@/lib/admin/fetch-project";
import { FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  createdAt: string;
  notes?: string;
}

const statusConfig = {
  pending:   { label: "대기", color: "text-slate-600 bg-slate-100", icon: Clock },
  reviewing: { label: "검토중", color: "text-amber-600 bg-amber-50", icon: Eye },
  accepted:  { label: "합격", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle },
  rejected:  { label: "불합격", color: "text-red-600 bg-red-50", icon: XCircle },
};

export default async function SemophoneApplicationsPage() {
  const items = await fetchProjectResource<Application>("semophone", "applications");
  const pending = items.filter((i) => i.status === "pending").length;
  const reviewing = items.filter((i) => i.status === "reviewing").length;
  const accepted = items.filter((i) => i.status === "accepted").length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">세모폰</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">지원서 관리</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "전체", value: items.length, color: "text-slate-600" },
          { label: "대기", value: pending, color: "text-slate-500" },
          { label: "검토중", value: reviewing, color: "text-amber-600" },
          { label: "합격", value: accepted, color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
            <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">지원서 목록</span>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">데이터를 불러올 수 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {items.map((item) => {
              const st = statusConfig[item.status] ?? statusConfig.pending;
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--admin-bg)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--admin-text)]">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {item.position}
                      </span>
                      <span className="text-[10px] text-[var(--admin-text-muted)]">{item.email}</span>
                      <span className="text-[10px] text-[var(--admin-text-muted)]">
                        {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[12px] text-[var(--admin-text-muted)] mt-1 line-clamp-1">메모: {item.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {item.resumeUrl && (
                      <a
                        href={item.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-blue-600 hover:underline"
                      >
                        이력서
                      </a>
                    )}
                    <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${st.color}`}>
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
