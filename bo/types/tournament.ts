export enum TournamentType {
  TOURNOI = 'TOURNOI',
  CHAMPIONNAT = 'CHAMPIONNAT',
  BLITZ = 'BLITZ',
  AMICAL = 'AMICAL',
}

export enum TournamentCategory {
  OPEN = 'OPEN',
  REGIONAL = 'REGIONAL',
  NATIONAL = 'NATIONAL',
  INTERNATIONAL = 'INTERNATIONAL',
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  type: TournamentType;
  category: TournamentCategory;
  location?: string;
  description?: string;
  active: boolean;
}
