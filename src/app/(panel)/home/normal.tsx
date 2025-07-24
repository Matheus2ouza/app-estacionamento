import CashRegisterModal from "@/src/components/CashRegisterModal"; 
import FeedbackModal from "@/src/components/FeedbackModal";
import Separator from "@/src/components/Separator";
import Colors from "@/src/constants/Colors";
import useCashService from "@/src/hooks/cash/useCashStatus"; 
import { styles } from "@/src/styles/home/normalHomeStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react"; 
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";

const parkingNumbers = {
  free: 23,
  used: 99,
  details: [99, 99, 99],
};

export default function NormalHome() {
  const { getStatusCash, openCash, openCashId } = useCashService();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cashStatusLoaded, setCashStatusLoaded] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    message: "",
    isSuccess: false,
  });

  const fetchCashStatus = async () => {
    await getStatusCash();
    setCashStatusLoaded(true);
  };

  useFocusEffect(
    useCallback(() => {
      setCashStatusLoaded(false);
      fetchCashStatus();
    }, [])
  );

  useEffect(() => {
    if (cashStatusLoaded && openCashId === null) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  }, [openCashId, cashStatusLoaded]);

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

    const { success, message } = await openCash(parsedValue);

    setFeedbackModal({
      visible: true,
      message,
      isSuccess: success,
    });

    if (success) {
      setIsModalVisible(false);
    }
  } catch (err) {
    setFeedbackModal({
      visible: true,
      message: "Não foi possível abrir o caixa.",
      isSuccess: false,
    });
    console.error(err);
  } finally {
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

        <TouchableOpacity onPress={() => router.push("/(panel)/Config/config")}>
          <View style={styles.iconCircle}>
            <AntDesign name="user" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Modal para controle de caixa */}
      <CashRegisterModal
        visible={isModalVisible}
        mode="open"
        onClose={() => setIsModalVisible(false)}
        onSubmitCashRegister={(value) => handleOpenCash(value)}
      />

      <FeedbackModal
        visible={feedbackModal.visible}
        message={feedbackModal.message}
        isSuccess={feedbackModal.isSuccess}
        onClose={() => setFeedbackModal({ ...feedbackModal, visible: false })}
      />

      <View style={styles.body}>
        <View style={styles.parkingStatus}>
          <View style={styles.BoxHeader}>
            <Text style={styles.title}>Vagas</Text>
            <Pressable onPress={fetchCashStatus}>
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
              router.push("/Functions/exitRegister");
            }}
          >
            <View style={styles.buttonExit}>
              <Entypo name="log-out" size={40} color={Colors.white} />
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/Functions/parking")}>
            <View style={styles.buttonPatio}>
              <FontAwesome name="product-hunt" size={40} color={Colors.white} />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}
