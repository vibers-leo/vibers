# 나노바나나 텔레그램 봇 - vibers-nanobot

쇼핑몰 운영자와 마케팅 담당자를 위한 **AI 이미지 자동 생성 텔레그램 봇**입니다. Gemini API를 활용해 상품 상세페이지, SNS 콘텐츠 등의 고품질 이미지를 빠르게 생성할 수 있습니다.

## 🚀 빠른 시작

### 1. Telegram Bot 생성

1. Telegram에서 [@BotFather](https://t.me/BotFather) 찾기
2. `/newbot` 명령 실행
3. 봇 이름과 username 설정
4. Bot Token 받기 (예: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. 환경 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
TELEGRAM_BOT_TOKEN=your_bot_token_here
SHARED_API_KEY=your_gemini_api_key_here
ENCRYPTION_KEY=your_32_character_hex_key_here1234567890ab
```

### 3. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드 (파일 감시 활성화)
npm run dev

# 프로덕션 실행
npm start

# PM2로 실행
pm2 start ecosystem.config.js
```

## 📱 사용 방법

### 기본 명령어

#### `/시작`
봇을 처음 사용할 때 입력합니다. 환영 메시지와 사용법을 안내합니다.

```
/시작
```

#### `/도움말`
전체 명령어 목록을 확인합니다.

```
/도움말
```

### API 키 관리

#### `/키등록 [API_KEY]`
자신의 Gemini API 키를 등록합니다. 등록하면 무제한으로 이미지를 생성할 수 있습니다.

```
/키등록 AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**주의**: 메시지 보안을 위해 입력 후 자동으로 삭제됩니다.

#### `/키확인`
등록된 API 키의 상태를 확인합니다. (마스킹 표시: AIza***...xxxx)

```
/키확인
```

### 이미지 생성

#### `/생성 [프롬프트]`
자유로운 텍스트 프롬프트로 이미지를 생성합니다.

```
/생성 현대적인 카페 인테리어, 자연광, 미니멀 디자인
```

응답:
- 생성 중 로딩 메시지 표시
- 완료 후 생성된 이미지 전송
- 남은 일일 생성 횟수 표시

#### `/상세페이지 [카테고리] [상품명]`
쇼핑몰 상품 상세페이지 이미지를 자동으로 생성합니다.

**가능한 카테고리:**
- 의류 - 패션 의류
- 식품 - 음식 및 음료
- 전자제품 - 스마트폰, 노트북 등
- 뷰티 - 화장품, 스킨케어
- 생활용품 - 가구, 주방용품 등

**사용 예시:**
```
/상세페이지 의류 청바지
/상세페이지 식품 한우
/상세페이지 전자제품 무선이어폰
/상세페이지 뷰티 에센스
/상세페이지 생활용품 쿠션
```

### 스타일 설정

#### `/스타일 [프리셋]`
이미지 생성 스타일을 변경합니다. 설정 후 생성하는 모든 이미지에 적용됩니다.

**사용 가능한 스타일:**
- `minimalist` - 미니멀 (심플, 무채색, 모던)
- `luxury` - 럭셔리 (고급스러움, 금색 악센트)
- `casual` - 캐주얼 (친근함, 따뜻한 톤) - 기본값
- `natural` - 내추럴 (친환경, 초록색 요소)

**사용 예시:**
```
/스타일 luxury
/스타일 minimalist
```

### 사용량 확인

#### `/사용량`
현재 달의 API 사용량을 확인합니다.

```
/사용량
```

응답 정보:
- 월별 생성 횟수
- API 키 등록 여부
- 남은 무료 크레딧
- 주간별 사용 추이

## 💡 주요 기능

### 무료 체험 시스템
- 신규 사용자: 무료 5장 생성 가능
- 자신의 API 키 등록 후: 무제한 생성
- LEO의 공유 풀 한도: 일일 50장

### 암호화된 API 키 저장
- AES-256 암호화로 안전하게 보관
- 서버와 별도의 안전한 저장소 사용

### 일일 생성 한도
- 사용자당 일일 10장 제한
- 무한정 사용을 막아 리소스 보호

### 상세한 사용 통계
- 월별, 주별 사용 추이 제공
- 언제든 확인 가능한 명확한 인터페이스

## 🏗️ 프로젝트 구조

```
vibers-nanobot/
├── src/
│   ├── bot.js              # 메인 봇 진입점
│   ├── config.js           # 환경 설정 및 검증
│   ├── handlers/           # 명령어 핸들러
│   │   ├── start.js
│   │   ├── help.js
│   │   ├── apiKey.js
│   │   ├── generate.js
│   │   ├── productPage.js
│   │   ├── style.js
│   │   └── usage.js
│   ├── services/           # 핵심 서비스
│   │   ├── gemini.js       # Gemini API 통합
│   │   ├── crypto.js       # AES-256 암호화
│   │   └── storage.js      # JSON 파일 기반 저장소
│   ├── presets/            # 프리셋 라이브러리
│   │   └── prompts.js      # 프롬프트 템플릿
│   └── utils/
│       └── logger.js       # 로깅 유틸리티
├── data/                   # 런타임 데이터 (gitignored)
│   ├── users.json
│   └── usage_*.json
├── package.json
├── .env.example
├── .gitignore
├── ecosystem.config.js     # PM2 설정
└── README.md
```

## 🔧 기술 스택

- **Framework**: Telegraf 4.16.3 (Telegram Bot API)
- **AI Model**: Google Generative AI (Gemini 2.0 Flash)
- **Storage**: JSON 파일 (MongoDB 불필요)
- **Encryption**: Node.js crypto (AES-256-CBC)
- **Runtime**: Node.js 18+

## 📊 데이터 저장소

### `data/users.json`
사용자 프로필 및 설정

```json
{
  "123456789": {
    "telegramId": "123456789",
    "username": "john_doe",
    "firstName": "John",
    "encryptedApiKey": "...",
    "hasOwnApiKey": true,
    "freeCreditsRemaining": 0,
    "currentStylePreset": "luxury",
    "createdAt": "2026-03-07T...",
    "updatedAt": "2026-03-07T..."
  }
}
```

### `data/usage_[telegramId].json`
사용자별 사용 기록

```json
[
  {
    "command": "/생성",
    "prompt": "현대적인 카페...",
    "apiProvider": "user",
    "year": 2026,
    "month": 3,
    "day": 7,
    "timestamp": "2026-03-07T..."
  }
]
```

## 🛡️ 보안 주의사항

1. **API 키 관리**
   - `.env` 파일을 git에 커밋하지 마세요
   - 프로덕션 환경에서는 별도의 `.env.local` 사용

2. **암호화**
   - `ENCRYPTION_KEY`는 32자 이상의 안전한 값으로 설정
   - 사용자 API 키는 항상 암호화 상태로 저장

3. **메시지 삭제**
   - API 키 등록 시 입력 메시지는 자동으로 삭제됨

## 🚀 배포

### PM2를 통한 프로덕션 배포

```bash
# 설치
npm install -g pm2

# 시작
pm2 start ecosystem.config.js

# 자동 재시작 설정
pm2 startup

# 저장
pm2 save
```

### Docker를 사용한 배포

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY .env.local .env
CMD ["npm", "start"]
```

## 📝 로깅

모든 작업은 자동으로 로깅됩니다:

```
[2026-03-07T10:30:45.123Z] [INFO] [/생성] Image generated for user 123456789
[2026-03-07T10:31:12.456Z] [ERROR] [Gemini] Error: Rate limit exceeded
```

## ❓ 문제 해결

### "API 키가 유효하지 않습니다"
- Google AI Studio에서 발급받은 키인지 확인 (AIza로 시작)
- 키를 올바르게 입력했는지 재확인

### "이미지 생성에 실패했습니다"
- Gemini API 할당량 초과 확인
- 네트워크 연결 상태 확인
- 프롬프트가 너무 길지는 않은지 확인

### "일일 한도를 초과했습니다"
- 내일 다시 시도 가능
- 필요시 관리자에게 한도 조정 요청

## 📞 지원

문제가 발생하면:
1. `/도움말`로 명령어 확인
2. 관리자에게 문의
3. 로그 파일 확인

## 📄 라이선스

MIT License

---

**만든이**: nanobanana Team
**최종 수정**: 2026-03-07
