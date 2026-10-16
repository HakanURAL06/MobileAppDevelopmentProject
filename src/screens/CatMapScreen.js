import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import CatMap from '../components/CatMap';
import { Colors } from '../theme/colors';
import { getImageSource } from '../utils/imageHelper';

export default function CatMapScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats || []);
  const dogs = useCatStore((state) => state.dogs || []);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);
  const getDogBondLevelInfo = useCatStore((state) => state.getDogBondLevelInfo);

  const [speciesFilter, setSpeciesFilter] = useState('all'); // all | cats | dogs
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch {
        setLocationError('Konum alınamadı');
      }
    })();
  }, []);

  // Kedi ve köpekleri tür etiketiyle birleştir
  const allAnimals = useMemo(() => {
    const catList = cats.map((c) => ({ ...c, isDog: false }));
    const dogList = dogs.map((d) => ({ ...d, isDog: true }));

    if (speciesFilter === 'cats') return catList;
    if (speciesFilter === 'dogs') return dogList;
    return [...catList, ...dogList];
  }, [cats, dogs, speciesFilter]);

  // Bölgelere göre gruplama
  const groupedAnimals = useMemo(() => {
    const groups = {};
    allAnimals.forEach((animal) => {
      const region =
        (typeof animal.location === 'object'
          ? animal.location?.regionName
          : animal.location) || 'Genel Bölge';
      if (!groups[region]) groups[region] = [];
      groups[region].push(animal);
    });
    return Object.entries(groups).map(([regionName, animalList]) => ({
      regionName,
      animalList,
    }));
  }, [allAnimals]);

  const handleSelectAnimal = (animal) => {
    if (animal.isDog || animal.id?.startsWith('dog-')) {
      navigation.navigate('DogDetail', {
        dogId: animal.id,
        dogName: animal.name,
      });
    } else {
      navigation.navigate('CatDetail', {
        catId: animal.id,
        catName: animal.name,
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Canlı Hayvan Haritası 📍</Text>
        <Text style={styles.headerSub}>Bölgelerdeki kedi ve köpek dostların konumları</Text>
      </View>

      {/* TÜR FİLTRESİ (TÜMÜ, KEDİLER, KÖPEKLER) */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, speciesFilter === 'all' && styles.filterChipActive]}
          onPress={() => setSpeciesFilter('all')}
        >
          <Text style={[styles.filterChipText, speciesFilter === 'all' && styles.filterChipTextActive]}>
            Tümü 🐾 ({cats.length + dogs.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, speciesFilter === 'cats' && styles.filterChipActiveCat]}
          onPress={() => setSpeciesFilter('cats')}
        >
          <Text style={[styles.filterChipText, speciesFilter === 'cats' && styles.filterChipTextActive]}>
            Kediler 🐱 ({cats.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, speciesFilter === 'dogs' && styles.filterChipActiveDog]}
          onPress={() => setSpeciesFilter('dogs')}
        >
          <Text style={[styles.filterChipText, speciesFilter === 'dogs' && styles.filterChipTextActive]}>
            Köpekler 🐶 ({dogs.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Harita Kartı */}
      <View style={styles.mapCard}>
        <CatMap
          animals={allAnimals}
          location={location}
          onSelectCat={handleSelectAnimal}
        />
      </View>

      {/* Bölgelere Göre Hayvanlar */}
      <Text style={styles.sectionTitle}>🏘️ Bölgelere Göre Patili Dostlar</Text>
      {groupedAnimals.length === 0 ? (
        <View style={styles.emptyMapListBox}>
          <Text style={styles.emptyMapEmoji}>🐾</Text>
          <Text style={styles.emptyMapTitle}>Henüz haritada gösterilecek can yok</Text>
          <Text style={styles.emptyMapSub}>
            Yeni bir kedi veya köpek eklediğinde burada bölgesi ve harita üzerindeki konumu belirecektir.
          </Text>
        </View>
      ) : (
        groupedAnimals.map((group) => (
          <View key={group.regionName} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <View style={styles.groupTitleBox}>
                <Ionicons name="location" size={16} color={Colors.primary} />
                <Text style={styles.groupTitleText}>{group.regionName}</Text>
              </View>
              <View style={styles.groupCountChip}>
                <Text style={styles.groupCountText}>{group.animalList.length} Can</Text>
              </View>
            </View>

            {group.animalList.map((animal) => {
              const photo =
                (animal.photos && animal.photos.length > 0 ? animal.photos[0] : animal.photoUri) ||
                (animal.isDog
                  ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&q=80'
                  : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80');

              const isDog = animal.isDog || animal.id?.startsWith('dog-');
              const bond = isDog
                ? getDogBondLevelInfo(animal.interactionHistory?.length || 0)
                : getBondLevelInfo(animal.interactionHistory?.length || 0);

              return (
                <TouchableOpacity
                  key={animal.id}
                  style={[styles.animalCard, isDog && styles.animalCardDog]}
                  activeOpacity={0.85}
                  onPress={() => handleSelectAnimal(animal)}
                >
                  <Image source={getImageSource(photo)} style={styles.animalAvatar} />
                  <View style={styles.animalInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.animalName}>{animal.name}</Text>
                      <Text style={{ fontSize: 13, marginLeft: 4 }}>{isDog ? '🐶' : '🐱'}</Text>
                    </View>
                    <Text style={styles.animalBreed}>{animal.breed}</Text>
                  </View>
                  <View style={[styles.bondBadge, { backgroundColor: bond.badgeBg }]}>
                    <Text style={[styles.bondBadgeText, { color: bond.color }]}>
                      {bond.title}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={isDog ? '#D97706' : Colors.primary} />
                </TouchableOpacity>
              );
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.text },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
  },
  filterChipActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  filterChipActiveCat: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipActiveDog: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF5F0',
  },
  groupTitleBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  groupTitleText: { fontSize: 15, fontWeight: '800', color: Colors.text },
  groupCountChip: { backgroundColor: '#FAF5F0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  groupCountText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  animalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF9',
    padding: 10,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F8EDE7',
  },
  animalCardDog: {
    backgroundColor: '#FFFDF5',
    borderColor: '#FEF3C7',
  },
  animalAvatar: { width: 50, height: 50, borderRadius: 14, backgroundColor: Colors.primaryLight },
  animalInfo: { flex: 1, marginLeft: 10 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animalName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  animalBreed: { fontSize: 12, color: Colors.textSecondary },
  bondBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginRight: 6 },
  bondBadgeText: { fontSize: 10, fontWeight: '800' },
  emptyMapListBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emptyMapEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  emptyMapTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyMapSub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
