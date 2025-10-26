package com.damier.damierclub.repository;

import com.damier.damierclub.model.TournamentParticipation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TournamentParticipationRepository extends JpaRepository<TournamentParticipation, UUID> {

    // Trouver participations d'un membre
    @Query("SELECT tp FROM TournamentParticipation tp WHERE tp.member.id = :memberId ORDER BY tp.tournament.startDate DESC")
    Page<TournamentParticipation> findByMemberId(@Param("memberId") UUID memberId, Pageable pageable);

    // Trouver toutes les participations d'un membre triées par date ASC (pour évolution)
    @Query("SELECT tp FROM TournamentParticipation tp WHERE tp.member.id = :memberId ORDER BY tp.tournament.startDate ASC")
    List<TournamentParticipation> findByMemberIdOrderByTournamentStartDateAsc(@Param("memberId") UUID memberId);

    // Trouver participations d'un tournoi
    @Query("SELECT tp FROM TournamentParticipation tp WHERE tp.tournament.id = :tournamentId")
    List<TournamentParticipation> findByTournamentId(@Param("tournamentId") UUID tournamentId);

    // Compter participations d'un membre
    @Query("SELECT COUNT(tp) FROM TournamentParticipation tp WHERE tp.member.id = :memberId")
    Long countByMemberId(@Param("memberId") UUID memberId);

    // Statistiques globales d'un membre
    @Query("SELECT SUM(tp.victories) FROM TournamentParticipation tp WHERE tp.member.id = :memberId")
    Long sumVictoriesByMemberId(@Param("memberId") UUID memberId);

    @Query("SELECT SUM(tp.defeats) FROM TournamentParticipation tp WHERE tp.member.id = :memberId")
    Long sumDefeatsByMemberId(@Param("memberId") UUID memberId);

    @Query("SELECT SUM(tp.draws) FROM TournamentParticipation tp WHERE tp.member.id = :memberId")
    Long sumDrawsByMemberId(@Param("memberId") UUID memberId);
}
