import Colors from '@/src/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { getMaxPdfBytesToRender } from '../config/pdf';
import { TypographyThemes } from '../constants/Fonts';
import { usePdfActions } from '../hooks/vehicleFlow/usePdfActions';
import FeedbackModal from './FeedbackModal';

interface PDFViewerProps {
  base64: string;
  visible: boolean;
  onClose: () => void;
  filename?: string;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
  maxBytesToRender?: number; // limite para renderizar; acima disso só permite download
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  base64,
  visible,
  onClose,
  filename = 'documento.pdf',
  onSuccess,
  onError,
  maxBytesToRender = getMaxPdfBytesToRender(), // configurável via env
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  const { downloadPdf, printPdf } = usePdfActions();

  // Estimar bytes a partir do base64 (ignora cabeçalhos e padding)
  const estimateBytesFromBase64 = (b64: string): number => {
    if (!b64) return 0;
    const clean = b64.replace(/^data:application\/pdf;base64,/, '');
    const len = clean.length;
    const padding = (clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0);
    return Math.floor((len * 3) / 4) - padding;
  };
  const estimatedBytes = estimateBytesFromBase64(base64);
  const isTooHeavy = estimatedBytes > maxBytesToRender;

  // Reset quando o modal abre
  React.useEffect(() => {
    if (visible) {
      setError(null);
      setCurrentPage(1);
      setLoadingDownload(false);
      setLoadingPrint(false);
    }
  }, [visible]);

  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      await downloadPdf(base64, filename);
      setFeedbackType('success');
      setFeedbackMessage('PDF baixado com sucesso!');
      setFeedbackVisible(true);
      onSuccess?.('PDF baixado com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao baixar o PDF";
      setFeedbackType('error');
      setFeedbackMessage(`Erro ao baixar PDF: ${errorMessage}`);
      setFeedbackVisible(true);
      onError?.(`Erro ao baixar PDF: ${errorMessage}`);
    } finally {
      setLoadingDownload(false);
    }
  };

  const handlePrint = async () => {
    setLoadingPrint(true);
    try {
      await printPdf(base64);
      setFeedbackType('success');
      setFeedbackMessage('Comando de impressão enviado com sucesso!');
      setFeedbackVisible(true);
      onSuccess?.('Comando de impressão enviado com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao imprimir o PDF";
      setFeedbackType('error');
      setFeedbackMessage(`Erro ao imprimir PDF: ${errorMessage}`);
      setFeedbackVisible(true);
      onError?.(`Erro ao imprimir PDF: ${errorMessage}`);
    } finally {
      setLoadingPrint(false);
    }
  };

  const handleLoadComplete = (numberOfPages: number) => {
    setTotalPages(numberOfPages);
    setError(null);
  };

  const handlePageChanged = (page: number, numberOfPages: number) => {
    setCurrentPage(page);
    setTotalPages(numberOfPages);
  };

  const handleError = (error: any) => {
    console.error('Erro ao carregar PDF:', error);
    setError('Erro ao carregar o PDF');
    setFeedbackType('error');
    setFeedbackMessage('Erro ao carregar o PDF');
    setFeedbackVisible(true);
  };

  const handleLoadProgress = (percent: number) => {
    // O loading será removido no handleLoadComplete
    console.log('PDF loading progress:', percent + '%');
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
        {/* Header com informações da página */}
        <View style={styles.header}>
          {isTooHeavy ? (
            <Text style={styles.headerText}>PDF pesado • somente download</Text>
          ) : (
            <Text style={styles.headerText}>
              Página {currentPage} de {totalPages}
            </Text>
          )}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        {/* Controles de navegação */}
        {!isTooHeavy && totalPages > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]} 
              onPress={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <Text style={[styles.navButtonText, currentPage === 1 && styles.navButtonTextDisabled]}>
                ← Anterior
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetToFirstPage}>
              <Text style={styles.resetButtonText}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navButton, currentPage === totalPages && styles.navButtonDisabled]} 
              onPress={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <Text style={[styles.navButtonText, currentPage === totalPages && styles.navButtonTextDisabled]}>
                Próxima →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Área do PDF */}
        <View style={styles.pdfContainer}>
          {isTooHeavy ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                O PDF é muito pesado para exibir aqui. Toque em Download para visualizar no seu dispositivo.
              </Text>
              <Text style={[styles.errorText, { fontSize: 12, color: Colors.text.secondary }]}>
                Tamanho estimado: {(estimatedBytes / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Pdf
              source={{ uri: `data:application/pdf;base64,${base64}` }}
              page={currentPage}
              onLoadComplete={handleLoadComplete}
              onPageChanged={handlePageChanged}
              onError={handleError}
              onLoadProgress={handleLoadProgress}
              style={styles.pdf}
              enablePaging={false}
              enableRTL={false}
              enableAntialiasing={true}
              enableAnnotationRendering={true}
              password=""
              spacing={0}
              minScale={1.0}
              maxScale={3.0}
              scale={1.0}
              horizontal={false}
              fitPolicy={0}
            />
          )}
        </View>

        {/* Botões de ação */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.downloadButton]} 
            onPress={handleDownload}
            disabled={loadingDownload}
          >
            <FontAwesome 
              name={loadingDownload ? "spinner" : "download"} 
              size={18} 
              color={Colors.white} 
            />
            <Text style={styles.actionButtonText}>
              {loadingDownload ? 'Baixando...' : 'Download'}
            </Text>
          </TouchableOpacity>

          {!isTooHeavy && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.printButton]} 
              onPress={handlePrint}
              disabled={loadingPrint}
            >
              <FontAwesome 
                name={loadingPrint ? "spinner" : "print"} 
                size={18} 
                color={Colors.white} 
              />
              <Text style={styles.actionButtonText}>
                {loadingPrint ? 'Imprimindo...' : 'Imprimir'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        </View>
      </Modal>
      {/* Feedback */}
      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setFeedbackVisible(false)}
        dismissible={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeButton: {
    backgroundColor: Colors.red[500],
    width: 32,
    height: 32,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  navButton: {
    backgroundColor: Colors.blue.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  navButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  navButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: Colors.gray[600],
  },
  resetButton: {
    backgroundColor: Colors.green[500],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  resetButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  pdfContainer: {
    flex: 1,
    position: 'relative',
  },
  pdf: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteSemiTransparent,
    zIndex: 1,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.red[500],
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.blue.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  downloadButton: {
    backgroundColor: Colors.green[500],
  },
  printButton: {
    backgroundColor: Colors.blue.primary,
  },
});

export default PDFViewer;
