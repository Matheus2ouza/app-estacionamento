import Colors from "@/src/constants/Colors";
import { StyleSheet, View, ViewStyle } from "react-native";

type SeparatorProps = {
  marginTop?: number;
  marginBottom?: number;
  style?: ViewStyle;
  width?: string | number
};

export default function Separator({
  marginTop,
  marginBottom,
  style,
  width = "100%",
}: SeparatorProps) {
  return (
    <View
      style={[
        styles.separator,
        { marginTop, marginBottom },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 2,
    backgroundColor: Colors.gray.medium,
  },
});
