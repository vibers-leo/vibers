"use client";

import Image from "next/image";
import { modernArtTheme } from "./theme";

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

export default function ModernArtTemplate({
  artworks,
  site,
}: {
  artworks: ArtworkItem[];
  site: SiteInfo;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 — 미니멀 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            {site.name}
          </h1>
          <div className="flex gap-4 text-xs text-gray-400 uppercase tracking-widest">
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                Instagram
              </a>
            )}
            {site.blog && (
              <a
                href={site.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                Blog
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 히어로 — 작가 소개 */}
      {site.bio && (
        <section className="max-w-[1400px] mx-auto px-6 py-20">
          <p className="text-2xl md:text-3xl font-light text-gray-600 max-w-2xl leading-relaxed">
            {site.bio}
          </p>
        </section>
      )}

      {/* 그리드 갤러리 */}
      <section className="max-w-[1400px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="group relative">
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <div className="p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-white text-lg font-medium">
                      {artwork.title}
                    </h3>
                    {artwork.description && (
                      <p className="text-white/70 text-sm mt-1">
                        {artwork.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className={modernArtTheme.footerClass}>
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} {site.name}</p>
          <p className="text-[10px]">
            Powered by 모노페이지
          </p>
        </div>
      </footer>
    </div>
  );
}
