import { cashApi } from "@/api/cashService";
import { useCallback, useRef, useState } from "react";

interface PhotoCacheItem {
  id: string;
  type: 'vehicle' | 'product';
  photoUrl: string;
  timestamp: number;
}

interface UsePhotoCacheReturn {
  getPhoto: (transactionId: string, type: 'vehicle' | 'product') => Promise<string | null>;
  loading: boolean;
  error: string | null;
  clearCache: () => void;
}

const MAX_CACHE_SIZE = 5;

export default function usePhotoCache(): UsePhotoCacheReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, PhotoCacheItem>>(new Map());

  // Função para limpar o cache quando atingir o limite
  const cleanOldestCache = useCallback(() => {
    const cache = cacheRef.current;
    if (cache.size >= MAX_CACHE_SIZE) {
      // Encontrar o item mais antigo
      let oldestKey = '';
      let oldestTimestamp = Date.now();
      
      cache.forEach((item, key) => {
        if (item.timestamp < oldestTimestamp) {
          oldestTimestamp = item.timestamp;
          oldestKey = key;
        }
      });
      
      // Remover o mais antigo
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }
  }, []);

  // Função para gerar chave única do cache
  const getCacheKey = useCallback((transactionId: string, type: 'vehicle' | 'product') => {
    return `${transactionId}-${type}`;
  }, []);

  // Função principal para buscar foto
  const getPhoto = useCallback(async (transactionId: string, type: 'vehicle' | 'product'): Promise<string | null> => {
    const cacheKey = getCacheKey(transactionId, type);
    const cache = cacheRef.current;

    // Verificar se já está no cache
    const cachedItem = cache.get(cacheKey);
    if (cachedItem) {
      // Atualizar timestamp para indicar uso recente
      cachedItem.timestamp = Date.now();
      return cachedItem.photoUrl;
    }

    setLoading(true);
    setError(null);

    try {
      // Buscar foto da API
      console.log(`[usePhotoCache] Buscando foto - TransactionId: ${transactionId}, Type: ${type}`);
      const response = await cashApi.generalHistoryCashPhoto(transactionId, type);
      
      console.log(`[usePhotoCache] Resposta da API:`, response);
      
      if (response.success && response.data.photo) {
        // Converter base64 para data URI
        const base64Photo = response.data.photo;
        const photoUrl = `data:image/jpeg;base64,${base64Photo}`;
        
        console.log(`[usePhotoCache] Foto convertida para data URI - Tamanho: ${base64Photo.length} chars`);
        
        // Limpar cache se necessário antes de adicionar novo item
        cleanOldestCache();
        
        // Adicionar ao cache
        cache.set(cacheKey, {
          id: transactionId,
          type,
          photoUrl,
          timestamp: Date.now()
        });
        
        return photoUrl;
      } else {
        console.log(`[usePhotoCache] Erro na resposta:`, response.message);
        setError(response.message || 'Foto não encontrada');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao buscar foto';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, cleanOldestCache]);

  // Função para limpar todo o cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    getPhoto,
    loading,
    error,
    clearCache
  };
}
