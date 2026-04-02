import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "1인 마케팅 대행사 | 30가지 프리미엄 디자인 테마",
  description:
    "프리랜서 마케터를 위한 30가지 디자인 테마 쇼케이스. 컬러, 폰트, 레이아웃이 최적화된 랜딩 페이지 템플릿을 미리보고 선택하세요.",
  openGraph: {
    title: "1인 마케팅 대행사 | 30가지 프리미엄 디자인 테마",
    description: "프리랜서 마케터를 위한 30가지 디자인 테마 쇼케이스. 컬러, 폰트, 레이아웃이 최적화된 랜딩 페이지 템플릿을 미리보고 선택하세요.",
    type: "website",
    url: "https://agency-landing.vercel.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "1인 마케팅 대행사" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "1인 마케팅 대행사 | 30가지 프리미엄 디자인 테마",
    description: "프리랜서 마케터를 위한 30가지 디자인 테마 쇼케이스. 컬러, 폰트, 레이아웃이 최적화된 랜딩 페이지 템플릿을 미리보고 선택하세요.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "1인 마케팅 대행사",
              "url": "https://agency-landing.vercel.app",
              "description": "프리랜서 마케터를 위한 30가지 프리미엄 디자인 테마 쇼케이스. 랜딩 페이지 템플릿을 미리보고 선택하세요.",
              "creator": {
                "@type": "Organization",
                "name": "계발자들 (Vibers)",
                "url": "https://vibers.co.kr"
              },
              "inLanguage": "ko"
            })
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7704550771011130"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CGK1BSBM63"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CGK1BSBM63');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
