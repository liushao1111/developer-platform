'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bluetooth,
  Cpu,
  Database,
  ChevronRight,
  Github,
  ExternalLink,
  Check,
  Code,
  Terminal,
  Star,
  ArrowRight,
  Zap,
  Bot,
  UserCheck,
  Building2,
} from 'lucide-react';
import { showcaseApps, pricingTiers } from '@/lib/mock-data';

// ─── Wave bar heights (static to avoid hydration mismatch) ───────────────────
const WAVE_SM = [8,14,22,18,28,12,24,16,30,20,10,26,14,30,18,22,16,28,12,20];
const WAVE_LG = [10,18,28,22,36,14,30,20,40,26,12,34,18,42,24,28,20,36,14,26,32,16,38,22];

function RecordingTimer({ large = false }: { large?: boolean }) {
  const [secs, setSecs] = useState(large ? 1393 : 297); // start at 23:13 or 4:57
  useEffect(() => {
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return (
    <span className={`font-mono font-bold text-cyan-400 tabular-nums ${large ? 'text-5xl' : 'text-3xl'}`}>
      {m}:{s}
    </span>
  );
}

function InstallTabs() {
  const [tab, setTab] = useState<'ios' | 'android'>('ios');
  return (
    <div className="bg-[#161b22] rounded-xl border border-white/10 overflow-hidden">
      <div className="flex border-b border-white/10">
        {(['ios', 'android'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-[11px] font-mono tracking-widest transition-colors ${
              tab === t ? 'text-white border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t === 'ios' ? 'IOS — SWIFT' : 'ANDROID — KOTLIN'}
          </button>
        ))}
      </div>
      <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
        {tab === 'ios' ? (
          <>
            <div className="text-slate-500">{'// File > Add Package Dependencies...'}</div>
            <div className="text-cyan-400 mb-3">https://github.com/Plaud-AI/plaud-sdk.git</div>
            <div><span className="text-amber-400">import </span><span className="text-slate-200">PenBleSDK</span></div>
            <div><span className="text-amber-400">import </span><span className="text-slate-200">PlaudDeviceBasicSDK</span></div>
            <div><span className="text-amber-400">import </span><span className="text-slate-200">PenWiFiSDK</span></div>
          </>
        ) : (
          <>
            <div className="text-slate-500">{'// build.gradle (app)'}</div>
            <div className="text-slate-400">{'dependencies {'}</div>
            <div className="pl-4"><span className="text-amber-400">implementation </span><span className="text-emerald-400">&apos;ai.plaud:sdk-android:2.0.0&apos;</span></div>
            <div className="text-slate-400 mb-3">{'}'}</div>
            <div><span className="text-amber-400">import </span><span className="text-slate-200">ai.plaud.sdk.PlaudSDK</span></div>
            <div><span className="text-amber-400">import </span><span className="text-slate-200">ai.plaud.sdk.PlaudDevice</span></div>
          </>
        )}
      </div>
    </div>
  );
}

const showcaseCategories = ['All', 'Personal Access', 'SDK', 'OAuth'];

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filterMap: Record<string, string> = {
    'Personal Access': 'Personal Access',
    'SDK': 'SDK',
    'OAuth': 'OAuth API',
  };

  const filteredApps = activeFilter === 'All'
    ? showcaseApps
    : showcaseApps.filter(app => app.apiType === filterMap[activeFilter]);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">Plaud</span>
              <span className="text-xs text-slate-500 font-medium border border-slate-600 rounded px-1.5 py-0.5">Platform</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-slate-300 hover:text-white transition-colors">Home</Link>
              <Link href="/docs" className="text-sm text-slate-300 hover:text-white transition-colors">Docs</Link>
              <Link href="#showcase" className="text-sm text-slate-300 hover:text-white transition-colors">Showcase</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#0d1117] pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-medium mb-6">
                <Zap size={12} />
                Now in Public Beta — API v2 Available
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Build Voice-First Apps on{' '}
                <span className="text-indigo-400">Professional Hardware</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Access Plaud NotePin's hardware, AI transcription APIs, and data platform to build apps that were impossible before — meeting bots, medical scribes, sales coaches, and more.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-base">
                  Start Building <ArrowRight size={16} />
                </Link>
                <Link href="/docs" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-colors text-base border border-white/20">
                  View Docs <ExternalLink size={16} />
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" />Free tier available</span>
                <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" />No credit card required</span>
              </div>
            </div>

            {/* Animated code snippet */}
            <div className="bg-[#161b22] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1117] border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <div className="flex items-center gap-1.5 ml-3">
                  <Terminal size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-500">Terminal</span>
                </div>
              </div>
              <div className="p-5 font-mono text-sm">
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <span className="text-emerald-400">$</span>
                  <span className="text-white">plaud login</span>
                </div>
                <div className="text-slate-500 mb-4 pl-4">
                  ✓ Authenticated as alex@acmecorp.com<br />
                  ✓ Connected to plaud-platform v2.1.0
                </div>
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <span className="text-emerald-400">$</span>
                  <span className="text-white">curl https://api.plaud.ai/v1/transcripts \</span>
                </div>
                <div className="text-slate-400 pl-4 mb-3">
                  -H <span className="text-amber-300">&quot;Authorization: Bearer $PLAUD_KEY&quot;</span>
                </div>
                <div className="bg-[#0d1117] rounded-lg p-3 text-xs">
                  <div className="text-slate-400">{'{'}</div>
                  <div className="pl-3 text-slate-300">
                    <span className="text-blue-400">&quot;data&quot;</span><span className="text-slate-400">: [{'{'}</span><br />
                    <span className="pl-3 text-blue-400">&quot;id&quot;</span><span className="text-slate-400">: </span><span className="text-emerald-400">&quot;tr_abc123&quot;</span><span className="text-slate-400">,</span><br />
                    <span className="pl-3 text-blue-400">&quot;text&quot;</span><span className="text-slate-400">: </span><span className="text-emerald-400">&quot;Q3 sales review...&quot;</span><span className="text-slate-400">,</span><br />
                    <span className="pl-3 text-blue-400">&quot;duration&quot;</span><span className="text-slate-400">: </span><span className="text-purple-400">3742</span><br />
                    <span className="text-slate-400">  {'}'}]</span>
                  </div>
                  <div className="text-slate-400">{'}'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Types */}
      <section className="py-16 px-6 bg-[#0d1117] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Three ways to integrate</h2>
            <p className="text-slate-400">Choose the access method that fits your use case</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Personal Access */}
            <div className="relative bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 hover:border-indigo-500/60 transition-colors">
              <div className="absolute top-4 right-4">
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  <Check size={10} /> No sign-in required
                </span>
              </div>
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <UserCheck size={20} className="text-indigo-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Personal Access</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Query your own Plaud recordings. Use your existing Plaud consumer account — no developer platform account needed.
              </p>
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 rounded-lg px-3 py-2">
                  <Database size={13} className="text-indigo-400 flex-shrink-0" />
                  <span><span className="font-medium text-white">REST API</span> — direct HTTP calls from any language</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 rounded-lg px-3 py-2">
                  <Bot size={13} className="text-indigo-400 flex-shrink-0" />
                  <span><span className="font-medium text-white">MCP Server</span> — use with Claude, Cursor, Windsurf</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 rounded-lg px-3 py-2">
                  <Terminal size={13} className="text-indigo-400 flex-shrink-0" />
                  <span><span className="font-medium text-white">CLI</span> — terminal, shell scripts, automation</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 border-t border-white/10 pt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Authenticate once with <code className="bg-white/10 px-1 rounded text-slate-300">plaud login</code>
              </div>
            </div>

            {/* Embedded SDK */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <div className="absolute top-4 right-4" />
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Bluetooth size={20} className="text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Embedded SDK</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Build iOS/Android apps that control Plaud hardware directly — scanning, pairing, recording, file transfer, and OTA updates.
              </p>
              <div className="space-y-1.5 mb-5">
                {['iOS (Swift 5.7+, SPM)', 'Android (Kotlin, Maven)', 'BLE + Wi-Fi device control', 'OTA firmware updates', 'Webhook events'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check size={13} className="text-blue-400 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <Link href="/signup" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create developer account <ArrowRight size={13} />
              </Link>
            </div>

            {/* OAuth API */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Building2 size={20} className="text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">OAuth API</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Let your users connect their Plaud account to your app. Build CRM auto-loggers, Notion integrations, Slack bots, and enterprise workflows.
              </p>
              <div className="space-y-1.5 mb-5">
                {['OAuth 2.0 + PKCE flow', 'Granular user consent', 'Files, transcripts & notes', 'Token lifecycle management', 'Authorized user management'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check size={13} className="text-purple-400 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <Link href="/signup" className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Create developer account <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How the SDK Works */}
      <section className="py-24 px-6 bg-[#0d1117] border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">How the SDK works</h2>
            <p className="text-slate-400">From hardware to structured data in three steps</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 items-center">

            {/* Steps */}
            <div>
              {[
                { num: '01', title: 'Capture', desc: 'Multi-mic array records in any environment — offices, cars, clinics, the field.' },
                { num: '02', title: 'Sync', desc: 'Binds Plaud devices directly to your mobile app via Bluetooth.' },
                { num: '03', title: 'Transcribe', desc: 'Plaud returns speaker-labeled transcripts with state-of-the-art accuracy.' },
              ].map((step, i) => (
                <div key={step.num} className={i < 2 ? 'pb-8 mb-8 border-b border-white/10' : ''}>
                  <span className="text-xs font-mono text-cyan-400 mb-2 block">{step.num}</span>
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Phone + Device */}
            <div className="flex flex-col items-center">
              <div className="w-48 bg-[#050505] rounded-[2.5rem] border-[1.5px] border-cyan-500/40 p-2 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <div className="bg-[#0d1117] rounded-[2rem] overflow-hidden p-4 flex flex-col items-center" style={{minHeight: 300}}>
                  <div className="w-full flex justify-between text-[8px] text-slate-600 mb-3">
                    <span>5:41</span>
                    <div className="flex gap-1"><span>▲▲</span><span>■■</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[8px] font-mono text-cyan-400 tracking-widest">RECORDING</span>
                  </div>
                  <span className="text-[7px] text-slate-600 tracking-widest mb-3">IN PROGRESS</span>
                  <RecordingTimer />
                  <div className="w-full flex items-end justify-center gap-px my-3">
                    {WAVE_SM.map((h, i) => (
                      <div key={i} className="w-1 rounded-full bg-cyan-500/50 animate-pulse"
                        style={{ height: h, animationDelay: `${i * 80}ms`, animationDuration: '1.4s' }} />
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mt-1">
                    <div className="w-3.5 h-3.5 bg-white rounded-sm" />
                  </div>
                  <span className="text-[7px] text-slate-600 tracking-widest mt-1.5">TAP TO STOP</span>
                  <div className="mt-3 pt-2 border-t border-white/10 w-full text-center">
                    <span className="text-[7px] text-slate-700 tracking-widest">YOUR APP (SDK)</span>
                  </div>
                </div>
              </div>
              {/* BLE connection + device */}
              <div className="flex items-center gap-3 mt-5">
                <div className="relative h-px w-14 bg-white/10 overflow-hidden">
                  <div className="absolute inset-0 w-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                </div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <div className="flex flex-col items-center">
                  <div className="w-7 h-14 bg-[#111] rounded-full border border-white/20 flex flex-col items-center justify-center gap-1.5 shadow-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <div className="w-2.5 h-4 rounded-full border border-white/25" />
                    <div className="w-1.5 h-1.5 rounded-full border border-white/25" />
                  </div>
                  <span className="text-[7px] text-slate-600 mt-1 tracking-wide">NotePin</span>
                </div>
              </div>
            </div>

            {/* API Response */}
            <div className="bg-[#161b22] rounded-xl border border-white/10 overflow-hidden self-start">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0d1117] border-b border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="text-xs text-slate-500 ml-2 font-mono">API Response — 200 OK</span>
              </div>
              <div className="p-4 font-mono text-xs leading-relaxed">
                <div className="text-slate-400">&quot;results&quot;: [</div>
                <div className="pl-4">
                  <div className="text-slate-400">{'{'}</div>
                  <div className="pl-4 space-y-0.5">
                    <div><span className="text-blue-400">&quot;speaker_id&quot;</span><span className="text-slate-400">: </span><span className="text-emerald-400">&quot;SPEAKER_00&quot;</span><span className="text-slate-400">,</span></div>
                    <div><span className="text-blue-400">&quot;start&quot;</span><span className="text-slate-400">: </span><span className="text-purple-400">0.0</span><span className="text-slate-400">,</span></div>
                    <div><span className="text-blue-400">&quot;end&quot;</span><span className="text-slate-400">: </span><span className="text-purple-400">5.2</span><span className="text-slate-400">,</span></div>
                    <div><span className="text-blue-400">&quot;text&quot;</span><span className="text-slate-400">: </span><span className="text-emerald-400">&quot;Hey Jake, did you get</span></div>
                    <div className="pl-4"><span className="text-emerald-400">a chance to review</span></div>
                    <div className="pl-4"><span className="text-emerald-400">the redlines?&quot;</span><span className="text-slate-400">,</span></div>
                    <div><span className="text-blue-400">&quot;language&quot;</span><span className="text-slate-400">: </span><span className="text-emerald-400">&quot;EN&quot;</span></div>
                  </div>
                  <div className="text-slate-400">{'}'}</div>
                </div>
                <div className="text-slate-400">]</div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-slate-600 tracking-widest">
                  TRANSCRIPT + DIARIZATION
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Install in Minutes */}
      <section className="py-24 px-6 bg-[#0d1117] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Phone */}
            <div className="flex justify-center">
              <div className="w-60 bg-[#050505] rounded-[2.5rem] border-[1.5px] border-cyan-500/40 p-2 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                <div className="bg-[#0d1117] rounded-[2rem] overflow-hidden px-5 py-8 flex flex-col items-center" style={{minHeight: 440}}>
                  <div className="w-full flex justify-between text-[9px] text-slate-600 mb-10">
                    <span>9:41</span>
                    <div className="flex gap-1 text-slate-500"><span>▲▲▲</span><span>■■■</span></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest mb-1">RECORDING</span>
                  <div className="w-10 h-0.5 bg-red-500/80 mb-6 rounded-full" />
                  <RecordingTimer large />
                  <div className="w-full flex items-end justify-center gap-px my-5" style={{height: 40}}>
                    {WAVE_LG.map((h, i) => (
                      <div key={i} className="flex-1 max-w-[6px] rounded-full bg-cyan-500/30 animate-pulse"
                        style={{ height: h, animationDelay: `${i * 50}ms`, animationDuration: '1.2s' }} />
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center mb-4">
                    <div className="w-3 h-6 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[9px] text-slate-500 tracking-widest mb-8 text-center">RECORDING FROM PLAUD DEVICE</span>
                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/50">
                    <div className="w-4 h-4 bg-white rounded-sm" />
                  </div>
                  <span className="text-[8px] text-slate-600 tracking-widest mt-2">TAP TO STOP</span>
                </div>
              </div>
            </div>

            {/* Install content */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 tracking-widest mb-4 block">INSTALL IN MINUTES</span>
              <InstallTabs />
              <div className="mt-1">
                {[
                  { label: 'DOWNLOAD STARTER APP (GITHUB) →', href: '#' },
                  { label: 'IOS SDK DOCS →', href: '/docs' },
                  { label: 'ANDROID SDK DOCS →', href: '/docs' },
                ].map(link => (
                  <a key={link.label} href={link.href}
                    className="flex items-center py-4 border-b border-white/10 text-xs font-mono text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="mt-5 text-xs text-slate-600 font-mono">
                iOS 13.0+ • Android 5.0 (API 21)+
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Capability Pillars */}
      <section className="py-20 px-6 bg-[#0d1117] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need to build</h2>
            <p className="text-slate-400 text-lg">Three powerful primitives for voice-first development</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#161b22] rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5">
                <Bluetooth size={22} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hardware Control</h3>
              <p className="text-slate-400 leading-relaxed">Direct BLE access to Plaud NotePin — trigger recordings, manage device state, push OTA firmware updates, and monitor battery in real time.</p>
            </div>
            <div className="bg-[#161b22] rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-5">
                <Cpu size={22} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI APIs</h3>
              <p className="text-slate-400 leading-relaxed">World-class speech recognition, speaker diarization, and LLM summarization APIs fine-tuned on professional audio from thousands of real meetings.</p>
            </div>
            <div className="bg-[#161b22] rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5">
                <Database size={22} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Data Access</h3>
              <p className="text-slate-400 leading-relaxed">OAuth 2.0-secured access to user files, transcripts, and notes. Build integrations that connect Plaud recordings to any workflow or CRM.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Gallery */}
      <section id="showcase" className="py-20 px-6 bg-[#0d1117] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">What people are building</h2>
            <p className="text-slate-400 text-lg">Community and official apps built on the Plaud Platform</p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 mb-8 flex-wrap justify-center">
            {showcaseCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* App Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map(app => (
              <div key={app.id} className="bg-[#161b22] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white text-base">{app.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    app.badge === 'official' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-white/5 text-slate-400'
                  }`}>
                    {app.badge === 'official' ? 'Official' : 'Community'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">{app.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                    {app.apiType}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                      <Code size={12} /> View Code
                    </button>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
                      View Demo <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-20 px-6 bg-[#0d1117] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-lg">Start free, scale as you grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map(tier => (
              <div
                key={tier.name}
                className={`bg-[#161b22] rounded-2xl border p-8 relative ${
                  tier.highlighted ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/10' : 'border-white/10'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={10} fill="white" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{tier.description}</p>
                  <div className="flex items-baseline gap-1">
                    {tier.price === null ? (
                      <span className="text-3xl font-bold text-white">Custom</span>
                    ) : tier.price === 0 ? (
                      <span className="text-3xl font-bold text-white">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-white">${tier.price}</span>
                        <span className="text-slate-500 text-sm">/mo</span>
                      </>
                    )}
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    tier.highlighted
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="#" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center gap-1 justify-center">
              See full pricing details <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d1117] py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-base tracking-tight">PLAUD</span>
              <span className="text-[10px] font-semibold bg-white/10 text-slate-300 border border-white/20 rounded px-1.5 py-0.5 leading-none">Platform</span>
            </div>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <Link href="/docs" className="text-sm text-slate-400 hover:text-white transition-colors">Docs</Link>
              <Link href="/console" className="text-sm text-slate-400 hover:text-white transition-colors">Console</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Community</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                <Github size={14} /> GitHub
              </Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-slate-600">
            © 2026 Plaud, Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
