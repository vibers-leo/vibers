import Link from 'next/link';

export default function TossHomePage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-8">
      {/* 히어로 */}
      <div className="mb-10 mt-4">
        <h1 className="mb-3 text-[26px] font-bold leading-tight text-gray-900">
          나만의 아티스트<br />
          홈페이지를 만드세요
        </h1>
        <p className="text-[15px] leading-relaxed text-gray-500">
          작품 포트폴리오, 전시 일정, 팬 소통까지<br />
          AI가 아티스트 맞춤 사이트를 만들어드립니다
        </p>
      </div>

      {/* 기능 카드 */}
      <div className="mb-8 space-y-3">
        <Link
          href="/toss/gallery"
          className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 transition-colors active:bg-gray-100"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white text-lg">
            🎨
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-gray-900">아티스트 갤러리</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              다양한 아티스트 사이트를 구경하세요
            </p>
          </div>
          <span className="text-gray-300">›</span>
        </Link>

        <Link
          href="/toss/create"
          className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 transition-colors active:bg-gray-100"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500 text-white text-lg">
            ✨
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-gray-900">AI 사이트 생성</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              AI로 나만의 아티스트 페이지를 만드세요
            </p>
          </div>
          <span className="text-gray-300">›</span>
        </Link>
      </div>

      {/* CTA */}
      <div className="mt-auto pb-4">
        <Link
          href="/toss/create"
          className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-4 text-[16px] font-semibold text-white transition-colors active:bg-emerald-600"
        >
          무료로 시작하기
        </Link>
      </div>
    </div>
  );
}
