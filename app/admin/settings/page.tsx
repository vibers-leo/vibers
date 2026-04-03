"use client";

import React, { useEffect, useState } from 'react';
import { Settings, Globe, DollarSign, Shield, Save, Loader2, CheckCircle2, Languages, CreditCard } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { 
  getAdapterForProject, 
  AdminLanguage, 
  AdminCurrency, 
  AdminLegal 
} from '@/lib/admin/api';

export default function SettingsPage() {
  const { currentProject } = useProject();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [currencies, setCurrencies] = useState<AdminCurrency[]>([]);
  const [legal, setLegal] = useState<AdminLegal>({ termsOfService: '', privacyPolicy: '', updatedAt: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const [langData, currData, legalData] = await Promise.all([
          adapter.fetchLanguages(),
          adapter.fetchCurrencies(),
          adapter.fetchLegalData()
        ]);
        setLanguages(langData);
        setCurrencies(currData);
        setLegal(legalData);
      } catch (error) {
        console.error("Failed to fetch settings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentProject]);

  const handleSaveLegal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
      const success = await adapter.updateLegalData(legal);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update legal settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--admin-accent)] animate-spin" />
        <p className="text-[var(--admin-text-muted)]">기본 설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 기본 설정
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">언어, 통화 및 정책 등 웹사이트의 전역 설정을 관리합니다.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-4 h-4" /> 저장 완료
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Languages & Currencies */}
        <div className="space-y-6">
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6 flex items-center gap-2">
              <Languages className="w-5 h-5 text-blue-500" /> 기본 언어 설정
            </h3>
            <div className="space-y-4">
              {languages.map((lang) => (
                <div key={lang.code} className="flex items-center justify-between p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--admin-text)]">{lang.name} ({lang.code.toUpperCase()})</p>
                      {lang.isDefault && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">기본 언어</span>}
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${lang.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {lang.status === 'active' ? '활성화됨' : '비활성'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" /> 결제 및 통화 설정
            </h3>
            <div className="space-y-4">
              {currencies.map((curr) => (
                <div key={curr.code} className="flex items-center justify-between p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                      {curr.symbol}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--admin-text)]">{curr.name} ({curr.code})</p>
                      <p className="text-[10px] text-[var(--admin-text-muted)] font-medium">환율: 1 {curr.isDefault ? curr.code : 'Default'} = {curr.exchangeRate} {curr.code}</p>
                    </div>
                  </div>
                  {curr.isDefault && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-bold">기본 통화</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Policies */}
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-[var(--admin-text)] flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-500" /> 정책 및 약관 설정
            </h3>
            <button 
              onClick={handleSaveLegal}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1.5 bg-[var(--admin-accent)] text-white rounded-lg text-xs font-medium hover:bg-[var(--admin-accent-hover)] transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              저장하기
            </button>
          </div>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-text)]">이용약관 (Terms of Service)</label>
              <textarea 
                rows={6}
                value={legal.termsOfService}
                onChange={(e) => setLegal({ ...legal, termsOfService: e.target.value })}
                placeholder="이용약관 내용을 입력하세요."
                className="w-full px-4 py-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-text)]">개인정보처리방침 (Privacy Policy)</label>
              <textarea 
                rows={6}
                value={legal.privacyPolicy}
                onChange={(e) => setLegal({ ...legal, privacyPolicy: e.target.value })}
                placeholder="개인정보처리방침 내용을 입력하세요."
                className="w-full px-4 py-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors resize-none"
              />
            </div>

            <div className="pt-4 border-t border-[var(--admin-border)]">
              <p className="text-[10px] text-[var(--admin-text-muted)] italic font-medium">최종 수정일: {legal.updatedAt || '-'}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
