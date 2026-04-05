import {
  Home, ChefHat, Image, Star, FileText, Briefcase, Users,
  MessageSquare, Globe, Settings, Package,
  Layers, Instagram, CheckSquare,
  BookOpen, Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProjectMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** 외부 앱 어드민 URL (iframe embed 용) */
  externalUrl?: string;
  subItems?: { label: string; href: string; externalUrl?: string }[];
}

export interface ProjectMenuConfig {
  projectId: string;
  color: string;
  menus: ProjectMenuItem[];
}

/** 각 프로젝트 고유 메뉴 — externalUrl이 있으면 /admin/embed?src=... 로 열림 */
export const PROJECT_MENUS: Record<string, ProjectMenuConfig> = {

  "ai-recipe": {
    projectId: "ai-recipe",
    color: "#6366f1",
    menus: [
      { label: "대시보드", href: "/admin/ai-recipe", icon: Home },
      {
        label: "레시피 관리",
        href: "/admin/ai-recipe/recipes",
        icon: ChefHat,
        subItems: [
          { label: "레시피 목록", href: "/admin/ai-recipe/recipes" },
          { label: "초안 검토", href: "/admin/ai-recipe/recipes?status=draft" },
          { label: "새 레시피", href: "/admin/ai-recipe/recipes/new", externalUrl: "https://ai.vibers.co.kr/admin/recipes/new" },
        ],
      },
      { label: "구독 서비스", href: "/admin/ai-recipe/subscription-services", icon: Star, externalUrl: "https://ai.vibers.co.kr/admin/subscription-services" },
      { label: "혜택 카드", href: "/admin/ai-recipe/benefits", icon: Package, externalUrl: "https://ai.vibers.co.kr/admin/benefits" },
      { label: "서비스 요청", href: "/admin/ai-recipe/service-requests", icon: MessageSquare, externalUrl: "https://ai.vibers.co.kr/admin/service-requests" },
      { label: "SEO 설정", href: "/admin/ai-recipe/seo", icon: Globe, externalUrl: "https://ai.vibers.co.kr/admin/seo" },
    ],
  },

  "arthyun": {
    projectId: "arthyun",
    color: "#ec4899",
    menus: [
      { label: "대시보드", href: "/admin/arthyun", icon: Home },
      {
        label: "포트폴리오",
        href: "/admin/arthyun/portfolio",
        icon: Image,
        subItems: [
          { label: "포트폴리오 목록", href: "/admin/arthyun/portfolio" },
          { label: "새 작품 등록", href: "/admin/arthyun/portfolio/new", externalUrl: "https://arthyun.com/admin/portfolio/write" },
        ],
      },
      { label: "미디어 라이브러리", href: "/admin/arthyun/media", icon: Layers, externalUrl: "https://arthyun.com/admin/media" },
      { label: "문의 관리", href: "/admin/arthyun/inquiries", icon: MessageSquare },
      { label: "도메인/서버 현황", href: "/admin/arthyun/settings", icon: Globe, externalUrl: "https://arthyun.com/admin/settings" },
    ],
  },

  "semophone": {
    projectId: "semophone",
    color: "#10b981",
    menus: [
      { label: "대시보드", href: "/admin/semophone", icon: Home },
      { label: "구인공고 관리", href: "/admin/semophone/jobs", icon: Briefcase },
      { label: "지원서 관리", href: "/admin/semophone/applications", icon: FileText },
      { label: "혜택 카드", href: "/admin/semophone/benefits", icon: Star, externalUrl: "https://semophone.kr/admin/benefits" },
      { label: "문의 관리", href: "/admin/semophone/inquiries", icon: MessageSquare },
      { label: "사이트 설정", href: "/admin/semophone/settings", icon: Settings, externalUrl: "https://semophone.kr/admin/site-settings" },
    ],
  },

  "faneasy": {
    projectId: "faneasy",
    color: "#3b82f6",
    menus: [
      { label: "대시보드", href: "/admin/faneasy", icon: Home },
      { label: "사이트 관리", href: "/admin/faneasy/sites", icon: Globe },
      { label: "인스타그램 연동", href: "/admin/faneasy/instagram", icon: Instagram, externalUrl: "https://faneasy.co.kr/api/admin/instagram/status-all" },
      { label: "승인 관리", href: "/admin/faneasy/approvals", icon: CheckSquare, externalUrl: "https://faneasy.co.kr/admin" },
      { label: "AI 프로젝트", href: "/admin/faneasy/ai-projects", icon: Star, externalUrl: "https://faneasy.co.kr/admin" },
    ],
  },

  "premiumpage": {
    projectId: "premiumpage",
    color: "#f59e0b",
    menus: [
      { label: "대시보드", href: "/admin/premiumpage", icon: Home },
      { label: "카탈로그 관리", href: "/admin/premiumpage/catalogs", icon: BookOpen },
      { label: "배포 관리", href: "/admin/premiumpage/deploy", icon: Wrench, externalUrl: "https://vercel.com/juuunos-projects/premiumpage" },
    ],
  },

  "whymove": {
    projectId: "whymove",
    color: "#8b5cf6",
    menus: [
      { label: "대시보드", href: "/admin/whymove", icon: Home },
      { label: "사용자 관리", href: "/admin/whymove/users", icon: Users },
      { label: "소셜 피드", href: "/admin/whymove/posts", icon: BookOpen, externalUrl: "https://whymove.kr/admin/posts" },
    ],
  },

  "goodzz": {
    projectId: "goodzz",
    color: "#14b8a6",
    menus: [
      { label: "대시보드", href: "/admin/goodzz", icon: Home },
      { label: "사용자 관리", href: "/admin/goodzz/users", icon: Users, externalUrl: "https://goodzz.kr/admin/users" },
    ],
  },

  "myratingis": {
    projectId: "myratingis",
    color: "#f97316",
    menus: [
      { label: "대시보드", href: "/admin/myratingis", icon: Home },
      { label: "사용자 관리", href: "/admin/myratingis/users", icon: Users, externalUrl: "https://myratingis.com/admin/users" },
    ],
  },
};

  // ── Rails 앱 ──

  "dus": {
    projectId: "dus",
    color: "#00a859",
    menus: [
      { label: "대시보드", href: "/admin/dus", icon: Home },
      { label: "주문 관리", href: "/admin/dus/orders", icon: FileText },
      { label: "에이전시 관리", href: "/admin/dus/agencies", icon: Users },
      { label: "디자인 템플릿", href: "/admin/dus/templates", icon: Layers, externalUrl: "https://designd.co.kr/admin/design_templates" },
      { label: "견적 관리", href: "/admin/dus/quotes", icon: MessageSquare, externalUrl: "https://designd.co.kr/admin/quotes" },
    ],
  },

  "honsul": {
    projectId: "honsul",
    color: "#f43f5e",
    menus: [
      { label: "대시보드", href: "/admin/honsul", icon: Home },
      { label: "사용자 관리", href: "/admin/honsul/users", icon: Users },
      { label: "술집 관리", href: "/admin/honsul/bars", icon: Globe },
      { label: "리뷰 관리", href: "/admin/honsul/reviews", icon: MessageSquare },
    ],
  },

  "nusucheck": {
    projectId: "nusucheck",
    color: "#2563eb",
    menus: [
      { label: "대시보드", href: "/admin/nusucheck", icon: Home },
      { label: "의뢰 관리", href: "/admin/nusucheck/requests", icon: FileText },
      { label: "견적 관리", href: "/admin/nusucheck/estimates", icon: MessageSquare },
      { label: "사용자 관리", href: "/admin/nusucheck/users", icon: Users, externalUrl: "https://nusucheck.vibers.co.kr/admin/users" },
    ],
  },

  "matecheck": {
    projectId: "matecheck",
    color: "#7c3aed",
    menus: [
      { label: "대시보드", href: "/admin/matecheck", icon: Home },
      { label: "네스트 관리", href: "/admin/matecheck/nests", icon: Users },
      { label: "지원 티켓", href: "/admin/matecheck/support", icon: MessageSquare },
    ],
  },

  "runnersconnect": {
    projectId: "runnersconnect",
    color: "#0891b2",
    menus: [
      { label: "대시보드", href: "/admin/runnersconnect", icon: Home },
      { label: "대회 관리", href: "/admin/runnersconnect/races", icon: Briefcase },
      { label: "크루 관리", href: "/admin/runnersconnect/crews", icon: Users },
      { label: "주문 관리", href: "/admin/runnersconnect/orders", icon: FileText },
    ],
  },

  "wayo": {
    projectId: "wayo",
    color: "#d97706",
    menus: [
      { label: "대시보드", href: "/admin/wayo", icon: Home },
      { label: "초대장 관리", href: "/admin/wayo/invitations", icon: FileText },
      { label: "이벤트 관리", href: "/admin/wayo/events", icon: Star },
      { label: "사용자 관리", href: "/admin/wayo/users", icon: Users },
    ],
  },
};

/** 전체 대시보드(total)용 공통 메뉴 — 기존 Sidebar의 imwebMenus */
export const GLOBAL_MENU_IDS = ["total"];
