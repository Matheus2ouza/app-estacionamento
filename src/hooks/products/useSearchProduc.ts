import { ProductApi } from "@/src/api/productsService";
import { Product } from "@/src/types/productsTypes/products";
import { useState } from "react";

// Hook para produtos com paginação
export function useProductsPagination(limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadInitial = async () => {
    console.log('🔍 [useProductsPagination] Carregando produtos iniciais...');
    setLoading(true);
    setError(null);
    setProducts([]);
    setNextCursor(null);
    setHasMore(true);

    try {
      const response = await ProductApi.listProducts(undefined, limit);
      console.log('🔍 [useProductsPagination] Response:', response);
      console.log('🔍 [useProductsPagination] Response.data.products:', response.data.products);

      if (response.success) {
        setProducts(response.data.products);
        setNextCursor(response.data.nextCursor || null);
        setHasMore(response.data.hasMore);
        
      } else {
        setError(response.message || 'Erro ao carregar produtos');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar produtos';
      console.error('❌ [useProductsPagination] Erro:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextCursor || loading || !hasMore) {
      return;
    }

    console.log('🔍 [useProductsPagination] Carregando mais produtos...');
    setLoading(true);
    setError(null);

    try {
      const response = await ProductApi.listProducts(nextCursor, limit);
      
      if (response.success) {
        setProducts(prev => [...prev, ...response.data.products]);
        setNextCursor(response.data.nextCursor || null);
        setHasMore(response.data.hasMore);
        
        console.log('🔍 [useProductsPagination] Mais produtos carregados:', response.data.products.length);
        console.log('🔍 [useProductsPagination] HasMore:', response.data.hasMore);
        console.log('🔍 [useProductsPagination] NextCursor:', response.data.nextCursor);
      } else {
        setError(response.message || 'Erro ao carregar mais produtos');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar mais produtos';
      console.error('❌ [useProductsPagination] Erro:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    products,
    loading,
    error,
    nextCursor,
    hasMore,
    loadInitial,
    loadMore
  };
}

export default useProductsPagination;