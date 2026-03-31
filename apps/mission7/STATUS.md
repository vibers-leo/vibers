# Mission7 — 프로젝트 현황

> 최종 업데이트: 2026-03-28 by [CW]
> 상태: 기획 완료, 개발 대기

## 현재 상태
- [x] 프로젝트 컨셉 확정 ("하루 7미션, 반드시 성공합니다")
- [x] 유저 워크플로우 작성 (docs/01_USER_WORKFLOW.md)
- [x] API 기능문서 작성 (docs/02_API_SPEC.md)
- [x] DB 테이블 명세서 작성 (docs/03_DB_SCHEMA.md)
- [x] 세부 기능명세서 작성 (docs/04_FEATURE_SPEC.md)
- [x] 전략 문서 작성 (docs/05_PROJECT_STRATEGY.md)
- [x] 앱 디자인 프리뷰 (docs/design-preview.html, supanova 적용)
- [x] 공통 지침 세팅 (CLAUDE.md, DESIGN_GUIDE.md, OKR.md, STATUS.md)
- [ ] Expo 프로젝트 스캐폴딩 (npx create-expo-app)
- [ ] Rails API 프로젝트 생성
- [ ] Firebase Auth 설정
- [ ] NCP Docker 설정 (mission7 포트 할당)
- [ ] 메인 화면 UI 구현
- [ ] 7슬롯 시스템 구현
- [ ] 미션 CRUD 구현
- [ ] 퍼펙트 이펙트 구현
- [ ] 앱인토스 배포

## 기술 스택
| 항목 | 내용 |
|------|------|
| App | Expo (React Native), TypeScript |
| Styling | NativeWind (Tailwind RN) |
| Navigation | Expo Router |
| Animation | Reanimated 3, expo-haptics, expo-av |
| Auth | Firebase Auth (Google/Apple) |
| Backend | Ruby on Rails (NCP Docker) |
| DB | PostgreSQL 16 (NCP vibers-db) |
| AI Log | Firestore |
| Package | @vibers/mission7 |
| Design | Vantablack Luxe + Emerald accent |

## 다음 액션
- [ ] Expo 프로젝트 초기화 (`mission7-app` 폴더, -app 네이밍 컨벤션)
- [ ] Rails API 초기화 (`rails/mission7/`)
- [ ] NCP 포트 할당 (4090 추천)
- [ ] Firebase 프로젝트 생성 또는 기존 vibers 프로젝트에 앱 추가
- [ ] Cloudflare DNS 추가: mission7.vibers.co.kr → NCP
- [ ] Sprint 1 착수 (F1~F4)
