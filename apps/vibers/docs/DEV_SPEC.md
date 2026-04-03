# 🌐 [vibers] Dual-Architecture Specification (v1.2)

본 프로젝트는 **PC용 웹 랜딩페이지(Next.js)**와 **실제 서비스용 모바일 앱(Expo)**의 투트랙으로 개발됩니다.

---

## 1. Web Tier: Marketing & Showcase (Next.js)

**목적**: 브랜드 홍보, 실시간 데모 시연, 앱 다운로드 유도(QR/Store Links).

### 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Deployment**: Vercel (SEO 및 성능 최적화)
- **Features**:
  - **Interactive Demo**: 사용자가 웹에서도 바이브코딩의 맛을 볼 수 있는 라이트 버전 데모.
  - **QR Gateway**: 모바일 앱 앱스토어/플레이스토어 연결용 QR 코드.
  - **The vibers Showcase**: 커뮤니티에서 만들어진 최고의 프로젝트 전시.

---

## 2. Mobile Tier: Personal Coding Agent (Expo)

**목적**: 사용자의 실제 코딩 작업실(Personal Workspace).

### 🛠️ Tech Stack

- **Framework**: **Expo** (React Native)
- **Features**: 네이티브 마이크, 햅틱 피드백, 깃허브 연동, 앱 내 웹 뷰 샌드박스.
- **Data**: 모든 민감한 정보(API 키, 깃허브 토큰)는 기기의 Secure Store에 저장.

---

## 3. Directory Structure (Integrated)

```text
/nanobanana
  ├── /nano-starter        # Next.js Web Project (Landing/SEO)
  │    └── src/app/vibers  # Web Marketing & Demo UI
  └── /vibers-mobile       # Expo Mobile Project (Real Service)
       └── app/workspace   # Native Coding Engine
```

---

## 4. Synergy Flow
install

1. **Web**: 사용자가 PC/모바일 브라우저로 접속하여 "Hello World"를 경험.
2. **Onboarding**: "제대로 바이브를 타려면 앱을 다운로드하세요" 문구 노출.
3. **App**: 폰에서 앱 실행 후 마이크 하나로 본격적인 깃허브 연동 코딩 시작.
