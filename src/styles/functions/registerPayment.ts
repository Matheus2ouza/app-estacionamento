import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  data: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  column: {
    width: "48%",
  },
  dataItem: {
    marginBottom: 20,
  },
  informationTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: "#616161",
    marginBottom: 4,
  },
  informationValue: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: "#212121",
  },
  input: {
    backgroundColor: "white",
    fontSize: 16,
    height: 50,
  },
  dropDown: {
    backgroundColor: "white",
    borderRadius: 4,
    marginTop: 25,
  },
  dropDownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropDownItemText: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
  dropDownItemSelectedText: {
    fontFamily: "Roboto_500Medium",
    color: "#3F51B5",
  },
  dropDownItemSelected: {
    backgroundColor: "#EDE7F6",
  },
  Button: {
    width: "100%",
    marginTop: 16,
  },
});