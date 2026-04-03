# vibers-nanobot - 프로젝트 인덱스

## 📌 빠른 시작 (Quick Start)

```bash
# 1. 프로젝트 진입
cd /sessions/dreamy-pensive-allen/mnt/nanobanana/vibers-nanobot

# 2. 환경 파일 생성
cp .env.example .env.local

# 3. 필수 정보 입력
# .env.local 파일을 열어서 다음 정보를 입력:
# - TELEGRAM_BOT_TOKEN: @BotFather에서 받은 토큰
# - SHARED_API_KEY: https://aistudio.google.com에서 받은 API 키
# - ENCRYPTION_KEY: openssl rand -hex 16 으로 생성

# 4. 설치 및 실행
npm install
npm run dev
```

---

## 📚 문서 안내

### 1. 📄 README.md (필독!)
**대상**: 일반 사용자 및 개발자
**내용**:
- 봇 사용법
- 모든 명령어 설명
- 기능 소개
- 빠른 시작 가이드

**언제 읽을 것인가**: 봇을 처음 사용할 때

---

### 2. 📄 SETUP.md (배포 담당자 필독!)
**대상**: 시스템 관리자, DevOps 엔지니어
**내용**:
- 환경 설정 상세 가이드
- PM2 배포 방법
- Docker 배포 방법
- 문제 해결
- 모니터링 및 로깅
- 데이터 백업 방법

**언제 읽을 것인가**: 프로덕션 배포할 때

---

### 3. 📄 PROJECT-SUMMARY.md (기술 검토 필독!)
**대상**: 아키텍처 리뷰, 기술 리드
**내용**:
- 프로젝트 개요
- 전체 구조
- 구현된 기능
- 기술 스택
- 보안 설계
- 코드 품질
- 성능 지표

**언제 읽을 것인가**: 프로젝트 이해 및 기술 검토할 때

---

### 4. 📄 INDEX.md (이 파일!)
**대상**: 모든 사용자
**내용**:
- 어떤 문서를 언제 읽을지 안내
- 파일 구조 설명
- 주요 명령어 빠른 참조

**언제 읽을 것인가**: 처음 프로젝트에 접근할 때

---

## 🗂️ 핵심 파일 가이드

### 설정 파일

```
.env.example          👉 환경 변수 템플릿
.env.local           👉 실제 환경 설정 (git 무시됨)
.gitignore           👉 Git이 무시할 파일 목록
package.json         👉 NPM 패키지 정의
ecosystem.config.js  👉 PM2 프로덕션 설정
```

### 봇 핵심 로직

```
src/bot.js                    👉 메인 진입점
src/config.js                 👉 환경 변수 검증

src/handlers/start.js         👉 /시작 명령어
src/handlers/help.js          👉 /도움말 명령어
src/handlers/apiKey.js        👉 /키등록, /키확인 명령어
src/handlers/generate.js      👉 /생성 명령어
src/handlers/productPage.js   👉 /상세페이지 명령어
src/handlers/style.js         👉 /스타일 명령어
src/handlers/usage.js         👉 /사용량 명령어
```

### 서비스 레이어

```
src/services/gemini.js        👉 Gemini API 통합
src/services/crypto.js        👉 AES-256 암호화
src/services/storage.js       👉 JSON 파일 저장소
```

### 설정 및 유틸

```
src/presets/prompts.js        👉 프롬프트 템플릿 라이브러리
src/utils/logger.js           👉 컬러 로깅 유틸리티
```

### 데이터 저장소 (gitignored)

```
data/users.json               👉 사용자 정보
data/usage_*.json             👉 사용자별 사용 로그
```

---

## ⚡ 자주 사용하는 명령어

### 개발 모드
```bash
npm run dev                   # 파일 감시 + 자동 재시작
```

### 프로덕션 모드
```bash
npm start                     # 일반 실행

# PM2를 사용한 실행
pm2 start ecosystem.config.js
pm2 logs vibers-nanobot
pm2 stop vibers-nanobot
pm2 delete vibers-nanobot
```

### 배포
```bash
# Docker 빌드 및 실행
docker build -t vibers-nanobot .
docker run -d --env-file .env.local vibers-nanobot

# 환경 파일 설정
cp .env.example .env.local
# .env.local 편집
```

---

## 🎯 역할별 가이드

### 👨‍💻 개발자
1. README.md 읽기 → 기능 이해
2. src/ 디렉토리 코드 검토
3. 로컬에서 `npm run dev` 실행하여 테스트

**문서**: README.md, src 내 주석

---

### 🔧 시스템 관리자
1. SETUP.md 읽기 → 배포 가이드 숙지
2. .env.local 파일 설정
3. PM2 또는 Docker로 배포
4. 정기적인 모니터링 및 백업

**문서**: SETUP.md, ecosystem.config.js

---

### 📊 프로젝트 매니저
1. PROJECT-SUMMARY.md 읽기 → 전체 기능 파악
2. 요구사항 충족도 확인
3. 타임라인 및 마일스톤 계획

**문서**: PROJECT-SUMMARY.md, README.md

---

