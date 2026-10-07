import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import CatListScreen from './src/screens/CatListScreen';
import CatMapScreen from './src/screens/CatMapScreen';
import AddCatScreen from './src/screens/AddCatScreen';
import CatDetailScreen from './src/screens/CatDetailScreen';
import { Colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Alt Sekmeler (Kedi Ekle sekmesi kaldırıldı, FAB olarak taşındı)
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.primary,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F5ECE6',
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          shadowColor: Colors.cardShadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: -2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'paw';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CatList') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'CatMap') {
            iconName = focused ? 'map' : 'map-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
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
        options={{ title: 'Kedilerim 🐾' }}
      />
      <Tab.Screen
        name="CatMap"
        component={CatMapScreen}
        options={{ title: 'Harita 📍' }}
      />
    </Tab.Navigator>
  );
}

// 2. Ana Uygulama Stack Navigasyonu
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 18,
            },
          }}
        >
          {/* Ana Sekmeler */}
          <Stack.Screen
            name="MainTabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />

          {/* Kedi Detayı ve Albüm Sayfası */}
          <Stack.Screen
            name="CatDetail"
            component={CatDetailScreen}
            options={({ route }) => ({
              title: route.params?.catName ? `${route.params.catName} Profili 🐱` : 'Kedi Detayı',
              headerBackTitle: 'Geri',
            })}
          />

          {/* Kedi Ekleme Sayfası (FAB veya Buton ile açılır) */}
          <Stack.Screen
            name="AddCat"
            component={AddCatScreen}
            options={{
              title: 'Yeni Kedi Ekle 🐾',
              headerBackTitle: 'Geri',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
