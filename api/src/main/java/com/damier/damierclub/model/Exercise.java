package com.damier.damierclub.model;

import com.damier.damierclub.util.UuidGenerator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * A training position the front exposes under /jouer/entrainement.
 * The position is encoded as a 50-character string, one char per dark square
 * of the 10x10 international draughts board (top-left → bottom-right):
 *   '.' = empty, 'w' = white man, 'W' = white king, 'b' = black man, 'B' = black king.
 */
@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** 50 chars, see class-level doc. */
    @Column(nullable = false, length = 50)
    private String position;

    @Enumerated(EnumType.STRING)
    @Column(name = "side_to_play", nullable = false, length = 16)
    private Side sideToPlay;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String solution;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Status status = Status.DRAFT;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum Side { WHITE, BLACK }

    public enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED }

    public enum Status { DRAFT, PUBLISHED, ARCHIVED }

    @PrePersist
    public void onCreate() {
        if (id == null) id = UuidGenerator.generateUuidV7();
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
        if (status == null) status = Status.DRAFT;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
