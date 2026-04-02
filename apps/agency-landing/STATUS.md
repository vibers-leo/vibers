# Agency Landing — 프로젝트 현황

> 최종 업데이트: 2026-03-24 by [TCC]
> 상태: 모노레포 통합 완료, 문서화 진행 중

## 프로젝트 정보
- 앱 이름: agency-landing
- 패키지명: @vibers/agency-landing
- 티어: C (단순 랜딩 페이지)
- 설명: 1인 마케팅 대행사 30가지 디자인 테마 쇼케이스

## 기술 스택
| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js | 16.1 |
| 스타일 | Tailwind CSS | 4 |
| 애니메이션 | framer-motion | 12.23 |
| 아이콘 | lucide-react | 0.562 |
| 유틸 | clsx + tailwind-merge | 2.1 / 3.4 |

## 현재 상태
- [x] 모노레포 통합 완료
- [x] 빌드 통과
- [x] 문서화 (CLAUDE.md, DESIGN_GUIDE.md, STATUS.md)
- [x] 메인 페이지 (30개 테마 그리드)
- [x] 개별 테마 프리뷰 페이지 (`/design/[id]`)
- [x] 랜딩 섹션 컴포넌트 (Hero, Solution, Pricing)
- [ ] git remote 연결 (현재 없음)
- [ ] 개발 서버 동작 확인
- [ ] 메타데이터 설정 (현재 기본값 "Create Next App")
- [ ] 한국어 lang 설정 (현재 en)
- [ ] 배포 설정

## 페이지 구조
| 경로 | 설명 | 상태 |
|------|------|------|
| `/` | 메인 페이지 (30개 테마 카드 그리드) | 구현됨 |
| `/design/[id]` | 개별 테마 프리뷰 | 구현됨 |

## 컴포넌트
| 컴포넌트 | 경로 | 용도 |
|----------|------|------|
| HeroProblem | src/components/landing/ | 히어로/문제 제기 섹션 |
| SolutionServices | src/components/landing/ | 솔루션/서비스 소개 |
| PricingFooter | src/components/landing/ | 가격/푸터 |
| ThemeWrapper | src/components/landing/ | 테마 동적 적용 래퍼 |
| TemplateView | src/components/ | 템플릿 뷰 |

## 테마 시스템
- 총 30개 테마 정의 (`src/lib/themes.ts`)
- 타입: Professional, Creative, Minimal, Bold, Elegant
- 폰트: sans, serif, mono
- Radius: 0rem, 0.5rem, 1rem, 9999px

## 다음 액션
- [ ] git remote 레포 생성 및 연결
- [ ] `<html lang="ko">` 로 변경
- [ ] 메타데이터 한국어 설정 (title, description)
- [ ] `bun run dev --filter=@vibers/agency-landing` 로 개발 서버 확인
- [ ] 공통 컴포넌트 @vibers/ui 이관 검토
