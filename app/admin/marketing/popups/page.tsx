"use client";

import React, { useEffect, useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminPopup } from '@/lib/admin/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Plus, Search, Filter, Calendar, Layout, Loader2 } from 'lucide-react';

export default function PopupManagementPage() {
  const { currentProject } = useProject();
  const [popups, setPopups] = useState<AdminPopup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchPopups();
        setPopups(data);
      } catch (error) {
        console.error("Failed to fetch popups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentProject]);

  const columns: Column[] = [
    { key: 'title', header: '팝업 제목' },
    { 
      key: 'status', 
      header: '상태',
      render: (row: AdminPopup) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {row.status === 'active' ? '● 노출중' : '○ 중지됨'}
        </span>
      )
    },
    { 
      key: 'targetPages', 
      header: '노출 페이지',
      render: (row: AdminPopup) => (
        <div className="flex flex-wrap gap-1">
          {row.targetPages.map(page => (
            <span key={page} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500">
              {page}
            </span>
          ))}
        </div>
      )
    },
    { 
      key: 'period', 
      header: '노출 기간',
      render: (row: AdminPopup) => (
        <div className="text-xs text-slate-500">
          {row.startDate} ~ {row.endDate}
        </div>
      )
    },
    {
      key: 'actions',
      header: '관리',
      render: () => (
        <button className="text-sm text-[var(--admin-accent)] hover:underline font-medium">수정</button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">팝업 관리</h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">
            {currentProject.name} 프로젝트의 사이트 내 팝업을 관리합니다.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--admin-accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          신규 팝업 등록
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--admin-card)] p-4 rounded-xl border border-[var(--admin-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">전체 팝업</p>
            <p className="text-xl font-bold text-slate-900">{popups.length}개</p>
          </div>
        </div>
        <div className="bg-[var(--admin-card)] p-4 rounded-xl border border-[var(--admin-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-500">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">노출 중</p>
            <p className="text-xl font-bold text-slate-900">{popups.filter(p => p.status === 'active').length}개</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--admin-border)] flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="팝업 제목 검색..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              필터
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--admin-accent)]" />
            <p className="text-sm text-slate-500 italic">팝업 목록을 불러오고 있습니다...</p>
          </div>
        ) : popups.length > 0 ? (
          <DataTable data={popups} columns={columns} />
        ) : (
          <div className="py-32 text-center">
            <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
              <Layout className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-semibold">등록된 팝업이 없습니다</h3>
            <p className="text-sm text-slate-500 mt-1">신규 팝업을 등록하여 마케팅 효율을 높여보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
