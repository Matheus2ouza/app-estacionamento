import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchBody: {
    height: "80%",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    width: "100%",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.gray.light,
    marginTop: 5,
  },
  searchDataRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "#f2f2f2",
    paddingVertical: 5,
    gap: 5,
  },
  main: {
    fontFamily: "Roboto_500Medium",
    fontSize: 25,
    color: "#000",
    marginLeft: 15,
    textTransform: "uppercase",
    flex: 1,
    flexShrink: 1,
  },
  information: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
  },
  informationColumn: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: 20,
  },
  informationValue: {
    fontSize: 15,
  },
  rowHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue.logo,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  optionsMenu: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    gap: 5,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  menuAnchor: {
    padding: 0,
    alignSelf: "flex-end",
  },
});
