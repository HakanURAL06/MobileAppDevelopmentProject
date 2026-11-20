import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import useCatStore from '../store/catStore';
import useAppTheme from '../theme/useAppTheme';
import CareSummaryCard from '../components/CareSummaryCard';
import AddAnimalActionMenu from '../components/AddAnimalActionMenu';
import ViewRecordsActionMenu from '../components/ViewRecordsActionMenu';

export default function HomeScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats || []);
  const dogs = useCatStore((state) => state.dogs || []);
  const vets = useCatStore((state) => state.vets || []);
  const { isDark, colors, t, language } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* 1. MİNİMALİST KARŞILAMA VE SAYAÇ ALANI */}
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
          {language === 'en' ? 'Street Paws 🐾' : 'Sokak Dostları 🐾'}
        </Text>

        {/* Minimal Tek Satır Sayaç Özeti */}
        <View style={[styles.statPill, { backgroundColor: isDark ? colors.card : '#F8FAFC', borderColor: colors.cardBorder }]}>
          <Text style={[styles.statPillText, { color: colors.textSecondary }]}>
            🐱 {cats.length} {t.homeStatCats}   •   🐶 {dogs.length} {t.homeStatDogs}   •   🩺 {vets.length} {language === 'en' ? 'Clinics' : 'Klinik'}
          </Text>
        </View>
      </View>

      {/* 2. AÇILIR LİSTE MENÜLERİ (EKLEME VE GÖRÜNTÜLEME) */}
      <View style={styles.actionSection}>
        {/* Buton 1: Patili Dost Ekle Açılır Menüsü */}
        <AddAnimalActionMenu navigation={navigation} />

        {/* Buton 2: Kayıtlı Canları ve Klinikleri Gör Açılır Menüsü */}
        <ViewRecordsActionMenu
          navigation={navigation}
          catsCount={cats.length}
          dogsCount={dogs.length}
          vetsCount={vets.length}
        />
      </View>

      {/* 3. SADE PATİ KARNESİ ÖZET KARTI (Dokununca detaylı Analytics sayfasına gider) */}
      <CareSummaryCard
        cats={cats}
        dogs={dogs}
        onPressDetails={() => navigation.navigate('Analytics')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 8,
  },
  statPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actionSection: {
    width: '100%',
    marginBottom: 6,
  },
});
