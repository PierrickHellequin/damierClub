import { useEffect, useState, useRef, useCallback } from "react";
import { Member } from "@/types/member";
import { useAuth } from "@/components/AuthProvider";
import { memberProvider } from "@/providers/memberProvider";

interface UseMembersOptions {
  enabled?: boolean;
  page?: number; // 1-based
  pageSize?: number;
  sort?: string;
}

interface UseMembersResult {
  members: Member[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  upsertMember: (
    id: string | null,
    values: Partial<Member> & { password?: string }
  ) => Promise<Member | null>;
  deleteMember: (id: string) => Promise<void>;
  lastUpdated: number | null;
  total: number;
}

export default function useMembers(
  options: UseMembersOptions = {}
): UseMembersResult {
  const { enabled = true, page = 1, pageSize = 20, sort } = options;
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);
  const mounted = useRef(true);
  const lastParamsRef = useRef<string>("");
  const loadingRef = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function load(force = false) {
    if (!enabled || !user) return;
    if (loadingRef.current && !force) return;
    const paramsKey = `${page}|${pageSize}|${sort || ""}`;
    if (!force && lastParamsRef.current === paramsKey && lastUpdated) return;

    lastParamsRef.current = paramsKey;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const order = sort
        ? (() => {
            const [field, dir] = sort.split(",");
            return { field, direction: (dir as any) || "asc" };
          })()
        : undefined;
      const resp = await memberProvider.listMembers({
        page,
        pageSize,
        sort: order,
      });

      if (mounted.current) {
        setMembers(resp.data);
        setTotal(resp.total);
        setLastUpdated(Date.now());
      }
    } catch (e: any) {
      if (mounted.current) setError(e.message || "Erreur inconnue");
    } finally {
      loadingRef.current = false;
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (user && enabled) {
      load();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [enabled, user, page, pageSize, sort]);

  const refetch = useCallback(async () => {
    await load(true);
  }, [page, pageSize, sort, user]);

  const upsertMember = useCallback(
    async (
      id: string | null,
      values: Partial<Member> & { password?: string }
    ) => {
      if (!user) return null;
      const saved = id
        ? await memberProvider.updateMember(id, values)
        : await memberProvider.createMember(values);
      await refetch();
      return saved;
    },
    [user, refetch]
  );

  const deleteMember = useCallback(
    async (id: string) => {
      await memberProvider.deleteMember(id);
      await refetch();
    },
    [refetch]
  );

  return {
    members,
    loading,
    error,
    refetch,
    upsertMember,
    deleteMember,
    lastUpdated,
    total,
  };
}
