import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import Colors from '@/src/constants/Colors';
import { Feather } from '@expo/vector-icons';

interface PhotoViewerProps {
  visible: boolean;
  onClose: () => void;
  photoBase64?: string | null;
  photoType?: string | null;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ 
  visible, 
  onClose, 
  photoBase64, 
  photoType 
}) => {
  const [loading, setLoading] = useState(true);

  if (!photoBase64 || !photoType) {
    return null;
  }

  const imageUri = `data:${photoType};base64,${photoBase64}`;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={30} color={Colors.white} />
        </TouchableOpacity>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.blue.logo} />
          </View>
        )}
        
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  image: {
    width: '100%',
    height: '80%',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoViewer;