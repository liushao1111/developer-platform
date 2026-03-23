'use client';

import { useState } from 'react';
import { Download, Layers, Check, Copy } from 'lucide-react';

export type TemplateType = 'starter' | 'screens' | null;

export const UI_SCREENS = [
  {
    id: 'scanner',
    name: 'Device Scanner',
    description: 'BLE scan & connect',
    preview: (
      <div className="p-1.5 space-y-1.5">
        <div className="h-1.5 w-8 bg-slate-600 rounded mb-2" />
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-center gap-1 bg-white/5 rounded p-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 flex-shrink-0" />
            <div className="h-1 flex-1 bg-slate-600 rounded" />
            <div className="h-1 w-3 bg-slate-700 rounded" />
          </div>
        ))}
        <div className="h-3 w-full bg-indigo-500/30 rounded mt-1" />
      </div>
    ),
  },
  {
    id: 'recording',
    name: 'Recording Control',
    description: 'Start, pause, stop',
    preview: (
      <div className="flex flex-col items-center justify-between p-1.5 h-full pb-2">
        <div className="text-center">
          <div className="text-[6px] text-slate-500 font-mono">00:00:00</div>
          <div className="h-1 w-10 bg-slate-700 rounded mt-1" />
        </div>
        <div className="w-9 h-9 rounded-full bg-red-500/20 border-2 border-red-400/50 flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-red-400/70" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-2 w-6 bg-slate-700 rounded" />
          <div className="h-2 w-6 bg-slate-700 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'files',
    name: 'File Library',
    description: 'Browse recordings',
    preview: (
      <div className="p-1.5 space-y-1.5">
        <div className="flex items-center justify-between mb-1">
          <div className="h-1.5 w-8 bg-slate-500 rounded" />
          <div className="w-2.5 h-2.5 bg-emerald-500/40 rounded" />
        </div>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-white/5 rounded p-1 space-y-0.5">
            <div className="h-1 w-full bg-slate-600 rounded" />
            <div className="h-1 w-2/3 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'transcript',
    name: 'Transcript Viewer',
    description: 'Read & export',
    preview: (
      <div className="p-1.5 space-y-1">
        <div className="h-1.5 w-12 bg-slate-500 rounded mb-1.5" />
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex gap-1 items-start">
            <div className="w-1 h-1 rounded-full bg-blue-400/60 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5 flex-1">
              <div className="h-1 w-full bg-slate-700 rounded" />
              <div className={`h-1 ${i % 2 === 0 ? 'w-4/5' : 'w-3/5'} bg-slate-700/60 rounded`} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'settings',
    name: 'Device Settings',
    description: 'Configure & Wi-Fi',
    preview: (
      <div className="p-1.5 space-y-2">
        <div className="h-1.5 w-10 bg-slate-500 rounded mb-1" />
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-1 w-10 bg-slate-600 rounded" />
            <div className={`w-5 h-2.5 rounded-full ${i === 0 ? 'bg-indigo-500/60' : 'bg-slate-600'}`} />
          </div>
        ))}
        <div className="h-4 w-full bg-slate-700 rounded mt-1" />
      </div>
    ),
  },
  {
    id: 'ota',
    name: 'Firmware Update',
    description: 'OTA update & progress',
    preview: (
      <div className="flex flex-col items-center justify-center p-1.5 h-full gap-1.5">
        <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
          <span className="text-[8px] text-amber-400">↑</span>
        </div>
        <div className="h-1 w-12 bg-slate-600 rounded" />
        <div className="h-1 w-8 bg-slate-700 rounded" />
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div className="bg-amber-400/60 h-1.5 rounded-full w-3/5" />
        </div>
        <div className="h-3 w-10 bg-amber-500/30 rounded" />
      </div>
    ),
  },
];

interface Props {
  clientId: string;
  platform?: 'ios' | 'android' | 'both';
}

export function TemplateScreenPicker({ clientId, platform = 'ios' }: Props) {
  const [templateType, setTemplateType] = useState<TemplateType>(null);
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const githubUrl = templateType === 'starter'
    ? 'https://github.com/Plaud-AI/plaud-sdk/tree/main/templates/starter-app'
    : 'https://github.com/Plaud-AI/plaud-sdk/tree/main/ui-components';

  const showLink = templateType === 'starter' || (templateType === 'screens' && selectedScreens.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white mb-1">Choose a starting point</h3>
        <p className="text-sm text-slate-400 mb-4">
          Start from a complete app or drop individual screens into your existing project
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setTemplateType('starter')}
            className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${templateType === 'starter' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/40'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${templateType === 'starter' ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
              <Download size={18} className={templateType === 'starter' ? 'text-indigo-400' : 'text-slate-400'} />
            </div>
            <h4 className="font-bold text-white mb-1">Full Starter App</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete runnable {platform === 'both' ? 'iOS & Android' : platform === 'ios' ? 'iOS' : 'Android'} project with all screens pre-configured
            </p>
          </div>
          <div
            onClick={() => setTemplateType('screens')}
            className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${templateType === 'screens' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/40'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${templateType === 'screens' ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
              <Layers size={18} className={templateType === 'screens' ? 'text-indigo-400' : 'text-slate-400'} />
            </div>
            <h4 className="font-bold text-white mb-1">Pick UI Screens</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drop individual pre-built screens into your existing app
            </p>
          </div>
        </div>
      </div>

      {templateType === 'screens' && (
        <div>
          <p className="text-sm text-slate-400 mb-3">
            Select the screens you need —{' '}
            <span className="text-slate-300">{selectedScreens.length === 0 ? 'none selected' : `${selectedScreens.length} selected`}</span>
          </p>
          <div className="grid grid-cols-3 gap-3">
            {UI_SCREENS.map(screen => {
              const selected = selectedScreens.includes(screen.id);
              return (
                <div
                  key={screen.id}
                  onClick={() => setSelectedScreens(
                    selected ? selectedScreens.filter(s => s !== screen.id) : [...selectedScreens, screen.id]
                  )}
                  className={`relative border-2 rounded-xl cursor-pointer transition-all overflow-hidden ${selected ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-500/40'}`}
                >
                  <div className="mx-auto mt-3 w-16 h-28 rounded-xl border overflow-hidden flex flex-col bg-[#0a0f1a] border-white/10">
                    <div className="w-5 h-1 bg-slate-700 rounded-full mx-auto mt-1 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">{screen.preview}</div>
                  </div>
                  {selected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                  <div className="px-2 py-2 text-center">
                    <div className={`text-xs font-semibold ${selected ? 'text-white' : 'text-slate-300'}`}>{screen.name}</div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{screen.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showLink && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-1.5">GitHub repository</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-xs text-slate-300 truncate">
              {templateType === 'starter'
                ? 'github.com/Plaud-AI/plaud-sdk/tree/main/templates/starter-app'
                : 'github.com/Plaud-AI/plaud-sdk/tree/main/ui-components'}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(githubUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/10 text-slate-400 transition-colors flex-shrink-0"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>
          {templateType === 'starter' && (
            <p className="text-xs text-slate-500 mt-2">
              Clone the repo and replace <span className="font-mono text-slate-400">YOUR_CLIENT_ID</span> with{' '}
              <span className="font-mono text-indigo-400">{clientId.slice(0, 24)}…</span>
            </p>
          )}
          {templateType === 'screens' && (
            <p className="text-xs text-slate-500 mt-2">
              Copy the selected screen files from <span className="font-mono text-slate-400">/ui-components</span> into your project
            </p>
          )}
        </div>
      )}
    </div>
  );
}
