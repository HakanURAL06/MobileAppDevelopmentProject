import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppTheme from '../theme/useAppTheme';
import { calculateCareAnalytics } from '../utils/careAnalytics';

export default function CareSummaryCard({ cats = [], dogs = [] }) {
  const { isDark, colors, language } = useAppTheme();

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
      <View style={styles.headerRow}>
        <View
          style={[
            styles.headerIconBadge,
            { backgroundColor: isDark ? colors.primaryLight : '#FFF0EA' },
          ]}
        >
          <Ionicons name="stats-chart" size={16} color={colors.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEn ? 'Community Care Summary' : 'Mahalle Bakım Özeti'}
        </Text>
      </View>

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
            {isEn ? 'Closest Bond: ' : 'En Yüksek Bağ: '}
            <Text style={[styles.topFriendName, { color: colors.text }]}>
              {stats.topFriend.name}
            </Text>{' '}
            ({stats.topFriend.interactionCount}{' '}
            {isEn ? 'interactions' : 'etkileşim'})
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
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
    gap: 8,
    marginBottom: 12,
  },
  headerIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
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
});
