import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 28,
    marginBottom: 10,
    color: Colors.blueLogo,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
    width: "50%",
  },

  numericInput: {
    width: 50,
    height: 40,
    fontSize: 19,
    textAlign: "left", 
    textAlignVertical: "top", 
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    borderColor: Colors.zincDark,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  button: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButton: {
    width: "90%",
  },
});
