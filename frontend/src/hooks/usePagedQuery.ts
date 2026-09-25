import { useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../lib/http';
import type { PagedResult } from '../types/paged';
import { useDebouncedValue } from './useDebouncedValue';

type PageLoader<T, TFilters> = (filters: TFilters, page: number, pageSize: number) => Promise<PagedResult<T>>;

export function usePagedQuery<T, TFilters>(filters: TFilters, pageSize: number, loader: PageLoader<T, TFilters>) {
  const [items, setItems] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const requestId = useRef(0);
  const filtersRef = useRef(filters);
  const filterKey = JSON.stringify(filters);
  const debouncedFilterKey = useDebouncedValue(filterKey);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  useEffect(() => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setError(null);

    loader(filtersRef.current, page, pageSize)
      .then((result) => {
        if (currentRequestId !== requestId.current) return;
        setItems(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      })
      .catch((requestError: unknown) => {
        if (currentRequestId !== requestId.current) return;
        setError(getErrorMessage(requestError, 'Failed to load data.'));
      })
      .finally(() => {
        if (currentRequestId === requestId.current) setIsLoading(false);
      });
  }, [debouncedFilterKey, loader, page, pageSize, reloadKey]);

  return {
    items,
    totalCount,
    totalPages,
    page,
    setPage,
    isLoading,
    error,
    reload: () => setReloadKey((currentKey) => currentKey + 1),
  };
}