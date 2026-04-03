"use client";

import React, { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Users, UserPlus, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminUser } from '@/lib/admin/api';

const columns: Column[] = [
  { key: 'name', header: '이름/닉네임' },
  { key: 'email', header: '이메일' },
  { key: 'role', header: '역할' },
  { key: 'createdAt', header: '가입일' },
  { 
    key: 'status', 
    header: '상태',
    render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === '활성' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {row.status}
      </span>
    )
  },
];

export default function MembersPage() {
  const { currentProject } = useProject();
  const [members, setMembers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchUsers();
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentProject]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 회원 관리
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">프로젝트의 회원을 조회하고 관리합니다.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> CSV 엑스포트
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--admin-accent-hover)] transition-colors shadow-sm">
            <UserPlus className="w-4 h-4" /> 신규 회원
          </button>
        </div>
      </div>
      
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-1 overflow-hidden relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader2 className="w-8 h-8 text-[var(--admin-accent)] animate-spin" />
          </div>
        ) : (
          <DataTable data={members} columns={columns} />
        )}
      </div>
    </div>
  );
}
