import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  historyContainer: {
    marginBottom: 5,
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue.primary,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: {
    fontSize: 14,
    color: Colors.white,
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '700',
  },
  historyAmount: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  historyDetails: {
    marginBottom: 8,
  },
  historyDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyDetailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  historyDetailValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  viewDetailsButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  viewDetailsButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  // Load More
  loadMoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.blue.primary,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '70%',
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  loadMoreButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
  },
  loadMoreButtonDisabled: {
    backgroundColor: Colors.gray[300],
  },
  loadMoreButtonTextDisabled: {
    color: Colors.gray[500],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 12,
  },

  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    width: '90%',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    color: Colors.text.secondary,
  },
  rowValue: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: Colors.white,
    fontWeight: '700',
  },
});