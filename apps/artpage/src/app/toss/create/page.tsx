'use client';

import Link from 'next/link';

const STEPS = [
  {
    step: 1,
    title: '장르 선택',
    description: '회화, 사진, 디자인, 공예 등\n나의 작업 분야를 알려주세요',
    icon: '🎯',
  },
  {
    step: 2,
    title: 'AI 사이트 생성',
    description: '작업 스타일에 맞는 사이트를\nAI가 자동으로 디자인합니다',
    icon: '🤖',
  },
  {
    step: 3,
    title: '작품 업로드',
    description: '포트폴리오, 전시 이력, 프로필을\n자유롭게 등록하세요',
    icon: '📸',
  },
  {
    step: 4,
    title: '공개 & 공유',
    description: '나만의 아티스트 홈페이지를\n세상에 공개하세요',
    icon: '🚀',
  },
];

export default function TossCreatePage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      {/* 헤더 */}
      <h2 className="mb-1 text-[22px] font-bold text-gray-900">AI 사이트 생성</h2>
      <p className="mb-8 text-[14px] text-gray-500">
        4단계로 나만의 아티스트 페이지를 완성하세요
      </p>

      {/* 스텝 가이드 */}
      <div className="mb-8 space-y-4">
        {STEPS.map((item, idx) => (
          <div
            key={item.step}
            className="flex items-start gap-4"
          >
            {/* 좌측: 스텝 번호 + 연결선 */}
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg text-white">
                {item.icon}
              </div>
              {idx < STEPS.length - 1 && (
                <div className="my-1 h-8 w-0.5 bg-emerald-200" />
              )}
            </div>

            {/* 우측: 내용 */}
            <div className="flex-1 pt-1">
              <p className="text-[15px] font-semibold text-gray-900">
                <span className="mr-1.5 text-emerald-500">0{item.step}</span>
                {item.title}
              </p>
              <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-gray-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 안내 */}
      <div className="mb-6 rounded-2xl bg-emerald-50 p-5">
        <p className="text-[14px] font-semibold text-emerald-700">
          완전 무료로 시작할 수 있어요
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-emerald-600">
          기본 사이트 생성은 무료이며,<br />
          커스텀 도메인 등 프리미엄 기능은 추후 제공됩니다.
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-auto space-y-3 pb-4">
        <button
          onClick={() => alert('토스 정식 출시 후 이용 가능합니다.')}
          className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-4 text-[16px] font-semibold text-white transition-colors active:bg-emerald-600"
        >
          무료로 시작하기
        </button>
        <Link
          href="/toss"
          className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-3.5 text-[15px] font-medium text-gray-600 transition-colors active:bg-gray-200"
        >
          돌아가기
        </Link>
      </div>
    </div>
  );
}
