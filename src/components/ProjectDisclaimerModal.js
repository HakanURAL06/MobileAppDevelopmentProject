import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppTheme from '../theme/useAppTheme';
import { Colors } from '../theme/colors';

export default function ProjectDisclaimerModal({ visible, onClose }) {
  const { isDark, colors, language } = useAppTheme();
  const isEn = language === 'en';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Üst Başlık & Kapat Butonu */}
          <View style={[styles.headerRow, { borderBottomColor: colors.cardBorder }]}>
            <View style={styles.headerLeft}>
              <View style={styles.badgeIcon}>
                <Ionicons name="school" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>
                  {isEn ? 'Academic Project Notice' : 'Akademik Proje Künyesi'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Mobile Application Development
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: isDark ? colors.background : '#F3F4F6' }]}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Geliştirici & Öğrenci Künyesi */}
            <View style={[styles.infoBox, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  {isEn ? 'Course:' : 'Ders:'}
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  Mobile Application Development
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  {isEn ? 'Developer / Author:' : 'Geliştirici / Yapımcı:'}
                </Text>
                <Text style={[styles.infoValue, { color: Colors.primary, fontWeight: '800' }]}>
                  Hakan Ural
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  {isEn ? 'Student ID:' : 'Öğrenci No:'}
                </Text>
                <Text style={[styles.infoValue, { color: colors.text, fontWeight: '800' }]}>
                  0515240030
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  {isEn ? 'Technology Stack:' : 'Teknoloji Yığını:'}
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  React Native • Expo SDK 57 • Zustand • EAS Update
                </Text>
              </View>
            </View>

            {/* Resmi Açıklama & Kurgusal Bildirim */}
            <View style={styles.disclaimerSection}>
              <View style={styles.alertHeader}>
                <Ionicons name="shield-checkmark" size={18} color="#10B981" />
                <Text style={[styles.disclaimerHeading, { color: colors.text }]}>
                  {isEn ? 'Official Disclaimer & Scope' : 'Resmi Açıklama ve Kapsam Bildirimi'}
                </Text>
              </View>

              <Text style={[styles.disclaimerBody, { color: colors.text }]}>
                {isEn
                  ? 'This mobile software has been engineered exclusively as a term project within the scope of the Mobile Application Development curriculum. All veterinary profiles, clinic identities, emergency contact numbers (featuring 000 demo lines), street animals, health interactions, and geo-coordinates represented in this system are purely fictitious, educational simulation models designed to showcase advanced mobile architecture and user experience paradigms.'
                  : 'Bu mobil yazılım, Mobile Application Development dersi müfredatı kapsamında dönem projesi olarak geliştirilmiştir. Uygulama içerisinde yer alan tüm veteriner hekim kayıtları, klinik isimleri, iletişim ve acil durum telefonları (sahte olduğu belirgin 000 simülasyon hatları), sokak hayvanları, sağlık ve bakım etkileşimleri ile harita koordinatları tamamen eğitim, simülasyon ve kullanıcı deneyimi (UX) modelleme amaçlı kurgulanmıştır.'}
              </Text>

              <Text style={[styles.disclaimerBody, { color: colors.textSecondary, marginTop: 10 }]}>
                {isEn
                  ? 'This application does not represent any commercial clinic, veterinary surgeon, or public emergency entity. Its architecture demonstrates real-time asynchronous state hydration, local database persistence (AsyncStorage), interactive mapping, dynamic localization (TR/EN), and cloud updates without Docker dependencies.'
                  : 'Sistem gerçek şahıs, ticari klinik veya resmi acil çağrı merkezlerini temsil etmemektedir. Proje mimarisi; React Native yerel depolama kalıcılığı (AsyncStorage & Zustand), interaktif harita entegrasyonu, çift dilli yerelleştirme (TR/EN) ve Docker bağımlılığı olmaksızın doğrudan Expo & EAS Update bulut dağıtım yeteneklerini sergilemektedir.'}
              </Text>
            </View>

            {/* Teşekkür & Kapat */}
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: Colors.primary }]}
              onPress={onClose}
              activeOpacity={0.88}
            >
              <Text style={styles.confirmBtnText}>
                {isEn ? 'I Understand (Close)' : 'Anladım (Kapat)'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    marginTop: 14,
  },
  infoBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  disclaimerSection: {
    marginBottom: 18,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  disclaimerHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  disclaimerBody: {
    fontSize: 13,
    lineHeight: 19,
  },
  confirmBtn: {
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
