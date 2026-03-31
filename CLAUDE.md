# Vibers Platform — Turborepo 모노레포

## 개요
계발자들(Vibers)의 모든 Next.js 프로젝트를 통합 관리하는 Turborepo 모노레포.
apps/ 안에 각 프로젝트가 독립적으로 존재하며, packages/로 공통 코드를 공유한다.

## 구조
```
nextjs/
├── apps/              ← Next.js 프로젝트들 (LEO가 직접 추가)
├── packages/
│   ├── ui/            ← @vibers/ui — 공통 컴포넌트 (버튼, 모달 등)
│   ├── config/        ← @vibers/config — 공통 tsconfig, eslint
│   └── design-system/ ← @vibers/design-system — 디자인 토큰 (폰트, 컬러, 간격)
├── package.json       ← 루트 (workspaces 설정)
└── turbo.json         ← Turborepo 빌드 설정
```

## 핵심 명령어
```bash
bun install                          # 전체 의존성 설치 (루트에서 1번만)
bun run dev                          # 모든 앱 개발 서버 실행
bun run dev --filter=semophone       # 특정 앱만 실행
bun run build                        # 전체 빌드 (변경된 것만 자동 감지)
bun run build --filter=semophone     # 특정 앱만 빌드
```

## 새 앱 추가 방법
1. apps/ 안에 기존 Next.js 프로젝트 폴더를 넣는다
2. 해당 프로젝트의 package.json에 name 필드가 있는지 확인
3. 루트에서 bun install 실행
4. bun run dev --filter=앱이름 으로 테스트

## 공통 패키지 사용법
각 앱의 package.json에 추가:
```json
{
  "dependencies": {
    "@vibers/ui": "workspace:*",
    "@vibers/design-system": "workspace:*"
  }
}
```

## 개발 규칙
- 패키지 매니저: bun (npm 사용 금지)
- 한글 우선: 모든 UI 텍스트와 주석은 한국어
- TypeScript strict mode 필수
- 커밋 메시지: 한글 (feat:, fix:, refactor:, chore: 접두사)
- 디자인: @vibers/design-system 토큰 우선 사용

## 세션로그 기록 (필수)
**모든 개발 세션의 주요 대화 내용을 반드시 기록한다.**

### 규칙
- **위치**: 각 앱의 `session-logs/` 폴더 (예: `apps/faneasy/session-logs/`)
- **파일명**: `YYYY-MM-DD_한글제목.md` (예: `2026-03-29_결제_페이지_구현.md`)
- **내용**: 한글로 작성
- **포맷**:
  ```
  # 세션 제목
  - 날짜: YYYY-MM-DD
  - 에이전트: [AG] / [CC] / [TCC] 등

  ## 세션 개요
  (이 세션에서 무엇을 했는지 1~2줄 요약)

  ## 주요 논의
  (핵심 결정사항, 이슈, 해결 방법)

  ## 기술적 상세
  (코드 변경, 아키텍처 결정 등)

  ## 향후 계획
  (다음에 이어서 할 작업)
  ```

### 기록 시점
- 세션 종료 시 (대화 끊기기 전에 먼저 저장)
- 중요 마일스톤 달성 시 (기능 완성, 배포, 큰 리팩토링 등)
- 컨텍스트 압축(context compression) 발생 전에 반드시 저장

### 왜 기록하는가
- 이 로그들은 바이브코딩 전자책, 나노바나나 가이드북 등 콘텐츠의 원재료
- 다음 세션에서 이전 맥락을 빠르게 복원하는 데 필수
- 여러 에이전트 간 작업 히스토리 공유

## 멀티 에이전트 협업 체계
이 모노레포는 여러 Claude 인스턴스가 동시에 작업할 수 있다.

