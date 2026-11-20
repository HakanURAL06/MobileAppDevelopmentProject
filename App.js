import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import VetListScreen from './src/screens/VetListScreen';
import VetDetailScreen from './src/screens/VetDetailScreen';
import ToastBanner from './src/components/ToastBanner';
import useCatStore from './src/store/catStore';
import { getThemeColors, Colors } from './src/theme/colors';
import { getTranslation } from './src/i18n/translations';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Sol Üst Geri Dön Butonu (Global Back Button)
 * Kullanıcı nerede olursa olsun bastığında bir önceki bulunduğu sayfaya döner.
 */
function HeaderBackButton({ navigation }) {
  const canGoBack = navigation && navigation.canGoBack ? navigation.canGoBack() : false;
  const isDark = useCatStore((state) => state.theme === 'dark');

  if (!canGoBack) return null;

  return (
    <TouchableOpacity
      style={[
        styles.globalBackBtn,
        { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.22)' },
      ]}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

/**
 * Üst Başlık Hızlı Tema ve Dil Değiştirici Butonları
 * Sade, minimalist ve göz yormayan kompakt tasarım.
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
        style={[
          styles.headerIconBtn,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.22)' },
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 8, right: 4 }}
      >
        <Ionicons
          name={isDark ? 'moon' : 'sunny'}
          size={16}
          color={isDark ? '#FDE047' : '#FFFFFF'}
        />
      </TouchableOpacity>

      {/* Dil Butonu */}
      <TouchableOpacity
        style={[
          styles.headerLangBtn,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.22)' },
        ]}
        onPress={toggleLanguage}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 4, right: 8 }}
      >
        <Text style={styles.headerLangText}>
          {language === 'tr' ? 'TR' : 'EN'}
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
  const insets = useSafeAreaInsets();

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10);

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
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
        },
        headerRightContainerStyle: {
          paddingRight: 14,
        },
        headerLeftContainerStyle: {
          paddingLeft: 6,
        },
        headerRight: () => <HeaderPreferencesButtons />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textMuted : Colors.textMuted,
        tabBarStyle: {
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? colors.cardBorder : '#F5ECE6',
          paddingBottom: bottomPadding,
          paddingTop: 8,
          paddingHorizontal: 10,
          height: 58 + bottomPadding,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 10,
          elevation: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          marginHorizontal: 2,
          borderRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 0,
        },
        tabBarIcon: ({ focused, color }) => {
          if (route.name === 'Home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />;
          } else if (route.name === 'CatList') {
            return <Text style={{ fontSize: 19 }}>🐱</Text>;
          } else if (route.name === 'DogList') {
            return <Text style={{ fontSize: 19 }}>🐶</Text>;
          } else if (route.name === 'VetList') {
            return <Ionicons name={focused ? 'medkit' : 'medkit-outline'} size={21} color={color} />;
          } else if (route.name === 'CatMap') {
            return <Ionicons name={focused ? 'map' : 'map-outline'} size={22} color={color} />;
          }
          return <Ionicons name="paw" size={22} color={color} />;
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
        name="VetList"
        component={VetListScreen}
        options={{ title: t.navVets }}
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
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={({ navigation }) => ({
            headerStyle: {
              backgroundColor: isDark ? colors.card : Colors.primary,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 17,
            },
            headerBackTitleVisible: false,
            headerLeft: () => <HeaderBackButton navigation={navigation} />,
            headerRight: () => <HeaderPreferencesButtons />,
          })}
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

          {/* Pati Karnesi & İlgi Özeti Detay Sayfası */}
          <Stack.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={{
              title: language === 'en' ? 'Paw Passport & Analytics' : 'Pati Karnesi & Rapor',
              headerBackTitle: t.navBack,
            }}
          />

          {/* Veteriner Hekim & Klinik Listesi (Doğrudan Stack ile Açılış) */}
          <Stack.Screen
            name="VetList"
            component={VetListScreen}
            options={{
              title: t.navVets,
              headerBackTitle: t.navBack,
              headerStyle: {
                backgroundColor: isDark ? colors.card : '#059669',
              },
            }}
          />

          {/* Veteriner Hekim & Klinik Profili */}
          <Stack.Screen
            name="VetDetail"
            component={VetDetailScreen}
            options={({ route }) => ({
              title: route.params?.vetName
                ? route.params.vetName
                : t.navVetDetail,
              headerBackTitle: t.navBack,
              headerStyle: {
                backgroundColor: isDark ? colors.card : '#059669',
              },
            })}
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
    gap: 6,
    paddingVertical: 2,
    paddingRight: 2,
  },
  globalBackBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    marginRight: 4,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLangBtn: {
    paddingHorizontal: 9,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLangText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
