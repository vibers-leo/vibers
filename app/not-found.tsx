import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand via-brand-600 to-brand px-4">
      <div className="text-center max-w-2xl">
        {/* 아이콘 */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl"></div>
          <Image
            src="/icons/세모폰 기본 매장찾기.png"
            alt="404"
            width={128}
            height={128}
            className="relative w-32 h-32 object-contain animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* 제목 */}
        <h1 className="text-6xl md:text-8xl font-black text-dark mb-6">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
          길을 잃으셨나요?
        </h2>

        <p className="text-lg md:text-xl text-dark/80 mb-8 leading-relaxed">
          찾으시는 페이지가 없거나<br />
          주소가 변경되었을 수 있습니다
        </p>

        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark text-brand rounded-full text-lg font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            홈으로 돌아가기
          </Link>

          <Link
            href="/stores"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-dark rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Image src="/icons/지도핀.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
            매장 찾기
          </Link>
        </div>

        {/* 추가 도움말 */}
        <div className="mt-12 pt-8 border-t border-dark/20">
          <p className="text-sm text-dark/70 mb-4">자주 찾는 페이지</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/about"
              className="px-4 py-2 bg-dark/20 hover:bg-dark/30 hover:scale-105 rounded-full text-sm font-semibold text-dark transition-all"
            >
              회사소개
            </Link>
            <Link
              href="/careers"
              className="px-4 py-2 bg-dark/20 hover:bg-dark/30 hover:scale-105 rounded-full text-sm font-semibold text-dark transition-all"
            >
              채용정보
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-dark/20 hover:bg-dark/30 hover:scale-105 rounded-full text-sm font-semibold text-dark transition-all"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
