import { fetchProjectStats } from "@/lib/admin/fetch-project";
import { Image, MessageSquare, Layers, Settings, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function ArthyunDashboard() {
  const data = await fetchProjectStats("arthyun");
  const stats = data?.stats;

  const menus = [
    { label: "포트폴리오 관리", desc: "작품 목록, 등록, 수정", href: "/admin/arthyun/portfolio", icon: Image, accent: "#ec4899" },
    { label: "전시 관리", desc: "전시 데이터 관리", href: "/admin/arthyun/exhibitions", icon: BookOpen, accent: "#8b5cf6" },
    { label: "문의 관리", desc: "문의 내역 확인 및 상태 변경", href: "/admin/arthyun/inquiries", icon: MessageSquare, accent: "#3b82f6" },
    { label: "미디어 라이브러리", desc: "보도자료, 이미지 관리", href: "/admin/arthyun/media", icon: Layers, accent: "#10b981" },
    { label: "도메인/설정", desc: "사이트 설정 관리", href: "/admin/arthyun/settings", icon: Settings, accent: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">아트현</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">대시보드</h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">arthyun.com</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-5">
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-4.5 h-4.5 text-violet-600" />
          </div>
          <p className="text-2xl font-black text-[var(--admin-text)]">{stats?.contentCount ?? 0}</p>
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">전체 콘텐츠</p>
        </div>
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-5">
          <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center mb-3">
            <Image className="w-4.5 h-4.5 text-pink-600" />
          </div>
          <p className="text-2xl font-black text-[var(--admin-text)]">{stats?.mau ?? 0}</p>
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">월간 활성</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-4">관리 메뉴</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menus.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className="group flex items-start gap-4 p-5 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] hover:border-pink-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${m.accent}18` }}>
                <m.icon className="w-5 h-5" style={{ color: m.accent }} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--admin-text)] group-hover:text-pink-600 transition-colors">{m.label}</p>
                <p className="text-[12px] text-[var(--admin-text-muted)] mt-0.5">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
