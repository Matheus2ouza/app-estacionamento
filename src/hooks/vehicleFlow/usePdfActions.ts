import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export function usePdfActions() {
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
  // Função para salvar/baixar arquivo pdf base64 com nome customizado
  async function downloadPdf(base64: string, filename: string) {
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

      // Verificar tamanho do base64 para evitar problemas de memória
      const base64Size = base64Data.length;
      const estimatedSizeMB = (base64Size * 3) / 4 / 1024 / 1024; // Aproximação do tamanho em MB

      // Se o arquivo for muito grande (>50MB), usar processamento em chunks
      if (estimatedSizeMB > 50) {
        await writeLargeBase64File(fileUri, base64Data);
      } else {
        // Escrever o arquivo normalmente para arquivos menores
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

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
        dialogTitle: 'Salvar ou compartilhar PDF',
        UTI: 'com.adobe.pdf',
      });

      return fileUri;
    } catch (error) {
      throw error;
    }
  }

  // Função auxiliar para escrever arquivos grandes em chunks
  async function writeLargeBase64File(fileUri: string, base64Data: string) {
    const chunkSize = 1024 * 1024; // 1MB por chunk
    const chunks = [];
    
    // Dividir o base64 em chunks menores
    for (let i = 0; i < base64Data.length; i += chunkSize) {
      chunks.push(base64Data.slice(i, i + chunkSize));
    }

    // Escrever o primeiro chunk
    await FileSystem.writeAsStringAsync(fileUri, chunks[0], {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Adicionar os chunks restantes
    for (let i = 1; i < chunks.length; i++) {
      const currentContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.writeAsStringAsync(fileUri, currentContent + chunks[i], {
        encoding: FileSystem.EncodingType.Base64,
      });
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

  return {
    downloadPdf,
    printPdf,
    cleanupOldFiles,
  };
}
