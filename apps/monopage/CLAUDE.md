## 전략 문서 (개발 전 반드시 숙지)
- **전략 진단 리포트**: `data/STRATEGY_ANALYSIS.md`
- **PM 공통 지침**: 맥미니 루트 `pm.md`

### 전략 핵심 요약
- 실제 갤러리 운영 클라이언트 사이트 — 전시 관리 웹사이트
- Firebase Auth + 자체 PostgreSQL(Prisma) + NCP 이미지 서버 기반 경량 솔루션
- 콘텐츠 기반 활성도 — 전시 일정 자동화 및 SNS 연동 필요

### 빌더 공통 지침
- **gstack 빌더 철학**: 맥미니 루트 `gstack.md` — Boil the Lake, Search Before Building, 스프린트 프로세스
- **개발 프로세스**: Think → Plan → Build → Review → Test → Ship → Reflect
- **핵심 규칙**: 테스트 동시 작성, 새 패턴 도입 전 검색, 압축률 기반 추정

---

# 모노페이지 (Monopage)

## 프로젝트 개요
북촌 아트 스페이스 웹사이트. Firebase Auth + 자체 PostgreSQL(Prisma) + NCP 이미지 서버 + Tiptap 에디터 기반.

## 기술 스택
- Framework: Next.js 16
- Language: TypeScript
- Package Manager: bun (권장) / npm

## 개발 규칙

### 코드 스타일
- 시맨틱 라인 브레이크: UI 텍스트는 의미 단위로 줄바꿈
- 한글 우선 원칙: 모든 UI 텍스트와 주석은 한국어
- TypeScript strict mode 사용

### 디자인 준수
- 반응형 브레이크포인트: 640, 768, 1024, 1280px
- 폰트: Pretendard (한글 기본)
- Tailwind CSS 유틸리티 클래스 사용
- 접근성: WCAG 2.1 AA 기준

### Git 규칙
- 커밋 메시지: 한글 (feat:, fix:, refactor:, chore: 접두사)
- 브랜치: main → feature/기능명
- PR 필수 (셀프 리뷰 가능)

### 배포
- 대상 서버: NCP (server.vibers.co.kr)
- Docker 컨테이너 기반 배포 예정
- CI/CD: GitHub Actions

## 주요 명령어
```bash
bun install        # 의존성 설치
bun dev            # 개발 서버
bun run build      # 빌드
bun test           # 테스트
```

## AI Recipe 이미지 API

이 프로젝트는 **AI Recipe 중앙 이미지 서비스**를 사용합니다.

### 사용 가능한 함수

```typescript
import { searchStockImage, generateAIImage } from '@/lib/ai-recipe-client';
```

### Stock Image 검색
```typescript
const image = await searchStockImage('bukchon art space exhibition', {
  orientation: 'landscape',
  size: 'large',
});
// → { url, provider, alt, photographer, ... }
```

### AI 이미지 생성
```typescript
const image = await generateAIImage('elegant art exhibition poster, korean traditional modern fusion', {
  size: 'large',
  provider: 'auto',
});
// → { url, prompt, provider }
```

### 주요 용도
- 전시 이미지
- 갤러리 홍보 비주얼
- 아티스트 프로필 배경

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

---

## 파일 스토리지 — NCP Object Storage ⚠️

> **`src/lib/ncp-storage.ts` 직접 수정 금지. 레거시 파일임.**
> 모든 스토리지 작업은 `@vibers/storage` 공유 패키지를 통해 처리한다.

- 버킷: `wero-bucket`
- 환경변수: `NCP_ACCESS_KEY`, `NCP_SECRET_KEY`, `NCP_BUCKET_NAME=wero-bucket`
- 전체 가이드: `packages/storage/NCP_STORAGE_GUIDE.md`

```ts
// 서버 사이드 (API Route):
import { getPresignedUploadUrl, uploadBuffer } from '@vibers/storage/server';

// 클라이언트 사이드:
import { uploadFile } from '@vibers/storage/client';
```
