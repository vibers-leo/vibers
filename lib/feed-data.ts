export type FeedType = 'launch' | 'update' | 'insight' | 'collab';

export interface TimelineEvent {
  date: string;
  label: string;
  body: string;
}

export interface ArticleScrap {
  title: string;
  source: string;
  quote: string;
  url?: string;
}

// 클라이언트 = 외부 고객 or 자체 프로젝트 단위
export interface Client {
  id: string;
  name: string;
  type: 'external' | 'internal'; // external: 고객사, internal: 자체 프로젝트
  color: string;
  description: string;
  url?: string;
}

export interface FeedItem {
  id: string;
  clientId: string;   // Client.id 참조
  type: FeedType;
  title: string;
  date: string;
  body: string;        // 카드 미리보기
  fullBody?: string;   // 모달 상세 본문
  tag: string;
  url?: string;
  image?: string;  // OG 없을 때 보여줄 첨부 이미지 URL (세로 포스터 가능)
  color: string;
  size: 'sm' | 'md' | 'lg';
  timeline?: TimelineEvent[];
  articles?: ArticleScrap[];
}

export const typeLabel: Record<FeedType, string> = {
  launch: '런칭',
  update: '업데이트',
  insight: '인사이트',
  collab: '협업',
};

// ── 클라이언트 목록 ──────────────────────────────────────
export const clients: Client[] = [
  {
    id: 'faneasy',
    name: '팬이지',
    type: 'external',
    color: '#6C63FF',
    description: '프랜차이즈 브랜드 마케팅 플랫폼 · 올루올루, 비즈온마케팅, CPR마케팅',
    url: 'https://faneasy.kr',
  },
  {
    id: 'yahwa',
    name: '야화컴퍼니',
    type: 'external',
    color: '#C5A55A',
    description: '프리미엄 혼술바 프랜차이즈 브랜드',
    url: 'https://yahwa.faneasy.kr',
  },
  {
    id: 'semophone',
    name: '세모폰',
    type: 'external',
    color: '#FF6B6B',
    description: '중고폰 거래 플랫폼',
    url: 'https://semophone.co.kr',
  },
  {
    id: 'wero',
    name: '위로 (Wero)',
    type: 'internal',
    color: '#E94560',
    description: '감성 AI 서비스 브랜드',
  },
  {
    id: 'nusucheck',
    name: '누수체크',
    type: 'external',
    color: '#0EA5E9',
    description: '누수 탐지·진단·수리 전문 플랫폼 · 개발 중',
    url: 'https://nusucheck.com',
  },
  {
    id: 'dus',
    name: '디어스 (DUS)',
    type: 'internal',
    color: '#00C896',
    description: '라이프스타일 커뮤니티 서비스',
  },
  {
    id: 'monopage',
    name: '모노페이지',
    type: 'internal',
    color: '#F472B6',
    description: '1페이지 웹사이트 빌더',
    url: 'https://monopage.kr',
  },
  {
    id: 'premiumpage',
    name: '프리미엄페이지',
    type: 'internal',
    color: '#FBBF24',
    description: '프리미엄 랜딩페이지 제작 서비스',
    url: 'https://premiumpage.kr',
  },
  {
    id: 'wayo',
    name: '와요',
    type: 'internal',
    color: '#34D399',
    description: '모임·약속 플랫폼',
    url: 'https://wayo.co.kr',
  },
  {
    id: 'myratingis',
    name: '제평가는요?',
    type: 'internal',
    color: '#818CF8',
    description: '자기 평가 및 피드백 서비스',
    url: 'https://myratingis.kr',
  },
  {
    id: 'vibefolio',
    name: '바이브폴리오',
    type: 'internal',
    color: '#38BDF8',
    description: '크리에이터 포트폴리오 플랫폼',
    url: 'https://vibefolio.net',
  },
  {
    id: 'vibers',
    name: '계발자들 (Vibers)',
    type: 'internal',
    color: '#39FF14',
    description: '계발자들 자체 브랜드 및 플랫폼',
    url: 'https://vibers.co.kr',
  },
];

