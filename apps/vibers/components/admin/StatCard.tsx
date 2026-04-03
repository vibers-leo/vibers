import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, trend, trendUp, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-medium text-[var(--admin-text-muted)]">{title}</p>
          <h3 className="text-2xl font-bold mt-1.5 text-[var(--admin-text)] tracking-tight tabular-nums">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-[var(--admin-bg)] text-[var(--admin-accent)] border border-[var(--admin-border)]">
            {icon}
          </div>
        )}
      </div>
      {(trend || subtitle) && (
        <div className="flex items-center gap-2 mt-4 text-xs">
          {trend && (
            <span className={`font-medium flex items-center py-0.5 px-1.5 rounded-full ${trendUp ? 'bg-[var(--admin-success)]/10 text-[var(--admin-success)]' : 'bg-[var(--admin-danger)]/10 text-[var(--admin-danger)]'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
          {subtitle && <span className="text-[var(--admin-text-muted)] truncate">{subtitle}</span>}
        </div>
      )}
      {/* Double bezel effect inset */}
      <div className="absolute inset-0 border border-white/60 rounded-xl pointer-events-none rounded-xl mix-blend-overlay"></div>
    </div>
  );
}
