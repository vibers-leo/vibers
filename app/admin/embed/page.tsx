"use client";

import { useSearchParams } from "next/navigation";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { PROJECT_MENUS } from "@/lib/admin/project-menus";
import { Suspense } from "react";

function EmbedContent() {
  const params = useSearchParams();
  const src = params.get("src") ?? "";
  const title = params.get("title") ?? "외부 페이지";
  const projectId = params.get("project") ?? "";
  const projectConfig = projectId ? PROJECT_MENUS[projectId] : null;
  const accentColor = projectConfig?.color ?? "#6366f1";

  if (!src) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--admin-text-muted)]">
        <AlertTriangle className="w-5 h-5 mr-2" /> URL이 지정되지 않았습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-6">
      {/* 툴바 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--admin-border)] bg-[var(--admin-card)] shrink-0">
        <div className="flex items-center gap-3">
          {projectConfig && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: accentColor }}
            />
          )}
          <span className="text-sm font-bold text-[var(--admin-text)]">{title}</span>
          <span className="text-[11px] text-[var(--admin-text-muted)] bg-[var(--admin-bg)] border border-[var(--admin-border)] px-2 py-0.5 rounded">
            외부 앱 어드민
          </span>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          새 탭으로 열기
        </a>
      </div>

      {/* iframe */}
      <iframe
        src={src}
        className="flex-1 w-full border-none"
        title={title}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

export default function AdminEmbedPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-sm text-[var(--admin-text-muted)]">로딩 중...</div>}>
      <EmbedContent />
    </Suspense>
  );
}
