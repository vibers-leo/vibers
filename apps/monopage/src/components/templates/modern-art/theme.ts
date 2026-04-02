// Modern Art 템플릿 테마 설정
// 깔끔한 흰색 배경, 대형 이미지 그리드, 산세리프, 최소 텍스트
// 적합: 현대미술, 디지털 아트

export const modernArtTheme = {
  id: "modern-art" as const,
  name: "모던 아트",
  description: "깔끔하고 현대적인 갤러리 레이아웃",
  goodFor: ["현대미술", "디지털 아트", "설치미술"],

  colors: {
    background: "#FFFFFF",
    foreground: "#111111",
    accent: "#0066FF",
    muted: "#F5F5F5",
    mutedForeground: "#888888",
    border: "#EEEEEE",
  },

  fonts: {
    heading: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
    body: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
  },

  layout: {
    maxWidth: "1400px",
    gridColumns: 3,
    imageAspectRatio: "1/1",
    spacing: "1rem",
  },

  bodyClass:
    "font-sans text-gray-900 bg-white selection:bg-blue-600 selection:text-white",
  bodyStyle: {
    fontFamily:
      "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif",
  },
  footerClass: "py-16 bg-white border-t border-gray-100",
};
