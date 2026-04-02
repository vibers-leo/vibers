"use client";

import React, { useEffect, useState } from 'react';
import { Palette, Layout, Type, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminDesign } from '@/lib/admin/api';

export default function DesignPage() {
  const { currentProject } = useProject();
  const [design, setDesign] = useState<AdminDesign>({ primaryColor: '#0673E2', fontFamily: 'Pretendard' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchDesign = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchDesignData();
        setDesign(data);
      } catch (error) {
        console.error("Failed to fetch design data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [currentProject]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
      const success = await adapter.updateDesignData(design);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update design:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--admin-accent)] animate-spin" />
        <p className="text-[var(--admin-text-muted)]">디자인 설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 디자인 설정
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">브랜드 아이덴티티와 사이트 레이아웃을 설정합니다.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-4 h-4" /> 저장 완료
            </div>
          )}
          <button 
            form="design-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--admin-accent-hover)] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            설정 저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6 flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-500" /> 브랜드 컬러 및 로고
          </h3>
          <form id="design-form" onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-text)]">대표 색상 (Primary Color)</label>
              <div className="flex gap-3">
                <input 
                  type="color" 
                  value={design.primaryColor}
                  onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                  className="w-12 h-10 p-1 rounded border border-[var(--admin-border)] bg-[var(--admin-bg)]"
                />
                <input 
                  type="text" 
                  value={design.primaryColor}
                  onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--admin-accent)]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-text)]">기본 폰트 (Font Family)</label>
              <select 
                value={design.fontFamily}
                onChange={(e) => setDesign({ ...design, fontFamily: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--admin-accent)]"
              >
                <option value="Pretendard">Pretendard (권장)</option>
                <option value="Noto Sans KR">Noto Sans KR</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
          </form>
        </div>

        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6 flex items-center gap-2">
            <Type className="w-5 h-5 text-amber-500" /> 실시간 미리보기
          </h3>
          <div className="border border-[var(--admin-border)] rounded-xl p-8 bg-slate-50 flex flex-col items-center justify-center gap-4 min-h-[200px]">
            <div 
              className="w-32 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg"
              style={{ backgroundColor: design.primaryColor, fontFamily: design.fontFamily }}
            >
              Primary Button
            </div>
            <p className="text-slate-500 text-xs" style={{ fontFamily: design.fontFamily }}>
              이 폰트와 컬러가 웹사이트에 적용됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
