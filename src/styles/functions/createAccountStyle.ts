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
    paddingBottom: 100,
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
  },
  roleMenu: {
    marginTop: 8,
    backgroundColor: Colors.white
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  createButton: {
    width: "100%",
    borderRadius: 8,
  },
});