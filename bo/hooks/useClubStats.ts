import { useState, useEffect } from 'react';
import { clubProvider } from '@/providers/clubProvider';
import { ClubStats } from '@/types/clubStats';

interface UseClubStatsOptions {
  enabled?: boolean;
}

export default function useClubStats(
  clubId: string | null | undefined,
  options: UseClubStatsOptions = {}
) {
  const { enabled = true } = options;
  const [stats, setStats] = useState<ClubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId || !enabled) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await clubProvider.getClubStats(clubId);
        setStats(data);
      } catch (err: any) {
        console.error('Error fetching club stats:', err);
        setError(err.message || 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [clubId, enabled]);

  return { stats, loading, error };
}
