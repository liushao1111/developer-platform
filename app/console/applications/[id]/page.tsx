'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Plus,
  Trash2,
  AlertTriangle,
  Download,

  Tag,
  Radio,
  Battery,
  Wifi,
  WifiOff,
  ExternalLink,
  CreditCard,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { OAuthApp, SDKApp, mockDevices, mockLogs, mockAuthorizedUsers, mockInvoices } from '@/lib/mock-data';
import { StatusBadge } from '@/components/console/StatusBadge';
import { CredentialField } from '@/components/console/CredentialField';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-white mb-4">{children}</h3>;
}

function LogsTable() {
  const [range, setRange] = useState('7d');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockLogs.filter(log => {
    if (statusFilter === 'success') return log.statusCode < 400;
    if (statusFilter === 'error') return log.statusCode >= 400;
    return true;
  });

  const statusColor = (code: number) => {
    if (code < 300) return 'text-emerald-400 bg-emerald-500/10';
    if (code < 400) return 'text-blue-600 bg-blue-50';
    if (code < 500) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-500/10';
  };

  return (
    <div>
      {/* Chart placeholder */}
      <div className="mb-4 flex items-center gap-3">
        {['7d', '30d', '90d'].map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              range === r ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {r}
          </button>
        ))}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="ml-auto px-3 py-1.5 border border-white/10 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All statuses</option>
          <option value="success">Success (2xx)</option>
          <option value="error">Error (4xx/5xx)</option>
        </select>
      </div>

      {/* Fake chart */}
      <div className="bg-white/5 border border-white/10 rounded-xl h-32 mb-5 flex items-end gap-1 px-4 pb-3 overflow-hidden">
        {[40, 65, 50, 80, 60, 90, 70, 55, 75, 85, 60, 70, 45, 80].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-indigo-400 rounded-t opacity-80"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Timestamp</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Endpoint</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Latency</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Request ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(log => (
              <tr key={log.id}>
                <td className="py-2 text-xs text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</td>
                <td className="py-2 font-mono text-xs text-white">{log.endpoint}</td>
                <td className="py-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColor(log.statusCode)}`}>
                    {log.statusCode}
                  </span>
                </td>
                <td className="py-2 text-xs text-slate-500">{log.latency}ms</td>
                <td className="py-2 text-xs font-mono text-slate-400">{log.requestId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── OAuth App Tabs ────────────────────────────────────────────────────────────

function OAuthOverviewTab({ app }: { app: OAuthApp }) {
  const { addToast } = useStore();
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  const handleRegen = () => {
    setShowRegenConfirm(false);
    addToast({ message: 'Secret key regenerated. Update your app configuration.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Client Credentials</SectionTitle>
        <div className="space-y-4">
          <CredentialField label="Client ID" value={app.clientId} />
          <CredentialField
            label="Client Secret"
            value={app.clientSecret}
            masked
            allowReveal
            onRegenerate={() => setShowRegenConfirm(true)}
          />
        </div>
      </div>

      <div>
        <SectionTitle>App Info</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Created</div>
            <div className="text-sm font-medium text-white">
              {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Last Active</div>
            <div className="text-sm font-medium text-white">2 minutes ago</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Authorized Users</div>
            <div className="text-sm font-medium text-white">{app.authorizedUsers.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Error Rate</div>
            <div className="text-sm font-medium text-emerald-700">{app.errorRate}%</div>
          </div>
        </div>
      </div>

      <Modal isOpen={showRegenConfirm} onClose={() => setShowRegenConfirm(false)} title="Regenerate Secret Key">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-200 rounded-xl">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-400">
              Regenerating the secret key will <strong>immediately invalidate</strong> your current secret. Any app or service using the old secret will stop working until updated.
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowRegenConfirm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRegen}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Regenerate Secret
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const SCOPES = [
  { id: 'files:read', label: 'files:read', description: 'Read access to user files' },
  { id: 'transcripts:read', label: 'transcripts:read', description: 'Read access to transcripts' },
  { id: 'notes:read', label: 'notes:read', description: 'Read access to AI notes' },
];

function OAuthSettingsTab({ app }: { app: OAuthApp }) {
  const { updateApplication, addToast } = useStore();
  const [desc, setDesc] = useState(app.description);
  const [logoUrl, setLogoUrl] = useState(app.logoUrl);
  const [homepage, setHomepage] = useState(app.homepageUrl);
  const [redirectUris, setRedirectUris] = useState(app.redirectUris);
  const [scopes, setScopes] = useState(app.scopes);

  const handleSave = () => {
    updateApplication(app.id, { description: desc, logoUrl, homepageUrl: homepage, redirectUris, scopes } as Partial<OAuthApp>);
    addToast({ message: 'Settings saved', type: 'success' });
  };

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">App Description</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
        <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://yourapp.com/logo.png" className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Homepage URL</label>
        <input value={homepage} onChange={e => setHomepage(e.target.value)} placeholder="https://yourapp.com" type="url" className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Redirect URIs</label>
        <div className="space-y-2">
          {redirectUris.map((uri, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={uri}
                onChange={e => { const n = [...redirectUris]; n[idx] = e.target.value; setRedirectUris(n); }}
                className="flex-1 px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
              <button onClick={() => setRedirectUris(redirectUris.filter((_, i) => i !== idx))} className="p-2 text-red-400 hover:text-red-600 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {redirectUris.length < 5 && (
            <button onClick={() => setRedirectUris([...redirectUris, ''])} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              <Plus size={14} /> Add URI
            </button>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Scopes</label>
        <div className="space-y-2">
          {SCOPES.map(scope => (
            <label key={scope.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={scopes.includes(scope.id)}
                onChange={e => {
                  if (e.target.checked) setScopes([...scopes, scope.id]);
                  else setScopes(scopes.filter(s => s !== scope.id));
                }}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
              <div>
                <div className="text-sm font-mono font-medium text-white">{scope.label}</div>
                <div className="text-xs text-slate-500">{scope.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors">
        Save Changes
      </button>
    </div>
  );
}

function OAuthUsersTab({ app }: { app: OAuthApp }) {
  const { addToast } = useStore();
  const [showRevokeAll, setShowRevokeAll] = useState(false);
  const [users, setUsers] = useState(mockAuthorizedUsers);

  const handleRevoke = (userId: string) => {
    setUsers(u => u.filter(x => x.userId !== userId));
    addToast({ message: 'User access revoked', type: 'success' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-slate-500">{app.authorizedUsers} authorized users</div>
        <button
          onClick={() => setShowRevokeAll(true)}
          className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-500/10 transition-colors"
        >
          Revoke All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">User ID</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Authorized</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Scopes</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Last Active</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(user => (
              <tr key={user.userId}>
                <td className="py-3 font-mono text-xs text-slate-300">{user.userId}</td>
                <td className="py-3 text-xs text-slate-500">{user.authorizedDate}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.scopes.map(s => (
                      <span key={s} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-mono">{s}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-xs text-slate-500">{user.lastActive}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => handleRevoke(user.userId)}
                    className="text-xs text-red-400 hover:text-red-400 font-medium transition-colors"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showRevokeAll} onClose={() => setShowRevokeAll(false)} title="Revoke All Users">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            This will immediately revoke access for all <strong>{app.authorizedUsers} authorized users</strong>. They will need to re-authorize to continue using your app.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowRevokeAll(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
            <button
              onClick={() => { setShowRevokeAll(false); setUsers([]); addToast({ message: 'All user access revoked', type: 'success' }); }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Revoke All
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function OAuthDangerTab({ app }: { app: OAuthApp }) {
  const { removeApplication, addToast } = useStore();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  const handleDelete = () => {
    removeApplication(app.id);
    addToast({ message: `${app.name} has been deleted`, type: 'success' });
    router.push('/console/applications');
  };

  return (
    <div>
      <div className="border-2 border-red-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-red-900 mb-1">Delete Application</h3>
        <p className="text-sm text-red-400 mb-4">
          This will immediately revoke access for all <strong>{app.authorizedUsers} authorized users</strong> and delete all app data. This cannot be undone.
        </p>
        <button
          onClick={() => setShowDelete(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Delete Application
        </button>
      </div>

      <Modal isOpen={showDelete} onClose={() => { setShowDelete(false); setConfirmName(''); }} title="Delete Application">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-200 rounded-xl">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">
              This will <strong>permanently delete</strong> &quot;{app.name}&quot; and revoke access for all {app.authorizedUsers} authorized users. This action cannot be undone.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-white">{app.name}</span> to confirm
            </label>
            <input
              value={confirmName}
              onChange={e => setConfirmName(e.target.value)}
              placeholder={app.name}
              className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowDelete(false); setConfirmName(''); }} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
            <button
              onClick={handleDelete}
              disabled={confirmName !== app.name}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── SDK App Tabs ──────────────────────────────────────────────────────────────

function SDKOverviewTab({ app }: { app: SDKApp }) {
  const { addToast } = useStore();
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  const handleRegen = () => {
    setShowRegenConfirm(false);
    addToast({ message: 'Secret key regenerated.', type: 'success' });
  };

  return (
    <div className="space-y-6">

      <div>
        <SectionTitle>Client Credentials</SectionTitle>
        <div className="space-y-4">
          <CredentialField label="Client ID" value={app.clientId} />
          <CredentialField
            label="Client Secret"
            value={app.clientSecret}
            masked
            allowReveal
            onRegenerate={() => setShowRegenConfirm(true)}
          />
        </div>
      </div>

      <div>
        <SectionTitle>App Info</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Platform</div>
            <div className="text-sm font-medium text-slate-800 capitalize">{app.platform}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Bundle ID</div>
            <div className="text-sm font-mono font-medium text-white">{app.bundleId}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Active Devices</div>
            <div className="text-sm font-medium text-white">{app.activeDevices}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">API Calls Today</div>
            <div className="text-sm font-medium text-white">{app.apiCallsToday.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <Modal isOpen={showRegenConfirm} onClose={() => setShowRegenConfirm(false)} title="Regenerate Secret Key">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-200 rounded-xl">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-400">Regenerating will immediately invalidate your current secret. Update all devices.</div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowRegenConfirm(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
            <button onClick={handleRegen} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">Regenerate</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

function SDKSettingsTab({ app }: { app: SDKApp }) {
  const { updateApplication, addToast } = useStore();
  const [platform, setPlatform] = useState(app.platform);
  const [bundleId, setBundleId] = useState(app.bundleId);
  const [useCase, setUseCase] = useState(app.useCase);

  const handleSave = () => {
    updateApplication(app.id, { platform, bundleId, useCase } as Partial<SDKApp>);
    addToast({ message: 'Settings saved', type: 'success' });
  };

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
        <div className="flex gap-3">
          {(['ios', 'android', 'both'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                platform === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/5 text-slate-300 border-white/10 hover:border-indigo-500/40'
              }`}
            >
              {p === 'ios' ? 'iOS' : p === 'android' ? 'Android' : 'Both'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Bundle ID</label>
        <input value={bundleId} onChange={e => setBundleId(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Use Case</label>
        <textarea value={useCase} onChange={e => setUseCase(e.target.value)} rows={4} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 resize-none" />
      </div>
      <button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors">
        Save Changes
      </button>
    </div>
  );
}

function SDKDownloadTab({ app }: { app: SDKApp }) {
  const { addToast } = useStore();
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast({ message: 'Code copied to clipboard', type: 'success' });
  };

  const swiftPackage = `.package(url: "https://github.com/plaud/plaud-ios-sdk.git", from: "2.1.0")`;
  const maven = `implementation("ai.plaud:sdk-android:2.1.0")`;
  const initCode = `import PlaudSDK

// Initialize with your Client ID
PlaudSDK.initialize(
  clientId: "${app.clientId}",
  // clientId is used to authenticate with the Plaud SDK
)

// Connect to a device
PlaudSDK.connect(serial: "PLN-2024-001A") { device in
  device.startRecording()
}`;

  return (
    <div className="space-y-6">
      {(app.platform === 'ios' || app.platform === 'both') && (
        <div>
          <SectionTitle>Install via Swift Package Manager</SectionTitle>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-200 relative">
            <button
              onClick={() => copyCode(swiftPackage)}
              className="absolute top-3 right-3 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-400 transition-colors"
            >
              <Download size={13} />
            </button>
            <pre className="whitespace-pre-wrap break-all pr-8">{swiftPackage}</pre>
          </div>
        </div>
      )}

      {(app.platform === 'android' || app.platform === 'both') && (
        <div>
          <SectionTitle>Install via Maven (Android)</SectionTitle>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-200 relative">
            <button
              onClick={() => copyCode(maven)}
              className="absolute top-3 right-3 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-400 transition-colors"
            >
              <Download size={13} />
            </button>
            <pre className="whitespace-pre-wrap">{maven}</pre>
          </div>
        </div>
      )}

      <div>
        <SectionTitle>Initialization Code</SectionTitle>
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-200 relative">
          <button
            onClick={() => copyCode(initCode)}
            className="absolute top-3 right-3 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-400 transition-colors"
          >
            <Download size={13} />
          </button>
          <pre className="whitespace-pre-wrap pr-8">{initCode}</pre>
        </div>
      </div>

      <div>
        <a
          href="#"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

function SDKDevicesTab({ app }: { app: SDKApp }) {
  const { addToast } = useStore();
  const [showOTA, setShowOTA] = useState(false);
  const [otaVersion, setOtaVersion] = useState('v2.5.0');
  const [otaGroup, setOtaGroup] = useState('all');

  const statusIcon = (status: string) => {
    if (status === 'active') return <Wifi size={14} className="text-emerald-500" />;
    if (status === 'low_battery') return <Battery size={14} className="text-amber-500" />;
    return <WifiOff size={14} className="text-slate-400" />;
  };

  const statusLabel = (status: string) => {
    if (status === 'active') return 'bg-emerald-500/100/20 text-emerald-400';
    if (status === 'low_battery') return 'bg-amber-500/20 text-amber-400';
    return 'bg-slate-100 text-slate-500';
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-emerald-500/10 border border-emerald-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-emerald-700">{app.activeDevices}</div>
          <div className="text-xs text-emerald-400 font-medium">Active</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{app.lowBatteryDevices}</div>
          <div className="text-xs text-amber-600 font-medium">Low Battery</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-slate-300">{app.offlineDevices}</div>
          <div className="text-xs text-slate-500 font-medium">Offline</div>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-2 mb-4">
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-sm text-slate-600 hover:bg-white/5 transition-colors">
          <Tag size={13} /> Tag
        </button>
        <button
          onClick={() => setShowOTA(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-sm text-slate-600 hover:bg-white/5 transition-colors"
        >
          <Radio size={13} /> Push OTA
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-500/10 transition-colors">
          <Trash2 size={13} /> Deregister
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Serial</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Model</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Battery</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Firmware</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Last Seen</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Tags</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockDevices.map(device => (
              <tr key={device.serial}>
                <td className="py-3 font-mono text-xs text-slate-300">{device.serial}</td>
                <td className="py-3 text-xs text-slate-400">{device.model}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusLabel(device.status)}`}>
                    {statusIcon(device.status)}
                    {device.status === 'active' ? 'Active' : device.status === 'low_battery' ? 'Low Battery' : 'Offline'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${device.battery > 20 ? 'bg-emerald-500/100' : 'bg-red-500/100'}`}
                        style={{ width: `${device.battery}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{device.battery}%</span>
                  </div>
                </td>
                <td className="py-3 text-xs font-mono text-slate-500">{device.firmware}</td>
                <td className="py-3 text-xs text-slate-500">{device.lastSeen}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {device.tags.map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-right">
                  <button className="text-xs text-red-400 hover:text-red-400 font-medium transition-colors">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showOTA} onClose={() => setShowOTA(false)} title="Push OTA Update">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Firmware Version</label>
            <select
              value={otaVersion}
              onChange={e => setOtaVersion(e.target.value)}
              className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="v2.5.0">v2.5.0 (Latest)</option>
              <option value="v2.4.1">v2.4.1</option>
              <option value="v2.4.0">v2.4.0</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Device Group</label>
            <select
              value={otaGroup}
              onChange={e => setOtaGroup(e.target.value)}
              className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Devices ({app.activeDevices} active)</option>
              <option value="team-a">Tag: team-a (2 devices)</option>
              <option value="field">Tag: field (2 devices)</option>
              <option value="office">Tag: office (2 devices)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
            <select className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
              <option>Push immediately</option>
              <option>Schedule for tonight (2am)</option>
              <option>Custom time...</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowOTA(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
            <button
              onClick={() => { setShowOTA(false); addToast({ message: `OTA update ${otaVersion} queued for ${otaGroup} devices`, type: 'success' }); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Push Update
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const FREE_DEVICES = 1;
const FREE_ASR_MINUTES = 3000; // 50 hours
const PRICE_PER_DEVICE = 5;

function SDKBillingTab({ app }: { app: SDKApp }) {
  const asrPct = Math.min((app.asrMinutesUsed / FREE_ASR_MINUTES) * 100, 100);
  const asrOverageMinutes = Math.max(app.asrMinutesUsed - FREE_ASR_MINUTES, 0);
  const billableDevices = Math.max(app.activeDevices - FREE_DEVICES, 0);
  const deviceCharges = billableDevices * PRICE_PER_DEVICE;
  const asrCharges = parseFloat((asrOverageMinutes * 0.006).toFixed(2)); // $0.006/min overage
  const estimatedTotal = deviceCharges + asrCharges;

  return (
    <div className="space-y-6">

      {/* Free tier summary */}
      <div>
        <SectionTitle>Free Tier</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Devices</div>
            <div className="text-lg font-bold text-white">{app.activeDevices} <span className="text-sm font-normal text-slate-400">connected</span></div>
            <div className="text-xs text-slate-500 mt-1">
              {app.activeDevices <= FREE_DEVICES
                ? <span className="text-emerald-400">✓ Within free tier (1 free)</span>
                : <span className="text-amber-400">{billableDevices} billed · ${deviceCharges}/mo</span>
              }
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">ASR Usage</div>
            <div className="text-lg font-bold text-white">{Math.floor(app.asrMinutesUsed / 60)}h {app.asrMinutesUsed % 60}m</div>
            <div className="text-xs text-slate-500 mt-1">
              {asrOverageMinutes === 0
                ? <span className="text-emerald-400">✓ Within free tier (50h/mo)</span>
                : <span className="text-amber-400">{Math.floor(asrOverageMinutes / 60)}h {asrOverageMinutes % 60}m over · ${asrCharges}</span>
              }
            </div>
          </div>
        </div>

        {/* ASR progress bar */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">ASR this billing cycle</span>
            <span className="text-sm font-medium text-white">{app.asrMinutesUsed} / {FREE_ASR_MINUTES} min free</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${asrPct >= 100 ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${asrPct}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">{asrPct.toFixed(0)}% of free tier used</div>
        </div>
      </div>

      {/* Estimated charges */}
      <div>
        <SectionTitle>Estimated Charges This Cycle</SectionTitle>
        <div className="bg-white/5 border border-white/10 rounded-xl divide-y divide-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-400">Additional devices ({billableDevices} × $5)</span>
            <span className="text-sm font-medium text-white">${deviceCharges.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-400">ASR overage ({asrOverageMinutes} min × $0.006)</span>
            <span className="text-sm font-medium text-white">${asrCharges.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-b-xl">
            <span className="text-sm font-semibold text-white">Total</span>
            <span className="text-sm font-bold text-white">${estimatedTotal.toFixed(2)}</span>
          </div>
        </div>
        {estimatedTotal === 0 && (
          <p className="text-xs text-emerald-400 mt-2">You&apos;re within the free tier — no charges this cycle.</p>
        )}
      </div>

      {/* Payment method */}
      <div>
        <SectionTitle>Payment Method</SectionTitle>
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <CreditCard size={18} className="text-slate-500" />
            <div>
              <div className="text-sm font-medium text-white">Visa ending in 4242</div>
              <div className="text-xs text-slate-500">Expires 12/2027</div>
            </div>
          </div>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Update</button>
        </div>
      </div>

      {/* Invoices */}
      <div>
        <SectionTitle>Invoices</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2">Status</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockInvoices.map(inv => (
                <tr key={inv.id}>
                  <td className="py-3 text-sm text-slate-300">{inv.date}</td>
                  <td className="py-3 text-sm font-medium text-white">${inv.amount.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {inv.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 ml-auto transition-colors">
                      <Download size={11} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SDKDangerTab({ app }: { app: SDKApp }) {
  const { removeApplication, addToast } = useStore();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  const handleDelete = () => {
    removeApplication(app.id);
    addToast({ message: `${app.name} has been deleted`, type: 'success' });
    router.push('/console/applications');
  };

  return (
    <div>
      <div className="border-2 border-red-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-red-900 mb-1">Delete Application</h3>
        <p className="text-sm text-red-400 mb-4">
          This will deregister all <strong>{app.activeDevices} connected devices</strong> and delete all app data. This cannot be undone.
        </p>
        <button onClick={() => setShowDelete(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors">
          Delete Application
        </button>
      </div>

      <Modal isOpen={showDelete} onClose={() => { setShowDelete(false); setConfirmName(''); }} title="Delete Application">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-200 rounded-xl">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">
              This will <strong>permanently delete</strong> &quot;{app.name}&quot; and deregister all {app.activeDevices} connected devices.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-white">{app.name}</span> to confirm
            </label>
            <input
              value={confirmName}
              onChange={e => setConfirmName(e.target.value)}
              placeholder={app.name}
              className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowDelete(false); setConfirmName(''); }} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
            <button
              onClick={handleDelete}
              disabled={confirmName !== app.name}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AppDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { applications } = useStore();
  const router = useRouter();

  const app = applications.find(a => a.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!app) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 mb-2">App not found</div>
          <button onClick={() => router.push('/console/applications')} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const oauthTabs = [
    { id: 'overview', label: 'Overview & Credentials' },
    { id: 'settings', label: 'OAuth Settings' },
    { id: 'users', label: 'Authorized Users' },
    { id: 'logs', label: 'Usage & Logs' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  const sdkTabs = [
    { id: 'overview', label: 'Overview & Credentials' },
    { id: 'settings', label: 'SDK Settings' },
    { id: 'download', label: 'SDK Download' },
    { id: 'devices', label: 'Device Management' },
    { id: 'logs', label: 'Usage & Logs' },
    { id: 'billing', label: 'Billing' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  const tabs = app.type === 'oauth' ? oauthTabs : sdkTabs;

  return (
    <div className="min-h-full">
      {/* Top Bar */}
      <div className="bg-[#0d1117] border-b border-white/10 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => router.push('/console/applications')}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">{app.name}</h1>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
            app.type === 'oauth' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
          }`}>
            {app.type === 'oauth' ? 'OAuth' : 'SDK'}
          </span>
          <StatusBadge status={app.status} />
        </div>
        <div className="text-xs text-slate-400 ml-8">
          Created {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="px-8 py-0 max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {app.type === 'oauth' ? (
            <>
              {activeTab === 'overview' && <OAuthOverviewTab app={app as OAuthApp} />}
              {activeTab === 'settings' && <OAuthSettingsTab app={app as OAuthApp} />}
              {activeTab === 'users' && <OAuthUsersTab app={app as OAuthApp} />}
              {activeTab === 'logs' && <LogsTable />}
              {activeTab === 'danger' && <OAuthDangerTab app={app as OAuthApp} />}
            </>
          ) : (
            <>
              {activeTab === 'overview' && <SDKOverviewTab app={app as SDKApp} />}
              {activeTab === 'settings' && <SDKSettingsTab app={app as SDKApp} />}
              {activeTab === 'download' && <SDKDownloadTab app={app as SDKApp} />}
              {activeTab === 'devices' && <SDKDevicesTab app={app as SDKApp} />}
              {activeTab === 'logs' && <LogsTable />}
              {activeTab === 'billing' && <SDKBillingTab app={app} />}
              {activeTab === 'danger' && <SDKDangerTab app={app as SDKApp} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
