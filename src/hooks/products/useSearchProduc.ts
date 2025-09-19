import { useProductCache } from "@/context/ProductCacheContext";
import { Product } from "@/types/productsTypes/products";
import { useState } from "react";

// Hook para produtos com paginação
export function useProductsPagination(limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { loadProductsFromAPI, getAllCachedProducts, loading, error } = useProductCache();

  const loadInitial = async () => {
    setProducts([]);
    setNextCursor(null);
    setHasMore(true);

    try {
      const response = await loadProductsFromAPI(undefined, limit);

      if (response.success) {
        setProducts(response.data.products);
        setNextCursor(response.data.nextCursor || null);
        setHasMore(response.data.hasMore);
      }
    } catch (err: any) {
      console.error('🔍 Paginação: Erro', err);
    }
  };

  const loadMore = async () => {
    if (!nextCursor || loading || !hasMore) {
      return;
    }

    try {
      const response = await loadProductsFromAPI(nextCursor, limit);
      
      if (response.success) {
        setProducts(prev => [...prev, ...response.data.products]);
        setNextCursor(response.data.nextCursor || null);
        setHasMore(response.data.hasMore);
      }
    } catch (err: any) {
      console.error('🔍 Paginação: Erro', err);
    }
  };
  
  // Função para obter todos os produtos do cache
  const getAllProducts = () => {
    return getAllCachedProducts();
  };

  return {
    products,
    loading,
    error,
    nextCursor,
    hasMore,
    loadInitial,
    loadMore,
    getAllProducts
  };
}

export default useProductsPagination;