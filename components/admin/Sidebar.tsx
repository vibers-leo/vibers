"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Users, ShoppingCart, Settings, Palette, LineChart, Server,
  ChevronDown, ChevronRight, Menu, Globe, Shield, CreditCard, ChevronLeft, Newspaper
} from "lucide-react";

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuCategory {
  title: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: SubMenuItem[];
}

const imwebMenus: MenuCategory[] = [
  {
    title: "대시보드",
    href: "/admin",
    icon: <Home className="w-[18px] h-[18px]" />
  },
  {
    title: "사용자",
    icon: <Users className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "사용자 관리", href: "/admin/members" },
      { label: "사용자 그룹 관리", href: "/admin/members/groups" },
      { label: "가입 설정", href: "/admin/members/signup" }
    ]
  },
  {
    title: "쇼핑",
    icon: <ShoppingCart className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "콘텐츠 관리", href: "/admin/content" },
      { label: "배포/수수료 전략", href: "/admin/projects/strategy" },
      { label: "앱 빌드 관리 (Expo)", href: "/admin/projects/builds" },
      { label: "취소/반품/교환 관리", href: "/admin/orders/claims" }
    ]
  },
  {
    title: "디자인",
    icon: <Palette className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "디자인 모드", href: "/admin/design" },
      { label: "팝업/배너 관리", href: "/admin/marketing/popups" }
    ]
  },
  {
    title: "소식 관리",
    icon: <Newspaper className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "소식 목록", href: "/admin/news" },
      { label: "새 소식 작성", href: "/admin/news/new" },
    ]
  },
  {
    title: "마케팅",
    icon: <LineChart className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "방문자 통계", href: "/admin/stats" },
      { label: "SEO, 헤더설정", href: "/admin/seo" }
    ]
  },
  {
    title: "Vibers 배포/운영",
    icon: <Server className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "전체 프로젝트 현황", href: "/admin/projects" },
      { label: "배포 현황", href: "/admin/deploy" },
      { label: "오류 모니터링", href: "/admin/deploy/errors" }
    ]
  },
  {
    title: "환경설정",
    icon: <Settings className="w-[18px] h-[18px]" />,
    subItems: [
      { label: "기본 설정", href: "/admin/settings" },
      { label: "언어 설정", href: "/admin/settings/language" },
      { label: "통화 설정", href: "/admin/settings/currency" },
      { label: "도메인/사이트맵", href: "/admin/settings/domain" },
      { label: "약관/정책 설정", href: "/admin/settings/legal" },
      { label: "요금제 확인/결제", href: "/admin/settings/billing" },
      { label: "관리자 설정", href: "/admin/settings/admins" }
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // 초기 로딩 시 현재 활성화된 메뉴 그룹 열어두기
  useEffect(() => {
    imwebMenus.forEach((menu) => {
      if (menu.subItems && menu.subItems.some(sub => pathname.startsWith(sub.href))) {
        setOpenGroups(prev => ({ ...prev, [menu.title]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (title: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenGroups({ [title]: true }); // 축소 상태에서 누르면 열어주며 확장됨
    } else {
      setOpenGroups(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    }
  };

  return (
    <aside 
      className={`h-screen shrink-0 bg-[var(--admin-sidebar)] border-r border-[var(--admin-border)] flex flex-col font-[Pretendard] transition-all duration-300 ease-in-out relative z-20 shadow-[1px_0_5px_rgba(0,0,0,0.02)]
        ${isCollapsed ? "w-[72px]" : "w-[240px]"}`}
    >
      {/* 윗부분: 로고 및 토글 */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--admin-border)] shrink-0 overflow-hidden">
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight text-[var(--admin-text)] whitespace-nowrap">
            VIBERS<span className="text-[var(--admin-accent)]">.</span>
          </span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:bg-[var(--admin-bg)] hover:text-[var(--admin-text)] transition-colors ${isCollapsed ? "mx-auto" : ""}`}
          title="사이드바 접기/펴기"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      {/* 메뉴 리스트 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-gray-200">
        {imwebMenus.map((menu, idx) => {
          const isDirectActive = menu.href === pathname;
          const hasActiveSub = menu.subItems?.some(s => pathname === s.href) || false;
          const isOpen = openGroups[menu.title];
          
          return (
            <div key={idx} className="flex flex-col">
              {menu.href && !menu.subItems ? (
                <Link
                  href={menu.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors whitespace-nowrap
                    ${isDirectActive 
                        ? "bg-[#F3F8FF] text-[#0673E2] font-semibold" 
                        : "text-[#212121] hover:bg-[#FAFAFA]"
                    }
                  `}
                  title={isCollapsed ? menu.title : undefined}
                >
                  <span className={`${isDirectActive ? "text-[#0673E2]" : "text-[#666666]"}`}>
                    {menu.icon}
                  </span>
                  {!isCollapsed && <span>{menu.title}</span>}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleGroup(menu.title)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] transition-colors whitespace-nowrap
                      ${hasActiveSub && !isOpen
                          ? "bg-[#F3F8FF] text-[#0673E2] font-semibold" 
                          : "text-[#212121] hover:bg-[#FAFAFA]"
                      }
                    `}
                    title={isCollapsed ? menu.title : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${hasActiveSub && !isOpen ? "text-[#0673E2]" : "text-[#666666]"}`}>
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
                  
                  {/* 서브메뉴 (아코디언) */}
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
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sIdx}
                                href={sub.href}
                                className={`px-3 py-2 rounded-md text-[13px] transition-colors
                                  ${isSubActive 
                                    ? "text-[#0673E2] font-bold bg-[#F3F8FF]" 
                                    : "text-[#666666] hover:text-[#212121] hover:bg-[#FAFAFA]"
                                  }
                                `}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
