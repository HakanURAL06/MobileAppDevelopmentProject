import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import CatMap from '../components/CatMap';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);
  const seedSampleCats = useCatStore((state) => state.seedSampleCats);

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(true);

  // GPS Konum İzni ve Canlı Koordinatlar
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Konum izni verilmedi');
          setIsLocating(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        setLocationError('Konum alınamadı');
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  // Kedileri bölgelere göre gruplandırma
  const groupedCats = useMemo(() => {
    const groups = {};

    cats.forEach((cat) => {
      const region =
        (typeof cat.location === 'object'
          ? cat.location?.regionName
          : cat.location) || 'Genel Bölge Kedileri';

      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(cat);
    });

    return Object.entries(groups).map(([regionName, catList]) => ({
      regionName,
      catList,
    }));
  }, [cats]);

  // Son Beslenme Metni Formatlayıcı
  const getLastFedText = (cat) => {
    const list = cat.interactionHistory || [];
    if (list.length === 0) return 'Henüz beslenmedi 🌱';
    const last = list[0];
    const diffHours = Math.round(
      (Date.now() - new Date(last.date).getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return 'Az önce beslendi 🥣';
    if (diffHours < 24) return `${diffHours} sa önce beslendi 🥣`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce ilgilenildi 🥣`;
  };

  const handleSelectCat = (cat) => {
    navigation.navigate('CatDetail', {
      catId: cat.id,
      catName: cat.name,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* 1. ÜST KARŞILAMA VE GPS BİLGİ ALANI */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Merhaba Hayvansever! 🐾</Text>
          <Text style={styles.headerSubtitle}>
            Çevrendeki patili dostları keşfet ve ilgilen
          </Text>
        </View>

        <View style={styles.gpsPill}>
          <Ionicons
            name="navigate-circle"
            size={16}
            color={locationError ? '#E11D48' : Colors.primaryDark}
          />
          <Text style={styles.gpsText}>
            {isLocating
              ? 'GPS alınıyor...'
              : locationError
              ? 'GPS Kapalı'
              : 'Canlı GPS Aktif'}
          </Text>
        </View>
      </View>

      {/* 2. HARİTA ALANI (Web / Native Uyumlu) */}
      <View style={styles.mapCard}>
        <View style={styles.mapHeaderRow}>
          <View style={styles.mapHeaderTitleBox}>
            <Ionicons name="map" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Patili Dostlar Haritası</Text>
          </View>
          <View style={styles.catCountChip}>
            <Text style={styles.catCountChipText}>{cats.length} Kedi</Text>
          </View>
        </View>

        <CatMap
          cats={cats}
          location={location}
          onSelectCat={handleSelectCat}
        />
      </View>

      {/* 3. BÖLGELERE GÖRE GRUPLANMIŞ KEDİ LİSTESİ */}
      <View style={styles.listSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🏘️ Bölgelere Göre Kediler</Text>
          {cats.length === 0 && (
            <TouchableOpacity onPress={seedSampleCats} style={styles.seedButton}>
              <Text style={styles.seedButtonText}>+ Örnek Kedileri Getir</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* EDGE CASE: HİÇ KEDİ OLMADIĞI DURUM (Prompt 6 Gereksinimi) */}
        {groupedCats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyEmojiCircle}>
              <Text style={styles.emptyEmoji}>🐾</Text>
            </View>
            <Text style={styles.emptyTitle}>
              Henüz kedi eklenmedi, hadi dışarı çıkıp patili dostlar bulalım! 🐱
            </Text>
            <Text style={styles.emptySubtitle}>
              Sokakta gördüğün, beslediğin veya sevdiğin kedileri haritana ekleyerek ilk adımı atabilirsin.
            </Text>
            <TouchableOpacity
              style={styles.addCatEmptyBtn}
              onPress={() => navigation.navigate('AddCat')}
            >
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              <Text style={styles.addCatEmptyBtnText}>İlk Kedini Ekle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          groupedCats.map((group) => (
            <View key={group.regionName} style={styles.groupCard}>
              {/* Grup Başlığı */}
              <View style={styles.groupHeader}>
                <View style={styles.groupTitleContainer}>
                  <Ionicons name="location" size={18} color={Colors.primary} />
                  <Text style={styles.groupTitleText}>{group.regionName}</Text>
                </View>
                <View style={styles.groupCountChip}>
                  <Text style={styles.groupCountText}>{group.catList.length} Kedi</Text>
                </View>
              </View>

              {/* Grup İçindeki Kedi Kartları */}
              {group.catList.map((cat) => {
                const bondInfo = getBondLevelInfo(cat.interactionHistory?.length || 0);

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.catCard}
                    activeOpacity={0.85}
                    onPress={() => handleSelectCat(cat)}
                  >
                    <Image
                      source={{
                        uri:
                          cat.photoUri ||
                          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80',
                      }}
                      style={styles.catAvatar}
                    />

                    <View style={styles.catDetails}>
                      <View style={styles.catNameRow}>
                        <Text style={styles.catName}>{cat.name}</Text>
                        <View
                          style={[
                            styles.bondBadge,
                            { backgroundColor: bondInfo.badgeBg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.bondBadgeText,
                              { color: bondInfo.color },
                            ]}
                          >
                            {bondInfo.title}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.catBreed}>{cat.breed}</Text>

                      <View style={styles.lastFedRow}>
                        <Ionicons name="time-outline" size={13} color={Colors.primaryDark} />
                        <Text style={styles.lastFedText}>
                          {getLastFedText(cat)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.arrowCircle}>
                      <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Fildişi Krem Arka Plan
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 23,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  gpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
    marginLeft: 8,
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapHeaderTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  catCountChip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  catCountChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  listSection: {
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seedButton: {
    backgroundColor: Colors.blueLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  seedButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.blue,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF5F0',
    marginBottom: 12,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  groupCountChip: {
    backgroundColor: '#FAF5F0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  groupCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF9',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F8EDE7',
  },
  catAvatar: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
  },
  catDetails: {
    flex: 1,
    marginLeft: 12,
  },
  catNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  catName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  bondBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  bondBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  catBreed: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  lastFedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastFedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  emptyEmojiCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyEmoji: {
    fontSize: 34,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: 280,
  },
  addCatEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 18,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addCatEmptyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
