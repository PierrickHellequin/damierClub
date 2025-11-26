'use server';

import { cookies } from 'next/headers';

// En mode serveur (Docker), utiliser l'URL interne du container API
// En développement local, utiliser localhost
const API_BASE = process.env.API_BASE_INTERNAL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090';

interface ApiCallOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action générique pour appeler l'API backend
 * Toutes les requêtes passent par le serveur Next.js
 */
export async function apiCall<T = any>(options: ApiCallOptions): Promise<ApiResponse<T>> {
  const { endpoint, method = 'GET', body, headers = {} } = options;

  try {
    // Récupérer l'email de l'utilisateur depuis le cookie HTTP-only
    const cookieStore = await cookies();
    const userEmailCookie = cookieStore.get('user-email');

    if (!userEmailCookie) {
      return { success: false, error: 'Non authentifié' };
    }

    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE}/api/${endpoint.replace(/^\//, '')}`;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-User-Email': userEmailCookie.value,
      ...headers,
    };

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      // Session expirée, supprimer le cookie
      cookieStore.delete('user-email');
      return { success: false, error: 'Session expirée' };
    }

    if (!response.ok) {
      return { success: false, error: `Erreur HTTP ${response.status}` };
    }

    // Gérer les réponses vides (DELETE, etc.)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { success: true, data };
    }

    return { success: true, data: null as T };
  } catch (error) {
    console.error('API call error:', error);
    return { success: false, error: 'Erreur réseau' };
  }
}

// Actions spécifiques pour les principales opérations

/**
 * Notes
 */
export async function getNotesAction(filters?: any) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const queryString = params.toString();
  const endpoint = queryString ? `notes?${queryString}` : 'notes';
  return apiCall({ endpoint });
}

export async function createNoteAction(noteData: any) {
  return apiCall({ endpoint: 'notes', method: 'POST', body: noteData });
}

export async function updateNoteAction(id: string, noteData: any) {
  return apiCall({ endpoint: `notes/${id}`, method: 'PUT', body: noteData });
}

export async function deleteNoteAction(id: string) {
  return apiCall({ endpoint: `notes/${id}`, method: 'DELETE' });
}

/**
 * Clubs
 */
export async function getClubsAction(params?: any) {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  const queryString = queryParams.toString();
  const endpoint = queryString ? `clubs?${queryString}` : 'clubs';
  return apiCall({ endpoint });
}

export async function getClubAction(id: string) {
  return apiCall({ endpoint: `clubs/${id}` });
}

export async function createClubAction(clubData: any) {
  return apiCall({ endpoint: 'clubs', method: 'POST', body: clubData });
}

export async function updateClubAction(id: string, clubData: any) {
  return apiCall({ endpoint: `clubs/${id}`, method: 'PUT', body: clubData });
}

export async function deleteClubAction(id: string) {
  return apiCall({ endpoint: `clubs/${id}`, method: 'DELETE' });
}

/**
 * Membres
 */
export async function getMembersAction(params?: any) {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  const queryString = queryParams.toString();
  const endpoint = queryString ? `members?${queryString}` : 'members';
  return apiCall({ endpoint });
}

export async function getMemberAction(id: string) {
  return apiCall({ endpoint: `members/${id}` });
}

export async function createMemberAction(memberData: any) {
  return apiCall({ endpoint: 'internal/register', method: 'POST', body: memberData });
}

export async function updateMemberAction(id: string, memberData: any) {
  return apiCall({ endpoint: `members/${id}`, method: 'PUT', body: memberData });
}

export async function deleteMemberAction(id: string) {
  return apiCall({ endpoint: `members/${id}`, method: 'DELETE' });
}

/**
 * Articles
 */
export async function getArticlesAction(params?: any) {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  const queryString = queryParams.toString();
  const endpoint = queryString ? `articles?${queryString}` : 'articles';
  return apiCall({ endpoint });
}

export async function getArticleAction(id: string) {
  return apiCall({ endpoint: `articles/${id}` });
}

export async function createArticleAction(articleData: any) {
  return apiCall({ endpoint: 'articles', method: 'POST', body: articleData });
}

export async function updateArticleAction(id: string, articleData: any) {
  return apiCall({ endpoint: `articles/${id}`, method: 'PUT', body: articleData });
}

export async function deleteArticleAction(id: string) {
  return apiCall({ endpoint: `articles/${id}`, method: 'DELETE' });
}
