package com.damier.damierclub.controller;

import com.damier.damierclub.dto.TournamentParticipationDTO;
import com.damier.damierclub.model.Tournament;
import com.damier.damierclub.service.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @GetMapping
    public ResponseEntity<Page<Tournament>> getAllTournaments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "startDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Tournament> tournaments = tournamentService.getAllTournaments(pageable);
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/active")
    public ResponseEntity<Page<Tournament>> getActiveTournaments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "startDate"));
        Page<Tournament> tournaments = tournamentService.getActiveTournaments(pageable);
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Tournament>> getUpcomingTournaments() {
        List<Tournament> tournaments = tournamentService.getUpcomingTournaments();
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/past")
    public ResponseEntity<Page<Tournament>> getPastTournaments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Tournament> tournaments = tournamentService.getPastTournaments(pageable);
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable UUID id) {
        Tournament tournament = tournamentService.getTournamentById(id);
        return ResponseEntity.ok(tournament);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_EDITOR')")
    public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament) {
        Tournament created = tournamentService.createTournament(tournament);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_EDITOR')")
    public ResponseEntity<Tournament> updateTournament(
            @PathVariable UUID id,
            @RequestBody Tournament tournament
    ) {
        Tournament updated = tournamentService.updateTournament(id, tournament);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteTournament(@PathVariable UUID id) {
        tournamentService.deleteTournament(id);
        return ResponseEntity.noContent().build();
    }

    // Récupérer participations d'un membre à des tournois
    @GetMapping("/member/{memberId}/participations")
    public ResponseEntity<Page<TournamentParticipationDTO>> getMemberParticipations(
            @PathVariable UUID memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TournamentParticipationDTO> participations = tournamentService.getMemberParticipations(memberId, pageable);
        return ResponseEntity.ok(participations);
    }
}
