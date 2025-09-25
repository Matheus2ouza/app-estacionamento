import { photoData } from '@/types/vehicleTypes/vehicles';
import { useState } from 'react';
import { VehicleApi } from '../../api/vehicleFlowService';

// Cache global para armazenar fotos já carregadas
const photoCache = new Map<string, photoData>();
const MAX_CACHE_SIZE = 5; // Limite máximo de fotos no cache

export const useVehiclePhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<photoData | null>(null);

  const fetchVehiclePhoto = async (vehicleId: string): Promise<photoData | null> => {
    // Verificar se a foto já está no cache
    if (photoCache.has(vehicleId)) {
      const cachedPhoto = photoCache.get(vehicleId)!;
      setPhotoData(cachedPhoto);
      return cachedPhoto;
    }

    setLoading(true);
    setError(null);
    setPhotoData(null);

    try {
      const response = await VehicleApi.vehiclePhoto(vehicleId);

      if (response.success && response.data) {
        // Verificar se realmente há dados de foto (não apenas o prefixo)
        const hasRealPhoto = response.data.photo && response.data.photo.length > 0;
        
        if (hasRealPhoto) {
          // O backend retorna base64 sem prefixo, precisamos adicionar
          const photoData = {
            photo: `data:${response.data.photoType || 'image/jpeg'};base64,${response.data.photo}`,
            photoType: response.data.photoType || 'image/jpeg'
          };
          
          // Armazenar no cache com limite de tamanho
          if (photoCache.size >= MAX_CACHE_SIZE) {
            // Remove o primeiro item (mais antigo) quando o cache está cheio
            const firstKey = photoCache.keys().next().value;
            if (firstKey) {
              photoCache.delete(firstKey);
            }
          }
          
          photoCache.set(vehicleId, photoData);
          
          setPhotoData(photoData);
          return photoData;
        } else {
          // Não há foto real, apenas dados vazios
          setPhotoData(null);
          return null;
        }
      } else {
        const errorMessage = response.message || 'Foto não encontrada para este veículo';
        setError(errorMessage);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar foto do veículo';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearPhoto = () => {
    setPhotoData(null);
    setError(null);
  };

  const clearCache = () => {
    photoCache.clear();
  };

  const removeFromCache = (vehicleId: string) => {
    photoCache.delete(vehicleId);
  };

  const invalidateCache = (vehicleId: string) => {
    // Remove do cache para forçar nova busca na API
    photoCache.delete(vehicleId);
  };

  const getCacheSize = () => {
    return photoCache.size;
  };

  return {
    loading,
    error,
    photoData,
    fetchVehiclePhoto,
    clearPhoto,
    clearCache,
    removeFromCache,
    invalidateCache,
    getCacheSize
  };
};
