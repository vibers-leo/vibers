// 멀티테넌트 템플릿 레지스트리
// slug → 템플릿 컴포넌트 + 테마 설정 매핑

export type TemplateConfig = {
  slug: string;
  name: string;
  template: "arthyun" | "art-way" | "modern-art" | "classic-gallery" | "minimal-portfolio" | "monopage";
  // 테마
  theme: {
    bodyClass: string;
    bodyStyle: React.CSSProperties;
    footerClass: string;
  };
  // 기본 메타데이터
  meta: {
    title: string;
    description: string;
    domain: string;
  };
  // 연락처
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  // SNS
  social: {
    instagram?: string;
    blog?: string;
    youtube?: string;
  };
};

// ... (GENERATIVE_TEMPLATES remains the same)

// 템플릿 설정 맵
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  // ... (arthyun and art-way remain the same)
};

// slug로 템플릿 설정 조회
export function getTemplateConfig(slug: string): TemplateConfig | null {
  if (slug in TEMPLATE_CONFIGS) {
    return TEMPLATE_CONFIGS[slug];
  }

  // 기본 모노페이지 템플릿 반환
  return {
    slug,
    name: slug.toUpperCase(),
    template: "monopage",
    theme: {
      bodyClass: "bg-white text-gray-900 selection:bg-emerald-100",
      bodyStyle: {
        fontFamily: "'Pretendard', system-ui, sans-serif",
      },
      footerClass: "py-12 bg-gray-50 border-t border-gray-100",
    },
    meta: {
      title: `${slug} | Monopage`,
      description: `${slug} 아티스트의 모노페이지입니다.`,
      domain: `https://${slug}.monopage.kr`,
    },
    contact: {
      address: "",
      phone: "",
      email: "",
    },
    social: {},
  };
}

// 유효한 slug인지 확인
export function isValidSlug(slug: string): boolean {
  // 모든 슬러그를 일단 허용 (DB에서 실제 체크가 이루어짐)
  return true;
}

// 모든 slug 목록
export function getAllSlugs(): string[] {
  return Object.keys(TEMPLATE_CONFIGS);
}
