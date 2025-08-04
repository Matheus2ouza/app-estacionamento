import { Tabs } from 'expo-router';
import CustomTabBar from '@/src/components/CustomTabBar';

export default function CashPanelTabsLayout() {
  return (
    <Tabs
      initialRouteName='cashPanel'
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="cashPanel" options={{ title: 'painel' }} />
      <Tabs.Screen name="detailsCash" options={{ title: 'detalhes' }} />
      <Tabs.Screen name="graphicsData" options={{ title: 'grafico' }} />
      <Tabs.Screen name="listData" options={{ title: 'lista' }} />
    </Tabs>
  );
}
