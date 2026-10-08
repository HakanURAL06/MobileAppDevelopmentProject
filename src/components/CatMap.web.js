import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getImageSource } from '../utils/imageHelper';

export default function CatMap({ cats = [], location, onSelectCat }) {
  return (
    <View style={styles.webMapContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="map-outline" size={18} color={Colors.primary} />
          <Text style={styles.webMapTitle}>Canlı Kedi Haritası</Text>
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
              source={getImageSource(cat.photoUri || (cat.photos && cat.photos[0]))}
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
            <View style={styles.actionArrowCircle}>
              <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webMapContainer: {
    backgroundColor: '#FFFBF9',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F8EDE7',
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
    gap: 7,
  },
  webMapTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  webMapSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  catPinAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
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
    fontWeight: '800',
    color: Colors.text,
  },
  pinEmoji: {
    fontSize: 12,
  },
  catPinLocation: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  catPinCoords: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  actionArrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
