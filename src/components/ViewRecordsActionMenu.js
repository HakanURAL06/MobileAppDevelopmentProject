import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppTheme from '../theme/useAppTheme';

/**
 * Açılır Kayıt İnceleme Menüsü (Action Dropdown)
 * Kayıtlı kediler, köpekler, bölge klinikleri ve haritayı tek bir şık açılır liste altında toplar.
 * Ana ekrandaki buton ve yazı kalabalığını ortadan kaldırır.
 */
export default function ViewRecordsActionMenu({
  navigation,
  catsCount = 0,
  dogsCount = 0,
  vetsCount = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, colors, language } = useAppTheme();
  const isEn = language === 'en';

  const handleNavigate = (screenName) => {
    setIsOpen(false);
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.wrapper}>
      {/* Ana Açılır Liste Butonu */}
      <TouchableOpacity
        style={[
          styles.mainBtn,
          {
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            borderColor: isDark ? colors.cardBorder : '#E5E7EB',
          },
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.85}
      >
        <View style={styles.btnLeftRow}>
          <View style={[styles.btnIconBadge, { backgroundColor: isDark ? '#1E293B' : '#F0F9FF' }]}>
            <Ionicons name="albums-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.btnTextCol}>
            <Text style={[styles.mainBtnText, { color: colors.text }]}>
              {isEn ? 'View Paws & Clinics 📋' : 'Kayıtlı Canlar & Klinikler 📋'}
            </Text>
            <Text style={[styles.mainBtnSub, { color: colors.textSecondary }]}>
              {isEn
                ? `${catsCount + dogsCount} paws • ${vetsCount} clinics`
                : `${catsCount + dogsCount} can • ${vetsCount} klinik kayıtlı`}
            </Text>
          </View>
        </View>

        <View style={styles.rightGroup}>
          <View style={[styles.countPill, { backgroundColor: isDark ? '#2D201A' : '#FFF2EC' }]}>
            <Text style={[styles.countPillText, { color: colors.primary }]}>
              {catsCount + dogsCount + vetsCount}
            </Text>
          </View>
          <View style={[styles.btnChevronCircle, { backgroundColor: isDark ? colors.surfaceSecondary : '#F3F4F6' }]}>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Açılır Modal / Seçenekler */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.menuCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.modalHeaderRow}>
                  <Text style={[styles.menuTitle, { color: colors.text }]}>
                    {isEn ? 'Select Records to View 🐾' : 'Hangi kayıtları görmek istersin? 🐾'}
                  </Text>
                  <TouchableOpacity
                    style={[styles.closeIconBtn, { backgroundColor: isDark ? colors.surfaceSecondary : '#F3F4F6' }]}
                    onPress={() => setIsOpen(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* 1. Kayıtlı Kediler */}
                <TouchableOpacity
                  style={[
                    styles.menuOption,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : '#FFF8F5',
                      borderColor: isDark ? colors.cardBorder : '#FFE8DD',
                    },
                  ]}
                  onPress={() => handleNavigate('CatList')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIconCircle, { backgroundColor: isDark ? colors.primaryLight : '#FFE8DC' }]}>
                    <Text style={{ fontSize: 24 }}>🐱</Text>
                  </View>
                  <View style={styles.optionTexts}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={[styles.optionTitle, { color: colors.text }]}>
                        {isEn ? 'Registered Cats' : 'Kayıtlı Kediler'}
                      </Text>
                      <View style={[styles.counterBadge, { backgroundColor: isDark ? '#2D201A' : '#FFE8DC' }]}>
                        <Text style={[styles.counterBadgeText, { color: colors.primary }]}>
                          {catsCount} {isEn ? 'Cats' : 'Kedi'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                      {isEn ? 'List, care history, photos and vaccines' : 'Kedi profilleri, fotoğraflar ve aşı takipleri'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                </TouchableOpacity>

                {/* 2. Kayıtlı Köpekler */}
                <TouchableOpacity
                  style={[
                    styles.menuOption,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : '#FFFDF5',
                      borderColor: isDark ? colors.cardBorder : '#FEF3C7',
                    },
                  ]}
                  onPress={() => handleNavigate('DogList')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIconCircle, { backgroundColor: isDark ? '#3D2F14' : '#FEF3C7' }]}>
                    <Text style={{ fontSize: 24 }}>🐶</Text>
                  </View>
                  <View style={styles.optionTexts}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={[styles.optionTitle, { color: colors.text }]}>
                        {isEn ? 'Registered Dogs' : 'Kayıtlı Köpekler'}
                      </Text>
                      <View style={[styles.counterBadge, { backgroundColor: isDark ? '#3D2F14' : '#FEF3C7' }]}>
                        <Text style={[styles.counterBadgeText, { color: '#D97706' }]}>
                          {dogsCount} {isEn ? 'Dogs' : 'Köpek'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                      {isEn ? 'List, walk records, photos and vaccines' : 'Sadık dostlarımız, yürüyüş ve aşı kayıtları'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#D97706" />
                </TouchableOpacity>

                {/* 3. Bölge Hekimleri & Klinikler */}
                <TouchableOpacity
                  style={[
                    styles.menuOption,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : '#F0FDF4',
                      borderColor: isDark ? colors.cardBorder : '#DCFCE7',
                    },
                  ]}
                  onPress={() => handleNavigate('VetList')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIconCircle, { backgroundColor: isDark ? '#064E3B' : '#DCFCE7' }]}>
                    <Text style={{ fontSize: 22 }}>🩺</Text>
                  </View>
                  <View style={styles.optionTexts}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={[styles.optionTitle, { color: colors.text }]}>
                        {isEn ? 'Regional Clinics & Vets' : 'Bölge Hekimleri & Klinikler'}
                      </Text>
                      <View style={[styles.counterBadge, { backgroundColor: isDark ? '#064E3B' : '#DCFCE7' }]}>
                        <Text style={[styles.counterBadgeText, { color: '#059669' }]}>
                          {vetsCount} {isEn ? 'Clinics' : 'Klinik'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                      {isEn ? 'Responsible veterinarians and clinics' : 'Bölgelerdeki sorumlu hekimler ve klinikler'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#059669" />
                </TouchableOpacity>

                {/* 4. Canlı Haritada Gör */}
                <TouchableOpacity
                  style={[
                    styles.menuOption,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : '#F0F9FF',
                      borderColor: isDark ? colors.cardBorder : '#E0F2FE',
                    },
                  ]}
                  onPress={() => handleNavigate('CatMap')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIconCircle, { backgroundColor: isDark ? colors.blueLight : '#E0F2FE' }]}>
                    <Ionicons name="map" size={20} color={colors.blue} />
                  </View>
                  <View style={styles.optionTexts}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>
                      {isEn ? 'Live Map View 📍' : 'Canlı Harita Görünümü 📍'}
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                      {isEn ? 'Explore animals and clinics together' : 'Tüm canları ve klinikleri haritada incele'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.blue} />
                </TouchableOpacity>

                {/* İptal / Kapat Butonu */}
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.borderLight }]}
                  onPress={() => setIsOpen(false)}
                >
                  <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                    {isEn ? 'Close' : 'Kapat'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  btnLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  btnIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextCol: {
    flex: 1,
  },
  mainBtnText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  mainBtnSub: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  btnChevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  closeIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 10,
    gap: 12,
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTexts: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  counterBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  counterBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  optionDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
