"use client";

import React, { useEffect, useState } from 'react';
import { Target, BarChart3, Rocket, CreditCard, AlertCircle, CheckCircle2, Clock, Zap, Info, TrendingUp } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminStrategy } from '@/lib/admin/api';

export default function StrategyDashboard() {
  const { currentProject } = useProject();
  const [strategy, setStrategy] = useState<AdminStrategy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchStrategyStatus();
        setStrategy(data);
      } catch (error) {
        console.error("Failed to fetch strategy data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentProject]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Zap className="w-10 h-10 text-[var(--admin-accent)] animate-pulse" />
        <p className="text-[var(--admin-text-muted)] text-sm">전략 이행 데이터를 분석하는 중...</p>
      </div>
    );
  }

  const getTierColor = (tier: number) => {
    switch(tier) {
      case 1: return "bg-rose-50 text-rose-600 border-rose-100";
      case 2: return "bg-amber-50 text-amber-600 border-amber-100";
      case 3: return "bg-slate-50 text-slate-600 border-slate-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Released': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Building': return <Clock className="w-4 h-4 text-amber-500 animate-spin" />;
      case 'Reviewing': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 배포 및 수익화 전략현황
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">monetization.md 및 EXPO_APP_BUILD_PROMPT.md 기준 모니터링</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${strategy ? getTierColor(strategy.tier) : ''}`}>
            Tier {strategy?.tier} Project
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Monetization</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-800 tracking-tight">{strategy?.monetization}</p>
            <p className="text-xs text-slate-400 mt-1">결제 방식 전략</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Deployment</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <p className="text-2xl font-black text-slate-800 tracking-tight">{strategy?.deploymentStatus}</p>
            {strategy && getStatusIcon(strategy.deploymentStatus)}
          </div>
          <p className="text-xs text-slate-400 mt-1">현재 배포 상태</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Priority</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-800 tracking-tight">{strategy?.priority}</p>
            <p className="text-xs text-slate-400 mt-1">출시 우선순위</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Payment</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-800 tracking-tight">{strategy?.paymentStatus}</p>
            <p className="text-xs text-slate-400 mt-1">PG/IAP 활성화 여부</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" /> 전략 가이드라인 (Quick Reference)
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 수익화 원칙
              </h4>
              <ul className="text-xs text-slate-500 space-y-2 ml-5 list-disc leading-relaxed">
                <li>PG 없이 핵심 기능부터 출시한다 (결제 미연동은 빌드 블로커가 아님)</li>
                <li>실물/오프라인 서비스는 토스페이먼츠(2~3%)를 우선 적용한다.</li>
                <li>디지털 콘텐츠 및 구독은 Apple/Google IAP(15~30%)를 의무 적용한다.</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-blue-50/30 border border-blue-100">
              <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2 mb-2">
                <Info className="w-3.5 h-3.5" /> {currentProject.name} 맞춤 지침
              </h4>
              <p className="text-xs text-blue-600 leading-relaxed">
                이 프로젝트는 {strategy?.monetization === 'Toss' ? '실물/오프라인 서비스 대가 성격이 강하므로 외부 PG(토스)를 통한 수수료 절감 전략이 유효합니다.' : '디지털 콘텐츠 성격이 강하므로 스토어 심사를 고려하여 IAP를 기본 전략으로 채택합니다.'}
                {strategy?.priority === 'High' ? ' 현재 최우선 출시 순위이므로 기초 빌드 안정화에 집중하세요.' : ' 사용자 지표를 확보한 뒤 본격적인 수익화 모듈을 탑재할 예정입니다.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl">
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" /> 전략 위반 주의사항
          </h3>
          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-100">임의의 결제 방식 결정 금지</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">monetization.md를 확인하지 않고 앱 내 결제를 연동하지 마세요.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-100">빌드 중단 금지</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">포트원이나 특정 PG 미승인을 이유로 전체 빌드를 멈추지 마세요.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-100">WebView Shell 금지</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">반드시 네이티브 UI로 빌드하며, WebView는 최소화합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
