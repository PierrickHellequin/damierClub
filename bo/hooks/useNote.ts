import { useState, useEffect } from 'react';
import noteProvider from '../providers/noteProvider';
import type { Note, NoteStats } from '../types/note';

/**
 * Hook for managing a single note
 */
export function useNote(id?: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch note by ID
   */
  const fetchNote = async (noteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await noteProvider.getNoteById(noteId);
      setNote(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch note');
      console.error('Error fetching note:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch note on mount if ID is provided
  useEffect(() => {
    if (id) {
      fetchNote(id);
    }
  }, [id]);

  return {
    note,
    loading,
    error,
    fetchNote,
  };
}

/**
 * Hook for recent notes
 */
export function useRecentNotes(limit: number = 5) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await noteProvider.getRecentNotes(limit);
      setNotes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch recent notes');
      console.error('Error fetching recent notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentNotes();
  }, [limit]);

  return {
    notes,
    loading,
    error,
    fetchRecentNotes,
  };
}

/**
 * Hook for pinned notes
 */
export function usePinnedNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPinnedNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await noteProvider.getPinnedNotes();
      setNotes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pinned notes');
      console.error('Error fetching pinned notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPinnedNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    fetchPinnedNotes,
  };
}

/**
 * Hook for note statistics
 */
export function useNoteStats() {
  const [stats, setStats] = useState<NoteStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await noteProvider.getNoteStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch note statistics');
      console.error('Error fetching note statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
}
