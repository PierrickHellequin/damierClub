package com.damier.damierclub.repository;

import com.damier.damierclub.model.Note;
import com.damier.damierclub.model.Note.NoteVisibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, String> {

    // Find by author
    @Query("SELECT n FROM Note n WHERE n.author.id = :authorId")
    Page<Note> findByAuthorId(@Param("authorId") String authorId, Pageable pageable);

    // Find by club
    @Query("SELECT n FROM Note n WHERE n.club.id = :clubId")
    Page<Note> findByClubId(@Param("clubId") String clubId, Pageable pageable);

    // Find by visibility
    Page<Note> findByVisibility(NoteVisibility visibility, Pageable pageable);

    // Find pinned notes
    Page<Note> findByPinnedTrue(Pageable pageable);

    // Find by author and pinned
    @Query("SELECT n FROM Note n WHERE n.author.id = :authorId AND n.pinned = true")
    List<Note> findByAuthorIdAndPinnedTrue(@Param("authorId") String authorId);

    // Find by visibility and pinned
    Page<Note> findByVisibilityAndPinnedTrue(NoteVisibility visibility, Pageable pageable);

    // Search notes
    @Query("SELECT n FROM Note n WHERE " +
           "LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Note> searchNotes(@Param("search") String search, Pageable pageable);

    // Count by author
    @Query("SELECT COUNT(n) FROM Note n WHERE n.author.id = :authorId")
    long countByAuthorId(@Param("authorId") String authorId);

    // Count by visibility
    long countByVisibility(NoteVisibility visibility);

    // Count by author and visibility
    @Query("SELECT COUNT(n) FROM Note n WHERE n.author.id = :authorId AND n.visibility = :visibility")
    long countByAuthorIdAndVisibility(@Param("authorId") String authorId, @Param("visibility") NoteVisibility visibility);

    // Find recent notes by author
    @Query("SELECT n FROM Note n WHERE n.author.id = :authorId ORDER BY n.updatedAt DESC")
    List<Note> findRecentByAuthorId(@Param("authorId") String authorId, Pageable pageable);
}
