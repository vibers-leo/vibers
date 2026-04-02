# Agency Landing 디자인 가이드

## 디자인 시스템 개요
메인 페이지는 다크 테마 고정. 개별 디자인 프리뷰는 30개 테마 시스템 기반으로 동적 적용.
Tailwind CSS 4 (CSS-first 설정, `@import "tailwindcss"`) 사용.

---

## 색상 시스템

### 메인 페이지 (다크 고정)

| 용도 | Tailwind 클래스 | HEX 값 |
|------|-----------------|---------|
| 페이지 배경 | `bg-neutral-950` | `#0a0a0a` |
| 기본 텍스트 | `text-neutral-100` | `#f5f5f5` |
| 제목 텍스트 | `text-white` | `#ffffff` |
| 강조 텍스트 | `text-emerald-400` | `#34d399` |
| 보조 텍스트 | `text-neutral-400` | `#a3a3a3` |
| 카드 배경 | `bg-neutral-900` | `#171717` |
| 카드 테두리 | `border-neutral-800` | `#262626` |
| 카드 호버 테두리 | `border-emerald-500/50` | `#10b981` (50% 투명) |
| 호버 그림자 | `shadow-emerald-500/10` | `#10b981` (10% 투명) |
| 태그 텍스트 | `text-emerald-400` | `#34d399` |
| 메타 텍스트 | `text-neutral-500` | `#737373` |

### CSS 변수 (globals.css)

| 변수 | 라이트 | 다크 (prefers-color-scheme) |
|------|--------|----------------------------|
| `--background` | `#ffffff` | `#0a0a0a` |
| `--foreground` | `#171717` | `#ededed` |
| `--font-sans` | Geist Sans | Geist Sans |
| `--font-mono` | Geist Mono | Geist Mono |

### 테마 시스템 (30개 디자인)

각 테마는 `src/lib/themes.ts`에 정의되며 다음 색상 토큰을 포함:

| 토큰 | 용도 |
|------|------|
| `primary` | 주요 버튼/강조 색상 |
| `primaryForeground` | 주요 버튼 위 텍스트 |
| `secondary` | 보조 색상 |
| `secondaryForeground` | 보조 텍스트 |
| `accent` | 악센트 색상 |
| `accentForeground` | 악센트 텍스트 |
| `background` | 배경 |
| `foreground` | 기본 텍스트 |
| `card` / `cardForeground` | 카드 배경/텍스트 |
| `muted` / `mutedForeground` | 비활성 배경/텍스트 |
| `border` | 테두리 |

테마 타입: Professional, Creative, Minimal, Bold, Elegant
폰트 옵션: sans, serif, mono
Radius 옵션: 0rem, 0.5rem, 1rem, 9999px

---

## 타이포그래피

### 폰트

| 용도 | 폰트 | 설정 |
|------|------|------|
| 기본 (sans) | Geist | `--font-geist-sans`, `next/font/google` |
| 코드 (mono) | Geist Mono | `--font-geist-mono`, `next/font/google` |

### 텍스트 스케일 (메인 페이지)

```tsx
{/* 메인 제목 */}
className="text-4xl font-bold tracking-tight text-white sm:text-6xl"

{/* 강조 부제목 */}
className="text-emerald-400"  {/* block 요소로 줄바꿈 */}

{/* 설명 텍스트 */}
className="text-lg text-neutral-400"

{/* 카드 제목 */}
className="text-xl font-bold text-white group-hover:text-emerald-400"

{/* 태그 */}
className="text-xs font-medium text-emerald-400"

{/* 메타 정보 */}
className="text-sm text-neutral-500"
```

---

## 레이아웃 시스템

### 컨테이너

```tsx
{/* 메인 컨테이너 */}
className="mx-auto max-w-7xl"  {/* 1280px */}

{/* 페이지 래퍼 */}
className="min-h-screen bg-neutral-950 p-8 text-neutral-100 font-sans"

{/* 설명 텍스트 최대 폭 */}
className="mx-auto max-w-2xl"
```

### 그리드 (테마 카드)

```tsx
{/* 반응형 그리드: 1열 → 2열 → 3열 → 4열 */}
className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
```

### 여백

```css
/* 헤더 하단 여백 */
margin-bottom: 48px;  /* mb-12 */

/* 카드 간격 */
gap: 24px;  /* gap-6 */

/* 페이지 패딩 */
padding: 32px;  /* p-8 */
```

---

## 컴포넌트 패턴

### 테마 카드

```tsx
<Link className="group relative flex flex-col overflow-hidden rounded-xl
  border border-neutral-800 bg-neutral-900
  transition-all hover:-translate-y-1
  hover:border-emerald-500/50
  hover:shadow-2xl hover:shadow-emerald-500/10">
  {/* 프리뷰 헤더 (테마 색상 미리보기) */}
  <div className="h-32 w-full p-4" style={{ backgroundColor: theme.colors.background }}>
  {/* 정보 영역 */}
  <div className="flex flex-1 flex-col p-6">
</Link>
```

### 테마 래퍼 (개별 디자인 페이지)

```tsx
{/* ThemeWrapper 컴포넌트로 테마별 색상 동적 적용 */}
<ThemeWrapper theme={theme}>
  <HeroProblem />
  <SolutionServices />
  <PricingFooter />
</ThemeWrapper>
```

---

## 반응형 브레이크포인트

```css
sm: 640px   /* @media (min-width: 640px) - 2열 그리드 */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) - 3열 그리드 */
xl: 1280px  /* @media (min-width: 1280px) - 4열 그리드 */
```

---

## 체크리스트

모든 새 컴포넌트/페이지는 다음을 준수해야 합니다:

- [ ] 메인 페이지: 다크 테마 (`bg-neutral-950`, `text-neutral-100`)
- [ ] 강조색: emerald-400/500 계열
- [ ] 카드 호버: `-translate-y-1` + `border-emerald-500/50` + `shadow`
- [ ] 테마 프리뷰: `src/lib/themes.ts` 정의 사용
- [ ] 폰트: Geist Sans / Geist Mono (추가 폰트 로드 금지)
- [ ] 그리드: `gap-6`, 반응형 `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- [ ] 컨테이너: `max-w-7xl mx-auto`
- [ ] Tailwind CSS 4 문법 (`@import "tailwindcss"`, `@theme inline`)

---

**일관성이 디자인의 핵심입니다!**
