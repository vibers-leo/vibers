# Vibers 통합 어드민 총괄 개발계획 (AG 작업지시서)

> **이 문서는 AntiGravity(Claude Code) 터미널에서 직접 참조하여 개발하는 마스터 계획서입니다.**
> **작성**: Cowork (2026-03-28)
> **목표**: vibers.co.kr/admin을 모든 Vibers 프로젝트의 총괄 어드민 허브로 구축

---

## ★ 핵심 목표

1. **vibers 어드민 = 총괄 관리자**: 모든 Vibers 프로젝트의 오류현황, 배포현황, 통계를 한곳에서 관리
2. **공통 어드민 패키지**: vibers에서 만든 어드민을 `@vibers/admin-kit`으로 패키징하여 전 프로젝트 적용
3. **아임웹 수준 UX/UI**: 아임웹 관리자의 디자인 톤앤매너 참조 + 수파노바 디자인 스킬 적용

---

## ★ 디자인 원칙 — 아임웹 톤앤매너 + 수파노바

### 아임웹 UX/UI 참조 규칙

아임웹 관리자의 핵심 디자인 패턴을 따른다:

**레이아웃**:
- 왼쪽 고정 사이드바 (w-64) + 오른쪽 메인 컨텐츠 영역
- 사이드바: 섹션 그룹 + 서브메뉴 확장/축소 (아코디언)
- 상단 바: 사이트 선택기 + 빠른 설정 + 프로필
- 반응형: 모바일에서 사이드바 → 햄버거 드로어

**색상 (아임웹 기준 → 수파노바 적용)**:
```
배경:         #FAFAFA (밝은 회색) → 수파노바 Clean Structural 팔레트
사이드바:      #FFFFFF (흰색) + 미세한 오른쪽 보더
액센트:        #0673E2 (파란색) → 수파노바로 커스텀 (사이버펑크 네온 그린 가능)
텍스트:        #212121 (다크 차콜) / #666666 (보조)
카드 배경:     #FFFFFF + 미세 그림자 (shadow-sm)
위험 액션:     #E74C3C (빨강)
성공:          #27AE60 (초록)
경고:          #F39C12 (주황)
```

**컴포넌트 패턴**:
- 테이블: 스트라이프 행 + 호버 하이라이트 + 정렬 가능 컬럼 헤더
- 폼: 라벨-위-인풋 레이아웃, 필수 필드 *, 에러 상태 빨강 하이라이트
- 버튼: Primary(파란 solid), Secondary(회색 outlined), Danger(빨강)
- 모달: 타이틀 + 닫기(X) + 액션 버튼(저장/취소) + 배경 딤
- 토스트: 저장 완료, 상태 변경 알림
- 뱃지: 숫자 뱃지로 대기 항목 표시

**네비게이션 계층 (4단계)**:
```
L1: 섹션 헤더 (대시보드, 사이트관리, 쇼핑...)
  L2: 메뉴 항목 (상품, 주문, 환경설정...)
    L3: 서브메뉴 (상품등록, 상품목록...)
      L4: 탭 (기본정보, 이미지, 옵션...)
```

### 수파노바 디자인 스킬 적용 규칙

어드민 전용으로 수파노바를 변형 적용한다:

**적용하는 것**:
- 프리미엄 타이포그래피: Pretendard (한글) + Geist/Outfit (영문)
- `word-break: keep-all` (한글 텍스트)
- 미세 모션: `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`
- Glass 효과: 사이드바 `backdrop-blur-xl` + `border-white/10`
- 더블베젤 카드: 통계 카드에 적용
- `font-variant-numeric: tabular-nums` (숫자/통계)

**적용하지 않는 것 (어드민은 실용성 우선)**:
- 과도한 애니메이션 (MOTION_INTENSITY: 3으로 낮춤)
- 비대칭 벤토 그리드 (어드민은 정보 밀도가 중요)
- 풀블리드 히어로 (어드민에 불필요)
- 네온 글로우 (vibers 랜딩 전용 — 어드민은 클린)

**어드민 전용 팔레트 선택: Clean Structural**
```css
--admin-bg: #FAFAFA;
--admin-sidebar: #FFFFFF;
--admin-card: #FFFFFF;
--admin-accent: #0673E2;        /* 아임웹 블루 계열 */
--admin-accent-hover: #0559B3;
--admin-text: #1A1A1A;
--admin-text-muted: #6B7280;
--admin-border: #E5E7EB;
--admin-success: #10B981;
--admin-warning: #F59E0B;
--admin-danger: #EF4444;
```

