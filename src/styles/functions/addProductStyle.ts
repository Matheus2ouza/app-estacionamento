import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.blueLogo,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    shadowColor: "rgb(0000.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.gray,
    marginLeft: 10
  }, 
  addButton: {
    backgroundColor: Colors.blueLight,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  smallInput: {
    flex: 1,
  },
});
