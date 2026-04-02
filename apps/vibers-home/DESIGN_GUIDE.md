# Vibers Site — 디자인 가이드

> 상위 브랜드: 계발자들 (Vibers) | 플래그십 브랜드 사이트
> 디자인 아이덴티티: 사이버펑크 / 네온 그린 / 다크 모드 전용

---

## 컬러 시스템

### 핵심 컬러 팔레트

| 역할 | 값 | CSS 변수 | 설명 |
|------|-----|----------|------|
| Primary (네온 그린) | `#39FF14` | `--primary` | 브랜드 핵심 색상. CTA, 강조, 선택 텍스트 |
| Background (다크) | `#050505` | `--bg` | 메인 배경. 거의 순수 블랙 |
| Surface | `rgba(255, 255, 255, 0.04)` | `--surface` | 카드, 오버레이 배경 |
| Border (네온 반투명) | `rgba(57, 255, 20, 0.2)` | `--border` | 구분선, 카드 외곽선 |
| Text (기본) | `#FFFFFF` | body color | 기본 텍스트 (화이트) |
| Text (음소거) | `#888888` | `--text-muted` | 보조 텍스트, 캡션 |
| Selection BG | `#39FF14` | `::selection` | 텍스트 드래그 시 네온 그린 배경 + 블랙 텍스트 |

### 스크롤바

```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: rgba(57, 255, 20, 0.3); border-radius: 2px; }
```

### 컬러 사용 규칙
- 배경은 항상 `#050505` 다크 — 라이트 모드 없음
- 네온 그린(`#39FF14`)은 강조 요소에만 사용 (과용 금지)
- 텍스트 대비: 흰색 텍스트 on 다크 배경 = WCAG AAA 충족
- 네온 그린 텍스트는 큰 제목/CTA에만 사용 (본문 금지 — 가독성)

---

## 타이포그래피

### 폰트 스택
- 한글: Pretendard Variable
- 영문: Poppins (제목) / system-ui (본문)
- 전체 폰트: `'Pretendard', 'Poppins', system-ui, -apple-system, sans-serif`
- `-webkit-font-smoothing: antialiased` 적용

### 제목 계층

| 레벨 | 사이즈 | Tailwind | 용도 |
|------|--------|----------|------|
| H1 | 48px | `text-5xl` | 히어로 섹션 메인 타이틀 |
| H2 | 36px | `text-4xl` | 섹션 제목 |
| H3 | 24px | `text-2xl` | 서브섹션 제목 |
| H4 | 20px | `text-xl` | 카드 제목 |

### 본문 텍스트

| 용도 | 사이즈 | Tailwind |
|------|--------|----------|
| 기본 본문 | 16px | `text-base` |
| 큰 본문 | 18px | `text-lg` |
| 캡션/보조 | 14px | `text-sm` |

---

## 레이아웃 시스템

### 컨테이너

```tsx
className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8"
```

- 최대 너비: 1280px (`max-w-screen-xl`)
- 좌우 패딩: 16px (모바일) / 24px (태블릿) / 32px (데스크탑)

### 섹션 여백

```css
/* 섹션 간 여백 */
py-16  /* 64px — 모바일 */
py-20  /* 80px — 데스크탑 */
```

### 반응형 브레이크포인트

| 이름 | 값 | 용도 |
|------|-----|------|
| sm | 640px | 작은 태블릿 |
| md | 768px | 태블릿 |
| lg | 1024px | 소형 데스크탑 |
| xl | 1280px | 일반 데스크탑 |

---

## 컴포넌트 패턴

### 페이지 래퍼

```tsx
<div className="min-h-screen" style={{ backgroundColor: '#050505', color: '#fff' }}>
  {children}
</div>
```

### 섹션 래퍼

```tsx
<section className="py-16 md:py-20">
  <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
    {/* 섹션 내용 */}
  </div>
</section>
```

### 카드 (사이버펑크 스타일)

```tsx
<div
  className="rounded-xl p-6"
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(57, 255, 20, 0.2)',
  }}
>
  {/* 카드 내용 */}
</div>
```

### 버튼

```tsx
{/* Primary CTA */}
<button className="rounded-lg px-6 py-3 font-medium"
  style={{ backgroundColor: '#39FF14', color: '#000' }}>
  시작하기
</button>

{/* Ghost 버튼 */}
<button className="rounded-lg px-6 py-3 font-medium"
  style={{ border: '1px solid rgba(57, 255, 20, 0.4)', color: '#39FF14' }}>
  더 알아보기
</button>
```

### 컴포넌트 규칙
- 버튼: `rounded-lg`, 최소 높이 44px (터치 영역)
- 카드: `rounded-xl`, surface 배경 + neon border
- 모달: backdrop-blur, 중앙 정렬
- 인풋: `rounded-lg`, border, `focus:ring-2`

---

## 애니메이션 (Framer Motion)

### 기본 원칙
- Framer Motion 기반 인터랙션
- 전환: 200-300ms ease
- 호버: `scale(1.02)` 또는 opacity 변화
- 페이지 진입 애니메이션: fade-in + slide-up (500ms)

### 사이버펑크 효과
- 네온 글로우: `box-shadow: 0 0 20px rgba(57, 255, 20, 0.3)`
- 텍스트 글로우: `text-shadow: 0 0 10px rgba(57, 255, 20, 0.5)`
- 호버 시 글로우 강도 증가

---

## 접근성

- 최소 대비: 4.5:1 (일반 텍스트), 3:1 (큰 텍스트)
- 포커스 표시: `ring-2 ring-offset-2` (네온 그린 링)
- alt 텍스트 필수
- 키보드 내비게이션 지원
- 다크 모드 전용이므로 밝은 배경 대비 고려 불필요

---

## 체크리스트

모든 페이지/컴포넌트는 다음을 준수해야 합니다:

- [ ] 배경: `#050505` (라이트 모드 없음)
- [ ] Primary 컬러: `#39FF14` 네온 그린
- [ ] 최대 너비: `max-w-screen-xl` (1280px)
- [ ] 좌우 패딩: 반응형 (px-4 / px-6 / px-8)
- [ ] 섹션 여백: `py-16 md:py-20`
- [ ] 폰트: Pretendard + Poppins
- [ ] 카드: surface 배경 + 네온 보더
- [ ] Framer Motion 애니메이션 적용
- [ ] 스크롤바: 4px 네온 그린 스타일

---

**사이버펑크 미학과 가독성의 균형이 핵심입니다!**
