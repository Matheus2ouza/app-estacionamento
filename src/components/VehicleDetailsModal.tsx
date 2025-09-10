import Colors from '@/src/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
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
import { useAuth } from '../context/AuthContext';
import useEditVehicle from '../hooks/vehicleFlow/useEditVehicle';
import { useVehiclePhoto } from '../hooks/vehicleFlow/useVehiclePhoto';
import FeedbackModal from './FeedbackModal';
import GenericConfirmationModal from './GenericConfirmationModal';
import PDFViewer from './PDFViewer';
import PermissionDeniedModal from './PermissionDeniedModal';
import PhotoViewerModal from './PhotoViewerModal';

interface VehicleDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  vehicle: any;
  onEdit: (vehicle: any) => void;
  onDelete: (vehicle: any) => void;
  onPrint: (vehicle: any) => void;
}

export default function VehicleDetailsModal({
  visible,
  onClose,
  vehicle,
  onEdit,
  onDelete,
  onPrint,
}: VehicleDetailsModalProps) {
  const { hasManagerPermission } = useAuth();
  const { loading: loadingImage, error: photoError, fetchVehiclePhoto } = useVehiclePhoto();
  const { loading: loadingTicket, error: ticketError, secondTicket, deleteVehicle: deleteVehicleVehicle, activateVehicle: activateVehicleVehicle } = useEditVehicle();
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [currentPhotoData, setCurrentPhotoData] = useState<{photo: string; photoType: string} | null>(null);
  const [secondTicketPdf, setSecondTicketPdf] = useState<string | null>(null);
  const [secondTicketVisible, setSecondTicketVisible] = useState(false);
  
  // Estados para o FeedbackModal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // Estados para o GenericConfirmationModal
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [loadingToggleStatus, setLoadingToggleStatus] = useState(false);
  
  // Estados para o PermissionDeniedModal
  const [permissionDeniedVisible, setPermissionDeniedVisible] = useState(false);
  
  if (!vehicle) return null;

  const handleToggleStatus = () => {
    // Verifica permissão antes de abrir o modal de confirmação
    if (!hasManagerPermission()) {
      setPermissionDeniedVisible(true);
      return;
    }
    setConfirmationVisible(true);
  };

  const handleConfirmToggleStatus = async () => {
    setLoadingToggleStatus(true);
    setConfirmationVisible(false);
    
    try {
      // Verifica se o veículo está ativo ou inativo para decidir qual função usar
      const isActive = !vehicle.deletedAt;
      const result = isActive 
        ? await deleteVehicleVehicle(vehicle.id)
        : await activateVehicleVehicle(vehicle.id);
      
      if (result.success) {
        setFeedbackMessage(result.message || 'Operação realizada com sucesso');
        setFeedbackType('success');
        setShowFeedback(true);
        // Chama o callback do componente pai para atualizar a lista
        onDelete(vehicle);
        // Fecha o modal após a operação bem-sucedida
        onClose();
      } else {
        setFeedbackMessage(result.message || 'Erro ao realizar operação');
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Erro inesperado ao realizar operação');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingToggleStatus(false);
    }
  };

  const handleCancelToggleStatus = () => {
    setConfirmationVisible(false);
  };

  const handleClosePermissionDenied = () => {
    setPermissionDeniedVisible(false);
  };

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

  const handleGenerateSecondTicket = async () => {
    
    try {
      const result = await secondTicket(vehicle.id);
      
      if (result.success && result.ticket) {
        setSecondTicketPdf(result.ticket);
        setSecondTicketVisible(true);
      } else {
        setFeedbackMessage(result.message || 'Erro ao gerar segundo ticket');
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Não foi possível gerar o segundo ticket');
      setFeedbackType('error');
      setShowFeedback(true);
    }
  };

  const handleCloseSecondTicket = () => {
    setSecondTicketVisible(false);
    setSecondTicketPdf(null);
  };

  const handlePdfSuccess = (message: string) => {
    setFeedbackMessage(message);
    setFeedbackType('success');
    setShowFeedback(true);
  };

  const handlePdfError = (error: string) => {
    setFeedbackMessage(error);
    setFeedbackType('error');
    setShowFeedback(true);
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
          <Text style={styles.headerTitle}>Detalhes do Veículo</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Informações Básicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Placa:</Text>
              <Text style={styles.infoValue}>{vehicle.plate}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: !vehicle.deletedAt ? Colors.green[100] : Colors.red[100] }
                ]}>
                  <FontAwesome
                    name={!vehicle.deletedAt ? 'check-circle' : 'times-circle'}
                    size={14}
                    color={!vehicle.deletedAt ? Colors.green[600] : Colors.red[600]}
                  />
                  <Text style={[
                    styles.statusText,
                    { color: !vehicle.deletedAt ? Colors.green[600] : Colors.red[600] }
                  ]}>
                    {!vehicle.deletedAt ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoria:</Text>
              <Text style={styles.infoValue}>
                {typeof vehicle.category === 'object' ? vehicle.category?.title || 'N/A' : vehicle.category}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Operador:</Text>
              <Text style={styles.infoValue}>{vehicle.operator}</Text>
            </View>

            {(vehicle.observation || vehicle.description) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Observação:</Text>
                <Text style={styles.infoValue}>{vehicle.observation || vehicle.description}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Imagem:</Text>
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

          {/* Informações de Entrada */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações de Entrada</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data/Hora de Entrada:</Text>
              <Text style={styles.infoValue}>
                {vehicle.formattedEntryTime || formatDate(vehicle.entryTime)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Método de Cobrança:</Text>
              <Text style={styles.infoValue}>
                {vehicle.billingMethod?.title || 'N/A'}
              </Text>
            </View>

            {vehicle.entryPhoto && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Foto de Entrada:</Text>
                <Text style={styles.infoValue}>Disponível</Text>
              </View>
            )}
          </View>

          {/* Informações de Saída (se houver) */}
          {vehicle.exitTime && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações de Saída</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data/Hora de Saída:</Text>
                <Text style={styles.infoValue}>
                  {vehicle.formattedExitTime || formatDate(vehicle.exitTime)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tempo Total:</Text>
                <Text style={styles.infoValue}>{vehicle.totalTime || 'N/A'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Valor Pago:</Text>
                <Text style={styles.infoValue}>
                  {vehicle.amountPaid ? `R$ ${vehicle.amountPaid.toFixed(2)}` : 'N/A'}
                </Text>
              </View>

              {vehicle.exitPhoto && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Foto de Saída:</Text>
                  <Text style={styles.infoValue}>Disponível</Text>
                </View>
              )}
            </View>
          )}

          {/* Informações do Sistema - Apenas para MANAGER e ADMIN */}
          {hasManagerPermission() && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações do Sistema</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ID:</Text>
                <Text style={styles.infoValue}>{vehicle.id}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Criado em:</Text>
                <Text style={styles.infoValue}>
                  {vehicle.createdAt ? formatDate(vehicle.createdAt) : 'N/A'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Atualizado em:</Text>
                <Text style={styles.infoValue}>
                  {vehicle.updatedAt ? formatDate(vehicle.updatedAt) : 'N/A'}
                </Text>
              </View>

              {vehicle.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.infoLabel}>Descrição:</Text>
                  <Text style={styles.descriptionValue}>{vehicle.description}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={[
              styles.actionButton, 
              styles.editButton,
              (loadingToggleStatus || loadingTicket) && styles.actionButtonDisabled
            ]}
            onPress={() => onEdit(vehicle)}
            disabled={loadingToggleStatus || loadingTicket}
          >
            <FontAwesome 
              name="edit" 
              size={18} 
              color={(loadingToggleStatus || loadingTicket) ? Colors.gray[400] : Colors.white} 
            />
            <Text style={[
              styles.actionButtonText,
              (loadingToggleStatus || loadingTicket) && styles.actionButtonTextDisabled
            ]}>
              Editar
            </Text>
          </Pressable>

          {/* Botão de Desativar/Ativar - Apenas para MANAGER e ADMIN */}
          {hasManagerPermission() && (
            <Pressable
              style={[
                styles.actionButton,
                !vehicle.deletedAt ? styles.deleteButton : styles.activateButton,
                (loadingToggleStatus || loadingTicket) && styles.actionButtonDisabled
              ]}
              onPress={handleToggleStatus}
              disabled={loadingToggleStatus || loadingTicket}
            >
              <FontAwesome
                name={loadingToggleStatus ? 'spinner' : (!vehicle.deletedAt ? 'trash' : 'check')}
                size={18}
                color={(loadingToggleStatus || loadingTicket) ? Colors.gray[400] : Colors.white}
              />
              <Text style={[
                styles.actionButtonText,
                (loadingToggleStatus || loadingTicket) && styles.actionButtonTextDisabled
              ]}>
                {loadingToggleStatus ? 'Processando...' : (!vehicle.deletedAt ? 'Desativar' : 'Ativar')}
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.actionButton, 
              styles.secondTicketButton,
              (loadingToggleStatus || loadingTicket) && styles.actionButtonDisabled
            ]}
            onPress={handleGenerateSecondTicket}
            disabled={loadingToggleStatus || loadingTicket}
          >
            <FontAwesome 
              name={loadingTicket ? "spinner" : "ticket"} 
              size={18} 
              color={(loadingToggleStatus || loadingTicket) ? Colors.gray[400] : Colors.white} 
            />
            <Text style={[
              styles.actionButtonText,
              (loadingToggleStatus || loadingTicket) && styles.actionButtonTextDisabled
            ]}>
              {loadingTicket ? 'Gerando...' : '2º Ticket'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        visible={photoViewerVisible}
        onClose={handleClosePhotoViewer}
        photoData={currentPhotoData}
      />

      {/* Second Ticket Modal */}
      <PDFViewer
        base64={secondTicketPdf || ""}
        visible={secondTicketVisible}
        onClose={handleCloseSecondTicket}
        filename={`ticket-${vehicle.plate || 'veiculo'}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`}
        onSuccess={handlePdfSuccess}
        onError={handlePdfError}
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

      {/* Confirmation Modal */}
      <GenericConfirmationModal
        visible={confirmationVisible}
        title="Confirmar Operação"
        message={`Tem certeza que deseja ${!vehicle.deletedAt ? 'desativar' : 'ativar'} o veículo ${vehicle.plate}?`}
        details={!vehicle.deletedAt 
          ? 'Uma vez o veículo for desativado, ele não aparecerá na lista de veículos ativos e não poderá ser editado. Para poder ativá-lo novamente, será necessário um usuário com nível de permissão mínimo de Gerente.'
          : 'Ao ativar o veículo, ele voltará a aparecer na lista de veículos ativos e poderá ser editado normalmente.'
        }
        confirmText={!vehicle.deletedAt ? 'Desativar' : 'Ativar'}
        cancelText="Cancelar"
        onConfirm={handleConfirmToggleStatus}
        onCancel={handleCancelToggleStatus}
        confirmButtonStyle={!vehicle.deletedAt ? 'danger' : 'success'}
      />

      {/* Permission Denied Modal */}
      <PermissionDeniedModal
        visible={permissionDeniedVisible}
        onClose={handleClosePermissionDenied}
        action="desativar ou ativar veículos"
        requiredRole="MANAGER"
        currentRole={hasManagerPermission() ? 'MANAGER' : 'NORMAL'}
        message="Você precisa ter permissão de Gerente ou Administrador para desativar ou ativar veículos."
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
    paddingHorizontal: 8,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    paddingLeft: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
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
  descriptionContainer: {
    paddingVertical: 8,
    paddingLeft: 10,
  },
  descriptionValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 20,
  },
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
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    gap: 5,
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
  editButton: {
    backgroundColor: Colors.blue.primary,
  },
  deleteButton: {
    backgroundColor: Colors.red[500],
  },
  activateButton: {
    backgroundColor: Colors.green[500],
  },
  secondTicketButton: {
    backgroundColor: Colors.orange[500],
  },
  actionButtonDisabled: {
    backgroundColor: Colors.gray[300],
    opacity: 0.6,
  },
  actionButtonTextDisabled: {
    color: Colors.gray[500],
  },
});
