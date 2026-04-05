import { fetchProjectStats } from "@/lib/admin/fetch-project";
import { Briefcase, FileText, MessageSquare, Star, Settings } from "lucide-react";
import Link from "next/link";

export default async function SemophoneDashboard() {
  const data = await fetchProjectStats("semophone");
  const stats = data?.stats;

  const menus = [
    { label: "구인공고 관리", desc: "활성/비활성 공고 관리", href: "/admin/semophone/jobs", icon: Briefcase, accent: "#10b981" },
    { label: "지원서 관리", desc: "지원자 검토 및 상태 변경", href: "/admin/semophone/applications", icon: FileText, accent: "#3b82f6" },
    { label: "문의 관리", desc: "사용자 문의 내역", href: "/admin/semophone/inquiries", icon: MessageSquare, accent: "#8b5cf6" },
    { label: "혜택 카드", desc: "혜택 카드 CRUD", href: "/admin/semophone/benefits", icon: Star, accent: "#f59e0b" },
    { label: "사이트 설정", desc: "SEO, OG, 사이트 메타", href: "/admin/semophone/settings", icon: Settings, accent: "#6366f1" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">세모폰</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">대시보드</h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">semophone.co.kr</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "총 지원자", value: stats?.totalUsers ?? 0, color: "text-slate-600" },
          { label: "활성 공고", value: stats?.contentCount ?? 0, color: "text-emerald-600" },
          { label: "총 문의", value: stats?.recentSignups ?? 0, color: "text-violet-600" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
            <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-4">관리 메뉴</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menus.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className="group flex items-start gap-4 p-5 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] hover:border-emerald-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${m.accent}18` }}>
                <m.icon className="w-5 h-5" style={{ color: m.accent }} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--admin-text)] group-hover:text-emerald-600 transition-colors">{m.label}</p>
                <p className="text-[12px] text-[var(--admin-text-muted)] mt-0.5">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
