import CashRegisterModal from "@/src/components/CashRegisterModal";
import EditInitialValueModal from "@/src/components/EditInitialValueModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import GenericConfirmationModal from "@/src/components/GenericConfirmationModal";
import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { useCashContext } from "@/src/context/CashContext";
import { useCash } from "@/src/hooks/cash/useCash";
import { styles } from "@/src/styles/functions/cashSettingsStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CashSettings() {
  const { cashData, cashDetails, isCashOpen, isCashClosed, isCashNotCreated, fetchCashDetails, fetchParkingDetails, openCash, closeCash, reOpenCash, refreshAllData, updateInitialValue } = useCashContext();
  const { role } = useAuth();
  const cashHook = useCash();

  const [now, setNow] = useState<number>(Date.now());
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [pendingVehiclesCount, setPendingVehiclesCount] = useState<number>(0);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Carregar detalhes ao montar (evita depender da ref da função para não criar loop)
  useEffect(() => {
    if (cashData?.id) {
      fetchCashDetails(cashData.id);
      cashHook.fetchGeneralDetailsCash(cashData.id);
    }
  }, [cashData?.id, refreshKey]); // Adicionado refreshKey para forçar atualização

  // Recarregar dados sempre que a tela entrar em foco
  useFocusEffect(
    useCallback(() => {
      refreshAllData();
      return undefined;
    }, [refreshAllData])
  );

  // Timer do contador quando aberto
  useEffect(() => {
    if (!isCashOpen()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isCashOpen]);

  const openingDate = useMemo(
    () => (cashData?.opening_date ? new Date(cashData.opening_date) : null),
    [cashData?.opening_date]
  );

  const closingDate = useMemo(() => {
    const fromHook = (cashHook.data as any)?.generalDetails?.closingDate;
    const fromContext = (cashData as any)?.closing_date;
    const dateStr = fromHook || fromContext;
    return dateStr ? new Date(dateStr) : null;
  }, [cashHook.data, cashData]);

  const elapsedTime = useMemo(() => {
    if (!openingDate) return "—";
    // Aberto: cronômetro em tempo real
    if (isCashOpen()) {
      const diffMs = now - openingDate.getTime();
      const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
    // Fechado: duração total entre abertura e fechamento
    if (isCashClosed() && closingDate) {
      const diffMs = Math.max(0, closingDate.getTime() - openingDate.getTime());
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
    return "—";
  }, [now, openingDate, closingDate, isCashOpen, isCashClosed]);

  const formatDateTime = useCallback((dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const performClose = useCallback(async (): Promise<[boolean, string]> => {
    if (!cashData?.id) return [false, 'ID do caixa não encontrado'];
    return await closeCash(cashData.id);
  }, [cashData?.id, closeCash]);

  const handleRequestClose = useCallback(async () => {
    if (!cashData?.id) return;
    try {
      setLoadingAction(true);
      const parkingResp = await fetchParkingDetails(cashData.id);
      const vehicles = parkingResp?.data?.quantityVehicles ?? 0;
      if (vehicles > 0) {
        setPendingVehiclesCount(vehicles);
        setConfirmVisible(true);
        setLoadingAction(false);
        return;
      }
      
      const [success, message] = await performClose();
      if (success) {
        setFeedbackMessage(message);
        setFeedbackType('success');
        setShowFeedback(true);
        // Forçar atualização dos dados do hook
        if (cashData?.id) {
          await cashHook.fetchGeneralDetailsCash(cashData.id);
        }
        // Forçar re-render da tela
        setRefreshKey(prev => prev + 1);
      } else {
        setFeedbackMessage(message);
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      setFeedbackMessage('Erro inesperado ao fechar caixa');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingAction(false);
    }
  }, [cashData?.id, fetchParkingDetails, performClose]);

  const handleAction = useCallback(() => {
    setShowRegisterModal(true);
  }, []);

  // Função para reabrir o caixa
  const handleReopenCash = async () => {
    if (!cashData?.id) return;
    
    try {
      setLoadingAction(true);
      const [success, message] = await reOpenCash(cashData.id);
      
      if (success) {
        setFeedbackMessage(message);
        setFeedbackType('success');
        setShowFeedback(true);
        // Forçar atualização dos dados do hook
        if (cashData?.id) {
          await cashHook.fetchGeneralDetailsCash(cashData.id);
        }
        // Forçar re-render da tela
        setRefreshKey(prev => prev + 1);
      } else {
        setFeedbackMessage(message);
        setFeedbackType('error');
        setShowFeedback(true);
      }
    } catch (error) {
      console.error('Erro ao reabrir caixa:', error);
      setFeedbackMessage('Erro inesperado ao reabrir caixa');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingAction(false);
    }
  };

  const convertBrazilianCurrency = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    let cleanValue = value.replace(/\s/g, '').replace(/[^\d,.-]/g, '');
    if (cleanValue.includes(',')) cleanValue = cleanValue.replace(',', '.');
    const result = parseFloat(cleanValue);
    return isNaN(result) ? 0 : result;
  };

  // Lógica do botão baseada no status do caixa
  const getButtonConfig = () => {
    if (isCashOpen()) {
      return {
        label: "Fechar Caixa",
        color: Colors.icon.error,
        mode: "close" as const
      };
    } else if (isCashClosed()) {
      return {
        label: "Reabrir Caixa",
        color: Colors.icon.warning,
        mode: "reopen" as const
      };
    } else {
      return {
        label: "Abrir Caixa",
        color: Colors.icon.success,
        mode: "open" as const
      };
    }
  };

  const buttonConfig = getButtonConfig();

  // Função para salvar o novo valor inicial
  const handleSaveInitialValue = async (newValue: number) => {
    if (!cashData?.id) return;
    
    setLoadingEdit(true);
    try {
      const [success, message] = await updateInitialValue(cashData.id, newValue);
      
      if (success) {
        setFeedbackMessage(message);
        setFeedbackType('success');
        setShowEditModal(false);
        setShowFeedback(true);
        await refreshAllData();
        // Forçar atualização dos dados do hook
        if (cashData?.id) {
          await cashHook.fetchGeneralDetailsCash(cashData.id);
        }
        // Forçar re-render da tela
        setRefreshKey(prev => prev + 1);
      } else {
        setFeedbackMessage(message);
        setFeedbackType('error');
        setShowFeedback(true);
      }
      
    } catch (error) {
      console.error('Erro ao salvar valor inicial:', error);
      setFeedbackMessage('Erro inesperado ao atualizar valor inicial');
      setFeedbackType('error');
      setShowFeedback(true);
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Configurações do Caixa" titleStyle={{ fontSize: 25 }} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção Informativa */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="information-circle" size={24} color="white" />
            </View>
            <Text style={styles.infoTitle}>Informações sobre Edição</Text>
          </View>
          <Text style={styles.infoDescription}>
            Você pode visualizar os dados do caixa, fechar o caixa, reabrir o caixa e editar o caixa (no caso o único campo que pode ser editado é o valor inicial).
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.statusBadge,
                isCashOpen()
                  ? null
                  : isCashClosed()
                  ? styles.statusBadgeClosed
                  : styles.statusBadgeNeutral,
              ]}
            >
              <MaterialIcons
                name={
                  isCashOpen()
                    ? "check-circle"
                    : isCashClosed()
                    ? "lock"
                    : "error-outline"
                }
                size={18}
                color={
                  isCashOpen()
                    ? Colors.icon.success
                    : isCashClosed()
                    ? Colors.icon.error
                    : Colors.icon.secondary
                }
              />
              <Text
                style={[
                  styles.statusText,
                  isCashOpen()
                    ? styles.statusOpen
                    : isCashClosed()
                    ? styles.statusClosed
                    : styles.statusNotCreated,
                ]}
              >
                {isCashOpen()
                  ? "ABERTO"
                  : isCashClosed()
                  ? "FECHADO"
                  : "NÃO CRIADO"}
              </Text>
            </View>
            
            {!isCashNotCreated() && (
              <Pressable 
                style={styles.editButton} 
                onPress={() => setShowEditModal(true)}
              >
                <Ionicons name="pencil" size={20} color={Colors.gray.light} />
              </Pressable>
            )}
          </View>

          <View style={styles.spacerMd} />

          {isCashNotCreated() ? (
            <View style={styles.infoRow}>
              <Text style={[styles.value, { textAlign: 'center', fontStyle: 'italic', color: Colors.gray.medium }]}>
                Nenhum caixa foi criado ainda. Clique no botão abaixo para criar um novo caixa.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Operador</Text>
                <Text style={styles.value}>{cashData?.operator ?? "—"}</Text>
              </View>

              <View style={styles.spacerSm} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Hora de Abertura</Text>
                <Text style={styles.value}>
                  {formatDateTime(cashData?.opening_date)}
                </Text>
              </View>

              <View style={styles.spacerSm} />

              {isCashClosed() && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Hora de Fechamento</Text>
                    <Text style={styles.value}>
                      {formatDateTime(
                        (cashHook.data?.generalDetails?.closingDate as any) ||
                          (cashData as any)?.closing_date
                      )}
                    </Text>
                  </View>
                  <View style={styles.spacerSm} />
                </>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.label}>Tempo Aberto</Text>
                <Text style={styles.value}>{elapsedTime}</Text>
              </View>

              <View style={styles.spacerSm} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Valor Inicial</Text>
                <Text style={styles.value}>
                  R${" "}
                  {cashHook.data?.generalDetails?.initialValue
                    ? cashHook.data.generalDetails.initialValue
                        .toFixed(2)
                        .replace(".", ",")
                    : "0,00"}
                </Text>
              </View>

              <View style={styles.spacerSm} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Valor Final</Text>
                <Text style={styles.value}>
                  R${" "}
                  {cashHook.data?.generalDetails?.finalValue
                    ? cashHook.data.generalDetails.finalValue
                        .toFixed(2)
                        .replace(".", ",")
                    : "0,00"}
                </Text>
              </View>

              <View style={styles.spacerSm} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Lucro</Text>
                <Text style={[styles.value, { color: Colors.icon.success }]}>
                  R${" "}
                  {(() => {
                    const initial =
                      cashHook.data?.generalDetails?.initialValue || 0;
                    const final = cashHook.data?.generalDetails?.finalValue || 0;
                    const profit = final - initial;
                    return profit.toFixed(2).replace(".", ",");
                  })()}
                </Text>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          onPress={handleAction}
          disabled={loadingAction}
          style={[styles.actionButton, { backgroundColor: buttonConfig.color }]}
        >
          {loadingAction ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionText}>{buttonConfig.label}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para abrir/fechar/reabrir conforme status atual */}
      <CashRegisterModal
        visible={showRegisterModal}
        role={role}
        mode={buttonConfig.mode}
        onClose={() => setShowRegisterModal(false)}
        onOpenCashRegister={async (initialValue) => {
          setShowRegisterModal(false);
          try {
            setLoadingAction(true);
            const numericValue = convertBrazilianCurrency(initialValue);
            const [success, message] = await openCash(numericValue);
            
            if (success) {
              setFeedbackMessage(message);
              setFeedbackType('success');
              setShowFeedback(true);
              // Forçar atualização dos dados do hook
              if (cashData?.id) {
                await cashHook.fetchGeneralDetailsCash(cashData.id);
              }
              // Forçar re-render da tela
              setRefreshKey(prev => prev + 1);
            } else {
              setFeedbackMessage(message);
              setFeedbackType('error');
              setShowFeedback(true);
            }
          } catch (error) {
            console.error('Erro ao abrir caixa:', error);
            setFeedbackMessage('Erro inesperado ao abrir caixa');
            setFeedbackType('error');
            setShowFeedback(true);
          } finally {
            setLoadingAction(false);
          }
        }}
        onCloseCash={async () => {
          setShowRegisterModal(false);
          await handleRequestClose();
        }}
        onReopenCash={async () => {
          setShowRegisterModal(false);
          await handleReopenCash();
        }}
      />

      {/* Confirmação caso ainda existam veículos no estacionamento */}
      <GenericConfirmationModal
        visible={confirmVisible}
        title="Fechar caixa com veículos no pátio"
        message="Ainda há veículos no estacionamento. Se continuar, os veículos serão apagados. Deseja fechar mesmo assim?"
        details={`Veículos no pátio: ${pendingVehiclesCount}`}
        confirmText="Fechar mesmo"
        cancelText="Cancelar"
        confirmButtonStyle="danger"
        onConfirm={async () => {
          setConfirmVisible(false);
          try {
            setLoadingAction(true);
            const [success, message] = await performClose();
            if (success) {
              setFeedbackMessage(message);
              setFeedbackType('success');
              setShowFeedback(true);
              // Forçar atualização dos dados do hook
              if (cashData?.id) {
                await cashHook.fetchGeneralDetailsCash(cashData.id);
              }
            } else {
              setFeedbackMessage(message);
              setFeedbackType('error');
              setShowFeedback(true);
            }
          } catch (error) {
            console.error('Erro ao fechar caixa:', error);
            setFeedbackMessage('Erro inesperado ao fechar caixa');
            setFeedbackType('error');
            setShowFeedback(true);
          } finally {
            setLoadingAction(false);
          }
        }}
        onCancel={() => setConfirmVisible(false)}
      />

      {/* Modal para editar valor inicial */}
      <EditInitialValueModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentValue={cashHook.data?.generalDetails?.initialValue || 0}
        onSave={handleSaveInitialValue}
        loading={loadingEdit}
      />

      {/* Modal de feedback */}
      <FeedbackModal
        visible={showFeedback}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setShowFeedback(false)}
      />
    </View>
  );
}