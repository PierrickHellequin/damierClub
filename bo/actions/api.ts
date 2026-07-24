'use server';

import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE, SESSION_USER_COOKIE } from '@/lib/authCookies';

// En mode serveur (Docker), utiliser l'URL interne du container API
// En développement local, utiliser localhost
const API_BASE = process.env.API_BASE_INTERNAL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090';

interface ApiCallOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  /** Lire le header X-Total-Count (listes paginées) */
  includeTotal?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  /** Renseigné si includeTotal et header X-Total-Count présent */
  total?: number;
}

/**
 * Server Action générique pour appeler l'API backend
 * Toutes les requêtes passent par le serveur Next.js
 */
export async function apiCall<T = any>(options: ApiCallOptions): Promise<ApiResponse<T>> {
  const { endpoint, method = 'GET', body, headers = {}, includeTotal } = options;

  try {
    // JWT lu depuis le cookie httpOnly - jamais exposé au JavaScript client
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE);

    if (!tokenCookie) {
      return { success: false, error: 'Non authentifié' };
    }

    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE}/api/${endpoint.replace(/^\//, '')}`;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenCookie.value}`,
      ...headers,
    };

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      // Token invalide ou expiré : purge de la session
      cookieStore.delete(AUTH_TOKEN_COOKIE);
      cookieStore.delete(SESSION_USER_COOKIE);
      return { success: false, error: 'Session expirée' };
    }

    if (!response.ok) {
      return { success: false, error: `Erreur HTTP ${response.status}` };
    }

    const totalHeader = includeTotal ? response.headers.get('X-Total-Count') : null;
    const total = totalHeader != null ? parseInt(totalHeader, 10) : undefined;

    // Gérer les réponses vides (DELETE, etc.)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { success: true, data, total };
    }

    return { success: true, data: null as T, total };
  } catch (error) {
    console.error('API call error:', error);
    return { success: false, error: 'Erreur réseau' };
  }
}
