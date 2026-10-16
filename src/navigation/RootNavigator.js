import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import CatDetailScreen from '../screens/CatDetailScreen';
import DogDetailScreen from '../screens/DogDetailScreen';
import AddCatScreen from '../screens/AddCatScreen';
import AddDogScreen from '../screens/AddDogScreen';
import { Colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
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

      <Stack.Screen
        name="AddCat"
        component={AddCatScreen}
        options={{
          title: 'Yeni Kedi Ekle 🐾',
          headerBackTitle: 'Geri',
        }}
      />

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
  );
}
