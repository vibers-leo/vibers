# Vibers 관리자 페이지 기획서

> 작성: Cowork (사업기획)
> 대상: AntiGravity (개발)
> 날짜: 2026-03-25

---

## 1. 목표

vibers.co.kr의 프로젝트 데이터를 **관리자 페이지**에서 수정하면 사이트에 즉시 반영되도록 한다.
현재 `data/projects.ts` 하드코딩 → **Supabase DB + 관리자 CRUD**로 전환.

---

## 2. 라우트 구조

```
/admin                → 관리자 대시보드 (프로젝트 목록 + 통계)
/admin/projects       → 프로젝트 CRUD 목록
/admin/projects/new   → 프로젝트 추가
/admin/projects/[id]  → 프로젝트 수정
/admin/services       → 서비스 관리 (CTO 구독 등)
```

---

## 3. 프로젝트 데이터 모델

```typescript
interface Project {
  id: string;                    // UUID (Supabase auto)
  slug: string;                  // URL 슬러그
  name: string;                  // 한글 이름
  nameEn: string;                // 영문 이름
  tagline: string;               // 한줄 설명
  description: string;           // 상세 설명
  entity: string;                // 소속 (dlab, wero, dus, nusucheck)
  status: 'live' | 'beta' | 'development' | 'concept';
  category: 'app' | 'platform' | 'service' | 'tool';

  // 기술 정보
  tech: string[];                // 기술 스택 태그
  framework: 'nextjs' | 'rails' | 'expo' | 'other';
  folderPath: string;            // 실제 폴더 경로 (dev/nextjs/apps/xxx)
  githubRepo: string;            // GitHub 레포 (vibers-leo/xxx)

  // 배포 정보
  deployTarget: 'vercel' | 'ncp' | 'oracle' | 'none';
  url?: string;                  // 서비스 URL
  port?: number;                 // NCP 포트 (Rails)

  // 디스플레이
  color: string;                 // 대표 색상
  thumbnail?: string;            // 썸네일 이미지
  featured: boolean;             // 메인 페이지 노출
  sortOrder: number;             // 정렬 순서

  // 메타
  launchDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. 관리자 인증

- Supabase Auth 사용
- LEO 계정(juuuno1116@gmail.com)만 admin 권한
- `/admin` 접근 시 로그인 체크 → 미인증 시 로그인 페이지 리다이렉트

---

## 5. 관리자 대시보드 (/)

### 표시할 통계
- 전체 프로젝트 수
- 상태별 카운트 (live / beta / development / concept)
- 프레임워크별 카운트 (Next.js / Rails / Expo)
- 배포 대상별 카운트 (Vercel / NCP / Oracle)

### 빠른 액션
- 프로젝트 추가
- 전체 프로젝트 목록

---

## 6. 프로젝트 목록 (/admin/projects)

- 테이블 형태 (이름, 상태, 카테고리, 배포, featured)
- 상태별 필터
- 검색
- 드래그&드롭으로 sortOrder 변경
- 행 클릭 → 수정 페이지

---

## 7. 프로젝트 수정 (/admin/projects/[id])

- 폼 필드: 위 데이터 모델의 모든 필드
- tech: 태그 입력 (쉼표 구분 → 배열)
- 미리보기: 오른쪽에 ProjectCard 실시간 프리뷰
- 저장 → Supabase update → revalidate

---

## 8. 마이그레이션 순서

### Phase 1: DB 세팅
1. Supabase에 `projects` 테이블 생성
2. 현재 `data/projects.ts` 데이터를 seed로 넣기
3. PROJECT_MASTER_LIST.md의 누락 프로젝트 추가

### Phase 2: 읽기 전환
1. 사이트에서 projects.ts 대신 Supabase에서 읽기
2. 기존 페이지(/, /projects, /projects/[slug]) 데이터 소스 변경
3. ISR(Incremental Static Regeneration) 적용 — 60초 revalidate

### Phase 3: 관리자 페이지
1. /admin 라우트 + 인증
2. CRUD 기능 구현
3. 이미지 업로드 (Supabase Storage)

---

## 9. 디자인 노트

- 관리자 페이지도 사이버펑크 다크 테마 유지
- 단, 폼/테이블은 가독성 우선 — 네온 효과 최소화
- shadcn/ui 컴포넌트 활용 가능

---

## 10. 참고 파일

- `data/PROJECT_MASTER_LIST.md` — 전체 프로젝트 마스터 리스트 (26개)
- `data/projects.ts` — 현재 하드코딩 데이터 (5개만 등록)
- `DESIGN_GUIDE.md` — 디자인 시스템
