import { apiProvider } from './apiProvider';
import { MemberStats, PointsEvolution } from '@/types/memberStats';

export const memberStatsProvider = {
  getMemberStats: async (memberId: string) => {
    return apiProvider.get<MemberStats>(`members/${memberId}/stats`);
  },

  getMemberPointsEvolution: async (memberId: string) => {
    return apiProvider.get<PointsEvolution[]>(`members/${memberId}/points-evolution`);
  },
};
