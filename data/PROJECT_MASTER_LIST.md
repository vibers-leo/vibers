# 계발자들 (Vibers) — 전체 프로젝트 마스터 리스트

> 최종 업데이트: 2026-03-25
> 용도: projects.ts 데이터 소스, 포트폴리오 기초 자료, 관리자 페이지 CRUD 기준

---

## NEXTJS/APPS (Vercel 배포)

### 핵심 프로젝트 (featured: true)

| slug | 이름 | 영문명 | 한줄 설명 | 상태 | 카테고리 | 폴더 | GitHub | 기술스택 |
|------|------|--------|----------|------|---------|------|--------|---------|
| vibers | 바이버스 | Vibers | 모바일 AI 코딩 작업실 — 어디서든 코딩하다 | development | app | nextjs/apps/vibers | vibers-leo/vibers | Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion |
| faneasy | 팬이지 | FanEasy | 인플루언서·소상공인 홈페이지를 3일만에 | live | platform | nextjs/apps/faneasy | vibers-leo/faneasy | Next.js, Firebase, Firestore, Tailwind CSS |
| myratingis | 제평가는요? | MyRatingIs | AI가 프로젝트의 진짜 가치를 평가합니다 | beta | app | nextjs/apps/myratingis | vibers-leo/myratingis | Next.js 14, Supabase, Google Gemini Pro |
| aiwar | AI워 | AIWar | AI 전략 대전 게임 — 실시간 PVP | development | app | nextjs/apps/aiwar (frontend/) | vibers-leo/aiwar | Next.js, Firebase, Firestore |
| ai-recipe | AI레시피 | AI Recipe | AI 이미지 생성 + 레시피 관리 도우미 | development | app | nextjs/apps/ai-recipe | juuuno-coder/Airecipe | Next.js, Docker, Oracle Cloud |

### 서비스 프로젝트

| slug | 이름 | 영문명 | 한줄 설명 | 상태 | 카테고리 | 폴더 | GitHub |
|------|------|--------|----------|------|---------|------|--------|
| artpage | 북촌 아트스페이스 | Artpage | 북촌 예술 공간 안내 사이트 | live | service | nextjs/apps/artpage | vibers-leo/artpage |
| richlychee | 리치리치 | Richlychee | (프로젝트 상세 확인 필요) | development | platform | nextjs/apps/richlychee | vibers-leo/richlychee |
| premiumpage | 전자카탈로그 | PremiumPage | 프리미엄 전자 카탈로그 서비스 | development | tool | nextjs/apps/premiumpage | vibers-leo/premiumpage |
| semophone | 세모폰 | Semophone | 세상의 모든 휴대폰 — 폰 비교 플랫폼 | development | platform | nextjs/apps/semophone | vibers-leo/semophone |
| lightstar | 바이브 철학관 | Lightstar | AI 운세·철학 상담 플랫폼 | development | service | nextjs/apps/lightstar | vibers-leo/lightstar |
| myaiprintshop | 마이AI프린트샵 | MyAIPrintShop | AI 기반 프린트 디자인 서비스 | development | service | nextjs/apps/myaiprintshop | vibers-leo/myaiprintshop |
| everyones-ai | 모두의AI | Everyone's AI | AI 교육·체험 플랫폼 | development | platform | nextjs/apps/everyones-ai | vibers-leo/everyones-ai |
| whymove | 와이무브 | WhyMove | (이사·부동산 관련 추정) | development | service | nextjs/apps/whymove | vibers-leo/whymove |
| kess | K-ECO CERT | KESS | 한국환경자격연구원 | development | service | nextjs/apps/kess | vibers-leo/kess |
| rminu | 오션해양테크 | Rminu | 해양 기술 기업 사이트 | development | service | nextjs/apps/rminu | vibers-leo/oceantech |

### 브랜드·랜딩 페이지

