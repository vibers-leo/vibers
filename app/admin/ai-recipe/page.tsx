import { fetchProjectStats } from "@/lib/admin/fetch-project";
import { ChefHat, Star, Settings, MessageSquare, FileText, TrendingUp, Users, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function AIRecipeDashboard() {
  const data = await fetchProjectStats("ai-recipe");
  const stats = data?.stats;

  const cards = [
    { label: "전체 가입자", value: stats?.totalUsers ?? 0, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "발행된 레시피", value: stats?.contentCount ?? 0, icon: ChefHat, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "월간 활성", value: stats?.mau ?? 0, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "최근 7일 가입", value: stats?.recentSignups ?? 0, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const menus = [
    { label: "레시피 관리", desc: "레시피 목록, 초안 검토, 발행", href: "/admin/ai-recipe/recipes", icon: ChefHat, accent: "#6366f1" },
    { label: "혜택 카드", desc: "혜택 카드 CRUD 관리", href: "/admin/ai-recipe/benefits", icon: Star, accent: "#f59e0b" },
    { label: "구독 서비스", desc: "구독 서비스 DB 관리", href: "/admin/ai-recipe/subscription-services", icon: BookOpen, accent: "#10b981" },
    { label: "서비스 요청", desc: "사용자 서비스 요청 관리", href: "/admin/ai-recipe/service-requests", icon: MessageSquare, accent: "#3b82f6" },
    { label: "SEO 설정", desc: "메타태그 및 SEO 설정", href: "/admin/ai-recipe/seo", icon: Settings, accent: "#8b5cf6" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">AI Recipe</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">대시보드</h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">ai.vibers.co.kr</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-5">
            <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
              <c.icon className={`w-4.5 h-4.5 ${c.color}`} />
            </div>
            <p className="text-2xl font-black text-[var(--admin-text)]">{c.value.toLocaleString()}</p>
            <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* 기능 메뉴 */}
      <div>
        <h2 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-4">관리 메뉴</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {menus.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className="group flex items-start gap-4 p-5 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${m.accent}18` }}>
                <m.icon className="w-5 h-5" style={{ color: m.accent }} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--admin-text)] group-hover:text-indigo-600 transition-colors">{m.label}</p>
                <p className="text-[12px] text-[var(--admin-text-muted)] mt-0.5">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      {data?.recentActivity && data.recentActivity.length > 0 && (
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-5">
          <h2 className="text-sm font-bold text-[var(--admin-text)] mb-4">최근 활동</h2>
          <div className="space-y-3">
            {data.recentActivity.map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="flex-1 text-[var(--admin-text)] truncate">{a.label}</span>
                <span className="text-[11px] text-[var(--admin-text-muted)] shrink-0">
                  {new Date(a.timestamp).toLocaleDateString("ko-KR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