### 에이전트 식별
| 태그 | 환경 | 역할 |
|------|------|------|
| [AG] | AntiGravity (VS Code 익스텐션) | 코딩 메인. LEO가 직접 지시 |
| [CC] | Claude Code (VS Code) | 단일 앱 작업 |
| [TCC] | Claude Code (터미널 / iTerm2) | 병렬 작업, Agent Teams |
| [APP] | Claude Code (앱, 클라우드) | 보조 작업 |
| [CW] | Claude Cowork (데스크톱) | 비코딩 (이메일, 캘린더, 디자인, 문서) |

### 협업 문서
각 앱에 `COLLABORATION.md`가 있으면 반드시 읽고 따른다.
특히 faneasy는 3-에이전트 협업 프로토콜이 활발하므로 작업 전 반드시 확인:
- `apps/faneasy/COLLABORATION.md` — 메시지 보드, 작업 영역 분리, Git 규칙
- 작업 후 COLLABORATION.md 메시지 로그에 기록 필수

### Git 협업 규칙 (전체 모노레포 공통)
- `git add .` 사용 금지 → 항상 `git add <특정 파일>`
- 커밋 전 `git pull origin main` 실행
- 커밋 메시지에 에이전트 태그 명시: `[AG]`, `[CC]`, `[TCC]`, `[APP]`
- 다른 에이전트 작업 영역 파일 수정 금지
- 공유 파일(package.json, globals.css 등) 수정 시 COLLABORATION.md에 알림 작성

## Agent Teams (병렬 작업)
이 모노레포는 Agent Teams를 통한 병렬 작업을 지원한다.

### 팀 구성 예시
```
팀을 구성해서 병렬로 작업해줘:
- 팀원1: apps/faneasy — 결제 페이지 작업
- 팀원2: apps/semophone — SEO 메타태그 정리
- 팀원3: apps/vibers — 랜딩페이지 수정
```

### 팀 작업 규칙
- 각 팀원은 자신에게 배정된 apps/앱이름 폴더만 수정한다
- packages/ 수정은 팀 리더가 직접 한다 (충돌 방지)
- 작업 완료 후 각 팀원은 bun run build --filter=앱이름 으로 빌드 확인
- 모든 커밋 메시지는 한글 (feat:, fix: 접두사)

### 주의사항
- 동시에 같은 파일을 수정하지 않도록 팀원별 앱을 분리 배정
- 공통 패키지(@vibers/ui 등) 수정 시 팀 리더만 담당

## Expo 모바일 앱 (네이티브 전환)
- Next.js 프로젝트는 React 코드 재활용하여 Expo 네이티브 앱으로 전환 예정
- NativeWind v5 + Tailwind v4로 스타일 통일
- 상세 전략 및 스킬 가이드: `dev/expo/EXPO_BUILD_GUIDE.md`
- Expo 공통 지침: `dev/expo/CLAUDE.md`
- **수익화/결제 계획**: `monetization.md` (워크스페이스 루트) — 프로젝트별 수익 모델, 결제 방식(IAP vs 토스), 출시 우선순위
- 결제 구현 시 반드시 monetization.md 참조하여 해당 프로젝트의 결제 방식 확인
- **"포트원 없음"은 블로커가 아니다** — monetization.md 기준으로 해당 앱이 결제 불필요 단계면 핵심 기능만 먼저 완성
- 앱 빌드 작업 시 반드시 위 문서를 먼저 읽고 적용할 것
- 우선 대상: myratingis (레이아웃 재정리), vibefolio-app (레이아웃 재정리)

### Expo 스킬 설치 (Claude Code / AntiGravity)
```bash
/plugin marketplace add expo/skills
/plugin install expo
/plugin marketplace add callstackincubator/agent-skills
/plugin install react-native-best-practices
```

## AEO (Answer Engine Optimization) — 수시 점검 필수

> **목표**: ChatGPT, Claude, Perplexity, Gemini 등 AI 답변에 Vibers 서비스가 노출되도록 최적화
> **현황 파일**: `dev/nextjs/AEO.md` (항상 최신 상태 유지)
> **현재 완성도**: Next.js 19개 앱 100% (2026-03-30 기준)

