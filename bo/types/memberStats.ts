export interface MemberStats {
  totalTournaments: number;
  totalVictories: number;
  totalDefeats: number;
  totalDraws: number;
  winRate: number; // Pourcentage
  currentPoints: number;
  highestPoints: number;
  lowestPoints: number;
}

export interface PointsEvolution {
  date: string; // ISO date-time string
  points: number;
  pointsChange: number;
  reason?: string;
  tournamentId?: string;
  tournamentName?: string;
}
