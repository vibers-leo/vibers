"use client";

import React, { useEffect, useState } from 'react';
import { Globe, Plus, Save, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminLanguage } from '@/lib/admin/api';

export default function LanguagePage() {
  const { currentProject } = useProject();
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchLangs = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchLanguages();
        setLanguages(data);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLangs();
  }, [currentProject]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Mock save logic
      await new Promise(resolve => setTimeout(resolve, 800));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--admin-accent)] animate-spin" />
        <p className="text-[var(--admin-text-muted)]">언어 설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 언어 설정
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">사이트에 적용될 다국어 및 기본 언어를 관리합니다.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-4 h-4" /> 저장 완료
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--admin-accent-hover)] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            설정 저장
          </button>
        </div>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--admin-border)] flex justify-between items-center">
          <h3 className="font-semibold text-[var(--admin-text)]">사용 중인 언어 목록</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-200 transition-colors">
            <Plus className="w-3.5 h-3.5" /> 언어 추가
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[var(--admin-text-muted)] border-b border-[var(--admin-border)]">
                <th className="px-6 py-3 font-medium">언어명</th>
                <th className="px-6 py-3 font-medium">언어 코드</th>
                <th className="px-6 py-3 font-medium">기본 언어</th>
                <th className="px-6 py-3 font-medium">상태</th>
                <th className="px-6 py-3 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {languages.map((lang) => (
                <tr key={lang.code} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--admin-text)]">{lang.name}</td>
                  <td className="px-6 py-4 text-[var(--admin-text-muted)] font-mono">{lang.code}</td>
                  <td className="px-6 py-4">
                    {lang.isDefault ? (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-full">대표</span>
                    ) : (
                      <button className="text-[11px] text-slate-400 hover:text-blue-600 hover:underline">기본값 설정</button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      lang.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {lang.status === 'active' ? '노출 중' : '숨김'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" disabled={lang.isDefault}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6 flex gap-4 items-start">
        <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm shrink-0">
          <Globe className="w-5 h-5 text-blue-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-900">다국어 브라우저 감지 기능</h4>
          <p className="text-xs text-blue-700/80 leading-relaxed">
            방문자의 브라우저 언어 설정을 감지하여 자동으로 해당 언어 사이트로 리다이렉트하거나 권장 언어 팝업을 띄울 수 있습니다.<br/>
            이 설정은 현재 테스트 모드이며 실제 적용을 위해서는 도메인별 매핑이 필요합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
