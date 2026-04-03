"use client";

import React, { useEffect, useState } from 'react';
import TrendChart from '@/components/admin/TrendChart';
import StatCard from '@/components/admin/StatCard';
import { ArrowUpRight, Users, MousePointerClick, CreditCard, Loader2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminStat, AdminSummary } from '@/lib/admin/api';

export default function StatsPage() {
  const { currentProject } = useProject();
  const [stats, setStats] = useState<AdminStat[]>([]);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchStats();
        setStats(data.trend);
        setSummary(data.summary);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [currentProject]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--admin-accent)] animate-spin" />
        <p className="text-[var(--admin-text-muted)] animate-pulse">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">
            {currentProject.name} 통합 통계
          </h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">프로젝트의 종합적인 성과를 분석합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatCard 
          title="월간 총 방문자 (MAU)" 
          value={summary?.mau || "0"} 
          trend="12.5%" 
          trendUp={true} 
          icon={<Users className="w-5 h-5 text-blue-500" />} 
        />
        <StatCard 
          title="월간 총 페이지뷰" 
          value={summary?.pv || "0"} 
          trend="8.1%" 
          trendUp={true} 
          icon={<MousePointerClick className="w-5 h-5 text-green-500" />} 
        />
        <StatCard 
          title="이탈률 평균" 
          value={summary?.bounceRate || "0%"} 
          trend="2.1%" 
          trendUp={false} 
          icon={<ArrowUpRight className="w-5 h-5 text-red-500" />} 
        />
         <StatCard 
          title="통합 전환 매출" 
          value={summary?.revenue || "₩ 0"} 
          trend="15%" 
          trendUp={true} 
          icon={<CreditCard className="w-5 h-5 text-purple-500" />} 
        />
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6">통합 방문 트렌드 (최근 30일)</h3>
        <TrendChart 
          data={stats} 
          dataKey="name" 
          categories={['방문자', '페이지뷰']} 
          colors={['#0673E2', '#10B981']}
          height={350}
        />
      </div>
    </div>
  );
}