---

## ★ 어드민 메뉴 구조

아임웹의 메뉴 계층을 참조하여, Vibers 총괄 어드민의 메뉴를 설계한다.

### /admin 라우트 맵

```
/admin                          ← 통합 대시보드 (모든 프로젝트 요약)
/admin/projects                 ← 프로젝트 총괄 현황
/admin/projects/[slug]          ← 개별 프로젝트 상세 (오류/배포/통계)
/admin/projects/[slug]/admin    ← 해당 프로젝트 어드민 프록시

/admin/stats                    ← 통합 통계/분석
/admin/stats/traffic            ← 전체 트래픽 분석
/admin/stats/revenue            ← 매출 분석
/admin/stats/users              ← 사용자 분석

/admin/members                  ← 통합 회원 관리
/admin/members/[id]             ← 회원 상세

/admin/orders                   ← 통합 주문 관리
/admin/orders/[id]              ← 주문 상세

/admin/products                 ← 통합 상품 관리

/admin/ads                      ← 광고 관리 (ai-recipe 연동)
/admin/ads/campaigns            ← 캠페인 목록
/admin/ads/creatives            ← 소재 관리
/admin/ads/stats                ← 광고 통계

/admin/sns                      ← SNS 연동 관리
/admin/sns/instagram            ← Instagram
/admin/sns/youtube              ← YouTube
/admin/sns/kakao                ← 카카오

/admin/content                  ← 콘텐츠 관리 (CMS)
/admin/content/notices          ← 공지사항
/admin/content/faqs             ← FAQ
/admin/content/inquiries        ← 문의 관리
/admin/content/banners          ← 배너 관리

/admin/seo                      ← SEO/AEO 설정 (기존 유지 + 확장)
/admin/seo/meta                 ← 메타태그/OG 관리
/admin/seo/sitemap              ← Sitemap 관리
/admin/seo/structured-data      ← 구조화 데이터
/admin/seo/aeo                  ← AI 검색 최적화

/admin/deploy                   ← 배포 관리 (총괄 전용)
/admin/deploy/status            ← 전체 프로젝트 배포 현황
/admin/deploy/errors            ← 오류 모니터링
/admin/deploy/health            ← 헬스체크 대시보드

/admin/legal                    ← 법무/약관 관리
/admin/legal/entities           ← 엔티티(법인/사업자) 관리
/admin/legal/privacy            ← 개인정보처리방침 (엔티티별 자동생성)
/admin/legal/terms              ← 이용약관 (엔티티별 자동생성)
/admin/legal/templates          ← 약관 템플릿 관리

/admin/settings                 ← 환경 설정
/admin/settings/general         ← 기본 정보
/admin/settings/domain          ← 도메인 설정
/admin/settings/auth            ← 인증 설정 (소셜 로그인 등)
/admin/settings/security        ← 보안 (IP 제한, 2FA)
/admin/settings/notifications   ← 알림 설정
/admin/settings/backup          ← 데이터 백업
```

### 사이드바 메뉴 그룹

```typescript
const adminMenu = [
  {
    group: '총괄',
    items: [
      { label: '대시보드', href: '/admin', icon: 'solar:home-2-bold' },
      { label: '프로젝트 현황', href: '/admin/projects', icon: 'solar:widget-bold', badge: 30 },
      { label: '배포/오류 관리', href: '/admin/deploy', icon: 'solar:server-bold' },
    ]
  },
  {
    group: '분석',
    items: [
      { label: '통합 통계', href: '/admin/stats', icon: 'solar:chart-bold' },
      { label: '광고 관리', href: '/admin/ads', icon: 'solar:megaphone-bold' },
    ]
  },
  {
    group: '운영',
    items: [
      { label: '회원 관리', href: '/admin/members', icon: 'solar:users-group-rounded-bold' },
      { label: '주문 관리', href: '/admin/orders', icon: 'solar:cart-large-bold' },
      { label: '상품 관리', href: '/admin/products', icon: 'solar:box-bold' },
    ]
  },
  {
    group: '콘텐츠',
    items: [
      { label: '공지/FAQ/문의', href: '/admin/content', icon: 'solar:document-bold' },
      { label: '배너 관리', href: '/admin/content/banners', icon: 'solar:gallery-bold' },
      { label: 'SNS 연동', href: '/admin/sns', icon: 'solar:share-bold' },
    ]
  },
  {
    group: 'SEO/마케팅',
    items: [
      { label: 'SEO 설정', href: '/admin/seo', icon: 'solar:magnifer-bold' },
      { label: 'AEO (AI 검색)', href: '/admin/seo/aeo', icon: 'solar:magic-stick-bold' },
    ]
  },
  {
    group: '법무/약관',
    items: [
      { label: '엔티티 관리', href: '/admin/legal/entities', icon: 'solar:buildings-bold' },
      { label: '개인정보처리방침', href: '/admin/legal/privacy', icon: 'solar:lock-bold' },
      { label: '이용약관', href: '/admin/legal/terms', icon: 'solar:document-text-bold' },
    ]
  },
  {
    group: '설정',
    items: [
      { label: '환경 설정', href: '/admin/settings', icon: 'solar:settings-bold' },
      { label: '보안', href: '/admin/settings/security', icon: 'solar:shield-bold' },
    ]
  }
];
```

