# Agent Teams 사용 가이드

## 1단계: 활성화

맥미니 터미널에서 아래 명령어 실행:

```bash
# Claude Code 설정에 환경변수 추가
claude config set -g env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS 1
```

## 2단계: 시각적으로 보기 (Split Panes)

팀원들이 각자 별도 패널에서 작업하는 걸 보려면 iTerm2가 필요해요.

```bash
brew install --cask iterm2
```

설치 후 iTerm2에서 Claude Code를 실행하면 됩니다.

> ⚠️ 안티그래비티(VS Code) 내장 터미널에서는 split panes가 안 됩니다.
> 시각적으로 보려면 iTerm2에서 `claude` 명령어로 직접 실행하세요.

## 3단계: 사용법

### 기본 사용 (안티그래비티에서)

안티그래비티 터미널에서도 팀 모드는 동작해요. 시각 분리만 안 될 뿐:

```
팀을 구성해서 병렬로 작업해줘:
- 팀원1: faneasy 결제 페이지 추가
- 팀원2: semophone 메인 페이지 리디자인
- 팀원3: vibers about 페이지 작성
```

Shift+↓ 로 팀원 간 전환하면서 진행 상황을 볼 수 있어요.

### iTerm2에서 (시각적 병렬 모드)

iTerm2를 열고:

```bash
cd ~/Desktop/macminim4/dev/nextjs
claude
```

그 다음 같은 방식으로 팀 지시하면 각 팀원이 별도 패널에 나타납니다.

## 4단계: 실전 예시

### 여러 앱 동시 수정
```
팀 구성해줘:
- 팀원1: apps/faneasy에 /pricing 페이지 추가 (Tailwind, 한국어)
- 팀원2: apps/richlychee에 다크모드 토글 추가
- 팀원3: apps/semophone에 매장 검색 필터 개선
각자 작업 끝나면 bun run build --filter=앱이름 으로 확인해줘
```

### 전체 앱 일괄 작업
```
팀 구성해서 모든 앱의 메타데이터(title, description, og:image)를
한국어로 통일해줘. 앱당 1명씩 배정.
```

### 코드 리뷰 병렬화
```
팀 구성해줘:
- 팀원1: 보안 관점에서 faneasy 코드 리뷰
- 팀원2: 성능 관점에서 faneasy 코드 리뷰
- 팀원3: 접근성 관점에서 faneasy 코드 리뷰
```

## 팁

- **토큰 소모 주의**: 팀원 수 × 개별 세션 비용. 2~3명이 적당
- **파일 충돌 방지**: 같은 파일을 여러 팀원이 수정하면 안 됨 → 앱별로 분리 배정
- **packages/ 수정은 팀 리더만**: 공통 패키지는 충돌 위험이 높음
- **중단 시**: 엔터 치면 전체 팀이 중단됨. 주의!
