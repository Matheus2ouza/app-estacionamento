import FeedbackModal from "@/components/FeedbackModal";
import Header from "@/components/Header";
import PhotoViewerModal from "@/components/PhotoViewerModal";
import { PrimaryButton } from "@/components/PrimaryButton";
import Colors from "@/constants/Colors";
import { useExitVehicle } from "@/hooks/vehicleFlow/useExitVehicle";
import { useVehiclePhoto } from "@/hooks/vehicleFlow/useVehiclePhoto";
import { styles } from "@/styles/functions/informationVehicleStyle";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function InformationExit() {
  const { vehicleData } = useLocalSearchParams();
  const { loading: loadingImage, error: photoError, fetchVehiclePhoto } = useVehiclePhoto();
  const { calculateExit, loading: loadingExit, success, error, message } = useExitVehicle();
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [currentPhotoData, setCurrentPhotoData] = useState<{photo: string; photoType: string} | null>(null);
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };


  // Monitorar erros do hook useExitVehicle
  useEffect(() => {
    if (error) {
      showFeedback(error, "error");
    }
  }, [error]);

  // Parse dos dados do veículo recebidos via parâmetros
  const vehicle = vehicleData ? JSON.parse(vehicleData as string) : {
    id: "1",
    plate: "ABC-1234",
    category: "Carro",
    entryTime: new Date().toISOString(),
    permanenceTime: "2h 30min",
    observation: "Observação do veículo",
    billingMethod: {
      title: "Por Hora",
      description: "Cobrança por hora",
      tolerance: 15,
      timeMinutes: 60,
      value: 5.00,
    },
    photoType: "entry",
  };

  // Monitorar sucesso do cálculo e navegar para exitRegister
  useEffect(() => {
    if (success && calculatedAmount !== null) {
      // Combinar dados do veículo com o valor calculado
      const exitData = {
        ...vehicle,
        calculatedAmount: calculatedAmount
      };

      router.push({
        pathname: "/functions/exitRegister",
        params: {
          exitData: JSON.stringify(exitData)
        }
      });
    }
  }, [success, calculatedAmount, vehicle]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
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

  const handleRegisterExit = async () => {
    try {
      const result = await calculateExit(vehicle.id, vehicle.plate);
      
      if (result?.data) {
        setCalculatedAmount(result.data);
      } else {
        showFeedback("Erro ao calcular valor da saída. Tente novamente.", "error");
      }
    } catch (error) {
      console.error("Erro ao calcular saída:", error);
      showFeedback("Erro ao calcular valor da saída. Tente novamente.", "error");
    }
  };

  // Função para obter o valor (já filtrado pela API)
  const getBillingValue = () => {
    if (vehicle.billingMethod?.value) {
      return parseFloat(vehicle.billingMethod.value);
    }
    return 0;
  };

  const handleViewImage = async () => {
    if (loadingImage) return;
    
    try {
      const photoData = await fetchVehiclePhoto(vehicle.id);

      if (photoData) {
        setCurrentPhotoData(photoData);
        setPhotoViewerVisible(true);
      } else if (photoError) {
        console.log("Erro ao carregar foto:", photoError);
      }
    } catch (error) {
      console.log("Erro ao carregar foto:", error);
    }
  };

  const handleClosePhotoViewer = () => {
    setPhotoViewerVisible(false);
    setCurrentPhotoData(null);
  };

  return (
    <View style={styles.container}>
      <Header title="Informações do Veículo" />
      
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
            </View>
            <View style={styles.scanIndicator}>
              <FontAwesome name="qrcode" size={16} color={Colors.green[600]} />
              <Text style={styles.scanText}>Escaneado</Text>
            </View>
          </View>
        </View>

        {/* Informações básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
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
            <Text style={styles.infoLabel}>Tempo de Permanência:</Text>
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

        {/* Informações de cobrança */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Cobrança</Text>
          
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

        {/* Botão de ação */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={loadingExit ? "Calculando..." : "Registrar Saída"}
            onPress={handleRegisterExit}
            style={styles.buttonConfirm}
            disabled={loadingExit}
          />
        </View>
      </ScrollView>

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        visible={photoViewerVisible}
        onClose={handleClosePhotoViewer}
        photoData={currentPhotoData}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackVisible}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setFeedbackVisible(false)}
        dismissible={true}
      />
    </View>
  );
}