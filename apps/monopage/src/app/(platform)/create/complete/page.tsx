"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ExternalLink, Share2, Copy } from "lucide-react";

type CreateResult = {
  slug: string;
  name: string;
  url: string;
};

export default function CompletePage() {
  const router = useRouter();
  const [result, setResult] = useState<CreateResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("monopage_create_result");
    if (!stored) {
      router.replace("/create");
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 미지원 시 무시
    }
  };

  const handleShare = async () => {
    if (!result) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${result.name} | 모노페이지`,
          text: `${result.name}의 아트 포트폴리오를 확인해보세요!`,
          url: result.url,
        });
      } catch {
        // 공유 취소 시 무시
      }
    } else {
      handleCopy();
    }
  };

  if (!result) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* 성공 아이콘 */}
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 animate-[scale-in_0.3s_ease-out]">
          <Check size={40} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-semibold mb-3">
          축하합니다!
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          <span className="font-medium text-black">{result.name}</span>님의
          홈페이지가 생성되었습니다.
        </p>

        {/* 생성된 URL */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
            사이트 주소
          </p>
          <p className="text-lg font-medium break-all">{result.url}</p>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3 mb-12">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={18} />
            홈페이지 보기
          </a>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 py-3 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              공유하기
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 py-3 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              {copied ? "복사됨!" : "주소 복사"}
            </button>
          </div>
        </div>

        {/* 추가 링크 */}
        <div className="space-y-2 text-sm">
          <Link
            href="/admin/dashboard"
            className="text-gray-500 hover:text-black transition-colors underline underline-offset-4"
          >
            관리 페이지로 이동
          </Link>
          <p className="text-gray-300">&middot;</p>
          <Link
            href="/create"
            className="text-gray-500 hover:text-black transition-colors underline underline-offset-4"
          >
            새 사이트 만들기
          </Link>
        </div>
      </div>
    </div>
  );
}
