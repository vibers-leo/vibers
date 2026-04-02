# Vibers Desktop Agent

PC의 여러 프로젝트를 모바일 앱에서 원격으로 관리할 수 있게 해주는 WebSocket 기반 데스크톱 에이전트입니다.

## 🚀 빠른 시작

### 설치

```bash
npm install
```

### 개발 모드 실행

```bash
npm run dev
```

서버가 시작되면 다음과 같은 정보가 표시됩니다:

```
🚀 Vibers Desktop Agent
========================
✅ Auth Token: 89ae8ad1-a446-49da-acc1-371dc07c04aa
💡 Save this token in your Vibers mobile app

🌐 WebSocket server listening on port 3456
📍 PC IP: 192.168.219.100

Waiting for mobile app connection...
```

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 📱 모바일 앱과 연결하기

1. **PC Agent 실행** - 위의 개발 모드 실행 명령 사용
2. **IP 주소와 토큰 확인** - 콘솔에 출력된 정보 기록
3. **모바일 앱 열기** - Vibers 모바일 앱 실행
4. **연결 설정**
   - 홈 화면에서 "PC REMOTE" 버튼 클릭
   - PC IP 주소 입력 (예: `192.168.219.100`)
   - Port 입력 (기본값: `3456`)
   - Auth Token 붙여넣기
   - "CONNECT" 버튼 클릭

## 🏗️ 아키텍처

### 핵심 컴포넌트

#### 1. WebSocket Server (`src/server.ts`)
- Socket.io 기반 실시간 통신
- 포트 3456에서 리스닝
- UUID 기반 토큰 인증
- CORS 허용 (개발 환경)

#### 2. Terminal Manager (`src/terminal.ts`)
- node-pty를 사용한 실제 PTY 세션 관리
- 프로젝트별 CLI 터미널 생성
- 실시간 output 스트리밍
- 세션 생명주기 관리

#### 3. Project Scanner (`src/projectScanner.ts`)
- 홈 디렉토리에서 프로젝트 자동 감지
- 30개 이상 프레임워크 지원:
  - **Frontend**: Next.js, React, Vite, Angular, Svelte, Gatsby, Astro
  - **Mobile**: Expo, React Native
  - **Backend**: NestJS, Express, Fastify, Hono, Koa
  - **Python**: Django, Flask
  - **Ruby**: Rails, Sinatra
  - **Others**: Go, Rust, Electron

### 통신 프로토콜

#### 클라이언트 → 서버 이벤트

**프로젝트 관리**
```typescript
// 프로젝트 목록 요청
socket.emit('project:list', {}, (response) => {
  console.log(response.projects); // RemoteProject[]
});
```

**터미널 관리**
```typescript
// 터미널 세션 생성
socket.emit('terminal:create', {
  projectId: 'my-project',
  projectPath: '/Users/dev/my-project',
  type: 'cli' // or 'server'
}, (response) => {
  console.log(response.sessionId); // string
});

// 터미널에 명령 전송
socket.emit('terminal:write', {
  sessionId: 'abc-123',
  data: 'npm install\n'
});

// 터미널 크기 조정
socket.emit('terminal:resize', {
  sessionId: 'abc-123',
  cols: 80,
  rows: 24
});

// 터미널 종료
socket.emit('terminal:kill', {
  sessionId: 'abc-123'
});
```

#### 서버 → 클라이언트 이벤트

```typescript
// 터미널 출력 데이터
socket.on('terminal:data', ({ sessionId, data }) => {
  console.log(data); // 실시간 터미널 출력
});

// 터미널 종료
socket.on('terminal:exit', ({ sessionId, exitCode }) => {
  console.log(`Session ${sessionId} exited with code ${exitCode}`);
});
```

## 🔧 설정

### 환경 변수

`.env` 파일 생성:

```env
PORT=3456
NODE_ENV=development
```

### 프로젝트 검색 경로

기본적으로 다음 디렉토리를 검색합니다:
- `~/dev`
- `~/projects`
- `~/workspace`
- `~/code`
- `~/Documents/dev`
- `~/Documents/projects`
- `d:/dev` (Windows)
- `c:/dev` (Windows)

커스텀 경로를 추가하려면 `src/projectScanner.ts`의 `searchDirs` 배열을 수정하세요.

## 🔒 보안

### 인증

- 서버 시작 시 UUID v4 토큰 자동 생성
- 모든 WebSocket 연결에 토큰 인증 필요
- 잘못된 토큰으로 연결 시도 시 자동 거부

### 네트워크

⚠️ **주의사항**:
- 현재 버전은 로컬 네트워크 전용입니다
- PC와 모바일이 **같은 WiFi 네트워크**에 있어야 합니다
- 방화벽에서 포트 3456을 허용해야 합니다

### 향후 보안 개선 계획

- [ ] TLS/SSL 지원 (wss://)
- [ ] IP 화이트리스트
- [ ] 토큰 자동 갱신
- [ ] 세션 타임아웃

## 🛠️ 개발

### 스크립트

```bash
npm run dev        # 개발 모드 (nodemon + ts-node)
npm run build      # TypeScript 컴파일
npm start          # 프로덕션 모드
npm run typecheck  # 타입 체크 (컴파일 없이)
```

### 기술 스택

- **Node.js** + **TypeScript**
- **Socket.io** ^4.8.3 - WebSocket 통신
- **node-pty** ^1.1.0 - 터미널 에뮬레이터
- **Express** ^5.2.1 - HTTP 서버
- **uuid** ^13.0.0 - 토큰 생성

### 디렉토리 구조

```
vibers-desktop-agent/
├── src/
│   ├── server.ts          # WebSocket 서버 메인
│   ├── terminal.ts        # 터미널 관리자
│   ├── projectScanner.ts  # 프로젝트 스캐너
│   └── auth.ts            # 인증 모듈 (예정)
├── dist/                  # 빌드 결과물
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 트러블슈팅

### 포트 3456이 이미 사용 중

```bash
# 포트를 사용하는 프로세스 찾기
netstat -ano | findstr :3456  # Windows
lsof -i :3456                 # macOS/Linux

# 프로세스 종료 후 재실행
```

### 모바일 앱이 연결되지 않음

1. **같은 네트워크 확인** - PC와 모바일이 동일한 WiFi에 연결되어 있는지 확인
2. **방화벽 확인** - Windows Defender 방화벽에서 포트 3456 허용
3. **IP 주소 확인** - 콘솔에 표시된 IP 주소가 정확한지 확인
4. **토큰 확인** - Auth Token을 정확히 복사했는지 확인

### node-pty 빌드 오류

```bash
# Python 및 build tools 설치 필요
# Windows
npm install --global windows-build-tools

# macOS
xcode-select --install

# Linux
sudo apt-get install build-essential python3
```

## 📝 라이선스

MIT

## 🙏 크레딧

이 프로젝트는 [VeryTerm](https://github.com/verylabs/veryterm)의 터미널 관리 패턴에서 영감을 받았습니다.

## 🔗 관련 링크

- [Vibers Mobile App](../vibers-mobile/)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [node-pty GitHub](https://github.com/microsoft/node-pty)
