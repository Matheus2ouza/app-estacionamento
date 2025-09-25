import Colors from '@/constants/Colors';
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
  const { loading: loadingTicket, error: ticketError, secondTicket, deleteVehicle: deleteVehicle, activateVehicle: activateVehicle, deleteVehiclePermanent: deleteVehiclePermanent  } = useEditVehicle();
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
  const [permanentDeleteConfirmationVisible, setPermanentDeleteConfirmationVisible] = useState(false);
  const [finalPermanentDeleteConfirmationVisible, setFinalPermanentDeleteConfirmationVisible] = useState(false);
  const [loadingToggleStatus, setLoadingToggleStatus] = useState(false);
  const [userWantsPermanentDelete, setUserWantsPermanentDelete] = useState<boolean | null>(null);
  
  
  if (!vehicle) return null;

  const handleToggleStatus = () => {
    // Se o veículo está inativo, apenas reativa (todos podem reativar)
    if (vehicle.status === 'DELETED') {
      handleDirectActivation();
      return;
    }
    
    // Se o veículo está ativo
    if (hasManagerPermission()) {
      // MANAGER/ADMIN: pergunta se quer exclusão permanente
      setConfirmationVisible(true);
    } else {
      // NORMAL: apenas desativa diretamente
      handleDirectDeactivation();
    }
  };

  // Função para lidar com a resposta sobre exclusão permanente
  const handlePermanentDeleteResponse = (wantsPermanent: boolean) => {
    setUserWantsPermanentDelete(wantsPermanent);
    setPermanentDeleteConfirmationVisible(false);
    
    if (wantsPermanent) {
      // Se quer exclusão permanente, procede diretamente
      handleDirectPermanentDelete();
    } else {
      // Se não quer exclusão permanente, apenas desativa
      handleDirectDeactivation();
    }
  };

  // Função específica para desativação direta (sem modal de confirmação)
  const handleDirectDeactivation = async () => {
    setLoadingToggleStatus(true);
    
    try {
      const result = await deleteVehicle(vehicle.id);
      
      if (result.success) {
        setFeedbackMessage(result.message || 'Veículo desativado com sucesso');
        setFeedbackType('success');
        setShowFeedback(true);
        // Chama o callback do componente pai para atualizar a lista
        onDelete(vehicle);
        // Fecha o modal após a operação bem-sucedida
        onClose();
      } else {
        setFeedbackMessage(result.message || 'Erro ao desativar veículo');
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Erro inesperado ao desativar veículo');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingToggleStatus(false);
    }
  };

  // Função específica para exclusão permanente direta
  const handleDirectPermanentDelete = async () => {
    setLoadingToggleStatus(true);
    
    try {
      const result = await deleteVehiclePermanent(vehicle.id);
      
      if (result.success) {
        setFeedbackMessage(result.message || 'Veículo excluído permanentemente');
        setFeedbackType('success');
        setShowFeedback(true);
        // Chama o callback do componente pai para atualizar a lista
        onDelete(vehicle);
        // Fecha o modal após a operação bem-sucedida
        onClose();
      } else {
        setFeedbackMessage(result.message || 'Erro ao excluir veículo permanentemente');
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Erro inesperado ao excluir veículo permanentemente');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingToggleStatus(false);
    }
  };

  // Função específica para reativação direta
  const handleDirectActivation = async () => {
    setLoadingToggleStatus(true);
    
    try {
      const result = await activateVehicle(vehicle.id);

      if (result.success) {
        setFeedbackMessage(result.message || 'Veículo reativado com sucesso');
        setFeedbackType('success');
        setShowFeedback(true);
        // Chama o callback do componente pai para atualizar a lista
        onDelete(vehicle);
        // Fecha o modal após a operação bem-sucedida
        onClose();
      } else {
        setFeedbackMessage(result.message || 'Erro ao reativar veículo');
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setFeedbackMessage('Erro inesperado ao reativar veículo');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingToggleStatus(false);
    }
  };

  const handleCancelPermanentDelete = () => {
    setPermanentDeleteConfirmationVisible(false);
    setUserWantsPermanentDelete(null);
  };

  const handleFinalPermanentDeleteConfirm = () => {
    setFinalPermanentDeleteConfirmationVisible(false);
    handleDirectPermanentDelete();
  };

  const handleFinalPermanentDeleteCancel = () => {
    setFinalPermanentDeleteConfirmationVisible(false);
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
                <Text style={vehicle.observation ? styles.infoValue : styles.infoNonexistent}>
                  {vehicle.observation || 'Dado Inexistente'}
                </Text>
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
        <View style={[
          styles.actionsContainer,
          hasManagerPermission() && vehicle.deletedAt && styles.actionsContainerGrid
        ]}>
          {/* Layout Grid 2x2 - Apenas para Manager/Admin com veículo desativado */}
          {hasManagerPermission() && vehicle.deletedAt ? (
            <>
              {/* Primeira linha de botões */}
              <View style={styles.actionRow}>
                <Pressable
                  style={[
                    styles.actionButton, 
                    styles.editButton,
                    (loadingToggleStatus || loadingTicket) && styles.actionButtonDisabled,
                    styles.actionButtonGrid
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

                <Pressable
                  style={[
                    styles.actionButton,
                    styles.activateButton,
                    (loadingToggleStatus || loadingTicket) && styles.actionButtonDisabled,
                    styles.actionButtonGrid
                  ]}
                  onPress={handleToggleStatus}
                  disabled={loadingToggleStatus || loadingTicket}
                >
                  <FontAwesome
                    name={loadingToggleStatus ? 'spinner' : 'check'}
                    size={18}
                    color={(loadingToggleStatus || loadingTicket) ? Colors.gray[400] : Colors.white}
                  />
                  <Text style={[
                    styles.actionButtonText,
                    (loadingToggleStatus || loadingTicket) && styles.actionButtonTextDisabled
                  ]}>
                    {loadingToggleStatus ? 'Processando...' : 'Ativar'}
                  </Text>
                </Pressable>
              </View>

              {/* Segunda linha de botões */}
              <View style={styles.actionRow}>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.permanentDeleteButton,
                    (loadingToggleStatus || loadingTicket) && styles.actionButtonDisabled,
                    styles.actionButtonGrid
                  ]}
                  onPress={() => {
                    setFinalPermanentDeleteConfirmationVisible(true);
                  }}
                  disabled={loadingToggleStatus || loadingTicket}
                >
                  <FontAwesome
                    name={loadingToggleStatus ? 'spinner' : 'trash-o'}
                    size={18}
                    color={(loadingToggleStatus || loadingTicket) ? Colors.gray[400] : Colors.white}
                  />
                  <Text style={[
                    styles.actionButtonText,
                    (loadingToggleStatus || loadingTicket) && styles.actionButtonTextDisabled
                  ]}>
                    {loadingToggleStatus ? 'Processando...' : 'Excluir'}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton, 
                    styles.secondTicketButton,
                    (loadingToggleStatus || loadingTicket) && styles.actionButtonDisabled,
                    styles.actionButtonGrid
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
            </>
          ) : (
            /* Layout Horizontal - Para usuário normal ou Manager/Admin com veículo ativo */
            <>
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
            </>
          )}
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

      {/* Confirmation Modal - Desativar */}
      <GenericConfirmationModal
        visible={confirmationVisible}
        title="Desativar Veículo?"
        message="Deseja desativar este veículo ou excluí-lo permanentemente?"
        details="Se escolher 'Desativar', o veículo será desativado e poderá ser reativado posteriormente. Se escolher 'Excluir Permanentemente', o veículo será removido definitivamente do sistema."
        confirmText="Desativar"
        cancelText="Excluir Permanentemente"
        onConfirm={() => handlePermanentDeleteResponse(false)}
        onCancel={() => handlePermanentDeleteResponse(true)}
        confirmButtonStyle="danger"
      />

      {/* Confirmation Modal - Exclusão Permanente */}
      <GenericConfirmationModal
        visible={permanentDeleteConfirmationVisible}
        title="Confirmar Exclusão Permanente"
        message="Tem certeza que deseja excluir permanentemente este veículo?"
        details="Esta ação não pode ser desfeita. O veículo será permanentemente removido do sistema e não poderá ser recuperado."
        confirmText="Excluir Permanentemente"
        cancelText="Cancelar"
        onConfirm={handleDirectPermanentDelete}
        onCancel={handleCancelPermanentDelete}
        confirmButtonStyle="danger"
      />

      {/* Confirmation Modal - Exclusão Permanente Final */}
      <GenericConfirmationModal
        visible={finalPermanentDeleteConfirmationVisible}
        title="⚠️ EXCLUSÃO PERMANENTE ⚠️"
        message="ATENÇÃO: Você está prestes a excluir permanentemente este veículo do sistema!"
        details="Esta ação é IRREVERSÍVEL e irá:\n\n• Remover completamente todos os dados do veículo\n• Excluir histórico de entrada e saída\n• Deletar fotos e documentos associados\n• Impossibilitar qualquer recuperação futura\n\nTem ABSOLUTA CERTEZA que deseja continuar?"
        confirmText="SIM, EXCLUIR PERMANENTEMENTE"
        cancelText="Cancelar"
        onConfirm={handleFinalPermanentDeleteConfirm}
        onCancel={handleFinalPermanentDeleteCancel}
        confirmButtonStyle="danger"
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
  infoNonexistent: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.gray[400],
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
  actionsContainerGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 5,
  },
  actionRowGrid: {
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
  permanentDeleteButton: {
    backgroundColor: Colors.red[700],
  },
  actionButtonGrid: {
    flex: 1,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.gray[300],
    opacity: 0.6,
  },
  actionButtonTextDisabled: {
    color: Colors.gray[500],
  },
});
