package com.damier.damierclub.repository;

import com.damier.damierclub.model.Tournament;
import com.damier.damierclub.model.TournamentCategory;
import com.damier.damierclub.model.TournamentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, UUID> {

    // Trouver tournois actifs
    Page<Tournament> findByActiveTrue(Pageable pageable);

    // Trouver par type
    Page<Tournament> findByType(TournamentType type, Pageable pageable);

    // Trouver par catégorie
    Page<Tournament> findByCategory(TournamentCategory category, Pageable pageable);

    // Trouver tournois à venir
    @Query("SELECT t FROM Tournament t WHERE t.startDate >= :date AND t.active = true ORDER BY t.startDate ASC")
    List<Tournament> findUpcomingTournaments(@Param("date") LocalDate date);

    // Trouver tournois passés
    @Query("SELECT t FROM Tournament t WHERE t.startDate < :date AND t.active = true ORDER BY t.startDate DESC")
    Page<Tournament> findPastTournaments(@Param("date") LocalDate date, Pageable pageable);
}
