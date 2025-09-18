import Colors from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TypographyThemes } from '../constants/Fonts';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from './FeedbackModal';
import GenericConfirmationModal from './GenericConfirmationModal';
import PermissionDeniedModal from './PermissionDeniedModal';
import Separator from './Separator';

interface ExpenseDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  expense: any;
  onEdit?: (expense: any) => void;
  onDelete?: (expense: any) => void;
}

export default function ExpenseDetailsModal({
  visible,
  onClose,
  expense,
  onEdit,
  onDelete,
}: ExpenseDetailsModalProps) {
  const { hasManagerPermission } = useAuth();
  
  // Estados para o FeedbackModal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // Estados para o GenericConfirmationModal
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [loadingToggleStatus, setLoadingToggleStatus] = useState(false);
  
  // Estados para o PermissionDeniedModal
  const [permissionDeniedVisible, setPermissionDeniedVisible] = useState(false);
  
  if (!expense) return null;

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
      // Chama o callback do componente pai para excluir a despesa
      if (onDelete) {
        await onDelete(expense);
      }
      
      // Fecha o modal após a operação bem-sucedida
      onClose();
    } catch (error) {
      setFeedbackMessage('Erro inesperado ao excluir despesa');
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

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Hora inválida';
    }
  };

  const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'R$ 0,00';
    }
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getMethodIcon = (method: string) => {
    switch(method?.toLowerCase()) {
      case 'dinheiro':
        return 'money';
      case 'pix':
        return 'qrcode';
      case 'debito':
      case 'credito':
        return 'credit-card';
      default:
        return 'credit-card';
    }
  };

  const getMethodColor = (method: string) => {
    switch(method?.toLowerCase()) {
      case 'dinheiro':
        return Colors.green[500];
      case 'pix':
        return Colors.blue[500];
      case 'debito':
        return Colors.orange[500];
      case 'credito':
        return Colors.purple[500];
      default:
        return Colors.gray[500];
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Imagem de fundo */}
        <Image
          source={require("../assets/images/splash-icon-blue.png")}
          style={styles.backgroundImage}
        />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detalhes da Despesa</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Card Principal - Valor e Descrição */}
          <View style={styles.mainCard}>
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Valor da Despesa</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(expense.amount || 0)}
              </Text>
            </View>
            
            <Separator marginTop={20} marginBottom={20} />
            
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Descrição</Text>
              <Text style={styles.descriptionValue}>
                {expense.description || 'Sem descrição'}
              </Text>
            </View>
          </View>

          {/* Card de Método de Pagamento */}
          <View style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <FontAwesome
                name={getMethodIcon(expense.method)}
                size={24}
                color={getMethodColor(expense.method)}
              />
              <Text style={styles.methodTitle}>Método de Pagamento</Text>
            </View>
            <Text style={[
              styles.methodValue,
              { color: getMethodColor(expense.method) }
            ]}>
              {(expense.method || 'N/A').toUpperCase()}
            </Text>
          </View>

          {/* Card de Data e Hora */}
          <View style={styles.timeCard}>
            <View style={styles.timeHeader}>
              <FontAwesome
                name="clock-o"
                size={20}
                color={Colors.blue[500]}
              />
              <Text style={styles.timeTitle}>Data e Hora</Text>
            </View>
            
            <Separator marginTop={16} marginBottom={16} />
            
            <View style={styles.timeInfo}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Data Completa:</Text>
                <Text style={styles.timeValue}>
                  {expense.transactionDate ? formatDate(expense.transactionDate) : 'N/A'}
                </Text>
              </View>
              
              <Separator marginTop={12} marginBottom={12} />
              
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Hora:</Text>
                <Text style={[styles.timeValue, styles.hourValue]}>
                  {expense.transactionDate ? formatTime(expense.transactionDate) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          {onEdit && (
            <Pressable
              style={[
                styles.actionButton, 
                styles.editButton,
                loadingToggleStatus && styles.actionButtonDisabled
              ]}
              onPress={() => onEdit(expense)}
              disabled={loadingToggleStatus}
            >
              <FontAwesome 
                name="edit" 
                size={18} 
                color={loadingToggleStatus ? Colors.gray[400] : Colors.white} 
              />
              <Text style={[
                styles.actionButtonText,
                loadingToggleStatus && styles.actionButtonTextDisabled
              ]}>
                Editar
              </Text>
            </Pressable>
          )}

          {/* Botão de Excluir - Apenas para MANAGER e ADMIN */}
          {hasManagerPermission() && onDelete && (
            <Pressable
              style={[
                styles.actionButton,
                styles.deleteButton,
                loadingToggleStatus && styles.actionButtonDisabled
              ]}
              onPress={handleToggleStatus}
              disabled={loadingToggleStatus}
            >
              <FontAwesome
                name={loadingToggleStatus ? 'spinner' : 'trash'}
                size={18}
                color={loadingToggleStatus ? Colors.gray[400] : Colors.white}
              />
              <Text style={[
                styles.actionButtonText,
                loadingToggleStatus && styles.actionButtonTextDisabled
              ]}>
                {loadingToggleStatus ? 'Processando...' : 'Excluir'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

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
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a despesa "${expense.description || 'Sem descrição'}"?`}
        details="Esta ação não pode ser desfeita. A despesa será permanentemente removida do sistema."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmToggleStatus}
        onCancel={handleCancelToggleStatus}
        confirmButtonStyle="danger"
      />

      {/* Permission Denied Modal */}
      <PermissionDeniedModal
        visible={permissionDeniedVisible}
        onClose={handleClosePermissionDenied}
        action="excluir despesas"
        requiredRole="MANAGER"
        currentRole={hasManagerPermission() ? 'MANAGER' : 'NORMAL'}
        message="Você precisa ter permissão de Gerente ou Administrador para excluir despesas."
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    right: -200,
    width: "150%",
    height: "100%",
    transform: [{ scaleX: -1 }],
    resizeMode: "cover",
    opacity: 0.08,
    zIndex: -1,
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
  // Card Principal
  mainCard: {
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  amountSection: {
    alignItems: 'center',
  },
  amountLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  amountValue: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.red[600],
  },
  descriptionSection: {
    alignItems: 'center',
  },
  descriptionLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  descriptionValue: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Card de Método
  methodCard: {
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  methodTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  methodValue: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Card de Tempo
  timeCard: {
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  timeTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  timeInfo: {
    gap: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 8,
  },
  timeLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  timeValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  hourValue: {
    fontSize: 16,
    color: Colors.blue[600],
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: Colors.whiteSemiTransparent2,
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
  actionButtonDisabled: {
    backgroundColor: Colors.gray[300],
    opacity: 0.6,
  },
  actionButtonTextDisabled: {
    color: Colors.gray[500],
  },
});
