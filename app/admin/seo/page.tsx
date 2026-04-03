"use client";

import React, { useEffect, useState } from 'react';
import { Search, Save, Globe, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminSeo } from '@/lib/admin/api';

export default function SeoPage() {
  const { currentProject } = useProject();
  const [seo, setSeo] = useState<AdminSeo>({ title: '', description: '', keywords: '' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSeo = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchSeoData();
        setSeo(data);
      } catch (error) {
        console.error("Failed to fetch SEO data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeo();
  }, [currentProject]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
      const success = await adapter.updateSeoData(seo);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update SEO:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--admin-accent)] animate-spin" />
        <p className="text-[var(--admin-text-muted)]">SEO 설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} SEO/검색 설정
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">검색 엔진 최적화를 위한 메타데이터를 관리합니다.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-4 h-4" /> 저장 완료
            </div>
          )}
          <button 
            form="seo-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--admin-accent-hover)] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            설정 저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" /> 기본 메타 정보
            </h3>
            <form id="seo-form" onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--admin-text)]">사이트 제목 (Title Tag)</label>
                <input 
                  type="text" 
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  placeholder="예: Vibers - 올인원 비즈니스 솔루션"
                  className="w-full px-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--admin-text)]">사이트 설명 (Meta Description)</label>
                <textarea 
                  rows={4}
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  placeholder="검색 결과에 표시될 사이트 설명을 입력하세요."
                  className="w-full px-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--admin-text)]">핵심 키워드 (Keywords)</label>
                <input 
                  type="text" 
                  value={seo.keywords || ''}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  placeholder="쉼표(,)로 구분하여 입력하세요."
                  className="w-full px-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6">
            <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" /> SEO 최적화 가이드
            </h4>
            <ul className="space-y-3 text-xs text-blue-700/80 leading-relaxed">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0"></div>
                제목은 60자 내외, 설명은 160자 내외가 권장됩니다.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0"></div>
                주요 키워드는 앞부분에 배치하는 것이 유리합니다.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0"></div>
                Vibers 통합 어드민은 사이트맵을 자동으로 생성합니다.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
