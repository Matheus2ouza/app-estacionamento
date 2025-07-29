// src/styles/functions/editAcccontStyle.ts
import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  input: {
    backgroundColor: Colors.white,
  },
  containerButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
    flex: 1,
  },
  button: {
    marginBottom: 10,
    width: "90%",
  },
  passwordHint: {
    fontSize: 12,
    color: Colors.gray.dark,
    marginTop: 4,
    marginLeft: 12,
    marginBottom: -15
  },
});