import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';

export default function CatDetailScreen({ route, navigation }) {
  const { catId } = route.params || {};

  const cat = useCatStore((state) => state.cats.find((c) => c.id === catId));
  const addInteraction = useCatStore((state) => state.addInteraction);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);

  if (!cat) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundEmoji}>😿</Text>
        <Text style={styles.notFoundText}>Kedi bilgisi bulunamadı.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const bondInfo = getBondLevelInfo(cat.bondScore || 0);

  // Seviye İlerleme Çubuğu Hesaplaması (0 - 100 arası max)
  const progressPercent = Math.min(100, Math.round(((cat.bondScore || 0) / 100) * 100));

  const handleInteraction = (type, title, points, note) => {
    addInteraction(cat.id, {
      type,
      points,
      note,
    });
    Alert.alert('Sevgi Dolu An! 💖', `${cat.name} ile ilgilendin! (+${points} Bağ Puanı)`);
  };

  // Tarih formatlama yardımcısı
  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Kedi Profil Kartı */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              cat.photoUri ||
              'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
          }}
          style={styles.catImage}
        />

        <View style={styles.catMainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.catName}>{cat.name}</Text>
            <View style={[styles.levelBadge, { backgroundColor: bondInfo.badgeBg }]}>
              <Text style={[styles.levelBadgeText, { color: bondInfo.color }]}>
                {bondInfo.title}
              </Text>
            </View>
          </View>

          <Text style={styles.catBreed}>🐾 {cat.breed}</Text>
          <Text style={styles.catLocation}>
            📍 {typeof cat.location === 'object' ? cat.location?.regionName : cat.location}
          </Text>
        </View>

        {/* BAĞ / LEVEL İLERLEME ÇUBUĞU (PROGRESS BAR) */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Bağ Seviyesi: Seviye {bondInfo.level}</Text>
            <Text style={styles.progressScoreText}>{cat.bondScore || 0} / 100 Puan</Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%`, backgroundColor: bondInfo.color },
              ]}
            />
          </View>
          <Text style={styles.progressSubtext}>
            {progressPercent >= 100
              ? 'Tebrikler! Kedinizle aranızdaki bağ maksimum seviyede! 💖'
              : `Bir sonraki seviyeye ${100 - (cat.bondScore || 0)} puan kaldı.`}
          </Text>
        </View>
      </View>

      {/* HIZLI ETKİLEŞİM BUTONLARI */}
      <View style={styles.actionCard}>
        <Text style={styles.sectionTitle}>Etkileşimde Bulun 🥣</Text>
        <Text style={styles.sectionSubtitle}>
          Her sevgi ve mama kedinizin bağ seviyesini artırır!
        </Text>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#FFF0F2' }]}
            onPress={() => handleInteraction('feeding', 'Besleme', 15, 'Taze mama ve su verildi 🥣')}
          >
            <Text style={styles.actionEmoji}>🥣</Text>
            <Text style={styles.actionBtnText}>Mama Ver</Text>
            <Text style={styles.actionPointText}>+15 Puan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#FDF4FF' }]}
            onPress={() => handleInteraction('petting', 'Sevme', 10, 'Başını okşadın, mırıldadı ✨')}
          >
            <Text style={styles.actionEmoji}>🐾</Text>
            <Text style={styles.actionBtnText}>Sev / Okşa</Text>
            <Text style={styles.actionPointText}>+10 Puan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#FEFCE8' }]}
            onPress={() => handleInteraction('playing', 'Oyun', 20, 'İp yumağıyla oynadınız 🧶')}
          >
            <Text style={styles.actionEmoji}>🧶</Text>
            <Text style={styles.actionBtnText}>Oyun Oyna</Text>
            <Text style={styles.actionPointText}>+20 Puan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ETKİLEŞİM GEÇMİŞİ LİSTESİ */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionTitle}>Geçmiş Etkileşimler</Text>
          <Text style={styles.historyCountBadge}>
            {cat.interactionHistory?.length || 0} Etkileşim
          </Text>
        </View>

        {!cat.interactionHistory || cat.interactionHistory.length === 0 ? (
          <Text style={styles.emptyHistoryText}>Henüz kayıtlı bir etkileşim yok.</Text>
        ) : (
          cat.interactionHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyIconWrapper}>
                <Ionicons
                  name={
                    item.type === 'feeding'
                      ? 'restaurant'
                      : item.type === 'petting'
                      ? 'heart'
                      : 'game-controller'
                  }
                  size={16}
                  color="#FF6B6B"
                />
              </View>

              <View style={styles.historyContent}>
                <Text style={styles.historyNote}>
                  {item.note || (item.type === 'feeding' ? 'Besleme yapıldı' : 'Sevildi')}
                </Text>
                <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              </View>

              {item.pointsEarned ? (
                <Text style={styles.historyEarnedPoints}>+{item.pointsEarned} P</Text>
              ) : null}
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  notFoundText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  catImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    backgroundColor: '#FFE4E6',
  },
  catMainInfo: {
    marginTop: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  catBreed: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  catLocation: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  progressSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  progressScoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  actionPointText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B6B',
    marginTop: 2,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  emptyHistoryText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  historyIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF0F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyContent: {
    flex: 1,
  },
  historyNote: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  historyDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  historyEarnedPoints: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 8,
  },
});
