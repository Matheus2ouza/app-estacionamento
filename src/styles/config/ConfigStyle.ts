import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 10,
    paddingBottom: 30,
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
    marginTop: 10,
    paddingVertical: 10,
  },
  label: {
    fontFamily: "Roboto_500Medium",
    fontSize: 19,
    color: Colors.blue.logo,
  },
  exit: {
    color: Colors.red[500]
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.blue.dark,
    opacity: 0.5,
    marginTop: 5,
  },
});
