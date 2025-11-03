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
  const [page, setPage] = useState<number>(1); // API pagination starts from 1
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

        console.log('Pagination API response:', JSON.stringify(response, null, 2));

        // Handle different API response structures
        // Check for _embedded.content first (Spring HATEOAS format)
        const content = response._embedded?.content ||
                       response.content ||
                       (response.data && typeof response.data === 'object' && !Array.isArray(response.data) ? response.data.content : undefined) ||
                       (Array.isArray(response.data) ? response.data : undefined) ||
                       [];

        // Handle page info from different formats
        const pageInfo = response.page || response;
        const currentPage = pageInfo.number ?? response.number ?? pageNumber;
        const pages = pageInfo.total_pages ?? pageInfo.totalPages ?? response.totalPages ?? 1;
        const total = pageInfo.total_elements ?? pageInfo.totalElements ?? response.totalElements ?? content.length;

        console.log('Parsed pagination data:', {
          contentLength: content.length,
          currentPage,
          totalPages: pages,
          totalElements: total
        });

        if (append) {
          setItems(prev => [...prev, ...content]);
        } else {
          setItems(content);
        }

        setPage(currentPage);
        setTotalPages(pages);
        setTotalElements(total);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        console.error('Pagination fetch error:', errorMessage, err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, size]
  );

  const loadMore = useCallback(async () => {
    if (page < totalPages && !loading) {
      await fetchPage(page + 1, true);
    }
  }, [page, totalPages, loading, fetchPage]);

  const refresh = useCallback(async () => {
    setItems([]);
    setPage(1);
    await fetchPage(1, false); // Start from page 1
  }, [fetchPage]);

  const setPageSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(1); // Reset to page 1
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
    hasMore: page < totalPages,
    loadMore,
    refresh,
    setPageSize,
  };
}
