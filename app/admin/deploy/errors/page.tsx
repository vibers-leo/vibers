import React from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { AlertCircle } from 'lucide-react';

const mockErrors = [
  { id: 'ERR-501', project: 'DUS', message: 'PostgreSQL connection timeout', count: 42, lastSeen: '10분 전', status: 'Unresolved' },
  { id: 'ERR-502', project: 'GOODZZ', message: 'SSL Certificate expiring in 7 days', count: 1, lastSeen: '1시간 전', status: 'Warning' },
  { id: 'ERR-503', project: 'myratingis', message: 'Vercel build failed (next.config.js)', count: 3, lastSeen: '어제', status: 'Resolved' },
];

const columns: Column[] = [
  { key: 'project', header: '프로젝트' },
  { key: 'message', header: '오류 메시지' },
  { key: 'count', header: '발생 횟수' },
  { key: 'lastSeen', header: '최근 발생' },
  { 
    key: 'status', 
    header: '상태',
    render: (row) => {
      let colorClass = 'bg-gray-100 text-gray-700';
      if (row.status === 'Resolved') colorClass = 'bg-green-100 text-green-700';
      else if (row.status === 'Warning') colorClass = 'bg-yellow-100 text-yellow-700';
      else if (row.status === 'Unresolved') colorClass = 'bg-red-100 text-red-700';
      return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>{row.status}</span>;
    }
  },
];

export default function ErrorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">통합 오류 모니터링</h1>
            <p className="text-sm text-[var(--admin-text-muted)]">전체 프로젝트에서 발생한 런타임 및 빌드 오류를 관제합니다.</p>
          </div>
        </div>
      </div>
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <DataTable data={mockErrors} columns={columns} />
      </div>
    </div>
  );
}
