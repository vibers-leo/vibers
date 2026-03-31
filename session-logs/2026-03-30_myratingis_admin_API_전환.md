# myratingis admin 페이지 supabase → API 전환
- 날짜: 2026-03-30
- 에이전트: [TCC]

## 세션 개요
myratingis admin 3개 페이지(banners, notices, rewards)의 broken supabase Proxy 호출을 실제 API + Prisma 기반으로 전환 완료.

## 주요 논의
- `src/lib/supabase/client.ts`는 Proxy 객체 — `.from()` 호출 시 throw, `.auth.*`는 null 반환
- banners: 배경 에이전트가 page + API 모두 변환 완료
- notices: Prisma 스키마에 notices 모델 없음 → `prisma.$queryRaw` 방식으로 API 신규 생성
- rewards: `project_rewards`, `shop_orders` 테이블도 Prisma 미포함 → 빈 배열 fallback 처리

## 기술적 상세

### 생성된 파일
| 파일 | 내용 |
|---|---|
| `src/app/api/banners/[id]/route.ts` | Prisma PUT/DELETE 재작성 |
| `src/app/api/admin/notices/route.ts` | prisma.$queryRaw GET/POST |
| `src/app/api/admin/notices/[id]/route.ts` | prisma.$queryRaw PUT/DELETE |

### 수정된 파일
| 파일 | 변경 내용 |
|---|---|
| `admin/banners/page.tsx` | fetch() + useAuth token (배경 에이전트 작업) |
| `admin/notices/page.tsx` | fetch() + useAuth token |
| `admin/rewards/page.tsx` | supabase.auth.getSession() → useAuth().token |

### 인증 패턴
```typescript
// Before (broken)
const { data: { session } } = await supabase.auth.getSession();
headers: { 'Authorization': `Bearer ${session?.access_token}` }

// After
const { token } = useAuth();
headers: { 'Authorization': `Bearer ${token}` }
```

### notices API 패턴
```typescript
// Prisma schema에 없는 테이블은 $queryRaw 사용
const notices = await prisma.$queryRaw<any[]>`
  SELECT * FROM notices ORDER BY created_at DESC
`;
```

## 커밋
- `01318ca` — refactor: admin 페이지 supabase → API 전환 (banners/notices/rewards) [TCC]
- Vercel 배포: push 완료 → 자동 배포 예정

## 향후 계획
1. arthyun.co.kr → artpage Vercel 도메인 연결 (유저 직접 처리)
2. notices 테이블 → Prisma schema에 모델 추가 (타입 안전성)
3. project_rewards, shop_orders → Prisma 추가 후 API 구현
