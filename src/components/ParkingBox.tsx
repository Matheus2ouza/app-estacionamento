import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Separator from './Separator';

interface ParkingBoxProps {
  cashStatus: 'not_created' | 'open' | 'closed';
  onRefresh: () => void;
  parkingData?: {
    free: number;
    used: number;
    details: number[];
  };
}

const ParkingBox: React.FC<ParkingBoxProps> = ({ cashStatus, onRefresh, parkingData }) => {
  const { role } = useAuth();
  const mockParkingData = {
    free: 42,
    used: 99,
    details: [99, 99], // carro, moto
  };

  const renderParkingData = () => {
    if (cashStatus !== 'open') {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {role === 'NORMAL' ? 'Pátio fechado, aguarde o administrador abrir o caixa para ver as vagas' : 'Pátio fechado\nAbra o caixa para ver as vagas'}
          </Text>
        </View>
      );
    }

    const dataToShow = parkingData || mockParkingData;
    
    return (
      <View style={styles.parkingContent}>
        <View style={styles.statusParking}>
          <View style={styles.freeParking}>
            <Text style={styles.numberFree}>{dataToShow.free}</Text>
            <Text style={styles.labelFree}>Livres</Text>
          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.usedParking}>
            <Text style={styles.numberUsed}>{dataToShow.used}</Text>
            <Text style={styles.labelUsed}>Em uso</Text>
          </View>
        </View>

        <Separator style={{ width: "90%", alignSelf: "center" }} />

        <View style={styles.detailsParking}>
          <View style={styles.iconDescriptionRow}>
            <MaterialCommunityIcons
              name="car-hatchback"
              size={22}
              color={Colors.text.primary}
            />
            <Text style={styles.iconText}>{dataToShow.details[0]}</Text>
          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.iconDescriptionRow}>
            <FontAwesome name="motorcycle" size={18} color={Colors.text.primary} />
            <Text style={styles.iconText}>{dataToShow.details[1]}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.parkingStatus}>
      <View style={styles.BoxHeader}>
        <Text style={styles.title}>Vagas</Text>
        <Pressable onPress={onRefresh}>
          <View style={styles.refreshIcon}>
            <FontAwesome name="refresh" size={24} color={Colors.text.inverse} />
          </View>
        </Pressable>
      </View>

      <Separator style={{ width: "90%" }} />

      {renderParkingData()}
    </View>
  );
};

const styles = StyleSheet.create({
  parkingStatus: {
    height: "35%",
    width: "80%",
    alignItems: "center",
    backgroundColor: Colors.card.background,
    borderRadius: 12,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  BoxHeader: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 27,
    color: Colors.gray.zincDark,
  },
  refreshIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blue.logo,
  },
  parkingContent: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  statusParking: {
    flex: 3,
    flexDirection: "row",
    width: "100%",
  },
  dividerVertical: {
    width: 1,
    height: "60%",
    backgroundColor: Colors.border.medium,
    alignSelf: "center",
    marginHorizontal: 8,
  },
  freeParking: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numberFree: {
    fontFamily: "Roboto_700Bold",
    fontSize: 50,
    color: Colors.green[700],
  },
  labelFree: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    color: Colors.green[700],
    marginTop: -10,
  },
  usedParking: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numberUsed: {
    fontFamily: "Roboto_700Bold",
    fontSize: 50,
    color: Colors.red[500],
  },
  labelUsed: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    color: Colors.red[500],
    marginTop: -10,
  },
  detailsParking: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  iconDescriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconText: {
    fontSize: 12,
    marginLeft: 4,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default ParkingBox;
