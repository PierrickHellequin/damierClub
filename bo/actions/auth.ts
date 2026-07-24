'use server';

import { cookies } from 'next/headers';
import type { User } from '@/types/member';
import { AUTH_TOKEN_COOKIE, SESSION_USER_COOKIE } from '@/lib/authCookies';

// En mode serveur (Docker), utiliser l'URL interne du container API
// En développement local, utiliser localhost
const API_BASE = process.env.API_BASE_INTERNAL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 12, // 12 h, aligné sur l'expiration du JWT
};

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface ApiAuthResponse {
  token: string;
  user: User;
}

async function storeSession(token: string, user: User): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_TOKEN_COOKIE, token, COOKIE_OPTIONS);
  // Infos d'affichage uniquement (nom, rôle...) - l'API ne fait confiance qu'au token
  cookieStore.set(SESSION_USER_COOKIE, JSON.stringify(user), COOKIE_OPTIONS);
}

/**
 * Connexion : le mot de passe transite uniquement entre le serveur Next et l'API.
 * Le JWT est stocké en cookie httpOnly, jamais accessible au JavaScript client.
 */
export async function loginAction(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}/api/internal/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 401) {
      return { success: false, error: 'Identifiants invalides' };
    }
    if (!res.ok) {
      return { success: false, error: 'Erreur serveur' };
    }

    const { token, user }: ApiAuthResponse = await res.json();
    await storeSession(token, user);
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Erreur de connexion' };
  }
}

/**
 * Inscription, puis connexion immédiate (l'API renvoie aussi un token).
 */
export async function registerAction(name: string, email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}/api/internal/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.status === 409) {
      return { success: false, error: 'Email déjà utilisé' };
    }
    if (!res.ok) {
      return { success: false, error: "Erreur d'inscription" };
    }

    const { token, user }: ApiAuthResponse = await res.json();
    await storeSession(token, user);
    return { success: true, user };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: "Erreur d'inscription" };
  }
}

/**
 * Déconnexion : suppression des cookies de session.
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(SESSION_USER_COOKIE);
}

/**
 * Utilisateur courant, lu depuis le cookie httpOnly (null si non connecté).
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get(AUTH_TOKEN_COOKIE)) {
      return null;
    }
    const raw = cookieStore.get(SESSION_USER_COOKIE)?.value;
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
