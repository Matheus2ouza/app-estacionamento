import CashRegisterModal from "@/src/components/CashRegisterModal";
import FeedbackModal from "@/src/components/FeedbackModal";
import Separator from "@/src/components/Separator";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import useCashService from "@/src/hooks/cash/useCashStatus";
import { styles } from "@/src/styles/home/adminHomeStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

const cashData = {
  "Valor Inicial": 999.99,
  Dinheiro: 123.45,
  Cartão: 321.0,
  Pix: 150.0,
  Saída: 50.0,
  Total: 1544.44,
};

const parkingNumbers = {
  free: 42,
  used: 99,
  details: [99, 99, 99], // carro, moto, carro grande (na mesma ordem dos ícones)
};

export default function AdminHome() {
  const { role, userId } = useAuth();
  const { getStatusCash, postOpenCash, loading, isOpen, error } =
    useCashService();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cashStatusLoaded, setCashStatusLoaded] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    message: "",
    isSuccess: false,
  });

  useEffect(() => {
    // Usa uma cor sólida do gradiente (última cor) como base
    SystemUI.setBackgroundColorAsync(Colors.blueLight);
  }, []);

  const fetchCashStatus = async () => {
    await getStatusCash();
    setCashStatusLoaded(true);
  };

  // Verifica o status do caixa toda vez que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      fetchCashStatus();
    }, [])
  );

  useEffect(() => {
    console.log("cashStatusLoaded:", cashStatusLoaded);
    console.log("isOpen:", isOpen);

    if (cashStatusLoaded && isOpen === false) {
      console.log("-> Abrindo modal");
      setIsModalVisible(true);
    } else {
      console.log("-> Fechando modal");
      setIsModalVisible(false);
    }
  }, [isOpen, cashStatusLoaded]);

  const handleOpenCash = async (initialValue: string) => {
    try {
      const parsedValue = parseFloat(initialValue);

      if (isNaN(parsedValue)) {
        setFeedbackModal({
          visible: true,
          message: "Valor inválido.",
          isSuccess: false,
        });
        return;
      }

      await postOpenCash(parsedValue);

      if (isOpen) {
        setFeedbackModal({
          visible: true,
          message: `Caixa aberto com valor inicial: R$ ${parsedValue.toFixed(
            2
          )}`,
          isSuccess: true,
        });
        setIsModalVisible(false);
      } else {
        setFeedbackModal({
          visible: true,
          message: "Já existe um caixa aberto para hoje.",
          isSuccess: false,
        });
      }
    } catch (err) {
      setFeedbackModal({
        visible: true,
        message: "Não foi possível abrir o caixa.",
        isSuccess: false,
      });
      console.error(err);
    } finally {
      // Atualiza o status do caixa depois da tentativa
      await getStatusCash();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.zinc, Colors.blueLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.brandContainer}>
          <Text style={styles.brandMain}>LEÃO</Text>
          <Text style={styles.brandSub}>Estacionamento</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("/Config/config");
          }}
        >
          <View style={styles.iconCircle}>
            <AntDesign name="user" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Modal para controle de abertura de caixa */}
      <CashRegisterModal
        visible={isModalVisible}
        role={role}
        onClose={() => setIsModalVisible(false)}
        onOpenCashRegister={handleOpenCash}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackModal.visible}
        message={feedbackModal.message}
        isSuccess={feedbackModal.isSuccess}
        onClose={() => setFeedbackModal({ ...feedbackModal, visible: false })}
      />

      <View style={styles.body}>
        <View style={styles.cashBox}>
          <View style={styles.BoxHeader}>
            <Text style={styles.title}>Caixa</Text>
            <Pressable onPress={fetchCashStatus}>
              <View style={styles.refreshIcon}>
                <FontAwesome name="refresh" size={24} color={Colors.white} />
              </View>
            </Pressable>
          </View>

          <Separator style={{ width: "90%" }} />

          <View style={styles.cashContent}>
            {Object.entries(cashData).map(([label, value]) => (
              <View key={label} style={styles.cashRow}>
                <Text style={styles.cashLabel}>{label}</Text>
                <View style={styles.dottedLine} />
                <Text style={styles.cashValue}>R$ {value.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.parkingStatus}>
          <View style={styles.BoxHeader}>
            <Text style={styles.title}>Vagas</Text>
            <Pressable>
              <View style={styles.refreshIcon}>
                <FontAwesome name="refresh" size={24} color={Colors.white} />
              </View>
            </Pressable>
          </View>

          <Separator style={{ width: "90%" }} />

          <View style={styles.parkingContent}>
            <View style={styles.statusParking}>
              <View style={styles.freeParking}>
                <Text style={styles.numberFree}>{parkingNumbers.free}</Text>
                <Text style={styles.labelFree}>Livres</Text>
              </View>

              <View style={styles.dividerVertical} />

              <View style={styles.usedParking}>
                <Text style={styles.numberUsed}>{parkingNumbers.used}</Text>
                <Text style={styles.labelUsed}>Em uso</Text>
              </View>
            </View>

            <Separator style={{ width: "90%", alignSelf: "center" }} />

            <View style={styles.detailsParking}>
              <View style={styles.iconDescriptionRow}>
                <MaterialCommunityIcons
                  name="car-hatchback"
                  size={22}
                  color="black"
                />
                <Text style={styles.iconText}>{parkingNumbers.details[0]}</Text>
              </View>

              <View style={styles.dividerVertical} />

              <View style={styles.iconDescriptionRow}>
                <FontAwesome name="motorcycle" size={18} color="black" />
                <Text style={styles.iconText}>{parkingNumbers.details[1]}</Text>
              </View>

              <View style={styles.dividerVertical} />

              <View style={styles.iconDescriptionRow}>
                <MaterialCommunityIcons
                  name="car-estate"
                  size={22}
                  color="black"
                />
                <Text style={styles.iconText}>{parkingNumbers.details[2]}</Text>
              </View>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={[Colors.zinc, Colors.blueLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bottomBar}
        >
          <Pressable
            onPress={() => {
              router.push("/Functions/entreyRegister");
            }}
          >
            <View style={styles.buttonEntry}>
              <Entypo name="login" size={40} color={Colors.white} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("/Functions/scanExit");
            }}
          >
            <View style={styles.buttonExit}>
              <Entypo name="log-out" size={40} color={Colors.white} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("/Functions/parking");
            }}
          >
            <View style={styles.buttonPatio}>
              <FontAwesome name="product-hunt" size={40} color={Colors.white} />
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/Functions/inventory");
            }}
          >
            <View style={styles.buttonDashboard}>
              <MaterialCommunityIcons name="food-fork-drink" size={40} color={Colors.white} />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}
