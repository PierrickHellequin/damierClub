import { ApiListResponse } from "@/types/api";
import { Member } from "@/types/member";

interface CallOptions {
  url: string; // endpoint relatif (ex: 'members') ou absolu
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  raw?: boolean; // si true, ne parse pas JSON
}

function getBase() {
  return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8090";
}

async function buildAuthHeaders(): Promise<Record<string, string>> {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("sessionUser") : null;
  if (!raw) return {};
  try {
    const user: Member = JSON.parse(raw);
    return {
      "X-User-Email": user.email,
    };
  } catch {
    return {};
  }
}

export const apiProvider = {
  async call<T = any>({
    url,
    method = "GET",
    body,
    headers = {},
    raw,
  }: CallOptions): Promise<T> {
    const isAbsolute = /^https?:\/\//.test(url);
    const fullUrl = isAbsolute
      ? url
      : `${getBase()}/api/${url.replace(/^\//, "")}`;
    const authHeaders = await buildAuthHeaders();
    const res = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": body ? "application/json" : "text/plain",
        ...headers,
        ...authHeaders,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) {
      try {
        localStorage.removeItem("sessionUser");
      } catch {}
      throw new Error("Non autorisé");
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (raw) return res as unknown as T;
    return res.json() as Promise<T>;
  },
};
