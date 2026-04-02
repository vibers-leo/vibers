import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "./client-layout";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "세모폰 - 세상의 모든 휴대폰",
    template: "%s | 세모폰",
  },
  description: "직접 오시면 가격이 다릅니다. 수도권 50개 매장에서 온라인에 없는 가격을 경험하세요.",
  keywords: "휴대폰, 스마트폰, 핸드폰 매장, 세모폰, 휴대폰 성지, 휴대폰 가격, 서울 휴대폰, 경기 휴대폰, 인천 휴대폰",
  authors: [{ name: "세모폰" }],
  creator: "세모폰",
  publisher: "주식회사 승승장구",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://semophone.co.kr",
    siteName: "세모폰",
    title: "세모폰 - 세상의 모든 휴대폰",
    description: "직접 오시면 가격이 다릅니다. 수도권 50개 매장에서 온라인에 없는 가격을 경험하세요.",
    images: [
      {
        url: "/images/logo/기본로고.png",
        width: 1200,
        height: 630,
        alt: "세모폰 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "세모폰 - 세상의 모든 휴대폰",
    description: "직접 오시면 가격이 다릅니다. 수도권 50개 매장.",
    images: ["/images/logo/기본로고.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    other: {
      "naver-site-verification": "9ce4ab454f8efae4fff19426adbc9a58b43008e3",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#F2C811" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="세모폰" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "세모폰",
              "url": "https://semophone.co.kr",
              "description": "직접 오시면 가격이 다릅니다. 수도권 50개 매장에서 온라인에 없는 가격을 경험하세요.",
              "creator": {
                "@type": "Organization",
                "name": "계발자들 (Vibers)",
                "url": "https://vibers.co.kr"
              },
              "inLanguage": "ko"
            })
          }}
        />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
