import Colors from '@/constants/Colors';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TypographyThemes } from '../constants/Fonts';
import { useVehiclePhoto } from '../hooks/vehicleFlow/useVehiclePhoto';
import FeedbackModal from './FeedbackModal';
import PhotoViewerModal from './PhotoViewerModal';

interface VehicleExitDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  vehicle: any;
  calculatedAmount?: number;
}

export default function VehicleExitDetailsModal({
  visible,
  onClose,
  vehicle,
  calculatedAmount,
}: VehicleExitDetailsModalProps) {
  const { loading: loadingImage, error: photoError, fetchVehiclePhoto } = useVehiclePhoto();
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [currentPhotoData, setCurrentPhotoData] = useState<{photo: string; photoType: string} | null>(null);
  
  // Estados para o FeedbackModal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  if (!vehicle) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'carro':
        return 'car';
      case 'moto':
      case 'motocicleta':
        return 'motorcycle';
      default:
        return 'car';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'carro':
        return Colors.blue.primary;
      case 'moto':
      case 'motocicleta':
        return Colors.orange[500];
      default:
        return Colors.gray[500];
    }
  };

  const handleViewImage = async () => {
    if (loadingImage) return;
    
    try {
      const photoData = await fetchVehiclePhoto(vehicle.id);

      if (photoData) {
        setCurrentPhotoData(photoData);
        setPhotoViewerVisible(true);
      } else if (photoError) {
        setFeedbackMessage(photoError);
        setFeedbackType('warning');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Não foi possível carregar a imagem');
      setFeedbackType('error');
      setShowFeedback(true);
    }
  };

  const handleClosePhotoViewer = () => {
    setPhotoViewerVisible(false);
    setCurrentPhotoData(null);
  };

  // Função para obter o valor (já filtrado pela API)
  const getBillingValue = () => {
    if (vehicle.billingMethod?.value) {
      return parseFloat(vehicle.billingMethod.value);
    }
    return 0;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detalhes da Saída</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Card de boas-vindas com placa */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeHeader}>
              <View style={[
                styles.welcomeIcon,
                { backgroundColor: getCategoryColor(vehicle.category || 'carro') }
              ]}>
                <FontAwesome 
                  name={getCategoryIcon(vehicle.category || 'carro')} 
                  size={32} 
                  color={Colors.white} 
                />
              </View>
              <View style={styles.welcomeInfo}>
                <Text style={styles.welcomeTitle}>
                  {vehicle.plate || 'N/A'}
                </Text>
                <View style={styles.welcomeTimeContainer}>
                  <MaterialIcons name="schedule" size={16} color={Colors.gray[600]} />
                  <Text style={styles.welcomeTimeLabel}>Permanência:</Text>
                  <Text style={styles.welcomeTimeValue}>{vehicle.permanenceTime || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Informações Básicas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={20} color={Colors.blue[600]} />
              <Text style={styles.sectionTitle}>Informações Básicas</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Placa:</Text>
              <Text style={styles.infoValue}>{vehicle.plate || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoria:</Text>
              <View style={styles.categoryContainer}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(vehicle.category || 'carro') }]}>
                  <FontAwesome
                    name={getCategoryIcon(vehicle.category || 'carro')}
                    size={12}
                    color={Colors.white}
                  />
                  <Text style={styles.categoryText}>{vehicle.category || 'Carro'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data de Entrada:</Text>
              <Text style={styles.infoValue}>{vehicle.entryTime ? formatDate(vehicle.entryTime) : 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hora de Entrada:</Text>
              <Text style={styles.infoValue}>{vehicle.entryTime ? formatTime(vehicle.entryTime) : 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Permanência:</Text>
              <Text style={styles.infoValue}>{vehicle.permanenceTime || 'N/A'}</Text>
            </View>

            {vehicle.observation && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Observação:</Text>
                <Text style={styles.infoValue}>{vehicle.observation}</Text>
              </View>
            )}

            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <Text style={styles.infoLabel}>Foto:</Text>
              {vehicle.photoType ? (
                <Pressable 
                  style={[styles.viewImageButton, loadingImage && styles.viewImageButtonDisabled]}
                  onPress={handleViewImage}
                  disabled={loadingImage}
                >
                  <FontAwesome 
                    name={loadingImage ? "spinner" : "image"} 
                    size={14} 
                    color={loadingImage ? Colors.gray[500] : Colors.blue.primary} 
                  />
                  <Text style={[styles.viewImageButtonText, loadingImage && styles.viewImageButtonTextDisabled]}>
                    {loadingImage ? 'Carregando...' : 'Visualizar Imagem'}
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.noImageContainer}>
                  <FontAwesome 
                    name="image" 
                    size={14} 
                    color={Colors.gray[400]} 
                  />
                  <Text style={styles.noImageText}>
                    Nenhuma foto disponível
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Informações de Cobrança */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="payment" size={20} color={Colors.blue[600]} />
              <Text style={styles.sectionTitle}>Informações de Cobrança</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Método de Cobrança:</Text>
              <Text style={styles.infoValue}>{vehicle.billingMethod?.title || 'N/A'}</Text>
            </View>

            {/* Informações detalhadas do método de cobrança */}
            <View style={styles.billingInfo}>
              <Text style={styles.billingTitle}>Detalhes da Cobrança:</Text>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Valor:</Text>
                <Text style={styles.billingValue}>R$ {getBillingValue().toFixed(2)}</Text>
              </View>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Tempo:</Text>
                <Text style={styles.billingValue}>{vehicle.billingMethod?.timeMinutes || 0} min</Text>
              </View>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Tolerância:</Text>
                <Text style={styles.billingValue}>{vehicle.billingMethod?.tolerance || 0} min</Text>
              </View>
            </View>
          </View>

          {/* Cálculo do Valor Final */}
          {calculatedAmount !== undefined && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="calculate" size={20} color={Colors.blue[600]} />
                <Text style={styles.sectionTitle}>Cálculo do Valor Final</Text>
              </View>
              
              <View style={styles.calculationCard}>
                {/* Informações Base */}
                <View style={styles.calculationSection}>
                  <Text style={styles.calculationSectionTitle}>Informações Base</Text>
                  
                  <View style={styles.calculationRow}>
                    <View style={styles.calculationLabelContainer}>
                      <MaterialIcons name="receipt" size={18} color={Colors.gray[500]} />
                      <Text style={styles.calculationLabel}>Valor por Período</Text>
                    </View>
                    <Text style={styles.calculationValue}>R$ {getBillingValue().toFixed(2)}</Text>
                  </View>

                  <View style={styles.calculationRow}>
                    <View style={styles.calculationLabelContainer}>
                      <MaterialIcons name="schedule" size={18} color={Colors.gray[500]} />
                      <Text style={styles.calculationLabel}>Permanência</Text>
                    </View>
                    <Text style={styles.calculationValue}>{vehicle.permanenceTime || 'N/A'}</Text>
                  </View>

                  <View style={styles.calculationRow}>
                    <View style={styles.calculationLabelContainer}>
                      <MaterialIcons name="timer" size={18} color={Colors.gray[500]} />
                      <Text style={styles.calculationLabel}>Período de Cobrança</Text>
                    </View>
                    <Text style={styles.calculationValue}>{vehicle.billingMethod?.timeMinutes || 0} min</Text>
                  </View>
                </View>

                {/* Resultado Final */}
                <View style={styles.calculationSection}>
                  <Text style={styles.calculationSectionTitle}>Resultado</Text>
                  
                  <View style={[styles.calculationRow, styles.finalCalculationRow]}>
                    <View style={styles.calculationLabelContainer}>
                      <MaterialIcons name="check-circle" size={20} color={Colors.green[600]} />
                      <Text style={styles.finalCalculationLabel}>Valor Total a Pagar</Text>
                    </View>
                    <Text style={[styles.calculationValue, styles.finalCalculationValue]}>
                      R$ {calculatedAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        visible={photoViewerVisible}
        onClose={handleClosePhotoViewer}
        photoData={currentPhotoData}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedback}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setShowFeedback(false)}
        dismissible={true}
        autoNavigateOnSuccess={false}
        navigateDelay={2000}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  headerTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 18,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Card de boas-vindas
  welcomeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.blue[500],
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeInfo: {
    flex: 1,
  },
  welcomeTitle: {
    ...TypographyThemes.poppins.title,
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  welcomeTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  welcomeTimeLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  welcomeTimeValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.blue[600],
    fontWeight: '700',
  },
  scanIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.green[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.green[200],
  },
  scanText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.green[700],
  },

  // Seções
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },

  // Linhas de informação
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    marginRight: 12,
  },
  infoValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },

  // Categoria
  categoryContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    ...TypographyThemes.nunito.body,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Informações de cobrança
  billingInfo: {
    backgroundColor: Colors.blue[50],
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.blue[200],
  },
  billingTitle: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blue[700],
    marginBottom: 8,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  billingLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 13,
    color: Colors.blue[600],
  },
  billingValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 13,
    color: Colors.blue[800],
    fontWeight: '600',
  },

  // Cálculo do valor final
  calculationCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    gap: 16,
  },
  calculationSection: {
    gap: 8,
  },
  calculationSectionTitle: {
    ...TypographyThemes.nunito.body,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[300],
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  finalCalculationRow: {
    backgroundColor: Colors.green[50],
    borderColor: Colors.green[200],
    borderWidth: 2,
    marginTop: 4,
  },
  calculationLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  calculationLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  finalCalculationLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 16,
    color: Colors.green[700],
    fontWeight: '700',
  },
  calculationValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  finalCalculationValue: {
    fontSize: 20,
    color: Colors.green[700],
    fontWeight: '800',
  },

  // Botão de visualizar imagem
  viewImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.blue[50],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.blue[200],
    gap: 6,
  },
  viewImageButtonText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.blue.primary,
    fontWeight: '600',
  },
  viewImageButtonDisabled: {
    backgroundColor: Colors.gray[100],
    borderColor: Colors.gray[300],
  },
  viewImageButtonTextDisabled: {
    color: Colors.gray[500],
  },
  noImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.gray[50],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    gap: 6,
  },
  noImageText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.gray[500],
    fontWeight: '500',
  },
});
