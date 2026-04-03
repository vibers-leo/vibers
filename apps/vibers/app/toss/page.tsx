import Link from 'next/link';

export default function TossHomePage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-8">
      {/* 히어로 */}
      <div className="mb-10 mt-4">
        <h1 className="mb-3 text-[26px] font-bold leading-tight text-gray-900">
          사장님의<br />
          기술 파트너
        </h1>
        <p className="text-[15px] leading-relaxed text-gray-500">
          AI와 바이브코딩으로 홈페이지, 앱, 자동화까지<br />
          사장님 사업에 딱 맞는 기술 솔루션을 제공합니다
        </p>
      </div>

      {/* 기능 카드 */}
      <div className="mb-8 space-y-3">
        <Link
          href="/toss/portfolio"
          className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 transition-colors active:bg-gray-100"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white text-lg">
            📁
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-gray-900">포트폴리오</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              계발자들이 만든 프로젝트를 확인하세요
            </p>
          </div>
          <span className="text-gray-300">›</span>
        </Link>

        <Link
          href="/toss/contact"
          className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 transition-colors active:bg-gray-100"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white text-lg">
            💬
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-gray-900">문의하기</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              프로젝트 상담 및 견적 문의
            </p>
          </div>
          <span className="text-gray-300">›</span>
        </Link>
      </div>

      {/* 관리비 안내 */}
      <div className="mb-8 rounded-2xl bg-emerald-50 p-5">
        <p className="mb-2 text-[14px] font-semibold text-emerald-800">
          월 관리비 하나로 끝
        </p>
        <p className="text-[13px] leading-relaxed text-emerald-700">
          홈페이지 제작부터 유지관리까지,<br />
          기본 관리 / 전담 관리 / 기술 파트너<br />
          3가지 플랜으로 운영됩니다
        </p>
      </div>

      {/* CTA */}
      <div className="mt-auto pb-4">
        <Link
          href="/toss/contact"
          className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-4 text-[16px] font-semibold text-white transition-colors active:bg-emerald-600"
        >
          무료 상담 시작하기
        </Link>
      </div>
    </div>
  );
}
