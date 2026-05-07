package com.damier.damierclub.controller;

import com.damier.damierclub.dto.PublicExerciseDTO;
import com.damier.damierclub.service.PublicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/exercises")
@Tag(name = "Public - Exercices", description = "Positions d'entraînement publiées, consommées par /jouer/entrainement.")
public class PublicExerciseController {

    private final PublicService publicService;

    public PublicExerciseController(PublicService publicService) {
        this.publicService = publicService;
    }

    @Operation(summary = "Liste des exercices publiés, triés par difficulté")
    @GetMapping
    public List<PublicExerciseDTO> list() {
        return publicService.listPublishedExercises();
    }
}
