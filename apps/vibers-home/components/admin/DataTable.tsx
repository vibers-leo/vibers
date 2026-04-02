import React from 'react';

// A generic basic table with striped rows and hover highlight
export interface Column<T = any> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
}

export default function DataTable({ data, columns }: DataTableProps) {
  return (
    <div className="w-full bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--admin-bg)] border-b border-[var(--admin-border)]">
              {columns.map((col, i) => (
                <th key={col.key || i} className="py-3 px-4 font-semibold text-[var(--admin-text-muted)] text-xs uppercase tracking-wider whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {data.map((row, i) => (
              <tr 
                key={i} 
                className="hover:bg-[var(--admin-bg)] transition-colors group"
              >
                {columns.map((col, j) => (
                  <td key={col.key || j} className="py-3 px-4 text-[var(--admin-text)] whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-[var(--admin-text-muted)]">
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="py-3 px-4 border-t border-[var(--admin-border)] flex items-center justify-between text-xs text-[var(--admin-text-muted)] bg-[var(--admin-card)]">
        <span>총 {data.length} 건</span>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-[var(--admin-border)] rounded hover:bg-[var(--admin-bg)] disabled:opacity-50 transition-colors font-medium" disabled>이전</button>
          <button className="px-3 py-1.5 border border-[var(--admin-border)] rounded hover:bg-[var(--admin-bg)] disabled:opacity-50 transition-colors font-medium" disabled>다음</button>
        </div>
      </div>
    </div>
  );
}
