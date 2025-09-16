import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { PermissionsAndroid, Platform } from 'react-native';
import BlobUtil from 'react-native-blob-util';

export function usePdfActions() {
  // Função para verificar e solicitar permissões de armazenamento
  async function requestStoragePermissions() {
    if (Platform.OS === 'android') {
      try {
        // Verificar versão do Android
        const androidVersion = Platform.Version;
        
        // Permissões básicas sempre necessárias
        const basicPermissions = [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ];
        
        // Para Android 11+ (API 30+), adicionar MANAGE_EXTERNAL_STORAGE
        if (androidVersion >= 30) {
          basicPermissions.push('android.permission.MANAGE_EXTERNAL_STORAGE' as any);
        }
        
        // Solicitar permissões
        const granted = await PermissionsAndroid.requestMultiple(basicPermissions);
        
        // Verificar permissões básicas
        const readGranted = granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
        const writeGranted = granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
        
        // Verificar MANAGE_EXTERNAL_STORAGE se aplicável
        let manageGranted = true; // Default para Android < 11
        if (androidVersion >= 30) {
          const managePermissionKey = 'android.permission.MANAGE_EXTERNAL_STORAGE' as keyof typeof granted;
          manageGranted = granted[managePermissionKey] === PermissionsAndroid.RESULTS.GRANTED;
        }
        
        // Retornar erro se permissões básicas não foram concedidas
        if (!readGranted || !writeGranted) {
          throw new Error('Permissões básicas de armazenamento são obrigatórias');
        }
        
        // Para Android 11+, MANAGE_EXTERNAL_STORAGE é recomendada mas não obrigatória
        if (androidVersion >= 30 && !manageGranted) {
          return { success: true, hasManagePermission: false };
        }
        
        return { success: true, hasManagePermission: manageGranted };
        
      } catch (error) {
        console.error('❌ [usePdfActions] requestStoragePermissions: Erro ao solicitar permissões:', error);
        throw error;
      }
    }
    
    // Para iOS, não precisa de permissões especiais
    return { success: true, hasManagePermission: true };
  }

  // Função para limpar cache antigo e liberar memória
  async function cleanupOldFiles() {
    try {
      if (!FileSystem.cacheDirectory) return;
      
      const cacheInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory);
      if (cacheInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas
        
        for (const file of files) {
          if (file.startsWith('ticket-') && file.endsWith('.pdf')) {
            const filePath = FileSystem.cacheDirectory + file;
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            
            if (fileInfo.exists && fileInfo.modificationTime) {
              const fileAge = now - (fileInfo.modificationTime * 1000);
              if (fileAge > maxAge) {
                await FileSystem.deleteAsync(filePath);
              }
            }
          }
        }
      }
    } catch (error) {
      // Erro silencioso na limpeza do cache
    }
  }
  // Função para salvar/baixar arquivo PDF na pasta pública de Downloads
  async function downloadPdf(base64: string, filename: string) {
    try {
      // PASSO 1: Verificar permissões
      const permissionResult = await requestStoragePermissions();
      if (!permissionResult.success) {
        throw new Error('Permissões de armazenamento negadas. Não é possível salvar o arquivo.');
      }

      // PASSO 2: Limpar arquivos antigos
      await cleanupOldFiles();
      
      // PASSO 3: Preparar base64
      let base64Data = base64;
      if (base64.startsWith('data:application/pdf;base64,')) {
        base64Data = base64.replace(/^data:application\/pdf;base64,/, '');
      } else if (base64.startsWith('data:')) {
        base64Data = base64.split(',')[1];
      }

      // PASSO 4: Salvar no subdiretório do app
      // Usar o diretório de Downloads do app (subdiretório)
      const downloadsPath = BlobUtil.fs.dirs.DownloadDir;
      const filePath = `${downloadsPath}/${filename}`;

      // Verificar se a pasta Downloads existe
      const dirExists = await BlobUtil.fs.exists(downloadsPath);
      
      if (!dirExists) {
        throw new Error('Pasta de Downloads não encontrada. Verifique as permissões.');
      }

      // Salvar o arquivo diretamente no subdiretório
      await BlobUtil.fs.writeFile(filePath, base64Data, 'base64');
      
      const finalFilePath = filePath;

      // PASSO 5: Verificar se o arquivo foi criado
      const fileExists = await BlobUtil.fs.exists(finalFilePath);
      
      if (!fileExists) {
        throw new Error('Falha ao criar o arquivo PDF. Verifique as permissões.');
      }

      return finalFilePath;
    } catch (error) {
      console.error('❌ [usePdfActions] downloadPdf: Erro durante download:', error);
      throw error;
    }
  }


  // Função para imprimir usando expo-print
  async function printPdf(base64: string) {
    try {
      // Preparar o base64 para impressão
      let base64Data = base64;
      if (base64.startsWith('data:application/pdf;base64,')) {
        base64Data = base64.replace(/^data:application\/pdf;base64,/, '');
      } else if (base64.startsWith('data:')) {
        base64Data = base64.split(',')[1];
      }

      // Imprimir o PDF
      await Print.printAsync({
        uri: `data:application/pdf;base64,${base64Data}`,
        orientation: Print.Orientation.portrait,
      });
    } catch (error) {
      throw error;
    }
  }

  // Função para compartilhar PDF (fallback para sharing)
  async function sharePdf(base64: string, filename: string) {
    try {
      // Limpar arquivos antigos antes de criar novos
      await cleanupOldFiles();
      
      // Verificar se o cacheDirectory está disponível
      if (!FileSystem.cacheDirectory) {
        throw new Error('Cache directory não disponível');
      }

      const fileUri = FileSystem.cacheDirectory + filename;
      
      // Limpar o base64 removendo prefixos desnecessários
      let base64Data = base64;
      if (base64.startsWith('data:application/pdf;base64,')) {
        base64Data = base64.replace(/^data:application\/pdf;base64,/, '');
      } else if (base64.startsWith('data:')) {
        base64Data = base64.split(',')[1];
      }

      // Escrever o arquivo no cache
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Verificar se o arquivo foi criado
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('Falha ao criar o arquivo PDF');
      }

      // Verificar se o sharing está disponível
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Compartilhamento não disponível neste dispositivo');
      }

      // Compartilhar o arquivo
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar PDF',
        UTI: 'com.adobe.pdf',
      });

      return fileUri;
    } catch (error) {
      console.error('❌ [usePdfActions] sharePdf: Erro durante compartilhamento:', error);
      throw error;
    }
  }

  return {
    downloadPdf,
    sharePdf,
    printPdf,
    cleanupOldFiles,
  };
}
