import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Cash Alert
  cashAlert: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  
  // Stats Section
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.blue.primary,
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: Colors.blue.primary,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    shadowColor: Colors.blue.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Toggle Container
  toggleContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  toggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },

  // Product List
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 0, // No padding bottom
  },
  
  // Product Card
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 6,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border.light,
    position: "relative",
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.blue.light,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.red[100],
  },
  deactivateButton: {
    backgroundColor: Colors.red[100],
  },
  activateButton: {
    backgroundColor: Colors.green[200],
  },
  // Estilos para produtos desativados
  deactivatedCard: {
    backgroundColor: Colors.red[50],
    borderColor: Colors.red[200],
    borderWidth: 2,
    opacity: 0.8,
    shadowColor: Colors.red[300],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  deactivatedProductName: {
    color: Colors.red[600],
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  deactivatedMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.orange[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.orange[200],
    gap: 6,
  },
  deactivatedMessage: {
    fontSize: 12,
    color: Colors.orange[700],
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  headerRightContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.white,
    textAlign: "center",
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 6,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  expirationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  expirationText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: 6,
  },

  // Floating Action Button Expansível
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 16,
    alignItems: "center",
  },
  fabMain: {
    zIndex: 3,
  },
  fabMainButton: {
    backgroundColor: Colors.blue.primary,
    width: 68,
    height: 68,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.blue.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabSecondary: {
    position: "absolute",
    bottom: 0,
    zIndex: 2,
  },
  fabSecondaryButton: {
    backgroundColor: Colors.green[500],
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 60,
    shadowColor: Colors.green[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: 64,
    height: 64,
  },
  fabSecondaryText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  emptyLink: {
    color: Colors.blue.primary,
    fontWeight: "600",
    fontSize: 16,
    textDecorationLine: "underline",
  },

  // Pagination Styles
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadMoreButton: {
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.blue.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 160,
  },
  loadMoreButtonDisabled: {
    backgroundColor: Colors.gray[300],
    shadowOpacity: 0.1,
    elevation: 2,
  },
  loadMoreButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  loadMoreButtonTextDisabled: {
    color: Colors.gray[500],
  },
});
