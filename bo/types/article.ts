import { Member } from './member';

export enum ArticleCategory {
  NEWS = 'NEWS',
  RESULTS = 'RESULTS',
  EVENTS = 'EVENTS',
  TUTORIAL = 'TUTORIAL',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface Article {
  id: string; // UUID
  title: string;
  slug: string;
  content: string; // JSON content from Editor.js
  excerpt?: string;
  category: ArticleCategory;
  status: ArticleStatus;
  author: Member;
  coverImage?: string;
  tags?: string[];
  publishedAt?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  viewCount: number;
  featured: boolean;
}

export interface ArticleStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

export interface ArticleFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  category: ArticleCategory;
  coverImage?: string;
  tags?: string[];
  featured?: boolean;
}

export interface ArticleFilters {
  status?: ArticleStatus;
  category?: ArticleCategory;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ArticlePage {
  content: Article[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Labels for display
export const ArticleCategoryLabels: Record<ArticleCategory, string> = {
  [ArticleCategory.NEWS]: 'Actualités',
  [ArticleCategory.RESULTS]: 'Résultats',
  [ArticleCategory.EVENTS]: 'Événements',
  [ArticleCategory.TUTORIAL]: 'Tutoriels',
  [ArticleCategory.ANNOUNCEMENT]: 'Annonces',
};

export const ArticleStatusLabels: Record<ArticleStatus, string> = {
  [ArticleStatus.DRAFT]: 'Brouillon',
  [ArticleStatus.PUBLISHED]: 'Publié',
  [ArticleStatus.ARCHIVED]: 'Archivé',
};

// Colors for status tags
export const ArticleStatusColors: Record<ArticleStatus, string> = {
  [ArticleStatus.DRAFT]: 'default',
  [ArticleStatus.PUBLISHED]: 'success',
  [ArticleStatus.ARCHIVED]: 'warning',
};
