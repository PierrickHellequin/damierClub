package com.damier.damierclub.controller;

import com.damier.damierclub.dto.PublicEloPointDTO;
import com.damier.damierclub.dto.PublicPlayerDTO;
import com.damier.damierclub.dto.PublicPlayerSummaryDTO;
import com.damier.damierclub.dto.PublicTournamentResultDTO;
import com.damier.damierclub.service.PublicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/players")
@Tag(name = "Public - Joueurs",
     description = "Profils joueurs publics: classement, palmarès, courbe ELO. " +
                   "N'expose ni email, ni téléphone, ni adresse.")
public class PublicPlayerController {

    private final PublicService publicService;

    public PublicPlayerController(PublicService publicService) {
        this.publicService = publicService;
    }

    @Operation(summary = "Liste paginée des joueurs (actifs), triée par points")
    @GetMapping
    public Page<PublicPlayerSummaryDTO> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "30") int size,
        @RequestParam(required = false) UUID clubId
    ) {
        return publicService.listPlayers(page, size, clubId);
    }

    @Operation(summary = "Hall of fame: les N meilleurs joueurs actifs par ELO")
    @GetMapping("/top")
    public List<PublicPlayerSummaryDTO> top(@RequestParam(defaultValue = "10") int limit) {
        return publicService.topPlayers(limit);
    }

    @Operation(summary = "Profil public détaillé d'un joueur")
    @GetMapping("/{id}")
    public ResponseEntity<PublicPlayerDTO> get(@PathVariable UUID id) {
        return publicService.playerById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Courbe ELO du joueur (ordre chronologique ASC)")
    @GetMapping("/{id}/elo-history")
    public List<PublicEloPointDTO> eloHistory(@PathVariable UUID id) {
        return publicService.playerEloHistory(id);
    }

    @Operation(summary = "Palmarès du joueur (ordre chronologique ASC)")
    @GetMapping("/{id}/tournaments")
    public List<PublicTournamentResultDTO> tournaments(@PathVariable UUID id) {
        return publicService.playerTournaments(id);
    }
}
