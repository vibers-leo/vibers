"use client";

import React, { useEffect, useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminUserGroup } from '@/lib/admin/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Users, Plus, Shield, CheckCircle, XCircle, MoreVertical, Loader2, AlertCircle } from 'lucide-react';

export default function MemberGroupsPage() {
  const { currentProject } = useProject();
  const [groups, setGroups] = useState<AdminUserGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchUserGroups();
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentProject]);

  const columns: Column[] = [
    { 
      key: 'name', 
      header: '그룹명',
      render: (row: AdminUserGroup) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              {row.name}
              {row.isDefault && (
                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Default</span>
              )}
            </div>
            <div className="text-xs text-slate-500">{row.description}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'memberCount', 
      header: '회원 수',
      render: (row: AdminUserGroup) => (
        <div className="font-medium text-slate-700">{row.memberCount.toLocaleString()}명</div>
      )
    },
    { 
      key: 'status', 
      header: '상태',
      render: (row: AdminUserGroup) => (
        <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
          row.status === 'active' 
            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
        }`}>
          {row.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {row.status === 'active' ? '사용 중' : '미사용'}
        </button>
      )
    },
    {
      key: 'actions',
      header: '모니터링',
      render: () => (
        <div className="flex items-center gap-3">
          <button className="text-xs font-bold text-[var(--admin-accent)] hover:underline">상세보기</button>
          <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">회원 그룹 관리</h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">
            {currentProject.name}의 회원 등급 및 그룹 권한을 설정합니다.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--admin-accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          신규 그룹 추가
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">사용자 그룹 동기화 알림</h4>
          <p className="text-xs text-amber-700 mt-1">
            현재 {currentProject.name} 프로젝트의 데이터베이스에서 직접 그룹 정보를 읽어오고 있습니다. 
            그룹 삭제 시 기존 회원들의 소속이 초기화될 수 있으니 주의해 주세요.
          </p>
        </div>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--admin-accent)]" />
            <p className="text-sm text-slate-500 italic">그룹 정보를 불러오는 중...</p>
          </div>
        ) : groups.length > 0 ? (
          <DataTable data={groups} columns={columns} />
        ) : (
          <div className="py-32 text-center">
            <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
              <Shield className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-semibold text-lg">설정된 그룹이 없습니다</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto text-center">
              아직 {currentProject.name} 사이트에 등록된 회원 그룹이 없습니다. 
              신규 그룹을 추가하여 회원 관리를 시작해 보세요.
            </p>
            <button className="mt-6 text-sm font-bold text-[var(--admin-accent)] px-6 py-2 border border-[var(--admin-accent)] rounded-lg hover:bg-rose-50 transition-colors">
              기본 그룹 생성하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
