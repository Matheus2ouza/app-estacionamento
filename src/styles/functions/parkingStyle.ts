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
  // Novo container para o botão de refresh
  refreshContainer: {
    alignItems: "flex-end", // Alinha o botão à direita
    marginTop: 8, // Espaço entre o input e o botão
  },
  // Botão de refresh
  refreshButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  // Ícone de refresh
  refreshIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blueLogo,
  },
  searchInput: {
    width: "100%",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: 5,
    gap: 10,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 5,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioOuterSelected: {
    borderColor: Colors.blueLogo,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.blueLogo,
  },
  radioLabel: {
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
  },
  inlineRadioContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 5,
    gap: 5,
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
    alignItems: "flex-start", // importante: muda de 'center' para 'flex-start'
    backgroundColor: Colors.zincLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    position: "relative", // necessário para o posicionamento absoluto do menu
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
    flexWrap: 'wrap',
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 13,
    color: Colors.darkGray,
  },
  menuButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 10, // garante que fique acima de outros elementos
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // alinhamento no topo das colunas
    width: "100%",
    padding: 5,
  },
  number: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 40,
    marginRight: 10,
    width: 50, // espaço fixo para coluna 1
    textAlign: "center",
  },
  data: {
    flex: 1, // ocupa o máximo de espaço possível na segunda coluna
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 8, // deixa os dados mais para baixo em relação a número e menu
  },
  placa: {
    fontFamily: "Roboto_500Medium",
    fontSize: 30,
  },
  details: {
    flexDirection: "row",
    marginTop: 5,
    gap: 20,
  },
  detailsLabel: {
    color: Colors.darkGray,
  },
  menuAnchor: {
    marginTop: 0, // pode ajustar para alinhar com o número (ex: -2, 0, 2)
    width: 40, // largura fixa para o ícone da terceira coluna
    marginLeft: 10,
  },
});
