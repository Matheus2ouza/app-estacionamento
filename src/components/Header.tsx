import Colors from "@/src/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface HeaderProps {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onBackPress?: () => void;
}

export default function Header({
  title,
  containerStyle,
  rowStyle,
  iconStyle,
  titleStyle,
  onBackPress,
}: HeaderProps) {
  return (
    <LinearGradient
      colors={[Colors.gray.zinc, Colors.blue.light]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, containerStyle]}
    >
      <View style={[styles.headerRow, rowStyle]}>
        <Pressable onPress={onBackPress ? onBackPress : () => router.back()}>
          <AntDesign
            name="left"
            size={24}
            color={Colors.white}
            style={[{ transform: [{ scaleY: 1.7 }] }, iconStyle]}
          />
        </Pressable>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    height: 120,
    justifyContent: "flex-start",
    borderBottomRightRadius: 85,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    gap: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.gray[50],
    textTransform: "uppercase",
  },
});
