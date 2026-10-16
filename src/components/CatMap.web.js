import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getImageSource } from '../utils/imageHelper';

export default function CatMap({ cats = [], animals = null, location, onSelectCat }) {
  const list = animals || cats;

  return (
    <View style={styles.webMapContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="map-outline" size={18} color={Colors.primary} />
          <Text style={styles.webMapTitle}>Canlı Hayvan Haritası</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>GPS Aktif</Text>
        </View>
      </View>

      <Text style={styles.webMapSubtitle}>
        Patili dostlarımızın (kedi & köpek) güncel konum pinleri aşağıda listelenmiştir. Profiline gitmek istediğiniz cana tıklayın:
      </Text>

      {/* İnteraktif Pinler Izgarası */}
      <View style={styles.pinGrid}>
        {list.length === 0 ? (
          <View style={styles.emptyMapNotice}>
            <Text style={{ fontSize: 28, marginBottom: 4 }}>📍</Text>
            <Text style={styles.emptyMapNoticeText}>Bu filtreye uygun konum kaydı bulunamadı.</Text>
          </View>
        ) : (
          list.map((animal) => {
            const isDog = animal.isDog || animal.id?.startsWith('dog-');
            const speciesEmoji = isDog ? '🐶' : '🐱';
            const accentColor = isDog ? '#D97706' : Colors.primary;

            return (
              <TouchableOpacity
                key={animal.id}
                style={[styles.pinCard, isDog && styles.pinCardDog]}
                activeOpacity={0.8}
                onPress={() => onSelectCat && onSelectCat(animal)}
              >
                <Image
                  source={getImageSource(animal.photoUri || (animal.photos && animal.photos[0]))}
                  style={styles.catPinAvatar}
                />
                <View style={styles.pinInfo}>
                  <View style={styles.pinTitleRow}>
                    <Text style={styles.catPinName}>{animal.name}</Text>
                    <Text style={styles.pinEmoji}>{speciesEmoji}</Text>
                  </View>
                  <Text style={styles.catPinLocation}>
                    {typeof animal.location === 'object' ? animal.location?.regionName : animal.location}
                  </Text>
                  <Text style={styles.catPinCoords}>
                    {animal.location?.latitude
                      ? `${animal.location.latitude.toFixed(3)}, ${animal.location.longitude.toFixed(3)}`
                      : 'Konum Kayıtlı'}
                  </Text>
                </View>
                <View style={[styles.actionArrowCircle, { backgroundColor: isDog ? '#FEF3C7' : '#FFF0EA' }]}>
                  <Ionicons name="chevron-forward" size={14} color={accentColor} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
    lineHeight: 16,
  },
  pinGrid: {
    gap: 8,
  },
  emptyMapNotice: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyMapNoticeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3E8E2',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pinCardDog: {
    borderColor: '#FDE68A',
  },
  catPinAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    marginRight: 10,
  },
  pinInfo: {
    flex: 1,
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
    fontSize: 13,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});
