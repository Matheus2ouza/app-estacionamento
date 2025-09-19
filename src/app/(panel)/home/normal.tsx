import MessageModal from "@/components/MessageModal";
import ParkingBox from "@/components/ParkingBox";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext"; // Adicionado
import { useCashContext } from "@/context/CashContext";
import { styles } from "@/styles/home/normalHomeStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react"; // Adicionado
import { Pressable, Text, TouchableOpacity, View } from "react-native"; // Adicionado Alert

export default function NormalHome() {
  const { role } = useAuth(); // Obtém o role do usuário
  const { 
    cashStatus,
    cashData,
    parkingDetails,
    refreshAllData,
    fetchParkingDetails,
    isCashNotCreated,
  } = useCashContext();

  const [showMessage, setShowMessage] = useState(false);

  // Buscar dados ao montar a tela
  useEffect(() => {
    refreshAllData();
  }, []);

  // Atualizar dados quando a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        await refreshAllData();
        if (!cancelled && isCashNotCreated()) {
          setShowMessage(true);
        }
      })();
      return () => { cancelled = true };
    }, [])
  );

  // Monitorar mudanças no status do caixa para exibir/ocultar mensagem
  useEffect(() => {
    if (isCashNotCreated()) {
      setShowMessage(true);
    } else {
      setShowMessage(false);
    }
  }, [cashStatus]);

  // Função para converter dados do estacionamento para o formato esperado pelo ParkingBox
  const convertParkingData = () => {
    if (!parkingDetails?.data) return undefined;
    
    const { data } = parkingDetails;
    const free = data.capacityMax - data.quantityVehicles;
    
    return {
      free,
      used: data.quantityVehicles,
      details: [data.quantityCars, data.quantityMotorcycles]
    };
  };

  // Refresh específico do ParkingBox
  const handleParkingBoxRefresh = async () => {
    if (isCashNotCreated()) {
      console.log('❌ [NormalHome] handleParkingBoxRefresh: Caixa não criado, mostrando mensagem');
      setShowMessage(true);
      return;
    }
    if (cashData?.id) {
      await fetchParkingDetails(cashData.id);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.gray.zinc, Colors.blue.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.brandContainer}>
          <Text style={styles.brandMain}>LEÃO</Text>
          <Text style={styles.brandSub}>Estacionamento</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/config/normal")}>
          <View style={styles.iconCircle}>
            <AntDesign name="user" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.body}>
        <MessageModal 
          visible={showMessage}
          onClose={() => setShowMessage(false)}
          title="Caixa não encontrado"
          message="O administrador ainda não criou nenhum caixa, aguarde ele criar para liberar todas as funções do app."
          closeButtonText="OK"
        />

        <ParkingBox 
          cashStatus={cashStatus}
          onRefresh={handleParkingBoxRefresh}
          parkingData={convertParkingData()}
        />

        <LinearGradient
          colors={[Colors.gray.zinc, Colors.blue.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bottomBar}
        >
          <Pressable
            onPress={() => {
              router.push("/functions/entreyRegister");
            }}
          >
            <View style={styles.buttonEntry}>
              <Entypo name="login" size={40} color={Colors.text.inverse} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("/functions/scanExit");
            }}
          >
            <View style={styles.buttonExit}>
              <Entypo name="log-out" size={40} color={Colors.text.inverse} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("/functions/parking");
            }}
          >
            <View style={styles.buttonPatio}>
              <FontAwesome name="product-hunt" size={40} color={Colors.text.inverse} />
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/functions/registerProductSale");
            }}
          >
            <View style={styles.buttonDashboard}>
              <MaterialCommunityIcons name="food-fork-drink" size={40} color={Colors.text.inverse} />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}
