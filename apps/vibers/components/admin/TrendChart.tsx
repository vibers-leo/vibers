"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TrendChartProps {
  data: any[];
  dataKey: string;
  categories: string[];
  colors?: string[];
  height?: number;
}

export default function TrendChart({ data, dataKey, categories, colors = ['#0673E2', '#10B981'], height = 300 }: TrendChartProps) {
  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {categories.map((cat, index) => (
              <linearGradient key={cat} id={`color${cat}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
          <XAxis 
            dataKey={dataKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--admin-card)', 
              borderColor: 'var(--admin-border)',
              borderRadius: '8px',
              color: 'var(--admin-text)'
            }} 
            itemStyle={{ color: 'var(--admin-text)' }}
          />
          {categories.map((cat, index) => (
            <Area 
              key={cat} 
              type="monotone" 
              dataKey={cat} 
              stroke={colors[index % colors.length]} 
              fillOpacity={1} 
              fill={`url(#color${cat})`} 
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
