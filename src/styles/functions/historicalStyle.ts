import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  historicalRow: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
  },
  datahistorical: {
    width: "80%",
    paddingHorizontal: 15
  },
  mainData: {
    fontFamily: "Roboto_700Bold",
    fontSize: 24,
  },
  secondaryDatarow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginLeft: 8,
    gap: 3,
  },
  secondaryData: {
    width: "48%",
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  buttontwoway: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
    maxWidth: 60,
    flexShrink: 1,
  },
  buttonArea: {
    backgroundColor: Colors.blue.logo,
    borderRadius: 10,
    minWidth: 60,
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 18, // opcional para controlar espaçamento entre as linhas
  },
});