### AEO 필수 구성 요소 (앱당 5가지)
모든 Next.js 앱은 아래 5가지를 반드시 구현한다:

| 항목 | 파일 위치 | 설명 |
|------|----------|------|
| JSON-LD | `src/app/layout.tsx` | `<script type="application/ld+json">` — Schema.org 구조화 데이터 |
| llms.txt | `public/llms.txt` | AI 크롤러 전용 서비스 설명 파일 |
| robots.ts | `src/app/robots.ts` | 크롤링 허용 + sitemap 위치 명시 |
| sitemap.ts | `src/app/sitemap.ts` | 전체 URL 목록 |
| OpenGraph | `src/app/layout.tsx` > `metadata` | SNS/AI 미리보기용 메타데이터 |

### 신규 앱 추가 시 체크리스트
새 앱을 모노레포에 추가하거나 신규 Next.js 프로젝트를 만들 때 **반드시** AEO 5종 구현 후 `AEO.md`에 추가:
```
- [ ] JSON-LD (WebApplication / WebSite / Organization 중 적합한 타입)
- [ ] public/llms.txt (서비스명, 기능, 대상 사용자, 운영사 포함)
- [ ] src/app/robots.ts (sitemap URL 포함)
- [ ] src/app/sitemap.ts
- [ ] metadata.openGraph (title, description, url, siteName, locale)
- [ ] AEO.md 업데이트
```

### 기존 앱 수정 시 AEO 점검
기능 추가/변경 시 아래 항목을 함께 업데이트:
- **서비스 설명/기능 변경** → `llms.txt` 내용 업데이트
- **URL 구조 변경** → `sitemap.ts` 업데이트
- **앱 이름/브랜드 변경** → `JSON-LD` + `OpenGraph` + `llms.txt` 동시 수정
- **신규 주요 페이지 추가** → `sitemap.ts`에 URL 추가

### llms.txt 작성 기준
```
# [서비스명]

> [AI가 한 줄로 설명할 수 있는 핵심 가치]

## 주요 기능
- 기능1: 설명
- 기능2: 설명

## 대상 사용자
[구체적인 페르소나]

## 기술 스택
Next.js, TypeScript, [주요 기술]

## 운영사
계발자들 (Vibers) — vibers.co.kr
```

### AEO 모니터링 (월 1회 권장)
다음 쿼리로 AI 노출 여부 직접 테스트:
- Perplexity: "한국 [서비스 카테고리] 앱 추천"
- ChatGPT: "[서비스명] 앱 어떤 앱이야"
- Claude: "[서비스 기능] 할 수 있는 한국 서비스"

### JSON-LD 타입 선택 기준
- `WebApplication` → 실제 기능이 있는 SaaS/앱 (faneasy, myratingis, goodzz 등)
- `WebSite` → 브랜드/랜딩/소개 사이트 (vibers, agency-landing, arthyun 등)
- `Organization` → 회사/브랜드 소개 전용 (oceantechlab 등)

## 파일 스토리지 — NCP Object Storage (@vibers/storage) ⚠️ 필독

> **Firebase Storage 사용 금지. 모든 파일 업로드는 NCP Object Storage만 사용한다.**
> **기존에 개별 앱 안에 만들어둔 ncp-storage.ts / s3-client.ts는 레거시다. 새 작업 시 직접 수정하지 말고 @vibers/storage를 사용할 것.**

### 공유 패키지: `packages/storage` (`@vibers/storage`)
NCP Object Storage 연동을 전담하는 모노레포 공유 패키지.
- **버킷**: `wero-bucket` (NCP Object Storage, kr-standard 리전)
- **엔드포인트**: `https://kr.object.ncloudstorage.com`
- **환경변수**: `NCP_ACCESS_KEY`, `NCP_SECRET_KEY`, `NCP_BUCKET_NAME=wero-bucket`
- **가이드**: `packages/storage/NCP_STORAGE_GUIDE.md`

