import { fetchProjectStats } from "@/lib/admin/fetch-project";
import { Globe, Instagram, CheckSquare, Star, BarChart2 } from "lucide-react";
import Link from "next/link";

export default async function FaneasyDashboard() {
  const data = await fetchProjectStats("faneasy");
  const stats = data?.stats;

  const menus = [
    { label: "사이트 관리", desc: "팬사이트 목록, 활성화/비활성화", href: "/admin/faneasy/sites", icon: Globe, accent: "#3b82f6" },
    { label: "인스타그램 연동", desc: "계정별 연동 상태 확인", href: "/admin/faneasy/instagram", icon: Instagram, accent: "#ec4899" },
    { label: "승인 관리", desc: "신규 사이트 승인 대기", href: "/admin/faneasy/approvals", icon: CheckSquare, accent: "#10b981" },
    { label: "AI 프로젝트", desc: "AI 기능 현황", href: "/admin/faneasy/ai-projects", icon: Star, accent: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">패니지</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">대시보드</h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">faneasy.co.kr</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "전체 사이트", value: stats?.contentCount ?? 0, color: "text-blue-600" },
          { label: "총 팬 수", value: stats?.totalUsers ?? 0, color: "text-slate-600" },
          { label: "신규 (7일)", value: stats?.recentSignups ?? 0, color: "text-emerald-600" },
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
              className="group flex items-start gap-4 p-5 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${m.accent}18` }}>
                <m.icon className="w-5 h-5" style={{ color: m.accent }} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--admin-text)] group-hover:text-blue-600 transition-colors">{m.label}</p>
                <p className="text-[12px] text-[var(--admin-text-muted)] mt-0.5">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
