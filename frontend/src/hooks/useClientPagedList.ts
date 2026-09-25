import { useEffect, useMemo, useState } from 'react';
import { PAGE_SIZE } from '../lib/pagination';

export function useClientPagedList<T>(items: T[], pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const totalCount = items.length;
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize);

  useEffect(() => {
    setPage(1);
  }, [items, pageSize]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { items: pagedItems, totalCount, totalPages, page, setPage };
}