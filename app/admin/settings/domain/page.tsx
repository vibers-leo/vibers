"use client";

import React, { useEffect, useState } from 'react';
import { Globe, Link2, Plus, Save, Loader2, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject } from '@/lib/admin/api';

export default function DomainPage() {
  const { currentProject } = useProject();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [currentProject]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
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
        <p className="text-[var(--admin-text-muted)]">도메인 설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 도메인 설정
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">접속 주소(도메인) 및 보안 접속(SSL) 설정을 관리합니다.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[var(--admin-text)] flex items-center gap-2">
                <Link2 className="w-5 h-5 text-blue-500" /> 연결된 도메인
              </h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-200 transition-colors">
                <Plus className="w-3.5 h-3.5" /> 도메인 추가
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      {currentProject.domain || 'vibers.co.kr'}
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded">대표</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Status: Active • Connected via Vercel Edge</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" /> SSL 정상
                  </span>
                  <a href={`https://${currentProject.domain}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 flex items-center justify-center py-8">
                <p className="text-sm text-slate-400">보조 도메인이나 서브 도메인을 연결하여 브랜딩을 강화하세요.</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6">사이트맵 및 로봇 설정</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">자동 사이트맵(sitemap.xml) 생성</p>
                  <p className="text-xs text-slate-500">페이지 업데이트 시 자동으로 검색 엔진에 전달합니다.</p>
                </div>
                <div className="w-10 h-6 bg-blue-600 rounded-full relative flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">검색 엔진 수집 허용 (robots.txt)</p>
                  <p className="text-xs text-slate-500">Google, Naver 등 주요 검색 엔진의 방문을 허용합니다.</p>
                </div>
                <div className="w-10 h-6 bg-blue-600 rounded-full relative flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-20 h-20" />
            </div>
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 보안 연결(SSL) 안내
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Vibers 통합 어드민에 연결된 모든 도메인은 Let's Encrypt를 통해 무료로 SSL 인증서가 발급 및 자동 갱신됩니다.
            </p>
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono">CERT-VIBERS-EXP-2026-06-25</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Safe & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
