export enum ExerciseSide {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export enum ExerciseDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum ExerciseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface Exercise {
  id: string; // UUID
  title: string;
  description?: string;
  /** 50-character encoded board (".wWbB"). */
  position: string;
  sideToPlay: ExerciseSide;
  difficulty: ExerciseDifficulty;
  solution?: string;
  status: ExerciseStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseFormData {
  title: string;
  description?: string;
  position: string;
  sideToPlay: ExerciseSide;
  difficulty: ExerciseDifficulty;
  solution?: string;
  status?: ExerciseStatus;
}

export interface ExercisePage {
  content: Exercise[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const ExerciseSideLabels: Record<ExerciseSide, string> = {
  [ExerciseSide.WHITE]: 'Blancs',
  [ExerciseSide.BLACK]: 'Noirs',
};

export const ExerciseDifficultyLabels: Record<ExerciseDifficulty, string> = {
  [ExerciseDifficulty.BEGINNER]: 'Débutant',
  [ExerciseDifficulty.INTERMEDIATE]: 'Intermédiaire',
  [ExerciseDifficulty.ADVANCED]: 'Avancé',
};

export const ExerciseStatusLabels: Record<ExerciseStatus, string> = {
  [ExerciseStatus.DRAFT]: 'Brouillon',
  [ExerciseStatus.PUBLISHED]: 'Publié',
  [ExerciseStatus.ARCHIVED]: 'Archivé',
};

export const ExerciseStatusColors: Record<ExerciseStatus, string> = {
  [ExerciseStatus.DRAFT]: 'default',
  [ExerciseStatus.PUBLISHED]: 'success',
  [ExerciseStatus.ARCHIVED]: 'warning',
};

export const EMPTY_POSITION = '.'.repeat(50);
