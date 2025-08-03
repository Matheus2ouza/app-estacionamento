import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.gray.dark,
  },
  value: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: Colors.gray.dark,
  },
});

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    color: Colors.gray.dark,
  },
  vehicleBadge: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  vehicleIconContainer: {
    backgroundColor: Colors.primary,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  plateText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 28,
    color: Colors.gray.dark,
    letterSpacing: 2,
    marginBottom: 4,
  },
  categoryText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.gray.medium,
    textTransform: 'uppercase',
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  infoSection: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray.light,
    marginVertical: 12,
  },
  durationSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  durationLabel: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 8,
  },
  durationValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: Colors.gray.darker,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
});