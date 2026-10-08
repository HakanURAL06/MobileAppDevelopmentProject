import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableOpacity,
  Image,
  Alert,
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
  { id: 'bond', title: 'Bağ Seviyesine Göre', emoji: '💖' },
];

export default function CatListScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats);
  const deleteCat = useCatStore((state) => state.deleteCat);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);

  // Gruplama seçeneği (all | location | breed | bond)
  const [groupBy, setGroupBy] = useState('all');

  // Silinecek kedi (Onay pop-up modalı için)
  const [catToDelete, setCatToDelete] = useState(null);

  // Kediyi Silme Onayı
  const handleDeleteCat = (cat) => {
    setCatToDelete(cat);
  };

  // Gruplara göre bölümlenmiş kedi verisi
  const groupedSections = useMemo(() => {
    if (groupBy === 'all' || cats.length === 0) return [];

    // 1. Konuma göre gruplama (Kullanıcının verdiği el ile isim öncelikli)
    if (groupBy === 'location') {
      const map = {};
      cats.forEach((cat) => {
        const locName =
          (typeof cat.location === 'object'
            ? cat.location?.regionName
            : cat.location)?.trim() || 'Bilinmeyen Konum';
        if (!map[locName]) {
          map[locName] = [];
        }
        map[locName].push(cat);
      });

      return Object.keys(map)
        .sort((a, b) => a.localeCompare(b, 'tr'))
        .map((locName) => ({
          title: locName,
          emoji: '📍',
          data: map[locName],
        }));
    }

    // 2. Cinsine göre gruplama
    if (groupBy === 'breed') {
      const map = {};
      cats.forEach((cat) => {
        const breedName = cat.breed?.trim() || 'Tekir / Melez';
        if (!map[breedName]) {
          map[breedName] = [];
        }
        map[breedName].push(cat);
      });

      return Object.keys(map)
        .sort((a, b) => a.localeCompare(b, 'tr'))
        .map((breedName) => ({
          title: breedName,
          emoji: '🐾',
          data: map[breedName],
        }));
    }

    // 3. Bağ Seviyesine göre gruplama (Oyunlaştırma)
    if (groupBy === 'bond') {
      const tiers = [
        {
          title: 'Aile (Level 3 - 9+ Etkileşim)',
          emoji: '💖',
          filter: (c) => (c.interactionHistory?.length || 0) >= 9,
        },
        {
          title: 'Dost (Level 2 - 4-8 Etkileşim)',
          emoji: '😺',
          filter: (c) => {
            const l = c.interactionHistory?.length || 0;
            return l >= 4 && l < 9;
          },
        },
        {
          title: 'Tanışıklık (Level 1 - 1-3 Etkileşim)',
          emoji: '🐾',
          filter: (c) => {
            const l = c.interactionHistory?.length || 0;
            return l >= 1 && l < 4;
          },
        },
        {
          title: 'Yeni Tanışma (Level 0 - 0 Etkileşim)',
          emoji: '🌱',
          filter: (c) => (c.interactionHistory?.length || 0) === 0,
        },
      ];

      return tiers
        .map((tier) => ({
          title: tier.title,
          emoji: tier.emoji,
          data: cats.filter(tier.filter),
        }))
        .filter((section) => section.data.length > 0);
    }

    return [];
  }, [cats, groupBy]);

  // Tekil kedi kartı tasarımı
  const renderCatItem = ({ item }) => {
    const photo =
      (item.photos && item.photos.length > 0 ? item.photos[0] : item.photoUri) ||
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80';

    const photoCount = item.photos?.length || (item.photoUri ? 1 : 0);
    const interactionCount = item.interactionHistory?.length || 0;
    const bondInfo = getBondLevelInfo(interactionCount);
    const locationName =
      typeof item.location === 'object' ? item.location?.regionName : item.location;

    return (
      <TouchableOpacity
        style={styles.catCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('CatDetail', {
            catId: item.id,
            catName: item.name,
          })
        }
      >
        <Image source={getImageSource(photo)} style={styles.catImage} />

        <View style={styles.catInfo}>
          <View style={styles.catTopRow}>
            <Text style={styles.catName} numberOfLines={1}>
              {item.name}
            </Text>
            {/* ŞIK SİL BUTONU */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteCat(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={17} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.catBreed} numberOfLines={1}>
            🐾 {item.breed}
          </Text>
          <Text style={styles.catLocation} numberOfLines={1}>
            📍 {locationName || 'Bölge Belirtilmedi'}
          </Text>

          {/* HAKKINDA / NOT ÖNİZLEMESİ (Varsa) */}
          {item.notes && item.notes.trim().length > 0 ? (
            <View style={styles.notePreviewBox}>
              <Ionicons name="document-text-outline" size={12} color={Colors.primaryDark} />
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

            <View style={styles.metaBadge}>
              <Ionicons name="images-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaBadgeText}>{photoCount} Foto</Text>
            </View>

            <View style={styles.metaBadge}>
              <Ionicons name="restaurant-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaBadgeText}>{interactionCount} Besleme</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Grup Başlığı (Section Header)
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <View style={styles.sectionEmojiBadge}>
          <Text style={styles.sectionEmojiText}>{section.emoji}</Text>
        </View>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <View style={styles.sectionCountBadge}>
        <Text style={styles.sectionCountText}>{section.data.length} Kedi</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* BAŞLIK VE ÖZET BAR */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Kayıtlı Kedilerim 🐾</Text>
          <Text style={styles.headerSub}>Takip ettiğin tüm patili dostlar</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{cats.length} Kedi</Text>
        </View>
      </View>

      {/* GRUPLAMA SEÇİCİ (BAR) */}
      {cats.length > 0 && (
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

      {/* KEDİ LİSTESİ VEYA SEVİMLİ BOŞ DURUM */}
      {cats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Text style={styles.emptyIconEmoji}>🐱</Text>
          </View>
          <Text style={styles.emptyTitle}>Henüz hiç patili dost eklemedin 🐾</Text>
          <Text style={styles.emptySubtitle}>
            Sokaktaki sevimli dostlarını kaydetmek için aşağıdaki butona dokunabilirsin!
          </Text>

          <TouchableOpacity
            style={styles.emptyAddBtn}
            onPress={() => navigation.navigate('AddCat')}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.emptyAddBtnText}>İlk Kedini Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : groupBy === 'all' ? (
        <FlatList
          data={cats}
          keyExtractor={(item) => item.id}
          renderItem={renderCatItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <SectionList
          sections={groupedSections}
          keyExtractor={(item) => item.id}
          renderItem={renderCatItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* SAĞ ALTA FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity
        style={styles.fabButton}
        activeOpacity={0.88}
        onPress={() => navigation.navigate('AddCat')}
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
        <Text style={styles.fabText}>Yeni Kedi</Text>
      </TouchableOpacity>

      {/* SİLME ONAY POP-UP MODALI */}
      <Modal
        visible={!!catToDelete}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCatToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalBox}>
            <View style={styles.confirmEmojiCircle}>
              <Text style={styles.confirmEmoji}>😿</Text>
            </View>
            <Text style={styles.confirmTitle}>Kediyi Sil</Text>
            <Text style={styles.confirmDesc}>
              "{catToDelete?.name}" adlı patili dostumuzu silmek istediğine emin misin?
            </Text>
            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                activeOpacity={0.8}
                onPress={() => setCatToDelete(null)}
              >
                <Text style={styles.confirmCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (catToDelete) {
                    deleteCat(catToDelete.id);
                    setCatToDelete(null);
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
    backgroundColor: Colors.background, // Fildişi Krem
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
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
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  filterSection: {
    paddingVertical: 8,
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
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
    paddingBottom: 100, // FAB için boşluk
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
    backgroundColor: '#FFF2EC',
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
  catCard: {
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
  catImage: {
    width: 92,
    height: 106,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
  },
  catInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  catTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catName: {
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
  catBreed: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  catLocation: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  notePreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    gap: 4,
  },
  notePreviewText: {
    fontSize: 11,
    color: Colors.primaryDark,
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
    backgroundColor: Colors.primaryLight,
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
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 20,
    gap: 8,
    shadowColor: Colors.primary,
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
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 30,
    gap: 6,
    shadowColor: Colors.primary,
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
    backgroundColor: '#FFF1F2',
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