### 🏃 엔드유저 (봇 사용자)
1. README.md의 "사용 방법" 섹션 읽기
2. Telegram에서 /시작 명령어 입력
3. 각 명령어 차근차근 실행

**문서**: README.md (사용자 가이드 섹션)

---

## 🔐 보안 체크리스트

배포 전 반드시 확인하세요:

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] Telegram Bot Token을 `.env.local`에만 저장했는가?
- [ ] Gemini API Key를 공개 저장소에 노출하지 않았는가?
- [ ] Encryption Key를 충분히 복잡하게 생성했는가? (최소 32자)
- [ ] API 키 등록 시 메시지가 자동으로 삭제되는가?
- [ ] 정기적인 데이터 백업 계획이 있는가?

---

## 📞 문제 해결

### 봇이 시작되지 않는다
```bash
# 1. 환경 변수 확인
cat .env.local

# 2. 필수 변수 모두 입력되었는지 확인
# TELEGRAM_BOT_TOKEN, SHARED_API_KEY, ENCRYPTION_KEY

# 3. 로그 확인
npm run dev

# 참고: SETUP.md의 "문제 해결" 섹션
```

### API 키 오류
```
❌ 유효하지 않은 API 키입니다
```
→ Gemini API Key가 AIza로 시작하는지 확인
→ SETUP.md의 "Gemini API Key 발급" 섹션 참고

### 이미지 생성 실패
→ Gemini API 할당량 확인
→ 네트워크 연결 상태 확인
→ SETUP.md의 "문제 해결" 섹션 참고

---

## 🚀 배포 경로

### 로컬 개발
```
npm run dev
```
자동 재시작 + 디버깅 가능

### 프로덕션 (단일 서버)
```
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
자동 재시작 + 모니터링

### 프로덕션 (Docker)
```
docker build -t vibers-nanobot .
docker run -d --env-file .env.local vibers-nanobot
```
격리된 환경 + 쉬운 배포

### 프로덕션 (클라우드)
Vercel, Railway, Render 등에 직접 배포 가능
→ SETUP.md의 "클라우드 배포" 섹션

---

## 📈 주요 구조

```
요청 흐름:

Telegram 사용자
    ↓
Telegram Bot API
    ↓
telegraf (프레임워크)
    ↓
명령어 핸들러 (handlers/)
    ├→ 사용자 조회 (storage.js)
    ├→ API 키 복호화 (crypto.js)
    └→ 이미지 생성 (gemini.js)
    ↓
결과 반환
    ↓
Telegram 사용자
```

---

## 📊 프로젝트 통계

| 항목 | 수치 |
|------|------|
| 총 파일 | 20개 |
| 소스 코드 파일 | 16개 |
| 총 라인 | 1,138줄 |
| 문서 파일 | 4개 |
| 디렉토리 크기 | 108KB |

---

## 🔄 업데이트 이력

### v1.0.0 (2026-03-07) - 초기 릴리스
- ✅ 핵심 기능 완성
- ✅ 모든 명령어 구현
- ✅ 보안 기능 완료
- ✅ 문서화 완료
- ✅ 프로덕션 배포 준비 완료

---

## 💡 팁 & 트릭

### PM2 사용 팁
```bash
pm2 list                    # 모든 프로세스 확인
pm2 logs                    # 실시간 로그
pm2 restart vibers-nanobot  # 재시작
pm2 delete vibers-nanobot   # 삭제
```

### 데이터 백업
```bash
# 주간 백업
tar -czf backup_$(date +%Y%m%d).tar.gz data/

# 이전 백업 확인
ls -lh backup_*.tar.gz
```

### 환경 변수 빠른 설정
```bash
# Telegram Token 설정
export TELEGRAM_BOT_TOKEN="your_token"

# Gemini API Key 설정
export SHARED_API_KEY="your_key"

# Encryption Key 생성
openssl rand -hex 16
```

---

## 🎓 학습 리소스

### 공식 문서
- [Telegraf 공식 문서](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google Generative AI](https://ai.google.dev/)

### 관련 기술
- Node.js 비동기 프로그래밍
- REST API 통합
- 데이터 암호화 (AES-256)
- JSON 데이터 처리

---

## 📞 연락처 및 지원

**문제가 발생하면:**

1. **로그 확인**: `npm run dev` 또는 `pm2 logs`
2. **문서 참고**: 해당 .md 파일 검토
3. **환경 확인**: `.env.local` 파일 재확인
4. **재시작**: `npm run dev` 또는 `pm2 restart`

---

## ✅ 최종 체크리스트

배포 전 완료해야 할 작업:

- [ ] 모든 문서를 읽었다
- [ ] 환경 변수를 올바르게 설정했다
- [ ] 로컬에서 정상 작동을 확인했다
- [ ] 보안 체크리스트를 완료했다
- [ ] 백업 전략을 수립했다
- [ ] 모니터링 계획을 세웠다
- [ ] 팀원들에게 문서를 공유했다

---

**이 문서는 빠른 네비게이션을 위한 인덱스입니다.**
**상세 정보는 각 문서를 참고하세요.**

**마지막 수정**: 2026-03-07
**상태**: ✅ 프로덕션 준비 완료
