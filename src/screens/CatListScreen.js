import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';

export default function CatListScreen({ navigation }) {
  const cats = useCatStore((state) => state.cats);
  const deleteCat = useCatStore((state) => state.deleteCat);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);
  const seedSampleCats = useCatStore((state) => state.seedSampleCats);

  // Kediyi Silme Onayı
  const handleDeleteCat = (cat) => {
    Alert.alert(
      'Kediyi Sil',
      `"${cat.name}" adlı patili dostumuzu silmek istediğine emin misin? 😿`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: () => deleteCat(cat.id),
        },
      ]
    );
  };

  const renderCatItem = ({ item }) => {
    const photo =
      (item.photos && item.photos.length > 0 ? item.photos[0] : item.photoUri) ||
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80';

    const photoCount = item.photos?.length || (item.photoUri ? 1 : 0);
    const interactionCount = item.interactionHistory?.length || 0;
    const bondInfo = getBondLevelInfo(interactionCount);

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
        <Image source={{ uri: photo }} style={styles.catImage} />

        <View style={styles.catInfo}>
          <View style={styles.catTopRow}>
            <Text style={styles.catName}>{item.name}</Text>
            {/* ŞIK SİL BUTONU */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteCat(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.catBreed}>🐾 {item.breed}</Text>
          <Text style={styles.catLocation}>
            📍 {typeof item.location === 'object' ? item.location?.regionName : item.location}
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.bondBadge, { backgroundColor: bondInfo.badgeBg }]}>
              <Text style={[styles.bondBadgeText, { color: bondInfo.color }]}>
                {bondInfo.title}
              </Text>
            </View>

            <View style={styles.metaBadge}>
              <Ionicons name="images-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaBadgeText}>{photoCount} Fotoğraf</Text>
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

          <TouchableOpacity style={styles.seedLinkBtn} onPress={seedSampleCats}>
            <Text style={styles.seedLinkText}>Örnek Kedileri Yükle ✨</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cats}
          keyExtractor={(item) => item.id}
          renderItem={renderCatItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* SAĞ ALTA FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity
        style={styles.fabButton}
        activeOpacity={0.88}
        onPress={() => navigation.navigate('AddCat')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
        <Text style={styles.fabText}>Yeni Kedi</Text>
      </TouchableOpacity>
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
    paddingBottom: 12,
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
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 100, // FAB için boşluk
  },
  catCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  catImage: {
    width: 90,
    height: 100,
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
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catBreed: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  catLocation: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  bondBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bondBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
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
  seedLinkBtn: {
    marginTop: 14,
    padding: 8,
  },
  seedLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.blue,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
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
    fontSize: 15,
    fontWeight: '800',
  },
});
