package com.damier.damierclub.controller;

import com.damier.damierclub.dto.PublicStatsDTO;
import com.damier.damierclub.service.PublicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Public - Divers", description = "Endpoints publics divers (stats, healthcheck)")
public class PublicStatsController {

    private final PublicService publicService;

    public PublicStatsController(PublicService publicService) {
        this.publicService = publicService;
    }

    @Operation(summary = "Compteurs globaux pour la home du site vitrine")
    @GetMapping("/stats")
    public PublicStatsDTO stats() {
        return publicService.globalStats();
    }
}
