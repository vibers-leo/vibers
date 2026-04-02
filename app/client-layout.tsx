'use client';

import { useEffect } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { registerServiceWorker } from '@/lib/registerSW';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Service Worker 등록 (Production만)
    registerServiceWorker();
  }, []);

  return (
    <>
      {/* Skip to content 링크 (접근성) */}
      <a
        href="#main-content"
        className="skip-to-content"
        aria-label="본문으로 바로가기"
      >
        본문으로 바로가기
      </a>

      <PageTransition>{children}</PageTransition>
    </>
  );
}
