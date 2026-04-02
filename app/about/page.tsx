'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" style={{ isolation: 'isolate', position: 'relative', zIndex: 0 }}>
        {/* Hero */}
        <section className="bg-white pt-[100px] md:pt-[120px] pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <Image
                src="/icons/건물.png"
                alt="회사소개"
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">About us</p>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2" style={{ wordBreak: 'keep-all' }}>회사 소개</h1>
                <p className="text-base md:text-lg text-gray-600" style={{ wordBreak: 'keep-all' }}>
                  투명한 가격, 정직한 서비스
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 회사 소개 */}
        <section className="bg-white py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-12">
              {/* 브랜드 이미지 */}
              <div className="flex-shrink-0 w-full md:w-80">
                <div className="relative w-full md:w-80 aspect-square">
                  <Image
                    src="/images/logo/company_intro_banner.jpg"
                    alt="세모폰 슬로건"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* 소개 본문 */}
              <div className="flex-1 space-y-4 text-gray-700 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                <p>
                  세모폰은 2012년 설립 이후 이동통신 3사 및 알뜰폰 상품을 기반으로
                  온라인과 오프라인을 아우르는 통합 유통 환경 속에서
                  차별화된 경쟁력을 만들어온 모바일 전문 브랜드입니다.
                </p>
                <p>
                  &apos;세상의 모든 휴대폰&apos;이라는 비전 아래
                  고객에게 최고의 가치와 선택 경험을 제공하는 것을 목표로 하고 있습니다.
                  현재 전국 50개 이상의 직영 매장을 운영하며,
                  누적 46만 명 이상의 고객과 신뢰를 쌓아오며 지속적으로 성장해왔습니다.
                </p>
                <p>
                  세모폰은 투명한 가격과 정직한 서비스를 핵심 원칙으로 합니다.
                  단순한 판매를 넘어, 고객 한 분 한 분께 최적의 선택을 제안하며
                  일반적인 유통 구조에서는 경험하기 어려운 합리적인 가격과 전문적인 상담을 제공합니다.
                </p>
                <p>
                  또한, 축적된 직영 매장 운영 데이터와 네트워크를 기반으로
                  안정적인 운영 구조와 일관된 고객 경험을 만들어가고 있습니다.
                </p>
                <p>
                  앞으로도 세모폰은 고객과의 신뢰를 최우선 가치로 삼아
                  모바일 통신 시장의 투명한 기준이 되는 브랜드로 성장해 나가겠습니다.
                </p>
                <p>고객 여러분의 현명한 선택에 세모폰이 함께하겠습니다.</p>
                <p>감사합니다.</p>
              </div>
            </div>
          </div>
        </section>


        {/* 세모폰의 CI 소개 */}
        <section className="bg-white py-24 px-3">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Brand Identity</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-6" style={{ wordBreak: 'keep-all' }}>
                세모폰의 CI 소개
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12" style={{ wordBreak: 'keep-all' }}>
                세모폰의 CI에는 브랜드가 추구하는 가치와 방향성이 담겨 있습니다.
              </p>
            </div>

            {/* 로고 소개 */}
            <div className="bg-white rounded-3xl p-12 shadow-xl mb-12">
              <div className="flex flex-col md:flex-row items-center gap-12">
                {/* 로고 이미지 */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-64 bg-gray-50 rounded-2xl flex items-center justify-center p-8">
                    <Image
                      src="/images/logo/기본로고.png"
                      alt="세모폰 로고"
                      width={200}
                      height={200}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* 로고 설명 */}
                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-6" style={{ wordBreak: 'keep-all' }}>
                    세모폰 로고
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-base" style={{ wordBreak: 'keep-all' }}>
                    &apos;연결과 균형&apos;을 기반으로 한 단순한 기하학적 형태에서 출발해,<br />
                    다양한 휴대폰과 서비스, 그리고 고객의 선택이 하나로 이어지는 경험을 상징합니다.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base" style={{ wordBreak: 'keep-all' }}>
                    삼각형을 이루는 세 요소는<br />
                    신뢰 · 가치 · 감동을 의미하며,<br />
                    고객과 함께 성장하며 가치를 나누는 구조를 표현합니다.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base" style={{ wordBreak: 'keep-all' }}>
                    각 요소가 균형 있게 연결되듯,<br />
                    세모폰은 다양한 브랜드와 통신 서비스를 효과적으로 연결합니다.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base" style={{ wordBreak: 'keep-all' }}>
                    앞으로도 세모폰은 이 CI를 중심으로<br />
                    더 나은 기준과 경험을 만들어가는 브랜드로 성장해 나가겠습니다.
                  </p>

                  {/* 다운로드 버튼 */}
                  <div className="pt-6 flex flex-col sm:flex-row gap-3">
                    <a
                      href="/downloads/semophone_logos_original.zip"
                      download="세모폰_로고_PNG파일.zip"
                      style={{ backgroundColor: '#FEE500' }}
                      className="px-6 py-3.5 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-flex"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="text-sm">로고 PNG 파일 (ZIP)</span>
                      </div>
                    </a>
                    <a
                      href="/downloads/semophone_logo_original.ai"
                      download="세모폰_로고_AI원본.ai"
                      style={{ backgroundColor: '#FEE500' }}
                      className="px-6 py-3.5 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-flex"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="text-sm">로고 AI 원본 파일</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
