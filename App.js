import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import CatListScreen from './src/screens/CatListScreen';
import DogListScreen from './src/screens/DogListScreen';
import CatMapScreen from './src/screens/CatMapScreen';
import AddCatScreen from './src/screens/AddCatScreen';
import AddDogScreen from './src/screens/AddDogScreen';
import CatDetailScreen from './src/screens/CatDetailScreen';
import DogDetailScreen from './src/screens/DogDetailScreen';
import ToastBanner from './src/components/ToastBanner';
import useCatStore from './src/store/catStore';
import { getThemeColors, Colors } from './src/theme/colors';
import { getTranslation } from './src/i18n/translations';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Üst Başlık Hızlı Tema ve Dil Değiştirici Butonları
 */
function HeaderPreferencesButtons() {
  const theme = useCatStore((state) => state.theme || 'light');
  const language = useCatStore((state) => state.language || 'tr');
  const toggleTheme = useCatStore((state) => state.toggleTheme);
  const toggleLanguage = useCatStore((state) => state.toggleLanguage);
  const isDark = theme === 'dark';

  return (
    <View style={styles.headerBtnGroup}>
      {/* Tema Butonu */}
      <TouchableOpacity
        style={[styles.headerIconBtn, { backgroundColor: isDark ? '#272C3D' : 'rgba(255,255,255,0.25)' }]}
        onPress={toggleTheme}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.headerBtnEmoji}>{isDark ? '🌙' : '☀️'}</Text>
      </TouchableOpacity>

      {/* Dil Butonu */}
      <TouchableOpacity
        style={[styles.headerLangBtn, { backgroundColor: isDark ? '#272C3D' : 'rgba(255,255,255,0.25)' }]}
        onPress={toggleLanguage}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.headerLangText}>
          {language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// 1. Alt Sekmeler (Ana Sayfa, Kedilerim, Köpeklerim, Harita)
function BottomTabs() {
  const theme = useCatStore((state) => state.theme || 'light');
  const language = useCatStore((state) => state.language || 'tr');
  const isDark = theme === 'dark';
  const colors = getThemeColors(theme);
  const t = getTranslation(language);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? colors.card : Colors.primary,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
        },
        headerRight: () => <HeaderPreferencesButtons />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textMuted : Colors.textMuted,
        tabBarStyle: {
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? colors.cardBorder : '#F5ECE6',
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.2 : 0.04,
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
        options={{ title: t.navHome }}
      />
      <Tab.Screen
        name="CatList"
        component={CatListScreen}
        options={{ title: t.navCats }}
      />
      <Tab.Screen
        name="DogList"
        component={DogListScreen}
        options={{ title: t.navDogs }}
      />
      <Tab.Screen
        name="CatMap"
        component={CatMapScreen}
        options={{ title: t.navMap }}
      />
    </Tab.Navigator>
  );
}

// 2. Ana Uygulama Stack Navigasyonu
export default function App() {
  const theme = useCatStore((state) => state.theme || 'light');
  const language = useCatStore((state) => state.language || 'tr');
  const isDark = theme === 'dark';
  const colors = getThemeColors(theme);
  const t = getTranslation(language);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? colors.card : Colors.primary,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 18,
            },
            headerRight: () => <HeaderPreferencesButtons />,
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
              title: route.params?.catName
                ? `${route.params.catName} ${t.profileTitleSuffixCat}`
                : t.navCatDetail,
              headerBackTitle: t.navBack,
            })}
          />

          {/* Köpek Detayı */}
          <Stack.Screen
            name="DogDetail"
            component={DogDetailScreen}
            options={({ route }) => ({
              title: route.params?.dogName
                ? `${route.params.dogName} ${t.profileTitleSuffixDog}`
                : t.navDogDetail,
              headerBackTitle: t.navBack,
              headerStyle: {
                backgroundColor: isDark ? colors.card : '#D97706',
              },
            })}
          />

          {/* Kedi Ekleme Sayfası */}
          <Stack.Screen
            name="AddCat"
            component={AddCatScreen}
            options={{
              title: t.navAddCat,
              headerBackTitle: t.navBack,
            }}
          />

          {/* Köpek Ekleme Sayfası */}
          <Stack.Screen
            name="AddDog"
            component={AddDogScreen}
            options={{
              title: t.navAddDog,
              headerBackTitle: t.navBack,
              headerStyle: {
                backgroundColor: isDark ? colors.card : '#D97706',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <ToastBanner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  headerIconBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnEmoji: {
    fontSize: 14,
  },
  headerLangBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLangText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
