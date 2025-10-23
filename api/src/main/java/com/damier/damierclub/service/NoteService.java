package com.damier.damierclub.service;

import com.damier.damierclub.model.Club;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.Note;
import com.damier.damierclub.model.Note.NoteVisibility;
import com.damier.damierclub.repository.ClubRepository;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ClubRepository clubRepository;

    /**
     * Get all notes with filters
     */
    public Page<Note> getNotes(String authorId, String clubId, NoteVisibility visibility,
                               Boolean pinned, String search, int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        // Search notes
        if (search != null && !search.trim().isEmpty()) {
            return noteRepository.searchNotes(search.trim(), pageable);
        }

        // Filter by author
        if (authorId != null) {
            return noteRepository.findByAuthorId(authorId, pageable);
        }

        // Filter by club
        if (clubId != null) {
            return noteRepository.findByClubId(clubId, pageable);
        }

        // Filter by visibility and pinned
        if (visibility != null && pinned != null && pinned) {
            return noteRepository.findByVisibilityAndPinnedTrue(visibility, pageable);
        }

        // Filter by visibility
        if (visibility != null) {
            return noteRepository.findByVisibility(visibility, pageable);
        }

        // Filter by pinned
        if (pinned != null && pinned) {
            return noteRepository.findByPinnedTrue(pageable);
        }

        // Get all notes
        return noteRepository.findAll(pageable);
    }

    /**
     * Get note by ID
     */
    public Note getNoteById(String id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
    }

    /**
     * Create note
     */
    public Note createNote(Note note, String authorEmail) {
        Member author = memberRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));

        note.setAuthor(author);

        // If club ID is provided, validate it exists
        if (note.getClub() != null && note.getClub().getId() != null) {
            Club club = clubRepository.findById(note.getClub().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Club not found"));
            note.setClub(club);
        }

        // Set default visibility if not provided
        if (note.getVisibility() == null) {
            note.setVisibility(NoteVisibility.PRIVATE);
        }

        // Set default pinned if not provided
        if (note.getPinned() == null) {
            note.setPinned(false);
        }

        return noteRepository.save(note);
    }

    /**
     * Update note
     */
    public Note updateNote(String id, Note updatedNote) {
        Note existingNote = getNoteById(id);

        if (updatedNote.getTitle() != null) {
            existingNote.setTitle(updatedNote.getTitle());
        }

        if (updatedNote.getContent() != null) {
            existingNote.setContent(updatedNote.getContent());
        }

        if (updatedNote.getVisibility() != null) {
            existingNote.setVisibility(updatedNote.getVisibility());
        }

        if (updatedNote.getPinned() != null) {
            existingNote.setPinned(updatedNote.getPinned());
        }

        if (updatedNote.getColor() != null) {
            existingNote.setColor(updatedNote.getColor());
        }

        // Update club if provided
        if (updatedNote.getClub() != null && updatedNote.getClub().getId() != null) {
            Club club = clubRepository.findById(updatedNote.getClub().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Club not found"));
            existingNote.setClub(club);
        }

        return noteRepository.save(existingNote);
    }

    /**
     * Delete note
     */
    public void deleteNote(String id) {
        Note note = getNoteById(id);
        noteRepository.delete(note);
    }

    /**
     * Pin note
     */
    public Note pinNote(String id) {
        Note note = getNoteById(id);
        note.setPinned(true);
        return noteRepository.save(note);
    }

    /**
     * Unpin note
     */
    public Note unpinNote(String id) {
        Note note = getNoteById(id);
        note.setPinned(false);
        return noteRepository.save(note);
    }

    /**
     * Get recent notes by author
     */
    public List<Note> getRecentNotesByAuthor(String authorEmail, int limit) {
        Member author = memberRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));

        Pageable pageable = PageRequest.of(0, limit);
        return noteRepository.findRecentByAuthorId(author.getId().toString(), pageable);
    }

    /**
     * Get pinned notes by author
     */
    public List<Note> getPinnedNotesByAuthor(String authorEmail) {
        Member author = memberRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));

        return noteRepository.findByAuthorIdAndPinnedTrue(author.getId().toString());
    }

    /**
     * Get note statistics
     */
    public NoteStats getNoteStats(String authorEmail) {
        Member author = memberRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));

        // Count notes by visibility (global stats for now - can be filtered per user later)
        long total = noteRepository.count();
        long privateCount = noteRepository.countByVisibility(NoteVisibility.PRIVATE);
        long clubCount = noteRepository.countByVisibility(NoteVisibility.CLUB);
        long membersCount = noteRepository.countByVisibility(NoteVisibility.MEMBERS);

        return new NoteStats(total, privateCount, clubCount, membersCount);
    }

    // Inner class for statistics
    public static class NoteStats {
        private long total;
        private long privateNotes;
        private long clubNotes;
        private long membersNotes;

        public NoteStats(long total, long privateNotes, long clubNotes, long membersNotes) {
            this.total = total;
            this.privateNotes = privateNotes;
            this.clubNotes = clubNotes;
            this.membersNotes = membersNotes;
        }

        // Getters
        public long getTotal() {
            return total;
        }

        public long getPrivateNotes() {
            return privateNotes;
        }

        public long getClubNotes() {
            return clubNotes;
        }

        public long getMembersNotes() {
            return membersNotes;
        }
    }
}
