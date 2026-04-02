# Artpage (북촌 아트 스페이스) 디자인 가이드

> 상세 디자인 시스템은 **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** 참조.
> 이 문서는 빠른 참조를 위한 핵심 요약입니다.

---

## 폰트

| 용도 | 폰트 | 비고 |
|------|------|------|
| 제목 (H1~H4) | Noto Serif KR | `font-serif` |
| 본문 | Inter | 기본 sans-serif |
| 한글 기본 | Pretendard | CLAUDE.md 참조 |

---

## 제목 계층 요약

| 레벨 | Tailwind | 크기 | weight |
|------|----------|------|--------|
| H1 | `text-5xl font-serif font-light mb-6` | 48px | 300 |
| H2 | `text-4xl font-serif font-light mb-12` | 36px | 300 |
| H3 | `text-2xl font-serif mb-4` | 24px | 400 |
| H4 | `text-xl font-serif mb-3` | 20px | 400 |
| 본문 | `text-base leading-relaxed` | 16px | -- |
| 본문 (큰) | `text-lg leading-relaxed` | 18px | -- |
| 본문 (작은) | `text-sm leading-normal` | 14px | -- |

---

## 색상

| 용도 | 값 | 클래스 |
|------|-----|--------|
| 주요 텍스트 | `hsl(0 0% 10%)` | `text-foreground` |
| 보조 텍스트 | `hsl(0 0% 40%)` | `text-muted-foreground` |
| 링크/강조 | `hsl(195 85% 35%)` | `text-primary` |

---

## 간격 핵심값

| 용도 | 클래스 | 값 |
|------|--------|-----|
| 컨테이너 최대 너비 | `max-w-screen-xl` | 1280px |
| 좌우 패딩 | `px-6` | 24px |
| 큰 섹션 여백 | `py-20` | 80px |
| 중간 섹션 여백 | `py-16` | 64px |
| 작은 섹션 여백 | `py-12` | 48px |
| 제목-내용 간격 | `mb-12` | 48px |
| 내용-내용 간격 | `mb-8` | 32px |
| 그리드 간격 | `gap-8` | 32px |

---

## 레이아웃 패턴

```tsx
{/* 섹션 래퍼 */}
<section className="py-20">
  <div className="max-w-screen-xl mx-auto px-6">
    {/* 내용 */}
  </div>
</section>

{/* 제목 + 설명 */}
<div className="text-center mb-12">
  <h2 className="text-4xl font-serif font-light text-foreground mb-4">제목</h2>
  <p className="text-muted-foreground max-w-2xl mx-auto">설명</p>
</div>

{/* 그리드 */}
<div className="grid md:grid-cols-2 gap-8">{/* 2열 */}</div>
<div className="grid md:grid-cols-3 gap-8">{/* 3열 */}</div>
```

---

## 반응형 브레이크포인트

| 접두사 | 최소 너비 |
|--------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## 빠른 체크리스트

- 최대 너비: `max-w-screen-xl` (1280px)
- 좌우 패딩: `px-6` (24px)
- 섹션 여백: `py-20` (80px)
- H1: `text-5xl font-serif font-light`
- H2: `text-4xl font-serif font-light mb-12`
- 본문: `text-base leading-relaxed`
- 그리드: `gap-8` (32px)

---

**상세 스펙, 컴포넌트 패턴, 사용 예시는 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)를 참조하세요.**
