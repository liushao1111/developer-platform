'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Layers, Plus } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export function AppSwitcher() {
  const [open, setOpen] = useState(false);
  const { applications, selectedAppId, setSelectedAppId } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const selectedApp = selectedAppId ? applications.find(a => a.id === selectedAppId) : null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string | null) => {
    setSelectedAppId(id);
    if (id) {
      router.push(`/console/applications/${id}`);
    } else {
      router.push('/console/applications');
    }
    setOpen(false);
  };

  const handleNewApp = () => {
    setOpen(false);
    router.push('/console/applications/new');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
      >
        <div className="w-7 h-7 bg-indigo-500/20 rounded-md flex items-center justify-center flex-shrink-0">
          <Layers size={14} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {selectedApp ? selectedApp.name : 'All Apps'}
          </div>
          <div className="text-xs text-slate-400">
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-1">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${!selectedAppId ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-300 hover:bg-white/10'}`}
            >
              <Layers size={14} />
              <span>All Apps</span>
            </button>

            {applications.map(app => (
              <button
                key={app.id}
                onClick={() => handleSelect(app.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedAppId === app.id ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-300 hover:bg-white/10'}`}
              >
                <div className="w-5 h-5 bg-slate-600 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white">
                  {app.name[0]}
                </div>
                <span className="truncate">{app.name}</span>
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${app.type === 'oauth' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {app.type === 'oauth' ? 'OAuth' : 'SDK'}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 p-1">
            <button
              onClick={handleNewApp}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-400 hover:bg-white/10 transition-colors"
            >
              <Plus size={14} />
              <span>New Application</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
