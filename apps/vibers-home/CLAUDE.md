# Vibers (계발자들 공식 사이트)

## ★ 통합 어드민 시스템 (최우선 개발)
- **총괄 계획서**: `docs/ADMIN_MASTER_PLAN.md` — 반드시 먼저 읽을 것
- **설계 문서**: mission7 `docs/09_UNIFIED_ADMIN_SYSTEM.md`
- **디자인 원칙**: 아임웹 톤앤매너 + 수파노바 Clean Structural 팔레트
- **수파노바 스킬**: `skills/` 폴더 — 어드민 UI 개발 시 taste-skill.md 참조
- **목표**: vibers/admin을 모든 Vibers 프로젝트(30개)의 총괄 관리 허브로 구축
- **패키지**: 완성 후 @vibers/admin-kit으로 추출하여 전 프로젝트 적용
- **사용순서**: taste-skill → soft-skill → output-skill (신규) / redesign-skill (리디자인)

## 전략 문서 (개발 전 반드시 숙지)
- **전략 진단 리포트**: `data/STRATEGY_ANALYSIS.md` — 브랜드 포지셔닝, 가격 프레이밍, 타겟 세그먼트, Growth Loop
- **린캔버스 v3**: `data/CTO_LEAN_CANVAS.md` — 고객 인터뷰 기반 비즈니스 모델
- **사업개발 워크북**: `data/WORKBOOK.md` — 창업자 프로필, 재무 계획, GTM
- **PM 공통 지침**: 맥미니 루트 `pm.md` — PM Skills 프레임워크
- **gstack 빌더 철학**: 맥미니 루트 `gstack.md` — Boil the Lake, Search Before Building, 스프린트 프로세스
- **개발 프로세스**: Think → Plan → Build → Review → Test → Ship → Reflect
- **핵심 규칙**: 테스트 동시 작성, 새 패턴 도입 전 검색, 압축률 기반 추정

### 전략 핵심 요약
- 서브타이틀 필수: "계발자들 — 사장님의 기술 파트너"
- 가격 티어: "기본 관리 / 전담 관리 / 기술 파트너" (CTO 구독/BASIC/PRO/MASTER 표현 지양)
- 타겟: 소상공인 대표 (예산 100~500만원)
- UVP: "홈페이지 제작부터 관리까지, 월 관리비 하나로"
- "구독"이라는 단어 사용 금지 → "관리비", "유지관리비" 표현 사용

## 프로젝트 개요
바이버스(vibers.co.kr) 공식 브랜드 사이트. 계발자들의 플래그십 웹사이트로, 사이버펑크 디자인 아이덴티티와 Framer Motion 애니메이션이 핵심 특징.

## 상위 브랜드
- 회사: 계발자들 (Vibers)
- 도메인: vibers.co.kr
- 서버: server.vibers.co.kr

## 기술 스택
- Framework: Next.js 16.1 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS 4 (CSS 변수 기반, `@import "tailwindcss"`)
- Animation: Framer Motion 12
- Icons: Lucide React
- Package Manager: bun (권장) / npm

## 디자인 아이덴티티
- 테마: 사이버펑크 / 네온 / 다크 모드 전용
- Primary: `#39FF14` (네온 그린)
- Background: `#050505` (다크)
- 라이트 모드 없음 — 항상 다크 배경
- 상세 디자인 규칙: `DESIGN_GUIDE.md` 참조

## 프로젝트 구조
```
vibers/
├── app/
│   ├── layout.tsx       ← 루트 레이아웃
│   ├── page.tsx         ← 메인 랜딩 페이지
│   ├── globals.css      ← CSS 변수 + 글로벌 스타일
│   └── projects/        ← 프로젝트 소개 섹션
│       └── app/         ← 중첩 라우트
└── package.json
```

## 핵심 파일
- `app/globals.css`: CSS 커스텀 프로퍼티 (`--primary`, `--bg`, `--surface`, `--border`, `--text-muted`)
- Tailwind CSS 4 사용 — `tailwind.config.ts` 없이 CSS-first 설정

## 개발 규칙

### 코드 스타일
- 시맨틱 라인 브레이크: UI 텍스트는 의미 단위로 줄바꿈
- 한글 우선 원칙: 모든 UI 텍스트와 주석은 한국어
- TypeScript strict mode 사용

### 스타일링 주의사항
- Tailwind CSS 4 사용 중 — `@import "tailwindcss"` 방식
- 색상은 CSS 변수(`var(--primary)` 등) 우선 사용
- 네온 글로우 효과: `box-shadow`/`text-shadow`로 구현
- 인라인 스타일과 Tailwind 혼용 가능 (CSS 변수 참조 시)

### 디자인 준수
- 반응형 브레이크포인트: 640, 768, 1024, 1280px
- 폰트: Pretendard (한글) + Poppins (영문 제목)
- Tailwind CSS 유틸리티 클래스 사용
- 접근성: WCAG 2.1 AA 기준

### Git 규칙
- 커밋 메시지: 한글 (feat:, fix:, refactor:, chore: 접두사)
- 브랜치: main → feature/기능명
- PR 필수 (셀프 리뷰 가능)

### 배포
- 현재: Vercel
- 이전 예정: NCP (server.vibers.co.kr) Docker 컨테이너 기반
- CI/CD: GitHub Actions

## 주요 명령어
```bash
bun install        # 의존성 설치
bun dev            # 개발 서버 (포트 3800)
bun run build      # 빌드
bun test           # 테스트
```

## 특이사항
- 이 앱은 Tailwind CSS 4를 사용하며, 다른 앱들(art-way, arthyun)은 Tailwind CSS 3을 사용
- `tailwind.config.ts` 파일이 없음 — CSS-first 설정 방식
- 스크롤바도 커스텀 네온 스타일 적용 (4px, 네온 그린)


## 세션로그 기록 (필수)
- 모든 개발 대화의 주요 내용을 `session-logs/` 폴더에 기록할 것
- 파일명: `YYYY-MM-DD_한글제목.md` / 내용: 한글
- 세션 종료 시, 마일스톤 달성 시, **컨텍스트 압축 전**에 반드시 저장
- 상세 포맷은 상위 CLAUDE.md 참조
