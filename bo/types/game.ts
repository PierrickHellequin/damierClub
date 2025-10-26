export enum GameResult {
  WIN = 'WIN',
  LOSS = 'LOSS',
  DRAW = 'DRAW',
}

export interface Game {
  id: string;
  participationId: string;
  opponentId?: string;
  result: GameResult;
  color?: string; // 'WHITE' or 'BLACK'
  movesCount?: number;
  playedAt: string; // ISO date-time string
  pgn?: string;
}
