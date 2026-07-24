import { apiCall } from "@/actions/api";

interface CallOptions {
  url: string; // endpoint relatif (ex: 'members') ou absolu
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  raw?: boolean; // si true, renvoie un objet type Response (json() + headers.get)
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Toutes les requêtes passent par la Server Action apiCall :
 * le JWT reste dans un cookie httpOnly côté serveur Next,
 * le navigateur ne voit jamais ni token ni credentials.
 */
export const apiProvider = {
  async call<T = any>({
    url,
    method = "GET",
    body,
    headers = {},
    raw,
  }: CallOptions): Promise<T> {
    const res = await apiCall<T>({
      endpoint: url,
      method: method as HttpMethod,
      body,
      headers,
      includeTotal: raw,
    });

    if (!res.success) {
      throw new Error(res.error || "Erreur réseau");
    }

    if (raw) {
      // Shim compatible avec l'usage existant : res.json() + res.headers.get('X-Total-Count')
      const total = res.total;
      const shim = {
        json: async () => res.data,
        headers: {
          get: (name: string) =>
            name.toLowerCase() === "x-total-count" && total != null ? String(total) : null,
        },
      };
      return shim as unknown as T;
    }

    return res.data as T;
  },

  // Helper methods
  async get<T = any>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.call<T>({ url, method: "GET", headers });
  },

  async post<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.call<T>({ url, method: "POST", body, headers });
  },

  async put<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.call<T>({ url, method: "PUT", body, headers });
  },

  async delete<T = any>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.call<T>({ url, method: "DELETE", headers });
  },
};
