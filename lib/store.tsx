'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUser, mockApplications, Application } from './mock-data';

interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

interface StoreContextType {
  user: User;
  applications: Application[];
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  addApplication: (app: Application) => void;
  removeApplication: (id: string) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>(mockUser);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addApplication = (app: Application) => {
    setApplications(prev => [app, ...prev]);
  };

  const removeApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(prev =>
      prev.map(app => app.id === id ? { ...app, ...updates } as Application : app)
    );
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      user,
      applications,
      selectedAppId,
      setSelectedAppId,
      addApplication,
      removeApplication,
      updateApplication,
      toasts,
      addToast,
      removeToast,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
