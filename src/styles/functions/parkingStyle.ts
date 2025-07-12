import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    height: "22%",
    width: "100%",
  },
  statusPatio: {
    width: "100%",
    padding: 10,
    alignItems: "center",
  },
  percentage: {
    fontSize: 60,
    fontFamily: "Montserrat_700Bold",
    color: Colors.red,
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.zincLight,
  },
  body: {
    height: "78%",
    width: "100%",
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "column",
    gap: 10,
  },
  searchInput: {
    width: "100%",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginLeft: 5,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.zinc,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  radioOuterSelected: {
    borderColor: Colors.blueLogo,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.blueLogo,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.zinc,
  },
  refreshButton: {
    backgroundColor: Colors.blueLogo,
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  list: {
    marginTop: 5,
    backgroundColor: "transparent",
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.zincLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    position: "relative",
  },
  itemNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.blueLogo,
    marginRight: 15,
    minWidth: 30,
    textAlign: "center",
  },
  itemData: {
    flex: 1,
  },
  itemPlate: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.darkGray,
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 13,
    color: Colors.darkGray,
  },
});