---

## ★ 총괄 대시보드 — 킬러 기능

### 전체 프로젝트 모니터링

vibers 어드민의 핵심 차별점: **30개 프로젝트를 한 화면에서 관리**.

```
┌─────────────────────────────────────────────────────────────┐
│  📊 총괄 대시보드                         2026-03-28 토요일   │
├─────────┬──────────┬──────────┬──────────┬──────────────────┤
│ 활성 사이트│ 총 방문   │ 총 회원   │ 총 매출   │ 오류 발생      │
│   23/30  │ 12,456   │  8,901   │₩4.2M    │ 🔴 3건         │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│                                                             │
│  [프로젝트별 헬스체크 그리드]                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │FanEasy │ │Vibefolio│ │  DUS   │ │GOODZZ  │ │ai-recipe│  │
│  │ 🟢 OK  │ │ 🟢 OK  │ │ 🔴 ERR │ │ 🟡 WARN│ │ 🟢 OK  │  │
│  │ v2.1.0 │ │ v1.8.3 │ │ v3.0.1 │ │ v0.2.0 │ │ v1.5.2 │  │
│  │↑12% 트래│ │↑5% 트래 │ │DB연결오류│ │SSL만료임│ │↑20% 트래│  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│  ... (총 30개 프로젝트 카드)                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [30일 통합 트렌드]                 [오류/경고 로그]           │
│  ▁▃▅▇█▇▅▃▁ 방문자               │ • DUS: DB 연결 실패 10:30 │
│  ▁▂▃▄▅▅▄▃▂ 매출                 │ • GOODZZ: SSL 만료 D-7   │
│                                  │ • myratingis: 빌드 실패   │
├──────────────────────────────────┴──────────────────────────┤
│  [최근 배포]                      [최근 문의]                 │
│  • vibers v2.1.0 (3시간 전)      │ • FanEasy 김OO 결제 문의  │
│  • ai-recipe v1.5.2 (어제)       │ • DUS 박OO 주문 문의     │
└─────────────────────────────────────────────────────────────┘
```

### 프로젝트 헬스체크 API

각 프로젝트의 상태를 실시간 모니터링:

```typescript
interface ProjectHealth {
  slug: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  version: string;
  lastDeployed: Date;
  uptime: number;           // percentage
  responseTime: number;     // ms
  errorCount24h: number;
  trafficTrend: number;     // percentage change
  sslExpiresAt: Date;
  dbStatus: 'connected' | 'slow' | 'disconnected';
  alerts: Alert[];
}

// 헬스체크 엔드포인트 (각 프로젝트에 추가)
// GET /api/health → { status, version, uptime, db, memory }
```

---

## ★ 기존 장점 통합 매트릭스

각 프로젝트에서 가져올 기능을 명시한다.

### FanEasy에서 가져올 것
| 기능 | 파일/패턴 참조 | 적용 위치 |
|------|--------------|----------|
| 14탭 대시보드 구조 | `app/(admin)/` | 메뉴 구조 |
| Instagram OAuth | `lib/instagram/` | /admin/sns/instagram |
| 승인 워크플로우 | 초안→검토→승인→퍼블리시 | /admin/content |
| 활동 로그 시스템 | activity 탭 | /admin/deploy |
| 데이터 힐링 | 레거시 데이터 복구 | 유틸리티 |
| 다크모드 토글 | CSS 변수 스위칭 | /admin/settings |

