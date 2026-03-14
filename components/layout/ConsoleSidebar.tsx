'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  HelpCircle,
  LogOut,
  Settings,
  ChevronDown,
  Check,
  Code2,
  BookOpen,
  Users,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const mainNavItems = [
  { href: '/console', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/console/applications', label: 'Applications', icon: Layers, exact: false },
];

const secondaryNavItems = [
  { href: '/console/playground', label: 'Playground', icon: Code2 },
  { href: '/console/community', label: 'Community', icon: Users },
  { href: '/console/support', label: 'Help Center', icon: HelpCircle },
];

type Theme = 'system' | 'dark' | 'light';

export function ConsoleSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserMenuOpen(false);
    router.push('/login');
  };

  return (
    <aside className="w-56 h-screen sticky top-0 bg-[#0d1117] border-r border-white/10 flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white font-black text-base tracking-tight">PLAUD</span>
          <span className="text-[10px] font-semibold bg-white/10 text-slate-300 border border-white/20 rounded px-1.5 py-0.5 leading-none">
            Platform
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {mainNavItems.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-1 space-y-0.5">
          {secondaryNavItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom pinned — Documentation + User */}
      <div className="border-t border-white/10">
        <div className="px-3 pt-3 pb-1">
          <Link
            href="/docs"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith('/docs')
                ? 'bg-white/10 text-white font-medium'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BookOpen size={15} />
            Documentation
          </Link>
        </div>

        {/* User dropdown */}
        <div className="px-3 pb-3 relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-left"
          >
            <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              {user.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
            </div>
            <ChevronDown
              size={13}
              className={`text-slate-500 flex-shrink-0 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-1 bg-[#161b22] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* Actions */}
              <div className="p-1">
                <Link
                  href="/console/account"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Settings size={14} />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>

              {/* Theme */}
              <div className="border-t border-white/10 px-4 py-2.5">
                <div className="text-xs font-medium text-slate-500 mb-1.5">Theme</div>
                {(['system', 'dark', 'light'] as Theme[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className="w-full flex items-center gap-2 py-1 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {theme === t
                      ? <Check size={12} className="text-white flex-shrink-0" />
                      : <span className="w-3 flex-shrink-0" />
                    }
                    {t === 'system' ? 'System setting' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
