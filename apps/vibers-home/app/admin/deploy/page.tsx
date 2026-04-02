import React from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Rocket } from 'lucide-react';

const mockDeploys = [
  { id: 'DEP-1092', project: 'FanEasy', version: 'v2.1.0', environment: 'Production', date: '2026-03-28 15:30', status: '성공' },
  { id: 'DEP-1091', project: 'AI Recipe', version: 'v1.5.2', environment: 'Production', date: '2026-03-28 10:15', status: '성공' },
  { id: 'DEP-1090', project: 'DUS', version: 'v3.0.2', environment: 'Staging', date: '2026-03-28 09:00', status: '실패' },
];

const columns: Column[] = [
  { key: 'project', header: '프로젝트' },
  { key: 'version', header: '버전' },
  { key: 'environment', header: '환경' },
  { key: 'date', header: '배포일시' },
  { 
    key: 'status', 
    header: '상태',
    render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.status === '성공' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {row.status}
      </span>
    )
  },
];

export default function DeployPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">통합 배포 관리</h1>
            <p className="text-sm text-[var(--admin-text-muted)]">전체 프로젝트의 빌드 및 배포 상태를 모니터링합니다.</p>
          </div>
        </div>
      </div>
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <DataTable data={mockDeploys} columns={columns} />
      </div>
    </div>
  );
}
