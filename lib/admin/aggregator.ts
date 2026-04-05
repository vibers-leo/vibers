import type { VibersAdminResponse } from "@vibers/admin-kit/types";

export interface ProjectEntry {
  id: string;
  name: string;
  group: string;
  adminApiUrl: string;
  domain?: string;
  color?: string;
}

export const VIBERS_PROJECTS_REGISTRY: ProjectEntry[] = [
  // ── 콘텐츠 ──
  { id: "ai-recipe", name: "AI Recipe", group: "콘텐츠", adminApiUrl: "https://ai.vibers.co.kr/api/vibers-admin", domain: "ai.vibers.co.kr", color: "#6366f1" },
  { id: "arthyun", name: "아트현", group: "콘텐츠", adminApiUrl: "https://arthyun.com/api/vibers-admin", domain: "arthyun.com", color: "#ec4899" },
  { id: "premiumpage", name: "PremiumPage", group: "콘텐츠", adminApiUrl: "https://premiumpage.kr/api/vibers-admin", domain: "premiumpage.kr", color: "#f59e0b" },
  // ── 로컬/비즈 ──
  { id: "semophone", name: "세모폰", group: "로컬/비즈", adminApiUrl: "https://semophone.kr/api/vibers-admin", domain: "semophone.kr", color: "#10b981" },
  { id: "faneasy", name: "FanEasy", group: "로컬/비즈", adminApiUrl: "https://faneasy.co.kr/api/vibers-admin", domain: "faneasy.co.kr", color: "#3b82f6" },
  // ── 커뮤니티 ──
  { id: "whymove", name: "WhyMove", group: "커뮤니티", adminApiUrl: "https://whymove.co.kr/api/vibers-admin", domain: "whymove.co.kr", color: "#8b5cf6" },
  { id: "goodzz", name: "GOODZZ", group: "커뮤니티", adminApiUrl: "https://goodzz.co.kr/api/vibers-admin", domain: "goodzz.co.kr", color: "#14b8a6" },
  { id: "myratingis", name: "MyRatingIs", group: "커뮤니티", adminApiUrl: "https://myratingis.com/api/vibers-admin", domain: "myratingis.com", color: "#f97316" },
  // ── Rails 앱 ──
  { id: "dus", name: "디어스", group: "Rails", adminApiUrl: "https://dus.vibers.co.kr/api/vibers_admin", domain: "designd.co.kr", color: "#00a859" },
  { id: "honsul", name: "혼술", group: "Rails", adminApiUrl: "https://honsul.vibers.co.kr/api/vibers_admin", domain: "honsul.vibers.co.kr", color: "#f43f5e" },
  { id: "nusucheck", name: "누수체크", group: "Rails", adminApiUrl: "https://nusucheck.vibers.co.kr/api/vibers_admin", domain: "nusucheck.com", color: "#2563eb" },
  { id: "matecheck", name: "메이트체크", group: "Rails", adminApiUrl: "https://matecheck.vibers.co.kr/api/vibers_admin", domain: "matecheck.vibers.co.kr", color: "#7c3aed" },
  { id: "runnersconnect", name: "러너스커넥트", group: "Rails", adminApiUrl: "https://runnersconnect.vibers.co.kr/api/vibers_admin", domain: "runnersconnect.vibers.co.kr", color: "#0891b2" },
  { id: "wayo", name: "와요/가보자고", group: "Rails", adminApiUrl: "https://wayo-api.vibers.co.kr/api/vibers_admin", domain: "wayo.co.kr", color: "#d97706" },
];

export type AggregatedProject = VibersAdminResponse & {
  group: string;
  domain?: string;
  color?: string;
};

export async function aggregateAllProjects(): Promise<AggregatedProject[]> {
  const secret = process.env.VIBERS_ADMIN_SECRET ?? "";

  const results = await Promise.allSettled(
    VIBERS_PROJECTS_REGISTRY.map(async (p) => {
      const res = await fetch(p.adminApiUrl, {
        headers: { "x-vibers-admin-secret": secret },
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: VibersAdminResponse = await res.json();
      return { ...data, group: p.group, domain: p.domain, color: p.color } satisfies AggregatedProject;
    })
  );

  return results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    const p = VIBERS_PROJECTS_REGISTRY[i];
    return {
      projectId: p.id,
      projectName: p.name,
      stats: { mau: 0, totalUsers: 0, contentCount: 0, recentSignups: 0 },
      recentActivity: [],
      health: "error" as const,
      group: p.group,
      domain: p.domain,
      color: p.color,
    };
  });
}
