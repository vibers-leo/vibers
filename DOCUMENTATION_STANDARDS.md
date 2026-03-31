# Vibers Platform — 문서화 기준

> 새 앱 추가 시 반드시 이 기준에 따라 문서를 작성한다.

## 필수 문서 (모든 앱)

| 파일 | 용도 | 참조 |
|------|------|------|
| **CLAUDE.md** | 앱 개요, 기술 스택, 개발 규칙, 프로젝트 구조 | `apps/faneasy/CLAUDE.md` (Tier A), `apps/artpage/CLAUDE.md` (Tier B) |
| **DESIGN_GUIDE.md** | 브랜드 컬러, 폰트, 간격, 반응형 규칙 | `apps/artpage/DESIGN_SYSTEM.md` |
| **STATUS.md** | 현재 상태, 완료/미완료 체크리스트, 다음 액션 | 루트 `STATUS.md` |

## 선택 문서 (해당 시)

| 파일 | 조건 | 참조 |
|------|------|------|
| **COLLABORATION.md** | 멀티 에이전트 협업 시 | `apps/faneasy/COLLABORATION.md` |
| **OKR.md** | 주요 프로젝트 (비즈니스 목표 추적) | `apps/faneasy/OKR.md` |

## CLAUDE.md 작성 등급

| 등급 | 대상 | 포함 내용 |
|------|------|----------|
| **Tier A** | 복잡한 앱 (백엔드, API, 결제 등) | 아키텍처, API 라우트, 데이터 모델, 워크플로우, 환경변수 |
| **Tier B** | 일반 앱 (여러 페이지, DB 연동) | 프로젝트 개요, 기술 스택, 구조, 개발 규칙 |
| **Tier C** | 단순 앱 (랜딩 페이지 등) | 개요, 스택, 핵심 명령어 |

## DESIGN_GUIDE.md 작성 규칙

**반드시 실제 소스에서 추출** — 빈 플레이스홀더(`Primary: #`) 금지

추출 순서:
1. `tailwind.config.ts` — 커스텀 컬러, 폰트, 간격, 애니메이션
2. `globals.css` — CSS 변수 (`:root`), 테마 토큰
3. `layout.tsx` — 폰트 임포트 (Google Fonts / 로컬)
4. `package.json` — UI 라이브러리 (Radix, shadcn, Framer Motion 등)

## 공통 규칙
- 모든 문서는 **한국어**
- 커밋 메시지: 한글 + 에이전트 태그 (`[AG]`, `[CC]`, `[TCC]`, `[APP]`)
- 패키지 매니저: **bun** (npm 사용 금지)
- 필터 형식: `--filter=@vibers/앱이름`
