import { apiProvider } from './apiProvider';
import type {
  Article,
  ArticleFormData,
  ArticleFilters,
  ArticlePage,
  ArticleStats,
} from '../types/article';

const articleProvider = {
  /**
   * Get all articles with pagination and filters
   */
  async getArticles(filters: ArticleFilters = {}): Promise<ArticlePage> {
    const params = new URLSearchParams();

    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `articles?${queryString}` : 'articles';

    return apiProvider.call<ArticlePage>({
      url,
      method: 'GET',
    });
  },

  /**
   * Get article by ID
   */
  async getArticle(id: string): Promise<Article> {
    return apiProvider.call<Article>({
      url: `articles/${id}`,
      method: 'GET',
    });
  },

  /**
   * Get article by slug
   */
  async getArticleBySlug(slug: string): Promise<Article> {
    return apiProvider.call<Article>({
      url: `articles/slug/${slug}`,
      method: 'GET',
    });
  },

  /**
   * Get featured articles
   */
  async getFeaturedArticles(): Promise<Article[]> {
    return apiProvider.call<Article[]>({
      url: 'articles/featured',
      method: 'GET',
    });
  },

  /**
   * Get recent articles
   */
  async getRecentArticles(limit: number = 5): Promise<Article[]> {
    return apiProvider.call<Article[]>({
      url: `articles/recent?limit=${limit}`,
      method: 'GET',
    });
  },

  /**
   * Get most viewed articles
   */
  async getMostViewedArticles(): Promise<Article[]> {
    return apiProvider.call<Article[]>({
      url: 'articles/most-viewed',
      method: 'GET',
    });
  },

  /**
   * Get article statistics
   */
  async getArticleStats(): Promise<ArticleStats> {
    return apiProvider.call<ArticleStats>({
      url: 'articles/stats',
      method: 'GET',
    });
  },

  /**
   * Create new article
   */
  async createArticle(data: ArticleFormData): Promise<Article> {
    return apiProvider.call<Article>({
      url: 'articles',
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update article
   */
  async updateArticle(id: string, data: Partial<ArticleFormData>): Promise<Article> {
    return apiProvider.call<Article>({
      url: `articles/${id}`,
      method: 'PUT',
      body: data,
    });
  },

  /**
   * Publish article
   */
  async publishArticle(id: string): Promise<Article> {
    return apiProvider.call<Article>({
      url: `articles/${id}/publish`,
      method: 'PATCH',
    });
  },

  /**
   * Unpublish article
   */
  async unpublishArticle(id: string): Promise<Article> {
    return apiProvider.call<Article>({
      url: `articles/${id}/unpublish`,
      method: 'PATCH',
    });
  },

  /**
   * Archive article
   */
  async archiveArticle(id: string): Promise<Article> {
    return apiProvider.call<Article>({
      url: `articles/${id}/archive`,
      method: 'PATCH',
    });
  },

  /**
   * Delete article
   */
  async deleteArticle(id: string): Promise<void> {
    return apiProvider.call<void>({
      url: `articles/${id}`,
      method: 'DELETE',
    });
  },

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    return apiProvider.call<void>({
      url: `articles/${id}/view`,
      method: 'POST',
    });
  },
};

export default articleProvider;
