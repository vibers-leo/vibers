"use client";

import Link from "next/link";
import { ArrowRight, Instagram, ShieldCheck, Sparkles, LayoutTemplate } from "lucide-react";

export default function CreateStartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-24 pb-12">
        <div className="max-w-2xl mx-auto w-full">
          {/* 아이콘 */}
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-pink-500/20">
            <Instagram size={36} />
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            인스타그램 계정만으로
            <br />
            <span className="text-gray-400">포트폴리오가</span> 완성됩니다
          </h1>

          <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed" style={{ wordBreak: 'keep-all' }}>
            이미지를 직접 올릴 필요가 없습니다. <br className="hidden md:block" />
            페이지 생성을 위해 인스타그램 게시물을 불러올 권한을 승인해 주세요.
          </p>

          {/* 권한 동의 안내 박스 */}
          <div className="max-w-md mx-auto mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                <ShieldCheck size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">안전한 데이터 연동</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  모노페이지는 오직 홈페이지 생성을 위한 공개 게시물 이미지와 기본 프로필 정보만을 읽어오며, 어떠한 개인 정보나 비밀번호도 수집하지 않습니다.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/create/customize" // 임시로 바로 customize로 넘기게 하되, 나중에 실제 OAuth 엔드포인트(/api/auth/instagram) 등으로 수정 가능
            className="inline-flex items-center justify-center w-full max-w-md gap-3 px-8 py-5 bg-black text-white rounded-2xl text-base font-semibold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5"
          >
            <Instagram size={20} />
            인스타그램 로그인 및 계속하기
            <ArrowRight size={18} className="ml-auto" />
          </Link>
        </div>

        {/* 프로세스 안내 */}
        <div className="mt-24 max-w-3xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4">
              <Instagram size={18} className="text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. 계정 연결</h3>
            <p className="text-sm text-gray-500">
              안전한 공식 API를 통해 인스타그램 계정을 연결하고 권한을 승인합니다.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4">
              <Sparkles size={18} className="text-emerald-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. 분석 및 추출</h3>
            <p className="text-sm text-gray-500">
              최근 게시물들 중 작품 이미지를 분석하여 포트폴리오를 구성합니다.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4">
              <LayoutTemplate size={18} className="text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. 사이트 발행</h3>
            <p className="text-sm text-gray-500">
              기본 정보를 입력하고 URL을 고르면 바로 나만의 모노페이지가 완성됩니다.
            </p>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="px-6 py-8 text-center text-xs text-gray-400 font-light">
        Powered by 모노페이지 &middot; Vibers
      </footer>
    </div>
  );
}
