import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    backgroundColor: Colors.zinc,
    height: 120,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomRightRadius: 70,
    paddingHorizontal: 10,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  brandMain: {
    fontSize: 35,
    fontWeight: "bold",
    color: Colors.lightGray,
    textTransform: "uppercase",
    marginRight: 5,
  },
  brandSub: {
    fontSize: 21,
    color: Colors.lightGray,
    marginBottom: 5,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.zinc,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10, // Para alinhar com o texto
  },
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between", // Isso empurra o bottomBar para o final
    alignItems: "center",
  },
  cashBox: {
    height: "35%",
    width: "80%",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginTop: 10,

    borderRadius: 12,

    // Sombras para iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Sombra para Android
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
  },
  refreshIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blueLogo,
  },
  cashContent: {
    width: "90%",
    marginHorizontal: 6,
    flex: 1, 
    justifyContent: "space-around", 
  },
  cashRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  cashLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.black,
  },
  cashValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.mediumGray,
    marginHorizontal: 10,
  },
  parkingStatus: {
    height: "35%",
    width: "80%",
    alignItems: "center",
    backgroundColor: Colors.white,

    borderRadius: 12,

    // Sombras para iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Sombra para Android
    elevation: 4,
  },
  parkingContent: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  statusParking: {
    flex: 3,
    flexDirection: "row", // Lado a lado
    width: "100%",
  },
  dividerVertical: {
    width: 1,
    height: "60%", // altura proporcional ao container
    backgroundColor: Colors.mediumGray,
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
    color: Colors.greenDark,
  },
  labelFree: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    color: Colors.greenDark,
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
    color: Colors.red,
  },
  labelUsed: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    color: Colors.red,
    marginTop: -10,
  },
  detailsParking: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },

  iconDescriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  iconText: {
    fontSize: 12,
    marginLeft: 4,
  },
  bottomBar: {
    height: "16%",
    width: "100%",
    backgroundColor: Colors.zinc,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: Colors.mediumGray,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 42,
    borderTopLeftRadius: 42,
    elevation: 8, // sombra Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  buttonEntry: {
    width: 50,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.buttongreen,
  },
  buttonExit: {
    width: 50,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.buttonRed,
  },
  buttonPatio: {
    width: 50,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.buttonBlue,
  },
  buttonDashboard: {
    width: 50,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.buttonOrange,
  },
});
