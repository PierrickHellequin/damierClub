'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { App } from 'antd';
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

export default function useArticles(initialFilters?: ArticleFilters): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [stats, setStats] = useState<ArticleStats | null>(null);
  const initialFiltersRef = useRef<ArticleFilters>(initialFilters ?? {});
  const serializedInitialFiltersRef = useRef<string>(JSON.stringify(initialFilters ?? {}));
  const hasFetchedInitialRef = useRef(false);
  const { message: messageApi } = App.useApp();
  const messageRef = useRef(messageApi);

  useEffect(() => {
    messageRef.current = messageApi;
  }, [messageApi]);

  const fetchArticles = useCallback(async (filters: ArticleFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data: ArticlePage = await articleProvider.getArticles({
        ...initialFiltersRef.current,
        ...filters,
      });
      setArticles(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch articles';
      setError(errorMessage);
      messageRef.current?.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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
      messageRef.current?.success('Article créé avec succès');
      await fetchArticles();
      await fetchStats();
      return newArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create article';
      messageRef.current?.error(errorMessage);
      return null;
    }
  }, [fetchArticles, fetchStats]);

  const updateArticle = useCallback(async (
    id: string,
    data: Partial<ArticleFormData>
  ): Promise<Article | null> => {
    try {
      const updatedArticle = await articleProvider.updateArticle(id, data);
      messageRef.current?.success('Article modifié avec succès');
      await fetchArticles();
      return updatedArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update article';
      messageRef.current?.error(errorMessage);
      return null;
    }
  }, [fetchArticles]);

  const deleteArticle = useCallback(async (id: string): Promise<void> => {
    try {
      await articleProvider.deleteArticle(id);
      messageRef.current?.success('Article supprimé avec succès');
      await fetchArticles();
      await fetchStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete article';
      messageRef.current?.error(errorMessage);
      throw err;
    }
  }, [fetchArticles, fetchStats]);

  const publishArticle = useCallback(async (id: string): Promise<Article | null> => {
    try {
      const article = await articleProvider.publishArticle(id);
      messageRef.current?.success('Article publié avec succès');
      await fetchArticles();
      await fetchStats();
      return article;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish article';
      messageRef.current?.error(errorMessage);
      return null;
    }
  }, [fetchArticles, fetchStats]);

  const unpublishArticle = useCallback(async (id: string): Promise<Article | null> => {
    try {
      const article = await articleProvider.unpublishArticle(id);
      messageRef.current?.success('Article dépublié avec succès');
      await fetchArticles();
      await fetchStats();
      return article;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unpublish article';
      messageRef.current?.error(errorMessage);
      return null;
    }
  }, [fetchArticles, fetchStats]);

  const archiveArticle = useCallback(async (id: string): Promise<Article | null> => {
    try {
      const article = await articleProvider.archiveArticle(id);
      messageRef.current?.success('Article archivé avec succès');
      await fetchArticles();
      await fetchStats();
      return article;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to archive article';
      messageRef.current?.error(errorMessage);
      return null;
    }
  }, [fetchArticles, fetchStats]);

  useEffect(() => {
    if (hasFetchedInitialRef.current) {
      return;
    }
    hasFetchedInitialRef.current = true;
    fetchArticles({ ...initialFiltersRef.current });
    fetchStats();
  }, [fetchArticles, fetchStats]);

  useEffect(() => {
    const serialized = JSON.stringify(initialFilters ?? {});
    if (serialized !== serializedInitialFiltersRef.current) {
      serializedInitialFiltersRef.current = serialized;
      initialFiltersRef.current = initialFilters ?? {};
      if (hasFetchedInitialRef.current) {
        fetchArticles({ ...initialFiltersRef.current });
      }
    } else if (!hasFetchedInitialRef.current && initialFilters) {
      initialFiltersRef.current = initialFilters;
    }
  }, [initialFilters, fetchArticles]);

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
