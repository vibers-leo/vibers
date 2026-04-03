"use client";

import React, { useEffect, useState } from 'react';
import { Shield, FileText, Save, Loader2, CheckCircle2, RotateCcw, Info } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminLegal } from '@/lib/admin/api';
import { getEntityInfoBySlug, EntityInfo } from '@/lib/admin/legal';

export default function LegalSettingsPage() {
  const { currentProject } = useProject();
  const [legalData, setLegalData] = useState<AdminLegal>({ termsOfService: '', privacyPolicy: '', updatedAt: '' });
  const [entityInfo, setEntityInfo] = useState<EntityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const [legal, entity] = await Promise.all([
          adapter.fetchLegalData(),
          getEntityInfoBySlug(currentProject.slug)
        ]);
        
        setLegalData(legal);
        setEntityInfo(entity);
      } catch (error) {
        console.error("Failed to fetch legal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentProject]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
      const success = await adapter.updateLegalData(legalData);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateFromTemplate = (type: 'tos' | 'privacy') => {
    if (!entityInfo) return;
    
    const company = entityInfo.companyName;
    const ceo = entityInfo.representative;
    
    if (type === 'tos') {
      const template = `제1조(목적)\n본 약관은 ${company}(이하 "회사"라 함)가 운영하는 ${currentProject.name} 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.\n\n제2조(정의)\n1. "서비스"란 회사가 제공하는 플랫폼을 의미합니다.\n2. "이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.\n\n... (대표자: ${ceo})`;
      setLegalData({ ...legalData, termsOfService: template });
    } else {
      const template = `<${currentProject.name} 개인정보처리방침>\n\n${company}('이하 회사')는 이용자의 개인정보를 보호하고 관련 고충을 신속하게 처리할 수 있도록 다음과 같은 처리방침을 둡니다.\n\n1. 개인정보 처리 목적: 서비스 제공 및 관리\n2. 개인정보 보호책임자: ${ceo}\n\n본 방침은 2026년 3월 29일부터 시행됩니다.`;
      setLegalData({ ...legalData, privacyPolicy: template });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--admin-accent)] animate-spin" />
        <p className="text-[var(--admin-text-muted)]">약관 및 정책 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 약관 및 정책 설정
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">이용약관 및 개인정보처리방침을 관리하고 entity.md 정보를 반영합니다.</p>
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
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            정책 업데이트
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 이용약관 */}
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--admin-text)] flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" /> 이용약관 (Terms of Service)
              </h3>
              <button 
                onClick={() => generateFromTemplate('tos')}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
              >
                <RotateCcw className="w-3 h-3" /> entity.md 기반 자동 생성
              </button>
            </div>
            <textarea 
              value={legalData.termsOfService}
              onChange={(e) => setLegalData({ ...legalData, termsOfService: e.target.value })}
              className="w-full h-[300px] p-4 bg-slate-50 border border-[var(--admin-border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="이용약관 내용을 입력하세요."
            />
          </div>

          {/* 개인정보처리방침 */}
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--admin-text)] flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" /> 개인정보처리방침 (Privacy Policy)
              </h3>
              <button 
                onClick={() => generateFromTemplate('privacy')}
                className="flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium"
              >
                <RotateCcw className="w-3 h-3" /> entity.md 기반 자동 생성
              </button>
            </div>
            <textarea 
              value={legalData.privacyPolicy}
              onChange={(e) => setLegalData({ ...legalData, privacyPolicy: e.target.value })}
              className="w-full h-[300px] p-4 bg-slate-50 border border-[var(--admin-border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="개인정보처리방침 내용을 입력하세요."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
            <h3 className="font-bold text-[var(--admin-text)] mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500" /> 운영 주체 정보 (entity.md)
            </h3>
            {entityInfo ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">상호</p>
                  <p className="text-sm font-medium text-slate-800">{entityInfo.companyName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">대표자</p>
                  <p className="text-sm font-medium text-slate-800">{entityInfo.representative}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">사업자번호</p>
                  <p className="text-sm font-medium text-slate-800">{entityInfo.businessNumber}</p>
                </div>
                <p className="text-[11px] text-amber-600 leading-tight">
                  ℹ️ 위 정보는 루트 디렉토리의 entity.md에서 실시간으로 읽어옵니다. 정보 수정이 필요한 경우 해당 파일을 직접 수정하세요.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs text-red-600">entity.md에서 이 프로젝트({currentProject.slug})의 정보를 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
