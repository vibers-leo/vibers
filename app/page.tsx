'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimplifiedHero from '@/components/sections/SimplifiedHero';
import MinimalStats from '@/components/sections/MinimalStats';
import MinimalCTA from '@/components/sections/MinimalCTA';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showStickyCta, setShowStickyCta] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  // Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      const splash = document.getElementById('splash');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => setShowSplash(false), 500);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Sticky CTA
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCta(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Loading Splash */}
      {showSplash && (
        <div className="splash" id="splash">
          <Image
            src="/landing/logo-full.png"
            alt="세모폰"
            width={180}
            height={180}
            className="splash-logo"
            priority
          />
        </div>
      )}

      {/* Header */}
      <Header />

      {/* 본문 - stacking context 격리 */}
      <main id="main-content" style={{ isolation: 'isolate', position: 'relative', zIndex: 0 }}>
        {/* 히어로 섹션 */}
        <div ref={heroRef}>
          <SimplifiedHero />
        </div>

        {/* Mission 섹션 */}
        <section className="bg-white py-24 px-3 text-center">
          <div className="max-w-container-md mx-auto">
            <Image
              src="/images/logo/기본로고.png"
              alt="세모폰"
              width={120}
              height={120}
              className="mx-auto mb-6 opacity-90"
            />
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              세상의 모든<br />
              휴대폰 가격을 내리다
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              세모폰은 고객이 불필요한 비용을 지불하지 않도록,<br />
              투명한 가격과 정직한 서비스로 신뢰를 쌓아갑니다.
            </p>
          </div>
        </section>

        {/* 통계 섹션 */}
        <MinimalStats />

        {/* 최종 CTA */}
        <MinimalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky CTA - 모바일 전용 */}
      <div className={`md:hidden sticky-cta z-sticky-cta ${showStickyCta ? 'visible' : ''}`}>
        <Link href="/stores" className="sticky-cta-btn">
          가까운 매장 찾기
        </Link>
      </div>
    </>
  );
}
