# Vibers Telegram Bot

텔레그램에서 직접 AI 코드 생성 및 GitHub 관리를 할 수 있는 봇입니다.

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
GITHUB_TOKEN=your_github_token_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 📱 사용 방법

### 기본 설정

1. **봇 시작**
   ```
   /start
   ```

2. **GitHub 토큰 설정**
   ```
   /setup
   ```
   그 다음 GitHub Personal Access Token을 보냅니다.

3. **Gemini API 키 설정** (선택)
   ```
   /setgemini YOUR_API_KEY
   ```

### 프로젝트 관리

4. **저장소 목록 보기**
   ```
   /projects
   ```

5. **저장소 선택**
   ```
   /select my-awesome-project
   ```

6. **현재 상태 확인**
   ```
   /info
   ```

### AI 코드 생성

7. **코드 생성**
   ```
   /vibe Create a todo list component
   ```

8. **배포**
   ```
   /deploy
   ```

9. **상태 확인**
   ```
   /status
   ```

## 🎯 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `/start` | 봇 시작 및 환영 메시지 |
| `/help` | 도움말 표시 |
| `/setup` | GitHub 토큰 설정 |
| `/setgemini <key>` | Gemini API 키 설정 |
| `/projects` | 저장소 목록 |
| `/select <repo>` | 저장소 선택 |
| `/info` | 세션 정보 |
| `/vibe <prompt>` | AI 코드 생성 |
| `/deploy` | Vercel 배포 |
| `/status` | 배포 상태 |

## 🔒 보안

- **토큰 자동 삭제**: GitHub 토큰과 API 키를 포함한 메시지는 자동으로 삭제됩니다
- **세션 분리**: 각 사용자는 독립된 세션을 가집니다
- **환경 변수**: 민감한 정보는 .env 파일에 저장됩니다

## 🛠️ 기술 스택

- **Telegraf** 4.16.3 - Telegram Bot 프레임워크
- **TypeScript** 5.9.3
- **Node.js** ES2022
- **dotenv** - 환경 변수 관리

## 📂 프로젝트 구조

```
vibers-telegram-bot/
├── src/
│   └── index.ts          # 메인 봇 로직
├── dist/                 # 빌드 결과물
├── .env.example          # 환경 변수 예시
├── .env                  # 실제 환경 변수 (git 무시)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔜 로드맵

### Phase 2.1 (현재)
- [x] 기본 봇 구조
- [x] 명령어 시스템
- [x] 세션 관리
- [ ] GitHub API 통합
- [ ] Gemini AI 통합
- [ ] 코드 생성 및 푸시

### Phase 2.2 (다음)
- [ ] Vercel 배포 통합
- [ ] 빌드 상태 모니터링
- [ ] 파일 업로드/다운로드
- [ ] 인라인 코드 프리뷰

## 📝 예제

### 완전한 워크플로우

```
사용자: /start
봇: 환영 메시지 + 명령어 안내

사용자: /setup
봇: GitHub 토큰 입력 요청
사용자: ghp_xxxxxxxxxxxx
봇: ✅ GitHub 토큰 저장됨

사용자: /projects
봇: 📦 저장소 목록 표시

사용자: /select my-blog
봇: ✅ my-blog 선택됨

사용자: /vibe Add a dark mode toggle button
봇: 🤖 코드 생성 중...
봇: ✨ 코드 생성 완료!
    📝 3개 파일 생성
    🔗 https://github.com/user/my-blog/commit/abc123

사용자: /deploy
봇: 🚀 Vercel에 배포 중...
봇: ✅ 배포 완료!
    🌐 https://my-blog.vercel.app
```

## 🐛 트러블슈팅

### Bot Token이 작동하지 않음

```bash
# .env 파일 확인
cat .env

# 토큰 형식 확인 (123456789:ABC...)
# @BotFather에서 새 토큰 발급
```

### 메시지 삭제 실패

봇에게 **"Delete messages"** 권한이 필요합니다.
@BotFather → /mybots → 봇 선택 → Bot Settings → Group Privacy → Disable

## 📞 지원

문제가 있으면 GitHub Issues에 등록해주세요.

## 📄 라이선스

MIT License

---

**만든 이**: VeryLabs
**프로젝트**: Vibers Telegram Bot
**버전**: 1.0.0 (Phase 2)
