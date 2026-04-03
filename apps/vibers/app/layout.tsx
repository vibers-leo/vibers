import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "@/components/auth/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "계발자들 | 우리는 만든다",
    template: "%s | 계발자들",
  },
  description:
    "AI와 바이브코딩으로 새로운 방식의 프로젝트를 만드는 빌더 집단. 바이버스, 팬이지, 누수체크 등 다양한 프로젝트를 아카이빙합니다.",
  metadataBase: new URL("https://vibers.co.kr"),
  openGraph: {
    siteName: "계발자들",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "계발자들",
                "url": "https://vibers.co.kr",
                "description": "AI와 바이브코딩으로 새로운 방식의 프로젝트를 만드는 빌더 집단. 사장님의 기술 파트너.",
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
          <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
