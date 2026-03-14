'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  Smartphone,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { OAuthApp, SDKApp } from '@/lib/mock-data';

type AppType = 'oauth' | 'sdk' | null;

const AVAILABLE_SCOPES = [
  { id: 'files:read', label: 'files:read', description: 'Read access to user files' },
  { id: 'transcripts:read', label: 'transcripts:read', description: 'Read access to transcripts' },
  { id: 'notes:read', label: 'notes:read', description: 'Read access to AI notes' },
];

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substr(2, 8)}`;
}
function generateClientId() {
  return `plaud_client_${Math.random().toString(36).substr(2, 16)}`;
}
function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'sk_live_';
  for (let i = 0; i < 32; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function NewApplicationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addApplication, addToast } = useStore();

  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState<AppType>(null);

  // OAuth fields
  const [oauthName, setOauthName] = useState('');
  const [oauthDesc, setOauthDesc] = useState('');
  const [oauthHomepage, setOauthHomepage] = useState('');
  const [redirectUris, setRedirectUris] = useState(['']);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [privacyUrl, setPrivacyUrl] = useState('');

  // SDK fields
  const [sdkName, setSdkName] = useState('');
  const [sdkDesc, setSdkDesc] = useState('');
  const [platform, setPlatform] = useState<'ios' | 'android' | 'both'>('ios');
  const [bundleId, setBundleId] = useState('');
  const [useCase, setUseCase] = useState('');

  // Generated credentials
  const [clientId] = useState(generateClientId());
  const [clientSecret] = useState(generateSecret());
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [checkedId, setCheckedId] = useState(false);
  const [checkedSecret, setCheckedSecret] = useState(false);

  const [createdAppId, setCreatedAppId] = useState<string>('');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'oauth' || typeParam === 'sdk') {
      setAppType(typeParam);
      setStep(2);
    }
  }, [searchParams]);

  const handleCopy = (text: string, type: 'id' | 'secret') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleCreate = () => {
    const id = generateId('app');
    setCreatedAppId(id);

    if (appType === 'oauth') {
      const newApp: OAuthApp = {
        id,
        type: 'oauth',
        name: oauthName,
        description: oauthDesc,
        status: 'sandbox',
        clientId,
        clientSecret,
        homepageUrl: oauthHomepage,
        redirectUris: redirectUris.filter(Boolean),
        scopes: selectedScopes,
        contactEmail,
        privacyPolicyUrl: privacyUrl,
        logoUrl: '',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        authorizedUsers: 0,
        apiCallsToday: 0,
        apiCallsTotal: 0,
        errorRate: 0,
        lastCall: 'Never',
      };
      addApplication(newApp);
    } else {
      const newApp: SDKApp = {
        id,
        type: 'sdk',
        name: sdkName,
        description: sdkDesc,
        status: 'sandbox',
        clientId,
        clientSecret,
        platform,
        bundleId,
        useCase,
        mode: 'sandbox',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        activeDevices: 0,
        lowBatteryDevices: 0,
        offlineDevices: 0,
        apiCallsToday: 0,
        apiCallsTotal: 0,
        errorRate: 0,
      };
      addApplication(newApp);
    }

    addToast({ message: 'Application created successfully!', type: 'success' });
    setStep(3);
  };

  const canProceedStep2 = appType === 'oauth'
    ? oauthName.trim().length > 0
    : sdkName.trim().length > 0;

  const inputClass = 'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30';

  return (
    <div className="min-h-full bg-[#0d1117]">
      {/* Top Bar */}
      <div className="bg-[#0d1117] border-b border-white/10 px-8 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.push('/console/applications')}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">New Application</h1>
      </div>

      <div className="px-8 py-6 max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step > s ? 'bg-emerald-500 text-white' :
                  step === s ? 'bg-indigo-600 text-white' :
                  'bg-white/10 text-slate-500'
                }`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`text-sm font-medium ${step === s ? 'text-white' : 'text-slate-500'}`}>
                  {s === 1 ? 'Choose Type' : s === 2 ? 'App Details' : 'Credentials'}
                </span>
              </div>
              {i < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Choose Type */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Choose application type</h2>
            <p className="text-slate-400 mb-8">Select how your app will integrate with Plaud</p>
            <div className="space-y-4">
              <div
                onClick={() => setAppType('oauth')}
                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                  appType === 'oauth' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${appType === 'oauth' ? 'bg-indigo-500/20' : 'bg-blue-500/10'}`}>
                    <Users size={22} className={appType === 'oauth' ? 'text-indigo-400' : 'text-blue-400'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">OAuth API</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Build apps that access Plaud users&apos; data with their explicit consent via OAuth 2.0. Ideal for web apps, mobile integrations, and third-party services.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setAppType('sdk')}
                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                  appType === 'sdk' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${appType === 'sdk' ? 'bg-indigo-500/20' : 'bg-purple-500/10'}`}>
                    <Smartphone size={22} className={appType === 'sdk' ? 'text-indigo-400' : 'text-purple-400'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Embedded SDK</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Build native iOS or Android apps that connect directly to Plaud NotePin hardware. Control recording, manage devices, and build custom workflows.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => appType && setStep(2)}
                disabled={!appType}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: App Details */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {appType === 'oauth' ? 'OAuth app details' : 'SDK app details'}
            </h2>
            <p className="text-slate-400 mb-8">Configure your application settings</p>

            {appType === 'oauth' ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">App Name <span className="text-red-400">*</span></label>
                  <input value={oauthName} onChange={e => setOauthName(e.target.value)} placeholder="My Awesome App" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea value={oauthDesc} onChange={e => setOauthDesc(e.target.value)} placeholder="What does your app do?" rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Homepage URL</label>
                  <input value={oauthHomepage} onChange={e => setOauthHomepage(e.target.value)} placeholder="https://yourapp.com" type="url" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Redirect URIs</label>
                  <div className="space-y-2">
                    {redirectUris.map((uri, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          value={uri}
                          onChange={e => {
                            const next = [...redirectUris];
                            next[idx] = e.target.value;
                            setRedirectUris(next);
                          }}
                          placeholder="https://yourapp.com/callback"
                          type="url"
                          className={inputClass}
                        />
                        {redirectUris.length > 1 && (
                          <button
                            onClick={() => setRedirectUris(redirectUris.filter((_, i) => i !== idx))}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                    {redirectUris.length < 5 && (
                      <button
                        onClick={() => setRedirectUris([...redirectUris, ''])}
                        className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        <Plus size={14} /> Add URI
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">OAuth Scopes</label>
                  <div className="space-y-2">
                    {AVAILABLE_SCOPES.map(scope => (
                      <label key={scope.id} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedScopes.includes(scope.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedScopes([...selectedScopes, scope.id]);
                            } else {
                              setSelectedScopes(selectedScopes.filter(s => s !== scope.id));
                            }
                          }}
                          className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-white/20 bg-white/5"
                        />
                        <div>
                          <div className="text-sm font-mono font-medium text-slate-200">{scope.label}</div>
                          <div className="text-xs text-slate-500">{scope.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Contact Email</label>
                  <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="dev@yourapp.com" type="email" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Privacy Policy URL</label>
                  <input value={privacyUrl} onChange={e => setPrivacyUrl(e.target.value)} placeholder="https://yourapp.com/privacy" type="url" className={inputClass} />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">App Name <span className="text-red-400">*</span></label>
                  <input value={sdkName} onChange={e => setSdkName(e.target.value)} placeholder="My Recorder App" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea value={sdkDesc} onChange={e => setSdkDesc(e.target.value)} placeholder="What does your app do?" rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
                  <div className="flex gap-3">
                    {(['ios', 'android', 'both'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                          platform === p
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-indigo-500/40'
                        }`}
                      >
                        {p === 'ios' ? 'iOS' : p === 'android' ? 'Android' : 'Both'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Bundle ID</label>
                  <input value={bundleId} onChange={e => setBundleId(e.target.value)} placeholder="com.yourcompany.yourapp" className={`${inputClass} font-mono`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Use Case</label>
                  <textarea value={useCase} onChange={e => setUseCase(e.target.value)} placeholder="Describe what your app does and how it will use the Plaud SDK..." rows={4} className={`${inputClass} resize-none`} />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-slate-400 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-colors"
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!canProceedStep2}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                Create App <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Credentials */}
        {step === 3 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">App created!</h2>
              <p className="text-slate-400">Here are your credentials. Save them somewhere safe.</p>
            </div>

            {/* Warning banner */}
            <div className="flex items-start gap-3 mb-6 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-amber-300 mb-0.5">Copy your secret key now</div>
                <div className="text-xs text-amber-400/80">
                  This is the only time your secret key will be shown in full. We cannot display it again.
                  Store it securely in a password manager or secret manager.
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Client ID */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Client ID</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm text-slate-200 overflow-hidden">
                    <span className="truncate block">{clientId}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(clientId, 'id')}
                    className="p-2.5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-slate-400"
                  >
                    {copiedId ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              {/* Client Secret */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Secret Key</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2.5 bg-white/5 border border-amber-500/40 rounded-xl font-mono text-sm text-slate-200 overflow-hidden">
                    <span className="truncate block">{clientSecret}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(clientSecret, 'secret')}
                    className="p-2.5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-slate-400"
                  >
                    {copiedSecret ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirmation checkboxes */}
            <div className="space-y-3 mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedId}
                  onChange={e => setCheckedId(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-white/20 bg-white/5"
                />
                <span className="text-sm text-slate-300">I have copied my Client ID</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedSecret}
                  onChange={e => setCheckedSecret(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-white/20 bg-white/5"
                />
                <span className="text-sm text-slate-300">I have copied and securely stored my Secret Key</span>
              </label>
            </div>

            <button
              onClick={() => router.push(`/console/applications/${createdAppId}`)}
              disabled={!checkedId || !checkedSecret}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Go to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewApplicationPage() {
  return (
    <Suspense fallback={<div className="min-h-full bg-[#0d1117] flex items-center justify-center"><div className="text-slate-400">Loading...</div></div>}>
      <NewApplicationContent />
    </Suspense>
  );
}
