import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 90, // Espaço para o botão flutuante
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
    fontSize: 20,
    color: Colors.blue.logo,
    marginBottom: 12,
  },
  inputContainer: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    height: 48,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  saveButton: {
    width: '100%',
    borderRadius: 8,
    height: 48,
  },
});