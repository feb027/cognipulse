'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthSession, LoginPayload } from '@/types/auth';

const STORAGE_KEY = 'cognipulse_auth_session';

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load session from storage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal masuk ke sistem');
    }

    setSession(data.session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.session));
    } catch (e) {
      console.error('Failed to save session to storage:', e);
    }
    return data.session as AuthSession;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  }, []);

  const updateDriverInSession = useCallback((updatedDriver: any) => {
    setSession((prev) => {
      if (prev && prev.role === 'driver') {
        const next = { ...prev, driver: updatedDriver };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  }, []);

  return {
    session,
    loading,
    isLoggedIn: Boolean(session),
    isDriver: session?.role === 'driver',
    isDispatcher: session?.role === 'dispatcher',
    login,
    logout,
    updateDriverInSession,
  };
}
