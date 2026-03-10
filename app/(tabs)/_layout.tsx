import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { FontProvider } from '@/components/dashboard/FontContext';
import { AppearanceProvider, useAppearance } from '@/contexts/AppearanceContext';
import { Brain, CheckSquare, Home, Settings, User } from 'lucide-react-native';

function ContrastWrapper({ children }: { children: React.ReactNode }) {
  const { contrast } = useAppearance();
  const value = contrast / 100;
  const style =
    Platform.OS === 'web' && value !== 1
      ? { flex: 1 as const, filter: `contrast(${value})` }
      : { flex: 1 as const };
  return <View style={style}>{children}</View>;
}

function TabsWithAppearance() {
  const { fontSize, disableAnimations } = useAppearance();

  return (
    <FontProvider fontSize={fontSize}>
      <ContrastWrapper>
        <Tabs
          screenOptions={{
            animation: disableAnimations ? 'none' : undefined,
            tabBarActiveTintColor: '#3FA692',
            tabBarInactiveTintColor: '#94a3b8',
            headerShown: false,
            headerTitle: '',
            tabBarStyle: Platform.select({
              ios: {
                position: 'absolute',
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e2e8f0',
              },
              default: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e2e8f0',
              },
            }),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Dashboard',
              headerTitle: 'Dashboard',
              tabBarIcon: ({ color }) => <Home size={28} color={color} />,
            }}
          />
          <Tabs.Screen
            name="cognitive-panel"
            options={{
              title: 'Painel',
              tabBarIcon: ({ color }) => <Brain size={28} color={color} />,
            }}
          />
          <Tabs.Screen
            name="tasks"
            options={{
              title: 'Tarefas',
              tabBarIcon: ({ color }) => <CheckSquare size={28} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color }) => <User size={28} color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Ajustes',
              tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
            }}
          />
        </Tabs>
      </ContrastWrapper>
    </FontProvider>
  );
}

export default function TabLayout() {
  return (
    <AppearanceProvider>
      <TabsWithAppearance />
    </AppearanceProvider>
  );
}
