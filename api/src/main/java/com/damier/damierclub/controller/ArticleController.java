package com.damier.damierclub.controller;

import com.damier.damierclub.model.Article;
import com.damier.damierclub.model.Article.ArticleCategory;
import com.damier.damierclub.model.Article.ArticleStatus;
import com.damier.damierclub.service.ArticleService;
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
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
@Tag(name = "Articles", description = "Gestion des articles - CRUD complet, publication, archivage et statistiques")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Operation(summary = "Récupérer tous les articles",
               description = "Récupère tous les articles avec pagination, tri et filtres (statut, catégorie, recherche)")
    @ApiResponse(responseCode = "200", description = "Liste paginée des articles")
    @GetMapping
    public ResponseEntity<Page<Article>> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "updatedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) ArticleStatus status,
            @RequestParam(required = false) ArticleCategory category,
            @RequestParam(required = false) String search
    ) {
        try {
            Page<Article> articles;

            // Search takes precedence
            if (search != null && !search.isEmpty()) {
                articles = articleService.searchArticles(search, page, size);
            }
            // Filter by status and category
            else if (status != null && category != null) {
                articles = articleService.getArticlesByStatusAndCategory(status, category, page, size);
            }
            // Filter by status only
            else if (status != null) {
                articles = articleService.getArticlesByStatus(status, page, size);
            }
            // Filter by category only
            else if (category != null) {
                articles = articleService.getArticlesByCategory(category, page, size);
            }
            // No filters - get all
            else {
                articles = articleService.getAllArticles(page, size, sortBy, sortDirection);
            }

            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Récupérer un article par ID", description = "Récupère les détails d'un article spécifique")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Article trouvé"),
        @ApiResponse(responseCode = "404", description = "Article non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@Parameter(description = "ID de l'article") @PathVariable String id) {
        try {
            return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Récupérer un article par slug", description = "Récupère un article via son slug (URL publique) et incrémente le compteur de vues")
    @ApiResponse(responseCode = "200", description = "Article trouvé")
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Article> getArticleBySlug(@Parameter(description = "Slug de l'article") @PathVariable String slug) {
        try {
            return articleService.getArticleBySlug(slug)
                .map(article -> {
                    // Increment view count for public access
                    articleService.incrementViewCount(article.getId());
                    return ResponseEntity.ok(article);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Récupérer les articles en vedette", description = "Récupère les articles marqués comme featured")
    @ApiResponse(responseCode = "200", description = "Liste des articles en vedette")
    @GetMapping("/featured")
    public ResponseEntity<List<Article>> getFeaturedArticles() {
        try {
            List<Article> articles = articleService.getFeaturedArticles();
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Récupérer les articles récents", description = "Récupère les articles les plus récents")
    @ApiResponse(responseCode = "200", description = "Liste des articles récents")
    @GetMapping("/recent")
    public ResponseEntity<List<Article>> getRecentArticles(
            @Parameter(description = "Nombre d'articles à récupérer") @RequestParam(defaultValue = "5") int limit
    ) {
        try {
            List<Article> articles = articleService.getRecentArticles(limit);
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Récupérer les articles les plus vus", description = "Récupère les articles avec le plus de vues")
    @ApiResponse(responseCode = "200", description = "Liste des articles les plus vus")
    @GetMapping("/most-viewed")
    public ResponseEntity<List<Article>> getMostViewedArticles() {
        try {
            List<Article> articles = articleService.getMostViewedArticles();
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Récupérer les statistiques des articles", description = "Récupère les statistiques globales (total, publiés, brouillons, archivés, vues)")
    @ApiResponse(responseCode = "200", description = "Statistiques des articles")
    @GetMapping("/stats")
    public ResponseEntity<ArticleService.ArticleStats> getArticleStats() {
        try {
            ArticleService.ArticleStats stats = articleService.getArticleStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Créer un nouvel article", description = "Crée un nouvel article (nécessite rôle Super Admin, President ou Editor)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Article créé avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PostMapping
    
    public ResponseEntity<Article> createArticle(
            @RequestBody Article article,
            @Parameter(description = "Email de l'auteur", required = true) @RequestHeader("X-User-Email") String authorEmail
    ) {
        try {
            Article createdArticle = articleService.createArticle(article, authorEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Mettre à jour un article", description = "Met à jour un article existant (nécessite rôle Super Admin ou President)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Article mis à jour avec succès"),
        @ApiResponse(responseCode = "404", description = "Article non trouvé"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PutMapping("/{id}")
    
    public ResponseEntity<Article> updateArticle(
            @Parameter(description = "ID de l'article") @PathVariable String id,
            @RequestBody Article article
    ) {
        try {
            Article updatedArticle = articleService.updateArticle(id, article);
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Publier un article", description = "Change le statut d'un article à PUBLISHED")
    @ApiResponse(responseCode = "200", description = "Article publié avec succès")
    @PatchMapping("/{id}/publish")
    
    public ResponseEntity<Article> publishArticle(@Parameter(description = "ID de l'article") @PathVariable String id) {
        try {
            Article article = articleService.publishArticle(id);
            return ResponseEntity.ok(article);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Dépublier un article", description = "Change le statut d'un article à DRAFT")
    @ApiResponse(responseCode = "200", description = "Article dépublié avec succès")
    @PatchMapping("/{id}/unpublish")
    
    public ResponseEntity<Article> unpublishArticle(@Parameter(description = "ID de l'article") @PathVariable String id) {
        try {
            Article article = articleService.unpublishArticle(id);
            return ResponseEntity.ok(article);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Archiver un article", description = "Change le statut d'un article à ARCHIVED")
    @ApiResponse(responseCode = "200", description = "Article archivé avec succès")
    @PatchMapping("/{id}/archive")
    
    public ResponseEntity<Article> archiveArticle(@Parameter(description = "ID de l'article") @PathVariable String id) {
        try {
            Article article = articleService.archiveArticle(id);
            return ResponseEntity.ok(article);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Supprimer un article", description = "Supprime définitivement un article (nécessite rôle Super Admin)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Article supprimé avec succès"),
        @ApiResponse(responseCode = "404", description = "Article non trouvé")
    })
    @DeleteMapping("/{id}")
    
    public ResponseEntity<Void> deleteArticle(@Parameter(description = "ID de l'article") @PathVariable String id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Incrémenter le compteur de vues", description = "Incrémente le compteur de vues d'un article")
    @ApiResponse(responseCode = "200", description = "Compteur incrémenté avec succès")
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@Parameter(description = "ID de l'article") @PathVariable String id) {
        try {
            articleService.incrementViewCount(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
