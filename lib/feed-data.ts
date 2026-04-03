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

export interface FeedItem {
  id: string;
  type: FeedType;
  title: string;
  brand?: string;
  date: string;
  body: string;        // 카드 미리보기 텍스트
  fullBody?: string;   // 모달 상세 본문 (없으면 body 사용)
  tag: string;
  url?: string;
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

export const feedItems: FeedItem[] = [
  {
    id: 'oluolu',
    type: 'launch',
    title: '올루올루 프랜차이즈 사이트 오픈',
    brand: '팬이지 (FanEasy)',
    date: '2025.11',
    body: '올루올루 브랜드의 프랜차이즈 전용 마케팅 웹사이트를 구축했습니다.',
    fullBody: '올루올루 브랜드의 프랜차이즈 전용 마케팅 웹사이트를 구축했습니다. 가맹 문의부터 브랜드 스토리, 메뉴 소개, 인테리어 컨셉까지 한 페이지에 담아 예비 가맹점주의 의사결정을 돕는 구조로 설계했습니다.',
    tag: '#웹사이트 #프랜차이즈',
    url: 'https://oluolu.faneasy.kr',
    color: '#6C63FF',
    size: 'md',
    timeline: [
      { date: '2025.09', label: '협업 시작', body: '팬이지 팀과 브랜딩 방향성 및 가맹 유치 전략 논의.' },
      { date: '2025.10', label: '디자인 확정', body: '올루올루 브랜드 컬러와 정체성을 반영한 와이어프레임·디자인 시안 확정.' },
      { date: '2025.10', label: '개발 완료', body: 'Next.js 기반 반응형 웹사이트 개발 완료. 가맹 문의 폼 및 인스타그램 피드 연동.' },
      { date: '2025.11', label: '사이트 오픈', body: '올루올루 공식 프랜차이즈 사이트 라이브. 오픈 첫 주 가맹 문의 12건 접수.' },
    ],
  },
  {
    id: 'yahwa',
    type: 'launch',
    title: '야화혼술바 홈페이지 오픈',
    brand: '팬이지 (FanEasy)',
    date: '2025.10',
    body: '프리미엄 혼술바 프랜차이즈 야화의 브랜드 웹사이트를 구축했습니다.',
    fullBody: '프리미엄 혼술바 프랜차이즈 야화의 브랜드 웹사이트를 설계하고 구축했습니다. 야간 감성과 프리미엄 혼술 문화를 시각적으로 전달하면서, 예비 가맹점주에게 신뢰를 주는 구조가 핵심 과제였습니다.',
    tag: '#웹사이트 #F&B #프랜차이즈',
    url: 'https://yahwa.faneasy.kr',
    color: '#C5A55A',
    size: 'sm',
    timeline: [
      { date: '2025.08', label: '협업 시작', body: '야화 브랜드팀과 타깃 고객(예비 가맹점주) 분석 및 사이트 목적 정의.' },
      { date: '2025.09', label: '디자인 시안 확정', body: '다크톤의 프리미엄 감성 UI 디자인 완성. 브랜드 스토리·메뉴·가맹 안내 구조 확정.' },
      { date: '2025.10', label: '개발 및 오픈', body: 'Next.js로 개발 완료 후 도메인 연결 및 야화혼술바 공식 홈페이지 오픈.' },
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
    id: 'matecheck',
    type: 'launch',
    title: '메이트체크 — AI 궁합 분석 앱 출시',
    brand: '위로 (Wero)',
    date: '2025.09',
    body: 'AI가 두 사람의 성향을 분석해 궁합을 알려주는 서비스를 출시했습니다.',
    fullBody: 'AI가 두 사람의 성향, 가치관, 생활 패턴을 분석해 궁합 리포트를 생성하는 앱입니다. 기획부터 디자인, 개발, 앱스토어 출시까지 계발자들이 위로 팀과 함께했습니다.',
    tag: '#앱 #AI #위로',
    color: '#E94560',
    size: 'md',
    timeline: [
      { date: '2025.05', label: '협업 시작', body: '위로팀과 AI 궁합 분석 서비스 콘셉트 기획. 타깃 유저 리서치 진행.' },
      { date: '2025.06', label: '프로토타입', body: 'GPT 기반 성향 분석 알고리즘 프로토타입 제작 및 내부 테스트.' },
      { date: '2025.08', label: '베타 출시', body: '테스트플라이트를 통한 베타 버전 배포. 200명 사용자 피드백 수집.' },
      { date: '2025.09', label: '정식 출시', body: 'App Store·Google Play 정식 출시. 출시 2주 만에 다운로드 1,000건 돌파.' },
    ],
  },
  {
    id: 'nusucheck',
    type: 'launch',
    title: '누수체크 서비스 오픈',
    brand: '누수체크',
    date: '2025.08',
    body: '누수 탐지·진단·수리 전문 플랫폼을 구축했습니다.',
    fullBody: '누수 탐지·진단·수리 전문 플랫폼입니다. 서비스 신청부터 전문가 매칭, 사후관리까지 원스톱으로 처리할 수 있는 구조로 기획했습니다. 지역 기반 전문가 네트워크 연동이 핵심 기술 과제였습니다.',
    tag: '#서비스사이트 #B2C',
    url: 'https://nusucheck.co.kr',
    color: '#0EA5E9',
    size: 'md',
    timeline: [
      { date: '2025.06', label: '협업 시작', body: '누수체크 대표팀과 서비스 모델 및 전문가 매칭 플로우 설계.' },
      { date: '2025.07', label: '개발 완료', body: '신청 → 매칭 → 방문 → 사후관리 4단계 플로우 개발 완료.' },
      { date: '2025.08', label: '서비스 오픈', body: '수도권 서비스 오픈. 첫 달 서비스 신청 40건 처리.' },
    ],
  },
  {
    id: 'runnersconnect',
    type: 'launch',
    title: '러너스커넥트 베타 런칭',
    brand: '디어스 (DUS)',
    date: '2025.07',
    body: '같은 페이스, 같은 목표의 러닝 크루를 매칭해주는 커뮤니티 플랫폼입니다.',
    fullBody: '같은 페이스, 같은 목표의 러닝 크루를 매칭해주는 커뮤니티 플랫폼입니다. 위치 기반 크루 탐색과 정기 런닝 일정 관리 기능을 구현했습니다. 러닝 문화의 성장과 함께 커뮤니티 확장을 목표로 합니다.',
    tag: '#커뮤니티 #스포츠',
    color: '#00C896',
    size: 'sm',
    timeline: [
      { date: '2025.05', label: '협업 시작', body: '디어스팀과 러닝 커뮤니티 니즈 리서치 및 핵심 기능 정의.' },
      { date: '2025.06', label: '프로토타입', body: '크루 매칭·일정 관리 핵심 기능 프로토타입 제작.' },
      { date: '2025.07', label: '베타 런칭', body: '서울 지역 베타 서비스 시작. 초기 크루 30팀 참여.' },
    ],
  },
  {
    id: 'gaboja',
    type: 'launch',
    title: '가보자고 — 모바일 초대장 메이커',
    brand: '디어스 (DUS)',
    date: '2025.06',
    body: '5분 만에 생일파티, 모임, 이벤트 초대장을 만들고 공유하는 모바일 앱입니다.',
    fullBody: '5분 만에 생일파티, 모임, 이벤트 초대장을 만들고 공유하는 모바일 앱입니다. 감각적인 템플릿과 쉬운 편집 UX가 핵심이었습니다. Expo로 iOS/Android를 동시에 지원합니다.',
    tag: '#앱 #이벤트',
    color: '#FFD700',
    size: 'md',
    timeline: [
      { date: '2025.04', label: '협업 시작', body: '디어스팀과 초대장 편집 UX 및 템플릿 방향성 기획.' },
      { date: '2025.05', label: '디자인·개발', body: 'Expo 기반 앱 개발 + 20가지 이벤트 템플릿 제작.' },
      { date: '2025.06', label: '앱스토어 출시', body: 'iOS·Android 동시 출시. 첫 달 누적 초대장 생성 2,500건.' },
    ],
  },
  {
    id: 'why-gaebalja',
    type: 'insight',
    title: '왜 지금 계발자가 필요한가',
    date: '2026.01',
    body: '아이디어는 있는데 팀이 없다? 계발자와 협업하는 것이 더 빠르고 효율적인 이유.',
    fullBody: '아이디어는 있는데 팀이 없다? 기획자, 디자이너, 개발자, 마케터를 각각 구하는 대신, 네 역할을 동시에 수행할 수 있는 계발자와 협업하는 것이 더 빠르고 효율적인 이유.\n\n스타트업의 가장 큰 병목은 "사람"이 아니라 "역할 간의 번역 비용"입니다. 기획자가 개발자에게 설명하고, 개발자가 디자이너에게 넘기는 과정에서 의도가 희석되고 시간이 낭비됩니다.\n\n계발자는 이 번역 과정을 내재화하고 있습니다. 아이디어를 받으면 스스로 기획하고, 디자인하고, 만들고, 알립니다. 작은 팀, 빠른 실행, 높은 밀도의 결과물 — 그게 계발자들과의 협업이 만드는 차이입니다.',
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
    id: 'admin-kit',
    type: 'collab',
    title: 'Vibers 어드민킷 v1 릴리즈',
    brand: '계발자들 (Vibers)',
    date: '2026.03',
    body: '모든 협업 프로젝트의 기술 스택·상태를 중앙 어드민에서 실시간으로 모니터링할 수 있는 패키지를 공개했습니다.',
    fullBody: '모든 협업 프로젝트의 기술 스택·상태를 vibers.co.kr/admin에서 실시간으로 모니터링할 수 있는 @vibers/admin-kit 패키지를 공개했습니다.\n\n프로젝트에 설치하면 Firebase, NCP DB, 프레임워크 버전 등을 자동 감지하고, 중앙 어드민으로 상태를 주기적으로 보고합니다. 계발자들과 협업 중인 모든 프로젝트에 순차 적용 예정입니다.',
    tag: '#기술 #오픈소스',
    color: '#00FFAA',
    size: 'sm',
    timeline: [
      { date: '2026.02', label: '설계', body: '스택 자동 감지 아키텍처 설계. Firebase·NCP·Next.js 지원 범위 확정.' },
      { date: '2026.03', label: 'v1 릴리즈', body: '@vibers/admin-kit npm 패키지 배포. 4개 협업 프로젝트 첫 연동 완료.' },
    ],
  },
  {
    id: 'lean-execution',
    type: 'insight',
    title: '빠른 실행이 완벽한 기획을 이긴다',
    date: '2026.02',
    body: '계발자들이 일하는 방식 — 린하게 만들고 시장 반응을 먼저 확인하는 것이 수개월의 준비보다 값지다.',
    fullBody: '계발자들이 일하는 방식 — 기획 2일, 디자인 3일, 개발 1주. 린하게 만들고 시장 반응을 먼저 확인하는 것이 수개월의 준비보다 값지다.\n\n완벽한 기획서는 시장의 피드백을 한 번도 받지 않은 가정의 집합입니다. 계발자들은 "충분히 작동하는 것"을 빠르게 만들고, 실제 사용자의 반응으로 다음 방향을 결정합니다.\n\n이것이 계발자들이 대형 팀보다 빠르게 움직일 수 있는 이유입니다.',
    tag: '#인사이트 #린스타트업',
    color: '#A78BFA',
    size: 'lg',
  },
  {
    id: 'faneasy-multi',
    type: 'update',
    title: 'FanEasy — 다중 브랜드 관리 기능 업데이트',
    brand: '팬이지 (FanEasy)',
    date: '2026.03',
    body: '하나의 대시보드에서 여러 프랜차이즈 브랜드를 동시에 관리할 수 있도록 플랫폼을 고도화했습니다.',
    fullBody: '하나의 대시보드에서 여러 프랜차이즈 브랜드를 동시에 관리할 수 있도록 팬이지 플랫폼을 고도화했습니다. 올루올루, 야화 등 복수의 브랜드를 운영하는 사업자 피드백을 반영한 업데이트입니다.',
    tag: '#업데이트 #SaaS',
    color: '#6C63FF',
    size: 'sm',
    timeline: [
      { date: '2026.02', label: '요구사항 수집', body: '복수 브랜드 운영 사업자 인터뷰 5건 진행. 핵심 페인포인트 정리.' },
      { date: '2026.03', label: '업데이트 배포', body: '다중 브랜드 전환·통합 통계 기능 배포 완료.' },
    ],
  },
];
