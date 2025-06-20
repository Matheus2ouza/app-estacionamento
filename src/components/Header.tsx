import Colors from '@/src/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <LinearGradient
      colors={[Colors.zinc, Colors.blueLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <AntDesign
            name="left"
            size={24}
            color={Colors.white}
            style={{ transform: [{ scaleY: 1.5 }] }}
          />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    height: 120,
    justifyContent: 'flex-start',
    borderBottomRightRadius: 85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.lightGray,
    textTransform: 'uppercase',
  },
});
