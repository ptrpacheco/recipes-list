import { useState, useEffect, useMemo } from 'react';

export function useClientPagination<T>(data: T[] | undefined, pageSize = 20) {
  // Começamos exibindo apenas a primeira página
  const [limit, setLimit] = useState(pageSize);

  // Resetar a paginação se os dados mudarem (ex: nova busca ou filtro)
  useEffect(() => {
    setLimit(pageSize);
  }, [data]);

  // Corta os dados sem mutar o original
  // useMemo garante que só recalcula se 'data' ou 'limit' mudarem
  const visibleData = useMemo(() => {
    if (!data) return [];
    return data.slice(0, limit);
  }, [data, limit]);

  // Função chamada ao chegar no fim da lista
  const loadMore = () => {
    if (!data) return;
    if (limit >= data.length) return; // Já mostrou tudo

    // Aumenta o limite para mostrar mais itens
    setLimit((prev) => prev + pageSize);
  };

  return {
    visibleData,
    loadMore,
    hasMore: data ? limit < data.length : false,
  };
}