### Vibefolio에서 가져올 것
| 기능 | 파일/패턴 참조 | 적용 위치 |
|------|--------------|----------|
| Recharts 복합차트 | admin/page.tsx (7/30일) | /admin/stats |
| 배너 관리 (순서+업로드) | admin/banners/ | /admin/content/banners |
| Tiptap WYSIWYG 에디터 | admin/notices/ | /admin/content/notices |
| Resend 이메일 발송 | api/admin/emails | /admin/content |
| SEO 메타데이터 관리 | admin/seo/ | /admin/seo |
| AdminGuard 3단계 인증 | AdminGuard.tsx | 인증 시스템 |
| Promise.all 병렬 로딩 | 대시보드 데이터 패칭 | 전역 |

### DUS에서 가져올 것
| 기능 | 파일/패턴 참조 | 적용 위치 |
|------|--------------|----------|
| 멀티테넌시 계층 | Agency → Sub-agency | 프로젝트 격리 |
| PDF 견적서 생성 | Prawn → react-pdf | /admin/orders |
| 주문 상태 머신 | pending→paid→shipped→completed | /admin/orders |
| Chart.js 6개월 트렌드 | admin/dashboard | /admin/stats |
| 벌크 오퍼레이션 | 체크박스 일괄 처리 | 전역 테이블 |
| 디자인 템플릿 미리보기 | iframe 프리뷰 | /admin/products |

---

## ★ 개발 순서 (AG에서 실행)

### Phase 1: 기반 (1~2일)

**Step 1.1: 어드민 레이아웃 + 사이드바**
```bash
# 생성할 파일들
app/admin/layout.tsx          # 사이드바 + 메인 영역 + 인증 가드
components/admin/Sidebar.tsx   # 아임웹 스타일 사이드바 (그룹+아코디언)
components/admin/Header.tsx    # 상단바 (프로젝트 선택기 + 프로필)
components/admin/StatCard.tsx  # 통계 카드 (더블베젤)
components/admin/DataTable.tsx # 범용 데이터 테이블 (정렬+검색+페이징)
```

**Step 1.2: 디자인 토큰 + CSS 변수**
```css
/* app/admin/admin.css */
:root {
  --admin-bg: #FAFAFA;
  --admin-sidebar: #FFFFFF;
  --admin-card: #FFFFFF;
  --admin-accent: #0673E2;
  --admin-accent-hover: #0559B3;
  --admin-text: #1A1A1A;
  --admin-text-muted: #6B7280;
  --admin-border: #E5E7EB;
  --admin-success: #10B981;
  --admin-warning: #F59E0B;
  --admin-danger: #EF4444;
  --admin-radius: 12px;
  --admin-transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Step 1.3: 인증 시스템 (Firebase → RBAC)**
- 기존 Firebase Auth 유지
- `lib/admin/auth.ts`: 역할 체크 (super_admin / admin / viewer)
- AdminGuard 컴포넌트 (Vibefolio 패턴 참조)

### Phase 2: 총괄 대시보드 (2~3일)

**Step 2.1: 프로젝트 헬스체크**
```bash
app/admin/page.tsx              # 총괄 대시보드
app/api/admin/health/route.ts   # 프로젝트 헬스체크 API
lib/admin/projects.ts           # 프로젝트 목록 + 상태 관리
```

각 프로젝트에 `/api/health` 엔드포인트 추가 → vibers에서 주기적 폴링.

**Step 2.2: 통합 통계**
```bash
app/admin/stats/page.tsx           # 통합 통계 대시보드
components/admin/TrendChart.tsx     # Recharts 트렌드 차트
components/admin/ProjectGrid.tsx    # 프로젝트 헬스 그리드
```

### Phase 3: 운영 기능 (3~5일)

**Step 3.1: 회원 관리** (Vibefolio 패턴)
**Step 3.2: 주문 관리** (DUS 패턴)
**Step 3.3: 콘텐츠 관리** (Vibefolio FAQ/공지 + FanEasy 워크플로우)
**Step 3.4: SEO/AEO** (기존 확장)

### Phase 4: 배포/오류 관리 (2~3일)

**Step 4.1: 배포 현황 대시보드**
```bash
app/admin/deploy/page.tsx          # 전체 배포 현황
app/admin/deploy/errors/page.tsx   # 오류 모니터링
app/api/admin/deploy/route.ts      # Vercel/NCP API 연동
```

**Step 4.2: 오류 모니터링**
- Vercel API 연동: 빌드 상태, 로그
- NCP API 연동: 서버 상태, 헬스체크
- SSL 만료 체크, 도메인 상태

### Phase 5: 패키지 추출 (2~3일)

**Step 5.1: @vibers/admin-kit 분리**
```bash
# 패키지 구조
packages/admin-kit/
├── src/
│   ├── components/   # Sidebar, Header, StatCard, DataTable, Chart...
│   ├── hooks/        # useAdmin, useStats, useHealth, useSEO...
│   ├── adapters/     # SupabaseAdapter, FirestoreAdapter, RailsAdapter
│   ├── types/        # 공통 타입
│   └── index.ts
├── package.json      # @vibers/admin-kit
└── tsconfig.json
```

**Step 5.2: 다른 프로젝트에 적용**
```typescript
// 각 프로젝트에서:
import { AdminLayout, useStats, SupabaseAdapter } from '@vibers/admin-kit';

