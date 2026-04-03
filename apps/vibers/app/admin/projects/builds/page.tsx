"use client";

import React, { useEffect, useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminAppBuild } from '@/lib/admin/api';
import { Smartphone, Apple, CheckCircle2, XCircle, Play, Clock, Loader2, ArrowRight } from 'lucide-react';

export default function AppBuildManagementPage() {
  const { currentProject } = useProject();
  const [builds, setBuilds] = useState<AdminAppBuild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchAppBuilds();
        setBuilds(data);
      } catch (error) {
        console.error("Failed to fetch builds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentProject]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">앱 빌드 관리 (Expo)</h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">
            {currentProject.name} 프로젝트의 네이티브 앱 빌드 상태 및 배포 이력을 모니터링합니다.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
          <Play className="w-4 h-4" />
          Expo 빌드 시작 (EAS)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--admin-accent)]" /></div>
        ) : builds.length > 0 ? (
          builds.map((build) => (
            <div key={build.id} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className={`w-2 md:w-3 ${
                build.status === 'success' ? 'bg-emerald-500' : 
                build.status === 'running' ? 'bg-blue-500' :
                build.status === 'failed' ? 'bg-red-500' : 'bg-slate-300'
              }`} />
              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      {build.platform === 'ios' ? <Apple className="w-5 h-5 text-slate-700" /> : <Smartphone className="w-5 h-5 text-slate-700" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Version {build.version}</h3>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{build.platform} Build</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    build.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                    build.status === 'running' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {build.status}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(build.deployedAt).toLocaleString('ko-KR')}
                  </div>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-[var(--admin-accent)] hover:underline">
                    로그 보기 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-32 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
            <Smartphone className="w-10 h-10 text-slate-200 mx-auto mb-4" />
            <h3 className="text-slate-900 font-semibold text-lg">빌드 이력이 없습니다</h3>
            <p className="text-slate-500 text-sm mt-1">EAS CLI를 통해 첫 번째 앱 빌드를 시작해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
