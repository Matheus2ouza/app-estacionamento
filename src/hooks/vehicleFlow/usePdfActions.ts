import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export function usePdfActions() {
  // Função para salvar/baixar arquivo pdf base64 com nome customizado
  async function downloadPdf(base64: string, filename: string) {
    try {
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

      console.log('Salvando PDF:', filename);
      console.log('URI do arquivo:', fileUri);

      // Escrever o arquivo
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Verificar se o arquivo foi criado
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('Falha ao criar o arquivo PDF');
      }

      console.log('Arquivo criado com sucesso:', fileInfo);

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

      console.log('PDF compartilhado com sucesso');
      return fileUri;
    } catch (error) {
      console.error('Erro no download do PDF:', error);
      throw error;
    }
  }

  // Função para imprimir usando expo-print
  async function printPdf(base64: string) {
    try {
      console.log('Iniciando impressão do PDF...');

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

      console.log('PDF enviado para impressão com sucesso');
    } catch (error) {
      console.error('Erro na impressão do PDF:', error);
      throw error;
    }
  }

  return {
    downloadPdf,
    printPdf,
  };
}
