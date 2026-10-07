import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import CatMap from '../components/CatMap';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);
  const seedSampleCats = useCatStore((state) => state.seedSampleCats);

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(true);

  // Konum izni ve mevcut konumu alma
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Konum izni verilmedi. Varsayılan konum kullanılıyor.');
          setIsLocating(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        });
      } catch (error) {
        setLocationError('Konum alınamadı.');
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  // Kedileri lokasyonlarına (bölge adı) göre gruplandırma
  const groupedCats = useMemo(() => {
    const groups = {};

    cats.forEach((cat) => {
      const region =
        (typeof cat.location === 'object'
          ? cat.location?.regionName
          : cat.location) || 'Diğer Kediler';

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

  // Son etkileşim metni formatlayıcı
  const getLastInteractionText = (cat) => {
    if (!cat.interactionHistory || cat.interactionHistory.length === 0) {
      return 'Henüz etkileşim yok 🌱';
    }
    const last = cat.interactionHistory[0];
    const diffHours = Math.round(
      (Date.now() - new Date(last.date).getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return 'Az önce beslendi/sevildi 🥣';
    if (diffHours < 24) return `${diffHours} saat önce ilgilenildi 🥣`;
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
      {/* Üst Karşılama ve Konum Durumu Barı */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Merhaba Hayvansever! 🐾</Text>
          <Text style={styles.headerSubtitle}>
            Çevrendeki patili dostları keşfet ve ilgilen
          </Text>
        </View>

        <View style={styles.locationBadge}>
          <Ionicons name="navigate-circle" size={18} color="#FF6B6B" />
          <Text style={styles.locationBadgeText}>
            {isLocating
              ? 'Konum alınıyor...'
              : locationError
              ? 'Varsayılan Konum'
              : 'Canlı GPS Aktif'}
          </Text>
        </View>
      </View>

      {/* 1. BÖLÜM: HARİTA GÖRÜNÜMÜ */}
      <View style={styles.mapCard}>
        <View style={styles.mapHeaderRow}>
          <Text style={styles.sectionTitle}>📍 Kedi Haritası</Text>
          <Text style={styles.mapCountBadge}>{cats.length} Kedi Kayıtlı</Text>
        </View>

        {/* Platforma duyarlı (Web / Mobil) Harita Bileşeni */}
        <CatMap
          cats={cats}
          location={location}
          onSelectCat={handleSelectCat}
        />
      </View>

      {/* 2. BÖLÜM: BÖLGELERE GÖRE GRUPLANDIRILMIŞ KEDİ LİSTESİ */}
      <View style={styles.listSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🏘️ Bölgelere Göre Kediler</Text>
          {cats.length === 0 && (
            <TouchableOpacity onPress={seedSampleCats} style={styles.seedButton}>
              <Text style={styles.seedButtonText}>+ Örnek Kedileri Yükle</Text>
            </TouchableOpacity>
          )}
        </View>

        {groupedCats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>😿</Text>
            <Text style={styles.emptyTitle}>Henüz kedi kaydı bulunmuyor</Text>
            <Text style={styles.emptySubtitle}>
              Alt menüdeki "Kedi Ekle" sekmesinden ilk kedini ekleyebilirsin!
            </Text>
          </View>
        ) : (
          groupedCats.map((group) => (
            <View key={group.regionName} style={styles.groupCard}>
              {/* Grup Başlığı */}
              <View style={styles.groupHeader}>
                <View style={styles.groupTitleContainer}>
                  <Ionicons name="location-sharp" size={18} color="#FF6B6B" />
                  <Text style={styles.groupTitleText}>{group.regionName}</Text>
                </View>
                <View style={styles.groupCountChip}>
                  <Text style={styles.groupCountText}>{group.catList.length} Kedi</Text>
                </View>
              </View>

              {/* Grup İçindeki Kedi Kartları */}
              {group.catList.map((cat) => {
                const bondInfo = getBondLevelInfo(cat.bondScore || 0);

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.catCard}
                    activeOpacity={0.85}
                    onPress={() => handleSelectCat(cat)}
                  >
                    {/* Kedi Fotoğrafı / Avatarı */}
                    <Image
                      source={{
                        uri:
                          cat.photoUri ||
                          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80',
                      }}
                      style={styles.catAvatar}
                    />

                    {/* Kedi Bilgileri */}
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
                        <Ionicons name="time-outline" size={14} color="#94A3B8" />
                        <Text style={styles.lastFedText}>
                          {getLastInteractionText(cat)}
                        </Text>
                      </View>
                    </View>

                    {/* Ok İkonu */}
                    <View style={styles.arrowContainer}>
                      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
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
    backgroundColor: '#FAF5FF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3748',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
    marginBottom: 10,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E11D48',
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    marginBottom: 20,
    shadowColor: '#FF6B6B',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  mapCountBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
    backgroundColor: '#FFF0F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listSection: {
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seedButton: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  seedButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  groupCountChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  groupCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  catAvatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFE4E6',
  },
  catDetails: {
    flex: 1,
    marginLeft: 12,
  },
  catNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  catName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  bondBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bondBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  catBreed: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  lastFedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastFedText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  arrowContainer: {
    paddingLeft: 8,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
  },
});
