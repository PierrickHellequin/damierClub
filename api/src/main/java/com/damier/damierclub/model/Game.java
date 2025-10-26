package com.damier.damierclub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.damier.damierclub.util.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "games")
public class Game {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    // Relation ManyToOne : une partie appartient à une participation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participation_id", nullable = false)
    @NotNull
    private TournamentParticipation participation;

    // Adversaire (référence au membre)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opponent_id")
    private Member opponent;

    // Résultat de la partie (du point de vue du membre de la participation)
    @Enumerated(EnumType.STRING)
    @NotNull
    private GameResult result;

    // Détails de la partie
    private String color; // Couleur jouée: "WHITE" ou "BLACK"
    private Integer movesCount; // Nombre de coups joués
    private LocalDateTime playedAt; // Date et heure de la partie
    private String pgn; // Notation PGN de la partie (optionnel)

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UuidGenerator.generateUuidV7();
        }
        if (this.playedAt == null) {
            this.playedAt = LocalDateTime.now();
        }
    }
}
