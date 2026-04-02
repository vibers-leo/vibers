# Artpage — OKR (2026 Q1)

> 최종 업데이트: 2026-03-24 by [TCC]

## Objective 1: 개발 환경 복구 및 프로젝트 마이그레이션 재개

맥미니 M4 이전 후 개발 환경 검증이 필요하며, art-way/arthyun 프로젝트 통합 마이그레이션(IMPLEMENTATION_PLAN.md)이 Phase 1 분석 단계에서 멈춰 있음.

- KR1: 의존성 재설치 및 개발 서버 정상 구동 — 현재: 점검 필요 / 목표: bun install + bun dev 정상 동작
- KR2: 프로덕션 빌드 정상 통과 — 현재: 미확인 / 목표: bun run build 에러 0건
- KR3: IMPLEMENTATION_PLAN Phase 2 (컴포넌트 마이그레이션) 착수 — 현재: Phase 1 분석 완료, Phase 2 미착수 / 목표: art-way + arthyun 템플릿 컴포넌트 이관 시작

## Objective 2: 멀티테넌트 플랫폼 기반 구축

artpage.kr을 아티스트/갤러리 웹사이트 플랫폼으로 발전시키기 위한 서브도메인 기반 멀티테넌트 구조 구현.

- KR1: 서브도메인 라우팅 시스템 구현 — 현재: README에 구조 설계만 존재 (bukchon.artpage.kr 등) / 목표: 서브도메인별 테넌트 분리 라우팅 동작
- KR2: gallery-modern 템플릿 1차 완성 — 현재: 템플릿 디렉토리 구조 존재 / 목표: 북촌 아트 스페이스 데모 사이트 1개 라이브
- KR3: Supabase 데이터베이스 스키마 확정 및 적용 — 현재: SQL 파일 존재하나 검증 필요 / 목표: 테넌트/전시/상품/사용자 테이블 생성 완료

## Objective 3: NCP Docker 배포 준비

모노레포 전체 NCP 이전 방향에 맞춰 artpage도 Docker 배포를 준비한다.

- KR1: Dockerfile 작성 및 로컬 테스트 — 현재: 미착수 / 목표: Docker 빌드 + 실행 정상 동작