| slug | 이름 | 영문명 | 한줄 설명 | 상태 | 카테고리 | 폴더 | GitHub |
|------|------|--------|----------|------|---------|------|--------|
| agency-landing | 1인 마케팅 대행사 | Agency Landing | 마케팅 대행사 랜딩 페이지 | concept | service | nextjs/apps/agency-landing | vibers-leo/agency-landing |
| art-way | 아트웨이 | Art-Way | (아트 관련 프로젝트) | development | service | nextjs/apps/art-way | vibers-leo/art-way |
| arthyun | 아트현 | Arthyun | (아트·작가 관련) | development | service | nextjs/apps/arthyun | vibers-leo/arthyun |
| my-next-guide | 마이넥스트가이드 | My Next Guide | (가이드·교육 서비스) | development | tool | nextjs/apps/my-next-guide | vibers-leo/my-next-guide |

### 모바일 앱 (Expo)

| slug | 이름 | 영문명 | 한줄 설명 | 상태 | 카테고리 | 폴더 | GitHub |
|------|------|--------|----------|------|---------|------|--------|
| vibefolio-app | 바이브폴리오 앱 | Vibefolio App | 창작자 프로젝트 공유 플랫폼 (모바일) | development | app | nextjs/apps/vibefolio-app | vibers-leo/vibefolio-app |
| vibefolio-nextjs | 바이브폴리오 웹 | Vibefolio Web | 창작자 프로젝트 공유 플랫폼 (웹) | development | platform | nextjs/apps/vibefolio-nextjs | vibers-vibefolio/vivefolio-nextjs-src |

---

## RAILS (NCP Docker 배포)

| slug | 이름 | 영문명 | 한줄 설명 | 상태 | 포트 | 폴더 | GitHub | 비고 |
|------|------|--------|----------|------|------|------|--------|------|
| nusucheck | 누수체크 | NusuCheck | 누수 탐지·진단·수리 서비스 | live | 4080 | rails/nusucheck | vibers-leo/nusucheck | app+sidekiq+redis+db |
| dus | 디어스 | DUS | 디랩 통합 서비스 플랫폼 | live | 4040 | rails/dus | vibefolio/dus | 구 dlab 리브랜딩 |
| gabojago | 가보자고 | Gabojago | 모바일 초대장 + 와요 통합 | live | 4020 | rails/gabojago | juuuno-coder/wayo | wayo 포함 |
| matecheck | 메이트체크 | MateCheck | 룸메이트 매칭 서비스 | live | 4010 | rails/matecheck | juuuno-coder/matecheck | 모노레포(backend+frontend Expo) |
| runnersconnect | 러너스커넥트 | Runner's Connect | 러닝 커뮤니티 매칭 | live | 4070 | rails/runnersconnect | juuuno-coder/runnersconnect | Puma 7.2.0 |

---

## 서비스 (프로젝트 아닌 별도 서비스)

| slug | 이름 | 한줄 설명 | 상태 | 비고 |
|------|------|----------|------|------|
| cto-service | CTO 구독 서비스 | CTO를 빌려드립니다 — 기술 자문 구독 | concept | BASIC 50/PRO 200/MASTER 500만원 |

---

## 배포 인프라 요약

| 인프라 | 용도 | 프로젝트 |
|--------|------|---------|
| Vercel | Next.js 프론트엔드 | nextjs/apps 전체 (21개) |
| NCP Docker | Rails API 백엔드 | rails 전체 (5개) |
| Oracle Cloud | ai-recipe 전용 | ai-recipe (Always Free Tier) |
| Cloudflare | DNS + SSL | vibers.co.kr 전체 도메인 |

---

## 데이터 관리 방향

1. **현재**: `data/projects.ts` 하드코딩 → 사이트 빌드 시 반영
2. **목표**: 관리자 페이지(`/admin`)에서 CRUD → DB(Supabase) 저장 → 사이트에 실시간 반영
3. **포트폴리오 활용**: 이 리스트를 기반으로 외부 포트폴리오·사례집 자동 생성
