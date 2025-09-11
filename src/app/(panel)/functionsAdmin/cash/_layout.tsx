import Colors from '@/src/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CashLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: Colors.background.quaternary,
          height: 120,
          paddingHorizontal: 10,
          paddingBottom: 0,
          paddingTop: 20,
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[Colors.gray.zinc, Colors.blue.light]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flex: 1,
              backgroundColor: Colors.background.quaternary,
              borderTopRightRadius: 42,
              borderTopLeftRadius: 42,
              elevation: 8,
            }}
          />
        ),
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: 50,
          height: 60,
          borderRadius: 5,
          marginTop: 20,
        },
      }}
    >
      <Tabs.Screen 
        name="CashScreen" 
        options={{ 
          title: 'Caixa',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 55,
              height: 60,
              backgroundColor: Colors.button.success,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons 
                name="point-of-sale" 
                size={40} 
                color={Colors.text.inverse} 
              />
            </View>
          ),
        }} 
      />
      <Tabs.Screen 
        name="HistoryScreen" 
        options={{ 
          title: 'Histórico',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 55,
              height: 60,
              backgroundColor: Colors.button.danger,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons 
                name="history" 
                size={40} 
                color={Colors.text.inverse} 
              />
            </View>
          ),
        }} 
      />
      <Tabs.Screen 
        name="ChartsScreen" 
        options={{
          title: 'Gráficos',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 55,
              height: 60,
              backgroundColor: Colors.button.primary,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons 
                name="bar-chart" 
                size={40} 
                color={Colors.text.inverse} 
              />
            </View>
          ),
        }} 
      />
      <Tabs.Screen 
        name="SettingsScreen" 
        options={{ 
          title: 'Configurações',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 55,
              height: 60,
              backgroundColor: Colors.button.warning,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons 
                name="settings" 
                size={40} 
                color={Colors.text.inverse} 
              />
            </View>
          ),
        }} 
      />
    </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: Colors.background.quaternary,
  },
});