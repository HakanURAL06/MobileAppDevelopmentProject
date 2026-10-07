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
  const cats = useCatStore((state) => state.cats);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 1. SEVİMLİ VE MİNİMALİST KARŞILAMA ALANI */}
      <View style={styles.welcomeSection}>
        <View style={styles.catAvatarCircle}>
          <Text style={styles.catAvatarEmoji}>🐱</Text>
        </View>
        <Text style={styles.greetingTitle}>Sokak Kedisi Takibi</Text>
        <Text style={styles.greetingSubtitle}>
          Şehrindeki patili dostları keşfet, besle ve aranızdaki bağı büyüt! ✨
        </Text>

        {/* Küçük Sevimli İstatistik Rozeti */}
        <View style={styles.statChip}>
          <Ionicons name="heart" size={16} color={Colors.secondary} />
          <Text style={styles.statChipText}>
            {cats.length > 0 ? `${cats.length} Patili Dostun Kayıtlı` : 'Henüz Kedi Kaydedilmedi'}
          </Text>
        </View>
      </View>

      {/* 2. BÜYÜK, YUMUŞAK KÖŞELİ VE PASTEL YÖNLENDİRME KARTLARI */}
      <View style={styles.buttonsContainer}>
        {/* Buton 1: Kayıtlı Kedilerim */}
        <TouchableOpacity
          style={[styles.navCard, styles.navCardPeach]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('CatList')}
        >
          <View style={[styles.iconCircle, styles.iconCirclePeach]}>
            <Ionicons name="paw" size={32} color={Colors.primaryDark} />
          </View>
          <View style={styles.navCardTexts}>
            <Text style={styles.navCardTitle}>Kayıtlı Kedilerim</Text>
            <Text style={styles.navCardDesc}>
              Tüm kedi dostlarını gör, fotoğraflarına bak ve besle
            </Text>
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={20} color={Colors.primaryDark} />
          </View>
        </TouchableOpacity>

        {/* Buton 2: Haritada Gör */}
        <TouchableOpacity
          style={[styles.navCard, styles.navCardBlue]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('CatMap')}
        >
          <View style={[styles.iconCircle, styles.iconCircleBlue]}>
            <Ionicons name="map" size={30} color={Colors.blue} />
          </View>
          <View style={styles.navCardTexts}>
            <Text style={styles.navCardTitle}>Haritada Gör</Text>
            <Text style={styles.navCardDesc}>
              Bölgelerindeki kedileri canlı harita üzerinde incele
            </Text>
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={20} color={Colors.blue} />
          </View>
        </TouchableOpacity>

        {/* Buton 3: Yeni Kedi Ekle */}
        <TouchableOpacity
          style={[styles.navCard, styles.navCardPink]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('AddCat')}
        >
          <View style={[styles.iconCircle, styles.iconCirclePink]}>
            <Ionicons name="add-circle" size={32} color={Colors.secondary} />
          </View>
          <View style={styles.navCardTexts}>
            <Text style={styles.navCardTitle}>Yeni Kedi Ekle</Text>
            <Text style={styles.navCardDesc}>
              Sokakta yeni bir can gördüysen hemen fotoğrafıyla kaydet
            </Text>
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. SEVİMLİ GÜNÜN NOTU */}
      <View style={styles.noteBox}>
        <Text style={styles.noteEmoji}>🥣</Text>
        <Text style={styles.noteText}>
          "Bir kap mama, bir kap temiz su ve biraz sevgi her sokak kedisinin gününü güzelleştirir."
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Yumuşak Fildişi / Krem
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  catAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF2EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  catAvatarEmoji: {
    fontSize: 42,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
    marginBottom: 14,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  statChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  navCardPeach: {
    backgroundColor: '#FFFBF7',
    borderColor: '#FFE8DF',
    shadowColor: Colors.primary,
  },
  navCardBlue: {
    backgroundColor: '#F8FCFF',
    borderColor: '#E2F0FD',
    shadowColor: Colors.blue,
  },
  navCardPink: {
    backgroundColor: '#FFF9FB',
    borderColor: '#FFEBF0',
    shadowColor: Colors.secondary,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconCirclePeach: {
    backgroundColor: '#FFF0EA',
  },
  iconCircleBlue: {
    backgroundColor: '#EDF6FD',
  },
  iconCirclePink: {
    backgroundColor: '#FFF0F4',
  },
  navCardTexts: {
    flex: 1,
  },
  navCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  navCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
    maxWidth: '100%',
  },
  noteEmoji: {
    fontSize: 24,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
