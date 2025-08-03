import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundImage: {
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
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 10,
    minHeight: "100%",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    color: Colors.blue.logo,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: Colors.gray.dark,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButtons: {
    flexDirection: "row",
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: Colors.white,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.blue.logo,
    borderColor: Colors.blue.logo,
  },
  categoryButtonText: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: Colors.gray.dark,
  },
  categoryButtonTextSelected: {
    color: Colors.white,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  historyButtonContainer: {
    alignSelf: 'flex-start', // Alinha o botão à esquerda
    marginTop: 25,
  },
  footer: {
    width: "100%",
    marginTop: 16,
  },
  buttonAtt: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonDelete: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.red[500],
    marginBottom: 12,
  },
  buttonReactivate: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.green[500],
    marginBottom: 12,
  },
  buttonSecondTicket: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.orange[500],
    marginBottom: 12,
  },
});

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    color: Colors.blue.logo,
  },
  closeButton: {
    backgroundColor: Colors.blue.logo,
    borderRadius: 20,
    padding: 5,
  },
  historyContent: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  historyText: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: Colors.gray.dark,
    lineHeight: 20,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.blue.logo,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  historyButtonText: {
    color: Colors.white,
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
  },
});
