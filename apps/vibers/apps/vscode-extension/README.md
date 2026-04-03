# Vibers Remote Coding - VSCode Extension

VSCode를 모바일 디바이스에서 원격으로 제어할 수 있는 확장 프로그램입니다.

## 🚀 기능

### 원격 파일 관리
- **파일 열기** - 모바일에서 파일 경로 지정하여 VSCode에서 열기
- **파일 편집** - 모바일에서 생성한 코드를 VSCode에 자동 삽입
- **파일 생성** - 새 파일 생성 및 내용 작성

### 터미널 제어
- **터미널 생성** - 새 터미널 세션 열기
- **명령 실행** - 터미널에 명령어 전송

### 워크스페이스 정보
- **열린 파일 조회** - 현재 열려있는 편집기 목록
- **워크스페이스 폴더** - 프로젝트 폴더 경로

### Status Bar
- **연결 상태 표시** - 실시간 연결 상태 인디케이터
- **클릭 동작** - 상태바 클릭으로 연결 정보 확인

## 📦 설치

### 방법 1: VSIX 파일 설치 (권장)

```bash
# Extension 빌드
cd vibers-vscode-extension
npm install
npm run compile

# VSIX 패키지 생성
npx @vscode/vsce package

# VSCode에서 설치
# Extensions → ... → Install from VSIX...
```

### 방법 2: 개발 모드

```bash
# Extension 디렉토리에서
npm install
npm run watch

# VSCode에서 F5 눌러 Extension Development Host 실행
```

## ⚙️ 설정

### Extension 설정

1. **Command Palette** 열기 (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Preferences: Open Settings (JSON)** 선택
3. 다음 설정 추가:

```json
{
  "vibers.relayServer": "ws://localhost:3457",
  "vibers.autoConnect": false
}
```

**설정 옵션:**
- `vibers.relayServer`: Relay 서버 URL (기본: `ws://localhost:3457`)
- `vibers.autoConnect`: VSCode 시작 시 자동 연결 (기본: `false`)

## 🔌 사용 방법

### 1. Relay Server 실행

Vibers Extension은 Relay Server를 통해 모바일과 통신합니다.

```bash
# Relay Server는 별도로 구현 필요
# vibers-relay-server 프로젝트 참고
cd vibers-relay-server
npm start
```

### 2. Extension 활성화

VSCode를 실행하면 Extension이 자동으로 활성화됩니다.

Status Bar 우측에 "Vibers: Disconnected" 표시됨.

### 3. 모바일 연결

**Command Palette에서:**
```
Vibers: Connect to Mobile
```

또는 **Status Bar 아이콘 클릭**

### 4. 모바일에서 제어

모바일 Vibers 앱에서 VSCode 탭으로 이동하여 명령 실행:

- "index.html 파일 열어줘"
- "Button 컴포넌트 추가해줘"
- "터미널에서 npm install 실행"

## 📡 통신 프로토콜

### 메시지 형식

**Handshake (VSCode → Mobile)**
```json
{
  "type": "handshake",
  "source": "vscode",
  "workspaceFolder": "/path/to/project",
  "extensionVersion": "1.0.0"
}
```

**Open File (Mobile → VSCode)**
```json
{
  "type": "openFile",
  "requestId": "uuid",
  "filePath": "/path/to/file.ts"
}
```

**Edit File (Mobile → VSCode)**
```json
{
  "type": "editFile",
  "requestId": "uuid",
  "filePath": "/path/to/file.ts",
  "content": "file content here"
}
```

**Run Command (Mobile → VSCode)**
```json
{
  "type": "runCommand",
  "requestId": "uuid",
  "command": "workbench.action.files.save",
  "args": []
}
```

**Terminal (Mobile → VSCode)**
```json
{
  "type": "terminal",
  "requestId": "uuid",
  "action": "create" | "sendText",
  "command": "npm install"
}
```

### 응답 형식

```json
{
  "type": "openFile:response",
  "requestId": "uuid",
  "success": true,
  "error": "error message if failed"
}
```

## 🛠️ 개발

### 프로젝트 구조

```
vibers-vscode-extension/
├── src/
│   └── extension.ts       # Main extension logic
├── out/                   # Compiled JavaScript
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript config
└── README.md
```

### 빌드

```bash
# TypeScript 컴파일
npm run compile

# Watch 모드
npm run watch

# Lint
npm run lint
```

### 테스트

```bash
# F5로 Extension Development Host 실행
# 또는
npm test
```

### 패키징

```bash
# VSIX 파일 생성
npx @vscode/vsce package

# 결과: vibers-remote-1.0.0.vsix
```

## 🔒 보안

- WebSocket 연결은 로컬 네트워크 전용
- 프로덕션 사용 시 TLS/SSL (wss://) 필수
- 인증 토큰 추가 권장

## 🐛 트러블슈팅

### Extension이 활성화되지 않음

**확인:**
1. VSCode 버전 확인 (1.80.0 이상)
2. Output 패널에서 "Vibers Remote" 로그 확인
3. Extension Host 재시작 (Command Palette → "Developer: Reload Window")

### Relay Server 연결 실패

**확인:**
1. Relay Server가 실행 중인지 확인
2. `vibers.relayServer` 설정 확인
3. 방화벽에서 포트 3457 허용

### 파일 편집 실패

**확인:**
1. 파일 경로가 올바른지 확인
2. 워크스페이스 폴더가 열려있는지 확인
3. 파일 쓰기 권한 확인

## 📝 지원되는 VSCode API

- **Workspace API** - 파일 읽기/쓰기, 워크스페이스 정보
- **Window API** - 편집기 열기, 터미널 제어
- **Commands API** - 명령 실행
- **Text Editor API** - 텍스트 편집

## 🔜 로드맵

- [ ] 디버거 통합
- [ ] Git 작업 지원
- [ ] 파일 탐색기 동기화
- [ ] 실시간 코드 하이라이트
- [ ] 스크린샷 캡처
- [ ] 플러그인 설정 동기화

## 📄 라이선스

MIT License

## 🙏 크레딧

**Vibers VSCode Extension**은 VeryLabs에서 제작했습니다.

---

**버전**: 1.0.0 (Phase 3)
**업데이트**: 2026-02-12
