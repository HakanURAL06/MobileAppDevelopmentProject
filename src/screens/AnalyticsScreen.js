import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import useAppTheme from '../theme/useAppTheme';
import { calculateCareAnalytics } from '../utils/careAnalytics';

export default function AnalyticsScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats || []);
  const dogs = useCatStore((state) => state.dogs || []);
  const { isDark, colors, language } = useAppTheme();
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'locations' | 'breeds'

  const stats = useMemo(() => calculateCareAnalytics(cats, dogs), [cats, dogs]);
  const isEn = language === 'en';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* 1. ÜST BAŞLIK KARTI */}
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View
            style={[
              styles.headerIconBadge,
              { backgroundColor: isDark ? colors.primaryLight : '#FFF0EA' },
            ]}
          >
            <Ionicons name="stats-chart" size={20} color={colors.primary} />
          </View>
          <View style={styles.headerTexts}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {isEn ? 'Paw Passport & Care Report' : 'Pati Karnesi & İlgi Raporu'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {isEn
                ? 'Detailed breakdown of neighborhood distribution and breed care'
                : 'Mahalle dağılımı, konum analizleri ve cins bazlı bakım dökümü'}
            </Text>
          </View>
        </View>

        {/* Sekme Seçici */}
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
              {isEn ? '📍 Locations' : '📍 Mahalleler'}
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
              {isEn ? '🧬 Breeds' : '🧬 Tür & Irk'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. TAB İÇERİKLERİ */}

      {/* A) GENEL BAKIŞ */}
      {activeTab === 'summary' && (
        <View style={styles.section}>
          <View style={styles.metricsGrid}>
            <View
              style={[
                styles.metricCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text style={styles.metricEmoji}>🥣</Text>
              <Text style={[styles.metricValue, { color: colors.primary }]}>
                {stats.totalInteractions}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {isEn ? 'Total Care Actions' : 'Toplam Bakım & İlgi'}
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text style={styles.metricEmoji}>💉</Text>
              <Text style={[styles.metricValue, { color: '#2E9E5B' }]}>
                {stats.completedVaccinesCount}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {isEn ? 'Vaccines Completed' : 'Yapılan Aşılar'}
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text style={styles.metricEmoji}>📅</Text>
              <Text style={[styles.metricValue, { color: colors.blue }]}>
                {stats.scheduledVaccinesCount}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {isEn ? 'Scheduled Vaccines' : 'Planlanan Aşılar'}
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text style={styles.metricEmoji}>🐾</Text>
              <Text style={[styles.metricValue, { color: colors.secondary }]}>
                {stats.totalAnimals}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {isEn ? 'Total Tracked' : 'Kayıtlı Can'}
              </Text>
            </View>
          </View>

          {/* En Yüksek Bağ */}
          {stats.topFriend && stats.topFriend.name && (
            <TouchableOpacity
              style={[
                styles.topFriendCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
              activeOpacity={0.82}
              onPress={() => {
                if (!stats.topFriend?.id) return;
                if (stats.topFriend.species === 'dog') {
                  navigation.navigate('DogDetail', {
                    dogId: stats.topFriend.id,
                    dogName: stats.topFriend.name,
                  });
                } else {
                  navigation.navigate('CatDetail', {
                    catId: stats.topFriend.id,
                    catName: stats.topFriend.name,
                  });
                }
              }}
            >
              <Text style={styles.topFriendBigEmoji}>
                {stats.topFriend.species === 'dog' ? '🐶' : '🐱'}
              </Text>
              <View style={{ flex: 1 }}>
                <View style={styles.topFriendHeaderRow}>
                  <Text style={[styles.topFriendTitle, { color: colors.textSecondary }]}>
                    {isEn ? 'Strongest Bond Champion' : 'En Çok Etkileşime Girilen Dost'}
                  </Text>
                  <View style={[styles.topFriendBadge, { backgroundColor: isDark ? colors.surfaceSecondary : '#FFF2EC' }]}>
                    <Text style={[styles.topFriendBadgeText, { color: colors.primary }]}>
                      {isEn ? 'View Profile ➔' : 'Profile Git ➔'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.topFriendName, { color: colors.text }]}>
                  {stats.topFriend.name}
                </Text>
                <Text style={[styles.topFriendDesc, { color: colors.primary }]}>
                  {stats.topFriend.interactionCount} {isEn ? 'care interactions recorded' : 'etkileşim ve bakım kaydı'}
                </Text>
              </View>

              <View
                style={[
                  styles.topFriendArrowCircle,
                  { backgroundColor: isDark ? colors.surfaceSecondary : '#FFF0EA' },
                ]}
              >
                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* B) MAHALLE / KONUM DAĞILIMI */}
      {activeTab === 'locations' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {isEn ? 'Care by Neighborhood' : 'Mahallelere Göre Dağılım'}
          </Text>
          {stats.locationsBreakdown && stats.locationsBreakdown.length > 0 ? (
            stats.locationsBreakdown.map((loc, idx) => (
              <View
                key={idx}
                style={[
                  styles.listCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.listCardHeader}>
                  <Text style={{ fontSize: 16 }}>📍</Text>
                  <Text style={[styles.listCardTitle, { color: colors.text }]}>
                    {loc.regionName}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: isDark ? colors.surfaceSecondary : '#F2ECE8' }]}>
                    <Text style={[styles.badgeText, { color: colors.text }]}>
                      {loc.totalAnimals} {isEn ? 'animals' : 'can'} ({loc.catsCount} 🐱, {loc.dogsCount} 🐶)
                    </Text>
                  </View>
                </View>

                <View style={styles.listCardStats}>
                  <View style={styles.statPill}>
                    <Text style={[styles.statPillText, { color: colors.primary }]}>
                      🥣 {loc.interactionsCount} {isEn ? 'care actions' : 'ilgi / besleme'}
                    </Text>
                  </View>
                  <View style={styles.statPill}>
                    <Text style={[styles.statPillText, { color: '#2E9E5B' }]}>
                      💉 {loc.vaccinesCount} {isEn ? 'vaccines' : 'aşı yapıldı'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {isEn ? 'No location records found.' : 'Kayıtlı konum verisi bulunamadı.'}
            </Text>
          )}
        </View>
      )}

      {/* C) CİNS & TÜR DAĞILIMI */}
      {activeTab === 'breeds' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {isEn ? 'Care by Animal Breed' : 'Cins ve Irka Göre Bakım'}
          </Text>
          {stats.breedBreakdown && stats.breedBreakdown.length > 0 ? (
            stats.breedBreakdown.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.listCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.listCardHeader}>
                  <Text style={{ fontSize: 16 }}>
                    {item.species === 'dog' ? '🐶' : '🐱'}
                  </Text>
                  <Text style={[styles.listCardTitle, { color: colors.text }]}>
                    {item.breed}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: isDark ? colors.surfaceSecondary : '#F2ECE8' }]}>
                    <Text style={[styles.badgeText, { color: colors.text }]}>
                      {item.count} {isEn ? 'registered' : 'kayıtlı'}
                    </Text>
                  </View>
                </View>

                <View style={styles.listCardStats}>
                  <View style={styles.statPill}>
                    <Text style={[styles.statPillText, { color: colors.primary }]}>
                      ✨ {item.careActions} {isEn ? 'care actions' : 'bakım yapıldı'}
                    </Text>
                  </View>
                  <View style={styles.statPill}>
                    <Text style={[styles.statPillText, { color: '#2E9E5B' }]}>
                      🩺 {item.vaccines} {isEn ? 'vaccines' : 'sağlık kontrolü'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {isEn ? 'No breed records found.' : 'Kayıtlı cins verisi bulunamadı.'}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  headerIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
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
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    marginLeft: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  topFriendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  topFriendHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 2,
  },
  topFriendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  topFriendBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  topFriendArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topFriendBigEmoji: {
    fontSize: 34,
  },
  topFriendTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  topFriendName: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },
  topFriendDesc: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  listCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  listCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  listCardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listCardStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
