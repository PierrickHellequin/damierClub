package com.damier.damierclub.service;

import com.damier.damierclub.dto.PublicArticleDTO;
import com.damier.damierclub.dto.PublicArticleSummaryDTO;
import com.damier.damierclub.dto.PublicClubDTO;
import com.damier.damierclub.dto.PublicClubSummaryDTO;
import com.damier.damierclub.dto.PublicStatsDTO;
import com.damier.damierclub.mapper.PublicMapper;
import com.damier.damierclub.model.Article;
import com.damier.damierclub.model.Article.ArticleCategory;
import com.damier.damierclub.model.Article.ArticleStatus;
import com.damier.damierclub.model.Club;
import com.damier.damierclub.repository.ArticleRepository;
import com.damier.damierclub.repository.ClubRepository;
import com.damier.damierclub.repository.MemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Read-only service that powers the public-facing API.
 * Always filters out non-PUBLISHED articles and never exposes sensitive fields.
 */
@Service
public class PublicService {

    private final ArticleRepository articleRepository;
    private final ClubRepository clubRepository;
    private final MemberRepository memberRepository;

    public PublicService(ArticleRepository articleRepository,
                         ClubRepository clubRepository,
                         MemberRepository memberRepository) {
        this.articleRepository = articleRepository;
        this.clubRepository = clubRepository;
        this.memberRepository = memberRepository;
    }

    public Page<PublicArticleSummaryDTO> listArticles(int page, int size,
                                                      ArticleCategory category,
                                                      String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<Article> articles;
        if (search != null && !search.isBlank()) {
            articles = articleRepository.searchArticlesByStatus(search, ArticleStatus.PUBLISHED, pageable);
        } else if (category != null) {
            articles = articleRepository.findByStatusAndCategory(ArticleStatus.PUBLISHED, category, pageable);
        } else {
            articles = articleRepository.findByStatus(ArticleStatus.PUBLISHED, pageable);
        }
        return articles.map(PublicMapper::toArticleSummary);
    }

    public List<PublicArticleSummaryDTO> featuredArticles() {
        return articleRepository.findByFeaturedTrueAndStatus(ArticleStatus.PUBLISHED).stream()
            .map(PublicMapper::toArticleSummary)
            .toList();
    }

    public List<PublicArticleSummaryDTO> recentArticles(int limit) {
        Pageable pageable = PageRequest.of(0, Math.max(1, Math.min(limit, 50)));
        return articleRepository.findRecentArticles(ArticleStatus.PUBLISHED, pageable).stream()
            .map(PublicMapper::toArticleSummary)
            .toList();
    }

    @Transactional
    public Optional<PublicArticleDTO> articleBySlug(String slug) {
        return articleRepository.findBySlugAndStatus(slug, ArticleStatus.PUBLISHED)
            .map(article -> {
                article.incrementViewCount();
                articleRepository.save(article);
                return PublicMapper.toArticle(article);
            });
    }

    public ArticleCategory[] articleCategories() {
        return ArticleCategory.values();
    }

    public Page<PublicClubSummaryDTO> listClubs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return clubRepository.findAll(pageable)
            .map(club -> PublicMapper.toClubSummary(club, memberRepository.countByClub_Id(club.getId())));
    }

    public Optional<PublicClubDTO> clubById(UUID id) {
        return clubRepository.findById(id)
            .map(club -> PublicMapper.toClub(club, memberRepository.countByClub_Id(club.getId())));
    }

    public PublicStatsDTO globalStats() {
        return new PublicStatsDTO(
            clubRepository.count(),
            memberRepository.countByActiveTrue(),
            articleRepository.countByStatus(ArticleStatus.PUBLISHED)
        );
    }
}
