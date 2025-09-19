import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  photo: {
    width: '35%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray.dark,
    marginTop: 15,
    borderRadius: 10
  },
  letra: {
    fontSize: 95,
    fontFamily: "Montserrat_700Bold",
    color: Colors.text.inverse
  },
  datas: {
    width: '90%',
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  datasColumn: {
    width: '42%',
    paddingVertical: 15
  },
  informationTitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16
  },
  informationValue: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 19,
    marginLeft: 5
  },
  Button: {
    width: '90%',
    marginBottom: 10
  }
});