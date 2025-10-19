import { apiProvider } from './apiProvider';
import type { Note, NoteFormData, NotePage, NoteFilters, NoteStats } from '../types/note';

/**
 * Note API Provider
 * Handles all API calls related to notes
 */
const noteProvider = {
  /**
   * Get all notes with filters
   */
  async getNotes(filters?: NoteFilters): Promise<NotePage> {
    const params = new URLSearchParams();

    if (filters?.authorId) params.append('authorId', filters.authorId);
    if (filters?.clubId) params.append('clubId', filters.clubId);
    if (filters?.visibility) params.append('visibility', filters.visibility);
    if (filters?.pinned !== undefined) params.append('pinned', String(filters.pinned));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page !== undefined) params.append('page', String(filters.page));
    if (filters?.size !== undefined) params.append('size', String(filters.size));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDirection) params.append('sortDirection', filters.sortDirection);

    const queryString = params.toString();
    const url = queryString ? `notes?${queryString}` : 'notes';

    return apiProvider.call<NotePage>({
      url,
      method: 'GET',
    });
  },

  /**
   * Get note by ID
   */
  async getNoteById(id: string): Promise<Note> {
    return apiProvider.call<Note>({
      url: `notes/${id}`,
      method: 'GET',
    });
  },

  /**
   * Create new note
   */
  async createNote(data: NoteFormData): Promise<Note> {
    return apiProvider.call<Note>({
      url: 'notes',
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update note
   */
  async updateNote(id: string, data: Partial<NoteFormData>): Promise<Note> {
    return apiProvider.call<Note>({
      url: `notes/${id}`,
      method: 'PUT',
      body: data,
    });
  },

  /**
   * Delete note
   */
  async deleteNote(id: string): Promise<void> {
    return apiProvider.call<void>({
      url: `notes/${id}`,
      method: 'DELETE',
    });
  },

  /**
   * Pin note
   */
  async pinNote(id: string): Promise<Note> {
    return apiProvider.call<Note>({
      url: `notes/${id}/pin`,
      method: 'PATCH',
    });
  },

  /**
   * Unpin note
   */
  async unpinNote(id: string): Promise<Note> {
    return apiProvider.call<Note>({
      url: `notes/${id}/unpin`,
      method: 'PATCH',
    });
  },

  /**
   * Get recent notes by author
   */
  async getRecentNotes(limit: number = 5): Promise<Note[]> {
    return apiProvider.call<Note[]>({
      url: `notes/recent?limit=${limit}`,
      method: 'GET',
    });
  },

  /**
   * Get pinned notes by author
   */
  async getPinnedNotes(): Promise<Note[]> {
    return apiProvider.call<Note[]>({
      url: 'notes/pinned',
      method: 'GET',
    });
  },

  /**
   * Get note statistics
   */
  async getNoteStats(): Promise<NoteStats> {
    return apiProvider.call<NoteStats>({
      url: 'notes/stats',
      method: 'GET',
    });
  },
};

export default noteProvider;
