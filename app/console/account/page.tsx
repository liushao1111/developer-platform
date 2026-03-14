'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Tabs } from '@/components/ui/Tabs';
import { User, Shield, Bell } from 'lucide-react';

function ProfileTab() {
  const { user, addToast } = useStore();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    addToast({ message: 'Profile updated successfully', type: 'success' });
  };

  return (
    <div className="space-y-6 max-w-lg">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.avatarInitials}
        </div>
        <div>
          <button className="px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl text-sm hover:bg-white/5 transition-colors">
            Upload Photo
          </button>
          <p className="text-xs text-slate-500 mt-1.5">JPG, PNG or GIF, max 2MB</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <p className="text-xs text-slate-500 mt-1">Changing email requires verification</p>
      </div>

      <button
        onClick={handleSave}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
      >
        Save Profile
      </button>
    </div>
  );
}

function SecurityTab() {
  const { addToast } = useStore();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleChangePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      addToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    addToast({ message: 'Password updated successfully', type: 'success' });
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h3 className="text-base font-semibold text-white mb-4">Change Password</h3>
        <form onSubmit={handleChangePw} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPw}
              onChange={e => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-base font-semibold text-white mb-2">Two-Factor Authentication</h3>
        <div className="p-4 bg-slate-50 border border-white/10 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-300">2FA via Authenticator App</div>
            <div className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account</div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-white/10 text-slate-400 rounded-full">Coming Soon</span>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-white mb-2">Active Sessions</h3>
        <div className="border border-white/10 rounded-xl overflow-hidden">
          {[
            { device: 'MacBook Pro — Chrome', location: 'San Francisco, CA', time: 'Active now', current: true },
            { device: 'iPhone 15 — Safari', location: 'San Francisco, CA', time: '2 hours ago', current: false },
          ].map((session, i) => (
            <div key={i} className={`flex items-center justify-between p-4 ${i > 0 ? 'border-t border-white/5' : ''}`}>
              <div>
                <div className="text-sm font-medium text-white">{session.device}</div>
                <div className="text-xs text-slate-500">{session.location} · {session.time}</div>
              </div>
              {session.current ? (
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Current</span>
              ) : (
                <button className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const { addToast } = useStore();
  const [settings, setSettings] = useState({
    apiErrors: true,
    billingAlerts: true,
    newDevice: false,
    weeklyDigest: true,
    securityAlerts: true,
  });

  const handleSave = () => {
    addToast({ message: 'Notification preferences saved', type: 'success' });
  };

  const toggle = (key: keyof typeof settings) => {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  };

  const items = [
    { key: 'apiErrors' as const, label: 'API Error Alerts', description: 'Get notified when your app error rate exceeds 5%' },
    { key: 'billingAlerts' as const, label: 'Billing Alerts', description: 'Usage limit warnings and invoice notifications' },
    { key: 'newDevice' as const, label: 'New Device Connected', description: 'Receive an email when a new device registers to your SDK app' },
    { key: 'weeklyDigest' as const, label: 'Weekly Digest', description: 'Summary of your API usage and app performance' },
    { key: 'securityAlerts' as const, label: 'Security Alerts', description: 'Notifications about new sign-ins and secret key changes' },
  ];

  return (
    <div className="space-y-5 max-w-lg">
      <p className="text-sm text-slate-500">Control which emails and notifications you receive.</p>
      <div className="space-y-0 border border-white/10 rounded-2xl overflow-hidden">
        {items.map((item, i) => (
          <div key={item.key} className={`flex items-center justify-between p-4 ${i > 0 ? 'border-t border-white/5' : ''}`}>
            <div>
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${settings[item.key] ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors">
        Save Preferences
      </button>
    </div>
  );
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="min-h-full">
      <div className="bg-[#0d1117] border-b border-white/10 px-8 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">Account Settings</h1>
      </div>

      <div className="px-8 py-0 max-w-4xl mx-auto">
        <div className="overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="py-6">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}
