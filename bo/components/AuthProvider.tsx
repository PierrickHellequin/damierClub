"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/member';
import { loginAction, registerAction, logoutAction, getCurrentUser } from '@/actions/auth';

// La session vit dans des cookies httpOnly côté serveur :
// ce provider ne stocke rien dans le navigateur (ni localStorage, ni cookie lisible).

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps { children: ReactNode }

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((u) => { if (active) setUser(u); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function login(email: string, password: string): Promise<User> {
    const res = await loginAction(email, password);
    if (!res.success || !res.user) throw new Error(res.error || 'Erreur de connexion');
    setUser(res.user);
    return res.user;
  }

  async function register(name: string, email: string, password: string): Promise<User> {
    const res = await registerAction(name, email, password);
    if (!res.success || !res.user) throw new Error(res.error || "Erreur d'inscription");
    setUser(res.user);
    return res.user;
  }

  async function logout(): Promise<void> {
    await logoutAction();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
