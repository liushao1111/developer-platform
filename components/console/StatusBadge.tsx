'use client';

import React from 'react';
import { AppStatus } from '@/lib/mock-data';

interface StatusBadgeProps {
  status: AppStatus;
}

const statusConfig: Record<AppStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  sandbox: { label: 'Sandbox', className: 'bg-slate-100 text-slate-600' },
  in_review: { label: 'In Review', className: 'bg-amber-100 text-amber-700' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'active' ? 'bg-emerald-500' : status === 'in_review' ? 'bg-amber-500' : status === 'suspended' ? 'bg-red-500' : 'bg-slate-400'}`} />
      {config.label}
    </span>
  );
}
