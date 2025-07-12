import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface PreviewPDFProps {
  base64: string;
  visible: boolean;
  onClose: () => void;
  onDownload: () => void;  // Funções para controle externo
  onPrint: () => void;
}

const PreviewPDF: React.FC<PreviewPDFProps> = ({
  base64,
  visible,
  onClose,
  onDownload,
  onPrint,
}) => {
  const pdfHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>PDF Preview</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
      <style>
        html, body { margin: 0; padding: 0; height: 100%; overflow-y: auto; }
        canvas { display: block; margin: auto; }
      </style>
    </head>
    <body>
      <canvas id="pdf-canvas"></canvas>
      <script>
        const base64 = "${base64}";
        const pdfData = atob(base64.replace(/^data:application\\/pdf;base64,/, ""));
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });

        loadingTask.promise.then(pdf => {
          pdf.getPage(1).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight;

            const scaleX = containerWidth / viewport.width;
            const scaleY = containerHeight / viewport.height;

            const baseScale = Math.min(scaleX, scaleY);
            const zoomFactor = 0.6;
            const scale = baseScale * zoomFactor;

            const scaledViewport = page.getViewport({ scale });
            const canvas = document.getElementById('pdf-canvas');
            const context = canvas.getContext('2d');

            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;

            page.render({ canvasContext: context, viewport: scaledViewport });
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        {/* WebView só para mostrar o PDF */}
        <WebView
          originWhitelist={['*']}
          source={{ html: pdfHTML }}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          scrollEnabled={true}
        />

        {/* Botões fora do WebView, controle total no RN */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onDownload}>
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onPrint}>
            <Text style={styles.buttonText}>Imprimir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#eee',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PreviewPDF;
