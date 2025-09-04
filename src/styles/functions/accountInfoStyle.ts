import Colors from "@/src/constants/Colors";
import { TypographyThemes } from "@/src/constants/Fonts";
import { StyleSheet } from "react-native";

// Estilos para o container principal
export const containerStyles = StyleSheet.create({
  mainContainer: {
    flex: 1
  }
});

// Estilos principais
export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    ...TypographyThemes.inter.title,
    fontSize: 25,
  },
  employeeCard: {
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
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  employeeTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  employeeTitle: {
    ...TypographyThemes.poppins.title,
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
    textTransform: 'capitalize'
  },
  roleBadge: {
    backgroundColor: Colors.blue.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    ...TypographyThemes.inter.caption,
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: Colors.red[500],
  },
  employeeDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  detailLabel: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.text.secondary,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    ...TypographyThemes.openSans.body,
    color: Colors.text.primary,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
    fontSize: 14,
  },
  roleInfoContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  roleInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  roleInfoText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  permissionSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  permissionTitle: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.text.primary,
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 16,
  },
  permissionInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.blue[50],
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.blue[100],
  },
  permissionInfoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  permissionInfoContent: {
    flex: 1,
  },
  permissionInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blue[800],
    marginBottom: 4,
  },
  permissionInfoMessage: {
    fontSize: 13,
    color: Colors.blue[700],
    lineHeight: 18,
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

  // Estados de loading, erro e vazio
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
  },
  emptyMessage: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  employeesList: {
    paddingBottom: 40,
  },
});
