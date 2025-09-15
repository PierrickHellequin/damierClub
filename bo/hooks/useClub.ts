import { useState, useEffect, useCallback } from "react";
import { Club } from "@/types/member";
import { useAuth } from "@/components/AuthProvider";
import { clubProvider } from "@/providers/clubProvider";

export default function useClub(id: number | null) {
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user || !id) return;
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
  }, [user, id]);

  useEffect(() => {
    load();
  }, [load]);

  return { club, loading, error, reload: load };
}
