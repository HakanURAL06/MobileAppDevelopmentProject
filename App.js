import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
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
import ToastBanner from './src/components/ToastBanner';
import useCatStore from './src/store/catStore';
import { getThemeColors, Colors } from './src/theme/colors';
import { getTranslation } from './src/i18n/translations';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Kalıcı Menünün Sol Üstünde Duran Geri Gitme Butonu (Floating Back Button)
 * Kullanıcının nerede olursa olsun bir önceki bulunduğu sayfaya kolayca dönmesini sağlar.
 */
function FloatingBottomBackButton({ currentRoute, canGoBack, onBack }) {
  const insets = useSafeAreaInsets();
  const theme = useCatStore((state) => state.theme || 'light');
  const language = useCatStore((state) => state.language || 'tr');
  const isDark = theme === 'dark';
  const colors = getThemeColors(theme);
  const t = getTranslation(language);

  const isTabScreen = ['Home', 'CatList', 'DogList', 'CatMap'].includes(currentRoute) || currentRoute === 'MainTabs';
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10);
  const tabBarHeight = 58 + bottomPadding;

  // Kalıcı menü üzerindeyken tab barın hemen sol üstünde, stack sayfalarında ise alt kenarın sol üstünde durur
  const bottomPosition = isTabScreen ? tabBarHeight + 12 : bottomPadding + 16;

  // Ana sayfada değilsek veya geri gidilebilecek geçmiş varsa aktif renkte parlar
  const isActive = canGoBack || (currentRoute && currentRoute !== 'Home' && currentRoute !== 'MainTabs');

  return (
    <TouchableOpacity
      style={[
        styles.floatingBackBtn,
        {
          bottom: bottomPosition,
          backgroundColor: isActive
            ? (isDark ? colors.card : colors.primary)
            : (isDark ? 'rgba(55,65,81,0.92)' : 'rgba(75,85,99,0.92)'),
          borderColor: isActive
            ? (isDark ? colors.cardBorder : 'rgba(255,255,255,0.45)')
            : 'rgba(255,255,255,0.25)',
        },
      ]}
      onPress={onBack}
      activeOpacity={0.78}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons
        name="arrow-back"
        size={17}
        color="#FFFFFF"
        style={{ marginRight: 4 }}
      />
      <Text style={styles.floatingBackText}>
        {t.navBack || 'Geri'}
      </Text>
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
      backBehavior="history"
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
  const showToast = useCatStore((state) => state.showToast);

  const navigationRef = useNavigationContainerRef();
  const [canGoBackState, setCanGoBackState] = React.useState(false);
  const [currentRoute, setCurrentRoute] = React.useState('Home');

  const updateNavState = React.useCallback(() => {
    if (navigationRef.isReady()) {
      setCanGoBackState(navigationRef.canGoBack());
      const route = navigationRef.getCurrentRoute();
      if (route?.name) {
        setCurrentRoute(route.name);
      }
    }
  }, [navigationRef]);

  const handleFloatingBack = () => {
    if (!navigationRef.isReady()) return;

    if (navigationRef.canGoBack()) {
      navigationRef.goBack();
    } else {
      const current = navigationRef.getCurrentRoute()?.name;
      if (current && current !== 'Home' && current !== 'MainTabs') {
        navigationRef.navigate('MainTabs', { screen: 'Home' });
      } else {
        showToast(
          language === 'en' ? 'Already at home screen 🏠' : 'Zaten ana ekrandasınız 🏠',
          'info'
        );
      }
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={updateNavState}
        onStateChange={updateNavState}
      >
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? colors.card : Colors.primary,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 17,
            },
            headerBackTitleVisible: false,
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

          {/* Pati Karnesi & İlgi Özeti Detay Sayfası */}
          <Stack.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={{
              title: language === 'en' ? 'Paw Passport & Analytics' : 'Pati Karnesi & Rapor',
              headerBackTitle: t.navBack,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Kalıcı Alt Menünün Sol Üstünde Duran Geri Gitme Butonu */}
      <FloatingBottomBackButton
        currentRoute={currentRoute}
        canGoBack={canGoBackState}
        onBack={handleFloatingBack}
      />

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
  floatingBackBtn: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1.5,
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
  },
  floatingBackText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
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
