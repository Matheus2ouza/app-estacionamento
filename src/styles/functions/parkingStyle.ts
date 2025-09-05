import Colors from "@/src/constants/Colors";
import { Fonts, TypographyThemes } from "@/src/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    margin: 10,
    flexGrow: 1,
    paddingBottom: 20,
  },
  unifiedSection: {
    backgroundColor: Colors.whiteSemiTransparent,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    flex: 1,
  },
  statusContainer: {
    paddingBottom: 15,
  },
  statusTitle: {
    ...TypographyThemes.poppins.subtitle,
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  percentageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontSize: 64,
    fontFamily: Fonts.MontserratBold,
    fontWeight: "700",
    marginTop: -10,
  },
  statusLabel: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    fontSize: 16,
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.gray.light,
    marginVertical: 20,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: "transparent",
    minHeight: 200,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.whiteSemiTransparent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    color: Colors.blue.primary,
    marginRight: 16,
    minWidth: 32,
    textAlign: "center",
    backgroundColor: Colors.blue.light,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  itemData: {
    flex: 1,
  },
  itemPlate: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsSemiBold,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    backgroundColor: Colors.whiteSemiTransparent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.shadow.light,
  },
  detailLabel: {
    ...TypographyThemes.nunito.caption,
    color: Colors.text.secondary,
    fontSize: 11,
    marginBottom: 2,
  },
  detailValue: {
    ...TypographyThemes.openSans.bodySmall,
    color: Colors.text.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    ...TypographyThemes.nunito.body,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 12,
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
});