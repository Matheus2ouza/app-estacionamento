import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export function usePdfActions() {
  // Função para salvar/baixar arquivo pdf base64 com nome customizado
  async function downloadPdf(base64: string, filename: string) {
    try {
      const fileUri = FileSystem.cacheDirectory + filename;
      const base64Data = base64.replace(/^data:application\/pdf;base64,/, '');

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Salvar ou compartilhar PDF',
        UTI: 'com.adobe.pdf',
      });

      return fileUri;
    } catch (error) {
      console.error('Erro no download do PDF:', error);
      throw error;
    }
  }

  // Função para imprimir - no Android/iOS geralmente abre o diálogo do sistema
  // Aqui você pode customizar como quer imprimir - por ex, usando react-native-print ou enviar para WebView etc.
  async function printPdf(base64: string) {
    try {
      if (Platform.OS === 'web') {
        // Web: pode abrir nova janela com PDF para imprimir
        const link = document.createElement('a');
        link.href = base64;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      } else {
        // Mobile: aqui você pode usar libs como react-native-print
        // Exemplo básico (se usar react-native-print):
        // await Print.printAsync({ base64, format: 'PDF' });
        // Ou implementar lógica própria com WebView
        console.warn('Impressão nativa ainda não implementada');
      }
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
