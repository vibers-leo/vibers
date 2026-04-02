import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Timeline from '@/components/sections/Timeline';
import { BentoGrid } from '@/components/layouts/BentoGrid';
import StatCard from '@/components/ui/StatCard';
import { historyEvents } from '@/data/history';

export const metadata = {
  title: '히스토리 | 세모폰',
  description: '세모폰의 성장 스토리와 주요 마일스톤을 확인하세요.'
};

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main id="main-content" style={{ isolation: 'isolate', position: 'relative', zIndex: 0 }}>
        {/* Hero */}
        <section className="bg-white pt-[100px] md:pt-[120px] pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <Image
                src="/icons/시계.png"
                alt="히스토리"
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">Our Story</p>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2" style={{ wordBreak: 'keep-all' }}>히스토리</h1>
                <p className="text-base md:text-lg text-gray-600" style={{ wordBreak: 'keep-all' }}>
                  세모폰의 성장 스토리
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="bg-gray-50 py-24 px-3 text-center">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">By the numbers</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-dark tracking-tight" style={{ wordBreak: 'keep-all' }}>숫자로 보는 세모폰</h2>
            <p className="text-gray-600 mb-12 text-lg" style={{ wordBreak: 'keep-all' }}>함께 성장한 시간들</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard value="380,000+" label="모바일서비스 누적개통" icon="/icons/차트.png" useBento={false} delay={0} />
              <StatCard value="80,000+" label="인터넷서비스 누적개통" icon="/icons/건물.png" useBento={false} delay={0.1} />
              <StatCard value="월 600+" label="가전렌탈서비스 월평균" icon="/icons/ok.png" useBento={false} delay={0.2} />
              <StatCard value="4.8/5.0" label="고객만족도 리뷰 평점" icon="/icons/하트.png" useBento={false} delay={0.3} />
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-4">Timeline</p>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-6 text-dark tracking-tight" style={{ wordBreak: 'keep-all' }}>세모폰의 성장 여정</h2>

            {/* 인트로 */}
            <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                세모폰은 <strong>"투명한 가격과 신뢰 기반의 휴대폰 유통"</strong>을 기준으로<br className="hidden md:block" />
                단순 판매를 넘어 지속적으로 찾게 되는 매장을 만들어온 브랜드입니다.
              </p>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                한 개 매장에서 시작해 현재는 수도권 전역에서 고객과 만나고 있으며,<br className="hidden md:block" />
                오랜 시간 축적된 운영 경험과 데이터를 기반으로 더 안정적이고 만족도 높은 서비스를 제공하고 있습니다.
              </p>
            </div>

            <Timeline events={historyEvents} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
