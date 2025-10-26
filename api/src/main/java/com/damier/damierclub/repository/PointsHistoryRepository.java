package com.damier.damierclub.repository;

import com.damier.damierclub.model.PointsHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PointsHistoryRepository extends JpaRepository<PointsHistory, UUID> {

    // Trouver historique d'un membre
    @Query("SELECT ph FROM PointsHistory ph WHERE ph.member.id = :memberId ORDER BY ph.changedAt DESC")
    Page<PointsHistory> findByMemberId(@Param("memberId") UUID memberId, Pageable pageable);

    // Trouver historique d'un membre (liste complète pour graphiques)
    @Query("SELECT ph FROM PointsHistory ph WHERE ph.member.id = :memberId ORDER BY ph.changedAt ASC")
    List<PointsHistory> findAllByMemberIdOrderByChangedAtAsc(@Param("memberId") UUID memberId);

    // Trouver historique lié à un tournoi
    @Query("SELECT ph FROM PointsHistory ph WHERE ph.tournament.id = :tournamentId")
    List<PointsHistory> findByTournamentId(@Param("tournamentId") UUID tournamentId);

    // Trouver historique entre deux dates
    @Query("SELECT ph FROM PointsHistory ph WHERE ph.member.id = :memberId AND ph.changedAt BETWEEN :startDate AND :endDate ORDER BY ph.changedAt ASC")
    List<PointsHistory> findByMemberIdAndDateRange(
        @Param("memberId") UUID memberId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
