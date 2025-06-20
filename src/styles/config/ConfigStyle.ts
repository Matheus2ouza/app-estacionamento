import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  options: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 10,
  },
  optionsRow: {
    width: "90%",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    marginTop: 5,
    paddingVertical: 10
  },
  label: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    color: Colors.blueLogo
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: Colors.zincLight,
    marginTop: 5,
  },
});
