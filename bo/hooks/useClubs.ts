import { useEffect, useState, useRef, useCallback } from "react";
import { Club } from "@/types/member";
import { useAuth } from "@/components/AuthProvider";
import { clubProvider } from "@/providers/clubProvider";

interface UseClubsOptions {
  enabled?: boolean;
  page?: number;
  pageSize?: number;
  sort?: string;
}

interface UseClubsResult {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createClub: (values: Partial<Club>) => Promise<Club | null>;
  updateClub: (id: string, values: Partial<Club>) => Promise<Club | null>;
  deleteClub: (id: string) => Promise<void>;
  total: number;
}

export default function useClubs(
  options: UseClubsOptions = {}
): UseClubsResult {
  const { enabled = true, page = 1, pageSize = 20, sort } = options;
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!enabled || !user) return;
    setLoading(true);
    setError(null);

    try {
      const order = sort
        ? (() => {
            const [field, dir] = sort.split(",");
            return { field, direction: (dir as any) || "asc" };
          })()
        : undefined;

      const resp = await clubProvider.listClubs({
        page,
        pageSize,
        sort: order,
      });

      console.log("🔄 useClubs - Response:", resp);
      if (mounted.current) {
        console.log("✅ useClubs - Setting clubs:", resp.data);
        setClubs(resp.data);
        setTotal(resp.total);
      }
    } catch (e: any) {
      if (mounted.current) setError(e.message || "Erreur inconnue");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [enabled, user, page, pageSize, sort]);

  useEffect(() => {
    if (user && enabled) load();
  }, [load, user, enabled]);

  const refetch = useCallback(async () => {
    await load();
  }, [load]);

  const createClub = useCallback(
    async (values: Partial<Club>) => {
      if (!user) return null;
      const saved = await clubProvider.createClub(values);
      await refetch();
      return saved;
    },
    [user, refetch]
  );

  const updateClub = useCallback(
    async (id: string, values: Partial<Club>) => {
      if (!user) return null;
      const saved = await clubProvider.updateClub(id, values);
      await refetch();
      return saved;
    },
    [user, refetch]
  );

  const deleteClub = useCallback(
    async (id: string) => {
      await clubProvider.deleteClub(id);
      await refetch();
    },
    [refetch]
  );

  return {
    clubs,
    loading,
    error,
    refetch,
    createClub,
    updateClub,
    deleteClub,
    total,
  };
}
