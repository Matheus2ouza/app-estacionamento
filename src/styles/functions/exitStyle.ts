import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  search: {
    marginBottom: 16,
  },
  searchInput: {
    width: "100%",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: 5,
    gap: 12,
    marginBottom: 10,
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
    borderColor: Colors.blue.logo,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.blue.logo,
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
  searchBody: {
    flex: 1, // Ocupa todo o espaço restante
    width: '100%',
    marginTop: 10,
  },  
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.gray.light,
    marginTop: 5,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1, // Ocupa todo o espaço vertical disponível
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1, // Garante que o conteúdo pode crescer
    paddingBottom: 20,
  },
  searchDataRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: Colors.gray.light,
    borderRadius: 10,
    padding: 15,
    width: '100%',
  },
  main: {
    fontFamily: "Roboto_500Medium",
    fontSize: 24,
    marginLeft: 5,
    marginBottom: 8,
    color: Colors.gray.dark,
  },
  information: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  informationColumn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
  },
  informationTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: Colors.gray.dark,
  },
  informationValue: {
    fontSize: 13,
    color: Colors.gray.dark,
  },
  refreshButton: {
    backgroundColor: Colors.blue.logo,
    padding: 8,
    borderRadius: 8,
    marginLeft: 'auto',
  },
});