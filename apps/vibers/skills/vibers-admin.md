---
name: Vibers Admin Integration Skill
description: Analyzes project DB structure and generates standardized API endpoints for Vibers Central Admin.
---

# Vibers Admin Integration Skill

이 스킬은 현재 프로젝트를 **Vibers 통합 어드민**에 연결하기 위해 필요한 API 엔드포인트를 자동으로 설계하고 생성하는 지침을 제공합니다.

## 1. 개요
Vibers 통합 어드민은 여러 프로젝트(Next.js, Rails 등)를 한곳에서 관리하기 위한 중앙 허브입니다. 이 스킬이 설치된 프로젝트는 중앙 어드민의 요청에 응답할 수 있는 표준화된 REST API를 갖추어야 합니다.

## 2. 분석 단계 (Step-by-Step)

### Step 1: DB 스키마 파악
프로젝트의 데이터베이스 구조를 분석합니다.
- **Next.js (Prisma)**: `prisma/schema.prisma` 파일을 읽어 모델을 파악합니다.
- **Next.js (Supabase/Postgres)**: DB 테이블 리스트와 컬럼 정보를 확인합니다.
- **Rails**: `db/schema.rb` 파일을 읽어 모델과 관계를 파악합니다.

### Step 2: 모델 매핑
중앙 어드민이 요구하는 데이터 규격에 프로젝트의 모델을 매핑합니다.
- `User` -> `AdminUser`
- `Order` -> `AdminOrder`
- `Post/Content` -> `AdminContent`
- `Setting` -> `AdminDesign` / `AdminSeo`

## 3. 구현 지침

### 표준 엔드포인트 구조
모든 API는 `/api/vibers/admin` 프리픽스를 사용해야 합니다.

| 엔드포인트 | 역할 | 요구 응답 (JSON) |
| :--- | :--- | :--- |
| `/health` | 연결 상태 체크 | `{ "status": "ok", "version": "..." }` |
| `/stats` | 주요 지표 (MAU, PV 등) | `{ "trend": [...], "summary": { "mau": "...", "revenue": "..." } }` |
| `/users` | 사용자/회원 목록 | `AdminUser[]` |
| `/orders` | 주문/거래 내역 | `AdminOrder[]` |
| `/seo` | SEO 설정 (GET/POST) | `AdminSeo` |
| `/design` | 디자인 설정 (GET/POST) | `AdminDesign` |
| `/logs` | 최근 시스템/활동 로그 | `AdminLog[]` |

### 보안 설정
중앙 어드민과의 통신을 위해 다음을 구현해야 합니다.
1. **API Key 인증**: `x-vibers-apikey` 헤더를 통한 요청 검증 (환경변수 `VIBERS_ADMIN_KEY` 사용)
2. **CORS 허용**: `vibers.co.kr` (또는 로컬 개발 주소)에서의 요청을 허용합니다.

## 4. 실시간 보고 (Push/Webhook)
프로젝트 내에서 중요한 이벤트가 발생할 때 Vibers 통합 어드민으로 즉시 보고하도록 설정합니다.

- **대상 이벤트**: 가입, 주문 완료, 시스템 오류, 주요 설정 변경
- **보고 엔드포인트**: `https://vibers.co.kr/api/vibers/report`
- **전송 방식**: POST (JSON body)
- **보안 헤더**: `x-vibers-apikey: [YOUR_API_KEY]`

### 보고 데이터 규격 (예시)
```json
{
  "project": "your-project-slug",
  "type": "USER_SIGNUP",
  "data": { "email": "user@example.com", "name": "..." },
  "timestamp": "2024-04-01T..."
}
```

## 5. 코드 생성 프롬프트 예시
> "프로젝트의 `Order` 생성 로직 끝에 Vibers 어드민(`/api/vibers/report`)으로 주문 내역을 실시간으로 전송하는 Webhook 함수를 추가해줘. `fetch`를 사용하고 보안 헤더를 포함해야 해."

## 6. 타입 규격 (TypeScript)
중앙 어드민과 통신할 때 다음 인터페이스를 준수하십시오.

```typescript
export interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface AdminSummary {
  mau: string;
  pv: string;
  bounceRate: string;
  revenue: string;
}
```
