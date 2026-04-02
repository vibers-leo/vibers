/**
 * vibers-mobile/services/gemini.ts
 * 
 * [The Vibe Brain] 
 * 사용자의 음성/텍스트를 분석하여 구조화된 코드 뭉치로 변환하는 핵심 서비스입니다.
 */

// 실제 구현 시에는 Backend API(Vercel/Firebase Functions)를 거쳐서 호출하는 것을 권장합니다.
// 여기서는 프론트엔드에서 바로 테스트할 수 있는 구조로 작성합니다.

export interface CodeFile {
  path: string;
  content: string;
  type: 'create' | 'update' | 'delete';
}

export interface VibeResponse {
  message: string;
  files: CodeFile[];
  projectDescription: string;
  suggestedCommitMessage: string;
  nextSteps: string[];
  vibeTip?: string;
}

const VIBE_TIPS = [
  "레오님, 질문이 구체적일수록 제가 한 번에 더 정확한 코드를 짤 수 있어요. 그러면 소중한 Vibe도 아낄 수 있답니다! ✨",
  "Pro 플랜을 사용 중이시네요! 역시 앞서가는 개발자 레오님, 훨씬 적은 비용으로 무한한 상상을 펼치고 계시군요. 😊",
  "작업 전에 '전체적인 디자인 테마'를 미리 말씀해주시면 불필요한 수정을 줄여 Vibe를 90%까지 아낄 수 있어요! 🏝️",
  "지금 남은 Vibe로도 충분히 멋진 결과물을 만들 수 있어요. 제가 옆에서 꼼꼼히 도와드릴게요! 🚀",
  "잠깐! 비슷한 요청은 'Update' 모드로 말씀해주시면 기존 맥락을 유지하면서 더 효율적으로 작업할 수 있어요. 💡"
];

const TUTORIAL_SCENARIOS: Record<string, VibeResponse> = {
  default: {
    message: '레오님, 튜토리얼에 오신 걸 환영합니다! 이것은 샌드박스 모드입니다. 어떤 요청이든 안전하게 테스트해보세요. Vibe는 소모되지 않아요!',
    files: [
      {
        path: 'src/components/WelcomeCard.tsx',
        content: `import React from 'react';

export default function WelcomeCard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h2 className="text-[#39FF14] text-xs font-black tracking-widest mb-2">VIBERS TUTORIAL</h2>
        <h1 className="text-3xl font-bold text-white">Welcome to<br/>Sandbox Mode.</h1>
        <p className="text-white/40 mt-4 text-sm">이곳에서 마음껏 연습해보세요!</p>
      </div>
    </div>
  );
}`,
        type: 'create',
      },
    ],
    projectDescription: '튜토리얼 웰컴 프로젝트',
    suggestedCommitMessage: 'feat: tutorial welcome card',
    nextSteps: ['프로필 카드를 만들어보세요', '버튼 컴포넌트를 추가해보세요', '다크 테마를 적용해보세요'],
  },
  profile: {
    message: '멋져요! 프로필 카드를 만들었어요. Neon Cyber 디자인 시스템을 적용해서 글로우 효과와 Glassmorphism을 사용했습니다.',
    files: [
      {
        path: 'src/components/ProfileCard.tsx',
        content: `import React from 'react';

export default function ProfileCard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-80 bg-white/5 backdrop-blur-xl border border-[#39FF14]/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
        <div className="w-20 h-20 bg-[#39FF14]/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl">🎯</span>
        </div>
        <h2 className="text-white text-xl font-bold text-center">Leo</h2>
        <p className="text-[#39FF14] text-xs font-black tracking-widest text-center mt-1">VIBE CREATOR</p>
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Projects</span>
            <span className="text-white font-bold">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Vibes Used</span>
            <span className="text-[#39FF14] font-bold">847</span>
          </div>
        </div>
        <button className="w-full mt-6 py-3 bg-[#39FF14] rounded-2xl text-black font-black text-sm">
          FOLLOW
        </button>
      </div>
    </div>
  );
}`,
        type: 'create',
      },
    ],
    projectDescription: 'Neon Cyber 스타일의 프로필 카드',
    suggestedCommitMessage: 'feat: neon profile card component',
    nextSteps: ['애니메이션 효과 추가', '스탯 그래프 추가', '다크/라이트 토글 구현'],
  },
  landing: {
    message: '랜딩 페이지의 히어로 섹션을 설계했습니다! 대담한 타이포그래피와 CTA 버튼이 포함되어 있어요.',
    files: [
      {
        path: 'src/pages/LandingHero.tsx',
        content: `import React from 'react';

export default function LandingHero() {
  return (
    <section className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center px-8 md:px-16">
      <div className="max-w-4xl">
        <p className="text-[#39FF14] text-xs font-black tracking-[0.3em] mb-6">NEXT-GEN PLATFORM</p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-6">
          Build Faster.<br/>
          <span className="text-[#39FF14]">Ship Smarter.</span>
        </h1>
        <p className="text-white/40 text-lg max-w-xl mb-10">
          AI가 당신의 목소리를 듣고 코드를 작성합니다. 상상하는 모든 것을 현실로 만드세요.
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-[#39FF14] rounded-full text-black font-black text-sm tracking-wider hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-shadow">
            GET STARTED
          </button>
          <button className="px-8 py-4 border border-white/10 rounded-full text-white/60 font-bold text-sm hover:border-white/30 transition-colors">
            WATCH DEMO
          </button>
        </div>
      </div>
    </section>
  );
}`,
        type: 'create',
      },
    ],
    projectDescription: 'SaaS 랜딩 페이지 히어로 섹션',
    suggestedCommitMessage: 'feat: landing page hero section',
    nextSteps: ['Features 섹션 추가', 'Pricing 테이블 구현', '반응형 네비게이션 바 추가'],
  },
  dashboard: {
    message: '대시보드 레이아웃을 완성했습니다! 사이드바, 스탯 카드, 차트 영역이 포함되어 있어요.',
    files: [
      {
        path: 'src/pages/Dashboard.tsx',
        content: `import React from 'react';

const stats = [
  { label: 'Total Users', value: '2,847', change: '+12%' },
  { label: 'Revenue', value: '$48.2K', change: '+8%' },
  { label: 'Active Projects', value: '156', change: '+23%' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <aside className="w-64 border-r border-white/5 p-6 hidden md:block">
        <h2 className="text-[#39FF14] text-xs font-black tracking-widest mb-8">VIBERS ADMIN</h2>
        <nav className="space-y-2">
          {['Dashboard', 'Projects', 'Users', 'Settings'].map(item => (
            <a key={item} className="block px-4 py-2 rounded-xl text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-xs font-bold tracking-wider">{s.label}</p>
              <p className="text-3xl font-black mt-2">{s.value}</p>
              <p className="text-[#39FF14] text-sm font-bold mt-1">{s.change}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-64 flex items-center justify-center">
          <p className="text-white/20 text-sm">Chart Area - Ready for integration</p>
        </div>
      </main>
    </div>
  );
}`,
        type: 'create',
      },
    ],
    projectDescription: '관리자 대시보드 레이아웃',
    suggestedCommitMessage: 'feat: admin dashboard layout',
    nextSteps: ['차트 라이브러리 연동', '실시간 데이터 바인딩', '다크/라이트 모드 토글'],
  },
};

