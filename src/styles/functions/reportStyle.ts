import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  
  // Header do Relatório
  reportHeader: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  reportIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.blue[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  reportHeaderText: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  pdfButton: {
    backgroundColor: Colors.blue.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  pdfButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Seções
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },

  // Grid de Resumo
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "48%",
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },

  // Grid de Transações
  transactionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionCard: {
    flex: 1,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  transactionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
  transactionValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },

  // Gráficos
  chartsContainer: {
    gap: 16,
  },
  chartCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 16,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 8,
  },
  chartImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },

  // Caixas - Resumo
  cashRegisterSummaryCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cashRegisterSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cashRegisterSummaryInfo: {
    flex: 1,
  },
  cashRegisterSummaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cashRegisterSummaryOperator: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  cashRegisterSummaryDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  cashRegisterSummaryProfit: {
    fontSize: 14,
    color: Colors.green[600],
    fontWeight: "600",
    marginTop: 4,
  },
  cashRegisterSummaryTime: {
    fontSize: 12,
    color: Colors.blue[600],
    fontWeight: "500",
    marginTop: 2,
  },
  cashRegisterSummaryStatus: {
    marginLeft: 16,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blue[50],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.blue[200],
  },
  detailsButtonText: {
    fontSize: 14,
    color: Colors.blue.primary,
    fontWeight: "600",
    marginLeft: 6,
  },

  // Caixas - Detalhes (mantido para compatibilidade)
  cashRegisterCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cashRegisterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cashRegisterInfo: {
    flex: 1,
  },
  cashRegisterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cashRegisterOperator: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cashRegisterStatus: {
    marginLeft: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cashRegisterDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: "600",
  },

  // Transações Detalhadas
  transactionsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  transactionItem: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.blue.primary,
    backgroundColor: Colors.blue[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionPlate: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  transactionCategory: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.green[600],
  },
  transactionMethod: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  transactionItemDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingLeft: 16,
  },
  itemName: {
    fontSize: 12,
    color: Colors.text.primary,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
