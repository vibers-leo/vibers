"use client";

import React, { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { ShoppingCart, Download, Search, Loader2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminOrder } from '@/lib/admin/api';

const columns: Column[] = [
  { key: 'id', header: '주문번호' },
  { key: 'customerName', header: '주문자' },
  { key: 'amount', header: '결제금액', render: (row) => `₩${Number(row.amount).toLocaleString()}` },
  { key: 'date', header: '주문일시' },
  { 
    key: 'status', 
    header: '상태',
    render: (row) => {
      let colorClass = 'bg-gray-100 text-gray-700';
      const status = row.status.toLowerCase();
      if (['paid', '결제완료'].includes(status)) colorClass = 'bg-blue-100 text-blue-700';
      else if (['processing', '배송준비'].includes(status)) colorClass = 'bg-purple-100 text-purple-700';
      else if (['cancelled', '취소됨'].includes(status)) colorClass = 'bg-red-100 text-red-700';
      return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>{row.status}</span>;
    }
  },
];

export default function OrdersPage() {
  const { currentProject } = useProject();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentProject]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 주문 내역
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">프로젝트의 주문 상태를 관제합니다.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--admin-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={currentProject.slug === 'nusucheck' ? "요청번호/고객명 검색" : "주문번호/고객명 검색"}
              className="pl-9 pr-4 py-2 border border-[var(--admin-border)] rounded-lg text-sm w-64 bg-[var(--admin-bg)]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]">
            <Download className="w-4 h-4" /> 내보내기
          </button>
        </div>
      </div>
      
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader2 className="w-8 h-8 text-[var(--admin-accent)] animate-spin" />
          </div>
        ) : (
          <DataTable data={orders} columns={columns} />
        )}
      </div>
    </div>
  );
}
