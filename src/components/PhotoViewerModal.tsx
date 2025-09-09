import Colors from '@/src/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { TypographyThemes } from '../constants/Fonts';

interface PhotoViewerModalProps {
  visible: boolean;
  onClose: () => void;
  photoData: {
    photo: string;
    photoType: string;
  } | null;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PhotoViewerModal({
  visible,
  onClose,
  photoData,
}: PhotoViewerModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (error: any) => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleClose = () => {
    setImageLoaded(false);
    setImageError(false);
    onClose();
  };

  if (!photoData) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Foto do Veículo</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        {/* Image Container */}
        <View style={styles.imageContainer}>
          {!imageLoaded && !imageError && (
            <View style={styles.loadingContainer}>
              <FontAwesome name="spinner" size={40} color={Colors.gray[400]} />
              <Text style={styles.loadingText}>Carregando imagem...</Text>
            </View>
          )}

          {imageError && (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-triangle" size={40} color={Colors.red[500]} />
              <Text style={styles.errorText}>Erro ao carregar imagem</Text>
              <Text style={styles.errorSubtext}>Verifique se a imagem está disponível</Text>
            </View>
          )}

          {photoData.photo && (
            <Image
              source={{ uri: photoData.photo }}
              style={styles.image}
              resizeMode="contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tipo: {photoData.photoType || 'image/jpeg'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[800],
  },
  headerTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  closeButton: {
    backgroundColor: Colors.red[500],
    width: 32,
    height: 32,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.7,
    maxWidth: screenWidth,
    maxHeight: screenHeight * 0.7,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.gray[400],
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.red[500],
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorSubtext: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.gray[400],
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.black,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[800],
  },
  footerText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.gray[400],
    textAlign: 'center',
  },
});
