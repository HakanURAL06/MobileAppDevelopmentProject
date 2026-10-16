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
import { Colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats || []);
  const dogs = useCatStore((state) => state.dogs || []);

  const totalAnimals = cats.length + dogs.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 1. SEVİMLİ VE MİNİMALİST KARŞILAMA ALANI */}
      <View style={styles.welcomeSection}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🐱</Text>
          </View>
          <View style={[styles.avatarCircle, { backgroundColor: '#FEF3C7', marginLeft: -16 }]}>
            <Text style={styles.avatarEmoji}>🐶</Text>
          </View>
        </View>

        <Text style={styles.greetingTitle}>Sokak Hayvanları Takibi 🐾</Text>
        <Text style={styles.greetingSubtitle}>
          Şehrindeki patili dostları keşfet, besle, yürüyüşe çıkar ve aranızdaki bağı büyüt! ✨
        </Text>

        {/* İstatistik Rozetleri */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statChip}
            onPress={() => navigation.navigate('CatList')}
            activeOpacity={0.8}
          >
            <Text style={styles.statChipEmoji}>🐱</Text>
            <Text style={styles.statChipText}>{cats.length} Kedi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statChip, { borderColor: '#FDE68A' }]}
            onPress={() => navigation.navigate('DogList')}
            activeOpacity={0.8}
          >
            <Text style={styles.statChipEmoji}>🐶</Text>
            <Text style={[styles.statChipText, { color: '#D97706' }]}>{dogs.length} Köpek</Text>
          </TouchableOpacity>

          <View style={[styles.statChip, { backgroundColor: '#FAF5F0' }]}>
            <Ionicons name="heart" size={14} color={Colors.secondary} />
            <Text style={styles.statChipText}>{totalAnimals} Toplam Can</Text>
          </View>
        </View>
      </View>

      {/* 2. BÜYÜK YÖNLENDİRME KARTLARI */}
      <View style={styles.buttonsContainer}>
        {/* Buton 1: Kayıtlı Kedilerim */}
        <TouchableOpacity
          style={[styles.navCard, styles.navCardPeach]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('CatList')}
        >
          <View style={[styles.iconCircle, styles.iconCirclePeach]}>
            <Text style={{ fontSize: 30 }}>🐱</Text>
          </View>
          <View style={styles.navCardTexts}>
            <View style={styles.cardTitleBadgeRow}>
              <Text style={styles.navCardTitle}>Kayıtlı Kedilerim</Text>
              <View style={styles.counterBadgePeach}>
                <Text style={styles.counterBadgeTextPeach}>{cats.length} Kedi</Text>
              </View>
            </View>
            <Text style={styles.navCardDesc}>
              Tüm kedi dostlarını gör, fotoğraflarına bak, besle ve aşılarını takip et
            </Text>
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={20} color={Colors.primaryDark} />
          </View>
        </TouchableOpacity>

        {/* Buton 2: Kayıtlı Köpeklerim */}
        <TouchableOpacity
          style={[styles.navCard, styles.navCardAmber]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('DogList')}
        >
          <View style={[styles.iconCircle, styles.iconCircleAmber]}>
            <Text style={{ fontSize: 30 }}>🐶</Text>
          </View>
          <View style={styles.navCardTexts}>
            <View style={styles.cardTitleBadgeRow}>
              <Text style={styles.navCardTitle}>Kayıtlı Köpeklerim</Text>
              <View style={styles.counterBadgeAmber}>
                <Text style={styles.counterBadgeTextAmber}>{dogs.length} Köpek</Text>
              </View>
            </View>
            <Text style={styles.navCardDesc}>
              Sadık köpek dostlarını gör, yürüyüşe çıkar, oyun oyna ve aşılarını planla
            </Text>
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={20} color="#D97706" />
          </View>
        </TouchableOpacity>

        {/* Buton 3: Canlı Haritada Gör */}
        <TouchableOpacity
          style={[styles.navCard, styles.navCardBlue]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('CatMap')}
        >
          <View style={[styles.iconCircle, styles.iconCircleBlue]}>
            <Ionicons name="map" size={28} color={Colors.blue} />
          </View>
          <View style={styles.navCardTexts}>
            <Text style={styles.navCardTitle}>Canlı Hayvan Haritası</Text>
            <Text style={styles.navCardDesc}>
              Bölgelerindeki kedi ve köpekleri harita üzerinde canlı incele
            </Text>
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={20} color={Colors.blue} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. HIZLI EKLEME BUTONLARI (KEDİ & KÖPEK) */}
      <View style={styles.quickAddRow}>
        <TouchableOpacity
          style={styles.quickAddBtnCat}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddCat')}
        >
          <Ionicons name="add-circle" size={20} color={Colors.primary} />
          <Text style={styles.quickAddBtnTextCat}>+ Yeni Kedi Ekle 🐱</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAddBtnDog}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddDog')}
        >
          <Ionicons name="add-circle" size={20} color="#D97706" />
          <Text style={styles.quickAddBtnTextDog}>+ Yeni Köpek Ekle 🐶</Text>
        </TouchableOpacity>
      </View>

      {/* 4. GÜNÜN NOTU */}
      <View style={styles.noteBox}>
        <Text style={styles.noteEmoji}>🥣</Text>
        <Text style={styles.noteText}>
          "Bir kap mama, bir kap temiz su ve biraz sevgi her sokak canının gününü güzelleştirir."
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF2EC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: Colors.cardShadow,
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
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 300,
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
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
    color: Colors.text,
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
    shadowColor: Colors.primary,
  },
  navCardAmber: {
    backgroundColor: '#FFFCF5',
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
  },
  navCardBlue: {
    backgroundColor: '#F8FCFF',
    borderColor: '#E2F0FD',
    shadowColor: Colors.blue,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconCirclePeach: {
    backgroundColor: '#FFF0EA',
  },
  iconCircleAmber: {
    backgroundColor: '#FEF3C7',
  },
  iconCircleBlue: {
    backgroundColor: '#EDF6FD',
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
    color: Colors.text,
  },
  counterBadgePeach: {
    backgroundColor: '#FFF0EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  counterBadgeTextPeach: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  counterBadgeAmber: {
    backgroundColor: '#FEF3C7',
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
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFF2EC',
    borderWidth: 1.5,
    borderColor: '#FFD9CB',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  quickAddBtnTextCat: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  quickAddBtnDog: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
    width: '100%',
  },
  noteEmoji: {
    fontSize: 22,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 17,
  },
});
