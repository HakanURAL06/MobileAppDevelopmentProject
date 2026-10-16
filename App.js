import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import CatListScreen from './src/screens/CatListScreen';
import DogListScreen from './src/screens/DogListScreen';
import CatMapScreen from './src/screens/CatMapScreen';
import AddCatScreen from './src/screens/AddCatScreen';
import AddDogScreen from './src/screens/AddDogScreen';
import CatDetailScreen from './src/screens/CatDetailScreen';
import DogDetailScreen from './src/screens/DogDetailScreen';
import ToastBanner from './src/components/ToastBanner';
import { Colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Alt Sekmeler (Ana Sayfa, Kedilerim, Köpeklerim, Harita)
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
          fontSize: 11,
          fontWeight: '700',
          marginTop: -2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={21} color={color} />;
          } else if (route.name === 'CatList') {
            return <Text style={{ fontSize: 19 }}>🐱</Text>;
          } else if (route.name === 'DogList') {
            return <Text style={{ fontSize: 19 }}>🐶</Text>;
          } else if (route.name === 'CatMap') {
            return <Ionicons name={focused ? 'map' : 'map-outline'} size={21} color={color} />;
          }
          return <Ionicons name="paw" size={21} color={color} />;
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

          {/* Kedi Detayı */}
          <Stack.Screen
            name="CatDetail"
            component={CatDetailScreen}
            options={({ route }) => ({
              title: route.params?.catName ? `${route.params.catName} Profili 🐱` : 'Kedi Detayı',
              headerBackTitle: 'Geri',
            })}
          />

          {/* Köpek Detayı */}
          <Stack.Screen
            name="DogDetail"
            component={DogDetailScreen}
            options={({ route }) => ({
              title: route.params?.dogName ? `${route.params.dogName} Profili 🐶` : 'Köpek Detayı',
              headerBackTitle: 'Geri',
              headerStyle: {
                backgroundColor: '#D97706',
              },
            })}
          />

          {/* Kedi Ekleme Sayfası */}
          <Stack.Screen
            name="AddCat"
            component={AddCatScreen}
            options={{
              title: 'Yeni Kedi Ekle 🐾',
              headerBackTitle: 'Geri',
            }}
          />

          {/* Köpek Ekleme Sayfası */}
          <Stack.Screen
            name="AddDog"
            component={AddDogScreen}
            options={{
              title: 'Yeni Köpek Ekle 🐶',
              headerBackTitle: 'Geri',
              headerStyle: {
                backgroundColor: '#D97706',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <ToastBanner />
    </SafeAreaProvider>
  );
}
