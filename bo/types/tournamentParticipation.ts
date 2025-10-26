import { TournamentType, TournamentCategory } from './tournament';

export type GameResult = 'WIN' | 'LOSS' | 'DRAW';

export interface GameDTO {
  opponentName: string;
  opponentPoints?: number;
  result: GameResult;
  score: string; // "2-0", "1-1", "0-2"
}

export interface TournamentParticipation {
  // Infos participation
  participationId: string;
  place?: string;
  pointsChange?: number;
  pointsAfter?: number;
  victories: number;
  defeats: number;
  draws: number;

  // Infos tournoi
  tournamentId: string;
  tournamentName: string;
  tournamentDate: string; // ISO date string
  tournamentType: TournamentType;
  tournamentCategory: TournamentCategory;
  tournamentLocation?: string;

  // Liste des parties avec adversaires et résultats
  games: GameDTO[];
}
