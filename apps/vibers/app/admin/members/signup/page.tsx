"use client";

import React, { useEffect, useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminSignupSetting, SignupField } from '@/lib/admin/api';
import { 
  UserPlus, Save, CheckCircle2, AlertCircle, 
  Settings2, Smartphone, Mail, Key, ShieldCheck, 
  ToggleLeft, ToggleRight, Loader2, GripVertical
} from 'lucide-react';

export default function SignupSettingsPage() {
  const { currentProject } = useProject();
  const [settings, setSettings] = useState<AdminSignupSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchSignupSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch signup settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentProject]);

  const handleToggleField = (fieldId: string, property: 'enabled' | 'required') => {
    if (!settings) return;
    const newFields = settings.fields.map(f => 
      f.id === fieldId ? { ...f, [property]: !f[property] } : f
    );
    setSettings({ ...settings, fields: newFields });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
      await adapter.updateSignupSettings(settings);
      alert("가입 설정이 저장되었습니다.");
    } catch (error) {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--admin-accent)]" />
        <p className="text-slate-500 font-medium">가입 설정을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[var(--admin-border)] shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">가입 설정</h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">
            {currentProject.name} 서비스 회원가입 프로세스를 설정합니다.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-200"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          설정 저장하기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 가입 항목 설정 */}
          <div className="bg-white rounded-2xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-slate-500" />
                가입 시 입력 항목 (Fields)
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DRAG TO REORDER</span>
            </div>
            <div className="divide-y divide-slate-50">
              {settings?.fields.map((field) => (
                <div key={field.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{field.label}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{field.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">필수</span>
                      <button 
                        onClick={() => handleToggleField(field.id, 'required')}
                        className={`transition-colors ${field.required ? 'text-emerald-500' : 'text-slate-300'}`}
                      >
                        {field.required ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">사용</span>
                      <button 
                        onClick={() => handleToggleField(field.id, 'enabled')}
                        className={`transition-colors ${field.enabled ? 'text-[var(--admin-accent)]' : 'text-slate-300'}`}
                      >
                        {field.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 부가 설정 */}
          <div className="bg-white p-6 rounded-2xl border border-[var(--admin-border)] shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">가입 정책 (Policies)</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  소셜 로그인 사용
                </div>
                <button 
                  onClick={() => setSettings(s => s ? { ...s, useSocialLogin: !s.useSocialLogin } : null)}
                  className={`transition-colors ${settings?.useSocialLogin ? 'text-emerald-500' : 'text-slate-300'}`}
                >
                  {settings?.useSocialLogin ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  관리자 가입 승인
                </div>
                <button 
                  onClick={() => setSettings(s => s ? { ...s, useApproval: !s.useApproval } : null)}
                  className={`transition-colors ${settings?.useApproval ? 'text-emerald-500' : 'text-slate-300'}`}
                >
                  {settings?.useApproval ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              가입 축하 그룹 자동 배정
            </div>
            <p className="text-xs text-rose-500 leading-relaxed">
              신규 회원이 가입하면 자동으로 <strong>'일반회원'</strong> 그룹으로 배정됩니다. 그룹은 <u>회원 그룹 관리</u> 메뉴에서 변경할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
