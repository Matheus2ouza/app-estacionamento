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
  containerStyle?: StyleProp<ViewStyle>; // LinearGradient
  rowStyle?: StyleProp<ViewStyle>;       // headerRow
  iconStyle?: StyleProp<TextStyle>;      // ícone -> tipo correto!
  titleStyle?: StyleProp<TextStyle>;     // texto
}

export default function Header({
  title,
  containerStyle,
  rowStyle,
  iconStyle,
  titleStyle,
}: HeaderProps) {
  return (
    <LinearGradient
      colors={[Colors.gray.zinc, Colors.blue.light]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, containerStyle]}
    >
      <View style={[styles.headerRow, rowStyle]}>
        <Pressable onPress={() => router.back()}>
          <AntDesign
            name="left"
            size={24}
            color={Colors.white}
            style={[{ transform: [{ scaleY: 1.7 }] }, iconStyle]}
          />
        </Pressable>
        <Text 
          style={[styles.title, titleStyle]}
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.8}
        >
          {title}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    height: 120,
    justifyContent: "center",
    borderBottomRightRadius: 85,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.white,
    textTransform: "uppercase",
    flex: 1,
    flexShrink: 1,
  },
});
