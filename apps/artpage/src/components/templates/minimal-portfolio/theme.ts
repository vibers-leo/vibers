// Minimal Portfolio 템플릿 테마 설정
// 울트라 미니멀, 메이슨리 그리드, 장식 없음
// 적합: 사진, 일러스트레이션

export const minimalPortfolioTheme = {
  id: "minimal-portfolio" as const,
  name: "미니멀 포트폴리오",
  description: "불필요한 것을 모두 걷어낸 순수한 작품 중심 레이아웃",
  goodFor: ["사진", "일러스트", "그래픽 디자인", "판화"],

  colors: {
    background: "#FAFAFA",
    foreground: "#222222",
    accent: "#222222",
    muted: "#F0F0F0",
    mutedForeground: "#999999",
    border: "#E5E5E5",
  },

  fonts: {
    heading: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
    body: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
  },

  layout: {
    maxWidth: "1600px",
    gridColumns: 4,
    imageAspectRatio: "auto",
    spacing: "0.5rem",
  },

  bodyClass:
    "font-sans text-gray-800 bg-[#FAFAFA] selection:bg-gray-800 selection:text-white",
  bodyStyle: {
    fontFamily:
      "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif",
  },
  footerClass: "py-12 bg-[#FAFAFA]",
};
