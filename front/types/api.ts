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

export interface PublicExercise {
  id: string;
  title: string;
  description: string | null;
  /** 50-char encoded board, see lib/dames/notation.ts. */
  position: string;
  sideToPlay: "white" | "black";
  difficulty: ExerciseDifficulty;
  solution: string | null;
  publishedAt: string | null;
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
