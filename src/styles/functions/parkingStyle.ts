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
    color: Colors.red[500],
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.gray.zinc,
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
    borderColor: Colors.gray.zinc,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  radioOuterSelected: {
    borderColor: Colors.blue.logo,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.blue.logo,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.gray.zinc,
  },
  refreshButton: {
    backgroundColor: Colors.blue.logo,
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
    backgroundColor: Colors.gray.light,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    position: "relative",
  },
  itemNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.blue.logo,
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
    color: Colors.gray.dark,
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 13,
    color: Colors.gray.dark,
  },
  itemMainText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  detailColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailTitle: {
    fontWeight: "bold",
    color: Colors.gray[600],
    marginRight: 8,
  },
  detailValue: {
    color: Colors.gray.dark,
  },
  // Adicione ao final do seu arquivo de estilos
  listItemDeleted: {
    backgroundColor: Colors.gray[200],
    opacity: 0.7,
  },
  itemNumberDeleted: {
    color: Colors.gray[500],
  },
  itemMainTextDeleted: {
    color: Colors.gray[600],
    textDecorationLine: "line-through",
  },
  deletedMessageContainer: {
    paddingVertical: 8,
  },
  deletedMessage: {
    color: Colors.red[500],
    fontWeight: "bold",
    fontStyle: "italic",
  },
  deletedItem: {
    // Estilo para o container do item deletado
  },
});
