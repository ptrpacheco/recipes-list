import { useState, useEffect, useMemo } from 'react';

export function useClientPagination<T>(data: T[] | undefined, pageSize = 20) {
  const [limit, setLimit] = useState(pageSize);

  useEffect(() => {
    setLimit(pageSize);
  }, [data]);

  const visibleData = useMemo(() => {
    if (!data) return [];
    return data.slice(0, limit);
  }, [data, limit]);

  const loadMore = () => {
    if (!data) return;
    if (limit >= data.length) return;

    setLimit((prev) => prev + pageSize);
  };

  return {
    visibleData,
    loadMore,
    hasMore: data ? limit < data.length : false,
  };
}