"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Users, ShoppingCart, Settings, Palette, LineChart, Server,
  ChevronDown, ChevronRight, Menu, Globe, ChevronLeft, Newspaper,
  ExternalLink
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { PROJECT_MENUS } from "@/lib/admin/project-menus";

interface SubMenuItem {
  label: string;
  href: string;
  externalUrl?: string;
}

interface MenuCategory {
  title: string;
  icon: React.ReactNode;
  href?: string;
  externalUrl?: string;
  subItems?: SubMenuItem[];
}

const globalMenus: MenuCategory[] = [
  { title: "대시보드", href: "/admin", icon: <Home className="w-[18px] h-[18px]" /> },
  {
    title: "사용자",
    icon: <Users className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "사용자 관리", href: "/admin/members" },
      { label: "사용자 그룹", href: "/admin/members/groups" },
      { label: "가입 설정", href: "/admin/members/signup" },
    ],
  },
  {
    title: "콘텐츠",
    icon: <ShoppingCart className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "콘텐츠 관리", href: "/admin/content" },
      { label: "소식 목록", href: "/admin/news" },
      { label: "새 소식 작성", href: "/admin/news/new" },
    ],
  },
  {
    title: "디자인",
    icon: <Palette className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "디자인 모드", href: "/admin/design" },
      { label: "팝업/배너", href: "/admin/marketing/popups" },
    ],
  },
  {
    title: "마케팅",
    icon: <LineChart className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "방문자 통계", href: "/admin/stats" },
      { label: "SEO 설정", href: "/admin/seo" },
    ],
  },
  {
    title: "배포/운영",
    icon: <Server className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "전체 프로젝트", href: "/admin/projects" },
      { label: "배포 현황", href: "/admin/deploy" },
      { label: "오류 모니터링", href: "/admin/deploy/errors" },
      { label: "앱 빌드 (Expo)", href: "/admin/projects/builds" },
    ],
  },
  {
    title: "환경설정",
    icon: <Settings className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "기본 설정", href: "/admin/settings" },
      { label: "언어 설정", href: "/admin/settings/language" },
      { label: "통화 설정", href: "/admin/settings/currency" },
      { label: "도메인/사이트맵", href: "/admin/settings/domain" },
      { label: "약관/정책", href: "/admin/settings/legal" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { currentProject } = useProject();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isGlobal = currentProject.slug === "total";
  const projectConfig = !isGlobal ? PROJECT_MENUS[currentProject.slug] : null;
  const accentColor = projectConfig?.color ?? "var(--admin-accent)";

  // 프로젝트별 메뉴를 globalMenus 형식으로 변환
  const activeMenus: MenuCategory[] = useMemo(() => {
    if (isGlobal) return globalMenus;
    if (!projectConfig) return globalMenus;

    return projectConfig.menus.map((item) => ({
      title: item.label,
      href: item.externalUrl ? undefined : item.href,
      externalUrl: item.externalUrl,
      icon: <item.icon className="w-[18px] h-[18px]" />,
      subItems: item.subItems?.map((s) => ({
        label: s.label,
        href: s.externalUrl
          ? `/admin/embed?src=${encodeURIComponent(s.externalUrl)}&title=${encodeURIComponent(s.label)}&project=${currentProject.slug}`
          : s.href,
      })),
    }));
  }, [isGlobal, projectConfig, currentProject.slug]);

  useEffect(() => {
    activeMenus.forEach((menu) => {
      if (menu.subItems?.some((s) => pathname.startsWith(s.href))) {
        setOpenGroups((prev) => ({ ...prev, [menu.title]: true }));
      }
    });
  }, [pathname, activeMenus]);

  // 프로젝트 전환 시 그룹 초기화
  useEffect(() => {
    setOpenGroups({});
  }, [currentProject.slug]);

  const toggleGroup = (title: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenGroups({ [title]: true });
    } else {
      setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    }
  };

  const handleMenuClick = (menu: MenuCategory) => {
    if (menu.externalUrl) {
      const embedUrl = `/admin/embed?src=${encodeURIComponent(menu.externalUrl)}&title=${encodeURIComponent(menu.title)}&project=${currentProject.slug}`;
      router.push(embedUrl);
    } else if (menu.href) {
      router.push(menu.href);
    } else {
      toggleGroup(menu.title);
    }
  };

  return (
    <aside
      className={`h-screen shrink-0 bg-[var(--admin-sidebar)] border-r border-[var(--admin-border)] flex flex-col font-[Pretendard] transition-all duration-300 ease-in-out relative z-20 shadow-[1px_0_5px_rgba(0,0,0,0.02)]
        ${isCollapsed ? "w-[72px]" : "w-[240px]"}`}
    >
      {/* 로고 + 토글 */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--admin-border)] shrink-0 overflow-hidden">
        {!isCollapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl font-bold tracking-tight text-[var(--admin-text)] whitespace-nowrap">
              VIBERS<span style={{ color: accentColor }}>.</span>
            </span>
            {!isGlobal && projectConfig && (
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded-full text-white whitespace-nowrap truncate max-w-[90px]"
                style={{ backgroundColor: accentColor }}
              >
                {currentProject.name}
              </span>
            )}
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:bg-[var(--admin-bg)] hover:text-[var(--admin-text)] transition-colors shrink-0 ${isCollapsed ? "mx-auto" : ""}`}
          title="사이드바 접기/펴기"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-gray-200">
        {activeMenus.map((menu, idx) => {
          const hasSubItems = !!menu.subItems?.length;
          const isDirectActive = menu.href && pathname === menu.href;
          const hasActiveSub = menu.subItems?.some((s) => pathname.startsWith(s.href)) || false;
          const isOpen = openGroups[menu.title];
          const isExternal = !!menu.externalUrl && !hasSubItems;

          if (!hasSubItems) {
            return (
              <button
                key={idx}
                onClick={() => handleMenuClick(menu)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors whitespace-nowrap w-full text-left
                  ${isDirectActive
                    ? "bg-[#F3F8FF] font-semibold"
                    : "text-[#212121] hover:bg-[#FAFAFA]"
                  }`}
                style={isDirectActive ? { color: accentColor } : undefined}
                title={isCollapsed ? menu.title : undefined}
              >
                <span style={isDirectActive ? { color: accentColor } : { color: "#666666" }}>
                  {menu.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{menu.title}</span>
                    {isExternal && <ExternalLink className="w-3 h-3 text-[#aaa]" />}
                  </>
                )}
              </button>
            );
          }

          return (
            <div key={idx} className="flex flex-col">
              <button
                onClick={() => toggleGroup(menu.title)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] transition-colors whitespace-nowrap
                  ${hasActiveSub && !isOpen ? "bg-[#F3F8FF] font-semibold" : "text-[#212121] hover:bg-[#FAFAFA]"}`}
                style={hasActiveSub && !isOpen ? { color: accentColor } : undefined}
                title={isCollapsed ? menu.title : undefined}
              >
                <div className="flex items-center gap-3">
                  <span style={hasActiveSub && !isOpen ? { color: accentColor } : { color: "#666666" }}>
                    {menu.icon}
                  </span>
                  {!isCollapsed && <span>{menu.title}</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[#999999]">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                )}
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && isOpen && menu.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 mt-1 mb-2 ml-[36px]">
                      {menu.subItems.map((sub, sIdx) => {
                        const isSubActive = pathname.startsWith(sub.href);
                        return (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            className={`px-3 py-2 rounded-md text-[13px] transition-colors
                              ${isSubActive ? "font-bold bg-[#F3F8FF]" : "text-[#666666] hover:text-[#212121] hover:bg-[#FAFAFA]"}`}
                            style={isSubActive ? { color: accentColor } : undefined}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 하단: 현재 프로젝트 색상 표시 */}
      {!isCollapsed && !isGlobal && projectConfig && (
        <div className="px-4 py-3 border-t border-[var(--admin-border)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-[11px] text-[var(--admin-text-muted)]">{currentProject.name} 컨텍스트</span>
          </div>
        </div>
      )}
    </aside>
  );
}
