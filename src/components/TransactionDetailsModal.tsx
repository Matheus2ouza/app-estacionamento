import Colors from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import usePhotoCache from '../hooks/history/usePhotoCache';
import useRegisterProductSale from '../hooks/products/useRegisterProductSale';
import { useExitVehicle } from '../hooks/vehicleFlow/useExitVehicle';
import FeedbackModal from './FeedbackModal';
import GenericConfirmationModal from './GenericConfirmationModal';
import PDFViewer from './PDFViewer';
import PermissionDeniedModal from './PermissionDeniedModal';
import PhotoViewerModal from './PhotoViewerModal';
import Separator from './Separator';

interface TransactionDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: {
    type: 'vehicle' | 'product' | 'expense';
    data: any;
  } | null;
  onDelete?: (transaction: any) => void;
  showDeleteButton?: boolean;
}

export default function TransactionDetailsModal({
  visible,
  onClose,
  transaction,
  onDelete,
  showDeleteButton = true,
}: TransactionDetailsModalProps) {
  // Todos os hooks devem ser chamados sempre, na mesma ordem
  const { hasManagerPermission } = useAuth();
  const { getPhoto, loading: photoLoading, error: photoError } = usePhotoCache();
  
  // Estados para o FeedbackModal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // Estados para o GenericConfirmationModal
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [vehicleReturnConfirmationVisible, setVehicleReturnConfirmationVisible] = useState(false);
  const [permanentDeleteConfirmationVisible, setPermanentDeleteConfirmationVisible] = useState(false);
  const [loadingToggleStatus, setLoadingToggleStatus] = useState(false);
  const [userWantsVehicleReturn, setUserWantsVehicleReturn] = useState<boolean | null>(null);
  
  // Estados para o PermissionDeniedModal
  const [permissionDeniedVisible, setPermissionDeniedVisible] = useState(false);
  
  // Estados para o PhotoViewerModal
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [loadedPhotoUrl, setLoadedPhotoUrl] = useState<string | null>(null);
  const [generatingDuplicate, setGeneratingDuplicate] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);

  const { duplicateReceipt } = useExitVehicle();
  const { duplicateReceipt: duplicateProductReceipt } = useRegisterProductSale();

  const getDuplicateFilename = () => {
    const rawDate = transaction?.data?.transactionDate || new Date().toISOString();
    const datePart = rawDate.replace(/[:]/g, '-');
    if (transaction?.type === 'vehicle') {
      const vehicleData = Array.isArray(transaction.data.vehicleEntries)
        ? transaction.data.vehicleEntries[0]
        : transaction.data.vehicleEntries;
      const plate = (vehicleData?.plate || 'VEICULO').replace(/[^A-Za-z0-9-]/g, '');
      return `segunda-via-veiculo-${plate}-${datePart}.pdf`;
    }
    if (transaction?.type === 'product') {
      const firstItem = Array.isArray(transaction.data.saleItems) && transaction.data.saleItems.length > 0
        ? transaction.data.saleItems[0]
        : null;
      const rawName = (firstItem?.productName || 'PRODUTO').toString();
      const cleanName = rawName
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^A-Za-z0-9- ]/g, '') // remove chars especiais
        .trim()
        .replace(/\s+/g, '-');
      const shortName = cleanName.length > 24 ? cleanName.slice(0, 24) : cleanName;
      return `segunda-via-produto-${shortName || 'PRODUTO'}-${datePart}.pdf`;
    }
    return `segunda-via-${transaction?.type || 'transacao'}-${datePart}.pdf`;
  };

  const handleGenerateSecondCopy = async () => {
    const resolvedId = transaction?.data?.id;
    if (!resolvedId) {
      setFeedbackMessage('Transação sem ID válido.');
      setFeedbackType('error');
      setShowFeedback(true);
      return;
    }

    try {
      setGeneratingDuplicate(true);
      let result;
      if (transaction?.type === 'vehicle') {
        result = await duplicateReceipt(resolvedId);
        console.log('esse é o resultado do result')
        console.log(result.data)
      } else if (transaction?.type === 'product') {
        result = await duplicateProductReceipt(resolvedId);
      } else {
        setFeedbackMessage('Tipo de transação não suportado.');
        setFeedbackType('warning');
        setShowFeedback(true);
        return;
      }
      if (result.success && result.data) {
        setPdfData(result.data);
        setPdfVisible(true);
      } else {
        setFeedbackMessage(result.message || 'Não foi possível gerar a 2ª via.');
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (e) {
      setFeedbackMessage('Erro ao gerar a 2ª via do comprovante.');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setGeneratingDuplicate(false);
    }
  };

  const handleToggleStatus = () => {
    if (!transaction) return;
    
    // Verifica permissão antes de abrir o modal de confirmação
    if (!hasManagerPermission()) {
      setPermissionDeniedVisible(true);
      return;
    }
    
    // Lógica específica por tipo de transação
    if (transaction.type === 'vehicle') {
      // Para veículos, primeiro pergunta se quer retornar ao pátio
      setVehicleReturnConfirmationVisible(true);
    } else if (transaction.type === 'product' || transaction.type === 'expense') {
      // Para produtos e despesas, avisa que será exclusão permanente
      setConfirmationVisible(true);
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (!transaction) return;
    
    setLoadingToggleStatus(true);
    setConfirmationVisible(false);
    
    try {
      // Chama o callback do componente pai para excluir a transação
      if (onDelete) {
        // Para veículos que retornam ao pátio, marcar permanent=false
        const transactionData = transaction.type === 'vehicle' && userWantsVehicleReturn === true 
          ? {
              ...transaction,
              data: {
                ...transaction.data,
                permanent: false
              }
            }
          : transaction;
        
        await onDelete(transactionData);
      }
      
      // Fecha o modal após a operação bem-sucedida
      onClose();
    } catch (error) {
      setFeedbackMessage('Erro inesperado ao excluir transação');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingToggleStatus(false);
    }
  };

  const handleCancelToggleStatus = () => {
    setConfirmationVisible(false);
  };

  // Função para lidar com a resposta sobre retorno do veículo ao pátio
  const handleVehicleReturnResponse = (wantsReturn: boolean) => {
    setUserWantsVehicleReturn(wantsReturn);
    setVehicleReturnConfirmationVisible(false);
    
    if (wantsReturn) {
      // Se quer retornar ao pátio, procede diretamente com a exclusão
      handleDirectVehicleReturn();
    } else {
      // Se não quer retornar, avisa sobre exclusão permanente
      setPermanentDeleteConfirmationVisible(true);
    }
  };

  // Função específica para retorno direto ao pátio (sem modal de confirmação)
  const handleDirectVehicleReturn = async () => {
    if (!transaction) return;
    
    setLoadingToggleStatus(true);
    
    try {
      // Chama o callback do componente pai para excluir a transação
      if (onDelete) {
        // Para veículos que retornam ao pátio, marcar permanent=false
        const transactionData = {
          ...transaction,
          data: {
            ...transaction.data,
            permanent: false
          }
        };
        
        await onDelete(transactionData);
      }
      
      // Fecha o modal após a operação bem-sucedida
      onClose();
    } catch (error) {
      setFeedbackMessage('Erro inesperado ao excluir transação');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingToggleStatus(false);
    }
  };

  const handleCancelVehicleReturn = () => {
    setVehicleReturnConfirmationVisible(false);
    setUserWantsVehicleReturn(null);
  };

  const handleConfirmPermanentDelete = async () => {
    if (!transaction) return;
    
    setLoadingToggleStatus(true);
    setPermanentDeleteConfirmationVisible(false);
    
    try {
      // Chama o callback do componente pai para excluir a transação
      if (onDelete) {
        // Para veículos com exclusão permanente, marcar permanent=true
        const transactionWithPermanent = {
          ...transaction,
          data: {
            ...transaction.data,
            permanent: true
          }
        };
        await onDelete(transactionWithPermanent);
      }
      
      // Fecha o modal após a operação bem-sucedida
      onClose();
    } catch (error) {
      setFeedbackMessage('Erro inesperado ao excluir transação');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingToggleStatus(false);
    }
  };

  const handleCancelPermanentDelete = () => {
    setPermanentDeleteConfirmationVisible(false);
    setUserWantsVehicleReturn(null);
  };

  const handleClosePermissionDenied = () => {
    setPermissionDeniedVisible(false);
  };

  // Função para verificar se deve mostrar a imagem
  const shouldShowImage = () => {
    return transaction?.data?.photoType && transaction.data.photoType.trim() !== '';
  };

  // Função para carregar a foto
  const loadPhoto = async () => {
    if (!transaction?.data?.id || !shouldShowImage() || transaction.type === 'expense') {
      console.log('[TransactionDetailsModal] Não carregando foto - condições não atendidas');
      return;
    }
    
    console.log(`[TransactionDetailsModal] Carregando foto - ID: ${transaction.data.id}, Type: ${transaction.type}`);
    
    try {
      const photoUrl = await getPhoto(transaction.data.id, transaction.type as 'vehicle' | 'product');
      console.log(`[TransactionDetailsModal] Foto carregada:`, photoUrl ? 'Sucesso' : 'Falha');
      if (photoUrl) {
        setLoadedPhotoUrl(photoUrl);
      }
    } catch (error) {
      console.error('[TransactionDetailsModal] Erro ao carregar foto:', error);
    }
  };

  // Função para abrir o visualizador de foto
  const handleViewImage = () => {
    if (loadedPhotoUrl) {
      setPhotoViewerVisible(true);
    } else {
      loadPhoto();
    }
  };

  // Carregar foto automaticamente quando o modal abrir
  useEffect(() => {
    if (visible && transaction && shouldShowImage()) {
      loadPhoto();
    }
  }, [visible, transaction?.data?.id, transaction?.type]);

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

  const formatCurrency = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) {
      return 'R$ 0,00';
    }
    
    // Converter string para number se necessário
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numericValue)) {
      return 'R$ 0,00';
    }
    
    return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
  };

  const getMethodIcon = (method: string) => {
    switch(method?.toLowerCase()) {
      case 'dinheiro':
      case 'cash':
        return 'money';
      case 'pix':
        return 'qrcode';
      case 'debito':
      case 'debit':
      case 'credito':
      case 'credit':
        return 'credit-card';
      default:
        return 'credit-card';
    }
  };

  const getMethodColor = (method: string) => {
    switch(method?.toLowerCase()) {
      case 'dinheiro':
      case 'cash':
        return Colors.green[500];
      case 'pix':
        return Colors.blue[500];
      case 'debito':
      case 'debit':
        return Colors.orange[500];
      case 'credito':
      case 'credit':
        return Colors.purple[500];
      default:
        return Colors.gray[500];
    }
  };

  const translateVehicleStatus = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'INSIDE':
        return 'DENTRO';
      case 'EXITED':
        return 'SAIU';
      case 'DELETED':
        return 'EXCLUÍDO';
      default:
        return status || 'N/A';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'INSIDE':
        return Colors.blue[500];
      case 'EXITED':
        return Colors.green[500];
      case 'DELETED':
        return Colors.red[500];
      default:
        return Colors.gray[500];
    }
  };

  const getTransactionTypeInfo = () => {
    if (!transaction) {
      return {
        title: 'Detalhes da Transação',
        icon: 'document',
        color: Colors.gray[500],
        amountColor: Colors.gray[600]
      };
    }
    
    switch (transaction.type) {
      case 'vehicle':
        return {
          title: 'Detalhes do Veículo',
          icon: 'car',
          color: Colors.blue[500],
          amountColor: Colors.blue[600]
        };
      case 'product':
        return {
          title: 'Detalhes do Produto',
          icon: 'shopping-cart',
          color: Colors.green[500],
          amountColor: Colors.green[600]
        };
      case 'expense':
        return {
          title: 'Detalhes da Despesa',
          icon: 'receipt',
          color: Colors.red[500],
          amountColor: Colors.red[600]
        };
      default:
        return {
          title: 'Detalhes da Transação',
          icon: 'document',
          color: Colors.gray[500],
          amountColor: Colors.gray[600]
        };
    }
  };

  const renderVehicleDetails = () => {
    if (!transaction) return null;
    const data = transaction.data;
    let vehicle;
    if (Array.isArray(data.vehicleEntries)) {
      vehicle = data.vehicleEntries[0];
    } else {
      vehicle = data.vehicleEntries;
    }

    return (
      <>
        {/* Card Principal - Valor e Placa */}
        <View style={styles.mainCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Valor Recebido</Text>
            <Text style={[styles.amountValue, { color: getTransactionTypeInfo().amountColor }]}>
              {formatCurrency(data.finalAmount || 0)}
            </Text>
          </View>
          
          <Separator marginTop={20} marginBottom={20} />
          
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Placa do Veículo</Text>
            <Text style={styles.descriptionValue}>
              {vehicle?.plate || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Card de Detalhes do Veículo */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <FontAwesome
              name="car"
              size={20}
              color={Colors.blue[500]}
            />
            <Text style={styles.detailsTitle}>Informações do Veículo</Text>
          </View>
          
          <Separator marginTop={16} marginBottom={16} />
          
          <View style={styles.detailsInfo}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categoria:</Text>
              <Text style={styles.detailValue}>{vehicle?.category || 'N/A'}</Text>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(vehicle?.status) }
              ]}>
                <Text style={styles.statusText}>
                  {translateVehicleStatus(vehicle?.status)}
                </Text>
              </View>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hora de Entrada:</Text>
              <Text style={styles.detailValue}>
                {vehicle?.entryTime ? formatTime(vehicle.entryTime) : 'N/A'}
              </Text>
            </View>
            
            {vehicle?.exitTime && (
              <>
                <Separator marginTop={12} marginBottom={12} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hora de Saída:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(vehicle.exitTime)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Card de Valores */}
        <View style={styles.valuesCard}>
          <View style={styles.valuesHeader}>
            <FontAwesome
              name="calculator"
              size={20}
              color={Colors.orange[500]}
            />
            <Text style={styles.valuesTitle}>Detalhes Financeiros</Text>
          </View>
          
          <Separator marginTop={16} marginBottom={16} />
          
          <View style={styles.valuesInfo}>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Valor Original:</Text>
              <Text style={styles.valueValue}>{formatCurrency(data.originalAmount || 0)}</Text>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Desconto:</Text>
              <Text style={styles.valueValue}>{formatCurrency(data.discountAmount || 0)}</Text>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Valor Recebido:</Text>
              <Text style={styles.valueValue}>{formatCurrency(data.amountReceived || 0)}</Text>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Troco:</Text>
              <Text style={styles.valueValue}>{formatCurrency(data.changeGiven || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Card de Imagem - Veículo */}
        {shouldShowImage() && (
          <View style={styles.imageCard}>
            <View style={styles.imageHeader}>
              <FontAwesome
                name="camera"
                size={20}
                color={Colors.purple[500]}
              />
              <Text style={styles.imageTitle}>Foto do Veículo</Text>
            </View>
            
            <Separator marginTop={16} marginBottom={16} />
            
            <Pressable style={styles.imageContainer} onPress={handleViewImage}>
              {photoLoading ? (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="large" color={Colors.blue.primary} />
                  <Text style={styles.imageLoadingText}>Carregando...</Text>
                </View>
              ) : loadedPhotoUrl ? (
                <>
                  <Image
                    source={{ uri: loadedPhotoUrl }}
                    style={styles.transactionImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <FontAwesome
                      name="search-plus"
                      size={24}
                      color={Colors.white}
                    />
                    <Text style={styles.imageOverlayText}>Toque para ampliar</Text>
                  </View>
                </>
              ) : (
                <View style={styles.imageErrorContainer}>
                  <FontAwesome
                    name="exclamation-triangle"
                    size={32}
                    color={Colors.red[500]}
                  />
                  <Text style={styles.imageErrorText}>
                    {photoError || 'Erro ao carregar foto'}
                  </Text>
                  <Pressable style={styles.retryButton} onPress={loadPhoto}>
                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          </View>
        )}
      </>
    );
  };

  const renderProductDetails = () => {
    if (!transaction) return null;
    const data = transaction.data;

    return (
      <>
        {/* Card Principal - Valor e Produto */}
        <View style={styles.mainCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Valor Total</Text>
            <Text style={[styles.amountValue, { color: getTransactionTypeInfo().amountColor }]}>
              {formatCurrency(data.finalAmount || 0)}
            </Text>
          </View>
          
          <Separator marginTop={20} marginBottom={20} />
          
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Produtos Vendidos</Text>
            <Text style={styles.descriptionValue}>
              {data.saleItems?.length || 0} item(s)
            </Text>
          </View>
        </View>

        {/* Card de Produtos */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <FontAwesome
              name="shopping-cart"
              size={20}
              color={Colors.green[500]}
            />
            <Text style={styles.detailsTitle}>Itens Vendidos</Text>
          </View>
          
          <Separator marginTop={16} marginBottom={16} />
          
          <View style={styles.detailsInfo}>
            {data.saleItems?.map((item: any, index: number) => (
              <View key={index}>
                <View style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.productName || 'Produto'}</Text>
                    <Text style={styles.productDetails}>
                      {item.soldQuantity || 0} x {formatCurrency(item.unitPrice || 0)}
                    </Text>
                  </View>
                  <Text style={styles.productTotal}>
                    {formatCurrency((item.soldQuantity || 0) * (item.unitPrice || 0))}
                  </Text>
                </View>
                {index < data.saleItems.length - 1 && (
                  <Separator marginTop={12} marginBottom={12} />
                )}
              </View>
            )) || (
              <Text style={styles.noItemsText}>Nenhum item encontrado</Text>
            )}
          </View>
        </View>

        {/* Card de Valores */}
        <View style={styles.valuesCard}>
          <View style={styles.valuesHeader}>
            <FontAwesome
              name="calculator"
              size={20}
              color={Colors.orange[500]}
            />
            <Text style={styles.valuesTitle}>Detalhes Financeiros</Text>
          </View>
          
          <Separator marginTop={16} marginBottom={16} />
          
          <View style={styles.valuesInfo}>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Valor Original:</Text>
              <Text style={styles.valueValue}>{formatCurrency(data.originalAmount || 0)}</Text>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Desconto:</Text>
              <Text style={styles.valueValue}>{formatCurrency(data.discountAmount || 0)}</Text>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Valor Recebido:</Text>
              <Text style={styles.valueValue}>{formatCurrency(data.amountReceived || 0)}</Text>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Troco:</Text>
              <Text style={styles.valueValue}>{formatCurrency(data.changeGiven || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Card de Imagem - Produto */}
        {shouldShowImage() && (
          <View style={styles.imageCard}>
            <View style={styles.imageHeader}>
              <FontAwesome
                name="camera"
                size={20}
                color={Colors.purple[500]}
              />
              <Text style={styles.imageTitle}>Foto da Venda</Text>
            </View>
            
            <Separator marginTop={16} marginBottom={16} />
            
            <Pressable style={styles.imageContainer} onPress={handleViewImage}>
              {photoLoading ? (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="large" color={Colors.blue.primary} />
                  <Text style={styles.imageLoadingText}>Carregando foto...</Text>
                </View>
              ) : loadedPhotoUrl ? (
                <>
                  <Image
                    source={{ uri: loadedPhotoUrl }}
                    style={styles.transactionImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <FontAwesome
                      name="search-plus"
                      size={24}
                      color={Colors.white}
                    />
                    <Text style={styles.imageOverlayText}>Toque para ampliar</Text>
                  </View>
                </>
              ) : (
                <View style={styles.imageErrorContainer}>
                  <FontAwesome
                    name="exclamation-triangle"
                    size={32}
                    color={Colors.red[500]}
                  />
                  <Text style={styles.imageErrorText}>
                    {photoError || 'Erro ao carregar foto'}
                  </Text>
                  <Pressable style={styles.retryButton} onPress={loadPhoto}>
                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          </View>
        )}
      </>
    );
  };

  const renderExpenseDetails = () => {
    if (!transaction) return null;
    const data = transaction.data;

    return (
      <>
        {/* Card Principal - Valor e Descrição */}
        <View style={styles.mainCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Valor da Despesa</Text>
            <Text style={[styles.amountValue, { color: getTransactionTypeInfo().amountColor }]}>
              {formatCurrency(data.amount || 0)}
            </Text>
          </View>
          
          <Separator marginTop={20} marginBottom={20} />
          
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Descrição</Text>
            <Text style={styles.descriptionValue}>
              {data.description || 'Sem descrição'}
            </Text>
          </View>
        </View>

        {/* Card de Data e Hora */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <FontAwesome
              name="clock-o"
              size={20}
              color={Colors.blue[500]}
            />
            <Text style={styles.detailsTitle}>Data e Hora</Text>
          </View>
          
          <Separator marginTop={16} marginBottom={16} />
          
          <View style={styles.detailsInfo}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data Completa:</Text>
              <Text style={styles.detailValue}>
                {data.transactionDate ? formatDate(data.transactionDate) : 'N/A'}
              </Text>
            </View>
            
            <Separator marginTop={12} marginBottom={12} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hora:</Text>
              <Text style={[styles.detailValue, styles.hourValue]}>
                {data.transactionDate ? formatTime(data.transactionDate) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const typeInfo = getTransactionTypeInfo();

  // Return early se não há transação - deve vir depois de todos os hooks
  if (!transaction) return null;

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
          <Text style={styles.headerTitle}>{typeInfo.title}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Método de Pagamento */}
          <View style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <FontAwesome
                name={getMethodIcon(transaction.data.method)}
                size={24}
                color={getMethodColor(transaction.data.method)}
              />
              <Text style={styles.methodTitle}>Método de Pagamento</Text>
            </View>
            <Text style={[
              styles.methodValue,
              { color: getMethodColor(transaction.data.method) }
            ]}>
              {(transaction.data.method || 'N/A').toUpperCase()}
            </Text>
          </View>

          {/* Detalhes específicos por tipo */}
          {transaction.type === 'vehicle' && renderVehicleDetails()}
          {transaction.type === 'product' && renderProductDetails()}
          {transaction.type === 'expense' && renderExpenseDetails()}

          {/* Card de Operador */}
          <View style={styles.operatorCard}>
            <View style={styles.operatorHeader}>
              <FontAwesome
                name="user"
                size={20}
                color={Colors.purple[500]}
              />
              <Text style={styles.operatorTitle}>Operador</Text>
            </View>
            <Text style={styles.operatorValue}>
              {transaction.data.operator || 'N/A'}
            </Text>
          </View>
        </ScrollView>

        {/* Botão Gerar 2ª Via (Veículo/Produto) */}
        {(transaction.type === 'vehicle' || transaction.type === 'product') && (
          <View style={styles.actionsContainer}>
            <Pressable
              style={[styles.copyButton, generatingDuplicate && styles.actionButtonDisabled]}
              onPress={handleGenerateSecondCopy}
              disabled={generatingDuplicate}
            >
              <FontAwesome name={generatingDuplicate ? 'spinner' : 'file-pdf-o'} size={18} color={Colors.white} />
              <Text style={[styles.copyButtonText, generatingDuplicate && styles.actionButtonTextDisabled]}>
                {generatingDuplicate ? 'Gerando...' : 'Gerar 2ª via'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Botão de Excluir */}
        {showDeleteButton && (
          <View style={styles.actionsContainer}>
            {hasManagerPermission() && onDelete && (
              <Pressable
                style={[
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
                  styles.deleteButtonText,
                  loadingToggleStatus && styles.actionButtonTextDisabled
                ]}>
                  {loadingToggleStatus ? 'Processando...' : 'Excluir'}
                </Text>
              </Pressable>
            )}
          </View>
        )}
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

      {/* PDF Viewer Modal */}
      {pdfData && (
        <PDFViewer
          base64={pdfData}
          visible={pdfVisible}
          onClose={() => {
            setPdfVisible(false);
            setPdfData(null);
          }}
          filename={getDuplicateFilename()}
        />
      )}

      {/* Confirmation Modal - Produtos e Despesas */}
      <GenericConfirmationModal
        visible={confirmationVisible}
        title="Confirmar Exclusão Permanente"
        message={`Tem certeza que deseja excluir esta ${transaction.type === 'product' ? 'venda de produto' : 'despesa'}?`}
        details="Esta ação não pode ser desfeita. A transação será permanentemente removida do sistema e não poderá ser recuperada."
        confirmText="Excluir Permanentemente"
        cancelText="Cancelar"
        onConfirm={handleConfirmToggleStatus}
        onCancel={handleCancelToggleStatus}
        confirmButtonStyle="danger"
      />

      {/* Confirmation Modal - Veículo: Retorno ao Pátio */}
      <GenericConfirmationModal
        visible={vehicleReturnConfirmationVisible}
        title="Retornar Veículo ao Pátio?"
        message="Deseja que este veículo retorne ao pátio para registrar novamente a saída?"
        details="Se escolher 'Sim', o veículo voltará ao pátio e poderá ter uma nova saída registrada. Se escolher 'Não', a transação será excluída permanentemente."
        confirmText="Sim, Retornar ao Pátio"
        cancelText="Não, Excluir Permanentemente"
        onConfirm={() => handleVehicleReturnResponse(true)}
        onCancel={() => handleVehicleReturnResponse(false)}
        confirmButtonStyle="success"
      />

      {/* Confirmation Modal - Veículo: Exclusão Permanente */}
      <GenericConfirmationModal
        visible={permanentDeleteConfirmationVisible}
        title="Confirmar Exclusão Permanente"
        message="Tem certeza que deseja excluir permanentemente esta transação de veículo?"
        details="Esta ação não pode ser desfeita. A transação será permanentemente removida do sistema e não poderá ser recuperada. O veículo não retornará ao pátio."
        confirmText="Excluir Permanentemente"
        cancelText="Cancelar"
        onConfirm={handleConfirmPermanentDelete}
        onCancel={handleCancelPermanentDelete}
        confirmButtonStyle="danger"
      />

      {/* Permission Denied Modal */}
      <PermissionDeniedModal
        visible={permissionDeniedVisible}
        onClose={handleClosePermissionDenied}
        action="excluir transações"
        requiredRole="MANAGER"
        currentRole={hasManagerPermission() ? 'MANAGER' : 'NORMAL'}
        message="Você precisa ter permissão de Gerente ou Administrador para excluir transações."
      />

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        visible={photoViewerVisible}
        photoData={{
          photo: loadedPhotoUrl || '',
          photoType: transaction.data.photoType
        }}
        onClose={() => setPhotoViewerVisible(false)}
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
  // Card de Detalhes
  detailsCard: {
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
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  detailsTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  detailsInfo: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 8,
  },
  detailLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
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
  // Card de Valores
  valuesCard: {
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
  valuesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  valuesTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  valuesInfo: {
    gap: 12,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 8,
  },
  valueLabel: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  valueValue: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  // Card de Produtos
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.whiteSemiTransparent2,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  productDetails: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  productTotal: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.green[600],
    fontWeight: '700',
  },
  noItemsText: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Card de Operador
  operatorCard: {
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
  operatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  operatorTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  operatorValue: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.purple[600],
    textAlign: 'center',
  },
  // Botões
  actionsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: Colors.whiteSemiTransparent2,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.yellow[500],
    gap: 8,
    marginBottom: 8,
  },
  copyButtonText: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.red[500],
    gap: 8,
  },
  deleteButtonText: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.gray[300],
    opacity: 0.6,
  },
  actionButtonTextDisabled: {
    color: Colors.gray[500],
  },
  // Status Badge
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  // Card de Imagem
  imageCard: {
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
  imageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  imageTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.gray[100],
  },
  transactionImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imageOverlayText: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  // Loading e Error States
  imageLoadingContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray[100],
    gap: 12,
  },
  imageLoadingText: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  imageErrorContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray[100],
    gap: 12,
    paddingHorizontal: 20,
  },
  imageErrorText: {
    ...TypographyThemes.nunito.body,
    fontSize: 14,
    color: Colors.red[500],
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    ...TypographyThemes.nunito.body,
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
});
