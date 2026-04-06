/**
 * Vibers 프로젝트 활동 이력
 *
 * 관리 지침:
 * - 새 마일스톤 달성 시 해당 projectId 배열에 항목 추가
 * - type: content_created | feature_major | integration | deploy | security | design | monetization | architecture
 * - label: 고객/팀 모두 이해할 수 있는 친절하고 정확한 한국어로 작성
 * - date: YYYY-MM-DD 형식
 * - 사소한 버그 수정, 리팩토링은 포함하지 않음 — 사용자 가치 기준
 */

export interface HistoryEvent {
  id: string;
  projectId: string;
  projectName: string;
  type: string;
  label: string;
  date: string; // YYYY-MM-DD
}

export const ACTIVITY_HISTORY: HistoryEvent[] = [
  // ─── FanEasy ───────────────────────────────────────────────
  {
    id: "faneasy-001",
    projectId: "faneasy",
    projectName: "FanEasy",
    type: "integration",
    label: "Vibers 통합 어드민 연동 완료 — FanEasy 사이트 현황·가입자 수를 통합 대시보드에서 한눈에 확인할 수 있게 되었습니다.",
    date: "2026-04-03",
  },
  {
    id: "faneasy-002",
    projectId: "faneasy",
    projectName: "FanEasy",
    type: "design",
    label: "랜딩페이지 리디자인 & 도메인 정리 완료 — Paperlogy 폰트 적용으로 프리미엄 브랜드 아이덴티티를 완성하고, 5개 오너 계정 세팅을 마쳤습니다.",
    date: "2026-04-04",
  },

  // ─── 세모폰 ────────────────────────────────────────────────
  {
    id: "semophone-001",
    projectId: "semophone",
    projectName: "세모폰",
    type: "monetization",
    label: "3중 수익화 구조 적용 — 구글 애드센스, 쿠팡 파트너스, Vibers 크로스 프로모션을 동시에 도입하여 광고 수익 채널을 다각화했습니다.",
    date: "2026-03-29",
  },
  {
    id: "semophone-002",
    projectId: "semophone",
    projectName: "세모폰",
    type: "design",
    label: "채용 페이지 전체 리디자인 — 7개 섹션을 Supanova 디자인으로 재구성하여 입점 문의 유입이 개선되었습니다.",
    date: "2026-03-30",
  },
  {
    id: "semophone-003",
    projectId: "semophone",
    projectName: "세모폰",
    type: "deploy",
    label: "독립 배포 환경 구축 완료 — 모노레포 의존성을 내재화하여 모든 팀원이 독립적으로 배포할 수 있는 안정적인 환경을 마련했습니다.",
    date: "2026-04-01",
  },

  // ─── AI Recipe ─────────────────────────────────────────────
  {
    id: "ai-recipe-001",
    projectId: "ai-recipe",
    projectName: "AI Recipe",
    type: "security",
    label: "보안 패치 & 명예의전당 기능 출시 — Next.js 보안 취약점을 패치하고, 주간 조회 1위 레시피를 자동 등재하는 명예의전당을 새로 오픈했습니다.",
    date: "2025-12-15",
  },
  {
    id: "ai-recipe-002",
    projectId: "ai-recipe",
    projectName: "AI Recipe",
    type: "monetization",
    label: "광고 관리 시스템 v1 출시 — 캠페인 생성·관리, A/B 테스트, AI 배너 자동 생성, Unsplash 배경 소싱까지 원스톱으로 처리할 수 있게 되었습니다.",
    date: "2026-03-28",
  },

  // ─── PremiumPage ───────────────────────────────────────────
  {
    id: "premiumpage-001",
    projectId: "premiumpage",
    projectName: "PremiumPage",
    type: "content_created",
    label: "한글·영문 콘텐츠 완전 동기화 — 전자카탈로그 모든 페이지에 한국어 버전을 추가하고, 레이아웃 간격을 최적화했습니다.",
    date: "2026-01-17",
  },
  {
    id: "premiumpage-002",
    projectId: "premiumpage",
    projectName: "PremiumPage",
    type: "monetization",
    label: "수익화 기반 구축 — 구글 애드센스·Vibers 배너 광고 적용과 함께 AEO 최적화를 완료하여 검색 노출과 수익 채널을 동시에 강화했습니다.",
    date: "2026-03-28",
  },

  // ─── WhyMove ───────────────────────────────────────────────
  {
    id: "whymove-001",
    projectId: "whymove",
    projectName: "WhyMove",
    type: "architecture",
    label: "인증 시스템 Firebase → Supabase 전환 완료 — 더 안정적이고 확장 가능한 인증 인프라로 마이그레이션을 완료했습니다.",
    date: "2026-03-27",
  },
  {
    id: "whymove-002",
    projectId: "whymove",
    projectName: "WhyMove",
    type: "design",
    label: "Supanova 대시보드 테마 적용 — 금융 데이터 시각화에 최적화된 프리미엄 다크 테마를 도입하여 사용자 경험을 크게 개선했습니다.",
    date: "2026-03-28",
  },

  // ─── 아트현 ────────────────────────────────────────────────
  {
    id: "arthyun-001",
    projectId: "arthyun",
    projectName: "아트현",
    type: "architecture",
    label: "데이터베이스 Firebase → PostgreSQL 마이그레이션 완료 — 공유 DB로 전환하여 데이터 일관성을 보장하고 운영 비용을 절감했습니다.",
    date: "2026-03-31",
  },

  // ─── GOODZZ ────────────────────────────────────────────────
  {
    id: "goodzz-001",
    projectId: "goodzz",
    projectName: "GOODZZ",
    type: "feature_major",
    label: "포트원 결제 시스템 출시 — 신용카드, 간편결제, 가상계좌, 계좌이체 4가지 결제 수단을 모두 지원하게 되었습니다.",
    date: "2026-01-09",
  },

  // ─── MyRatingIs ────────────────────────────────────────────
  {
    id: "myratingis-001",
    projectId: "myratingis",
    projectName: "MyRatingIs",
    type: "feature_major",
    label: "포트폴리오 에디터 고도화 — Tiptap 기반 Notion 스타일 에디터를 도입하여 이미지·영상·텍스트를 자유롭게 배치할 수 있게 되었습니다.",
    date: "2025-12-20",
  },
  {
    id: "myratingis-002",
    projectId: "myratingis",
    projectName: "MyRatingIs",
    type: "feature_major",
    label: "전문가 평가 플랫폼 핵심 기능 완성 — 1:1 문의, 협업 제안, 마이페이지 프로필, 관리자 대시보드가 모두 구현되어 정식 서비스 준비를 마쳤습니다.",
    date: "2025-12-26",
  },

  // ─── Vibers Home ───────────────────────────────────────────
  {
    id: "vibers-home-001",
    projectId: "vibers-home",
    projectName: "Vibers",
    type: "integration",
    label: "전체 서비스 AEO 완성 — 19개 Next.js 앱의 JSON-LD 구조화 데이터, llms.txt, robots.txt, sitemap, OpenGraph를 100% 완비하여 AI 검색 엔진 최적화를 달성했습니다.",
    date: "2026-03-30",
  },
  {
    id: "vibers-home-002",
    projectId: "vibers-home",
    projectName: "Vibers",
    type: "integration",
    label: "Vibers 통합 어드민 허브 완성 — 25개 Next.js 앱 + 6개 Rails 앱의 통계·회원·활동을 admin.vibers.co.kr 한 곳에서 통합 관리하게 되었습니다.",
    date: "2026-04-06",
  },

  // ─── Richlychee ────────────────────────────────────────────
  {
    id: "richlychee-001",
    projectId: "richlychee",
    projectName: "Richlychee",
    type: "feature_major",
    label: "네이버 스마트스토어 대량 등록 CLI 도구 MVP 완성 — Pydantic 검증·OAuth2 인증을 갖춘 프로덕션 레벨 자동화 도구를 완성했습니다.",
    date: "2026-02-12",
  },
  {
    id: "richlychee-002",
    projectId: "richlychee",
    projectName: "Richlychee",
    type: "deploy",
    label: "로그인 인증 안정화 — Firebase 비동기 상태 문제를 해결하여 로그인 직후 대시보드로 정상 진입하는 플로우를 완성했습니다.",
    date: "2026-04-01",
  },
];

/**
 * 특정 프로젝트의 활동 이력을 최신순으로 반환
 */
export function getActivityHistory(projectId?: string): HistoryEvent[] {
  const filtered = projectId && projectId !== "total"
    ? ACTIVITY_HISTORY.filter((e) => e.projectId === projectId)
    : ACTIVITY_HISTORY;
  return filtered.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * 활동 이력을 vibers-admin recentActivity 포맷으로 변환
 */
export function historyToActivityItems(projectId?: string) {
  return getActivityHistory(projectId).map((e) => ({
    id: e.id,
    projectId: e.projectId,
    projectName: e.projectName,
    type: e.type,
    label: e.label,
    timestamp: `${e.date}T09:00:00.000Z`,
    isHistorical: true,
  }));
}
