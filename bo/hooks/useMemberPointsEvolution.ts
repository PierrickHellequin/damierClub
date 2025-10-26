import { useState, useEffect } from 'react';
import { memberStatsProvider } from '@/providers/memberStatsProvider';
import { PointsEvolution } from '@/types/memberStats';

interface UseMemberPointsEvolutionOptions {
  enabled?: boolean;
}

export default function useMemberPointsEvolution(
  memberId: string | null | undefined,
  options: UseMemberPointsEvolutionOptions = {}
) {
  const { enabled = true } = options;
  const [evolution, setEvolution] = useState<PointsEvolution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId || !enabled) return;

    const fetchEvolution = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await memberStatsProvider.getMemberPointsEvolution(memberId);
        setEvolution(data);
      } catch (err: any) {
        console.error('Error fetching points evolution:', err);
        setError(err.message || 'Erreur lors du chargement de l\'évolution des points');
      } finally {
        setLoading(false);
      }
    };

    fetchEvolution();
  }, [memberId, enabled]);

  return { evolution, loading, error };
}
