'use client';

import { useState } from 'react';
import { Copy, Eye, EyeOff, Check } from 'lucide-react';
import { useStore } from '@/lib/store';

interface CredentialFieldProps {
  label: string;
  value: string;
  masked?: boolean;
  allowReveal?: boolean;
  onRegenerate?: () => void;
}

export function CredentialField({ label, value, masked = false, allowReveal = false, onRegenerate }: CredentialFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useStore();

  const displayValue = masked && !revealed
    ? `sk_••••••••${value.slice(-4)}`
    : value;

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      addToast({ message: `${label} copied to clipboard`, type: 'success' });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-slate-300 overflow-hidden">
          <span className="truncate">{displayValue}</span>
        </div>
        <div className="flex items-center gap-1">
          {allowReveal && masked && (
            <button
              onClick={() => setRevealed(!revealed)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 transition-colors"
              title={revealed ? 'Hide' : 'Reveal'}
            >
              {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 transition-colors"
            title="Copy"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-3 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
