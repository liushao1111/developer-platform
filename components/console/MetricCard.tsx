'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeDir?: 'up' | 'down';
  subtitle?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, change, changeDir = 'up', subtitle, icon }: MetricCardProps) {
  return (
    <div className="bg-[#161b22] rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        {icon && <div className="text-indigo-400">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${changeDir === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </span>
        )}
        {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
      </div>
    </div>
  );
}
