"use client";

// src/components/LinkButtons.tsx
// 바이오 프로필 링크 버튼 그리드
import { useEffect, useState } from "react";
import {
  Instagram,
  Youtube,
  Globe,
  Mail,
  ShoppingBag,
  Music,
  Twitter,
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";

interface ProfileLink {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  sort_order: number;
}

interface LinkButtonsProps {
  slug: string;
  links?: ProfileLink[];
}

// 아이콘명 → 컴포넌트 매핑
const iconMap: Record<string, React.ElementType> = {
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
  mail: Mail,
  shop: ShoppingBag,
  music: Music,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
};

function getIcon(iconName: string | null) {
  if (!iconName) return ExternalLink;
  return iconMap[iconName.toLowerCase()] || ExternalLink;
}

export default function LinkButtons({ slug, links: propLinks }: LinkButtonsProps) {
  const [links, setLinks] = useState<ProfileLink[]>(propLinks || []);
  const [loading, setLoading] = useState(!propLinks);

  useEffect(() => {
    if (propLinks) return;
    async function fetchLinks() {
      try {
        const res = await fetch(`/api/links?slug=${slug}`);
        const data = await res.json();
        if (data.success) setLinks(data.data);
      } catch (e) {
        console.warn("링크 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, [slug, propLinks]);

  if (loading) {
    return (
      <div className="space-y-3 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (links.length === 0) return null;

  return (
    <div className="space-y-3 py-4">
      {links.map((link) => {
        const Icon = getIcon(link.icon);
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 w-full px-5 py-4 bg-white border border-gray-100
              rounded-xl ring-1 ring-black/5 hover:ring-emerald-200 hover:border-emerald-100
              hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300
              active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
              <Icon size={16} className="text-gray-500 group-hover:text-emerald-600 transition-colors" />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {link.title}
            </span>
            <ExternalLink
              size={14}
              className="text-gray-300 group-hover:text-emerald-400 transition-colors
                group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        );
      })}
    </div>
  );
}
