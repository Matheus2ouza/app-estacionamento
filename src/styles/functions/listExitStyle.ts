import Colors from "@/src/constants/Colors";
import { Fonts, TypographyThemes } from "@/src/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingMoreText: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    marginLeft: 8,
    fontSize: 14,
  },
  loadMoreButton: {
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  loadMoreButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadMoreButtonDisabled: {
    backgroundColor: Colors.gray[300],
    opacity: 0.6,
  },
  loadMoreButtonTextDisabled: {
    color: Colors.gray[500],
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.whiteSemiTransparent,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue.primary,
  },
  itemNumber: {
    fontSize: 24,
    fontFamily: Fonts.MontserratBold,
    fontWeight: "700",
    color: Colors.gray[100],
    marginRight: 16,
    minWidth: 40,
    textAlign: "center",
    backgroundColor: Colors.blue.light,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  itemData: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mainDataContainer: {
    flex: 1,
    marginRight: 16,
  },
  mainDataLabel: {
    ...TypographyThemes.nunito.caption,
    color: Colors.text.secondary,
    fontSize: 11,
    marginBottom: 1,
  },
  mainDataValue: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    ...TypographyThemes.nunito.caption,
    color: Colors.text.secondary,
    fontSize: 11,
    marginBottom: 1,
  },
  timeValue: {
    ...TypographyThemes.openSans.bodySmall,
    color: Colors.blue.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.blue.light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.blue.primary,
  },
  detailsButtonText: {
    ...TypographyThemes.nunito.body,
    color: Colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyStateContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
  },
  emptyStateSubtext: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    marginTop: 12,
  },
  // Estilos para veículos deletados
  listItemDeleted: {
    backgroundColor: Colors.gray[50],
    borderLeftColor: Colors.gray[400],
    opacity: 0.7,
  },
  itemNumberDeleted: {
    backgroundColor: Colors.gray[300],
    color: Colors.gray[600],
  },
  mainDataLabelDeleted: {
    color: Colors.gray[500],
  },
  mainDataValueDeleted: {
    color: Colors.gray[600],
  },
  timeLabelDeleted: {
    color: Colors.gray[500],
  },
  timeValueDeleted: {
    color: Colors.red[500],
  },
  detailsButtonDeleted: {
    backgroundColor: Colors.gray[200],
    borderColor: Colors.gray[400],
  },
  detailsButtonTextDeleted: {
    color: Colors.gray[600],
  },
});