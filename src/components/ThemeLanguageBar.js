import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppTheme from '../theme/useAppTheme';

/**
 * Açık/Koyu Tema ve Türkçe/İngilizce Dil Değiştirici Çubuğu
 * 
 * @param {object} props
 * @param {'inline'|'compact'} [props.variant='inline'] - Görünüm tipi
 */
export default function ThemeLanguageBar({ variant = 'inline' }) {
  const { isDark, toggleTheme, language, toggleLanguage, colors, t } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: isDark ? colors.cardBorder : '#F3EAE3' }]}>
      {/* 1. TEMA DEĞİŞTİRİCİ */}
      <View style={styles.group}>
        <View style={styles.groupLabelRow}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={15} color={isDark ? '#FBBF24' : '#F59E0B'} />
          <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
            {isDark ? t.themeDark : t.themeLight}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: isDark ? colors.cardBorder : colors.primaryLight }]}
          onPress={toggleTheme}
          activeOpacity={0.8}
          accessibilityLabel={t.themeToggleHint}
        >
          <View style={[styles.miniPill, !isDark && styles.activePillLight]}>
            <Text style={[styles.pillEmoji]}>☀️</Text>
            <Text style={[styles.pillText, !isDark ? styles.activePillTextLight : { color: colors.textMuted }]}>
              {language === 'en' ? 'Light' : 'Açık'}
            </Text>
          </View>
          <View style={[styles.miniPill, isDark && styles.activePillDark]}>
            <Text style={[styles.pillEmoji]}>🌙</Text>
            <Text style={[styles.pillText, isDark ? styles.activePillTextDark : { color: colors.textMuted }]}>
              {language === 'en' ? 'Dark' : 'Koyu'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* DİKEY AYRAÇ */}
      <View style={[styles.divider, { backgroundColor: isDark ? colors.cardBorder : '#EFE4DD' }]} />

      {/* 2. DİL DEĞİŞTİRİCİ */}
      <View style={styles.group}>
        <View style={styles.groupLabelRow}>
          <Ionicons name="globe-outline" size={15} color={colors.primary} />
          <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
            {language === 'tr' ? 'Türkçe' : 'English'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: isDark ? colors.cardBorder : colors.primaryLight }]}
          onPress={toggleLanguage}
          activeOpacity={0.8}
          accessibilityLabel={t.langToggleHint}
        >
          <View style={[styles.miniPill, language === 'tr' && (isDark ? styles.activePillDark : styles.activePillLight)]}>
            <Text style={styles.pillEmoji}>🇹🇷</Text>
            <Text
              style={[
                styles.pillText,
                language === 'tr'
                  ? (isDark ? styles.activePillTextDark : styles.activePillTextLight)
                  : { color: colors.textMuted },
              ]}
            >
              TR
            </Text>
          </View>
          <View style={[styles.miniPill, language === 'en' && (isDark ? styles.activePillDark : styles.activePillLight)]}>
            <Text style={styles.pillEmoji}>🇬🇧</Text>
            <Text
              style={[
                styles.pillText,
                language === 'en'
                  ? (isDark ? styles.activePillTextDark : styles.activePillTextLight)
                  : { color: colors.textMuted },
              ]}
            >
              EN
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  group: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  groupLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 2,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 38,
    marginHorizontal: 10,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 2,
  },
  miniPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 10,
    gap: 3,
  },
  pillEmoji: {
    fontSize: 11,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  activePillLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activePillDark: {
    backgroundColor: '#FF9A76',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  activePillTextLight: {
    color: '#F08055',
  },
  activePillTextDark: {
    color: '#1A1D27',
  },
});