### 마이그레이션 모드 — NEXT_PUBLIC_STORAGE_MODE
Firebase → NCP 자연스러운 전환을 위해 3단계 모드를 지원한다.

| 값 | 동작 | 시기 |
|----|------|------|
| `firebase-only` | Firebase만 저장 (기존) | 전환 전 |
| `dual` | Firebase + NCP 동시 저장, NCP URL 반환 | **지금 (검증 기간)** |
| `ncp-only` | NCP만 저장, Firebase 제거 | 검증 완료 후 |

> 기본값은 `dual`. 각 앱 `.env.local` 및 Vercel 환경변수에 설정.

### 이중 쓰기 적용 패턴
```ts
import { dualUploadFile } from '@vibers/storage/dual';

// 기존 Firebase 업로드 함수를 그대로 wrapping
const result = await dualUploadFile(
  file,
  (f) => 기존Firebase업로드함수(f),  // 기존 함수 그대로
  'semophone',   // platform (앱명)
  'images',      // category
);
const url = result.url;  // NCP URL (실패 시 Firebase fallback)
```

### 업로드 패턴 (NCP 전용, Presigned URL 방식)
브라우저 → `POST /api/storage/presign` (URL 발급) → NCP에 직접 PUT
서버를 파일이 경유하지 않아 Vercel 메모리 한도·타임아웃 없음.

### 새 앱에 스토리지 추가 시 (3단계)
```bash
# 1. package.json dependencies에 추가
"@vibers/storage": "*"

# 2. API Route 복사
cp packages/storage/templates/api/storage/presign/route.ts apps/{앱}/app/api/storage/presign/route.ts
cp packages/storage/templates/api/storage/delete/route.ts  apps/{앱}/app/api/storage/delete/route.ts

# 3. lib/storage-utils.ts (Firebase 코드 전체 교체)
export { uploadFile, deleteFile } from '@vibers/storage/client';
```

### 임포트 방법
```ts
// 서버 (API Route, Server Action):
import { getPresignedUploadUrl, deleteFile, uploadBuffer } from '@vibers/storage/server';

// 클라이언트 (브라우저 컴포넌트):
import { uploadFile, deleteFile } from '@vibers/storage/client';

// 타입:
import type { StoragePlatform, StorageCategory } from '@vibers/storage';
```

### 적용 현황 (2026-03-31)
| 앱 | 상태 | 비고 |
|----|------|------|
| faneasy | ✅ 완료 | storage-utils.ts 교체 완료 |
| artpage | ✅ 완료 | src/lib/ncp-storage.ts → @vibers/storage/server 위임 |
| semophone | ✅ 완료 | lib/ncp-storage.ts → @vibers/storage/server 위임, env 변수 통일 |
| goodzz | ✅ 완료 | src/lib/s3-client.ts → NCP 연결 |
| vibefolio-nextjs | ⬜ 미적용 | Firebase Storage 사용 여부 확인 후 전환 |
| 기타 앱 | ⬜ 미적용 | 필요 시 위 3단계로 적용 |

---

## 현재 작업 (NOW)
<!-- 작업 중단 시 여기에 기록. 실수로 엔터 쳐서 끊겨도 이 섹션 읽고 이어가기 -->
- 진행 중: Expo 네이티브 전환 준비 (myratingis, vibefolio)
- 마지막 완료: @vibers/storage 패키지 구축 + 4개 앱 마이그레이션 (2026-03-31)

## 배포
- 현재: Vercel (전환기)
- 최종: NCP Docker (server.vibers.co.kr) — 이 모노레포 전체를 1개 컨테이너로 배포

## 상위 브랜드
계발자들 (Vibers) — vibers.co.kr
