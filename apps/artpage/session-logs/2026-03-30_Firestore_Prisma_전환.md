# Firestore → Prisma 전환 작업
- 날짜: 2026-03-30
- 에이전트: [TCC]

## 세션 개요
artpage 앱의 Firestore(Firebase) 데이터 조회를 모두 Prisma(NCP PostgreSQL)로 전환하고,
Firebase Storage 업로드를 NCP /api/upload 프록시로 교체.

## 주요 논의 및 결정사항

### 전환 전략
- `import { prisma } from '@/lib/db'` 로 통일
- server component에서 직접 prisma 호출
- `site_slug` 컬럼으로 arthyun/art-way 구분
- /api/upload route는 이미 존재했으므로 upload.ts만 수정

### is_visible 필드 추가
- arthyun/media, art-way/media, [slug]/media 모두 `is_visible: true` 필터 추가
  (기존 Firestore 코드에는 필터 없이 전체 조회였으나 Prisma 전환 시 개선)

## 기술적 상세

### 수정된 파일 목록 (11개)
1. `src/lib/upload.ts` — Firebase Storage → /api/upload NCP 프록시
2. `src/app/(artists)/arthyun/page.tsx` — portfolios + main_settings → Portfolio + site_settings
3. `src/app/(artists)/arthyun/media/page.tsx` — media_releases Firestore → Prisma
4. `src/app/(artists)/arthyun/media/[id]/page.tsx` — doc id(string) → parseInt(id)
5. `src/app/(artists)/arthyun/artists/page.tsx` — portfolios Firestore → Prisma (Instagram fallback 유지)
6. `src/app/(artists)/arthyun/sitemap.ts` — media_releases Firestore → Prisma
7. `src/app/(artists)/art-way/page.tsx` — exhibitions + main_banner Firestore → Prisma
8. `src/app/(artists)/art-way/archive/page.tsx` — exhibitions Firestore → Prisma
9. `src/app/(artists)/art-way/media/page.tsx` — media_releases Firestore → Prisma
10. `src/app/(artists)/art-way/media/[id]/page.tsx` — doc id(string) → parseInt(id)
11. `src/app/(artists)/[slug]/page.tsx` — arthyun + art-way 메인 Firestore → Prisma
12. `src/app/(artists)/[slug]/archive/page.tsx` — exhibitions Firestore → Prisma
13. `src/app/(artists)/[slug]/media/page.tsx` — media_releases Firestore → Prisma
14. `src/app/(artists)/[slug]/artists/page.tsx` — portfolios Firestore → Prisma

### arthyun/layout.tsx
- hardcoded Firebase Storage URL → NCP storage.vibers.co.kr URL로 교체

### 남은 Firebase 사용처 (의도적으로 미전환)
- `arthyun/media/migrated/[id]/page.tsx` — WordPress 이전 데이터 전용, Prisma 스키마 없음
- `arthyun/api/instagram/callback/route.ts` — Instagram OAuth 토큰 저장 (별도 전환 필요)
- 각종 admin 페이지, auth 페이지 — 지시사항 범위 외

## 향후 계획
- admin 페이지들의 Firestore → Prisma 전환 (별도 세션)
- arthyun/api/instagram/callback route의 site_settings Prisma 전환
- migrated_posts 테이블 Prisma 스키마 추가 여부 결정
