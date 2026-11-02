import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import useAppTheme from '../theme/useAppTheme';
import ThemeLanguageBar from '../components/ThemeLanguageBar';

export default function HomeScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats || []);
  const dogs = useCatStore((state) => state.dogs || []);
  const { isDark, colors, t, language } = useAppTheme();

  const totalAnimals = cats.length + dogs.length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* 0. TEMA VE DİL DEĞİŞTİRME ÇUBUĞU */}
      <ThemeLanguageBar />

      {/* 1. SEVİMLİ VE MİNİMALİST KARŞILAMA ALANI */}
      <View style={styles.welcomeSection}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { backgroundColor: isDark ? colors.card : '#FFF2EC', borderColor: isDark ? colors.cardBorder : '#FFFFFF' }]}>
            <Text style={styles.avatarEmoji}>🐱</Text>
          </View>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: isDark ? '#2C2310' : '#FEF3C7', borderColor: isDark ? colors.cardBorder : '#FFFFFF', marginLeft: -16 },
            ]}
          >
            <Text style={styles.avatarEmoji}>🐶</Text>
          </View>
        </View>

        <Text style={[styles.greetingTitle, { color: colors.text }]}>
          {t.homeGreetingTitle}
        </Text>
        <Text style={[styles.greetingSubtitle, { color: colors.textSecondary }]}>
          {t.homeGreetingSubtitle}
        </Text>

        {/* İstatistik Rozetleri */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[
              styles.statChip,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? colors.cardBorder : colors.cardBorder,
              },
            ]}
            onPress={() => navigation.navigate('CatList')}
            activeOpacity={0.8}
          >
            <Text style={styles.statChipEmoji}>🐱</Text>
            <Text style={[styles.statChipText, { color: colors.text }]}>
              {cats.length} {t.homeStatCats}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statChip,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? '#4B3F1E' : '#FDE68A',
              },
            ]}
            onPress={() => navigation.navigate('DogList')}
            activeOpacity={0.8}
          >
            <Text style={styles.statChipEmoji}>🐶</Text>
            <Text style={[styles.statChipText, { color: '#D97706' }]}>
              {dogs.length} {t.homeStatDogs}
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.statChip,
              {
                backgroundColor: isDark ? colors.card : '#FAF5F0',
                borderColor: isDark ? colors.cardBorder : colors.cardBorder,
              },
            ]}
          >
            <Ionicons name="heart" size={14} color={colors.secondary} />
            <Text style={[styles.statChipText, { color: colors.text }]}>
              {totalAnimals} {t.homeStatTotal}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. BÜYÜK YÖNLENDİRME KARTLARI */}
      <View style={styles.buttonsContainer}>
        {/* Buton 1: Kayıtlı Kedilerim */}
        <TouchableOpacity
          style={[
            styles.navCard,
            isDark
              ? { backgroundColor: colors.card, borderColor: colors.cardBorder }
              : styles.navCardPeach,
          ]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('CatList')}
        >
          <View style={[styles.iconCircle, { backgroundColor: isDark ? colors.primaryLight : '#FFF0EA' }]}>
            <Text style={{ fontSize: 30 }}>🐱</Text>
          </View>
          <View style={styles.navCardTexts}>
            <View style={styles.cardTitleBadgeRow}>
              <Text style={[styles.navCardTitle, { color: colors.text }]}>
                {t.homeCardCatsTitle}
              </Text>
              <View style={[styles.counterBadgePeach, { backgroundColor: isDark ? colors.primaryLight : '#FFF0EA' }]}>
                <Text style={styles.counterBadgeTextPeach}>
                  {cats.length} {t.homeStatCats}
                </Text>
              </View>
            </View>
            <Text style={[styles.navCardDesc, { color: colors.textSecondary }]}>
              {t.homeCardCatsDesc}
            </Text>
          </View>
          <View style={[styles.arrowCircle, { backgroundColor: isDark ? colors.cardBorder : '#FFFFFF' }]}>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Buton 2: Kayıtlı Köpeklerim */}
        <TouchableOpacity
          style={[
            styles.navCard,
            isDark
              ? { backgroundColor: colors.card, borderColor: colors.cardBorder }
              : styles.navCardAmber,
          ]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('DogList')}
        >
          <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2C2310' : '#FEF3C7' }]}>
            <Text style={{ fontSize: 30 }}>🐶</Text>
          </View>
          <View style={styles.navCardTexts}>
            <View style={styles.cardTitleBadgeRow}>
              <Text style={[styles.navCardTitle, { color: colors.text }]}>
                {t.homeCardDogsTitle}
              </Text>
              <View style={[styles.counterBadgeAmber, { backgroundColor: isDark ? '#3D2F14' : '#FEF3C7' }]}>
                <Text style={styles.counterBadgeTextAmber}>
                  {dogs.length} {t.homeStatDogs}
                </Text>
              </View>
            </View>
            <Text style={[styles.navCardDesc, { color: colors.textSecondary }]}>
              {t.homeCardDogsDesc}
            </Text>
          </View>
          <View style={[styles.arrowCircle, { backgroundColor: isDark ? colors.cardBorder : '#FFFFFF' }]}>
            <Ionicons name="chevron-forward" size={20} color="#D97706" />
          </View>
        </TouchableOpacity>

        {/* Buton 3: Canlı Haritada Gör */}
        <TouchableOpacity
          style={[
            styles.navCard,
            isDark
              ? { backgroundColor: colors.card, borderColor: colors.cardBorder }
              : styles.navCardBlue,
          ]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('CatMap')}
        >
          <View style={[styles.iconCircle, { backgroundColor: isDark ? colors.blueLight : '#EDF6FD' }]}>
            <Ionicons name="map" size={28} color={colors.blue} />
          </View>
          <View style={styles.navCardTexts}>
            <Text style={[styles.navCardTitle, { color: colors.text }]}>
              {t.homeExploreMap}
            </Text>
            <Text style={[styles.navCardDesc, { color: colors.textSecondary }]}>
              {t.homeExploreMapSub}
            </Text>
          </View>
          <View style={[styles.arrowCircle, { backgroundColor: isDark ? colors.cardBorder : '#FFFFFF' }]}>
            <Ionicons name="chevron-forward" size={20} color={colors.blue} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. HIZLI EKLEME BUTONLARI (KEDİ & KÖPEK) */}
      <View style={styles.quickAddRow}>
        <TouchableOpacity
          style={[
            styles.quickAddBtnCat,
            {
              backgroundColor: isDark ? colors.card : '#FFF2EC',
              borderColor: isDark ? colors.primary : '#FFD9CB',
            },
          ]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddCat')}
        >
          <Ionicons name="add-circle" size={20} color={colors.primary} />
          <Text style={[styles.quickAddBtnTextCat, { color: colors.primary }]}>
            + {t.homeQuickAddCat} 🐱
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.quickAddBtnDog,
            {
              backgroundColor: isDark ? colors.card : '#FEF3C7',
              borderColor: isDark ? '#D97706' : '#FDE68A',
            },
          ]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddDog')}
        >
          <Ionicons name="add-circle" size={20} color="#D97706" />
          <Text style={styles.quickAddBtnTextDog}>
            + {t.homeQuickAddDog} 🐶
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. GÜNÜN NOTU */}
      <View style={[styles.noteBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={styles.noteEmoji}>🥣</Text>
        <Text style={[styles.noteText, { color: colors.textSecondary }]}>
          {language === 'en'
            ? '"A bowl of food, a bowl of clean water and a little affection brighten any street animal\'s day."'
            : '"Bir kap mama, bir kap temiz su ve biraz sevgi her sokak canının gününü güzelleştirir."'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 320,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statChipEmoji: {
    fontSize: 13,
  },
  statChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  buttonsContainer: {
    width: '100%',
    gap: 14,
    marginBottom: 16,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  navCardPeach: {
    backgroundColor: '#FFFBF7',
    borderColor: '#FFE8DF',
    shadowColor: '#FF9A76',
  },
  navCardAmber: {
    backgroundColor: '#FFFCF5',
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
  },
  navCardBlue: {
    backgroundColor: '#F8FCFF',
    borderColor: '#E2F0FD',
    shadowColor: '#6CB4EE',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  navCardTexts: {
    flex: 1,
  },
  cardTitleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingRight: 4,
  },
  navCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  counterBadgePeach: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  counterBadgeTextPeach: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F08055',
  },
  counterBadgeAmber: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  counterBadgeTextAmber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  navCardDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  quickAddRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  quickAddBtnCat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  quickAddBtnTextCat: {
    fontSize: 12,
    fontWeight: '800',
  },
  quickAddBtnDog: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  quickAddBtnTextDog: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 10,
    width: '100%',
  },
  noteEmoji: {
    fontSize: 22,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
  },
});
