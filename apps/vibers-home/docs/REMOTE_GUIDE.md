# Vibers Remote - 완전 가이드

PC의 프로젝트를 모바일 앱에서 원격으로 관리하는 시스템입니다.

## 🎯 시스템 개요

```
[Vibers Mobile App] ←→ WebSocket ←→ [PC Agent] ←→ [Local Projects]
   (React Native)      (Port 3456)    (Node.js)     (d:/dev/*)
```

## 🚀 빠른 시작 (5분)

### 1단계: PC Agent 실행

```bash
# 터미널 1
cd d:/dev/nanobanana/vibers-desktop-agent
npm run dev
```

**출력 예시:**
```
🚀 Vibers Desktop Agent
========================
✅ Auth Token: 89ae8ad1-a446-49da-acc1-371dc07c04aa
💡 Save this token in your Vibers mobile app

🌐 WebSocket server listening on port 3456
📍 PC IP: 192.168.219.100
```

📝 **IP 주소와 토큰을 메모하세요!**

### 2단계: 모바일 앱 실행

```bash
# 터미널 2
cd d:/dev/nanobanana/vibers-mobile
npm start
```

Expo 앱에서 QR 코드 스캔 또는 시뮬레이터 실행

### 3단계: PC 연결

**방법 A: Remote 화면에서 직접 연결**
1. 홈 화면 → "PC REMOTE" 버튼
2. PC IP: `192.168.219.100`
3. Port: `3456`
4. Token: `89ae8ad1-a446-49da-acc1-371dc07c04aa`
5. "CONNECT" 클릭

**방법 B: 설정에 저장 (권장)**
1. 홈 화면 → ⚙️ Settings
2. 스크롤 → "PC AGENT CONNECTION"
3. IP, Port, Token 입력
4. "CONFIRM CHANGES" 저장
5. 홈 → "PC REMOTE" → "CONNECT"

### 4단계: 프로젝트 선택 & 작업

1. 연결 성공 → PC 프로젝트 목록 표시
2. 프로젝트 선택 → Workspace 화면
3. 명령어 입력:
   ```bash
   ls
   npm install
   git status
   ```
4. 실시간 출력 확인 ✨

## 📂 프로젝트 구조

```
nanobanana/
├── vibers-desktop-agent/          # PC Agent
│   ├── src/
│   │   ├── server.ts              # WebSocket 서버
│   │   ├── terminal.ts            # 터미널 관리
│   │   └── projectScanner.ts      # 프로젝트 감지
│   └── package.json
│
├── vibers-mobile/                 # 모바일 앱
│   ├── app/
│   │   ├── remote.tsx             # 원격 프로젝트 화면
│   │   ├── workspace.tsx          # 터미널 워크스페이스
│   │   ├── settings.tsx           # PC 연결 설정
│   │   └── index.tsx              # 홈 화면
│   ├── services/
│   │   └── remote-manager.ts      # Socket.io 클라이언트
│   └── package.json
│
└── VIBERS_REMOTE_GUIDE.md         # 이 파일
```

## 🛠️ 주요 기능

### ✅ 구현 완료 (Phase 1)

- [x] **PC Agent** - WebSocket 서버 (포트 3456)
- [x] **터미널 관리** - node-pty 기반 실제 PTY
- [x] **프로젝트 스캔** - 30+ 프레임워크 자동 감지
- [x] **모바일 클라이언트** - Socket.io 연결
- [x] **원격 터미널** - 실시간 명령 실행 & 로그 스트리밍
- [x] **인증** - UUID 토큰 기반
- [x] **UI/UX** - 다크 모드, 네온 그린, 블러 효과

### 🔜 다음 단계 (Phase 2 & 3)

