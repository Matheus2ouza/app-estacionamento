import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center'
  },
  data: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  dataColumn: {
    width: '49%',
    paddingVertical: 15
  },
  informationTitle: {
    fontFamily: 'Roboto_300Light',
    fontSize: 15
  },
  informationValue: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 19,
    marginLeft: 5
  },
  input: {
  backgroundColor: "transparent",
  fontSize: 18,
  height: 40,
  width: 150,
  paddingHorizontal: 0,
  },
  menu: {
    marginTop: 30
  },
  Button: {
    width: '90%',
    marginBottom: 10
  }
});