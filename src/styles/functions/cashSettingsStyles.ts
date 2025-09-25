import Colors from "@/constants/Colors";
import { TypographyThemes } from "@/constants/Fonts";
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
    gap: 16,
    paddingBottom: 20,
  },
  infoContainer: {
    marginTop: 5,
    padding: 20,
    backgroundColor: Colors.blue.primary,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.blue.light,
    shadowColor: Colors.blue.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  infoTitle: {
    ...TypographyThemes.poppins.subtitle,
    fontWeight: '700',
    color: Colors.white,
  },
  infoDescription: {
    ...TypographyThemes.nunito.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    shadowColor: Colors.shadow.light,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.blue.light,
  },
  label: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statusOpen: {
    color: Colors.icon.success,
  },
  statusClosed: {
    color: Colors.icon.error,
  },
  statusNotCreated: {
    color: Colors.text.secondary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border.success,
    backgroundColor: Colors.green[50],
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadgeClosed: {
    borderColor: Colors.border.error,
    backgroundColor: Colors.red[50],
  },
  statusBadgeNeutral: {
    borderColor: Colors.border.medium,
    backgroundColor: Colors.background.secondary,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  spacerSm: {
    height: 12,
  },
  spacerMd: {
    height: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: Colors.shadow.light,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  actionText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});