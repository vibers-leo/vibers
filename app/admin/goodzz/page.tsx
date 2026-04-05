import { fetchProjectStats } from "@/lib/admin/fetch-project";
import { Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function GoodzzDashboard() {
  const data = await fetchProjectStats("goodzz");
  const stats = data?.stats;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">굿즈</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">대시보드</h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">goodzz.kr</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "총 사용자", value: stats?.totalUsers ?? 0, color: "text-slate-600" },
          { label: "월간 활성", value: stats?.mau ?? 0, color: "text-teal-600" },
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
          <Link
            href="/admin/goodzz/users"
            className="group flex items-start gap-4 p-5 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] hover:border-teal-200 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-teal-50">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--admin-text)] group-hover:text-teal-600 transition-colors">사용자 관리</p>
              <p className="text-[12px] text-[var(--admin-text-muted)] mt-0.5">회원 목록 및 활동 현황</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
