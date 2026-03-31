# AEO (Answer Engine Optimization) 현황
> 마지막 업데이트: 2026-03-30 (재감사)

## 전체 완성도: 100% (Next.js 앱 19개 기준)

> ⚠️ lightstar(Vite), mission7(Expo 기획), vibefolio-app(Expo) 제외

---

## 앱별 현황표

| 앱명 | JSON-LD | llms.txt | robots | sitemap | OG | 완성도 |
|------|---------|----------|--------|---------|-----|--------|
| agency-landing | ✅ WebSite | ✅ | ✅ | ✅ | ✅ | 100% |
| ai-recipe | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| aiwar | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| art-way | ✅ WebSite | ✅ | ✅ | ✅ | ✅ | 100% |
| arthyun | ✅ WebSite | ✅ | ✅ | ✅ | ✅ | 100% |
| artpage | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| everyones-ai | ✅ WebSite | ✅ | ✅ | ✅ | ✅ | 100% |
| faneasy | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| goodzz | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| kess | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| my-next-guide | ✅ WebSite | ✅ | ✅ | ✅ | ✅ | 100% |
| myratingis | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| oceantechlab | ✅ Brand | ✅ | ✅ | ✅ | ✅ | 100% |
| premiumpage | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| richlychee | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| semophone | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| vibefolio-nextjs | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| vibers | ✅ WebSite | ✅ | ✅ | ✅ | ✅ | 100% |
| whymove | ✅ WebApp | ✅ | ✅ | ✅ | ✅ | 100% |
| lightstar | N/A (Vite) | N/A | N/A | N/A | N/A | — |
| mission7 | N/A (Expo) | N/A | N/A | N/A | N/A | — |
| vibefolio-app | N/A (Expo) | N/A | N/A | N/A | N/A | — |

---

## 항목별 완성도

| 항목 | 완료 | 비율 |
|------|------|------|
| JSON-LD 구조화 데이터 | 19/19 | 100% |
| llms.txt | 19/19 | 100% |
| robots.ts | 19/19 | 100% |
| sitemap.ts | 19/19 | 100% |
| OpenGraph | 19/19 | 100% |

---

## 오늘 완료된 작업 (2026-03-30)

### JSON-LD + llms.txt 추가
- **artpage**: JSON-LD (WebApplication) + llms.txt 신규 추가
- **art-way**: JSON-LD (WebSite) + llms.txt 신규 추가
- **faneasy**: JSON-LD (WebApplication) + llms.txt 신규 추가
- **my-next-guide**: JSON-LD (WebSite) + llms.txt + OpenGraph 추가
- **kess**: OpenGraph + metadataBase 추가, JSON-LD URL kess.co.kr 통일

### 기타 확인
- vibers, semophone, whymove, kess: 이미 모든 항목 완성 (AEO.md 오기였음)
- aiwar, everyones-ai, goodzz 등: 이미 완성 상태

---

## JSON-LD 참고 템플릿

### WebApplication 타입
```tsx
// src/app/layout.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '앱명',
  description: '설명',
  url: 'https://도메인',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'ko',
  author: {
    '@type': 'Organization',
    name: '계발자들',
    url: 'https://vibers.co.kr',
  },
}

// <body> 안에 추가
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

### llms.txt 템플릿
```
# [앱명]

> [한줄 설명]

## 주요 기능
- 기능1
- 기능2

## 대상 사용자
[설명]

## 기술 스택
Next.js, TypeScript, Firebase

## 운영사
계발자들 (Vibers) — vibers.co.kr
```

---

---

## 고도화 로드맵 (다음 단계)

### Phase 2 — llms.txt 내용 강화 (현재 뼈대 → 풍부한 내용)
기본 구조는 완성됐지만, AI가 실제로 인용할 확률을 높이려면 내용을 풍부하게 해야 함.

우선순위 앱: **faneasy, vibers, goodzz, myratingis, semophone**

각 앱 llms.txt에 추가할 내용:
- 실제 사용 시나리오 (FAQ 형식)
- 경쟁 서비스 대비 차별점
- 구체적인 사용자 후기/수치 (ex. "누적 사용자 N명")
- 자주 묻는 질문 3~5개

### Phase 3 — FAQ Schema 추가
```tsx
// JSON-LD에 FAQPage 추가 (기존 WebApplication과 배열로 병렬 사용)
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '질문?',
      acceptedAnswer: { '@type': 'Answer', text: '답변.' }
    }
  ]
}
```

### Phase 4 — Brand Authority 강화
- vibers.co.kr의 JSON-LD에 `Organization` + `sameAs` 배열로 SNS 계정 연결
- 모든 앱 JSON-LD의 `author.url`이 `https://vibers.co.kr`로 통일됐는지 확인
- `isPartOf` 속성으로 각 앱이 Vibers 브랜드 하위임을 명시

### Phase 5 — AI 모니터링 자동화
월 1회 자동 체크 스크립트:
- Perplexity API로 서비스별 키워드 검색 → 노출 여부 기록
- 결과를 `AEO.md` 모니터링 로그에 추가

---

## 모니터링 로그

| 날짜 | 쿼리 | AI | 노출 여부 | 메모 |
|------|------|-----|----------|------|
| (미시작) | — | — | — | Phase 1 완성 후 시작 |

---

## 변경 이력
- 2026-03-30: 최초 전체 분석 (22개 앱, 52.7% 완성) → 재감사 후 100% 완성
- 2026-03-30: artpage, art-way, faneasy, my-next-guide, kess AEO 완성
- 2026-03-30: 고도화 로드맵 (Phase 2~5) + 모니터링 로그 섹션 추가
