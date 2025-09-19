import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  options: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.blue[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  optionDescription: {
    maxWidth: "90%",
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.text.secondary,
  },
  optionArrow: {
    marginLeft: 8,
  },
  exitCard: {
    backgroundColor: Colors.red[50],
    borderColor: Colors.red[200],
  },
  exitIcon: {
    backgroundColor: Colors.red[100],
  },
  exitLabel: {
    color: Colors.red[600],
  },
  exitDescription: {
    color: Colors.red[500],
  },
});