const adapter = new SupabaseAdapter(supabase);
// → 나머지는 자동으로 어드민 메뉴 생성
```

---

## ★ 수파노바 스킬 설치 (vibers 프로젝트)

AG에서 수파노바 스킬을 어드민 개발에 활용하려면:

**1) 스킬 파일 복사**
```bash
mkdir -p dev/nextjs/apps/vibers/skills
cp dev/nextjs/apps/myratingis/skills/taste-skill.md dev/nextjs/apps/vibers/skills/
cp dev/nextjs/apps/myratingis/skills/soft-skill.md dev/nextjs/apps/vibers/skills/
cp dev/nextjs/apps/myratingis/skills/redesign-skill.md dev/nextjs/apps/vibers/skills/
cp dev/nextjs/apps/myratingis/skills/output-skill.md dev/nextjs/apps/vibers/skills/
```

**2) CLAUDE.md에 참조 추가** (아래 섹션 참조)

**3) AG에서 로드**
```
AG 터미널에서: /read skills/taste-skill.md 후 작업 시작
```

---

## ★ 전 프로젝트 공통 적용 방법

### 방법 A: /api/health 엔드포인트 일괄 추가

모든 프로젝트에 아래 엔드포인트를 추가하면, vibers 총괄 어드민에서 모니터링 가능:

```typescript
// app/api/health/route.ts (Next.js 프로젝트)
export async function GET() {
  const health = {
    status: 'healthy',
    version: process.env.npm_package_version || '0.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    db: await checkDatabaseConnection(), // 프로젝트별 구현
  };
  return Response.json(health);
}
```

```ruby
# config/routes.rb (Rails 프로젝트)
get '/api/health', to: 'health#show'
```

### 방법 B: @vibers/admin-kit 설치

```bash
# 각 프로젝트에서
bun add @vibers/admin-kit

