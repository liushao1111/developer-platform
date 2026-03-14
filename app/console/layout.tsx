import React from 'react';
import { ConsoleSidebar } from '@/components/layout/ConsoleSidebar';
import { ToastContainer } from '@/components/ui/Toast';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      <ConsoleSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
