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

export default function CatMapScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);

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
      } catch (e) {
        setLocationError('Konum alınamadı');
      }
    })();
  }, []);

  const groupedCats = useMemo(() => {
    const groups = {};
    cats.forEach((cat) => {
      const region =
        (typeof cat.location === 'object'
          ? cat.location?.regionName
          : cat.location) || 'Genel Bölge Kedileri';
      if (!groups[region]) groups[region] = [];
      groups[region].push(cat);
    });
    return Object.entries(groups).map(([regionName, catList]) => ({
      regionName,
      catList,
    }));
  }, [cats]);

  const handleSelectCat = (cat) => {
    navigation.navigate('CatDetail', {
      catId: cat.id,
      catName: cat.name,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kedi Haritası 📍</Text>
        <Text style={styles.headerSub}>Bölgelerdeki patili dostların konumları</Text>
      </View>

      {/* Harita Kartı */}
      <View style={styles.mapCard}>
        <CatMap
          cats={cats}
          location={location}
          onSelectCat={handleSelectCat}
        />
      </View>

      {/* Bölgelere Göre Kediler */}
      <Text style={styles.sectionTitle}>🏘️ Bölgelere Göre Kediler</Text>
      {groupedCats.map((group) => (
        <View key={group.regionName} style={styles.groupCard}>
          <View style={styles.groupHeader}>
            <View style={styles.groupTitleBox}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.groupTitleText}>{group.regionName}</Text>
            </View>
            <View style={styles.groupCountChip}>
              <Text style={styles.groupCountText}>{group.catList.length} Kedi</Text>
            </View>
          </View>

          {group.catList.map((cat) => {
            const photo =
              (cat.photos && cat.photos.length > 0 ? cat.photos[0] : cat.photoUri) ||
              'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80';
            const bond = getBondLevelInfo(cat.interactionHistory?.length || 0);

            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                activeOpacity={0.85}
                onPress={() => handleSelectCat(cat)}
              >
                <Image source={{ uri: photo }} style={styles.catAvatar} />
                <View style={styles.catInfo}>
                  <Text style={styles.catName}>{cat.name}</Text>
                  <Text style={styles.catBreed}>{cat.breed}</Text>
                </View>
                <View style={[styles.bondBadge, { backgroundColor: bond.badgeBg }]}>
                  <Text style={[styles.bondBadgeText, { color: bond.color }]}>
                    {bond.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 14 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.text },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
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
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF9',
    padding: 10,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F8EDE7',
  },
  catAvatar: { width: 50, height: 50, borderRadius: 14, backgroundColor: Colors.primaryLight },
  catInfo: { flex: 1, marginLeft: 10 },
  catName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  catBreed: { fontSize: 12, color: Colors.textSecondary },
  bondBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginRight: 6 },
  bondBadgeText: { fontSize: 10, fontWeight: '800' },
});
