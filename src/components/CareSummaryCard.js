import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppTheme from '../theme/useAppTheme';
import { calculateCareAnalytics } from '../utils/careAnalytics';

export default function CareSummaryCard({ cats = [], dogs = [] }) {
  const { isDark, colors, language } = useAppTheme();
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'locations' | 'breeds'

  const stats = useMemo(() => calculateCareAnalytics(cats, dogs), [cats, dogs]);
  const isEn = language === 'en';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* 1. BAŞLIK & ROZET */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.headerIconBadge,
            { backgroundColor: isDark ? colors.primaryLight : '#FFF0EA' },
          ]}
        >
          <Ionicons name="heart-half" size={17} color={colors.primary} />
        </View>
        <View style={styles.headerTexts}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isEn ? 'Paw Passport & Care Summary 🐾' : 'Pati Karnesi & İlgi Özeti 🐾'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {isEn
              ? 'Community health, location distribution and care stats'
              : 'Mahalle sağlığı, konum dağılımı ve bakım istatistikleri'}
          </Text>
        </View>
      </View>

      {/* 2. KÜÇÜK SEKME SEÇİCİ */}
      <View style={[styles.tabBar, { backgroundColor: isDark ? colors.surfaceSecondary : '#F7F2EE' }]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'summary' && [
              styles.tabItemActive,
              { backgroundColor: isDark ? colors.card : '#FFFFFF' },
            ],
          ]}
          onPress={() => setActiveTab('summary')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabItemText,
              { color: activeTab === 'summary' ? colors.primary : colors.textSecondary },
            ]}
          >
            {isEn ? '📊 Overview' : '📊 Genel Bakış'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'locations' && [
              styles.tabItemActive,
              { backgroundColor: isDark ? colors.card : '#FFFFFF' },
            ],
          ]}
          onPress={() => setActiveTab('locations')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabItemText,
              { color: activeTab === 'locations' ? colors.primary : colors.textSecondary },
            ]}
          >
            {isEn ? '📍 Locations' : '📍 Mahalle Dağılımı'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'breeds' && [
              styles.tabItemActive,
              { backgroundColor: isDark ? colors.card : '#FFFFFF' },
            ],
          ]}
          onPress={() => setActiveTab('breeds')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabItemText,
              { color: activeTab === 'breeds' ? colors.primary : colors.textSecondary },
            ]}
          >
            {isEn ? '🧬 Breeds & Care' : '🧬 Tür & Bakım'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. İÇERİK BÖLÜMÜ */}
      {activeTab === 'summary' && (
        <View style={styles.tabContent}>
          {/* Metrik Kutuları */}
          <View style={styles.metricsRow}>
            <View
              style={[
                styles.metricBox,
                {
                  backgroundColor: isDark ? colors.surfaceSecondary : '#FFF9F5',
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Text style={[styles.metricValue, { color: colors.primary }]}>
                {stats.totalInteractions}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {isEn ? 'Care Actions' : 'Bakım & İlgi'}
              </Text>
            </View>

            <View
              style={[
                styles.metricBox,
                {
                  backgroundColor: isDark ? colors.surfaceSecondary : '#F3FAF6',
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Text style={[styles.metricValue, { color: '#2E9E5B' }]}>
                {stats.completedVaccinesCount}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {isEn ? 'Vaccines Done' : 'Yapılan Aşı'}
              </Text>
            </View>

            <View
              style={[
                styles.metricBox,
                {
                  backgroundColor: isDark ? colors.surfaceSecondary : '#F4F9FE',
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Text style={[styles.metricValue, { color: colors.blue }]}>
                {stats.scheduledVaccinesCount}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {isEn ? 'Planned' : 'Planlanan Aşı'}
              </Text>
            </View>
          </View>

          {/* En Yüksek Bağ Rozeti */}
          {stats.topFriend && stats.topFriend.name ? (
            <View
              style={[
                styles.topFriendBanner,
                {
                  backgroundColor: isDark ? colors.surfaceSecondary : '#FAF6F0',
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Text style={styles.topFriendEmoji}>
                {stats.topFriend.species === 'dog' ? '🐶' : '🐱'}
              </Text>
              <Text style={[styles.topFriendText, { color: colors.textSecondary }]}>
                {isEn ? 'Closest Companion: ' : 'En Yüksek Bağ Kurulan: '}
                <Text style={[styles.topFriendName, { color: colors.text }]}>
                  {stats.topFriend.name}
                </Text>{' '}
                ({stats.topFriend.interactionCount} {isEn ? 'care interactions' : 'ilgi / bakım'})
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* KONUM / MAHALLE BAZLI DAĞILIM */}
      {activeTab === 'locations' && (
        <View style={styles.tabContent}>
          {stats.locationsBreakdown && stats.locationsBreakdown.length > 0 ? (
            <View style={styles.breakdownList}>
              {stats.locationsBreakdown.slice(0, 5).map((loc, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.breakdownItem,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : '#FCFAF8',
                      borderColor: colors.borderLight,
                    },
                  ]}
                >
                  <View style={styles.breakdownItemHeader}>
                    <Text style={styles.pinIcon}>📍</Text>
                    <Text style={[styles.locationName, { color: colors.text }]} numberOfLines={1}>
                      {loc.regionName}
                    </Text>
                    <View style={[styles.animalCountPill, { backgroundColor: isDark ? '#2D3748' : '#F1E9E4' }]}>
                      <Text style={[styles.animalCountText, { color: colors.text }]}>
                        {loc.totalAnimals} {isEn ? 'animals' : 'can'} ({loc.catsCount} 🐱 / {loc.dogsCount} 🐶)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.subStatsRow}>
                    <Text style={[styles.subStatText, { color: colors.primary }]}>
                      🥣 {loc.interactionsCount} {isEn ? 'care actions' : 'besleme / ilgi'}
                    </Text>
                    <Text style={[styles.subStatText, { color: '#2E9E5B' }]}>
                      💉 {loc.vaccinesCount} {isEn ? 'vaccines' : 'aşı'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {isEn ? 'No location records found.' : 'Kayıtlı mahalle/bölge verisi bulunamadı.'}
            </Text>
          )}
        </View>
      )}

      {/* KEDİ & KÖPEK TÜRÜNE GÖRE BAKIM DAĞILIMI */}
      {activeTab === 'breeds' && (
        <View style={styles.tabContent}>
          {stats.breedBreakdown && stats.breedBreakdown.length > 0 ? (
            <View style={styles.breakdownList}>
              {stats.breedBreakdown.slice(0, 5).map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.breakdownItem,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : '#FCFAF8',
                      borderColor: colors.borderLight,
                    },
                  ]}
                >
                  <View style={styles.breakdownItemHeader}>
                    <Text style={styles.pinIcon}>
                      {item.species === 'dog' ? '🐶' : '🐱'}
                    </Text>
                    <Text style={[styles.locationName, { color: colors.text }]} numberOfLines={1}>
                      {item.breed}
                    </Text>
                    <View style={[styles.animalCountPill, { backgroundColor: isDark ? '#2D3748' : '#F1E9E4' }]}>
                      <Text style={[styles.animalCountText, { color: colors.text }]}>
                        {item.count} {isEn ? 'registered' : 'kayıtlı'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.subStatsRow}>
                    <Text style={[styles.subStatText, { color: colors.primary }]}>
                      ✨ {item.careActions} {isEn ? 'care actions' : 'bakım hareketi'}
                    </Text>
                    <Text style={[styles.subStatText, { color: '#2E9E5B' }]}>
                      🩺 {item.vaccines} {isEn ? 'vaccinations' : 'sağlık aşısı'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {isEn ? 'No breed records found.' : 'Kayıtlı tür verisi bulunamadı.'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  headerIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabItemText: {
    fontSize: 11,
    fontWeight: '800',
  },
  tabContent: {
    width: '100%',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  topFriendBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  topFriendEmoji: {
    fontSize: 16,
  },
  topFriendText: {
    fontSize: 12,
    flex: 1,
  },
  topFriendName: {
    fontWeight: '800',
  },
  breakdownList: {
    gap: 8,
  },
  breakdownItem: {
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
  },
  breakdownItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pinIcon: {
    fontSize: 14,
  },
  locationName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  animalCountPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  animalCountText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
    paddingLeft: 20,
  },
  subStatText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
