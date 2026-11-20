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
 * Açılır Ekle Butonu Menüsü (Speed-Dial / Action Dropdown)
 * Kedi ve Köpek ekleme seçeneklerini tek bir şık menü altında toplar.
 */
export default function AddAnimalActionMenu({ navigation }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, colors, language } = useAppTheme();
  const isEn = language === 'en';

  const handleOpenCat = () => {
    setIsOpen(false);
    navigation.navigate('AddCat');
  };

  const handleOpenDog = () => {
    setIsOpen(false);
    navigation.navigate('AddDog');
  };

  return (
    <View style={styles.wrapper}>
      {/* Ana Ekle Butonu */}
      <TouchableOpacity
        style={[
          styles.mainBtn,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.88}
      >
        <View style={styles.btnLeftRow}>
          <View style={styles.btnIconCircle}>
            <Ionicons name="add" size={26} color={colors.primary} />
          </View>
          <View style={styles.btnTextCol}>
            <Text style={styles.mainBtnText}>
              {isEn ? 'Register Animal 🐾' : 'Patili Dost Ekle 🐾'}
            </Text>
            <Text style={styles.mainBtnSub}>
              {isEn ? 'Tap to add a new cat or dog' : 'Yeni kedi veya köpek kaydet'}
            </Text>
          </View>
        </View>

        <View style={styles.btnChevronCircle}>
          <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
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
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  {isEn ? 'Which animal would you like to add?' : 'Hangi dostumuzu eklemek istersin?'}
                </Text>

                {/* Kedi Ekle Seçeneği */}
                <TouchableOpacity
                  style={[
                    styles.menuOption,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : '#FFF5F0',
                      borderColor: isDark ? colors.cardBorder : '#FFE4D6',
                    },
                  ]}
                  onPress={handleOpenCat}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIconCircle, { backgroundColor: isDark ? colors.primaryLight : '#FFE8DC' }]}>
                    <Text style={{ fontSize: 24 }}>🐱</Text>
                  </View>
                  <View style={styles.optionTexts}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>
                      {isEn ? 'Add Street Cat 🐱' : 'Sokak Kedisi Ekle 🐱'}
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                      {isEn ? 'Quick photo & location or full profile' : 'Hızlı fotoğraf & konum veya tam profil'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                </TouchableOpacity>

                {/* Köpek Ekle Seçeneği */}
                <TouchableOpacity
                  style={[
                    styles.menuOption,
                    {
                      backgroundColor: isDark ? colors.surfaceSecondary : '#FFFDF5',
                      borderColor: isDark ? colors.cardBorder : '#FDE68A',
                    },
                  ]}
                  onPress={handleOpenDog}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIconCircle, { backgroundColor: isDark ? '#3D2F14' : '#FEF3C7' }]}>
                    <Text style={{ fontSize: 24 }}>🐶</Text>
                  </View>
                  <View style={styles.optionTexts}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>
                      {isEn ? 'Add Street Dog 🐶' : 'Sokak Köpeği Ekle 🐶'}
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                      {isEn ? 'Quick photo & location or full profile' : 'Hızlı fotoğraf & konum veya tam profil'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#D97706" />
                </TouchableOpacity>

                {/* İptal Butonu */}
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.borderLight }]}
                  onPress={() => setIsOpen(false)}
                >
                  <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                    {isEn ? 'Cancel' : 'Vazgeç'}
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  btnLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  btnIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnTextCol: {
    flex: 1,
  },
  mainBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  mainBtnSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 2,
    fontWeight: '500',
  },
  btnChevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTexts: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  optionDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
