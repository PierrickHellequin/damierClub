import { useState, useEffect, useCallback } from "react";
import { Member } from "@/types/member";
import { useAuth } from "@/components/AuthProvider";
import { memberProvider } from "@/providers/memberProvider";

export default function useMember(id: number | null) {
  const { user } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user || !id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await memberProvider.getMember(id);
      setMember(data);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    load();
  }, [load]);

  return { member, loading, error, reload: load };
}
