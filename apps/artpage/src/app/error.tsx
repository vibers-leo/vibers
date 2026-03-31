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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <h2 className="text-3xl font-serif font-light mb-4 text-foreground">
        문제가 발생했습니다
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        일시적인 오류일 수 있습니다.
        페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
      </p>

      <div className="space-x-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-foreground text-background hover:opacity-80 transition rounded-md"
        >
          다시 시도하기
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-muted-foreground/30 hover:bg-muted/50 transition rounded-md inline-block"
        >
          홈으로 가기
        </a>
      </div>
    </div>
  );
}
