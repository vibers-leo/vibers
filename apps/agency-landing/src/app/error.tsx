"use client";

import { useEffect } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-center px-6">
      <h2 className="text-3xl font-bold mb-4 text-white">
        문제가 발생했습니다
      </h2>
      <p className="text-neutral-400 mb-8 max-w-md">
        일시적인 오류일 수 있습니다.
        페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-emerald-500 text-white hover:bg-emerald-600 transition rounded-lg font-medium"
        >
          다시 시도하기
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-neutral-900 transition rounded-lg inline-block font-medium"
        >
          홈으로 가기
        </a>
      </div>
    </div>
  );
}
