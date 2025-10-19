package com.damier.damierclub.repository;

import com.damier.damierclub.model.Article;
import com.damier.damierclub.model.Article.ArticleCategory;
import com.damier.damierclub.model.Article.ArticleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> {

    /**
     * Find article by slug (for public URLs)
     */
    Optional<Article> findBySlug(String slug);

    /**
     * Check if slug exists (for uniqueness validation)
     */
    boolean existsBySlug(String slug);

    /**
     * Find all articles by status with pagination
     */
    Page<Article> findByStatus(ArticleStatus status, Pageable pageable);

    /**
     * Find all articles by category with pagination
     */
    Page<Article> findByCategory(ArticleCategory category, Pageable pageable);

    /**
     * Find all articles by status and category with pagination
     */
    Page<Article> findByStatusAndCategory(ArticleStatus status, ArticleCategory category, Pageable pageable);

    /**
     * Find all featured articles
     */
    List<Article> findByFeaturedTrueAndStatus(ArticleStatus status);

    /**
     * Find articles by author
     */
    @Query("SELECT a FROM Article a WHERE a.author.id = :authorId")
    Page<Article> findByAuthorId(@Param("authorId") String authorId, Pageable pageable);

    /**
     * Search articles by title or content
     */
    @Query("SELECT a FROM Article a WHERE " +
           "LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.excerpt) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Article> searchArticles(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Get recent articles (ordered by publishedAt)
     */
    @Query("SELECT a FROM Article a WHERE a.status = :status ORDER BY a.publishedAt DESC")
    List<Article> findRecentArticles(@Param("status") ArticleStatus status, Pageable pageable);

    /**
     * Get most viewed articles
     */
    List<Article> findTop10ByStatusOrderByViewCountDesc(ArticleStatus status);

    /**
     * Count articles by status
     */
    long countByStatus(ArticleStatus status);

    /**
     * Count articles by author
     */
    @Query("SELECT COUNT(a) FROM Article a WHERE a.author.id = :authorId")
    long countByAuthorId(@Param("authorId") String authorId);
}
