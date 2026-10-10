'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthSession, LoginPayload } from '@/types/auth';

const STORAGE_KEY = 'cognipulse_auth_session';

/** Baca token dari storage dan format sebagai Authorization header. */
export function getAuthHeader(): HeadersInit {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const session = stored ? JSON.parse(stored) : null;
    if (session?.token) return { Authorization: `Bearer ${session.token}` };
  } catch {}
  return {};
}

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncSession = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setSession(stored ? JSON.parse(stored) : null);
      } catch (e) {
        console.error('Failed to load session:', e);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    syncSession();
    window.addEventListener('storage', syncSession);
    window.addEventListener('cognipulse_auth_change', syncSession);
    return () => {
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('cognipulse_auth_change', syncSession);
    };
  }, []);

  const setSessionDirect = useCallback((newSession: AuthSession | null) => {
    setSession(newSession);
    try {
      if (newSession) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
    window.dispatchEvent(new Event('cognipulse_auth_change'));
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

    setSessionDirect(data.session);
    return data.session as AuthSession;
  }, [setSessionDirect]);

  const logout = useCallback(() => {
    setSessionDirect(null);
  }, [setSessionDirect]);

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
    setSessionDirect,
    updateDriverInSession,
    getAuthHeader: () => (session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
  };
}
