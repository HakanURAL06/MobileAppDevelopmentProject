import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppTheme from '../theme/useAppTheme';
import { calculateCareAnalytics } from '../utils/careAnalytics';

/**
 * Ana ekrandaki sade, tıklanabilir özet kartı.
 * Kullanıcıyı boğmaz; tek dokunuşla tam teşekküllü Pati Karnesi & İlgi Özeti sayfasına yönlendirir.
 */
export default function CareSummaryCard({ cats = [], dogs = [], onPressDetails }) {
  const { isDark, colors, language } = useAppTheme();

  const stats = useMemo(() => calculateCareAnalytics(cats, dogs), [cats, dogs]);
  const isEn = language === 'en';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={onPressDetails}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isDark ? colors.primaryLight : '#FFF0EA' },
            ]}
          >
            <Ionicons name="heart-half" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              {isEn ? 'Paw Passport & Care Summary' : 'Pati Karnesi & İlgi Özeti'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isEn ? 'Tap to view full analytics' : 'Detaylı analiz için dokun'}
            </Text>
          </View>
        </View>

        <View style={[styles.arrowBtn, { backgroundColor: isDark ? colors.surfaceSecondary : '#F7F2EE' }]}>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </View>
      </View>

      {/* 3 Temel Sade Metrik */}
      <View style={styles.metricsRow}>
        <View
          style={[
            styles.metricChip,
            { backgroundColor: isDark ? colors.surfaceSecondary : '#FFF9F5' },
          ]}
        >
          <Text style={[styles.metricVal, { color: colors.primary }]}>
            {stats.totalInteractions}
          </Text>
          <Text style={[styles.metricLbl, { color: colors.textSecondary }]}>
            {isEn ? 'Care Actions' : 'Bakım & İlgi'}
          </Text>
        </View>

        <View
          style={[
            styles.metricChip,
            { backgroundColor: isDark ? colors.surfaceSecondary : '#F3FAF6' },
          ]}
        >
          <Text style={[styles.metricVal, { color: '#2E9E5B' }]}>
            {stats.completedVaccinesCount}
          </Text>
          <Text style={[styles.metricLbl, { color: colors.textSecondary }]}>
            {isEn ? 'Vaccines' : 'Yapılan Aşı'}
          </Text>
        </View>

        <View
          style={[
            styles.metricChip,
            { backgroundColor: isDark ? colors.surfaceSecondary : '#F4F9FE' },
          ]}
        >
          <Text style={[styles.metricVal, { color: colors.blue }]}>
            {stats.scheduledVaccinesCount}
          </Text>
          <Text style={[styles.metricLbl, { color: colors.textSecondary }]}>
            {isEn ? 'Planned' : 'Planlanan Aşı'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricChip: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricLbl: {
    fontSize: 11,
    fontWeight: '700',
  },
});