function matchTutorialScenario(prompt: string): VibeResponse {
  const lower = prompt.toLowerCase();
  if (lower.includes('프로필') || lower.includes('profile') || lower.includes('카드') || lower.includes('card')) {
    return TUTORIAL_SCENARIOS.profile;
  }
  if (lower.includes('랜딩') || lower.includes('landing') || lower.includes('hero') || lower.includes('히어로') || lower.includes('saas')) {
    return TUTORIAL_SCENARIOS.landing;
  }
  if (lower.includes('대시보드') || lower.includes('dashboard') || lower.includes('admin') || lower.includes('관리')) {
    return TUTORIAL_SCENARIOS.dashboard;
  }
  return TUTORIAL_SCENARIOS.default;
}

const GEMINI_API_ENDPOINT = "YOUR_BACKEND_API_OR_DIRECT_GEMINI_ENDPOINT";
const SYSTEM_PROMPT = `
당신은 'vibers' 플랫폼의 심장이자, 사용자 옆에서 실제로 코드를 작성하고 배포하는 AI 에이전트 **'Antigravity Mobile'**입니다.
당신의 목표는 사용자의 목소리를 듣고, 복잡한 소프트웨어 구조를 설계하며, 실제로 동작하는 다중 파일 프로젝트를 관리하는 것입니다.

[핵심 명령]
1. 당신은 단순히 코드를 보여주는 것이 아니라, '프로젝트 전체'를 관리합니다.
2. 사용자의 새로운 요청이 오면, 기존 프로젝트 컨텍스트를 유지하면서 변경이 필요한 파일들(files)을 정확히 산출하십시오.
3. 각 파일은 'create'(생성), 'update'(수정), 'delete'(삭제) 중 하나의 상태를 가져야 합니다.
4. 웹 표준(Next.js, Tailwind v4, Lucide)을 준수하며, 모바일 샌드박스에서 즉시 렌더링 가능한 코드를 생성하십시오.

[출력 양식]
반드시 다음 JSON 구조를 따르십시오:
{
  "message": "사용자에게 보낼 에이전트 브리핑 (전문적이고 친절한 Antigravity 스타일)",
  "files": [
    {
      "path": "파일명 (경로 포함)",
      "content": "파일의 전체 소스 코드 (수정 시에도 전체 코드를 제공하여 덮어쓰기 가능하게 함)",
      "type": "create | update | delete"
    }
  ],
  "projectDescription": "현재까지 구축된 프로젝트 전체 기능 요약",
  "suggestedCommitMessage": "feat: ...",
  "nextSteps": ["다음에 구현하면 좋을 기능 1", "기능 2"]
}

당신은 코드 한 줄 한 줄에 바이브를 담아 생명력을 불어넣는 창조자입니다.
`;

