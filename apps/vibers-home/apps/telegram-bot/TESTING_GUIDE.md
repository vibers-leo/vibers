# Vibers Telegram Bot - 테스트 가이드

완전한 테스트 가이드 - 봇 생성부터 실제 사용까지

## 📋 사전 준비

### 1. Telegram Bot 생성

1. **Telegram 앱 열기**
2. **@BotFather 검색** 및 대화 시작
3. **/newbot** 명령 실행
4. **봇 이름 입력** (예: `Vibers Test Bot`)
5. **봇 username 입력** (예: `vibers_test_bot`, 반드시 `_bot`으로 끝나야 함)
6. **Bot Token 복사** (예: `7891234567:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`)

### 2. GitHub Personal Access Token 생성

1. **GitHub 로그인** → Settings
2. **Developer settings** → Personal access tokens → Tokens (classic)
3. **Generate new token (classic)**
4. **Note** 입력: `Vibers Bot`
5. **Expiration**: 90 days (또는 No expiration)
6. **Scopes 선택**:
   - ✅ `repo` (전체)
   - ✅ `workflow`
7. **Generate token** 클릭
8. **토큰 복사** (예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 3. Gemini API Key 발급 (선택)

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. **Get API Key** 클릭
3. **Create API key in new project**
4. **API Key 복사** (예: `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## 🛠️ 봇 설정

### Step 1: 환경 변수 설정

```bash
cd d:/dev/nanobanana/vibers-telegram-bot

# .env 파일 생성
cp .env.example .env
```

**.env 파일 편집:**
```env
TELEGRAM_BOT_TOKEN=7891234567:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 2: 봇 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev
```

**예상 출력:**
```
🤖 Starting Vibers Telegram Bot...

✅ Bot is running!
💡 Send /start to your bot in Telegram

Press Ctrl+C to stop
```

## 📱 테스트 시나리오

### 시나리오 1: 기본 설정

#### 1.1 봇 시작
```
/start
```

**예상 응답:**
```
🚀 Welcome to Vibers Bot, [Your Name]!

I can help you manage your coding projects right from Telegram.

*Available Commands:*
/setup - Configure your GitHub token
/projects - List your repositories
...
```

#### 1.2 도움말 확인
```
/help
```

**예상 응답:**
```
📚 *Vibers Bot Help*

*Setup Commands:*
/setup - Configure GitHub token
/setgemini <key> - Set Gemini API key
...
```

#### 1.3 현재 상태 확인
```
/info
```

**예상 응답:**
```
ℹ️ *Session Info*

❌ GitHub Token
❌ Gemini API Key
📦 Repository: `None`
```

### 시나리오 2: GitHub 설정

#### 2.1 GitHub 토큰 설정
```
/setup
```

**봇 응답:**
```
🔑 *GitHub Setup*

To use Vibers Bot, I need your GitHub Personal Access Token.

*How to get a token:*
1. Go to GitHub Settings → Developer settings → Personal access tokens
...

*Send me your token:*
Just paste it in the next message (it will be deleted for security)
```

**토큰 전송:**
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**봇 응답:**
```
✅ GitHub token saved securely!

Now try /projects to see your repositories.
```

*토큰 메시지가 자동 삭제됨*

#### 2.2 Gemini API Key 설정 (선택)
```
/setgemini AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**봇 응답:**
```
✅ Gemini API key saved!
```

*API Key 메시지가 자동 삭제됨*

#### 2.3 설정 확인
```
/info
```

**예상 응답:**
```
ℹ️ *Session Info*

✅ GitHub Token
✅ Gemini API Key
📦 Repository: `None`
```

### 시나리오 3: 저장소 관리

#### 3.1 저장소 목록 조회
```
/projects
```

**봇 응답:**
```
🔄 Fetching your repositories...

📦 *Your Repositories:*

1. 🌐 *my-awesome-project*
   _My first awesome project_
   `/select my-awesome-project`

2. 🔒 *secret-app*
   _Private application_
   `/select secret-app`

3. 🌐 *portfolio*
   `/select portfolio`
```

#### 3.2 저장소 선택
```
/select my-awesome-project
```

**봇 응답:**
```
✅ Selected repository: *my-awesome-project*
```

#### 3.3 상태 확인
```
/info
```

**예상 응답:**
```
ℹ️ *Session Info*

✅ GitHub Token
✅ Gemini API Key
📦 Repository: `my-awesome-project`
```

### 시나리오 4: AI 코드 생성 (핵심!)

#### 4.1 간단한 컴포넌트 생성
```
/vibe Create a button component with hover effect
```

**봇 응답 (순서대로):**
```
🤖 Generating code for: *Create a button component with hover effect*

⏳ This may take a moment...
```

```
🧠 Using Gemini AI...
```

```
📝 Generated 2 file(s). Pushing to GitHub...
```

```
✨ *Code Generated & Pushed!*

버튼 컴포넌트를 생성했습니다! 호버 효과와 함께 사용할 수 있어요.

📦 *Files created:*
➕ `src/components/Button.tsx`
➕ `README.md`

🔗 [View on GitHub](https://github.com/username/my-awesome-project/commit/abc123)

💡 *Next steps:*
1. 컴포넌트 스타일 커스터마이즈
2. 추가 기능 구현
3. TypeScript 타입 개선
```

#### 4.2 페이지 생성
```
/vibe Build a login page with email and password fields
```

**봇 응답:**
```
🤖 Generating code for: *Build a login page with email and password fields*

⏳ This may take a moment...

🧠 Using Gemini AI...

📝 Generated 3 file(s). Pushing to GitHub...

✨ *Code Generated & Pushed!*

로그인 페이지를 생성했습니다! 이메일과 비밀번호 필드가 포함되어 있어요.

📦 *Files created:*
➕ `src/pages/Login.tsx`
➕ `src/components/LoginForm.tsx`
➕ `src/styles/login.css`

🔗 [View on GitHub](https://github.com/username/my-awesome-project)

💡 *Next steps:*
1. 로그인 로직 추가
2. 유효성 검증 구현
3. 에러 처리 추가
```

#### 4.3 Gemini 없이 테스트 (시뮬레이션 모드)

Gemini API Key 없이 테스트하려면:

```bash
# .env에서 GEMINI_API_KEY 주석 처리
# GEMINI_API_KEY=

# 봇 재시작
npm run dev
```

```
/vibe Create a todo list component
```

**봇 응답:**
```
💡 No Gemini API key set. Using simulation mode...
(Set key with /setgemini to use real AI)

📝 Generated 2 file(s). Pushing to GitHub...

✨ *Code Generated & Pushed!*
...
```

## 🧪 테스트 체크리스트

### 기본 기능
- [ ] `/start` - 환영 메시지 표시
- [ ] `/help` - 도움말 표시
- [ ] `/info` - 세션 정보 표시

### GitHub 설정
- [ ] `/setup` - 토큰 설정 안내
- [ ] 토큰 전송 - 자동 저장 및 메시지 삭제
- [ ] `/setgemini` - API Key 저장

### 저장소 관리
- [ ] `/projects` - 실제 저장소 목록 표시
- [ ] `/select <repo>` - 저장소 선택
- [ ] 저장소 이름에 공백 있을 때 처리

### AI 코드 생성
- [ ] `/vibe <prompt>` - Gemini API로 코드 생성
- [ ] 생성된 파일 GitHub에 푸시
- [ ] 커밋 URL 반환
- [ ] 시뮬레이션 모드 작동 (API Key 없을 때)

### 에러 처리
- [ ] 토큰 없이 `/projects` 실행
- [ ] 저장소 선택 없이 `/vibe` 실행
- [ ] 잘못된 GitHub 토큰
- [ ] 존재하지 않는 저장소 선택

## 🐛 문제 해결

### Bot이 응답하지 않음

**확인 사항:**
1. 봇이 실행 중인지 확인
   ```bash
   # 터미널에 "✅ Bot is running!" 표시되어야 함
   ```

2. Bot Token이 정확한지 확인
   ```bash
   # .env 파일 확인
   cat .env | grep TELEGRAM_BOT_TOKEN
   ```

3. @BotFather에서 봇 상태 확인
   ```
   /mybots → 봇 선택 → API Token 확인
   ```

### GitHub API 오류

**오류:** `GitHub API error: 401`

**해결:**
1. GitHub 토큰 재발급
2. Scope 확인 (`repo`, `workflow` 필요)
3. 토큰 만료 확인

**오류:** `Repository not found`

**해결:**
1. 저장소 이름 정확히 입력
2. 대소문자 구분 확인
3. 저장소가 실제로 존재하는지 GitHub에서 확인

### Gemini API 오류

**오류:** `Gemini API error: 400`

**해결:**
1. API Key 확인
2. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 Key 상태 확인
3. 일일 한도 확인

**오류:** `Failed to parse Gemini response`

**해결:**
- 시뮬레이션 모드로 전환 (Gemini API Key 제거)
- 또는 프롬프트를 더 구체적으로 작성

## 📊 성공 기준

✅ **Phase 2 완료 조건:**

1. [ ] 봇이 정상적으로 실행됨
2. [ ] GitHub 토큰 설정 성공
3. [ ] 저장소 목록 조회 성공
4. [ ] 저장소 선택 가능
5. [ ] `/vibe` 명령으로 코드 생성
6. [ ] 생성된 코드가 GitHub에 푸시됨
7. [ ] 커밋 URL 반환됨
8. [ ] 시뮬레이션 모드 작동

## 🎉 다음 단계

Phase 2 테스트가 완료되면:

1. **Phase 3 시작** - VSCode Extension
2. **개선 사항 추가**:
   - Vercel 배포 통합
   - 파일 다운로드
   - 인라인 코드 프리뷰
   - 사용자별 프로젝트 컨텍스트 유지

---

**문서 작성**: 2026-02-12
**버전**: 1.0.0 (Phase 2)
