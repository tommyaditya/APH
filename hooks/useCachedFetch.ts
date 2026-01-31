import { useCallback, useEffect, useRef, useState } from 'react';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseCachedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCachedFetch = <T>(
  fetchFunction: () => Promise<T>,
  cacheKey: string,
  dependencies: any[] = []
): UseCachedFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          if (isMounted.current) {
            setData(cached.data);
            setLoading(false);
            setError(null);
          }
          return;
        }
      }

      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      const result = await fetchFunction();

      if (isMounted.current) {
        // Cache the result
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setData(null);
        setLoading(false);
      }
    }
  }, [fetchFunction, cacheKey]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useCachedFetch;
