import { useState, useEffect } from 'react';
import { tournamentProvider } from '@/providers/tournamentProvider';
import { TournamentParticipation } from '@/types/tournamentParticipation';

interface UseMemberParticipationsOptions {
  enabled?: boolean;
  page?: number;
  size?: number;
}

export default function useMemberParticipations(
  memberId: string | null | undefined,
  options: UseMemberParticipationsOptions = {}
) {
  const { enabled = true, page = 0, size = 10 } = options;
  const [participations, setParticipations] = useState<TournamentParticipation[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId || !enabled) return;

    const fetchParticipations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await tournamentProvider.getMemberParticipations(memberId, { page, size });
        setParticipations(data.content);
        setTotalElements(data.totalElements);
      } catch (err: any) {
        console.error('Error fetching participations:', err);
        setError(err.message || 'Erreur lors du chargement des participations');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipations();
  }, [memberId, enabled, page, size]);

  return { participations, totalElements, loading, error };
}
