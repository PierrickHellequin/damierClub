"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@/types/member';

// Types utilisateur et contexte

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  fetchAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090';
const STORAGE_KEY = 'sessionUser';

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
    return [...new Uint8Array(sigBuf)].map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    const { createHmac } = await import('crypto');
    return createHmac('sha256', secret).update(payload).digest('hex');
  }
}

interface AuthProviderProps { children: ReactNode }

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  function persist(u: User) {
    setUser(u);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch { }
  }

  async function login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/api/internal/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.status === 401) throw new Error('Identifiants invalides');
    if (!res.ok) throw new Error('Erreur serveur');
    const data: User = await res.json();
    persist(data);
    return data;
  }

  async function register(name: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/api/internal/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (res.status === 409) throw new Error('Email déjà utilisé');
    if (!res.ok) throw new Error("Erreur d'inscription");
    const data: User = await res.json();
    persist(data);
    return data;
  }

  function logout() {
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
  }

  const fetchAuth = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    if (!user) throw new Error('Non authentifié');
    const ts = Math.floor(Date.now() / 1000).toString();
    const secret = process.env.NEXT_PUBLIC_HMAC_SECRET || 'dev-hmac-secret';
    const payload = `${user.email}:${ts}`;
    const sig = await hmacSha256Hex(secret, payload);
    const headers = { ...(options.headers || {}), 'X-User-Email': user.email, 'X-Auth-Timestamp': ts, 'X-Auth-Signature': sig } as Record<string, string>;
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) logout();
    return res;
  }, [user]);

  const value: AuthContextValue = { user, loading, login, register, logout, fetchAuth };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
