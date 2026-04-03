export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface ProjectHealth {
  slug: string;
  name: string;
  domain?: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  version: string;
  lastDeployed: Date;
  uptime: number;           // percentage
  responseTime: number;     // ms
  errorCount24h: number;
  trafficTrend: number;     // percentage change
  sslExpiresAt: Date;
  dbStatus: 'connected' | 'slow' | 'disconnected' | 'none';
  alerts: Alert[];
}

export const VIBERS_PROJECTS = [
  { slug: 'total', name: '전체 프로젝트 (Global)', priority: 'P0', apiUrl: '', techStack: 'mixed' },
  // dev/rails 그룹
  { slug: 'dus', name: 'DUS (커머스)', domain: 'dus.co.kr', db: 'postgresql', priority: 'P0', apiUrl: 'http://localhost:3000', techStack: 'rails-api', path: 'dev/rails/dus' },
  { slug: 'nusucheck', name: '누수체크 (O2O)', domain: 'nusucheck.com', db: 'postgresql', priority: 'P0', apiUrl: 'http://localhost:3001', techStack: 'rails-api', path: 'dev/rails/nusucheck' },
  { slug: 'vibefolio', name: 'Vibefolio', domain: 'vibefolio.com', db: 'supabase', priority: 'P0', apiUrl: 'http://localhost:3003', techStack: 'rails-only', path: 'dev/rails/vibefolio' },
  // dev/nextjs 그룹
  { slug: 'faneasy', name: 'FanEasy', domain: 'faneasy.co.kr', db: 'firestore', priority: 'P0', apiUrl: 'http://localhost:3002', techStack: 'nextjs-only', path: 'dev/nextjs/faneasy' },
  { slug: 'ai-recipe', name: 'AI Recipe', domain: 'ai-recipe.co.kr', db: 'supabase', priority: 'P0', apiUrl: 'http://localhost:3004', techStack: 'nextjs-only', path: 'dev/nextjs/ai-recipe' },
  { slug: 'goodzz', name: 'GOODZZ', domain: 'goodzz.co.kr', db: 'supabase', priority: 'P1', apiUrl: 'http://localhost:3005', techStack: 'nextjs-only', path: 'dev/nextjs/goodzz' },
  { slug: 'myratingis', name: 'MyRatingIs', domain: 'myratingis.com', db: 'supabase', priority: 'P1', apiUrl: 'http://localhost:3006', techStack: 'nextjs-only', path: 'dev/nextjs/myratingis' },
  { slug: 'vibers', name: 'Vibers (계발자들)', domain: 'vibers.co.kr', db: 'postgresql', priority: 'P0', apiUrl: '', techStack: 'nextjs-only', path: 'dev/nextjs/vibers' },
];

export async function fetchProjectHealth(slug: string): Promise<ProjectHealth> {
  // 실제 환경: 각 프로젝트의 /api/health 엔드포인트를 호출
  // 목업 구현:
  return {
    slug,
    name: VIBERS_PROJECTS.find(p => p.slug === slug)?.name || slug,
    status: slug === 'dus' ? 'error' : slug === 'goodzz' ? 'warning' : 'healthy',
    version: 'v1.0.0',
    lastDeployed: new Date(),
    uptime: 99.9,
    responseTime: 120,
    errorCount24h: slug === 'dus' ? 5 : 0,
    trafficTrend: 5,
    sslExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * (slug === 'goodzz' ? 7 : 90)),
    dbStatus: slug === 'dus' ? 'disconnected' : 'connected',
    alerts: slug === 'dus' ? [{ id: '1', type: 'error', message: 'DB 연결 실패', timestamp: new Date(), resolved: false }] : []
  };
}
