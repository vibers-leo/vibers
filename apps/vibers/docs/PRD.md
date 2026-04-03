# 📄 [vibers] Product Requirements Document (PRD) v1.0

## 1. 프로젝트 비전 (Vision)

"코딩은 더 이상 텍스트의 나열이 아닌, 영감의 주파수를 맞추는 과정이다."
**vibers**는 AI 에이전트와의 감각적인 대화(Vibe)를 통해 상상을 현실의 코드로 바꾸는 '바이브코딩' 플랫폼입니다.

---

## 2. 주요 기능 (Key Features)

### 🎙️ 2.1. Vibe Interface (입력부)

- **Voice-to-Task**: 대형 마이크 버튼을 통한 음성 입력 중심의 인터페이스.
- **Agent Chat**: 친절한 에이전트(vibers Bridge)와 진행 상황을 실시간으로 공유하는 채팅창.
- **Smart Parsing**: 사용자의 애매한 명령을 분석하여 구체적인 '파일 수정 계획'으로 변환.

### 🧪 2.2. Instant Sandbox (실험부)

- **Sandpack Integration**: 깃허브 저장 전, 사용자의 스마트폰 브라우저에서 0.1초 만에 결과를 보여주는 미리보기 창.
- **Live Interaction**: 미리보기 화면을 보며 즉시 추가 명령(음성/채팅)을 내려 디자인을 수정.

### 🐙 2.3. Git-Commit Bridge (저장부)

- **GitHub Link**: 사용자의 개인 깃허브 계정에 프라이빗 저장소로 코드 보관.
- **Semantic Commit**: AI가 작업 내용을 분석하여 표준화된 커밋 메시지 자동 생성.
- **Confirm to Push**: 사용자의 최종 [승인] 버튼 클릭 시에만 실제 깃허브로 전송.

### 🚀 2.4. Live Deployment (배포부)

- **Vercel/Netlify API**: 깃푸시와 동시에 자동으로 실시간 웹사이트 배포.
- **Status Notifier**: 배포 완료 시 라이브 링크(URL) 제공 및 성공 여부 알림.

### 🤝 2.5. Vibe SOS (협업부)

- **Human-in-the-Loop**: AI가 루프에 빠지거나 한계에 부딪혔을 때, 크레딧을 지불하고 커뮤니티 내 '선배 바이버스'에게 도움 요청.
- **Shared Workspace**: 코드를 공유하고 함께 수정하며 성장하는 실시간 협업 환경 지원.

---

## 3. 사용자 여정 (User Journey)

1. **Hello World**: "당신의 상상이 코드가 되는 곳" 랜딩 페이지 도착.
2. **Vibe it**: 음성 버튼을 누르고 만들고 싶은 웹사이트의 컨셉을 말함.
3. **Draft View**: 샌드박스를 통해 즉석에서 그려진 '그림'을 확인하고 수정.
4. **Push & Live**: 만족할 때 승인하여 깃허브에 저장하고, 실시간 배포된 주소를 받음.

---

## 4. 수익 모델 (Monetization)

- **Starter (Free)**: 가입 시 **100 크레딧** 제공 (평균 3개 프로젝트 분량), 1개 프로젝트에 집중 소모 가능.
- **Vibers Pro (Sub)**: 프로젝트 무제한 생성, 고성능 모델(Pro), 시크릿 레시피 템플릿 사용 권한.
- **vCredits**: 사용량에 따른 유연한 충전 및 구독 기반 정기 충전 시스템.

---

## 5. 단계별 개발 로드맵 (Roadmap)

- **Phase 1 (MVP)**: Expo 환경 세팅 및 Native Mic 인터페이스 구현 (Haptic 연동).
- **Phase 2 (Sandbox)**: WebView를 활용한 앱 내 웹 코드 실시간 프리뷰 엔진 장착.
- **Phase 3 (Bridge)**: GitHub Octokit 연동 및 모바일 앱 내 커밋/푸시 자동화.
- **Phase 4 (Live)**: 실제 앱스토어 배포 준비 및 '계발자들' 채널을 통한 공식 런칭.
