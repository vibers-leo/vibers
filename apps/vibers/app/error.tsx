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
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: "#050505", color: "#fff" }}
    >
      <h2 className="text-3xl font-bold mb-4">
        문제가 발생했습니다
      </h2>
      <p className="mb-8 max-w-md" style={{ color: "#888" }}>
        일시적인 오류일 수 있습니다.
        페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-lg font-medium transition hover:opacity-90"
          style={{ backgroundColor: "#39FF14", color: "#000" }}
        >
          다시 시도하기
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-lg font-medium transition hover:opacity-80 inline-block"
          style={{
            border: "1px solid rgba(57, 255, 20, 0.4)",
            color: "#39FF14",
          }}
        >
          홈으로 가기
        </a>
      </div>
    </div>
  );
}
