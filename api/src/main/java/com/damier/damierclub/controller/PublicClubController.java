package com.damier.damierclub.controller;

import com.damier.damierclub.dto.PublicClubDTO;
import com.damier.damierclub.dto.PublicClubSummaryDTO;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/public/clubs")
@Tag(name = "Public - Clubs", description = "Endpoints publics (sans auth) servant le site vitrine.")
public class PublicClubController {

    private final PublicService publicService;

    public PublicClubController(PublicService publicService) {
        this.publicService = publicService;
    }

    @Operation(summary = "Liste paginée des clubs")
    @GetMapping
    public Page<PublicClubSummaryDTO> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return publicService.listClubs(page, size);
    }

    @Operation(summary = "Détail public d'un club")
    @GetMapping("/{id}")
    public ResponseEntity<PublicClubDTO> byId(@PathVariable UUID id) {
        return publicService.clubById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
