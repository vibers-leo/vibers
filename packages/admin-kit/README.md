# @vibers/admin-kit

Vibers 통합 어드민 패키지. 설치만 하면 프로젝트 스택/Firebase/DB를 자동 감지하고 vibers.co.kr/admin에 상태를 보고한다.

## 설치

```bash
bun add @vibers/admin-kit
```

## 사용법 — Next.js App Router

### 1. API 엔드포인트 추가 (필수)

```ts
// app/api/vibers-admin/route.ts
export { GET, POST } from '@vibers/admin-kit/handler';
```

### 2. 환경변수 추가

```bash
# .env.local
VIBERS_ADMIN_SECRET=vibers_secret_여기에입력
```

### 3. (선택) 자동 리포트 전송

```ts
// app/api/cron/vibers-report/route.ts  (Vercel Cron으로 주기 실행)
import { pushReport } from '@vibers/admin-kit/reporter';

export async function GET() {
  const ok = await pushReport();
  return Response.json({ ok });
}
```

## 자동 감지 항목

| 항목 | 감지 방법 |
|------|----------|
| Framework | package.json dependencies |
| Firebase Firestore/Auth | NEXT_PUBLIC_FIREBASE_* 환경변수 |
| Firebase Storage | NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET |
| NCP PostgreSQL | NCP_ACCESS_KEY + NCP_DB_HOST |
| NCP Object Storage | NCP_ACCESS_KEY + NCP_BUCKET_NAME |

## vibers 중앙 어드민 연동

각 프로젝트가 `/api/vibers-admin`을 노출하면, vibers.co.kr/admin에서 자동으로 수집한다.

수동 ping 테스트:
```bash
curl https://your-project.vercel.app/api/vibers-admin \
  -H "x-vibers-secret: YOUR_SECRET"
```
