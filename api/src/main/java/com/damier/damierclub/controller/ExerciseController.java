package com.damier.damierclub.controller;

import com.damier.damierclub.dto.ExerciseDTO;
import com.damier.damierclub.model.Exercise;
import com.damier.damierclub.model.Exercise.Status;
import com.damier.damierclub.service.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/** BO admin endpoints for exercises. Authentication required (handled by SecurityConfig). */
@RestController
@RequestMapping("/api/exercises")
@Tag(name = "Exercices (admin)", description = "Gestion des positions d'entraînement depuis le BO.")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @Operation(summary = "Liste paginée des exercices")
    @GetMapping
    public Page<ExerciseDTO> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Status status
    ) {
        return exerciseService.list(page, size, status).map(exerciseService::toDto);
    }

    @Operation(summary = "Détail d'un exercice")
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDTO> get(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(exerciseService.toDto(exerciseService.get(id)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Créer un exercice")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ExerciseDTO dto) {
        try {
            Exercise created = exerciseService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(exerciseService.toDto(created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Mettre à jour un exercice")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody ExerciseDTO dto) {
        try {
            return ResponseEntity.ok(exerciseService.toDto(exerciseService.update(id, dto)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Publier un exercice")
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ExerciseDTO> publish(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(exerciseService.toDto(exerciseService.publish(id)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Dépublier (retour brouillon)")
    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<ExerciseDTO> unpublish(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(exerciseService.toDto(exerciseService.unpublish(id)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Archiver")
    @PatchMapping("/{id}/archive")
    public ResponseEntity<ExerciseDTO> archive(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(exerciseService.toDto(exerciseService.archive(id)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Supprimer définitivement")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        exerciseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
