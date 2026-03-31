"use client";

import { useAdminSite } from "@/lib/admin-site-context";
import { getTemplateConfig } from "@/lib/templates";

export default function SiteSelector() {
  const { currentSite, setCurrentSite, allSites } = useAdminSite();

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 font-medium">사이트:</label>
      <select
        value={currentSite}
        onChange={(e) => setCurrentSite(e.target.value)}
        className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-medium"
      >
        {allSites.map((slug) => {
          const config = getTemplateConfig(slug);
          return (
            <option key={slug} value={slug}>
              {config?.name || slug}
            </option>
          );
        })}
      </select>
    </div>
  );
}
