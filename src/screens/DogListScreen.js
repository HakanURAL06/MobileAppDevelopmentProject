import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';
import { getImageSource } from '../utils/imageHelper';

const GROUP_OPTIONS = [
  { id: 'all', title: 'Tümü', emoji: '📋' },
  { id: 'location', title: 'Konuma Göre', emoji: '📍' },
  { id: 'breed', title: 'Cinsine Göre', emoji: '🐾' },
  { id: 'bond', title: 'Sadakat Seviyesine Göre', emoji: '💖' },
];

export default function DogListScreen({ navigation }) {
  const dogs = useCatStore((state) => state.dogs || []);
  const deleteDog = useCatStore((state) => state.deleteDog);
  const getDogBondLevelInfo = useCatStore((state) => state.getDogBondLevelInfo);

  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('all');
  const [dogToDelete, setDogToDelete] = useState(null);

  const handleDeleteDog = (dog) => {
    setDogToDelete(dog);
  };

  const filteredDogs = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase('tr');
    if (!q) return dogs;

    return dogs.filter((dog) => {
      const nameMatch = (dog.name || '').toLocaleLowerCase('tr').includes(q);
      const locStr = (
        typeof dog.location === 'object' ? dog.location?.regionName : dog.location
      ) || '';
      const locMatch = locStr.toLocaleLowerCase('tr').includes(q);
      const breedMatch = (dog.breed || '').toLocaleLowerCase('tr').includes(q);
      return nameMatch || locMatch || breedMatch;
    });
  }, [dogs, searchQuery]);

  const groupedSections = useMemo(() => {
    if (groupBy === 'all' || filteredDogs.length === 0) return [];

    if (groupBy === 'location') {
      const map = {};
      filteredDogs.forEach((dog) => {
        const locName =
          (typeof dog.location === 'object'
            ? dog.location?.regionName
            : dog.location)?.trim() || 'Bilinmeyen Konum';
        if (!map[locName]) {
          map[locName] = [];
        }
        map[locName].push(dog);
      });

      return Object.keys(map)
        .sort((a, b) => a.localeCompare(b, 'tr'))
        .map((locName) => ({
          title: locName,
          emoji: '📍',
          data: map[locName],
        }));
    }

    if (groupBy === 'breed') {
      const map = {};
      filteredDogs.forEach((dog) => {
        const breedName = dog.breed?.trim() || 'Sokak Köpeği / Melez';
        if (!map[breedName]) {
          map[breedName] = [];
        }
        map[breedName].push(dog);
      });

      return Object.keys(map)
        .sort((a, b) => a.localeCompare(b, 'tr'))
        .map((breedName) => ({
          title: breedName,
          emoji: '🐾',
          data: map[breedName],
        }));
    }

    if (groupBy === 'bond') {
      const tiers = [
        {
          title: 'Can Yoldaşı (Level 3 - 9+ Etkileşim)',
          emoji: '💖',
          filter: (d) => (d.interactionHistory?.length || 0) >= 9,
        },
        {
          title: 'Sadık Dost (Level 2 - 4-8 Etkileşim)',
          emoji: '🐕',
          filter: (d) => {
            const l = d.interactionHistory?.length || 0;
            return l >= 4 && l < 9;
          },
        },
        {
          title: 'Tanışıklık (Level 1 - 1-3 Etkileşim)',
          emoji: '🐾',
          filter: (d) => {
            const l = d.interactionHistory?.length || 0;
            return l >= 1 && l < 4;
          },
        },
        {
          title: 'Yeni Tanışma (Level 0 - 0 Etkileşim)',
          emoji: '🌱',
          filter: (d) => (d.interactionHistory?.length || 0) === 0,
        },
      ];

      return tiers
        .map((tier) => ({
          title: tier.title,
          emoji: tier.emoji,
          data: filteredDogs.filter(tier.filter),
        }))
        .filter((section) => section.data.length > 0);
    }

    return [];
  }, [filteredDogs, groupBy]);

  const renderDogItem = ({ item }) => {
    const photo =
      (item.photos && item.photos.length > 0 ? item.photos[0] : item.photoUri) ||
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80';

    const photoCount = item.photos?.length || (item.photoUri ? 1 : 0);
    const interactionCount = item.interactionHistory?.length || 0;
    const bondInfo = getDogBondLevelInfo(interactionCount);
    const locationName =
      typeof item.location === 'object' ? item.location?.regionName : item.location;
    const vacCount = item.vaccinations?.length || 0;
    const schCount = item.scheduledVaccines?.length || 0;

    return (
      <TouchableOpacity
        style={styles.dogCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('DogDetail', {
            dogId: item.id,
            dogName: item.name,
          })
        }
      >
        <Image source={getImageSource(photo)} style={styles.dogImage} />

        <View style={styles.dogInfo}>
          <View style={styles.dogTopRow}>
            <Text style={styles.dogName} numberOfLines={1}>
              {item.name}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteDog(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={17} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.dogBreed} numberOfLines={1}>
            🐕 {item.breed}
          </Text>
          <Text style={styles.dogLocation} numberOfLines={1}>
            📍 {locationName || 'Bölge Belirtilmedi'}
          </Text>

          {item.notes && item.notes.trim().length > 0 ? (
            <View style={styles.notePreviewBox}>
              <Ionicons name="document-text-outline" size={12} color="#D97706" />
              <Text style={styles.notePreviewText} numberOfLines={1}>
                {item.notes}
              </Text>
            </View>
          ) : null}

          <View style={styles.badgeRow}>
            <View style={[styles.bondBadge, { backgroundColor: bondInfo.badgeBg }]}>
              <Text style={[styles.bondBadgeText, { color: bondInfo.color }]}>
                {bondInfo.title}
              </Text>
            </View>

            {vacCount > 0 && (
              <View style={styles.vaccineBadge}>
                <Ionicons name="shield-checkmark" size={11} color="#059669" />
                <Text style={styles.vaccineBadgeText}>{vacCount} Aşı</Text>
              </View>
            )}

            {schCount > 0 && (
              <View style={styles.scheduledBadge}>
                <Ionicons name="calendar-outline" size={11} color="#D97706" />
                <Text style={styles.scheduledBadgeText}>{schCount} Plan</Text>
              </View>
            )}

            <View style={styles.metaBadge}>
              <Ionicons name="images-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaBadgeText}>{photoCount} Foto</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <View style={styles.sectionEmojiBadge}>
          <Text style={styles.sectionEmojiText}>{section.emoji}</Text>
        </View>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <View style={styles.sectionCountBadge}>
        <Text style={styles.sectionCountText}>{section.data.length} Köpek</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Kayıtlı Köpeklerim 🐶</Text>
          <Text style={styles.headerSub}>Takip ettiğin tüm sadık dostlar</Text>
        </View>
        <View style={[styles.countPill, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.countPillText, { color: '#D97706' }]}>
            {searchQuery.trim().length > 0
              ? `${filteredDogs.length} / ${dogs.length} Köpek`
              : `${dogs.length} Köpek`}
          </Text>
        </View>
      </View>

      {/* ARAMA ÇUBUĞU */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarBox}>
          <Ionicons name="search" size={18} color="#D97706" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Köpek adı, cins veya konum ara (örn: Karabaş, Park)..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* GRUPLAMA SEÇİCİ */}
      {dogs.length > 0 && (
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {GROUP_OPTIONS.map((opt) => {
              const isActive = groupBy === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setGroupBy(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.filterChipEmoji}>{opt.emoji}</Text>
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {opt.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* LİSTE VEYA BOŞ DURUM */}
      {dogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.emptyIconEmoji}>🐕</Text>
          </View>
          <Text style={styles.emptyTitle}>Henüz hiç köpek dost eklemedin 🐶</Text>
          <Text style={styles.emptySubtitle}>
            Sokaktaki sevimli köpek dostlarını kaydetmek ve takip etmek için aşağıdaki butona dokunabilirsin!
          </Text>

          <TouchableOpacity
            style={[styles.emptyAddBtn, { backgroundColor: '#D97706', shadowColor: '#D97706' }]}
            onPress={() => navigation.navigate('AddDog')}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.emptyAddBtnText}>İlk Köpeğini Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : filteredDogs.length === 0 ? (
        <View style={styles.emptySearchContainer}>
          <View style={styles.emptySearchCircle}>
            <Text style={styles.emptySearchEmoji}>🔍</Text>
          </View>
          <Text style={styles.emptySearchTitle}>Eşleşen Köpek Bulunamadı</Text>
          <Text style={styles.emptySearchSub}>
            "{searchQuery}" aramasına uygun köpek ismi, cins veya konum bulunamadı.
          </Text>
          <TouchableOpacity
            style={[styles.clearSearchActionButton, { backgroundColor: '#D97706' }]}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.clearSearchActionButtonText}>Aramayı Temizle</Text>
          </TouchableOpacity>
        </View>
      ) : groupBy === 'all' ? (
        <FlatList
          data={filteredDogs}
          keyExtractor={(item) => item.id}
          renderItem={renderDogItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <SectionList
          sections={groupedSections}
          keyExtractor={(item) => item.id}
          renderItem={renderDogItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* SAĞ ALTA FAB BUTONU */}
      <TouchableOpacity
        style={[styles.fabButton, { backgroundColor: '#D97706', shadowColor: '#D97706' }]}
        activeOpacity={0.88}
        onPress={() => navigation.navigate('AddDog')}
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
        <Text style={styles.fabText}>Yeni Köpek</Text>
      </TouchableOpacity>

      {/* SİLME ONAY MODALI */}
      <Modal
        visible={!!dogToDelete}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDogToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalBox}>
            <View style={styles.confirmEmojiCircle}>
              <Text style={styles.confirmEmoji}>🐶</Text>
            </View>
            <Text style={styles.confirmTitle}>Köpeği Sil</Text>
            <Text style={styles.confirmDesc}>
              "{dogToDelete?.name}" adlı sadık dostumuzu silmek istediğine emin misin?
            </Text>
            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                activeOpacity={0.8}
                onPress={() => setDogToDelete(null)}
              >
                <Text style={styles.confirmCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (dogToDelete) {
                    deleteDog(dogToDelete.id);
                    setDogToDelete(null);
                  }
                }}
              >
                <Ionicons name="trash" size={15} color="#FFFFFF" />
                <Text style={styles.confirmDeleteText}>Evet, Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  countPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  searchContainer: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterSection: {
    paddingVertical: 6,
    marginBottom: 4,
  },
  filterScroll: {
    paddingHorizontal: 18,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 6,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  filterChipEmoji: {
    fontSize: 13,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sectionEmojiBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionEmojiText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    flex: 1,
  },
  sectionCountBadge: {
    backgroundColor: '#FAF5F0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  sectionCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  dogCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  dogImage: {
    width: 92,
    height: 106,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
  },
  dogInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  dogTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dogName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
    flex: 1,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  dogBreed: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dogLocation: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  notePreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    gap: 4,
  },
  notePreviewText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  bondBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bondBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  vaccineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEFBF3',
    borderWidth: 1,
    borderColor: '#C6F6D5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  vaccineBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  scheduledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  scheduledBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -40,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
    maxWidth: 280,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 20,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -30,
  },
  emptySearchCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptySearchEmoji: {
    fontSize: 36,
  },
  emptySearchTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  emptySearchSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: 270,
  },
  clearSearchActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 6,
  },
  clearSearchActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 30,
    gap: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmModalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  confirmEmojiCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  confirmEmoji: {
    fontSize: 36,
  },
  confirmTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  confirmDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 22,
    maxWidth: 260,
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: '#FAF5F0',
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  confirmDeleteBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmDeleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
