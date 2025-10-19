import { useState, useEffect } from 'react';
import noteProvider from '../providers/noteProvider';
import type { Note, NotePage, NoteFormData, NoteFilters, NoteStats } from '../types/note';

/**
 * Hook for managing notes list and operations
 */
export function useNotes(initialFilters?: NoteFilters) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState<NotePage | null>(null);
  const [filters, setFilters] = useState<NoteFilters>(initialFilters || { page: 0, size: 20, sortBy: 'updatedAt', sortDirection: 'DESC' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch notes from API
   */
  const fetchNotes = async (customFilters?: NoteFilters) => {
    setLoading(true);
    setError(null);
    try {
      const filtersToUse = customFilters || filters;
      const data = await noteProvider.getNotes(filtersToUse);
      setPage(data);
      setNotes(data.content);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create new note
   */
  const createNote = async (data: NoteFormData): Promise<Note | null> => {
    setLoading(true);
    setError(null);
    try {
      const newNote = await noteProvider.createNote(data);
      // Refresh notes list
      await fetchNotes();
      return newNote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create note');
      console.error('Error creating note:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update note
   */
  const updateNote = async (id: string, data: Partial<NoteFormData>): Promise<Note | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedNote = await noteProvider.updateNote(id, data);
      // Update note in local state
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      return updatedNote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update note');
      console.error('Error updating note:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete note
   */
  const deleteNote = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await noteProvider.deleteNote(id);
      // Remove note from local state
      setNotes(notes.filter(note => note.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete note');
      console.error('Error deleting note:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Pin note
   */
  const pinNote = async (id: string): Promise<Note | null> => {
    setLoading(true);
    setError(null);
    try {
      const pinnedNote = await noteProvider.pinNote(id);
      // Update note in local state
      setNotes(notes.map(note => note.id === id ? pinnedNote : note));
      return pinnedNote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to pin note');
      console.error('Error pinning note:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unpin note
   */
  const unpinNote = async (id: string): Promise<Note | null> => {
    setLoading(true);
    setError(null);
    try {
      const unpinnedNote = await noteProvider.unpinNote(id);
      // Update note in local state
      setNotes(notes.map(note => note.id === id ? unpinnedNote : note));
      return unpinnedNote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unpin note');
      console.error('Error unpinning note:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change page
   */
  const changePage = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchNotes(newFilters);
  };

  /**
   * Update filters
   */
  const updateFilters = (newFilters: Partial<NoteFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 0 }; // Reset to page 0 when filters change
    setFilters(updatedFilters);
    fetchNotes(updatedFilters);
  };

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    page,
    filters,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    unpinNote,
    changePage,
    updateFilters,
  };
}
