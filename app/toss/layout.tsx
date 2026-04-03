import type { Metadata, Viewport } from 'next';
import TossLayout from '@/components/toss/TossLayout';

export const metadata: Metadata = {
  title: '계발자들 | 토스',
  description: '사장님의 기술 파트너, 계발자들 — 토스에서 바로 만나보세요',
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
  return <TossLayout serviceName="계발자들">{children}</TossLayout>;
}
