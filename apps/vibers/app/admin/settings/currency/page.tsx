"use client";

import React, { useEffect, useState } from 'react';
import { CreditCard, Plus, Save, Loader2, CheckCircle2, Trash2, TrendingUp } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminCurrency } from '@/lib/admin/api';

export default function CurrencyPage() {
  const { currentProject } = useProject();
  const [currencies, setCurrencies] = useState<AdminCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
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
        <p className="text-[var(--admin-text-muted)]">통화 설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 통화 설정
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">결제 시 사용될 통화 및 환율 정보를 관리합니다.</p>
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
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[var(--admin-border)] flex justify-between items-center">
              <h3 className="font-semibold text-[var(--admin-text)]">사용 중인 통화 목록</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-200 transition-colors">
                <Plus className="w-3.5 h-3.5" /> 통화 추가
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[var(--admin-text-muted)] border-b border-[var(--admin-border)]">
                    <th className="px-6 py-3 font-medium">통화명</th>
                    <th className="px-6 py-3 font-medium text-center">기호</th>
                    <th className="px-6 py-3 font-medium">코드</th>
                    <th className="px-6 py-3 font-medium">환율 (1:{currencies.find(c => c.isDefault)?.code})</th>
                    <th className="px-6 py-3 font-medium text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--admin-border)]">
                  {currencies.map((curr) => (
                    <tr key={curr.code} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-[var(--admin-text)]">
                        {curr.name} {curr.isDefault && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">기준</span>}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">{curr.symbol}</td>
                      <td className="px-6 py-4 text-[var(--admin-text-muted)] font-mono">{curr.code}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <input 
                            type="number" 
                            defaultValue={curr.exchangeRate} 
                            disabled={curr.isDefault}
                            className="w-24 px-2 py-1 bg-white border border-[var(--admin-border)] rounded text-right text-xs"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" disabled={curr.isDefault}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50/50 rounded-xl border border-amber-100 p-6 flex gap-4 items-start">
            <div className="p-2 bg-white rounded-lg border border-amber-100 shadow-sm shrink-0">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">실시간 환율 동기화</h4>
              <p className="text-xs text-amber-800/80 leading-relaxed">
                Vibers 통합 어드민은 외부 API를 통해 1시간마다 자동으로 환율 데이터를 갱신합니다.<br/>
                수동으로 입력한 경우 자동 동기화 기능이 일시 중지됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
