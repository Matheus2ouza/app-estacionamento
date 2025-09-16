import Colors from "@/src/constants/Colors";
import { Fonts } from "@/src/constants/Fonts";
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.Roboto_700Bold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.RobotoRegular,
    color: Colors.text.secondary,
  },
  countersContainer: {
    marginBottom: 24,
  },
  countersTitle: {
    fontSize: 18,
    fontFamily: Fonts.Roboto_700Bold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  countersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  counterCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counterNumber: {
    fontSize: 24,
    fontFamily: Fonts.Roboto_700Bold,
    color: Colors.blue.primary,
    marginBottom: 4,
  },
  counterLabel: {
    fontSize: 12,
    fontFamily: Fonts.RobotoMedium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  historyContainer: {
    marginBottom: 24,
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
    fontFamily: Fonts.Roboto_700Bold,
    color: Colors.white,
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  historyAmount: {
    fontSize: 16,
    fontFamily: Fonts.Roboto_700Bold,
    color: Colors.text.primary,
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
    fontFamily: Fonts.RobotoRegular,
    color: Colors.text.secondary,
  },
  historyDetailValue: {
    fontSize: 14,
    fontFamily: Fonts.RobotoMedium,
    color: Colors.text.primary,
  },
  historyMethod: {
    fontSize: 12,
    fontFamily: Fonts.RobotoMedium,
    color: Colors.text.secondary,
    textAlign: 'right',
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
    fontFamily: Fonts.Roboto_700Bold,
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: Fonts.RobotoRegular,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.RobotoRegular,
    color: Colors.text.secondary,
    marginTop: 12,
  },
  loadMoreContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  loadMoreButtonDisabled: {
    backgroundColor: Colors.gray[300],
    opacity: 0.6,
  },
  loadMoreButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.Roboto_700Bold,
  },
  loadMoreButtonTextDisabled: {
    color: Colors.gray[500],
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  operatorText: {
    fontSize: 12,
    fontFamily: Fonts.RobotoRegular,
    color: Colors.text.secondary,
    flex: 1,
  },
});