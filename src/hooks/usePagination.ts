import { useState, useCallback } from 'react';
import { PaginationParams, PaginatedResponse } from '../types/camera';

export interface UsePaginationReturn<T> {
  items: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setPageSize: (size: number) => void;
}

export function usePagination<T>(
  fetchFunction: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  initialPageSize: number = 20
): UsePaginationReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(initialPageSize);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNumber: number, append: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchFunction({
          paged: true,
          page: pageNumber,
          size,
        });

        if (append) {
          setItems(prev => [...prev, ...response.content]);
        } else {
          setItems(response.content);
        }

        setPage(response.number);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, size]
  );

  const loadMore = useCallback(async () => {
    if (page < totalPages - 1 && !loading) {
      await fetchPage(page + 1, true);
    }
  }, [page, totalPages, loading, fetchPage]);

  const refresh = useCallback(async () => {
    setItems([]);
    setPage(0);
    await fetchPage(0, false);
  }, [fetchPage]);

  const setPageSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
    setItems([]);
  }, []);

  return {
    items,
    page,
    size,
    totalPages,
    totalElements,
    loading,
    error,
    hasMore: page < totalPages - 1,
    loadMore,
    refresh,
    setPageSize,
  };
}
