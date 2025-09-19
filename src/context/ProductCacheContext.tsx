import { ProductApi } from '@/api/productsService';
import { BarcodeSearchResponse, Product, Responselist } from '@/types/productsTypes/products';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface CachedProduct extends Product {
  originalStock: number; // Estoque original da API
  soldQuantity: number; // Quantidade já vendida
  availableStock: number; // Estoque disponível (original - vendido)
}

interface ProductCache {
  [productName: string]: CachedProduct;
}

interface ProductCacheContextType {
  // Cache operations
  addToCache: (product: Product) => void;
  getFromCache: (productName: string) => CachedProduct | null;
  updateSoldQuantity: (productName: string, soldQuantity: number) => void;
  getAllCachedProducts: () => CachedProduct[];
  clearCache: () => void;
  hasProduct: (productName: string) => boolean;
  getCacheStats: () => {
    totalProducts: number;
    totalOriginalStock: number;
    totalSoldQuantity: number;
    totalAvailableStock: number;
  };
  
  // API operations
  loadProductsFromAPI: (cursor?: string, limit?: number) => Promise<Responselist>;
  searchProductByBarcode: (barcode: string) => Promise<BarcodeSearchResponse>;
  getProductOrFetch: (productName: string) => Promise<CachedProduct | null>;
  
  // State
  productCache: ProductCache;
  loading: boolean;
  error: string | null;
}

const ProductCacheContext = createContext<ProductCacheContextType | undefined>(undefined);

interface ProductCacheProviderProps {
  children: ReactNode;
}

export function ProductCacheProvider({ children }: ProductCacheProviderProps) {
  const [productCache, setProductCache] = useState<ProductCache>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adicionar produto ao cache
  const addToCache = useCallback((product: Product) => {
    const productName = product.productName;
    
    setProductCache(prev => {
      // Se o produto já existe no cache, não sobrescreve
      if (prev[productName]) {
        return prev;
      }

      const cachedProduct: CachedProduct = {
        ...product,
        originalStock: product.quantity,
        soldQuantity: 0,
        availableStock: product.quantity
      };

      console.log('📦 Cache: Adicionado', productName);
      
      return {
        ...prev,
        [productName]: cachedProduct
      };
    });
  }, []);

  // Buscar produto no cache
  const getFromCache = useCallback((productName: string): CachedProduct | null => {
    const cached = productCache[productName];
    return cached || null;
  }, [productCache]);

  // Atualizar quantidade vendida de um produto
  const updateSoldQuantity = useCallback((productName: string, soldQuantity: number) => {
    setProductCache(prev => {
      if (!prev[productName]) {
        return prev;
      }

      const produtoAnterior = prev[productName];
      const updated = {
        ...produtoAnterior,
        soldQuantity,
        availableStock: produtoAnterior.originalStock - soldQuantity
      };

      console.log('📦 Cache: Atualizado', productName, `vendido: ${soldQuantity}`);

      return {
        ...prev,
        [productName]: updated
      };
    });
  }, []);

  // Obter todos os produtos do cache
  const getAllCachedProducts = useCallback((): CachedProduct[] => {
    return Object.values(productCache);
  }, [productCache]);

  // Limpar cache
  const clearCache = useCallback(() => {
    console.log('📦 Cache: Limpando');
    setProductCache({});
  }, []);

  // Verificar se produto existe no cache
  const hasProduct = useCallback((productName: string): boolean => {
    return productName in productCache;
  }, [productCache]);

  // Obter estatísticas do cache
  const getCacheStats = useCallback(() => {
    const products = Object.values(productCache);
    return {
      totalProducts: products.length,
      totalOriginalStock: products.reduce((sum, p) => sum + p.originalStock, 0),
      totalSoldQuantity: products.reduce((sum, p) => sum + p.soldQuantity, 0),
      totalAvailableStock: products.reduce((sum, p) => sum + p.availableStock, 0)
    };
  }, [productCache]);

  // Buscar produtos da API e adicionar ao cache
  const loadProductsFromAPI = useCallback(async (cursor?: string, limit: number = 10): Promise<Responselist> => {
    setLoading(true);
    setError(null);

    try {
      const response = await ProductApi.listProducts(cursor, limit);
      
      if (response.success) {
        // Adicionar produtos ao cache
        response.data.products.forEach((product) => {
          addToCache(product);
        });
        
        console.log('📦 API: Carregados', response.data.products.length, 'produtos');
      } else {
        setError(response.message || 'Erro ao carregar produtos');
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar produtos';
      console.error('📦 API: Erro', errorMessage);
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        data: {
          products: [],
          hasMore: false
        }
      };
    } finally {
      setLoading(false);
    }
  }, [addToCache]);

  // Buscar produto por código de barras na API e adicionar ao cache
  const searchProductByBarcode = useCallback(async (barcode: string): Promise<BarcodeSearchResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await ProductApi.lookupByBarcode(barcode);
      
      if (response.success && response.data) {
        // Converter dados da API para formato Product
        const product: Product = {
          id: response.data.id,
          productName: response.data.productName,
          barcode: response.data.barcode,
          unitPrice: response.data.unitPrice,
          quantity: response.data.quantity,
          expirationDate: response.data.expirationDate
        };

        // Adicionar produto ao cache
        addToCache(product);
        
        console.log('📦 API: Produto encontrado', product.productName);
        
        return {
          success: true,
          message: response.message || "Produto encontrado na base de dados.",
          data: product
        };
      } else {
        setError(response.message || "Erro ao buscar produto na base de dados.");
        return {
          success: false,
          message: response.message || "Erro ao buscar produto na base de dados.",
          data: undefined
        };
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao buscar produto na base de dados.";
      console.error('📦 API: Erro busca', errorMessage);
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        data: undefined
      };
    } finally {
      setLoading(false);
    }
  }, [addToCache]);

  // Buscar produto no cache ou na API se não existir
  const getProductOrFetch = useCallback(async (productName: string): Promise<CachedProduct | null> => {
    // Primeiro, tentar buscar no cache
    const cachedProduct = getFromCache(productName);
    if (cachedProduct) {
      return cachedProduct;
    }

    // Se não estiver no cache, não podemos buscar por nome na API
    // A API só permite busca por código de barras
    return null;
  }, [getFromCache]);

  const value: ProductCacheContextType = {
    addToCache,
    getFromCache,
    updateSoldQuantity,
    getAllCachedProducts,
    clearCache,
    hasProduct,
    getCacheStats,
    loadProductsFromAPI,
    searchProductByBarcode,
    getProductOrFetch,
    productCache,
    loading,
    error
  };

  return (
    <ProductCacheContext.Provider value={value}>
      {children}
    </ProductCacheContext.Provider>
  );
}

export function useProductCache(): ProductCacheContextType {
  const context = useContext(ProductCacheContext);
  if (context === undefined) {
    throw new Error('useProductCache must be used within a ProductCacheProvider');
  }
  return context;
}

export default ProductCacheProvider;
