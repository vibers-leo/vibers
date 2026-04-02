"use client";

import Image from "next/image";
import { classicGalleryTheme } from "./theme";

type ArtworkItem = {
  id: string;
  title: string;
  image_url: string;
  description?: string | null;
};

type SiteInfo = {
  name: string;
  bio?: string;
  instagram?: string;
  blog?: string;
  youtube?: string;
};

export default function ClassicGalleryTemplate({
  artworks,
  site,
}: {
  artworks: ArtworkItem[];
  site: SiteInfo;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-stone-100">
      {/* 헤더 — 클래식 */}
      <header className="border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-8 text-center">
          <h1
            className="text-3xl md:text-4xl font-light tracking-wider"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {site.name}
          </h1>
          {site.bio && (
            <p className="mt-3 text-sm text-stone-400 max-w-lg mx-auto font-light">
              {site.bio}
            </p>
          )}
        </div>
      </header>

      {/* 메인 갤러리 — 단일 포커스 스크롤 */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 space-y-24">
        {artworks.map((artwork, i) => (
          <article key={artwork.id} className="group">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A]">
              <Image
                src={artwork.image_url}
                alt={artwork.title}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority={i < 2}
              />
            </div>
            <div className="mt-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
              <h2
                className="text-xl font-light tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {artwork.title}
              </h2>
              {artwork.description && (
                <p className="text-sm text-stone-500 font-light">
                  {artwork.description}
                </p>
              )}
            </div>
            {/* 구분선 */}
            {i < artworks.length - 1 && (
              <div className="mt-16 border-b border-white/5" />
            )}
          </article>
        ))}
      </section>

      {/* 푸터 */}
      <footer className={classicGalleryTheme.footerClass}>
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-sm tracking-wider text-stone-500"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {site.name}
          </p>
          <div className="flex gap-6 text-xs text-stone-600 uppercase tracking-widest">
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-300 transition-colors"
              >
                Instagram
              </a>
            )}
            {site.blog && (
              <a
                href={site.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-300 transition-colors"
              >
                Blog
              </a>
            )}
            {site.youtube && (
              <a
                href={site.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-300 transition-colors"
              >
                YouTube
              </a>
            )}
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-8 text-center text-[10px] text-stone-700">
          Powered by 모노페이지
        </div>
      </footer>
    </div>
  );
}
