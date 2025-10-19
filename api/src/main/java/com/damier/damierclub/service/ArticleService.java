package com.damier.damierclub.service;

import com.damier.damierclub.model.Article;
import com.damier.damierclub.model.Article.ArticleCategory;
import com.damier.damierclub.model.Article.ArticleStatus;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.repository.ArticleRepository;
import com.damier.damierclub.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private MemberRepository memberRepository;

    /**
     * Get all articles with pagination
     */
    public Page<Article> getAllArticles(int page, int size, String sortBy, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return articleRepository.findAll(pageable);
    }

    /**
     * Get articles by status
     */
    public Page<Article> getArticlesByStatus(ArticleStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return articleRepository.findByStatus(status, pageable);
    }

    /**
     * Get articles by category
     */
    public Page<Article> getArticlesByCategory(ArticleCategory category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return articleRepository.findByCategory(category, pageable);
    }

    /**
     * Get articles by status and category
     */
    public Page<Article> getArticlesByStatusAndCategory(ArticleStatus status, ArticleCategory category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return articleRepository.findByStatusAndCategory(status, category, pageable);
    }

    /**
     * Search articles
     */
    public Page<Article> searchArticles(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return articleRepository.searchArticles(searchTerm, pageable);
    }

    /**
     * Get featured articles
     */
    public List<Article> getFeaturedArticles() {
        return articleRepository.findByFeaturedTrueAndStatus(ArticleStatus.PUBLISHED);
    }

    /**
     * Get recent articles
     */
    public List<Article> getRecentArticles(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return articleRepository.findRecentArticles(ArticleStatus.PUBLISHED, pageable);
    }

    /**
     * Get most viewed articles
     */
    public List<Article> getMostViewedArticles() {
        return articleRepository.findTop10ByStatusOrderByViewCountDesc(ArticleStatus.PUBLISHED);
    }

    /**
     * Get article by ID
     */
    public Optional<Article> getArticleById(String id) {
        return articleRepository.findById(id);
    }

    /**
     * Get article by slug
     */
    public Optional<Article> getArticleBySlug(String slug) {
        return articleRepository.findBySlug(slug);
    }

    /**
     * Create new article
     */
    @Transactional
    public Article createArticle(Article article, String authorEmail) {
        Member author = memberRepository.findByEmail(authorEmail);
        if (author == null) {
            throw new RuntimeException("Author not found with email: " + authorEmail);
        }

        article.setAuthor(author);

        // Generate slug if not provided
        if (article.getSlug() == null || article.getSlug().isEmpty()) {
            article.setSlug(generateUniqueSlug(article.getTitle()));
        } else {
            // Validate slug uniqueness
            if (articleRepository.existsBySlug(article.getSlug())) {
                throw new RuntimeException("Slug already exists: " + article.getSlug());
            }
        }

        // Set default status if not provided
        if (article.getStatus() == null) {
            article.setStatus(ArticleStatus.DRAFT);
        }

        return articleRepository.save(article);
    }

    /**
     * Update article
     */
    @Transactional
    public Article updateArticle(String id, Article updatedArticle) {
        Article existingArticle = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        // Update fields
        if (updatedArticle.getTitle() != null) {
            existingArticle.setTitle(updatedArticle.getTitle());
        }

        if (updatedArticle.getSlug() != null && !updatedArticle.getSlug().equals(existingArticle.getSlug())) {
            if (articleRepository.existsBySlug(updatedArticle.getSlug())) {
                throw new RuntimeException("Slug already exists: " + updatedArticle.getSlug());
            }
            existingArticle.setSlug(updatedArticle.getSlug());
        }

        if (updatedArticle.getContent() != null) {
            existingArticle.setContent(updatedArticle.getContent());
        }

        if (updatedArticle.getExcerpt() != null) {
            existingArticle.setExcerpt(updatedArticle.getExcerpt());
        }

        if (updatedArticle.getCategory() != null) {
            existingArticle.setCategory(updatedArticle.getCategory());
        }

        if (updatedArticle.getCoverImage() != null) {
            existingArticle.setCoverImage(updatedArticle.getCoverImage());
        }

        if (updatedArticle.getTags() != null) {
            existingArticle.setTags(updatedArticle.getTags());
        }

        if (updatedArticle.getFeatured() != null) {
            existingArticle.setFeatured(updatedArticle.getFeatured());
        }

        return articleRepository.save(existingArticle);
    }

    /**
     * Publish article
     */
    @Transactional
    public Article publishArticle(String id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        if (article.getStatus() == ArticleStatus.PUBLISHED) {
            throw new RuntimeException("Article is already published");
        }

        article.setStatus(ArticleStatus.PUBLISHED);
        article.setPublishedAt(LocalDateTime.now());

        return articleRepository.save(article);
    }

    /**
     * Unpublish article (back to draft)
     */
    @Transactional
    public Article unpublishArticle(String id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        article.setStatus(ArticleStatus.DRAFT);
        article.setPublishedAt(null);

        return articleRepository.save(article);
    }

    /**
     * Archive article
     */
    @Transactional
    public Article archiveArticle(String id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        article.setStatus(ArticleStatus.ARCHIVED);

        return articleRepository.save(article);
    }

    /**
     * Delete article
     */
    @Transactional
    public void deleteArticle(String id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        articleRepository.delete(article);
    }

    /**
     * Increment view count
     */
    @Transactional
    public void incrementViewCount(String id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        article.incrementViewCount();
        articleRepository.save(article);
    }

    /**
     * Get article statistics
     */
    public ArticleStats getArticleStats() {
        long totalArticles = articleRepository.count();
        long publishedCount = articleRepository.countByStatus(ArticleStatus.PUBLISHED);
        long draftCount = articleRepository.countByStatus(ArticleStatus.DRAFT);
        long archivedCount = articleRepository.countByStatus(ArticleStatus.ARCHIVED);

        return new ArticleStats(totalArticles, publishedCount, draftCount, archivedCount);
    }

    /**
     * Generate unique slug from title
     */
    private String generateUniqueSlug(String title) {
        String baseSlug = toSlug(title);
        String slug = baseSlug;
        int counter = 1;

        while (articleRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }

    /**
     * Convert string to URL-friendly slug
     */
    private String toSlug(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        // Normalize accented characters
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String withoutAccents = pattern.matcher(normalized).replaceAll("");

        // Convert to lowercase and replace spaces/special chars with hyphens
        return withoutAccents.toLowerCase(Locale.ENGLISH)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-+", "")
            .replaceAll("-+$", "");
    }

    /**
     * Inner class for article statistics
     */
    public static class ArticleStats {
        private long total;
        private long published;
        private long draft;
        private long archived;

        public ArticleStats(long total, long published, long draft, long archived) {
            this.total = total;
            this.published = published;
            this.draft = draft;
            this.archived = archived;
        }

        // Getters
        public long getTotal() { return total; }
        public long getPublished() { return published; }
        public long getDraft() { return draft; }
        public long getArchived() { return archived; }
    }
}