# app/admin/layout.tsx 에서
import { AdminLayout } from '@vibers/admin-kit';
import { SupabaseAdapter } from '@vibers/admin-kit/adapters';
```

프로젝트별 설정 파일 하나만 작성:

```typescript
// admin.config.ts
export const adminConfig = {
  projectName: 'FanEasy',
  adapter: 'firestore',       // 또는 'supabase', 'rails'
  features: {
    orders: true,
    products: true,
    members: true,
    sns: ['instagram'],
    seo: true,
    ads: false,
  },
  theme: 'light',              // 또는 'dark', 'auto'
  accentColor: '#0673E2',
};
```

---

## ★ 프로젝트 목록 (vibers에서 관리할 대상)

```typescript
const VIBERS_PROJECTS = [
  // Next.js 앱 (23개)
  { slug: 'faneasy', name: 'FanEasy', domain: 'faneasy.co.kr', db: 'firestore', priority: 'P0' },
  { slug: 'vibefolio', name: 'Vibefolio', domain: 'vibefolio.com', db: 'supabase', priority: 'P0' },
  { slug: 'ai-recipe', name: 'AI Recipe', domain: 'ai-recipe.co.kr', db: 'supabase', priority: 'P0' },
  { slug: 'goodzz', name: 'GOODZZ', domain: 'goodzz.co.kr', db: 'supabase', priority: 'P1' },
  { slug: 'myratingis', name: 'MyRatingIs', domain: 'myratingis.com', db: 'supabase', priority: 'P1' },
  { slug: 'premiumpage', name: 'PremiumPage', db: 'none', priority: 'P2' },
  { slug: 'agency-landing', name: 'Agency Landing', priority: 'P2' },
  { slug: 'aiwar', name: 'AI War', priority: 'P3' },
  { slug: 'art-way', name: 'Art Way', priority: 'P2' },
  { slug: 'arthyun', name: 'Arthyun', priority: 'P2' },
  { slug: 'artpage', name: 'ArtPage', priority: 'P2' },
  { slug: 'everyones-ai', name: "Everyone's AI", priority: 'P2' },
  { slug: 'jcatalog', name: 'JCatalog', priority: 'P2' },
  { slug: 'kess', name: 'KESS', priority: 'P2' },
  { slug: 'lightstar', name: 'LightStar', priority: 'P2' },
  { slug: 'my-next-guide', name: 'My Next Guide', priority: 'P3' },
  { slug: 'oceantechlab', name: 'OceanTechLab', priority: 'P2' },
  { slug: 'richlychee', name: 'RichLychee', priority: 'P2' },
  { slug: 'semophone', name: 'SemoPhone', priority: 'P2' },
  { slug: 'vibefolio-app', name: 'Vibefolio App', priority: 'P2' },
  { slug: 'whymove', name: 'WhyMove', priority: 'P2' },

  // Rails 앱 (7개)
  { slug: 'dus', name: 'DUS', domain: 'dus.co.kr', db: 'postgresql', priority: 'P0' },
  { slug: 'dlab-site', name: 'DLab Site', db: 'postgresql', priority: 'P1' },
  { slug: 'gabojago', name: 'Gabojago', db: 'postgresql', priority: 'P2' },
  { slug: 'matecheck', name: 'MateCheck', db: 'postgresql', priority: 'P2' },
  { slug: 'nusucheck', name: 'NusuCheck', db: 'postgresql', priority: 'P2' },
  { slug: 'runnersconnect', name: 'RunnersConnect', db: 'postgresql', priority: 'P2' },
];
```

---

## ★ 최종 CLAUDE.md 추가 내용

아래 섹션을 vibers의 `CLAUDE.md` 맨 위에 추가:

```markdown
## ★ 통합 어드민 시스템 (최우선 개발)
- **총괄 계획서**: `docs/ADMIN_MASTER_PLAN.md` — 반드시 먼저 읽을 것
- **설계 문서**: `docs/09_UNIFIED_ADMIN_SYSTEM.md` (mission7 폴더)
- **디자인 원칙**: 아임웹 톤앤매너 + 수파노바 Clean Structural
- **수파노바 스킬**: `skills/` 폴더 — 어드민 개발 시 taste-skill.md 참조
- **목표**: vibers/admin을 모든 Vibers 프로젝트의 총괄 관리 허브로 구축
- **패키지**: 완성 후 @vibers/admin-kit으로 추출하여 전 프로젝트 적용
```

---

---

## ★ 법무/약관 관리 모듈

### 엔티티 마스터 파일

모든 법인/사업자 정보는 **루트의 `entity.md`**에서 관리한다.

**참조 경로**: `/macminim4/entity.md` (워크스페이스 루트)

entity.md가 변경되면, 어드민에서 해당 엔티티 소속 프로젝트들의 약관/개인정보처리방침을 자동으로 업데이트한다.

### 엔티티 목록 (5개 법인/사업자)

| 엔티티 | 대표자 | 사업자번호 | 소속 프로젝트 |
|--------|--------|-----------|-------------|
| **위로** (개인) | 김정원 | 545-16-01046 | FanEasy, AI Recipe, GOODZZ, Vibers |
| **주식회사 디어스** | 이준호 | 449-81-02594 | Vibefolio, MyRatingIs, DUS, WhyMove, Gabojago |
| **주식회사 디랩** | 이준호 | 617-86-11575 | PremiumPage, DLab Site |
| **주식회사 오션해양테크** | 조제복 | - | OceanTechLab, 알마이너 |
| **주식회사 승승장구** | 최준철 | - | SemoPhone |

### /admin/legal/entities — 엔티티 관리 페이지

```typescript
interface Entity {
  id: string;
  name: string;             // "위로", "주식회사 디어스"
  type: 'individual' | 'corporation';  // 개인/법인
  representative: string;   // 대표자명
  businessNumber: string;   // 사업자등록번호
  address?: string;         // 사업장 소재지
  phone?: string;           // 대표 전화번호
  email?: string;           // 대표 이메일
  projects: string[];       // 소속 프로젝트 슬러그 배열
}
```

**기능**:
- 엔티티 CRUD (추가/수정/삭제)
- 프로젝트 ↔ 엔티티 매핑 관리 (드래그앤드롭)
- entity.md 자동 동기화 (어드민에서 수정 시 entity.md 자동 업데이트)

### /admin/legal/privacy — 개인정보처리방침 생성기

**엔티티를 선택하면 해당 법인의 개인정보처리방침을 자동 생성.**

```
[엔티티 선택: 위로 ▾]  [프로젝트: FanEasy ▾]  [생성하기]

