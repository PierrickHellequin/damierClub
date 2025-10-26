package com.damier.damierclub.repository;

import com.damier.damierclub.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {

    // Trouver parties d'une participation
    @Query("SELECT g FROM Game g WHERE g.participation.id = :participationId ORDER BY g.playedAt ASC")
    List<Game> findByParticipationId(@Param("participationId") UUID participationId);

    // Trouver parties d'un membre (via participation)
    @Query("SELECT g FROM Game g WHERE g.participation.member.id = :memberId ORDER BY g.playedAt DESC")
    List<Game> findByMemberId(@Param("memberId") UUID memberId);

    // Trouver parties entre deux membres
    @Query("SELECT g FROM Game g WHERE g.participation.member.id = :memberId AND g.opponent.id = :opponentId")
    List<Game> findGamesBetweenMembers(@Param("memberId") UUID memberId, @Param("opponentId") UUID opponentId);
}
