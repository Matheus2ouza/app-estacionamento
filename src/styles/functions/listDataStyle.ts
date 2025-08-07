import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 20,
  },
  errorText: {
    color: Colors.red[500],
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.blue.logo,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    gap: 10,
  },
  dropdownWrapper: {
    zIndex: 1000,
  },
  dropdown: {
    borderColor: Colors.gray.light,
    backgroundColor: Colors.white,
  },
  dropdownContainer: {
    borderColor: Colors.gray.light,
    backgroundColor: Colors.white,
  },
  dropdownText: {
    color: Colors.blue.dark,
    fontSize: 14,
  },
  body: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: Colors.gray.dark,
    fontSize: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    marginTop: 4,
    color: Colors.gray.light,
    fontSize: 14,
  },
  transactionWrapper: {
    marginBottom: 15,
  },
  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.gray.lightGray,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mainDataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mainData: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.blue.dark,
  },
  transactionTypeBadge: {
    backgroundColor: Colors.blue.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.blue.dark,
    textTransform: "uppercase",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  detailCell: {
    width: "48%", // Para criar um grid 2x2
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.gray.dark,
  },
  productListContainer: {
    width: "100%",
    marginTop: 8,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  productBullet: {
    color: Colors.blue.dark,
    marginRight: 6,
  },
  productName: {
    fontSize: 13,
    color: Colors.gray.dark,
    flexShrink: 1,
  },
  productSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  productSectionTitle: {
    fontSize: 14,
    color: Colors.blue.dark,
    marginLeft: 6,
    fontWeight: "500",
  },
  blockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  blockedText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: Colors.orange[500],
    textAlign: "center",
  },
  blockedSubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    color: Colors.gray.zinc,
  },
});