┌─────────────────────────────────────────────┐
│  팬이지 개인정보처리방침                        │
│                                             │
│  위로(이하 '회사')는 「개인정보보호법」에 따라   │
│  이용자의 개인정보를 보호하고...               │
│                                             │
│  1. 개인정보의 수집 및 이용 목적              │
│  2. 수집하는 개인정보의 항목                  │
│  3. 개인정보의 보유 및 이용기간               │
│  4. 개인정보의 제3자 제공                    │
│  5. 개인정보의 파기절차 및 방법               │
│  6. 개인정보 처리의 위탁                     │
│  7. 이용자의 권리·의무 및 행사방법            │
│  8. 개인정보 보호책임자                      │
│  9. 개인정보 처리방침의 변경                  │
│                                             │
│  [HTML 복사]  [마크다운 복사]  [페이지에 적용]  │
└─────────────────────────────────────────────┘
```

**자동 삽입 필드**:
- 회사명, 대표자, 사업자등록번호 → entity.md에서 자동 로드
- 서비스명 → 프로젝트 설정에서 로드
- 수집항목 → 프로젝트별 커스텀 (이름, 이메일, 결제정보 등 체크박스)
- 보유기간 → 프로젝트별 설정 (회원 탈퇴 시/1년/3년/5년)
- 보호책임자 → 엔티티 대표자 기본값

### /admin/legal/terms — 이용약관 생성기

**개인정보처리방침과 동일한 UX. 엔티티+프로젝트 선택 → 자동 생성.**

**포함 조항**:
- 제1조 (목적)
- 제2조 (정의)
- 제3조 (약관의 게시 및 변경)
- 제4조 (서비스 제공)
- 제5조 (회원가입)
- 제6조 (회원탈퇴 및 자격상실)
- 제7조 (이용요금 및 결제) — 유료 서비스 시
- 제8조 (환불정책) — 전자상거래법 기준
- 제9조 (회사의 의무)
- 제10조 (회원의 의무)
- 제11조 (지적재산권)
- 제12조 (면책사항)
- 제13조 (분쟁해결)

**프로젝트별 커스텀 옵션**:
- [ ] 유료 서비스 포함 (결제/환불 조항 추가)
- [ ] 사용자 생성 콘텐츠 (UGC 조항 추가)
- [ ] 제3자 서비스 연동 (소셜 로그인, 결제 PG 등)
- [ ] 미성년자 이용 제한

### /admin/legal/templates — 약관 템플릿 관리

**재사용 가능한 약관 템플릿을 관리.**

```typescript
interface LegalTemplate {
  id: string;
  type: 'privacy' | 'terms' | 'refund' | 'marketing';
  name: string;           // "기본 개인정보처리방침", "쇼핑몰용 이용약관"
  version: string;        // "v2.1"
  content: string;        // 마크다운/HTML 본문
  variables: string[];    // 치환 변수 ["{{회사명}}", "{{대표자}}", "{{서비스명}}"]
  applicableEntities: string[];  // 적용 가능 엔티티
  lastUpdated: Date;
  publishedAt?: Date;
}
```

**템플릿 종류**:
- 기본 개인정보처리방침 (개인사업자용 / 법인용)
- 기본 이용약관 (무료서비스용 / 유료서비스용)
- 쇼핑몰 이용약관 (전자상거래법 준수)
- 마케팅 정보 수신 동의서
- 환불 정책

---

> **AG에게**: 이 문서를 처음부터 끝까지 읽은 후, Phase 1 → Step 1.1부터 순서대로 개발을 시작하세요.
> 각 Phase 완료 시 LEO에게 진행 상황을 보고하세요.
