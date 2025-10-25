package com.damier.damierclub.controller;

import com.damier.damierclub.model.Note;
import com.damier.damierclub.model.Note.NoteVisibility;
import com.damier.damierclub.service.NoteService;
import com.damier.damierclub.service.AuthorizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
@Tag(name = "Notes", description = "Gestion des notes personnelles - CRUD complet, épinglage et statistiques")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private AuthorizationService authorizationService;

    @Operation(summary = "Récupérer toutes les notes",
               description = "Récupère toutes les notes avec filtres optionnels (auteur, club, visibilité, épinglé, recherche)")
    @ApiResponse(responseCode = "200", description = "Liste paginée des notes")
    @GetMapping
    public ResponseEntity<Page<Note>> getNotes(
            @Parameter(description = "ID de l'auteur") @RequestParam(required = false) String authorId,
            @Parameter(description = "ID du club") @RequestParam(required = false) String clubId,
            @Parameter(description = "Visibilité (PRIVATE, CLUB, PUBLIC)") @RequestParam(required = false) NoteVisibility visibility,
            @Parameter(description = "Filtrer les notes épinglées") @RequestParam(required = false) Boolean pinned,
            @Parameter(description = "Recherche textuelle") @RequestParam(required = false) String search,
            @Parameter(description = "Numéro de page") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de la page") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Champ de tri") @RequestParam(defaultValue = "updatedAt") String sortBy,
            @Parameter(description = "Direction du tri (ASC/DESC)") @RequestParam(defaultValue = "DESC") String sortDirection) {

        Page<Note> notes = noteService.getNotes(authorId, clubId, visibility, pinned, search,
                page, size, sortBy, sortDirection);

        return ResponseEntity.ok(notes);
    }

    @Operation(summary = "Créer une nouvelle note", description = "Crée une nouvelle note personnelle")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Note créée avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PostMapping
    public ResponseEntity<Note> createNote(
            @RequestBody Note note,
            @Parameter(description = "Email de l'auteur", required = true) @RequestHeader("X-User-Email") String authorEmail) {
        // Check if user is authenticated
        if (authorEmail == null || authorEmail.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Note createdNote = noteService.createNote(note, authorEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
    }

    @Operation(summary = "Récupérer les notes récentes", description = "Récupère les notes les plus récentes de l'utilisateur")
    @ApiResponse(responseCode = "200", description = "Liste des notes récentes")
    @GetMapping("/recent")
    public ResponseEntity<List<Note>> getRecentNotes(
            @Parameter(description = "Email de l'auteur", required = true) @RequestHeader("X-User-Email") String authorEmail,
            @Parameter(description = "Nombre de notes à récupérer") @RequestParam(defaultValue = "5") int limit) {

        List<Note> recentNotes = noteService.getRecentNotesByAuthor(authorEmail, limit);
        return ResponseEntity.ok(recentNotes);
    }

    @Operation(summary = "Récupérer les notes épinglées", description = "Récupère toutes les notes épinglées de l'utilisateur")
    @ApiResponse(responseCode = "200", description = "Liste des notes épinglées")
    @GetMapping("/pinned")
    
    public ResponseEntity<List<Note>> getPinnedNotes(
            @Parameter(description = "Email de l'auteur", required = true) @RequestHeader("X-User-Email") String authorEmail) {

        List<Note> pinnedNotes = noteService.getPinnedNotesByAuthor(authorEmail);
        return ResponseEntity.ok(pinnedNotes);
    }

    @Operation(summary = "Récupérer les statistiques des notes", description = "Récupère les statistiques des notes de l'utilisateur (total, épinglées, par visibilité)")
    @ApiResponse(responseCode = "200", description = "Statistiques des notes")
    @GetMapping("/stats")

    public ResponseEntity<NoteService.NoteStats> getNoteStats(
            @Parameter(description = "Email de l'auteur") @RequestHeader(value = "X-User-Email", required = false) String authorEmail) {

        NoteService.NoteStats stats = noteService.getNoteStats(authorEmail);
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Récupérer une note par ID", description = "Récupère les détails d'une note spécifique")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Note trouvée"),
        @ApiResponse(responseCode = "404", description = "Note non trouvée")
    })
    @GetMapping("/{id}")
    
    public ResponseEntity<Note> getNoteById(@Parameter(description = "ID de la note") @PathVariable String id) {
        Note note = noteService.getNoteById(id);
        return ResponseEntity.ok(note);
    }

    @Operation(summary = "Mettre à jour une note", description = "Met à jour une note existante")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Note mise à jour avec succès"),
        @ApiResponse(responseCode = "404", description = "Note non trouvée")
    })
    @PutMapping("/{id}")
    
    public ResponseEntity<Note> updateNote(
            @Parameter(description = "ID de la note") @PathVariable String id,
            @RequestBody Note note) {

        Note updatedNote = noteService.updateNote(id, note);
        return ResponseEntity.ok(updatedNote);
    }

    @Operation(summary = "Supprimer une note", description = "Supprime définitivement une note")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Note supprimée avec succès"),
        @ApiResponse(responseCode = "404", description = "Note non trouvée")
    })
    @DeleteMapping("/{id}")
    
    public ResponseEntity<Void> deleteNote(@Parameter(description = "ID de la note") @PathVariable String id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Épingler une note", description = "Marque une note comme épinglée")
    @ApiResponse(responseCode = "200", description = "Note épinglée avec succès")
    @PatchMapping("/{id}/pin")
    
    public ResponseEntity<Note> pinNote(@Parameter(description = "ID de la note") @PathVariable String id) {
        Note pinnedNote = noteService.pinNote(id);
        return ResponseEntity.ok(pinnedNote);
    }

    @Operation(summary = "Désépingler une note", description = "Retire l'épingle d'une note")
    @ApiResponse(responseCode = "200", description = "Note désépinglée avec succès")
    @PatchMapping("/{id}/unpin")
    
    public ResponseEntity<Note> unpinNote(@Parameter(description = "ID de la note") @PathVariable String id) {
        Note unpinnedNote = noteService.unpinNote(id);
        return ResponseEntity.ok(unpinnedNote);
    }
}
