import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CatMap({ cats = [], location, onSelectCat }) {
  return (
    <View style={styles.webMapContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="map-outline" size={20} color="#FF6B6B" />
          <Text style={styles.webMapTitle}>Canlı Kedi Haritası (Web Görünümü)</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>GPS Aktif</Text>
        </View>
      </View>

      <Text style={styles.webMapSubtitle}>
        Patili dostlarımızın güncel konum pinleri aşağıda listelenmiştir. Profiline gitmek istediğiniz kediye tıklayın:
      </Text>

      {/* İnteraktif Kedi Pinleri Izgarası */}
      <View style={styles.pinGrid}>
        {cats.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.pinCard}
            activeOpacity={0.8}
            onPress={() => onSelectCat && onSelectCat(cat)}
          >
            <Image
              source={{
                uri:
                  cat.photoUri ||
                  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80',
              }}
              style={styles.catPinAvatar}
            />
            <View style={styles.pinInfo}>
              <View style={styles.pinTitleRow}>
                <Text style={styles.catPinName}>{cat.name}</Text>
                <Text style={styles.pinEmoji}>📍</Text>
              </View>
              <Text style={styles.catPinLocation}>
                {typeof cat.location === 'object' ? cat.location?.regionName : cat.location}
              </Text>
              <Text style={styles.catPinCoords}>
                {cat.location?.latitude ? `${cat.location.latitude.toFixed(3)}, ${cat.location.longitude.toFixed(3)}` : 'Konum Kayıtlı'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webMapContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webMapTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  webMapSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 18,
  },
  pinGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FED7D7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  catPinAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFE4E6',
  },
  pinInfo: {
    flex: 1,
    marginLeft: 10,
  },
  pinTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  catPinName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  pinEmoji: {
    fontSize: 12,
  },
  catPinLocation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  catPinCoords: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
});
