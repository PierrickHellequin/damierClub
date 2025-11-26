'use server';

import { cookies } from 'next/headers';
import type { User } from '@/types/member';

// En mode serveur (Docker), utiliser l'URL interne du container API
// En développement local, utiliser localhost
const API_BASE = process.env.API_BASE_INTERNAL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090';

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Server Action pour la connexion
 * Le mot de passe n'est jamais exposé côté client
 */
export async function loginAction(email: string, password: string): Promise<LoginResponse> {
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

    const user: User = await res.json();

    // Stocker le token ou session dans un cookie HTTP-only pour plus de sécurité
    const cookieStore = await cookies();
    cookieStore.set('user-email', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Erreur de connexion' };
  }
}

/**
 * Server Action pour l'inscription
 * Le mot de passe n'est jamais exposé côté client
 */
export async function registerAction(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
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

    const user: User = await res.json();

    // Stocker le token ou session dans un cookie HTTP-only
    const cookieStore = await cookies();
    cookieStore.set('user-email', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return { success: true, user };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: "Erreur d'inscription" };
  }
}

/**
 * Server Action pour la déconnexion
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('user-email');
}

/**
 * Server Action pour récupérer l'utilisateur courant depuis le cookie
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user-email');

    if (!userEmail) {
      return null;
    }

    // Vous pouvez ici faire un appel API pour récupérer les infos complètes de l'utilisateur
    // Pour l'instant on retourne juste l'email depuis le cookie
    // Dans une vraie application, il faudrait valider la session côté serveur

    return null; // À implémenter selon vos besoins
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
