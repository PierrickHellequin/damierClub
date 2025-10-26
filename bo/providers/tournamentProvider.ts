import { apiProvider } from './apiProvider';
import { Tournament } from '@/types/tournament';
import { TournamentParticipation } from '@/types/tournamentParticipation';

export const tournamentProvider = {
  // CRUD Tournois
  getAllTournaments: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'ASC' | 'DESC';
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.direction) searchParams.append('direction', params.direction);

    return apiProvider.get<{ content: Tournament[]; totalElements: number }>(
      `tournaments?${searchParams.toString()}`
    );
  },

  getActiveTournaments: async (params?: { page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    return apiProvider.get<{ content: Tournament[]; totalElements: number }>(
      `tournaments/active?${searchParams.toString()}`
    );
  },

  getUpcomingTournaments: async () => {
    return apiProvider.get<Tournament[]>('tournaments/upcoming');
  },

  getPastTournaments: async (params?: { page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    return apiProvider.get<{ content: Tournament[]; totalElements: number }>(
      `tournaments/past?${searchParams.toString()}`
    );
  },

  getTournamentById: async (id: string) => {
    return apiProvider.get<Tournament>(`tournaments/${id}`);
  },

  createTournament: async (tournament: Partial<Tournament>) => {
    return apiProvider.post<Tournament>('tournaments', tournament);
  },

  updateTournament: async (id: string, tournament: Partial<Tournament>) => {
    return apiProvider.put<Tournament>(`tournaments/${id}`, tournament);
  },

  deleteTournament: async (id: string) => {
    return apiProvider.delete(`tournaments/${id}`);
  },

  // Participations
  getMemberParticipations: async (
    memberId: string,
    params?: { page?: number; size?: number }
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    return apiProvider.get<{ content: TournamentParticipation[]; totalElements: number }>(
      `tournaments/member/${memberId}/participations?${searchParams.toString()}`
    );
  },
};
