import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  formInputs: {
    gap: 16,
  },
  input: {
    width: "100%",
  },
  modelOptions: {
    marginTop: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  modelOptionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
modelButton: {
  flex: 1, // Faz cada botão ocupar o máximo de espaço disponível
  alignItems: "center",
  borderWidth: 1,
  backgroundColor: Colors.white,
  borderColor: "#000",
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 4,
},
  modelButtonSelected: {
    backgroundColor: "#002B4B",
    borderColor: "#002B4B",
  },
  modelButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: 'Roboto_500Medium'
  },
  modelButtonTextSelected: {
    color: "#FFF",
  },
  buttonContainer: {
  marginTop: 'auto',
  marginBottom: 15,
  alignItems: 'center',
  width: '100%'
  },
  buttonConfirm: {
    width: '100%'
  },
});
