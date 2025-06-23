import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  search: {
    marginBottom: 16,
  },
  searchInput: {
    width: "100%",
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 5,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: 5,
    gap: 12,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioOuterSelected: {
    borderColor: Colors.blueLogo,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.blueLogo,
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
  searchBody: {
    alignItems: 'center',
    marginTop: 10,
    gap: 10
  },  
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.zincLight,
    marginTop: 5,
  },
  searchDataRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%'
  },
  main: {
    fontFamily: "Roboto_500Medium",
    fontSize: 24,
    marginLeft: 5
  },
  information: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',

  },
  informationColumn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  informationTitle: {
    fontWeight: '700',
    fontSize: 15
  },
  informationValue: {
    fontSize: 13
  },
});
