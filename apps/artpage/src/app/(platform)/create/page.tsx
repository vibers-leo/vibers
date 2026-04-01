"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Image as ImageIcon, Palette } from "lucide-react";

export default function CreateStartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 히어로 - 상단 여백 추가 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-24">
        <div className="max-w-2xl mx-auto">
          {/* 아이콘 */}
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Sparkles size={28} />
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            이미지만 올리면
            <br />
            <span className="text-gray-400">AI가 홈페이지를</span>
            <br />
            만들어드립니다
          </h1>

          <p className="text-lg text-gray-500 mb-12 max-w-md mx-auto leading-relaxed">
            작품 이미지를 업로드하면 AI가 스타일을 분석하고,
            <br className="hidden md:block" />
            당신에게 맞는 디자인을 추천해드립니다.
          </p>

          {/* CTA */}
          <Link
            href="/create/upload"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            시작하기
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* 프로세스 안내 */}
        <div className="mt-20 max-w-2xl w-full grid grid-cols-3 gap-6 text-left">
          <div className="p-5 rounded-2xl bg-gray-50">
            <ImageIcon size={24} className="mb-3 text-gray-400" />
            <h3 className="font-medium mb-1 text-sm">1. 이미지 업로드</h3>
            <p className="text-xs text-gray-400">
              작품 이미지 5~20장을 드래그 앤 드롭으로 올려주세요
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-gray-50">
            <Sparkles size={24} className="mb-3 text-gray-400" />
            <h3 className="font-medium mb-1 text-sm">2. AI 분석</h3>
            <p className="text-xs text-gray-400">
              AI가 작품 스타일, 색감, 분위기를 자동 분석합니다
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-gray-50">
            <Palette size={24} className="mb-3 text-gray-400" />
            <h3 className="font-medium mb-1 text-sm">3. 디자인 선택</h3>
            <p className="text-xs text-gray-400">
              3가지 추천 디자인 중 마음에 드는 것을 골라주세요
            </p>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="px-6 py-8 text-center text-xs text-gray-300">
        Powered by 모노페이지 &middot; Vibers
      </footer>
    </div>
  );
}
