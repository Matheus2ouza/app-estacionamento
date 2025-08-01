import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120, // Espaço para os botões flutuantes
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    color: Colors.blue.logo,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.white,
    marginBottom: 16,
    fontSize: 15,
  },
  roleMenu: {
    marginTop: 8,
  },
  passwordHint: {
    fontSize: 12,
    color: Colors.gray.dark,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'transparent'
  },
  saveButton: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteButton: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.red[500],
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: Colors.white,
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});