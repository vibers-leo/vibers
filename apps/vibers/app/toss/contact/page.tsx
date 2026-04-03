import Link from 'next/link';

export default function TossContactPage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <h2 className="mb-1 text-[20px] font-bold text-gray-900">문의하기</h2>
      <p className="mb-6 text-[14px] text-gray-500">
        프로젝트 상담 및 견적 문의
      </p>

      {/* 문의 방법 */}
      <div className="space-y-3">
        <a
          href="https://open.kakao.com/o/s4example"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl bg-yellow-50 p-5 transition-colors active:bg-yellow-100"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-lg">
            💬
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-gray-900">카카오톡 문의</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              가장 빠르게 상담받을 수 있어요
            </p>
          </div>
          <span className="text-gray-300">›</span>
        </a>

        <a
          href="mailto:hello@vibers.co.kr"
          className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 transition-colors active:bg-gray-100"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white text-lg">
            📧
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-gray-900">이메일 문의</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              hello@vibers.co.kr
            </p>
          </div>
          <span className="text-gray-300">›</span>
        </a>
      </div>

      {/* 상담 안내 */}
      <div className="mt-8 rounded-2xl bg-emerald-50 p-5">
        <p className="mb-3 text-[14px] font-semibold text-emerald-800">
          상담 가능 시간
        </p>
        <div className="space-y-1.5 text-[13px] text-emerald-700">
          <p>평일 10:00 - 18:00</p>
          <p>주말 및 공휴일 휴무</p>
          <p className="mt-3 text-[12px] text-emerald-600">
            문의 후 평균 24시간 이내 답변드립니다
          </p>
        </div>
      </div>

      {/* 하단 */}
      <div className="mt-auto pb-4 pt-8">
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
