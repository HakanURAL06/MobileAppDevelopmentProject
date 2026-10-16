import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import CatListScreen from '../screens/CatListScreen';
import DogListScreen from '../screens/DogListScreen';
import CatMapScreen from '../screens/CatMapScreen';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
          } else if (route.name === 'CatList') {
            return <Text style={{ fontSize: 18 }}>🐱</Text>;
          } else if (route.name === 'DogList') {
            return <Text style={{ fontSize: 18 }}>🐶</Text>;
          } else if (route.name === 'CatMap') {
            return <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={color} />;
          }
          return <Ionicons name="paw" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Ana Sayfa 🏠' }}
      />
      <Tab.Screen
        name="CatList"
        component={CatListScreen}
        options={{ title: 'Kedilerim 🐱' }}
      />
      <Tab.Screen
        name="DogList"
        component={DogListScreen}
        options={{ title: 'Köpeklerim 🐶' }}
      />
      <Tab.Screen
        name="CatMap"
        component={CatMapScreen}
        options={{ title: 'Harita 📍' }}
      />
    </Tab.Navigator>
  );
}
