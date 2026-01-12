import { Tabs } from 'expo-router';
import React from 'react';
import { ShoppingCart, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2ecc71',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Liste',
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
