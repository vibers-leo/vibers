# Rails 앱 Vibers 통합 어드민 API 완료

- 날짜: 2026-04-06
- 에이전트: [TCC]

## 세션 개요
6개 Rails 앱에 `/api/vibers_admin` 엔드포인트를 추가하여 vibers-home 통합 어드민에서 데이터를 가져올 수 있도록 구현 완료.

## 주요 완료 사항

### VIBERS_ADMIN_SECRET 환경변수 추가
- honsul: `/opt/honsul/api/.env`에 추가
- wayo: `/opt/haebojago/backend/.env`에 추가
- matecheck: `/root/projects/matecheck/backend/docker-compose.yml`의 environment 섹션에 추가
- runnersconnect: `/root/projects/runnersconnect/backend/docker-compose.yml`에 추가
- nusucheck: `/root/projects/nusucheck/.env`에 추가
- dus: `/root/projects/dlab-website/.env`에 추가

### 컨트롤러/라우트 패턴
- Next.js 앱: `createAdminHandler()` 사용
- Rails API-only (honsul, matecheck): `ActionController::API` 직접 상속
- Rails 풀스택 (dus): `ActionController::API` 직접 상속 (CSRF 우회)
- nusucheck: `scope "/api"` + 최상위 `VibersAdminController` (namespace 충돌 방지)

### aggregator.ts 수정
- wayo URL: `gabojago.vibers.co.kr` → `wayo-api.vibers.co.kr` (502 해결)

### 소스코드 수정 및 git push
- honsul: `application_record.rb` 추가, `vibers_admin_controller.rb` 추가
- matecheck: `ActionController::API` 상속으로 수정
- nusucheck: 최상위 컨트롤러 + scope routes로 변경
- dus: `ActionController::API` 상속으로 수정
- runnersconnect: 이미 커밋됨 (서버 컨테이너에 직접 적용)
- project-menus.ts: 중복 닫힘 괄호(`};`) 구문 오류 수정

## 최종 엔드포인트 상태

| 앱 | 도메인 | HTTP |
|---|---|---|
| honsul | honsul.vibers.co.kr | 200 ✅ |
| wayo | wayo-api.vibers.co.kr | 200 ✅ |
| matecheck | matecheck.vibers.co.kr | 200 ✅ |
| runnersconnect | runnersconnect.vibers.co.kr | 200 ✅ |
| nusucheck | nusucheck.vibers.co.kr | 200 ✅ |
| dus | dus.vibers.co.kr | 200 ✅ |

## 남은 과제
- runnersconnect: 서버 소스만 수정됨 (git push 안 됨 — 컨테이너 재시작 시 이미지 재빌드 필요)
- dus: 컨테이너 재시작 시 routes.rb 변경 유지 여부 확인 필요 (touch tmp/restart.txt로 현재 작동 중)
- GitHub Actions 자동 배포 후 각 앱 검증 필요
- admin.vibers.co.kr 도메인 연결 (Phase 4)
