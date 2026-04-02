# vibers-nanobot 설정 및 배포 가이드

**프로젝트**: 나노바나나 텔레그램 봇 - AI 이미지 생성
**생성일**: 2026-03-07
**상태**: 프로덕션 준비 완료

---

## 📋 목차

1. [빠른 시작](#빠른-시작)
2. [환경 설정](#환경-설정)
3. [설치 및 실행](#설치-및-실행)
4. [주요 기능](#주요-기능)
5. [배포 가이드](#배포-가이드)
6. [문제 해결](#문제-해결)

---

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Telegram Bot Token ([@BotFather](https://t.me/BotFather)에서 발급)
- Gemini API Key (https://aistudio.google.com)

### 5분 내에 시작하기

```bash
# 1. 프로젝트 디렉토리로 이동
cd vibers-nanobot

# 2. 환경 파일 생성
cp .env.example .env.local

# 3. .env.local 파일 편집 (필수 정보 입력)
# TELEGRAM_BOT_TOKEN=your_token
# SHARED_API_KEY=your_gemini_key
# ENCRYPTION_KEY=your_encryption_key

# 4. 의존성 설치
npm install

# 5. 실행
npm run dev
```

---

## 🔧 환경 설정

### 1. Telegram Bot Token 발급

**단계:**
1. Telegram에서 [@BotFather](https://t.me/BotFather) 찾기
2. `/newbot` 입력
3. 봇 이름 입력: `나노바나나 이미지봇`
4. 봇 username 입력: `nanobanana_imagebot` (예시)
5. BotFather가 제공하는 TOKEN 복사

**예시:**
```
5123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
```

### 2. Gemini API Key 발급

**단계:**
1. https://aistudio.google.com 접속
2. "Get API Key" 클릭
3. "Create API key in new Google Cloud project" 선택
4. API Key 복사

**예시:**
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 암호화 키 생성

```bash
# Linux/Mac
openssl rand -hex 16 > encryption_key.txt
cat encryption_key.txt

# Windows PowerShell
[System.BitConverter]::ToString([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(16)) -replace '-'
```

**예시:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 4. .env.local 파일 설정

```bash
# 터미널에서 실행
cat > .env.local << 'EOF'
# =====================================
# Telegram Bot
# =====================================
TELEGRAM_BOT_TOKEN=5123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh

# =====================================
# Gemini API (LEO의 공유 풀)
# =====================================
SHARED_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_MODEL=gemini-2.0-flash-exp

# =====================================
# 암호화 & 보안
# =====================================
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# =====================================
# Rate Limiting
# =====================================
FREE_CREDITS_PER_USER=5
FREE_CREDITS_POOL_TOTAL=50
DAILY_LIMIT_PER_USER=10

# =====================================
# 운영
# =====================================
NODE_ENV=development
LOG_LEVEL=info
ADMIN_TELEGRAM_ID=123456789
EOF
```

### 환경 변수 설명

| 변수 | 설명 | 예시 |
|------|------|------|
| `TELEGRAM_BOT_TOKEN` | 텔레그램 봇 토큰 (필수) | `123:ABCxyz...` |
| `SHARED_API_KEY` | 공유 Gemini API 키 (필수) | `AIzaSy...` |
| `GEMINI_API_MODEL` | 사용할 Gemini 모델 | `gemini-2.0-flash-exp` |
| `ENCRYPTION_KEY` | AES-256 암호화 키 (필수) | 32자 hex 문자열 |
| `FREE_CREDITS_PER_USER` | 신규 사용자 무료 크레딧 | `5` |
| `FREE_CREDITS_POOL_TOTAL` | 전체 무료 풀 한도 | `50` |
| `DAILY_LIMIT_PER_USER` | 사용자별 일일 한도 | `10` |
| `NODE_ENV` | 실행 환경 | `development` 또는 `production` |
| `LOG_LEVEL` | 로그 수준 | `info`, `debug`, `error` |
| `ADMIN_TELEGRAM_ID` | 관리자 텔레그램 ID | `123456789` |

---

## 📦 설치 및 실행

### 의존성 설치

```bash
npm install
```

**설치되는 패키지:**
- `telegraf` - Telegram Bot API 프레임워크
- `@google/generative-ai` - Gemini API 클라이언트
- `dotenv` - 환경 변수 관리

### 개발 모드 실행

```bash
npm run dev
```

**특징:**
- 파일 변경 감지 자동 재시작
- 상세 로그 출력
- 개발 중 테스트에 유용

### 프로덕션 모드 실행

```bash
npm start
```

**특징:**
- 최적화된 실행
- 에러 로깅만 표시
- 프로덕션 환경용

---

## 🎯 주요 기능

### 1. 사용자 관리

**무료 체험 시스템:**
- 신규 사용자 자동 등록
- 무료 5장 이미지 생성 권한
- 자신의 API 키 등록 후 무제한 사용 가능

**API 키 암호화:**
- AES-256-CBC 방식으로 안전하게 암호화
- 복호화할 때만 평문 사용
- 혼합 IV로 매번 다른 결과 생성

### 2. 이미지 생성

**자유 프롬프트 생성:**
```
/생성 현대적인 카페 인테리어
```

**상세페이지 템플릿:**
```
/상세페이지 의류 청바지
/상세페이지 식품 한우
/상세페이지 전자제품 무선이어폰
```

**지원하는 카테고리:**
- 의류 (패션)
- 식품 (음식, 음료)
- 전자제품 (스마트폰, 노트북 등)
- 뷰티 (화장품, 스킨케어)
- 생활용품 (가구, 주방용품)

### 3. 스타일 프리셋

```
/스타일 minimalist  # 미니멀 스타일
/스타일 luxury      # 럭셔리 스타일
/스타일 casual      # 캐주얼 스타일 (기본)
/스타일 natural     # 내추럴 스타일
```

각 스타일은 프롬프트에 자동으로 추가되어 일관된 이미지 생성을 보장합니다.

### 4. 사용 통계

```
/사용량
```

제공 정보:
- 월별 이미지 생성 횟수
- API 키 등록 여부
- 남은 무료 크레딧
- 주간별 사용 추이

---

## 🚀 배포 가이드

### PM2를 사용한 프로덕션 배포

**PM2 설치:**
```bash
npm install -g pm2
```

**봇 시작:**
```bash
pm2 start ecosystem.config.js --name vibers-nanobot
```

**자동 재시작 설정:**
```bash
pm2 startup
pm2 save
```

**상태 확인:**
```bash
pm2 status
pm2 logs vibers-nanobot
```

**중지:**
```bash
pm2 stop vibers-nanobot
pm2 delete vibers-nanobot
```

### Docker를 사용한 배포

**Dockerfile 생성:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 의존성 복사 및 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사
COPY src ./src

# 환경 설정
COPY .env.local .env

# 포트 노출 (필요시)
EXPOSE 3000

# 실행
CMD ["npm", "start"]
```

**이미지 빌드:**
```bash
docker build -t vibers-nanobot:latest .
```

**컨테이너 실행:**
```bash
docker run -d \
  --name vibers-nanobot \
  --env-file .env.local \
  vibers-nanobot:latest
```

### 클라우드 배포 (Vercel, Railway, Render 등)

**주의:** Telegram Bot은 HTTP polling 또는 webhook이 필요합니다.

**Polling 모드 (현재 구현):**
- 폴링 기반이므로 별도의 webhook 설정 불필요
- 대부분의 클라우드 플랫폼에서 지원

**배포 환경변수:**
```
TELEGRAM_BOT_TOKEN=xxx
SHARED_API_KEY=xxx
ENCRYPTION_KEY=xxx
NODE_ENV=production
```

---

## 🗂️ 데이터 저장소

### 저장 위치

모든 데이터는 `data/` 디렉토리에 JSON 파일로 저장됩니다.

```
data/
├── users.json              # 모든 사용자 정보
├── usage_123456789.json    # 사용자별 사용 로그
├── usage_987654321.json
└── ...
```

### 데이터 구조

**users.json:**
```json
{
  "123456789": {
    "telegramId": "123456789",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "encryptedApiKey": "U2FsdGVkX1...",
    "hasOwnApiKey": true,
    "freeCreditsRemaining": 0,
    "currentStylePreset": "luxury",
    "createdAt": "2026-03-07T10:00:00.000Z",
    "updatedAt": "2026-03-07T15:30:00.000Z"
  }
}
```

**usage_[userId].json:**
```json
[
  {
    "command": "/생성",
    "prompt": "현대적인 카페 인테리어",
    "apiProvider": "user",
    "year": 2026,
    "month": 3,
    "day": 7,
    "timestamp": "2026-03-07T10:30:45.123Z"
  },
  {
    "command": "/상세페이지",
    "category": "의류",
    "productName": "청바지",
    "apiProvider": "leo_shared_pool",
    "year": 2026,
    "month": 3,
    "day": 7,
    "timestamp": "2026-03-07T11:15:20.456Z"
  }
]
```

### 데이터 백업

정기적으로 `data/` 디렉토리를 백업하세요:

```bash
# 일일 백업
tar -czf backup_$(date +%Y%m%d).tar.gz data/

# S3로 업로드 (선택사항)
aws s3 cp backup_$(date +%Y%m%d).tar.gz s3://your-bucket/nanobot-backups/
```

---

## 🔍 모니터링 및 로깅

### 로그 출력

```
[2026-03-07T10:30:45.123Z] [INFO] [/시작] User registered: 123456789
[2026-03-07T10:31:12.456Z] [INFO] [/생성] Image generated for user 123456789
[2026-03-07T10:32:00.789Z] [ERROR] [Gemini] Error: Rate limit exceeded
```

### PM2 로그 조회

```bash
# 실시간 로그
pm2 logs vibers-nanobot

# 특정 행 수 표시
pm2 logs vibers-nanobot -n 100

# 로그 파일 경로
~/.pm2/logs/vibers-nanobot-error.log
~/.pm2/logs/vibers-nanobot-out.log
```

---

## 🛡️ 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] Telegram Bot Token을 안전하게 보관하는가?
- [ ] Gemini API Key를 공개 저장소에 노출하지 않는가?
- [ ] Encryption Key를 충분히 복잡하게 생성했는가?
- [ ] API 키 등록 시 메시지가 자동으로 삭제되는가?
- [ ] 정기적으로 데이터를 백업하는가?
- [ ] 로그 파일에 민감한 정보가 기록되지 않는가?

---

## 📊 성능 최적화

### Rate Limiting 설정 조정

`config.js`에서 조정 가능:

```javascript
DAILY_LIMIT_PER_USER: 10        // 사용자당 일일 최대 생성 수
FREE_CREDITS_PER_USER: 5        // 신규 사용자 무료 크레딧
FREE_CREDITS_POOL_TOTAL: 50     // 전체 무료 풀 일일 한도
```

### 메모리 사용량 모니터링

```bash
# PM2 모니터링
pm2 monit

# 시스템 자원 확인
pm2 info vibers-nanobot
```

---

## ❓ 문제 해결

### "봇이 시작되지 않습니다"

```bash
# 1. 환경 변수 확인
cat .env.local

# 2. 필수 변수 확인
echo $TELEGRAM_BOT_TOKEN
echo $SHARED_API_KEY
echo $ENCRYPTION_KEY

# 3. 로그 확인
npm run dev

# 4. 네트워크 연결 확인
ping api.telegram.org
```

### "API 키 오류"

```
❌ 유효하지 않은 API 키입니다
```

**해결:**
- Gemini API Key가 AIza로 시작하는지 확인
- Google Cloud Console에서 API가 활성화되었는지 확인
- 키가 잘못 입력되지 않았는지 확인

### "이미지 생성 실패"

```
❌ 이미지 생성에 실패했습니다
```

**해결:**
- Gemini API 할당량 확인 (https://console.cloud.google.com)
- 네트워크 연결 상태 확인
- 프롬프트 길이 확인 (너무 길면 오류 발생 가능)
- 로그에서 구체적인 오류 확인: `pm2 logs vibers-nanobot`

### "암호화 오류"

```
API 키 암호화 실패
```

**해결:**
- `ENCRYPTION_KEY` 형식 확인 (hex 문자열, 최소 32자)
- 키를 다시 생성해보기

### "데이터 파일 손상"

```
JSON 파싱 오류
```

**해결:**
```bash
# 데이터 파일 복구
rm data/users.json
rm data/usage_*.json

# 봇 재시작 (사용자 데이터 재등록)
npm start
```

---

## 📞 지원

**문제가 발생하면:**

1. 로그 확인: `pm2 logs vibers-nanobot`
2. 환경 변수 확인: `cat .env.local`
3. README.md 참고: `/README.md`
4. 관리자에게 문의

---

## 🔄 업데이트 및 유지보수

### 정기 점검 사항

- [ ] Gemini API 할당량 확인 (월 1회)
- [ ] 데이터 백업 (주 1회)
- [ ] 로그 파일 크기 확인 (월 1회)
- [ ] 사용자 통계 리뷰 (주 1회)
- [ ] 보안 업데이트 확인 (월 1회)

### 패키지 업데이트

```bash
# 의존성 업데이트 확인
npm outdated

# 안전한 업데이트
npm update

# 메이저 버전 업데이트 (주의!)
npm install telegraf@latest
```

---

**생성일**: 2026-03-07
**마지막 수정**: 2026-03-07
**상태**: 프로덕션 준비 완료
