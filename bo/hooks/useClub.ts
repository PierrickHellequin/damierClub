import { useState, useEffect, useCallback } from "react";
import { Club } from "@/types/member";
import { useAuth } from "@/components/AuthProvider";
import { clubProvider } from "@/providers/clubProvider";

interface UseClubOptions {
  enabled?: boolean;
}

export default function useClub(id: string | null, options?: UseClubOptions) {
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const enabled = options?.enabled !== false;

  const load = useCallback(async () => {
    if (!user || !id || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await clubProvider.getClub(id);
      setClub(data);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [user, id, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { club, loading, error, reload: load };
}
