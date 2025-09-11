import { Entypo, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import CameraComponent from './CameraComponent';
import PhotoViewerModal from './PhotoViewerModal';

interface QRCodeReceiptProps {
  onPhotoCaptured?: (photoUri: string) => void;
  onPhotoRemoved?: () => void;
  onPhotoConfirmed?: (photoUri: string) => void;
  initialPhotoUri?: string;
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function QRCodeReceipt({
  onPhotoCaptured,
  onPhotoRemoved,
  onPhotoConfirmed,
  initialPhotoUri,
  disabled = false,
}: QRCodeReceiptProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(initialPhotoUri || null);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);

  const handleTakePhoto = () => {
    if (disabled) return;
    setShowCamera(true);
  };

  const handlePhotoCaptured = (photoUri: string) => {
    setCapturedPhoto(photoUri);
    setShowCamera(false);
    onPhotoCaptured?.(photoUri);
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      'Remover Comprovante',
      'Deseja remover a foto do comprovante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setCapturedPhoto(null);
            onPhotoRemoved?.();
          },
        },
      ]
    );
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoConfirmed?.(capturedPhoto);
    }
  };

  const handleViewPhoto = () => {
    if (capturedPhoto) {
      setShowPhotoViewer(true);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleClosePhotoViewer = () => {
    setShowPhotoViewer(false);
  };

  return (
    <View style={styles.container}>
      {/* QR Code Section */}
      <View style={styles.qrCodeSection}>
        <Text style={styles.sectionTitle}>QR Code para Pagamento</Text>
        <View style={styles.qrCodeContainer}>
          <Image
            source={require('../assets/images/qrCode.jpeg')}
            style={styles.qrCodeImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.qrCodeDescription}>
          Escaneie o QR Code para realizar o pagamento
        </Text>
      </View>

      {/* Photo Section */}
      <View style={styles.photoSection}>
        <Text style={styles.sectionTitle}>Comprovante de Pagamento</Text>
        
        <TouchableOpacity
          style={[styles.captureButton, disabled && styles.captureButtonDisabled]}
          onPress={handleTakePhoto}
          disabled={disabled}
        >
          <Ionicons 
            name="camera" 
            size={24} 
            color={disabled ? Colors.gray[400] : Colors.white} 
          />
          <Text style={[styles.captureButtonText, disabled && styles.captureButtonTextDisabled]}>
            Tirar Foto do Comprovante
          </Text>
        </TouchableOpacity>

        {/* Photo Preview with Scroll */}
        {capturedPhoto && (
          <ScrollView 
            style={styles.photoScrollView}
            contentContainerStyle={styles.photoScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.photoPreviewContainer}>
              <TouchableOpacity
                style={styles.photoPreview}
                onPress={handleViewPhoto}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: capturedPhoto }}
                  style={styles.photoPreviewImage}
                  blurRadius={3}
                />
                <View style={styles.photoPreviewOverlay}>
                  <Ionicons name="eye" size={32} color={Colors.white} />
                  <Text style={styles.photoPreviewText}>
                    Clique para visualizar comprovante
                  </Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.photoActionButtons}>
                <TouchableOpacity
                  style={styles.confirmPhotoButton}
                  onPress={handleConfirmPhoto}
                >
                  <Entypo name="check" size={26} color={Colors.green[500]} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={handleRemovePhoto}
                >
                  <Ionicons name="trash" size={20} color={Colors.red[500]} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          mode="default"
          onPhotoCaptured={handlePhotoCaptured}
          onManualAction={handleCloseCamera}
          manualButtonText="Fechar Câmera"
        />
      </Modal>

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        visible={showPhotoViewer}
        photoData={capturedPhoto ? {
          photo: capturedPhoto,
          photoType: 'receipt'
        } : null}
        onClose={handleClosePhotoViewer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  qrCodeSection: {
    alignItems: 'center',
    marginBottom: 20,
    height: 340,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[800],
    marginBottom: 16,
    textAlign: 'center',
  },
  qrCodeContainer: {
    backgroundColor: Colors.backgroundQrCode,
    padding: 8,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  qrCodeImage: {
    width: '100%',
    height: '100%',
  },
  qrCodeDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  photoSection: {
    flex: 1,
    minHeight: 180,
  },
  photoScrollView: {
    maxHeight: 300,
  },
  photoScrollContent: {
    flexGrow: 1,
  },
  captureButton: {
    backgroundColor: Colors.blue.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  captureButtonDisabled: {
    backgroundColor: Colors.gray[300],
  },
  captureButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  captureButtonTextDisabled: {
    color: Colors.gray[500],
  },
  photoPreviewContainer: {
    position: 'relative',
  },
  photoPreview: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.gray[100],
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPreviewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreviewText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  photoActionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  confirmPhotoButton: {
    backgroundColor: Colors.green[100],
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  removePhotoButton: {
    backgroundColor: Colors.red[100],
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
