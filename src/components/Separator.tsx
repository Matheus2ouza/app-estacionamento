import Colors from "@/constants/Colors";
import { DimensionValue, StyleSheet, View, ViewStyle } from "react-native";

type SeparatorProps = {
  marginTop?: number;
  marginBottom?: number;
  style?: ViewStyle;
  width?: DimensionValue;
  color?: string;
};

export default function Separator({
  marginTop,
  marginBottom,
  style,
  width = "100%",
  color,
}: SeparatorProps) {
  return (
    <View
      style={[
        styles.separator,
        { marginTop, marginBottom, width },
        color && { backgroundColor: color },
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