- [ ] **Telegram Bot** - 텔레그램에서 명령 실행
- [ ] **VSCode Extension** - IDE 통합
- [ ] **TLS/SSL** - 보안 연결 (wss://)
- [ ] **자동 재연결** - 연결 끊김 복구
- [ ] **명령 히스토리** - 최근 명령 재사용
- [ ] **파일 업로드/다운로드** - 파일 전송

## 📡 통신 프로토콜

### 이벤트 맵

| 이벤트 | 방향 | 설명 |
|--------|------|------|
| `project:list` | Client → Server | 프로젝트 목록 요청 |
| `terminal:create` | Client → Server | 터미널 세션 생성 |
| `terminal:write` | Client → Server | 명령어 전송 |
| `terminal:resize` | Client → Server | 터미널 크기 조정 |
| `terminal:kill` | Client → Server | 터미널 종료 |
| `terminal:data` | Server → Client | 터미널 출력 스트리밍 |
| `terminal:exit` | Server → Client | 터미널 종료 알림 |

### 데이터 구조

**RemoteProject**
```typescript
interface RemoteProject {
  id: string;                  // 프로젝트 고유 ID
  name: string;                // 프로젝트 이름
  path: string;                // 절대 경로
  type: string | null;         // 프레임워크 타입 (next, vite, etc)
  serverCommand: string | null; // 개발 서버 명령어
}
```

**TerminalSession**
```typescript
interface TerminalSession {
  sessionId: string;           // 세션 ID
  projectId: string;           // 프로젝트 ID
  type: 'cli' | 'server';      // 터미널 타입
}
```

## 🔒 보안 고려사항

### 현재 구현

✅ **UUID 토큰 인증** - 서버 시작 시 자동 생성
✅ **로컬 네트워크 전용** - 같은 WiFi 필요
⚠️ **평문 통신** - WebSocket (ws://)

### 프로덕션 배포 전 필수

- [ ] TLS/SSL 인증서 적용 (wss://)
- [ ] 토큰 자동 갱신 메커니즘
- [ ] IP 화이트리스트
- [ ] 세션 타임아웃 (15분)
- [ ] 명령어 실행 권한 제한

### 네트워크 요구사항

**필수:**
- PC와 모바일이 **동일한 WiFi 네트워크**에 연결
- 방화벽에서 **포트 3456 허용**

**선택 (공용 IP 사용 시):**
- 라우터 포트 포워딩 설정
- 또는 ngrok/Tailscale 터널링

## 🐛 트러블슈팅

### 연결 실패

**증상:** "Connection failed" 에러

**해결:**
1. PC Agent가 실행 중인지 확인
   ```bash
   # 실행 중이면 "Waiting for mobile app connection..." 표시됨
   ```
2. 같은 WiFi 네트워크인지 확인
   ```bash
   # PC에서 IP 확인
   ipconfig  # Windows
   ifconfig  # macOS/Linux
   ```
3. 방화벽 확인
   - Windows Defender → 인바운드 규칙 → 포트 3456 허용
4. 토큰 복사 확인
   - 공백 없이 정확히 복사했는지 확인

### 프로젝트 목록이 비어있음

**증상:** "프로젝트가 없습니다" 메시지

**해결:**
1. 검색 경로 확인
   ```typescript
   // vibers-desktop-agent/src/projectScanner.ts
   const searchDirs = [
     'C:/Users/dev',  // Windows
     '/Users/dev',    // macOS
     // 커스텀 경로 추가
   ];
   ```
2. package.json 또는 .git 폴더 존재 확인
3. PC Agent 재시작

### 터미널 명령이 실행되지 않음

**증상:** 명령 입력 후 응답 없음

**해결:**
1. 세션 ID 확인
   ```typescript
   console.log(remoteSessionId); // null이면 세션 생성 실패
   ```
2. 명령어 끝에 `\n` 추가 확인
3. PC Agent 로그 확인
   ```bash
   # PC Agent 터미널에서 에러 메시지 확인
   ```

## 📊 지원하는 프로젝트 타입

### Frontend 프레임워크
- Next.js (`next`)
- Vite (`vite`)
- Create React App (`cra`)
- Angular (`angular`)
- Svelte/SvelteKit (`svelte`)
- Gatsby (`gatsby`)
- Nuxt (`nuxt`)
- Astro (`astro`)
- Remix (`remix`)

### 모바일
- Expo (`expo`)
- React Native (`react-native`)

### Backend
- NestJS (`nestjs`)
- Express (`express`)
- Fastify (`fastify`)
- Hono (`hono`)
- Koa (`koa`)

### Python
- Django (`django`)
- Flask (`flask`)

### Ruby
- Rails (`rails`)
- Sinatra (`sinatra`)

### 기타
- Electron (`electron`)
- Go (`go`)
- Rust (`rust`)
- Node.js (`node`)
- Git 저장소 (`git`)

## 🎨 UI/UX 특징

### 디자인 시스템

**컬러:**
- 배경: `#0a0a0a` (다크)
- 악센트: `#39FF14` (네온 그린)
- 텍스트: `#fff`, `rgba(255,255,255,0.6)`

**타이포그래피:**
- 일반: San Francisco (iOS), Roboto (Android)
- 터미널: Menlo (iOS), Monospace (Android)

**효과:**
- 블러: `BlurView` (유리 모피즘)
- 햅틱: 모든 버튼 인터랙션

### 화면 구성

1. **홈 화면** (`index.tsx`)
   - "PC REMOTE" 버튼 추가 ✨
   - NEW SESSION, GALLERY, SESSIONS

2. **Remote 화면** (`remote.tsx`)
   - 연결 폼 (IP, Port, Token)
   - 프로젝트 목록 (타입별 색상 인디케이터)

3. **Workspace 화면** (`workspace.tsx`)
   - 기본 모드: AI 코드 생성
   - 원격 모드: 터미널 인터페이스 ✨

4. **Settings 화면** (`settings.tsx`)
   - PC AGENT CONNECTION 섹션 추가 ✨

## 📝 예제 사용 시나리오

### 시나리오 1: 새 패키지 설치

```bash
# 모바일 터미널에서
npm install axios
```

→ PC에서 실제 npm install 실행
→ 실시간 로그 스트리밍
→ 완료 후 "SEND" 다시 활성화

### 시나리오 2: Git 상태 확인

```bash
git status
git log --oneline -5
```

→ 현재 브랜치, 변경 파일 확인
→ 최근 5개 커밋 확인

### 시나리오 3: 개발 서버 시작

```bash
npm run dev
```

→ Next.js/Vite 등 개발 서버 실행
→ 로그 실시간 모니터링
→ 에러 발생 시 즉시 확인

## 🔗 참고 자료

### 공식 문서
- [Socket.io](https://socket.io/docs/v4/)
- [node-pty](https://github.com/microsoft/node-pty)
- [Expo Router](https://docs.expo.dev/router/introduction/)

### 영감 출처
- [VeryTerm](https://github.com/verylabs/veryterm) - 터미널 관리 패턴

### 관련 프로젝트
- vibers-desktop-agent → [README](vibers-desktop-agent/README.md)
- vibers-mobile → Expo 프로젝트

## 🙋 FAQ

**Q: 인터넷이 없어도 동작하나요?**
A: 네! 같은 WiFi에만 연결되어 있으면 인터넷 없이도 동작합니다.

**Q: 여러 PC를 동시에 연결할 수 있나요?**
A: 현재는 한 번에 하나의 PC만 연결 가능합니다. 여러 PC를 관리하려면 설정에서 IP/Token을 변경해야 합니다.

**Q: iOS와 Android 모두 지원하나요?**
A: 네! Expo를 사용하므로 두 플랫폼 모두 지원합니다.

**Q: Windows/macOS/Linux 모두 지원하나요?**
A: 네! Node.js가 실행되는 모든 플랫폼에서 PC Agent를 실행할 수 있습니다.

**Q: 보안이 걱정됩니다.**
A: 현재는 로컬 네트워크 전용이며 토큰 인증을 사용합니다. 프로덕션 배포 시에는 TLS/SSL 적용이 필수입니다.

## 📞 지원

이슈가 있으면 GitHub Issues에 등록해주세요.

---

**만든 이**: VeryLabs
**라이선스**: MIT
**버전**: 1.0.0 (Phase 1 완료)
