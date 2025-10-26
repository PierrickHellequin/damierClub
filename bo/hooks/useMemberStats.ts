import { useState, useEffect } from 'react';
import { memberStatsProvider } from '@/providers/memberStatsProvider';
import { MemberStats } from '@/types/memberStats';

interface UseMemberStatsOptions {
  enabled?: boolean;
}

export default function useMemberStats(
  memberId: string | null | undefined,
  options: UseMemberStatsOptions = {}
) {
  const { enabled = true } = options;
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId || !enabled) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await memberStatsProvider.getMemberStats(memberId);
        setStats(data);
      } catch (err: any) {
        console.error('Error fetching member stats:', err);
        setError(err.message || 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [memberId, enabled]);

  return { stats, loading, error };
}
