// Mirrors com.damier.damierclub.dto.Public*DTO on the API side.
// Keep field names in sync.

export type ArticleCategory =
  | "NEWS"
  | "RESULTS"
  | "EVENTS"
  | "TUTORIAL"
  | "ANNOUNCEMENT";

export interface PublicAuthor {
  firstName: string | null;
  lastName: string | null;
}

export interface PublicArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: ArticleCategory;
  coverImage: string | null;
  tags: string[] | null;
  publishedAt: string | null; // ISO LocalDateTime, no offset
  viewCount: number;
  featured: boolean;
  author: PublicAuthor | null;
}

export interface PublicArticle extends PublicArticleSummary {
  content: string;
}

export interface PublicClubSummary {
  id: string;
  name: string | null;
  city: string | null;
  logoUrl: string | null;
  membersCount: number;
}

export interface PublicClub extends PublicClubSummary {
  address: string | null;
  website: string | null;
  description: string | null;
  creationDate: string | null;
  president: string | null;
  vicePresident: string | null;
  secretaire: string | null;
  tresorier: string | null;
}

export interface PublicStats {
  totalClubs: number;
  totalMembers: number;
  totalPublishedArticles: number;
}

export type ExerciseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface MovePair {
  /** FFJD square index, 1-50. */
  from: number;
  to: number;
}

export interface PublicExercise {
  id: string;
  title: string;
  description: string | null;
  /** 50-char encoded board, see lib/dames/notation.ts. */
  position: string;
  sideToPlay: "white" | "black";
  difficulty: ExerciseDifficulty;
  solution: string | null;
  /** Structured combination — null when the exercise is text-only. */
  solutionMoves: MovePair[] | null;
  publishedAt: string | null;
}

export type ClubRole = "PRESIDENT" | "VICE_PRESIDENT" | "SECRETAIRE" | "TRESORIER" | "MEMBRE";

export interface PublicPlayerSummary {
  id: string;
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  currentPoints: number | null;
  ranking: number | null;
  ffjdId: string | null;
  clubId: string | null;
  clubName: string | null;
}

export interface PublicPlayer extends PublicPlayerSummary {
  registrationDate: string | null;
  clubRole: ClubRole | null;
  totalTournaments: number;
  totalVictories: number;
  totalDefeats: number;
  totalDraws: number;
  winRate: number | null;
  highestPoints: number | null;
  lowestPoints: number | null;
}

export interface PublicEloPoint {
  date: string;
  points: number;
  pointsChange: number;
  label: string | null;
}

export type TournamentType =
  | "TOURNOI"
  | "OPEN"
  | "CHAMPIONNAT"
  | "AMICAL"
  | "INTERCLUBS";

export type TournamentCategory =
  | "OPEN"
  | "JEUNES"
  | "FEMININ"
  | "VETERAN"
  | "REGIONAL"
  | "NATIONAL"
  | "INTERNATIONAL";

export interface PublicTournamentResult {
  tournamentId: string | null;
  tournamentName: string | null;
  tournamentDate: string | null;
  tournamentType: TournamentType | null;
  tournamentCategory: TournamentCategory | null;
  tournamentLocation: string | null;
  place: string | null;
  pointsChange: number | null;
  pointsAfter: number | null;
  victories: number | null;
  defeats: number | null;
  draws: number | null;
}

// Spring Page<T> shape
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
