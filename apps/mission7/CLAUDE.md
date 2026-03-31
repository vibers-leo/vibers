## 전략 문서 (개발 전 반드시 숙지)
- **전략 진단 리포트**: `docs/05_PROJECT_STRATEGY.md` — 7대 프로젝트 전략, 수익화 타임라인, 리스크
- **PM 공통 지침**: 맥미니 루트 `pm.md` — PM Skills 프레임워크
- **gstack 빌더 철학**: 맥미니 루트 `gstack.md` — Boil the Lake, Search Before Building, 스프린트 프로세스
- **개발 프로세스**: Think → Plan → Build → Review → Test → Ship → Reflect
- **핵심 규칙**: 테스트 동시 작성, 새 패턴 도입 전 검색, 압축률 기반 추정

### 전략 핵심 요약
- 컨셉: "하루 7미션, 반드시 성공합니다" — 게임하듯 즐겁게 목표 달성
- 타겟: LEO 본인이 첫 사용자 (Build for Yourself), 이후 생산성/자기계발 관심층
- 수익화: 프리미엄 구독 (AI 코칭 무제한 월 4,900원), 앱스토어 배포
- North Star: 월간 퍼펙트 일수 (Monthly Perfect Days)
- MVP: F1~F4 (인증, 메인, 미션수행, 퍼펙트이펙트) → Sprint 1 (AI 3일)

---

# Mission7 (미션7) — 하루 7미션, 반드시 성공합니다

## 프로젝트 개요
매일 아침 스스로 7개의 미션을 설정하고, 게임 퀘스트처럼 하나씩 달성해가는 목표달성 앱.
완료 시 보상 이펙트, AI 코칭, 통계/스트릭 추적 기능 제공.

운영 회사: 계발자들 (Vibers)
앱 이름: Mission7

---

## 아키텍처

### 기술 스택
- App: Expo (React Native) — SDK 52+, TypeScript strict
- Styling: NativeWind (Tailwind for React Native)
- Navigation: Expo Router (file-based)
- Animation: React Native Reanimated 3
- Haptics: expo-haptics
- Sound: expo-av
- Auth: Firebase Auth (Google / Apple Sign-In)
- Backend API: Ruby on Rails (NCP Docker)
- DB: PostgreSQL 16 (NCP vibers-db) — ActiveRecord
- AI 대화 로그: Firestore
- Push: expo-notifications + FCM
- Icons: @iconify/react (Solar set)
- Charts: react-native-chart-kit 또는 victory-native

### 외부 서비스 연동
| 서비스 | 용도 |
|--------|------|
| Firebase Auth | 소셜 로그인 (Google/Apple) |
| NCP PostgreSQL | 미션/사용자/통계 데이터 |
| Firestore | AI 대화 세션 로그 |
| Gemini Flash API | AI 미션 추천/일상 대화 (저비용) |
| Claude API | AI 전략 대화/목표 수립 (고품질, 제한적) |
| FCM | 푸시 알림 |
| 앱인토스 | iOS/Android 배포 |

---

## 프로젝트 구조
```
mission7/
├── CLAUDE.md          ← 이 파일
├── DESIGN_GUIDE.md    ← 디자인 시스템
├── OKR.md             ← 분기 목표
├── STATUS.md          ← 현재 상태
├── docs/
│   ├── 01_USER_WORKFLOW.md   ← 유저 플로우
│   ├── 02_API_SPEC.md        ← API 명세
│   ├── 03_DB_SCHEMA.md       ← DB 스키마
│   ├── 04_FEATURE_SPEC.md    ← 기능 명세
│   ├── 05_PROJECT_STRATEGY.md ← 전략
│   └── design-preview.html    ← 디자인 프리뷰
├── app/               ← Expo Router 페이지
├── components/        ← 공통 컴포넌트
├── lib/               ← 유틸/API 클라이언트
├── assets/            ← 이미지/사운드/Lottie
└── package.json
```

---

## 핵심 규칙

### 미션 시스템
1. **7슬롯 제한**: slot_index 0~6, 하루 최대 7개 미션
2. **미션 타입**: one_time / daily_repeat / weekly_repeat / monthly_repeat / dday / project
3. **프로젝트 미션**: 진행률 0~100% 슬라이더, 100% 도달 시 자동 완료

### UX 규칙
4. **완료 시 반드시 햅틱**: Haptics.impactAsync(ImpactFeedbackStyle.Medium)
5. **7/7 퍼펙트 시 풀 이펙트**: 컨페티 + 강한 햅틱 + 사운드 + 스트릭 표시
6. **다크 테마 기본**: Vantablack Luxe (#050508 배경, #10B981 액센트)
7. **한글 우선**: 모든 UI 한국어, Pretendard 웹폰트 (앱은 시스템 폰트)

### 코드 규칙
8. **패키지 매니저**: bun
9. **TypeScript strict**: noImplicitAny, strictNullChecks
10. **커밋 메시지**: 한글 (feat:, fix:, refactor:, chore: 접두사)
11. **애니메이션**: Reanimated만 사용 (Animated API 금지)
12. **상태 관리**: Zustand (전역) + React Query (서버 상태)

---

## Rails API 연동
- 베이스 URL: `https://mission7.vibers.co.kr/api/v1`
- 인증: Firebase ID Token → Rails에서 검증
- 상세: `docs/02_API_SPEC.md` 참조

## DB 스키마
- 7 테이블 (PostgreSQL) + 2 컬렉션 (Firestore)
- 상세: `docs/03_DB_SCHEMA.md` 참조

---

## 개발 명령어
```bash
# Expo 앱 (개발)
bun install
bun run start                    # Expo 개발 서버
bun run ios                      # iOS 시뮬레이터
bun run android                  # Android 에뮬레이터

# 모노레포 내에서
bun run dev --filter=mission7    # 루트에서 실행 시
```

---

## 멀티 에이전트 협업 체계

| 태그 | 환경 | 역할 |
|------|------|------|
| [AG] | AntiGravity (VS Code) | Expo 앱 UI/UX 개발 메인 |
| [TCC] | Terminal Claude (Rails) | Rails API 개발 |
| [CW] | Cowork (데스크톱) | 전략/기획, 문서, 비코딩 작업 |

### 작업 분배
- **Expo 앱 (이 프로젝트)**: [AG] 담당
- **Rails API** (`rails/mission7/`): [TCC] 담당
- **전략/기획 문서**: [CW] 담당 (docs/ 폴더)
- **디자인 프리뷰**: [CW] 담당 (supanova 스킬 적용)

---

## 참고 문서
- docs/ 폴더 전체 (워크플로우, API, DB, 기능명세, 전략)
- 맥미니 루트 `gstack.md` — 빌더 철학
- 맥미니 루트 `pm.md` — PM Skills 프레임워크
- `supanova-design-skill/` — 디자인 스킬 (taste/soft/output/redesign)


## 세션로그 기록 (필수)
- 모든 개발 대화의 주요 내용을 `session-logs/` 폴더에 기록할 것
- 파일명: `YYYY-MM-DD_한글제목.md` / 내용: 한글
- 세션 종료 시, 마일스톤 달성 시, **컨텍스트 압축 전**에 반드시 저장
- 상세 포맷은 상위 CLAUDE.md 참조
