// Classic Gallery 템플릿 테마 설정
// 어두운 배경, 우아한 세리프 폰트, 단일 이미지 포커스
// 적합: 전통미술, 유화, 조각

export const classicGalleryTheme = {
  id: "classic-gallery" as const,
  name: "클래식 갤러리",
  description: "우아하고 격조 있는 갤러리 레이아웃",
  goodFor: ["전통미술", "유화", "조각", "수채화"],

  colors: {
    background: "#0A0A0A",
    foreground: "#F5F0EB",
    accent: "#C9A96E",
    muted: "#1A1A1A",
    mutedForeground: "#888888",
    border: "#2A2A2A",
  },

  fonts: {
    heading: "'Playfair Display', 'Noto Serif KR', serif",
    body: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
  },

  layout: {
    maxWidth: "1200px",
    gridColumns: 2,
    imageAspectRatio: "4/3",
    spacing: "2rem",
  },

  bodyClass:
    "font-serif text-stone-100 bg-[#0A0A0A] selection:bg-amber-600 selection:text-white",
  bodyStyle: {
    fontFamily:
      "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif",
  },
  footerClass: "py-16 bg-[#0A0A0A] border-t border-white/10",
};
