"use client";

import React, { useEffect, useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminBanner } from '@/lib/admin/api';
import { Plus, Image as ImageIcon, Link as LinkIcon, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function BannerManagementPage() {
  const { currentProject } = useProject();
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchBanners();
        setBanners(data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentProject]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">배너 관리</h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">
            홈페이지 메인 및 섹션별 배너 이미지를 관리합니다.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--admin-accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" />
          신규 배너 추가
        </button>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-2 w-2 rounded-full bg-[var(--admin-accent)]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">메인 상단 슬라이드</h2>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--admin-accent)]" /></div>
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-[16/9] w-full relative">
                  <img src={banner.imageUrl} alt="banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-100"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">ID: {banner.id}</span>
                    {banner.status === 'active' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><Eye className="w-3 h-3" /> 노출</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><EyeOff className="w-3 h-3" /> 비노출</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                    <LinkIcon className="w-3 h-3 flex-shrink-0" />
                    {banner.link}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-xl">
            <ImageIcon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">등록된 메인 배너가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
