'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mic, Users, Smartphone, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Mic size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">Plaud</span>
          <span className="text-xs text-slate-400 font-medium border border-slate-300 rounded px-1.5 py-0.5">Dev</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Create your first app</h1>
          <p className="text-slate-500 text-base">Choose how you want to integrate with the Plaud platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* OAuth API Card */}
          <div
            onClick={() => router.push('/console/applications/new?type=oauth')}
            className="bg-white rounded-2xl border-2 border-slate-200 p-8 cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-200 transition-colors">
              <Users size={26} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">OAuth API</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Build apps that connect to users&apos; Plaud accounts. Access their recordings, transcripts, and notes on their behalf with OAuth 2.0.
            </p>
            <div className="text-xs text-slate-400 space-y-1 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Web apps, mobile apps, integrations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>User data access with consent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Standard OAuth 2.0 flow</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
              Select OAuth API <ArrowRight size={15} />
            </div>
          </div>

          {/* Embedded SDK Card */}
          <div
            onClick={() => router.push('/console/applications/new?type=sdk')}
            className="bg-white rounded-2xl border-2 border-slate-200 p-8 cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-colors">
              <Smartphone size={26} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Embedded SDK</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Build native iOS or Android apps that connect directly to Plaud NotePin hardware via BLE, with full device management and custom recording workflows.
            </p>
            <div className="text-xs text-slate-400 space-y-1 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Native iOS &amp; Android apps</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Direct hardware BLE control</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Device fleet management</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
              Select Embedded SDK <ArrowRight size={15} />
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/console"
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip for now — take me to the dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
