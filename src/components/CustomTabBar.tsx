import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Foundation, FontAwesome, MaterialIcons, Entypo, FontAwesome6  } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <LinearGradient
      colors={[Colors.gray.zinc, Colors.blue.light]}
      style={styles.bottomBar}
    >
      {state.routes.map((route, index) => {
        console.log('route.name:', route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Definir o ícone de cada rota
        let icon;
        switch (route.name) {
          case 'cashPanel':
            icon = <FontAwesome6 name="cash-register" size={30} color={Colors.white} />
            break;
          case 'detailsCash':
            icon = <FontAwesome name="dollar" size={30} color={Colors.white} />;
            break;
          case 'graphicsData':
            icon = <MaterialIcons name="insert-chart" size={30} color={Colors.white} />;
            break;
          case 'listData':
            icon = <Entypo name="list" size={30} color={Colors.white} />;
            break;
          default:
            icon = <FontAwesome name="circle" size={30} color={Colors.white} />;
        }


        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ opacity: isFocused ? 1 : 0.6 }}
          >
            {icon}
          </Pressable>
        );
      })}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    height: '12%',
    width: '100%',
    backgroundColor: Colors.gray.zinc,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.gray.medium,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 42,
    borderTopLeftRadius: 42,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});
