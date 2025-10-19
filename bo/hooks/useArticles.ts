import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import articleProvider from '../providers/articleProvider';
import type {
  Article,
  ArticleFormData,
  ArticleFilters,
  ArticlePage,
  ArticleStats,
} from '../types/article';

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  stats: ArticleStats | null;
  fetchArticles: (filters?: ArticleFilters) => Promise<void>;
  createArticle: (data: ArticleFormData) => Promise<Article | null>;
  updateArticle: (id: string, data: Partial<ArticleFormData>) => Promise<Article | null>;
  deleteArticle: (id: string) => Promise<void>;
  publishArticle: (id: string) => Promise<Article | null>;
  unpublishArticle: (id: string) => Promise<Article | null>;
  archiveArticle: (id: string) => Promise<Article | null>;
  fetchStats: () => Promise<void>;
}

export default function useArticles(initialFilters: ArticleFilters = {}): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [stats, setStats] = useState<ArticleStats | null>(null);

  const fetchArticles = useCallback(async (filters: ArticleFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data: ArticlePage = await articleProvider.getArticles({
        ...initialFilters,
        ...filters,
      });
      setArticles(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch articles';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await articleProvider.getArticleStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch article stats:', err);
    }
  }, []);

  const createArticle = useCallback(async (data: ArticleFormData): Promise<Article | null> => {
    try {
      const newArticle = await articleProvider.createArticle(data);
      message.success('Article créé avec succès');
      await fetchArticles();
      await fetchStats();
      return newArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create article';
      message.error(errorMessage);
      return null;
    }
  }, [fetchArticles, fetchStats]);

  const updateArticle = useCallback(async (
    id: string,
    data: Partial<ArticleFormData>
  ): Promise<Article | null> => {
    try {
      const updatedArticle = await articleProvider.updateArticle(id, data);
      message.success('Article modifié avec succès');
      await fetchArticles();
      return updatedArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update article';
      message.error(errorMessage);
      return null;
    }
  }, [fetchArticles]);

  const deleteArticle = useCallback(async (id: string): Promise<void> => {
    try {
      await articleProvider.deleteArticle(id);
      message.success('Article supprimé avec succès');
      await fetchArticles();
      await fetchStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete article';
      message.error(errorMessage);
      throw err;
    }
  }, [fetchArticles, fetchStats]);

  const publishArticle = useCallback(async (id: string): Promise<Article | null> => {
    try {
      const article = await articleProvider.publishArticle(id);
      message.success('Article publié avec succès');
      await fetchArticles();
      await fetchStats();
      return article;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish article';
      message.error(errorMessage);
      return null;
    }
  }, [fetchArticles, fetchStats]);

  const unpublishArticle = useCallback(async (id: string): Promise<Article | null> => {
    try {
      const article = await articleProvider.unpublishArticle(id);
      message.success('Article dépublié avec succès');
      await fetchArticles();
      await fetchStats();
      return article;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unpublish article';
      message.error(errorMessage);
      return null;
    }
  }, [fetchArticles, fetchStats]);

  const archiveArticle = useCallback(async (id: string): Promise<Article | null> => {
    try {
      const article = await articleProvider.archiveArticle(id);
      message.success('Article archivé avec succès');
      await fetchArticles();
      await fetchStats();
      return article;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to archive article';
      message.error(errorMessage);
      return null;
    }
  }, [fetchArticles, fetchStats]);

  useEffect(() => {
    fetchArticles();
    fetchStats();
  }, [fetchArticles, fetchStats]);

  return {
    articles,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    stats,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    unpublishArticle,
    archiveArticle,
    fetchStats,
  };
}
