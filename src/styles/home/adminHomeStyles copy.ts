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
    alignItems: "center",
    backgroundColor: Colors.yellow
  },
  cashData: {
    alignItems: "center",
    height: 250,
    width: "90%",
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
  cashDataHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: Colors.mediumGray,
  },
  cashFont: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 25,
  },
  refreshIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blueLogo,
  },
  cashDataBody: {
    width: "90%",
    paddingVertical: 5,
  },
  cashDataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  values: {
    fontFamily: "Roboto_500Medium",
  },
  separatorBar: {
    height: 2,
    backgroundColor: Colors.zincLight,
    borderRadius: 4,
    marginTop: 2,
    marginBottom: 4,
  },
  statusPatio: {
    alignItems: "center",
    height: 200,
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 50,
    overflow: "hidden",

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
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: Colors.mediumGray,
  },
  statusFont: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 25,
  },
  statusBody: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    backgroundColor: Colors.white,
    paddingVertical: 10,
  },
  statusColumnFree: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusColumnClose: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  statusNumberFree: {
    fontSize: 55,
    fontWeight: "bold",
    color: Colors.green,
    marginTop: -35,
  },
  statusLabelFree: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.green,
    marginTop: -15,
  },
  statusNumberClose: {
    fontSize: 55,
    fontWeight: "bold",
    color: Colors.red, // cor que representa em uso
    marginTop: -25,
  },
  statusLabelClose: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.red,
    marginTop: -15,
  },
  descriptionCloseRowHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    width: "80%",
  },
  iconDescriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  iconText: {
    fontSize: 12,
    marginLeft: 4,
  },
  statusDivider: {
    width: 1,
    backgroundColor: Colors.mediumGray,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
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
    width: 60,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.buttongreen,
  },
  buttonExit: {
    width: 60,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.buttonRed,
  },
  buttonPatio: {
    width: 60,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.buttonBlue,
  },
  buttonDashboard: {
    width: 60,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.buttonOrange,
  },
});
