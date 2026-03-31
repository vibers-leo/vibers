# Mission7 디자인 시스템

> 기반: Supanova Design Skill (Vantablack Luxe Archetype)
> 프리뷰: `docs/design-preview.html`

---

## 색상 시스템

### 기본 배경 (Vantablack Luxe)
| 토큰 | 값 | 용도 |
|------|------|------|
| `bg` | `#050508` | 메인 배경 (OLED 블랙) |
| `card` | `#0f0f14` | 카드 배경 |
| `surface` | `#1a1a22` | 활성 카드/입력 배경 |
| `border` | `rgba(255,255,255,0.06)` | 테두리 |

### 액센트 (Emerald)
| 토큰 | 값 | 용도 |
|------|------|------|
| `accent` | `#10B981` | 메인 액센트 (Emerald 500) |
| `accent-glow` | `rgba(16,185,129,0.15)` | 글로우 효과 |
| `accent-light` | `#34D399` | 밝은 변형 |
| `accent-dark` | `#059669` | 어두운 변형 |

### 카테고리 컬러
| 카테고리 | 색상 | 값 |
|---------|------|------|
| 건강/운동 | Red | `#EF4444` |
| 개발/코딩 | Blue | `#3B82F6` |
| 창작/콘텐츠 | Purple | `#8B5CF6` |
| 비즈니스 | Emerald | `#10B981` |
| 학습/독서 | Amber | `#F59E0B` |
| 생활/습관 | Rose | `#EC4899` |

### 텍스트
| 토큰 | 값 | 용도 |
|------|------|------|
| `text-primary` | `#FFFFFF` | 메인 텍스트 |
| `text-dim` | `#6B7280` | 보조 텍스트 (Gray 500) |
| `text-muted` | `rgba(107,114,128,0.6)` | 비활성 텍스트 |

---

## 타이포그래피

### 폰트
- **앱**: 시스템 폰트 (iOS: SF Pro, Android: Roboto)
- **웹 대시보드**: Pretendard
- **fallback**: `system-ui, -apple-system, sans-serif`

### 스케일
| 용도 | 크기 | 무게 | 비고 |
|------|------|------|------|
| 대형 숫자 (스트릭) | 40px | Black (900) | 통계 화면 |
| 화면 제목 | 24px | Bold (700) | 각 탭 상단 |
| 섹션 제목 | 16px | SemiBold (600) | 카드 내부 |
| 미션 제목 | 14px | Bold (700) | 미션 카드 |
| 보조 텍스트 | 12px | Regular (400) | 카테고리, 날짜 |
| 캡션/뱃지 | 10px | Medium (500) | D-day, 미션타입 |

### 한국어 규칙
- `lineHeight`: 헤드라인 1.3 (snug), 본문 1.6 (relaxed)
- 줄바꿈: 단어 단위 (word-break: keep-all)

---

## 컴포넌트 가이드

### 미션 카드
```
┌─────────────────────────────────┐
│ ▌ [카테고리 컬러 바]              │
│ ▌  미션 제목          [완료 버튼] │
│ ▌  카테고리 · 미션타입뱃지        │
└─────────────────────────────────┘

- 좌측: 카테고리 색상 세로 바 (w-1, h-10, rounded-full)
- 우측: 원형 완료 버튼 (w-8, h-8)
- 완료 시: opacity 0.6, 제목 취소선
- 진행 중: surface 배경, accent 테두리 글로우
```

### 7슬롯 인디케이터
```
● ● ● ○ ○ ○ ○

- 완료: 카테고리 색상 채움 + ring-2 + 체크 아이콘
- 미완료: border만 (ring-1 ring-border)
- 현재 진행: pulse 글로우 애니메이션
- 크기: w-9 h-9 rounded-full
```

### 뱃지
| 타입 | 스타일 |
|------|--------|
| D-day | `bg-amber-500/10 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full` |
| NEW | `bg-accent/10 text-accent` |
| 카테고리 | `bg-{color}/10 text-{color}` |

### 버튼
| 타입 | 스타일 |
|------|--------|
| Primary | `bg-accent text-white rounded-full px-8 py-4 font-bold` |
| Secondary | `bg-surface ring-1 ring-border text-dim rounded-full` |
| Hover | `scale-[1.02]`, Active: `scale-[0.98]` |
| 이징 | `cubic-bezier(0.16, 1, 0.3, 1)` — 모든 인터랙션 |

### 프로그레스 바
```
bg-surface rounded-full h-1.5 (또는 h-2)
  └─ bg-gradient-to-r from-{color} to-{color-light} rounded-full
```

---

## 모션 / 애니메이션

### 기본 이징
모든 인터랙션: `cubic-bezier(0.16, 1, 0.3, 1)` (Spring 물리)

### 슬롯 채우기
```
scale: 0.5 → 1.2 → 1.0
opacity: 0 → 1
duration: 400ms
stagger: 80ms per slot
```

### 미션 완료
- 체크마크 드로잉 (stroke-dashoffset 애니메이션)
- 햅틱: ImpactFeedbackStyle.Medium
- 카드 opacity 1.0 → 0.6 (300ms)

### 퍼펙트 클리어
1. 오버레이 어두워짐 (bg-black/60)
2. 7슬롯 순차 발광 (stagger 100ms)
3. "PERFECT!" 텍스트 스케일업 + 글로우
4. 컨페티 파티클 (react-native-confetti-cannon)
5. 강한 햅틱 (NotificationFeedbackType.Success)
6. 승리 사운드 (expo-av, 300ms)
7. 스트릭 카운터 페이드인

### 화면 전환
- 카드 등장: fadeInUp (opacity 0 + translateY 1.5rem → 정상)
- 하단 시트: slideUp (translateY 100% → 0)
- 탭 전환: crossfade (150ms)

---

## 아이콘

Iconify Solar set 전용 (앱에서는 @iconify/react-native 또는 커스텀 SVG).

| 용도 | Bold (활성) | Linear (비활성) |
|------|------------|----------------|
| 홈 탭 | solar:home-smile-bold | solar:home-smile-linear |
| 보관함 탭 | solar:archive-bold | solar:archive-linear |
| 통계 탭 | solar:chart-2-bold | solar:chart-2-linear |
| 설정 탭 | solar:settings-bold | solar:settings-linear |
| 완료 체크 | solar:check-read-bold | — |
| 불꽃 (스트릭) | solar:fire-bold | — |
| 공유 | solar:share-bold | — |
| 추가 | solar:add-circle-bold | — |

---

## 레이아웃

### 화면 구조
```
[Status Bar]
[Header — 날짜 + 제목 + 프로필]
[7슬롯 인디케이터 카드]
[미션 리스트 (ScrollView)]
[Bottom Tab Bar (glass blur)]
```

### 간격
| 위치 | 값 |
|------|------|
| 화면 좌우 패딩 | 24px (px-6) |
| 카드 간격 | 12px (gap-3) |
| 섹션 간격 | 20px (py-5) |
| 하단 탭 높이 | 80px (pb-8 포함, safe area) |

### Bottom Tab Bar
- glass 효과: `backdrop-blur(20px) saturate(180%)`
- 배경: `bg/80` (반투명)
- 상단 border: `border-t border-border`
