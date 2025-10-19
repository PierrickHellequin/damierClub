import { useState, useEffect } from 'react';
import articleProvider from '../providers/articleProvider';
import type { Article } from '../types/article';

export default function useArticle(id: string | null) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setArticle(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await articleProvider.getArticle(id);
        if (isMounted) {
          setArticle(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch article');
          setArticle(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { article, loading, error };
}
