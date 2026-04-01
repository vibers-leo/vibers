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

export type GenerativeTemplateId = "modern-art" | "classic-gallery" | "minimal-portfolio";

export const GENERATIVE_TEMPLATES: {
  id: GenerativeTemplateId;
  name: string;
  description: string;
  goodFor: string[];
}[] = [
  {
    id: "modern-art",
    name: "Modern Art",
    description: "깨끗한 화이트 배경과 대담한 이미지 그리드. 현대미술과 디지털 아트에 최적화된 모던 디자인.",
    goodFor: ["현대미술", "디지털 아트", "추상화"],
  },
  {
    id: "classic-gallery",
    name: "Classic Gallery",
    description: "깊이 있는 다크 모드와 우아한 세리프 폰트. 전통 회화와 조각의 권위를 높여주는 클래식 디자인.",
    goodFor: ["전통 회화", "조각", "유화"],
  },
  {
    id: "minimal-portfolio",
    name: "Minimal Portfolio",
    description: "장식을 배제한 극도로 절제된 레이아웃. 사진과 그래픽 디자인 본연의 가치에 집중하는 디자인.",
    goodFor: ["사진", "그래픽 디자인", "일러스트"],
  },
];

// 템플릿 설정 맵
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  arthyun: {
    slug: "arthyun",
    name: "ART HYUN",
    template: "arthyun",
    theme: {
      bodyClass: "bg-black text-white",
      bodyStyle: { fontFamily: "'Noto Serif KR', serif" },
      footerClass: "py-10 bg-zinc-900 border-t border-zinc-800",
    },
    meta: {
      title: "Art Hyun | 예술로 여는 도시재생",
      description: "공공미술과 예술 교육을 통해 도시의 새로운 가치를 창출합니다.",
      domain: "arthyun.co.kr",
    },
    contact: { address: "", phone: "", email: "" },
    social: { instagram: "arthyun_official" },
  },
  "art-way": {
    slug: "art-way",
    name: "Artway Gallery",
    template: "art-way",
    theme: {
      bodyClass: "bg-black text-white",
      bodyStyle: { fontFamily: "'Pretendard', sans-serif" },
      footerClass: "py-10 bg-zinc-900 border-t border-zinc-800",
    },
    meta: {
      title: "Artway Gallery | 예술이 머무는 길",
      description: "부산 동구의 문화 예술 공간, 아트웨이 갤러리입니다.",
      domain: "artway.co.kr",
    },
    contact: { address: "", phone: "", email: "" },
    social: { instagram: "artway_gallery" },
  },
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