export function getClient(clientId: string): Client | undefined {
  return clients.find((c) => c.id === clientId);
}

export function getClientFeed(clientId: string): FeedItem[] {
  return feedItems
    .filter((item) => item.clientId === clientId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ── 피드 아이템 ──────────────────────────────────────────
export const feedItems: FeedItem[] = [
  // ── 팬이지 ──
  {
    id: 'oluolu',
    clientId: 'faneasy',
    type: 'launch',
    title: '올루올루 프랜차이즈 사이트 오픈',
    date: '2025.11',
    body: '올루올루 브랜드의 프랜차이즈 전용 마케팅 웹사이트를 구축했습니다.',
    fullBody: '올루올루 브랜드의 프랜차이즈 전용 마케팅 웹사이트를 구축했습니다. 가맹 문의부터 브랜드 스토리, 메뉴 소개, 인테리어 컨셉까지 한 페이지에 담아 예비 가맹점주의 의사결정을 돕는 구조로 설계했습니다.',
    tag: '#웹사이트 #프랜차이즈',
    url: 'https://oluolu.faneasy.kr',
    color: '#6C63FF',
    size: 'md',
    timeline: [
      { date: '2025.09', label: '협업 시작', body: '팬이지 팀과 브랜딩 방향성 및 가맹 유치 전략 논의.' },
      { date: '2025.10', label: '디자인 확정', body: '올루올루 브랜드 컬러와 정체성을 반영한 디자인 시안 확정.' },
      { date: '2025.10', label: '개발 완료', body: 'Next.js 기반 반응형 웹사이트 개발 완료. 가맹 문의 폼 및 인스타그램 피드 연동.' },
      { date: '2025.11', label: '사이트 오픈', body: '올루올루 공식 프랜차이즈 사이트 라이브. 오픈 첫 주 가맹 문의 12건 접수.' },
    ],
  },
  {
    id: 'yahwa',
    clientId: 'yahwa',
    type: 'launch',
    title: '야화혼술바 홈페이지 오픈',
    date: '2025.10',
    body: '프리미엄 혼술바 프랜차이즈 야화의 브랜드 웹사이트를 구축했습니다.',
    fullBody: '프리미엄 혼술바 프랜차이즈 야화의 브랜드 웹사이트를 설계하고 구축했습니다. 야간 감성과 프리미엄 혼술 문화를 시각적으로 전달하면서, 예비 가맹점주에게 신뢰를 주는 구조가 핵심 과제였습니다.',
    tag: '#웹사이트 #F&B #프랜차이즈',
    url: 'https://yahwa.faneasy.kr',
    color: '#C5A55A',
    size: 'sm',
    timeline: [
      { date: '2025.08', label: '협업 시작', body: '야화 브랜드팀과 타깃 고객(예비 가맹점주) 분석 및 사이트 목적 정의.' },
      { date: '2025.09', label: '디자인 시안 확정', body: '다크톤의 프리미엄 감성 UI 디자인 완성.' },
      { date: '2025.10', label: '개발 및 오픈', body: 'Next.js로 개발 완료 후 야화혼술바 공식 홈페이지 오픈.' },
    ],
    articles: [
      {
        title: '야화혼술바, 프리미엄 혼술 프랜차이즈로 주목',
        source: '관련 매체',
        quote: '혼술 문화가 대중화되면서 야화혼술바가 프리미엄 1인 술자리 문화를 이끄는 브랜드로 주목받고 있다.',
      },
    ],
  },
  {
    id: 'faneasy-multi',
    clientId: 'faneasy',
    type: 'update',
    title: '다중 브랜드 관리 기능 업데이트',
    date: '2026.03',
    body: '올루올루, 비즈온마케팅, CPR마케팅을 하나의 대시보드에서 관리할 수 있도록 플랫폼을 고도화했습니다.',
    fullBody: '올루올루, 비즈온마케팅, CPR마케팅 등 복수의 브랜드를 운영하는 팬이지 사업자 피드백을 반영한 업데이트입니다. 하나의 대시보드에서 브랜드 전환과 통합 통계를 한눈에 확인할 수 있습니다.',
    tag: '#업데이트 #SaaS',
    color: '#6C63FF',
    size: 'sm',
    timeline: [
      { date: '2026.02', label: '요구사항 수집', body: '올루올루·비즈온·CPR 운영사 인터뷰 5건 진행. 핵심 페인포인트 정리.' },
      { date: '2026.03', label: '업데이트 배포', body: '다중 브랜드 전환·통합 통계 기능 배포 완료.' },
    ],
  },

  // ── 세모폰 ──
  {
    id: 'semophone-launch',
    clientId: 'semophone',
    type: 'launch',
    title: '세모폰 서비스 오픈',
    date: '2025.12',
    body: '중고폰 거래 플랫폼 세모폰의 웹 서비스를 구축했습니다.',
    fullBody: '중고폰 거래 플랫폼 세모폰의 웹 서비스를 기획부터 개발까지 함께했습니다. 판매자와 구매자를 잇는 매칭 플로우와 시세 조회 기능이 핵심이었습니다.',
    tag: '#플랫폼 #중고거래',
    url: 'https://semophone.co.kr',
    color: '#FF6B6B',
    size: 'md',
    timeline: [
      { date: '2025.10', label: '협업 시작', body: '중고폰 거래 플로우 및 시세 조회 기능 설계.' },
      { date: '2025.11', label: '개발 완료', body: '판매자 등록 → 시세 조회 → 구매자 매칭 플로우 개발.' },
      { date: '2025.12', label: '서비스 오픈', body: '세모폰 공식 서비스 런칭.' },
    ],
  },

  // ── 위로 ──
  {
    id: 'matecheck',
    clientId: 'wero',
    type: 'launch',
    title: '메이트체크 — AI 궁합 분석 앱 출시',
    date: '2025.09',
    body: 'AI가 두 사람의 성향을 분석해 궁합을 알려주는 서비스를 출시했습니다.',
    fullBody: 'AI가 두 사람의 성향, 가치관, 생활 패턴을 분석해 궁합 리포트를 생성하는 앱입니다. 기획부터 디자인, 개발, 앱스토어 출시까지 계발자들이 위로 팀과 함께했습니다.',
    tag: '#앱 #AI',
    color: '#E94560',
    size: 'md',
    timeline: [
      { date: '2025.05', label: '협업 시작', body: 'AI 궁합 분석 서비스 콘셉트 기획. 타깃 유저 리서치 진행.' },
      { date: '2025.06', label: '프로토타입', body: 'GPT 기반 성향 분석 알고리즘 프로토타입 제작 및 내부 테스트.' },
      { date: '2025.08', label: '베타 출시', body: '테스트플라이트를 통한 베타 버전 배포. 200명 사용자 피드백 수집.' },
      { date: '2025.09', label: '정식 출시', body: 'App Store·Google Play 정식 출시. 출시 2주 만에 다운로드 1,000건 돌파.' },
    ],
  },

  // ── 누수체크 ──
  {
    id: 'nusucheck-launch',
    clientId: 'nusucheck',
    type: 'collab',
    title: '누수체크 — 개발 진행 중',
    date: '2026.03',
    body: '누수 탐지·진단·수리 전문 플랫폼을 구축 중입니다. 곧 만나보실 수 있습니다.',
    fullBody: '누수 탐지·진단·수리 전문 플랫폼입니다. 서비스 신청부터 전문가 매칭, 사후관리까지 원스톱으로 처리할 수 있는 구조로 기획 중이며, 현재 개발이 진행 중입니다.',
    tag: '#서비스사이트 #개발중',
    url: 'https://nusucheck.com',
    color: '#0EA5E9',
    size: 'md',
    timeline: [
      { date: '2025.06', label: '협업 시작', body: '서비스 모델 및 전문가 매칭 플로우 설계.' },
      { date: '2025.07', label: '개발 완료', body: '신청 → 매칭 → 방문 → 사후관리 4단계 플로우 개발 완료.' },
      { date: '2025.08', label: '서비스 오픈', body: '수도권 서비스 오픈. 첫 달 서비스 신청 40건 처리.' },
    ],
  },

  // ── 디어스 ──
  {
    id: 'runnersconnect',
    clientId: 'dus',
    type: 'launch',
    title: '러너스커넥트 베타 런칭',
    date: '2025.07',
    body: '같은 페이스, 같은 목표의 러닝 크루를 매칭해주는 커뮤니티 플랫폼입니다.',
    fullBody: '같은 페이스, 같은 목표의 러닝 크루를 매칭해주는 커뮤니티 플랫폼입니다. 위치 기반 크루 탐색과 정기 런닝 일정 관리 기능을 구현했습니다.',
    tag: '#커뮤니티 #스포츠',
    color: '#00C896',
    size: 'sm',
    timeline: [
      { date: '2025.05', label: '협업 시작', body: '러닝 커뮤니티 니즈 리서치 및 핵심 기능 정의.' },
      { date: '2025.06', label: '프로토타입', body: '크루 매칭·일정 관리 핵심 기능 프로토타입 제작.' },
      { date: '2025.07', label: '베타 런칭', body: '서울 지역 베타 서비스 시작. 초기 크루 30팀 참여.' },
    ],
  },
  {
    id: 'gaboja',
    clientId: 'dus',
    type: 'launch',
    title: '가보자고 — 모바일 초대장 메이커',
    date: '2025.06',
    body: '5분 만에 모임·이벤트 초대장을 만들고 공유하는 모바일 앱입니다.',
    fullBody: '5분 만에 생일파티, 모임, 이벤트 초대장을 만들고 공유하는 모바일 앱입니다. 감각적인 템플릿과 쉬운 편집 UX가 핵심이었습니다. Expo로 iOS/Android를 동시에 지원합니다.',
    tag: '#앱 #이벤트',
    color: '#FFD700',
    size: 'md',
    timeline: [
      { date: '2025.04', label: '협업 시작', body: '초대장 편집 UX 및 템플릿 방향성 기획.' },
      { date: '2025.05', label: '디자인·개발', body: 'Expo 기반 앱 개발 + 20가지 이벤트 템플릿 제작.' },
      { date: '2025.06', label: '앱스토어 출시', body: 'iOS·Android 동시 출시. 첫 달 누적 초대장 생성 2,500건.' },
    ],
  },

  // ── 모노페이지 ──
  {
    id: 'monopage-launch',
    clientId: 'monopage',
    type: 'launch',
    title: '모노페이지 서비스 오픈',
    date: '2025.11',
    body: '누구나 1페이지 웹사이트를 쉽게 만들 수 있는 빌더 서비스를 출시했습니다.',
    fullBody: '누구나 1페이지 웹사이트를 쉽게 만들 수 있는 빌더 서비스입니다. 템플릿 선택 → 텍스트·이미지 편집 → 도메인 연결까지 논코딩으로 완성할 수 있습니다.',
    tag: '#빌더 #노코드',
    url: 'https://monopage.kr',
    color: '#F472B6',
    size: 'md',
    timeline: [
      { date: '2025.09', label: '기획', body: '1페이지 빌더 콘셉트 설계 및 템플릿 방향성 확정.' },
      { date: '2025.10', label: '개발', body: '편집기·퍼블리시·도메인 연결 기능 개발.' },
      { date: '2025.11', label: '오픈', body: '모노페이지 정식 서비스 런칭.' },
    ],
  },

  // ── 프리미엄페이지 ──
  {
    id: 'premiumpage-launch',
    clientId: 'premiumpage',
    type: 'launch',
    title: '프리미엄페이지 서비스 오픈',
    date: '2025.10',
    body: '고퀄리티 랜딩페이지를 빠르게 제작할 수 있는 프리미엄 서비스를 출시했습니다.',
    fullBody: '고퀄리티 랜딩페이지를 빠르게 제작할 수 있는 프리미엄 서비스입니다. 디자인 퀄리티를 타협하지 않으면서도 빠른 납기를 원하는 비즈니스를 위해 만들었습니다.',
    tag: '#랜딩페이지 #프리미엄',
    url: 'https://premiumpage.kr',
    color: '#FBBF24',
    size: 'md',
    timeline: [
      { date: '2025.08', label: '기획', body: '프리미엄 랜딩페이지 패키지 상품 구성.' },
      { date: '2025.09', label: '개발', body: '신청·결제·납품 플로우 구축.' },
      { date: '2025.10', label: '오픈', body: '프리미엄페이지 정식 서비스 런칭.' },
    ],
  },

  // ── 와요 ──
  {
    id: 'wayo-launch',
    clientId: 'wayo',
    type: 'launch',
    title: '와요 — 모임·약속 플랫폼 출시',
    date: '2026.01',
    body: '친구·동료와의 모임을 더 쉽게 잡을 수 있는 약속 플랫폼을 출시했습니다.',
    fullBody: '친구·동료와의 모임을 더 쉽게 잡을 수 있는 약속 플랫폼입니다. 날짜 투표, 장소 추천, 참석 확인을 한 번에 처리할 수 있습니다.',
    tag: '#모임 #스케줄',
    url: 'https://wayo.co.kr',
    color: '#34D399',
    size: 'sm',
    timeline: [
      { date: '2025.11', label: '기획', body: '모임 약속 플로우 설계 및 핵심 기능 정의.' },
      { date: '2025.12', label: '개발', body: '날짜 투표·장소 추천·알림 기능 개발.' },
      { date: '2026.01', label: '출시', body: '와요 정식 서비스 출시.' },
    ],
  },

  // ── 제평가는요? ──
  {
    id: 'myratingis-launch',
    clientId: 'myratingis',
    type: 'launch',
    title: '제평가는요? 서비스 출시',
    date: '2025.12',
    body: '익명 피드백으로 나의 평판을 확인할 수 있는 자기 평가 서비스를 출시했습니다.',
    fullBody: '익명 피드백으로 나의 평판을 확인할 수 있는 자기 평가 서비스입니다. 링크 하나로 주변 사람들에게 솔직한 피드백을 요청하고, 결과를 통계로 받아볼 수 있습니다.',
    tag: '#피드백 #자기계발',
    url: 'https://myratingis.kr',
    color: '#818CF8',
    size: 'md',
    timeline: [
      { date: '2025.10', label: '기획', body: '익명 피드백 수집 플로우 및 통계 리포트 설계.' },
      { date: '2025.11', label: '개발', body: '링크 발송·응답 수집·결과 리포트 기능 개발.' },
      { date: '2025.12', label: '출시', body: '제평가는요? 정식 출시.' },
    ],
  },

  // ── 바이브폴리오 ──
  {
    id: 'vibefolio-launch',
    clientId: 'vibefolio',
    type: 'launch',
    title: '바이브폴리오 베타 출시',
    date: '2026.02',
    body: '크리에이터와 프리랜서를 위한 포트폴리오 플랫폼 베타 버전을 출시했습니다.',
    fullBody: '크리에이터와 프리랜서를 위한 포트폴리오 플랫폼입니다. 작업물을 업로드하고 나만의 포트폴리오 페이지를 만들어 공유할 수 있습니다. 계발자들이 직접 사용하는 도그푸딩 서비스이기도 합니다.',
    tag: '#포트폴리오 #크리에이터',
    url: 'https://vibefolio.net',
    color: '#38BDF8',
    size: 'lg',
    timeline: [
      { date: '2025.12', label: '기획', body: '크리에이터 포트폴리오 니즈 리서치 및 핵심 기능 정의.' },
      { date: '2026.01', label: '개발', body: '업로드·페이지 편집·공유 링크 기능 개발.' },
      { date: '2026.02', label: '베타 출시', body: '바이브폴리오 베타 서비스 오픈. 초기 크리에이터 50명 온보딩.' },
    ],
  },

  // ── 계발자들 자체 ──
  {
    id: 'admin-kit',
    clientId: 'vibers',
    type: 'collab',
    title: 'Vibers 어드민킷 v1 릴리즈',
    date: '2026.03',
    body: '모든 협업 프로젝트의 기술 스택·상태를 중앙 어드민에서 실시간으로 모니터링할 수 있는 패키지를 공개했습니다.',
    fullBody: '모든 협업 프로젝트의 기술 스택·상태를 vibers.co.kr/admin에서 실시간으로 모니터링할 수 있는 @vibers/admin-kit 패키지를 공개했습니다.\n\n프로젝트에 설치하면 Firebase, NCP DB, 프레임워크 버전 등을 자동 감지하고, 중앙 어드민으로 상태를 주기적으로 보고합니다.',
    tag: '#기술 #오픈소스',
    color: '#39FF14',
    size: 'sm',
    timeline: [
      { date: '2026.02', label: '설계', body: '스택 자동 감지 아키텍처 설계. Firebase·NCP·Next.js 지원 범위 확정.' },
      { date: '2026.03', label: 'v1 릴리즈', body: '@vibers/admin-kit npm 패키지 배포. 4개 협업 프로젝트 첫 연동 완료.' },
    ],
  },
  {
    id: 'why-gaebalja',
    clientId: 'vibers',
    type: 'insight',
    title: '왜 지금 계발자가 필요한가',
    date: '2026.01',
    body: '아이디어는 있는데 팀이 없다? 계발자와 협업하는 것이 더 빠르고 효율적인 이유.',
    fullBody: '아이디어는 있는데 팀이 없다? 기획자, 디자이너, 개발자, 마케터를 각각 구하는 대신, 네 역할을 동시에 수행할 수 있는 계발자와 협업하는 것이 더 빠르고 효율적인 이유.\n\n스타트업의 가장 큰 병목은 "사람"이 아니라 "역할 간의 번역 비용"입니다. 기획자가 개발자에게 설명하고, 개발자가 디자이너에게 넘기는 과정에서 의도가 희석되고 시간이 낭비됩니다.\n\n계발자는 이 번역 과정을 내재화하고 있습니다. 아이디어를 받으면 스스로 기획하고, 디자인하고, 만들고, 알립니다.',
    tag: '#인사이트 #계발자',
    color: '#39FF14',
    size: 'lg',
    articles: [
      {
        title: 'AI가 사무실을 바꾼다 — "기발자"의 등장',
        source: 'KBS 뉴스 · 박대기 기자',
        quote: '"기획과 개발을 같이 한다"고 해서 \'기발자\'라고 부릅니다. 아예 기획자·개발자·디자이너 세 가지 일을 한 명이 하는 경우도 생겼습니다.',
        url: 'https://news.kbs.co.kr/news/pc/view/view.do?ncd=8520973',
      },
    ],
  },
  {
    id: 'lean-execution',
    clientId: 'vibers',
    type: 'insight',
    title: '빠른 실행이 완벽한 기획을 이긴다',
    date: '2026.02',
    body: '린하게 만들고 시장 반응을 먼저 확인하는 것이 수개월의 준비보다 값지다.',
    fullBody: '계발자들이 일하는 방식 — 기획 2일, 디자인 3일, 개발 1주. 린하게 만들고 시장 반응을 먼저 확인하는 것이 수개월의 준비보다 값지다.\n\n완벽한 기획서는 시장의 피드백을 한 번도 받지 않은 가정의 집합입니다. 계발자들은 "충분히 작동하는 것"을 빠르게 만들고, 실제 사용자의 반응으로 다음 방향을 결정합니다.',
    tag: '#인사이트 #린스타트업',
    color: '#A78BFA',
    size: 'lg',
  },
];
