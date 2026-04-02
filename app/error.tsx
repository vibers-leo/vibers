"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand via-brand-600 to-brand px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-black text-dark mb-4">
        문제가 발생했습니다
      </h2>
      <p className="text-lg text-dark/80 mb-8 max-w-md leading-relaxed">
        일시적인 오류일 수 있습니다.
        페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-8 py-4 bg-dark text-brand rounded-full text-lg font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          다시 시도하기
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-dark rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
