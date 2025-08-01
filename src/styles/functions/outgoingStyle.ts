// outgoingStyle.ts
import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: 'transparent',
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Colors.shadow.md, // Usando a sombra média da paleta
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: "InterBold",
    fontWeight: 'bold',
    color: Colors.error,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  expenseCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    ...Colors.shadow.sm,
  },
  expenseContent: {
    flex: 1,
    marginRight: 12,
  },
  expenseDescription: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  expenseMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  expenseMethod: {
    fontSize: 13,
    fontFamily: "InterMedium",
    color: Colors.text.secondary,
    backgroundColor: Colors.gray.extraLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  expenseDate: {
    fontSize: 13,
    fontFamily: "InterRegular",
    color: Colors.text.secondary,
  },
  expenseAmountWrapper: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: "InterBold",
    color: Colors.error,
    marginBottom: 4,
  },
  expenseOperator: {
    fontSize: 13,
    fontFamily: "InterRegular",
    color: Colors.text.secondary,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: Colors.text.secondary,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: Colors.error,
    textAlign: "center",
    marginVertical: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: Colors.text.primary,
    marginTop: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    ...Colors.shadow.button, // Usando a sombra específica para botões
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: Colors.text.inverted,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Colors.shadow.floating, // Usando a sombra para elementos flutuantes
  },
});