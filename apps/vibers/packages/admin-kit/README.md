# @vibers/admin-kit

Vibers 통합 어드민의 공통 UI 컴포넌트와 비즈니스 로직 어댑터를 제공하는 공유 패키지입니다. (Phase 5 기반 세팅 완료)

## 설치 방법
```bash
bun add @vibers/admin-kit
```

## 적용 가이드 (App Router)
각 대상 프로젝트의 `app/admin/layout.tsx` 파일에서 아래와 같이 레이아웃과 어댑터를 활용할 수 있습니다.

```tsx
import { AdminLayout } from '@vibers/admin-kit/components';
import { SupabaseAdapter } from '@vibers/admin-kit/adapters';

export default function Layout({ children }) {
  // 프로젝트별 어댑터 할당 (Supabase, Firestore 등)
  const adapter = new SupabaseAdapter();
  
  return (
    <AdminLayout adapter={adapter} projectName="FanEasy">
      {children}
    </AdminLayout>
  );
}
```

## 컴포넌트 모듈
- `@vibers/admin-kit/components`: Sidebar, Header, StatCard, TrendChart, DataTable 등 아임웹 톤앤매너와 수파노바 디자인 토큰이 적용된 UI
- `@vibers/admin-kit/hooks`: 권한, 통계 패칭용 공통 훅
- `@vibers/admin-kit/adapters`: 인증/DB 연동 계층 어댑터
