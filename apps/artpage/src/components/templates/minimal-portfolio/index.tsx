"use client";

import Image from "next/image";
import { minimalPortfolioTheme } from "./theme";

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

export default function MinimalPortfolioTemplate({
  artworks,
  site,
}: {
  artworks: ArtworkItem[];
  site: SiteInfo;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 헤더 — 극도로 미니멀 */}
      <header className="max-w-[1600px] mx-auto px-4 pt-10 pb-6">
        <div className="flex items-baseline justify-between">
          <h1 className="text-sm font-medium tracking-widest uppercase text-gray-900">
            {site.name}
          </h1>
          <div className="flex gap-3">
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider"
              >
                Ig
              </a>
            )}
            {site.blog && (
              <a
                href={site.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider"
              >
                Blog
              </a>
            )}
          </div>
        </div>
        {site.bio && (
          <p className="mt-4 text-xs text-gray-400 max-w-md font-light">
            {site.bio}
          </p>
        )}
      </header>

      {/* 메이슨리 그리드 */}
      <section className="max-w-[1600px] mx-auto px-4 pb-16">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="break-inside-avoid group">
              <div className="relative overflow-hidden">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  width={800}
                  height={800}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* 호버 시 제목만 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-end">
                  <span className="text-[11px] text-white px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 tracking-wide">
                    {artwork.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 — 한 줄 */}
      <footer className={minimalPortfolioTheme.footerClass}>
        <div className="max-w-[1600px] mx-auto px-4 flex justify-between items-center text-[10px] text-gray-300">
          <span>&copy; {new Date().getFullYear()} {site.name}</span>
          <span>모노페이지</span>
        </div>
      </footer>
    </div>
  );
}
