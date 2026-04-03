export type EntityId = 'dlab' | 'dus' | 'wero' | 'sangga226' | 'nusucheck';
export type ProjectStatus = 'live' | 'beta' | 'development' | 'concept';
export type ProjectCategory = 'app' | 'platform' | 'service' | 'tool';

export interface Project {
  slug: string;
  name: string;
  nameEn: string;
  tagline: string;
  entity: EntityId;
  status: ProjectStatus;
  category: ProjectCategory;
  description: string;
  url?: string;
  tech: string[];
  highlights: string[];
  featured: boolean;
  launchDate?: string;
  color: string;       // 프로젝트 대표 색상
  thumbnail?: string;  // /thumbnails/{slug}.png
}

export const projects: Project[] = [
  {
    slug: 'vibers',
    name: '바이버스',
    nameEn: 'Vibers',
    tagline: '어디서든 코딩하다. 모바일 AI 코딩 작업실.',
    entity: 'dlab',
    status: 'development',
    category: 'app',
    description:
      '스마트폰 하나로 로컬 개발 환경을 제어하는 AI 코딩 작업실. ' +
      '모바일 앱에서 터미널 명령을 실행하고, VSCode와 실시간으로 동기화한다. ' +
      'AI가 코드를 제안하고, 바이브코딩으로 누구나 개발자가 될 수 있다.',
    url: 'https://app.vibers.co.kr',
    tech: ['Expo', 'React Native', 'TypeScript', 'Socket.io', 'Node.js', 'WebSocket'],
    highlights: [
      'PC Remote 연결 성공률 95% 목표',
      'VSCode 실시간 동기화',
      'AI 코드 제안 통합',
    ],
    featured: true,
    color: '#39FF14',
  },
  {
    slug: 'faneasy',
    name: '팬이지',
    nameEn: 'FanEasy',
    tagline: '인플루언서 · 소상공인의 홈페이지를 3일 만에.',
    entity: 'wero',
    status: 'live',
    category: 'platform',
    description:
      '인플루언서와 소상공인이 팬과 고객을 만나는 공간을 쉽고 빠르게 만들 수 있는 플랫폼. ' +
      '드래그&드롭 페이지 빌더, 팬 커뮤니티, 상품 판매, 문의 폼까지 하나에서. ' +
      'AI가 참고 사이트를 분석해 자동으로 사이트를 설계해준다.',
    url: 'https://faneasy.kr',
    tech: ['Next.js', 'TypeScript', 'Firebase', 'Firestore', 'Tailwind CSS', 'Vercel'],
    highlights: [
      '다수 인플루언서·소상공인 사이트 운영 중',
      'AI 자동 사이트 제작 파이프라인',
      '멀티테넌시 서브도메인 지원',
    ],
    featured: true,
    color: '#6C63FF',
  },
  {
    slug: 'nusucheck',
    name: '누수체크',
    nameEn: 'NusuCheck',
    tagline: '누수를 탐지하고, 진단하고, 수리까지.',
    entity: 'nusucheck',
    status: 'live',
    category: 'service',
    description:
      '건물 누수 문제를 전문적으로 탐지·진단·수리하는 서비스. ' +
      '첨단 장비와 전문 기술로 정확한 누수 위치를 찾아 최소한의 공사로 해결한다.',
    tech: ['현장 전문 기술', '누수 탐지 장비', '디지털 서비스 예약'],
    highlights: [
      '전문 누수 탐지 장비 보유',
      '비파괴 탐지 기술',
    ],
    featured: false,
    color: '#0EA5E9',
  },
  {
    slug: 'jepeongga',
    name: '제평가는요?',
    nameEn: 'MyRatingIs',
    tagline: '내 프로젝트의 진짜 가치를 AI가 평가합니다.',
    entity: 'dus',
    status: 'beta',
    category: 'app',
    description:
      '프로젝트 아이디어를 입력하면 AI가 독창성·시장성·완성도 등 6가지 핵심 지표로 종합 평가해주는 서비스. ' +
      '"흑백요리사" 테마의 다크 UI, Google Gemini Pro 기반 AI 분석, Supabase 인증/DB. ' +
      '토스 전자결제, 네이버 검색 등록, iOS/Android 앱 출시 준비 중.',
    url: 'https://testmymvp.vercel.app',
    tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Google Gemini Pro', 'Vercel'],
    highlights: [
      '423 커밋 — 실제 서비스 수준',
      'AI 6가지 지표 프로젝트 평가',
      '토스 결제 · 네이버 검색 · 앱스토어 등록 예정',
    ],
    featured: true,
    color: '#00C896',
  },
  {
    slug: 'wayo',
    name: '와요',
    nameEn: 'Wayo',
    tagline: '모바일 초대장을 5분 만에 만들어 공유하세요.',
    entity: 'dus',
    status: 'concept',
    category: 'service',
    description:
      '결혼식, 돌잔치, 생일파티 등 특별한 순간을 위한 모바일 청첩장·초대장 제작 서비스. ' +
      '템플릿 선택 → 정보 입력 → 링크 공유, 단 3단계로 완성.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    highlights: [
      '기획 중',
    ],
    featured: false,
    color: '#00C896',
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const getLiveProjects = () => projects.filter((p) => p.status === 'live' || p.status === 'beta');

export const statusLabel: Record<ProjectStatus, string> = {
  live: '서비스 중',
  beta: '베타',
  development: '개발 중',
  concept: '기획 중',
};

export const statusColor: Record<ProjectStatus, string> = {
  live: '#39FF14',
  beta: '#FFD700',
  development: '#6C63FF',
  concept: '#888888',
};

export const categoryLabel: Record<ProjectCategory, string> = {
  app: '앱',
  platform: '플랫폼',
  service: '서비스',
  tool: '툴',
};
