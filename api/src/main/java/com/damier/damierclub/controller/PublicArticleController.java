package com.damier.damierclub.controller;

import com.damier.damierclub.dto.PublicArticleDTO;
import com.damier.damierclub.dto.PublicArticleSummaryDTO;
import com.damier.damierclub.model.Article.ArticleCategory;
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

@RestController
@RequestMapping("/api/public/articles")
@Tag(name = "Public - Articles", description = "Endpoints publics (sans auth) servant le site vitrine. N'expose que les articles PUBLISHED.")
public class PublicArticleController {

    private final PublicService publicService;

    public PublicArticleController(PublicService publicService) {
        this.publicService = publicService;
    }

    @Operation(summary = "Liste paginée des articles publiés")
    @GetMapping
    public Page<PublicArticleSummaryDTO> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) ArticleCategory category,
            @RequestParam(required = false) String search
    ) {
        return publicService.listArticles(page, size, category, search);
    }

    @Operation(summary = "Articles en vedette publiés")
    @GetMapping("/featured")
    public List<PublicArticleSummaryDTO> featured() {
        return publicService.featuredArticles();
    }

    @Operation(summary = "Derniers articles publiés")
    @GetMapping("/recent")
    public List<PublicArticleSummaryDTO> recent(@RequestParam(defaultValue = "5") int limit) {
        return publicService.recentArticles(limit);
    }

    @Operation(summary = "Liste des catégories disponibles")
    @GetMapping("/categories")
    public ArticleCategory[] categories() {
        return publicService.articleCategories();
    }

    @Operation(summary = "Détail d'un article publié par son slug. Incrémente le compteur de vues.")
    @GetMapping("/{slug}")
    public ResponseEntity<PublicArticleDTO> bySlug(@PathVariable String slug) {
        return publicService.articleBySlug(slug)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
