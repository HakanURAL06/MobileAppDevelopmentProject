import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import CatDetailScreen from '../screens/CatDetailScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B6B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Alt sekmeleri (Home ve AddCat) içeren ana grup */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Detay ekranı - Stack üzerinden açılır */}
      <Stack.Screen
        name="CatDetail"
        component={CatDetailScreen}
        options={({ route }) => ({
          title: route.params?.catName || 'Kedi Detayı',
          headerBackTitle: 'Geri',
        })}
      />
    </Stack.Navigator>
  );
}
