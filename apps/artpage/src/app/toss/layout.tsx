import type { Metadata, Viewport } from 'next';
import TossLayout from '@/components/toss/TossLayout';

export const metadata: Metadata = {
  title: '아트페이지 | 토스',
  description: '아티스트를 위한 홈페이지 플랫폼 — 토스에서 바로 시작하세요',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function TossRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TossLayout serviceName="아트페이지">{children}</TossLayout>;
}
