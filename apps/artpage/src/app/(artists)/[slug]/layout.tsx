import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Montserrat, Crimson_Text, Open_Sans, Noto_Serif_KR, Inter } from "next/font/google";

import { getTemplateConfig, isValidSlug, getAllSlugs } from "@/lib/templates";
import { SlugProvider } from "@/lib/slug-context";
import { Toaster } from "sonner";

// arthyun 폰트
const crimson = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-sans" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-heading" });

// art-way 폰트
const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-serif-kr",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans-alt" });

// 정적 경로 생성 (빌드 최적화)
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  if (!config) return {};

  return {
    metadataBase: new URL(config.meta.domain),
    title: config.meta.title,
    description: config.meta.description,
    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
      type: "website",
      images: [
        {
          url: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: config.meta.title,
        },
      ],
    },
  };
}

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    notFound();
  }

  const config = getTemplateConfig(slug)!;
  const isArthyun = config.template === "arthyun";

  // 템플릿별 폰트 클래스
  const fontClasses = isArthyun
    ? `${crimson.variable} ${openSans.variable} ${montserrat.variable}`
    : `${notoSerif.variable} ${inter.variable}`;

  return (
    <html lang="ko" className={fontClasses}>
      <body className={config.theme.bodyClass} style={config.theme.bodyStyle}>
        <Toaster position="top-center" richColors />

        <SlugProvider slug={slug} config={config}>
          {/* 헤더 — 템플릿별 동적 로드 */}
          {isArthyun ? (
            <ArthyunHeader />
          ) : (
            <ArtWayHeader />
          )}

          {/* 메인 컨텐츠 */}
          <main className="min-h-screen">{children}</main>

          {/* 푸터 — 템플릿별 */}
          {isArthyun ? (
            <ArthyunFooter config={config} />
          ) : (
            <ArtWayFooter config={config} />
          )}
        </SlugProvider>
      </body>
    </html>
  );
}

// ── 헤더 컴포넌트 (lazy import) ──

async function ArthyunHeader() {
  const Header = (await import("@/components/templates/arthyun/Header")).default;
  const VisitorTracker = (await import("@/components/templates/arthyun/VisitorTracker")).default;
  const ScrollToTop = (await import("@/components/ui/ScrollToTop")).default;
  return (
    <>
      <VisitorTracker />
      <ScrollToTop />
      <Header />
    </>
  );
}

async function ArtWayHeader() {
  const Header = (await import("@/components/templates/art-way/Header")).default;
  const VisitorTracker = (await import("@/components/templates/art-way/VisitorTracker")).default;
  return (
    <>
      <VisitorTracker />
      <Header />
    </>
  );
}

// ── 푸터 컴포넌트 ──

import type { TemplateConfig } from "@/lib/templates";

function ArthyunFooter({ config }: { config: TemplateConfig }) {
  const footerLogoUrl = "/images/logo-light.png";
  return (
    <footer className={config.theme.footerClass}>
      <div className="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 text-xs font-light">
        <div className="space-y-4">
          <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity relative h-8 w-40">
            <Image
              src={footerLogoUrl}
              alt="Art Hyun Logo"
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 100px, 150px"
            />
          </div>
          <div>
            <p className="mb-1 font-heading font-bold text-white text-sm tracking-widest">
              ART HYUN
            </p>
            <p>{config.contact.address}</p>
            <p>T. {config.contact.phone} | E. {config.contact.email}</p>
          </div>
        </div>
        <div className="flex gap-6 font-heading tracking-widest">
          {config.social.instagram && (
            <a href={config.social.instagram} target="_blank" className="text-white hover:text-gray-300 transition">
              INSTAGRAM
            </a>
          )}
          {config.social.blog && (
            <a href={config.social.blog} target="_blank" className="text-white hover:text-gray-300 transition">
              BLOG
            </a>
          )}
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center md:text-left text-[10px] text-gray-600 font-heading">
        COPYRIGHT 2019 ART HYUN. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}

function ArtWayFooter({ config }: { config: TemplateConfig }) {
  return (
    <footer className={config.theme.footerClass}>
      <div className="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-gray-400 text-xs font-light">
        <div>
          <p className="mb-2 font-serif text-black text-sm">
            아트웨이 갤러리 ARTWAY GALLERY
          </p>
          <p>{config.contact.address}</p>
          <p>T. {config.contact.phone} | E. {config.contact.email}</p>
        </div>
        <div className="flex gap-4">
          {config.social.instagram && (
            <a href={config.social.instagram} target="_blank" className="hover:text-black transition">
              INSTAGRAM
            </a>
          )}
          {config.social.blog && (
            <a href={config.social.blog} target="_blank" className="hover:text-black transition">
              BLOG
            </a>
          )}
          {config.social.youtube && (
            <a href={config.social.youtube} target="_blank" className="hover:text-black transition">
              YOUTUBE
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
