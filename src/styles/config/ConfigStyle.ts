import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    marginTop: 10,
    paddingBottom: 30, // margem inferior para o scroll
  },
  options: {
    flex: 1,
    alignItems: "center",
  },
  optionsRow: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    paddingVertical: 10,
  },
  label: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    color: Colors.blue.logo,
  },
  exit: {
    color: Colors.red[500],
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.gray[300],
    marginTop: 5,
  },
});
