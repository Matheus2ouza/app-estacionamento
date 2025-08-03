import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  heroImage: {
    position: "absolute",
    top: 80,
    right: -270,
    width: "130%",
    height: "95%",
    transform: [{ scaleX: -1 }],
    resizeMode: "cover",
    opacity: 0.1,
    zIndex: -1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.blue.dark,
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.gray.dark,
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: Colors.blue.dark,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
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
    padding: 20,
  },
  errorText: {
    color: Colors.red[500],
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  retryText: {
    color: Colors.blue.dark,
    textDecorationLine: "underline",
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  dayButtonActive: {
    backgroundColor: Colors.green.successLight,
    borderColor: Colors.success,
  },
  dayButtonInactive: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray.medium,
  },
  dayButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.blue.dark,
  },
  dayButtonTextActive: {
    color: Colors.green.successDark,
  },
  dayCheckIcon: {
    position: 'absolute',
    top: -1,
    right: 0,
    backgroundColor: Colors.success,
    borderRadius: 22,
    width: 41,
    height: 41,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLabelContainer: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 10,
    color: Colors.gray.dark,
    textTransform: 'uppercase',
  },
  dayLabelActive: {
    color: Colors.green.successDark,
    fontWeight: 'bold',
  },
});