import { StorageService } from './storage';

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const generateVibeCode = async (
    userPrompt: string, 
    projectContext: string = "", 
    isTutorial: boolean = false
): Promise<VibeResponse> => {
  try {
    const tier = await StorageService.getSubscriptionTier();
    const cost = isTutorial ? 0 : (tier === 'Pro' ? 1 : 10); 

    // Tutorial mode: always use predefined scenarios (no API call, no credits)
    if (isTutorial) {
      console.log("🎁 Tutorial Mode - using predefined scenario");
      const response = matchTutorialScenario(userPrompt);
      response.vibeTip = "레오님, 이건 튜토리얼이라 Vibe가 들지 않아요! 마음껏 연습해보세요. 😊";
      return new Promise((resolve) => setTimeout(() => resolve(response), 1200));
    }

    const hasCredits = await StorageService.hasEnoughCredits(cost);
    if (!hasCredits) {
      throw new Error(`크레딧이 부족합니다. (필요: ${cost} Vibes). 설정에서 충전해주세요!`);
    }

    const vconfig = await StorageService.getVertexConfig();
    const apiKey = await StorageService.getGeminiKey();

    let response: VibeResponse;

    // Vertex AI (Google Cloud) 모드 우선 확인
    if (vconfig.projectId && vconfig.location) {
      console.log(`📡 Vertex AI Mode (Project: ${vconfig.projectId})`);
      response = await callVertexAI(userPrompt, vconfig.projectId, vconfig.location, apiKey);
    } else if (apiKey && apiKey.length > 10) {
      // Gemini API 모드 (Fallback)
      console.log("🚀 Gemini API Mode Active");
      response = await callGeminiAPI(userPrompt, apiKey, projectContext);
    } else {
      console.log("⚠️ No API credentials found. Running in simulation mode...");
      response = await simulateVibeResponse(userPrompt);
    }

    // 성공적으로 응답을 받으면 크레딧 차감
    await StorageService.deductCredits(cost);

    // 친절한 팁 추가
    response.vibeTip = VIBE_TIPS[Math.floor(Math.random() * VIBE_TIPS.length)];

    return response;

  } catch (error: any) {
    console.error("❌ Vibe Brain Error:", error);
    throw error; // UI에서 처리하도록 에러 전파
  }
};

const callVertexAI = async (prompt: string, projectId: string, location: string, token: string | null): Promise<VibeResponse> => {
  const MODEL_ID = "gemini-1.5-pro"; // 혹은 flash
  const ENDPOINT = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${MODEL_ID}:generateContent`;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Vertex AI는 액세스 토큰 필요
    },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}\n\n사용자 요청: ${prompt}` }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Vertex AI API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text) as VibeResponse;
};

const callGeminiAPI = async (prompt: string, apiKey: string, context: string): Promise<VibeResponse> => {
  const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}\n\n사용자 요청: ${prompt}\n컨텍스트: ${context}` }]
      }],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);
  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text) as VibeResponse;
};

const simulateVibeResponse = (prompt: string, prefix: string = ""): Promise<VibeResponse> => {
    const isTutorial = prompt.toLowerCase().includes('tutorial') || prompt.includes('튜토리얼');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: isTutorial 
            ? `🎁 **체험 모드 가동!** 레오님, vibers의 강력한 AI 엔진을 무료로 체험해보고 계십니다. 코드가 어떻게 생성되는지 샌드박스에서 바로 확인해보세요!`
            : `${prefix} 레오님! 말씀하신 '${prompt.substring(0, 10)}...' 바이브를 완벽하게 이해했습니다. 에이전트 모드에서 설계를 마쳤어요.`,
          files: [
            {
              path: "App.tsx",
              content: `
import React, { useState } from 'react';

export default function TutorialApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 serif">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 shadow-2xl">
        <div className="mb-8">
           <h2 className="text-[#39FF14] text-xs font-black tracking-widest uppercase mb-2">Vibers Sandbox</h2>
           <h1 className="text-3xl font-bold text-white leading-tight">Interactive\nCreative Mode.</h1>
        </div>
        
        <div className="flex flex-col gap-4">
           <button 
             onClick={() => setCount(c => c + 1)}
             className="w-full py-4 bg-[#39FF14] rounded-2xl text-black font-black text-lg active:scale-95 transition-transform"
           >
             VIBE CHECK: ${'${count}'}
           </button>
           <p className="text-white/40 text-center text-xs">This is a fully functional React sandbox environment.</p>
        </div>
      </div>
    </div>
  );
}
              `,
              type: 'create'
            }
          ],
          projectDescription: "튜토리얼 샌드박스 프로젝트",
          suggestedCommitMessage: "feat: 🎁 튜토리얼 모드 자동 설계 완료",
          nextSteps: ["색상 테마 변경해보기", "버튼 기능 확장하기"]
        });
      }, 1500);
    });
};
