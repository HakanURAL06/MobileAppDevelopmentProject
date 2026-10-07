import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import AddCatScreen from './screens/AddCatScreen';
import CatDetailScreen from './screens/CatDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Bottom Tab Navigation (Home & AddCat)
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#FF6B6B' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'paw';
          if (route.name === 'Home') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'AddCat') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Patili Dostlar 🐾' }}
      />
      <Tab.Screen
        name="AddCat"
        component={AddCatScreen}
        options={{ title: 'Kedi Ekle ➕' }}
      />
    </Tab.Navigator>
  );
}

// 2. Root Navigation (Tabs + CatDetail Stack)
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#FF6B6B' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CatDetail"
            component={CatDetailScreen}
            options={({ route }) => ({
              title: route.params?.catName ? `${route.params.catName} Profili 🐱` : 'Kedi Detayı',
              headerBackTitle: 'Geri',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
