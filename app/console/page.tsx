'use client';

import { useRouter } from 'next/navigation';
import {
  Activity,
  Mic,
  Smartphone,
  AlertTriangle,
  ChevronRight,
  Users2,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { MetricCard } from '@/components/console/MetricCard';

export default function DashboardPage() {
  const { user, applications } = useStore();
  const router = useRouter();

  const oauthApp = applications.find(a => a.type === 'oauth');
  const sdkApp = applications.find(a => a.type === 'sdk');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-full">
      {/* Top Bar */}
      <div className="bg-[#0d1117] border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <span className="text-sm text-slate-500">March 11, 2026</span>
      </div>

      <div className="px-8 py-6 max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {greeting}, {user.name.split(' ')[0]} 👋
            </h2>
            <p className="text-indigo-200 text-sm">Here&apos;s what&apos;s happening with your apps today.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-200 mb-1">This month</div>
            <div className="text-2xl font-bold text-white">$42.30</div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="API Calls"
            value="12,430"
            change="↑12% WoW"
            changeDir="up"
            icon={<Activity size={18} />}
          />
          <MetricCard
            title="Audio Minutes"
            value="847 min"
            change="↑8% WoW"
            changeDir="up"
            icon={<Mic size={18} />}
          />
          <MetricCard
            title="Active Devices"
            value="23"
            subtitle="SDK only"
            icon={<Smartphone size={18} />}
          />
          <MetricCard
            title="Error Rate"
            value="0.4%"
            changeDir="down"
            icon={<Activity size={18} />}
          />
        </div>

        {/* Module Cards */}
        <div className="space-y-4 mb-6">
          {/* Personal API Module */}
          <div className="bg-[#161b22] rounded-2xl border border-white/10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">Personal API · MCP · CLI</h3>
                  <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">Active</span>
                </div>
                <p className="text-sm text-slate-400">Your personal access token for direct API, MCP, and CLI usage</p>
              </div>
              <button
                onClick={() => router.push('/console/applications')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
              >
                View Logs <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">API calls today</div>
                <div className="text-lg font-bold text-white">142</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Last call</div>
                <div className="text-lg font-bold text-white flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" /> 2m ago
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Top endpoint</div>
                <div className="text-sm font-mono font-semibold text-white">GET /transcripts</div>
              </div>
            </div>
          </div>

          {/* OAuth Apps Module */}
          {oauthApp && oauthApp.type === 'oauth' && (
            <div className="bg-[#161b22] rounded-2xl border border-white/10 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">OAuth Apps</h3>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">OAuth</span>
                  </div>
                  <p className="text-sm text-slate-400">{oauthApp.name} and 2 other apps</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/console/applications/${oauthApp.id}`)}
                    className="px-3 py-1.5 text-sm font-medium text-slate-400 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Manage App
                  </button>
                  <button
                    onClick={() => router.push(`/console/applications/${oauthApp.id}`)}
                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    View Logs
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-1"><Users2 size={11} /> Authorized users</div>
                  <div className="text-lg font-bold text-white">247</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-1"><TrendingUp size={11} /> API calls</div>
                  <div className="text-lg font-bold text-white">1,204</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Error rate</div>
                  <div className="text-lg font-bold text-emerald-600">0.2%</div>
                </div>
              </div>
            </div>
          )}

          {/* SDK Apps Module */}
          {sdkApp && sdkApp.type === 'sdk' && (
            <div className="bg-[#161b22] rounded-2xl border border-white/10 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">SDK Apps</h3>
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">SDK</span>
                  </div>
                  <p className="text-sm text-slate-400">{sdkApp.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/console/applications/${sdkApp.id}`)}
                    className="px-3 py-1.5 text-sm font-medium text-slate-400 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Manage Devices
                  </button>
                  <button
                    onClick={() => router.push(`/console/applications/${sdkApp.id}`)}
                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    View Logs
                  </button>
                </div>
              </div>
              {sdkApp.lowBatteryDevices > 0 && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-400">
                  <AlertTriangle size={14} />
                  <span>{sdkApp.lowBatteryDevices} devices have low battery — charge soon to avoid recording interruption.</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-1"><Smartphone size={11} /> Active devices</div>
                  <div className="text-lg font-bold text-white">{sdkApp.activeDevices}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-1"><TrendingUp size={11} /> API calls</div>
                  <div className="text-lg font-bold text-white">{sdkApp.apiCallsToday.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Low battery</div>
                  <div className="text-lg font-bold text-amber-600">{sdkApp.lowBatteryDevices} devices</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
