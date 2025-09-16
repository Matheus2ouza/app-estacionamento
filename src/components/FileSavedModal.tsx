import Colors from '@/src/constants/Colors';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TypographyThemes } from '../constants/Fonts';

interface FileSavedModalProps {
  visible: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
}

const FileSavedModal: React.FC<FileSavedModalProps> = ({
  visible,
  onClose,
  filePath,
  fileName,
}) => {
  // Extrair apenas o nome do arquivo do caminho completo
  const getDisplayPath = (path: string) => {
    // Se for um caminho do Android, mostrar apenas a parte relevante
    if (path.includes('/Android/data/')) {
      const parts = path.split('/');
      const appIndex = parts.findIndex(part => part === 'com.anonymous.leaoestacionamento');
      if (appIndex !== -1) {
        return parts.slice(appIndex).join('/');
      }
    }
    return path;
  };

  const displayPath = getDisplayPath(filePath);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome name="check-circle" size={24} color={Colors.green[500]} />
            </View>
            <Text style={styles.title}>Arquivo Salvo!</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <AntDesign name="close" size={20} color={Colors.gray[600]} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.message}>
              O arquivo foi salvo com sucesso no seu dispositivo.
            </Text>
            
            <View style={styles.fileInfo}>
              <Text style={styles.fileNameLabel}>Arquivo:</Text>
              <Text style={styles.fileName}>{fileName}</Text>
            </View>

            <View style={styles.pathInfo}>
              <Text style={styles.pathLabel}>Local:</Text>
              <View style={styles.pathContainer}>
                <Text style={styles.pathText}>{displayPath}</Text>
              </View>
            </View>

            <View style={styles.noteContainer}>
              <AntDesign name="infocirlceo" size={16} color={Colors.blue[500]} />
              <Text style={styles.noteText}>
                Você pode acessar este arquivo através do gerenciador de arquivos do seu dispositivo.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.okButton} onPress={onClose}>
              <Text style={styles.okButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    ...TypographyThemes.nunito.title,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  message: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  fileInfo: {
    marginBottom: 12,
  },
  fileNameLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  fileName: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pathInfo: {
    marginBottom: 16,
  },
  pathLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  pathContainer: {
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pathText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: 'monospace',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.blue[50],
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: Colors.blue[500],
  },
  noteText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.blue[700],
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  okButton: {
    backgroundColor: Colors.green[500],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  okButtonText: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default FileSavedModal;
