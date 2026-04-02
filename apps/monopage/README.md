# ArtPage Platform

아티스트와 갤러리를 위한 웹사이트 플랫폼

## 프로젝트 구조

```
artpage/
├── src/app/                 # 메인 플랫폼 (artpage.kr)
│   ├── page.tsx            # 랜딩 페이지
│   ├── templates/          # 템플릿 쇼케이스
│   ├── pricing/            # 가격 정책
│   └── auth/               # 회원가입/로그인
│
├── templates/               # 템플릿 라이브러리
│   └── gallery-modern/     # 북촌 아트 스페이스 템플릿
│
└── tenant/                  # 테넌트 시스템 (서브도메인)
```

## 비즈니스 모델

### 수익 구조

1. **초기 세팅비**: 템플릿 설치 + 커스터마이징
2. **월 구독료**: 호스팅 + 유지보수
3. **거래 수수료**: 굿즈 판매 시 5-10%
4. **프리미엄 기능**: 추가 템플릿, 고급 기능

### 서브도메인 시스템

- `artpage.kr` - 메인 플랫폼
- `bukchon.artpage.kr` - 북촌 아트 스페이스
- `artist-name.artpage.kr` - 개인 아티스트

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Payment**: Toss Payments
- **Hosting**: Vercel

## 템플릿

### Gallery Modern (북촌 아트 스페이스)

- 갤러리/미술관용
- 전시 관리
- 상품 판매
- Instagram 연동
- 다국어 지원 (한/영/일/중)

### 추가 예정 템플릿

- Gallery Minimal
- Artist Portfolio
- Studio Creative

## 개발 가이드

### 로컬 실행

```bash
npm install
npm run dev
```

### 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-toss-key
```

## 라이선스

Proprietary - ArtPage Platform
