import type { Member } from './member';
import type { Club } from './club';

export enum NoteVisibility {
  PRIVATE = 'PRIVATE',
  CLUB = 'CLUB',
  MEMBERS = 'MEMBERS',
}

export const NoteVisibilityLabels: Record<NoteVisibility, string> = {
  [NoteVisibility.PRIVATE]: 'Privée (moi uniquement)',
  [NoteVisibility.CLUB]: 'Club',
  [NoteVisibility.MEMBERS]: 'Tous les membres',
};

export interface Note {
  id: string;
  title: string;
  content: string;
  author: Member;
  club?: Club;
  visibility: NoteVisibility;
  pinned: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  clubId?: string;
  visibility: NoteVisibility;
  pinned?: boolean;
  color?: string;
}

export interface NoteFilters {
  authorId?: string;
  clubId?: string;
  visibility?: NoteVisibility;
  pinned?: boolean;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface NotePage {
  content: Note[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface NoteStats {
  total: number;
  privateNotes: number;
  clubNotes: number;
  membersNotes: number;
}

// Default colors for notes
export const NoteColors = [
  '#FFE5E5', // Light red
  '#FFE5CC', // Light orange
  '#FFF4CC', // Light yellow
  '#E5FFCC', // Light green
  '#CCF5FF', // Light cyan
  '#CCE5FF', // Light blue
  '#E5CCFF', // Light purple
  '#FFCCF2', // Light pink
  '#F0F0F0', // Light gray
  '#FFFFFF', // White
];
