import Link from 'next/link';

const projects = [
  {
    name: '팬이지',
    desc: '인플루언서·소상공인 맞춤형\n홈페이지 제작 플랫폼',
    emoji: '🌐',
    color: 'bg-blue-500',
  },
  {
    name: '프리미엄페이지',
    desc: '산업용 전자카탈로그\n제작 솔루션',
    emoji: '📘',
    color: 'bg-indigo-500',
  },
  {
    name: '누수체크',
    desc: '누수 탐지 전문업체\n매칭 서비스',
    emoji: '💧',
    color: 'bg-cyan-500',
  },
  {
    name: 'AI 레시피',
    desc: 'AI 기반 레시피 추천\n요리 도우미',
    emoji: '🍳',
    color: 'bg-orange-500',
  },
  {
    name: '세모폰',
    desc: '중고폰 시세 비교\n플랫폼',
    emoji: '📱',
    color: 'bg-purple-500',
  },
  {
    name: '아트페이지',
    desc: '아티스트 포트폴리오\n웹사이트 빌더',
    emoji: '🎨',
    color: 'bg-pink-500',
  },
];

export default function TossPortfolioPage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <h2 className="mb-1 text-[20px] font-bold text-gray-900">포트폴리오</h2>
      <p className="mb-6 text-[14px] text-gray-500">
        계발자들이 만든 프로젝트들
      </p>

      {/* 프로젝트 목록 */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.name}
            className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${project.color} text-xl text-white`}>
              {project.emoji}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-gray-900">
                {project.name}
              </p>
              <p className="mt-0.5 whitespace-pre-line text-[13px] text-gray-500">
                {project.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 안내 */}
      <div className="mt-8 pb-4">
        <Link
          href="/toss"
          className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-3.5 text-[14px] font-medium text-gray-700 transition-colors active:bg-gray-200"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
