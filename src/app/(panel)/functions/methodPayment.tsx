import FeedbackModal from "@/src/components/FeedbackModal";
import GenericConfirmationModal from "@/src/components/GenericConfirmationModal";
import Header from "@/src/components/Header";
import PermissionDeniedModal from "@/src/components/PermissionDeniedModal";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { useBillingMethod } from "@/src/hooks/cash/useBillingMethod";
import { activeMethodStyles, containerStyles, disabledMethodStyles, styles } from "@/src/styles/functions/methodPaymentStyle";
import { BillingMethodList, changeOptions } from "@/src/types/billingMethod";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Snackbar from "react-native-snackbar";

export default function MethodPayment() {
  const { role, userId } = useAuth();
  const { loading, error, success, message, handleGetMethods, handleDeleteMethod: deleteMethodFromHook, handleActivateMethod: activateMethodFromHook } = useBillingMethod();
  const [methods, setMethods] = useState<BillingMethodList[]>([]);
  
  // Estados para o FeedbackModal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // Estado para pull to refresh
  const [refreshing, setRefreshing] = useState(false);

  // Estado para o modal de permissão negada
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const [permissionAction, setPermissionAction] = useState("");

  useEffect(() => {
    loadMethods();
  }, []);

  // Recarrega os dados sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadMethods();
    }, [])
  );

  // Efeito para mostrar feedback baseado no estado do hook
  useEffect(() => {
    if (error && !loading) {
      setFeedbackMessage(error || "Erro desconhecido");
      setFeedbackType('error');
      setShowFeedback(true);
    }
  }, [error, loading]);

  const loadMethods = async () => {
    try {
      const result = await handleGetMethods();
      if (result.success && result.methods) {
        setMethods(result.methods);
      } else {
        console.error("[MethodPayment] Erro ao carregar métodos:", result.message);
        // Se não conseguir carregar, define uma lista vazia para evitar undefined
        setMethods([]);
      }
    } catch (error) {
      console.error("[MethodPayment] Erro inesperado:", error);
      // Em caso de erro, define uma lista vazia para evitar undefined
      setMethods([]);
    }
  };

  // Função para pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadMethods();
    } finally {
      setRefreshing(false);
    }
  };

  // Função para verificar permissão de ADMIN
  const checkAdminPermission = (action: string): boolean => {
    if (role !== 'ADMIN') {
      setPermissionAction(action);
      setShowPermissionDenied(true);
      return false;
    }
    return true;
  };

  const handleEditMethod = (method: BillingMethodList) => {
    if (!checkAdminPermission("editar métodos de cobrança")) {
      return;
    }

    router.push({
      pathname: "/functionsAdmin/editPayment",
      params: {
        id: method.id,
        title: method.title,
        category: method.category,
        tolerance: method.tolerance.toString(),
        time: method.timeMinutes !== undefined && method.timeMinutes !== null ? method.timeMinutes.toString() : "",
        carPrice: method.carroValue.toString(),
        motoPrice: method.motoValue.toString()
      }
    });
  };

  const handleEditDisabledMethod = () => {
    Snackbar.show({
      text: "Não é possível editar um método desativado. Reative o método primeiro.",
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: Colors.orange[600],
      textColor: Colors.white,
      action: {
        text: "OK",
        textColor: Colors.white,
      },
    });
  };

  const handleActivateMethod = (method: BillingMethodList) => {
    if (!checkAdminPermission("ativar métodos de cobrança")) {
      return;
    }

    setMethodToActivate(method);
    setShowActivateModal(true);
  };

  const confirmActivate = async () => {
    if (!methodToActivate) return;

    try {
      // Chama a API para ativar
      const result = await activateMethodFromHook(methodToActivate.id);
      
      if (result.success) {
        setShowActivateModal(false);
        setMethodToActivate(null);
        
        // Recarrega a lista de métodos para atualizar o estado
        await loadMethods();
        
        // Mostra feedback de sucesso
        setFeedbackMessage("Método reativado com sucesso!");
        setFeedbackType('success');
        setShowFeedback(true);
      } else {
        console.error("[MethodPayment] Erro ao ativar método:", result.message);
        setFeedbackMessage("Erro ao ativar método: " + result.message);
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      console.error("[MethodPayment] Erro inesperado ao ativar:", error);
      setFeedbackMessage("Erro inesperado ao ativar método");
      setFeedbackType('error');
      setShowFeedback(true);
    }
  };

  const cancelActivate = () => {
    setShowActivateModal(false);
    setMethodToActivate(null);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<BillingMethodList | null>(null);
  
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [methodToActivate, setMethodToActivate] = useState<BillingMethodList | null>(null);

  const handleDeleteMethod = (method: BillingMethodList) => {
    if (!checkAdminPermission("desativar métodos de cobrança")) {
      return;
    }

    setMethodToDelete(method);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!methodToDelete) return;

    try {
      // Chama a API para desativar
      const result = await deleteMethodFromHook(methodToDelete.id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setMethodToDelete(null);
        
        // Recarrega a lista de métodos para atualizar o estado
        await loadMethods();
        
        // Mostra feedback de sucesso
        setFeedbackMessage("Método desativado com sucesso!");
        setFeedbackType('success');
        setShowFeedback(true);
      } else {
        console.error("[MethodPayment] Erro ao desativar método:", result.message);
        setFeedbackMessage("Erro ao desativar método: " + result.message);
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      console.error("[MethodPayment] Erro inesperado ao desativar:", error);
      setFeedbackMessage("Erro inesperado ao desativar método");
      setFeedbackType('error');
      setShowFeedback(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMethodToDelete(null);
  };

  const getCategoryLabel = (category: string) => {
    if (!category) return "Desconhecido";
    const option = changeOptions.find(opt => opt.value === category);
    return option?.label || "Desconhecido";
  };

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null || isNaN(value)) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTime = (time: string | number) => {
    // Converte para string se for número
    const timeStr = time?.toString() || "";
    
    if (!timeStr || timeStr === "0") return "Não aplicável";
    
    // Se for apenas números, assume que é em minutos e converte para HH:MM:SS
    if (/^\d+$/.test(timeStr)) {
      const minutes = parseInt(timeStr);
      if (isNaN(minutes)) return "Formato inválido";
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`;
    }
    
    // Se for formato HH:MM:SS, mantém o formato
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      if (parts.length === 3) {
        return timeStr; // Retorna no formato HH:MM:SS
      } else if (parts.length === 2) {
        // Se for HH:MM, adiciona :00 para segundos
        return `${timeStr}:00`;
      }
    }
    
    // Se não conseguir formatar, retorna o valor original
    return timeStr;
  };

  const renderMethodCard = (method: BillingMethodList, index: number) => {
    // Verificação de segurança para evitar renderização de métodos undefined
    if (!method || !method.title) {
      return null;
    }

    // Se o método estiver desativado, mostra apenas o card de desativado
    if (!method.isActive) {
      return (
        <View key={`method-${index}`} style={disabledMethodStyles.methodCard}>
          <View style={disabledMethodStyles.methodHeader}>
            <View style={disabledMethodStyles.methodTitleContainer}>
              <Text style={disabledMethodStyles.methodTitle}>{method.title}</Text>
              <View style={disabledMethodStyles.statusBadge}>
                <Ionicons 
                  name="pause-circle" 
                  size={14} 
                  color={Colors.red[600]} 
                  style={disabledMethodStyles.statusIcon}
                />
                <Text style={disabledMethodStyles.statusText}>
                  Desativado
                </Text>
              </View>
            </View>
            
            <View style={disabledMethodStyles.actionButtons}>
              <TouchableOpacity
                style={[disabledMethodStyles.editButton, { opacity: 0.8 }]}
                onPress={handleEditDisabledMethod}
              >
                <Ionicons name="pencil" size={20} color={Colors.gray[700]} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={disabledMethodStyles.activateButton}
                onPress={() => handleActivateMethod(method)}
              >
                <Ionicons name="checkmark-circle" size={20} color={disabledMethodStyles.activateIcon.color} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Apenas o aviso de método desativado */}
          <View style={[disabledMethodStyles.disabledInfoContainer, { marginTop: 0 }]}>
            <View style={disabledMethodStyles.disabledInfoIcon}>
              <Ionicons name="alert-circle" size={20} color={Colors.orange[600]} />
            </View>
            <View style={disabledMethodStyles.disabledInfoContent}>
              <Text style={disabledMethodStyles.disabledInfoTitle}>
                Método Desativado
              </Text>
              <Text style={disabledMethodStyles.disabledInfoMessage}>
                Este método não está disponível para uso. Clique no botão verde (✓) para reativá-lo.
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Método ativo - mostra todos os detalhes
    return (
      <View key={`method-${index}`} style={styles.methodCard}>
        <View style={styles.methodHeader}>
          <View style={styles.methodTitleContainer}>
            <Text style={styles.methodTitle}>{method.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{getCategoryLabel(method.category)}</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditMethod(method)}
            >
              <Ionicons name="pencil" size={20} color={Colors.gray.light} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteMethod(method)}
            >
              <Ionicons name="trash" size={20} color={Colors.red[500]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.methodDetails}>
          {/* Para métodos de valor fixo, mostra avisos em vez dos campos */}
          {method.category === 'VALOR_FIXO' ? (
            <>
              <View style={[disabledMethodStyles.disabledInfoContainer, { marginBottom: 12, backgroundColor: Colors.gray[50], borderColor: Colors.gray[200] }]}>
                <View style={[disabledMethodStyles.disabledInfoIcon, { backgroundColor: Colors.gray[100] }]}>
                  <Ionicons name="remove-circle" size={20} color={Colors.gray[500]} />
                </View>
                <View style={disabledMethodStyles.disabledInfoContent}>
                  <Text style={[disabledMethodStyles.disabledInfoTitle, { color: Colors.gray[700] }]}>
                    Tolerância Desativada
                  </Text>
                  <Text style={[disabledMethodStyles.disabledInfoMessage, { color: Colors.gray[600] }]}>
                    Para métodos de valor fixo, a tolerância não se aplica pois o valor é cobrado independentemente do tempo.
                  </Text>
                </View>
              </View>

              <View style={[disabledMethodStyles.disabledInfoContainer, { marginBottom: 12, backgroundColor: Colors.gray[50], borderColor: Colors.gray[200] }]}>
                <View style={[disabledMethodStyles.disabledInfoIcon, { backgroundColor: Colors.gray[100] }]}>
                  <Ionicons name="remove-circle" size={20} color={Colors.gray[500]} />
                </View>
                <View style={disabledMethodStyles.disabledInfoContent}>
                  <Text style={[disabledMethodStyles.disabledInfoTitle, { color: Colors.gray[700] }]}>
                    Tempo de Cobrança Desativado
                  </Text>
                  <Text style={[disabledMethodStyles.disabledInfoMessage, { color: Colors.gray[600] }]}>
                    Para métodos de valor fixo, o tempo de cobrança não se aplica pois o valor é fixo.
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tolerância:</Text>
                <Text style={styles.detailValue}>{method.tolerance || 0} minutos</Text>
              </View>

              {method.timeMinutes && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tempo de Cobrança:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(method.timeMinutes)}
                  </Text>
                </View>
              )}
            </>
          )}

          <View style={styles.pricingSection}>
            <Text style={styles.pricingTitle}>Preços</Text>
            
            <View style={styles.priceRow}>
              <View style={styles.vehicleIcon}>
                <Ionicons name="car" size={16} color={Colors.blue.primary} />
              </View>
              <Text style={activeMethodStyles.vehicleLabel}>Carro:</Text>
              <Text style={styles.priceValue}>{formatCurrency(method.carroValue || 0)}</Text>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.vehicleIcon}>
                <Ionicons name="bicycle" size={16} color={Colors.blue.primary} />
              </View>
              <Text style={activeMethodStyles.vehicleLabel}>Moto:</Text>
              <Text style={styles.priceValue}>{formatCurrency(method.motoValue || 0)}</Text>
            </View>
          </View> 
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.blue.primary} />
          <Text style={styles.loadingText}>Carregando métodos de cobrança...</Text>
        </View>
      );
    }

    if (error && !refreshing) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.red[500]} />
          <Text style={styles.errorTitle}>Erro ao carregar</Text>
          <Text style={styles.errorMessage}>{error || "Erro desconhecido"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMethods}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (methods.length === 0 && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="card-outline" size={64} color={Colors.gray[400]} />
          <Text style={styles.emptyTitle}>Nenhum método configurado</Text>
          <Text style={styles.emptyMessage}>
            Configure sua primeira forma de pagamento para começar a cobrar pelos estacionamentos
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.methodsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.blue.primary]}
            tintColor={Colors.blue.primary}
            title="Puxar para atualizar"
            titleColor={Colors.text.secondary}
          />
        }
      >
        {methods.map((method, index) => renderMethodCard(method, index))}
      </ScrollView>
    );
  };
  
  return (
    <View style={containerStyles.mainContainer}>
      <Header title="Formas de Pagamento e preço" titleStyle={styles.header} />

      <View style={styles.container}>

        {renderContent()}

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            router.push("/functionsAdmin/createPayment");
          }}
        >
          <Ionicons name="add-outline" size={50} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <FeedbackModal
        visible={showFeedback}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setShowFeedback(false)}
        dismissible={true}
        onBackPress={() => router.back()}
        autoNavigateOnSuccess={false}
        navigateDelay={2000}
      />

      <GenericConfirmationModal
        visible={showDeleteModal}
        title="Confirmar Desativação"
        message={`Deseja realmente desativar o método "${methodToDelete?.title || 'selecionado'}"?`}
        details={`Você está desativando um método de cobrança. Não se preocupe, ele não será excluído permanentemente, apenas ficará indisponível para uso. Caso deseje reativá-lo, basta clicar no botão verde (✓) ao lado do botão de editar, e o método será reativado.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Desativar"
        cancelText="Cancelar"
        confirmButtonStyle="danger"
      />

      <PermissionDeniedModal
        visible={showPermissionDenied}
        action={permissionAction}
        currentRole={role || undefined}
        onClose={() => setShowPermissionDenied(false)}
        message="Você precisa ter permissão de administrador para editar métodos de cobrança."
      />

      <GenericConfirmationModal
        visible={showActivateModal}
        title="Confirmar Reativação"
        message={`Deseja realmente reativar o método "${methodToActivate?.title || 'selecionado'}"?`}
        details={`Você está reativando um método de cobrança. Após a reativação, o método ficará disponível para uso novamente e poderá ser editado normalmente.`}
        onConfirm={confirmActivate}
        onCancel={cancelActivate}
        confirmText="Reativar"
        cancelText="Cancelar"
        confirmButtonStyle="success"
      />
    </View>
  );
}
