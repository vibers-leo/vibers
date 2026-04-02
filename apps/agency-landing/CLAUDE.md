## 전략 문서 (개발 전 반드시 숙지)
- **전략 진단 리포트**: `data/STRATEGY_ANALYSIS.md`
- **PM 공통 지침**: 맥미니 루트 `pm.md`
- **gstack 빌더 철학**: 맥미니 루트 `gstack.md` — Boil the Lake, Search Before Building, 스프린트 프로세스
- **개발 프로세스**: Think → Plan → Build → Review → Test → Ship → Reflect
- **핵심 규칙**: 테스트 동시 작성, 새 패턴 도입 전 검색, 압축률 기반 추정

### 전략 핵심 요약
- 프리랜서 대행사 빠른 브랜딩 도구 — 30개 테마 조합형
- Tailwind CSS 4 + Framer Motion 애니메이션 레퍼런스
- 실시간 커스터마이징 기능 추가로 확장성 개선

---

# Agency Landing (1인 마케팅 대행사 랜딩 페이지)

## 프로젝트 개요
1인 마케팅 대행사를 위한 30가지 디자인 테마 쇼케이스 랜딩 페이지.
각 테마별 컬러/폰트/레이아웃이 최적화된 프리뷰를 제공한다. Tier C (단순 랜딩).

## 기술 스택
- Framework: Next.js 16
- Language: TypeScript
- 스타일: Tailwind CSS 4 (CSS-first 설정)
- 애니메이션: framer-motion 12
- 아이콘: lucide-react
- 유틸: clsx + tailwind-merge
- Package Manager: bun

## 디렉토리 구조
```
agency-landing/
├── src/
│   ├── app/
│   │   ├── design/[id]/page.tsx  ← 개별 테마 프리뷰 페이지
│   │   ├── globals.css           ← 기본 CSS 변수
│   │   ├── layout.tsx            ← 루트 레이아웃 (Geist 폰트)
│   │   └── page.tsx              ← 메인 페이지 (30개 테마 그리드)
│   ├── components/
│   │   ├── landing/
│   │   │   ├── HeroProblem.tsx      ← 히어로/문제 제기 섹션
│   │   │   ├── PricingFooter.tsx    ← 가격/푸터 섹션
│   │   │   ├── SolutionServices.tsx ← 솔루션/서비스 섹션
│   │   │   └── ThemeWrapper.tsx     ← 테마 적용 래퍼
│   │   └── TemplateView.tsx         ← 템플릿 뷰 컴포넌트
│   ├── data/
│   │   └── content.ts              ← 콘텐츠 데이터
│   └── lib/
│       ├── themes.ts               ← 30개 테마 정의 (색상/폰트/모양)
│       └── utils.ts                ← 유틸리티 함수
├── package.json
└── postcss.config.mjs
```

## 개발 규칙

### 코드 스타일
- 시맨틱 라인 브레이크: UI 텍스트는 의미 단위로 줄바꿈
- 한글 우선 원칙: 모든 UI 텍스트와 주석은 한국어
- TypeScript strict mode 사용

### 디자인 준수
- 메인 페이지: 다크 배경 (`bg-neutral-950`)
- 테마 시스템: `src/lib/themes.ts`에 정의된 30개 테마
- 폰트: Geist Sans / Geist Mono
- Tailwind CSS 4 (CSS-first, `@import "tailwindcss"`)
- 상세 가이드: DESIGN_GUIDE.md 참조

### Git 규칙
- 커밋 메시지: 한글 (feat:, fix:, refactor:, chore: 접두사), [TCC] 태그
- 브랜치: main → feature/기능명
- PR 필수 (셀프 리뷰 가능)

### 배포
- 대상 서버: NCP (server.vibers.co.kr)
- Docker 컨테이너 기반 배포 예정
- CI/CD: GitHub Actions

## 주요 명령어
```bash
bun install                                   # 의존성 설치
bun dev                                       # 개발 서버
bun run build                                 # 빌드
bun run lint                                  # 린트

# 모노레포 루트에서 실행
bun run dev --filter=@vibers/agency-landing   # 개별 개발 서버
bun run build --filter=@vibers/agency-landing # 개별 빌드
```

## AI Recipe 이미지 API

이 프로젝트는 **AI Recipe 중앙 이미지 서비스**를 사용합니다.

### 사용 가능한 함수

```typescript
import { searchStockImage, generateAIImage } from '@/lib/ai-recipe-client';
```

### Stock Image 검색
```typescript
const image = await searchStockImage('marketing agency office', {
  orientation: 'landscape',
  size: 'large',
});
// → { url, provider, alt, photographer, ... }
```

### AI 이미지 생성
```typescript
const image = await generateAIImage('professional agency landing page hero, modern gradient design', {
  size: 'large',
  provider: 'auto',
});
// → { url, prompt, provider }
```

### 주요 용도
- 테마 프리뷰 이미지
- 히어로 섹션 배경
- 서비스 아이콘/일러스트

### 주의사항
- Server Action이나 API Route에서만 사용 (API 키 보호)
- Rate Limit: 1000회/일
- AI Recipe 서버 실행 필요: http://localhost:3300

## 상위 브랜드
- 회사: 계발자들 (Vibers)
- 도메인: vibers.co.kr
- 서버: server.vibers.co.kr


## 세션로그 기록 (필수)
- 모든 개발 대화의 주요 내용을 `session-logs/` 폴더에 기록할 것
- 파일명: `YYYY-MM-DD_한글제목.md` / 내용: 한글
- 세션 종료 시, 마일스톤 달성 시, **컨텍스트 압축 전**에 반드시 저장
- 상세 포맷은 상위 CLAUDE.md 참조
