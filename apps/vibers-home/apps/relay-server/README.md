# Vibers Relay Server

WebSocket 중계 서버 - Vibers Mobile App과 VSCode Extension을 연결합니다.

## 🎯 목적

이 서버는 **Mobile App**과 **VSCode Extension** 간의 실시간 양방향 통신을 중계합니다.

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Mobile App     │ ◄─────► │  Relay Server    │ ◄─────► │ VSCode Extension│
│  (Socket.io)    │   WS    │  (Port 3457)     │   WS    │  (WebSocket)    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

## 🚀 빠른 시작

### 설치

```bash
cd vibers-relay-server
npm install
```

### 실행

#### 개발 모드 (자동 재시작)
```bash
npm run dev
```

#### 프로덕션 빌드 및 실행
```bash
npm run build
npm start
```

### 예상 출력

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🌟 VIBERS RELAY SERVER 🌟                    ║
║                                                            ║
║  WebSocket Relay between Mobile App and VSCode Extension  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

✅ Server is running!

📡 WebSocket listening on: ws://localhost:3457
🔗 Mobile App endpoint: ws://localhost:3457
🔗 VSCode Extension endpoint: ws://localhost:3457

🏥 Health check: http://localhost:3458/health
```

## 📡 통신 프로토콜

### 1. Handshake (연결 시작)

**클라이언트 → 서버**
```json
{
  "type": "handshake",
  "source": "mobile" | "vscode",
  "sessionId": "optional-session-id",
  "workspaceFolder": "/path/to/workspace" // VSCode만 해당
}
```

**서버 → 클라이언트**
```json
{
  "type": "handshake:response",
  "success": true,
  "clientId": "uuid-v4",
  "sessionId": "session-id",
  "timestamp": "2026-02-12T10:00:00.000Z"
}
```

### 2. 메시지 라우팅

**Mobile → VSCode (예: 파일 열기)**
```json
{
  "type": "openFile",
  "source": "mobile",
  "target": "vscode",
  "requestId": "uuid",
  "filePath": "/path/to/file.ts"
}
```

**VSCode → Mobile (예: 응답)**
```json
{
  "type": "openFile:response",
  "source": "vscode",
  "target": "mobile",
  "requestId": "uuid",
  "success": true
}
```

### 3. Ping/Pong (연결 유지)

**클라이언트 → 서버**
```json
{
  "type": "ping"
}
```

**서버 → 클라이언트**
```json
{
  "type": "pong",
  "timestamp": "2026-02-12T10:00:00.000Z"
}
```

### 4. 상태 조회

**클라이언트 → 서버**
```json
{
  "type": "status"
}
```

**서버 → 클라이언트**
```json
{
  "type": "status:response",
  "clients": {
    "mobile": 1,
    "vscode": 2
  },
  "uptime": 3600.5,
  "timestamp": "2026-02-12T10:00:00.000Z"
}
```

## 🔧 환경 변수

**.env 파일 (선택)**
```env
PORT=3457
```

기본값: `3457`

## 📊 Health Check

서버 상태를 HTTP로 확인할 수 있습니다.

```bash
curl http://localhost:3458/health
```

**응답 예시:**
```json
{
  "status": "ok",
  "uptime": 3600.5,
  "clients": {
    "mobile": 1,
    "vscode": 2
  },
  "timestamp": "2026-02-12T10:00:00.000Z"
}
```

## 🛠️ 개발

### 프로젝트 구조

```
vibers-relay-server/
├── src/
│   └── index.ts          # 메인 서버 로직
├── dist/                 # 컴파일된 JavaScript (빌드 후)
├── package.json
├── tsconfig.json
└── README.md
```

### 빌드

```bash
npm run build
```

컴파일된 파일: `dist/index.js`

### 실행 (빌드 후)

```bash
node dist/index.js
```

## 🔌 클라이언트 연결 예시

### Mobile App (Socket.io)

```typescript
import io from 'socket.io-client';

const socket = io('ws://localhost:3457', {
  transports: ['websocket']
});

// Handshake
socket.emit('message', JSON.stringify({
  type: 'handshake',
  source: 'mobile',
  sessionId: 'my-session'
}));

// 메시지 수신
socket.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received:', message);
});
```

### VSCode Extension (WebSocket)

```typescript
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3457');

// Handshake
ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'handshake',
    source: 'vscode',
    workspaceFolder: '/Users/dev/my-project'
  }));
});

// 메시지 수신
ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('Received:', message);
});
```

## 📝 로그 예시

```
🔌 New connection: a1b2c3d4-e5f6-7890-abcd-ef1234567890

👋 Handshake: mobile (session: my-session)
📨 Routed: mobile → vscode (openFile)
📨 Routed: vscode → mobile (openFile:response)

🔌 Disconnected: mobile (a1b2c3d4-e5f6-7890-abcd-ef1234567890)
📊 Connected: 0 mobile, 1 vscode
```

## 🐛 트러블슈팅

### 서버가 시작되지 않음

**오류:** `EADDRINUSE: address already in use`

**해결:**
```bash
# Windows
netstat -ano | findstr :3457
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3457 | xargs kill -9
```

### 클라이언트가 연결되지 않음

**확인 사항:**
1. 서버가 실행 중인지 확인
2. 방화벽에서 포트 3457 허용
3. WebSocket URL이 정확한지 확인 (`ws://`, not `wss://`)

### 메시지가 라우팅되지 않음

**확인 사항:**
1. Handshake를 먼저 보냈는지 확인
2. `source` 필드가 올바른지 확인 (`mobile` 또는 `vscode`)
3. 상대편 클라이언트가 연결되어 있는지 확인 (`/health` endpoint로 확인)

## 🔒 보안

### 프로덕션 배포 시

**권장 사항:**
1. **TLS/SSL 사용** - `wss://` 프로토콜
2. **인증 토큰** - Handshake에 토큰 추가
3. **CORS 설정** - 허용된 origin만 연결
4. **Rate Limiting** - DDoS 방지

**예시 (인증 추가):**
```typescript
// 클라이언트
{
  "type": "handshake",
  "source": "mobile",
  "token": "secret-auth-token"
}

// 서버 (src/index.ts)
if (message.token !== process.env.AUTH_TOKEN) {
  ws.close(1008, 'Unauthorized');
  return;
}
```

## 📄 라이선스

MIT License

## 🙏 크레딧

**Vibers Relay Server**는 VeryLabs에서 제작했습니다.

---

**버전**: 1.0.0 (Phase 3)
**업데이트**: 2026-02-12
