import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    color: Colors.blueLogo,
  },
  exit: {
    color: Colors.red
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.zincLight,
    marginTop: 5,
  },
});
