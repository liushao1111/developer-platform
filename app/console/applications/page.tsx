'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { StatusBadge } from '@/components/console/StatusBadge';

export default function ApplicationsPage() {
  const { applications } = useStore();
  const router = useRouter();

  return (
    <div className="min-h-full">
      {/* Top Bar */}
      <div className="bg-[#0d1117] border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">Applications</h1>
        <button
          onClick={() => router.push('/console/applications/new')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={15} />
          New Application
        </button>
      </div>

      <div className="px-8 py-6 max-w-6xl mx-auto">
        <div className="bg-[#161b22] rounded-2xl border border-white/10 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <p className="text-sm text-slate-400">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">App Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Created</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Last Active</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map(app => (
                  <tr
                    key={app.id}
                    onClick={() => router.push(`/console/applications/${app.id}`)}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
                          {app.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{app.name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{app.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        app.type === 'oauth'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {app.type === 'oauth' ? 'OAuth' : 'SDK'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(app.lastActive).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight size={16} className="text-slate-600 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {applications.length === 0 && (
            <div className="text-center py-16">
              <div className="text-slate-500 mb-3">No applications yet</div>
              <button
                onClick={() => router.push('/console/applications/new')}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
              >
                Create your first app
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
