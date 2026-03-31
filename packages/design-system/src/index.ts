// @vibers/design-system — 계발자들 디자인 토큰

export const fonts = {
  korean: 'Pretendard Variable',
  english: 'Poppins',
  mono: 'JetBrains Mono',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const spacing = {
  section: {
    mobile: 'py-16',
    desktop: 'py-20',
  },
  container: {
    maxWidth: 'max-w-7xl',
    padding: {
      mobile: 'px-4',
      tablet: 'px-6',
      desktop: 'px-8',
    },
  },
} as const;

export const animation = {
  transition: '200ms ease',
  hover: 'scale(1.02)',
  fadeIn: '500ms',
} as const;

// 각 프로젝트별 브랜드 컬러는 앱 내에서 정의
// 여기에는 공통 시맨틱 컬러만 포함
export const colors = {
  semantic: {
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#404040',
    muted: '#737373',
  },
  background: {
    white: '#FFFFFF',
    light: '#FAFAFA',
    warm: '#FAF7F0',
  },
} as const;
