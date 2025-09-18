import Colors from "@/constants/Colors";
import { TypographyThemes } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const disabledMethodStyles = StyleSheet.create({
  methodCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    opacity: 0.8,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  methodTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  methodTitle: {
    ...TypographyThemes.poppins.title,
    fontSize: 18,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.gray[300],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    ...TypographyThemes.inter.caption,
    color: Colors.gray[600],
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.gray[400],
  },
  statusBadge: {
    backgroundColor: Colors.red[100],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: Colors.red[200],
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusIcon: {
    marginRight: 4
  },
  statusText: {
    color: Colors.red[700],
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  activateButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.green[200]
  },
  activateIcon: {
    color: Colors.green[500]
  },
  methodDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.gray[500],
    flex: 1,
  },
  detailValue: {
    ...TypographyThemes.openSans.body,
    color: Colors.gray[500],
    fontWeight: '500',
  },
  pricingSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  pricingTitle: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.gray[600],
    marginBottom: 8,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleIcon: {
    width: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  vehicleLabel: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.gray[500],
    marginLeft: 8
  },
  priceValue: {
    ...TypographyThemes.poppins.body,
    color: Colors.gray[500],
    fontWeight: '600',
    marginLeft: 'auto',
  },
  disabledInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.orange[50],
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.orange[200]
  },
  disabledInfoIcon: {
    backgroundColor: Colors.orange[100],
    borderRadius: 20,
    padding: 8,
    marginRight: 12
  },
  disabledInfoContent: {
    flex: 1
  },
  disabledInfoTitle: {
    color: Colors.orange[800],
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2
  },
  disabledInfoMessage: {
    color: Colors.orange[700],
    fontSize: 13,
    lineHeight: 18
  }
});

export const activeMethodStyles = StyleSheet.create({
  vehicleLabel: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.text.secondary,
    marginLeft: 8
  }
});

export const containerStyles = StyleSheet.create({
  mainContainer: {
    flex: 1
  }
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 16,
  },
  header: {
    ...TypographyThemes.inter.title,
    fontSize: 25,
  },
  title: {
    ...TypographyThemes.poppins.title,
    marginBottom: 10,
    color: Colors.blue.logo,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray[500],
    marginVertical: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue.logo,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  methodLabel: {
    ...TypographyThemes.inter.subtitle,
    marginTop: 10,
    color: "#333",
  },
  methodDetail: {
    ...TypographyThemes.openSans.body,
    color: "#555",
    marginTop: 4,
  },
  vehicleSection: {
    marginTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[500],
  },
  vehicleLabel: {
    ...TypographyThemes.inter.subtitle,
    marginBottom: 6,
    color: Colors.blue.light,
  },
  inputDetail: {
    ...TypographyThemes.nunito.bodySmall,
    color: "#444",
    marginLeft: 8,
    marginBottom: 2,
  },
  noConfigText: {
    ...TypographyThemes.nunito.body,
    marginTop: 20,
    color: "#999",
    textAlign: "center",
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  methodTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  methodTitle: {
    ...TypographyThemes.poppins.title,
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.blue.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    ...TypographyThemes.inter.caption,
    color: Colors.gray[100],
    fontSize: 12,
  },
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
  methodDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.text.secondary,
    flex: 1,
  },
  detailValue: {
    ...TypographyThemes.openSans.body,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  pricingSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  pricingTitle: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.text.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleIcon: {
    width: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  priceValue: {
    ...TypographyThemes.poppins.body,
    color: Colors.green[600],
    fontWeight: '600',
    marginLeft: 'auto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorTitle: {
    ...TypographyThemes.poppins.title,
    color: Colors.red[600],
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    ...TypographyThemes.poppins.button,
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    ...TypographyThemes.poppins.title,
    color: Colors.text.secondary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  methodsList: {
    paddingBottom: 40,
  },
});
