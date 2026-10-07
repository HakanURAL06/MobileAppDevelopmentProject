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
import { Colors } from '../theme/colors';

export default function CatDetailScreen({ route, navigation }) {
  const { catId } = route.params || {};

  const cat = useCatStore((state) => state.cats.find((c) => c.id === catId));
  const addInteraction = useCatStore((state) => state.addInteraction);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);

  if (!cat) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundEmoji}>😿</Text>
        <Text style={styles.notFoundTitle}>Kedi Dostumuz Bulunamadı</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const interactions = cat.interactionHistory || [];
  const interactionCount = interactions.length;
  const bondInfo = getBondLevelInfo(interactionCount);

  // Son Beslenme / Etkileşim Zamanı
  const getLastFedText = () => {
    if (interactions.length === 0) {
      return 'Henüz beslenmedi / etkileşim yok 🌱';
    }
    const last = interactions[0];
    const dateObj = new Date(last.date);
    const now = new Date();
    const diffHours = Math.round((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));

    const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (diffHours < 1) return `Az önce beslendi (${timeStr}) 🥣`;
    if (diffHours < 24) return `Bugün ${timeStr} civarında ilgilenildi (${diffHours} saat önce) 🥣`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce (${dateObj.toLocaleDateString('tr-TR')}) ilgilenildi 🥣`;
  };

  // Kocaman Buton: Kediyi Besle / İlgilen
  const handleFeedCat = () => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    addInteraction(cat.id, {
      type: 'feeding',
      note: `Mama ve taze su verildi (${timeFormatted}) 🥣`,
    });

    const newCount = interactionCount + 1;
    const newBond = getBondLevelInfo(newCount);

    Alert.alert(
      'Mırıl Mırıl! 💖🐾',
      `${cat.name} mamasını afiyetle yedi! Etkileşim kaydedildi.\n\nBağ Durumu: ${newBond.title} (${newCount} Etkileşim)`
    );
  };

  // Ekstra Hızlı Sevme / Oyun Etkileşimi
  const handlePetCat = () => {
    addInteraction(cat.id, {
      type: 'petting',
      note: 'Güneşte başı okşandı, mırıldadı ✨',
    });
    Alert.alert('Sevgi Dolu An! ✨', `${cat.name} başını sevdirdi ve sevgini hissetti!`);
  };

  const handlePlayCat = () => {
    addInteraction(cat.id, {
      type: 'playing',
      note: 'İp ve oyuncakla neşeyle oynadı 🧶',
    });
    Alert.alert('Oyun Zamanı! 🧶', `${cat.name} ile harika bir oyun saati geçirdiniz!`);
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('tr-TR')} • ${d.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* 1. KEDİ FOTOĞRAFI VE TEMEL BİLGİ KARTI */}
      <View style={styles.heroCard}>
        <Image
          source={{
            uri:
              cat.photoUri ||
              'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
          }}
          style={styles.heroImage}
        />

        <View style={styles.heroInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.catName}>{cat.name}</Text>
            <View style={[styles.levelBadge, { backgroundColor: bondInfo.badgeBg }]}>
              <Text style={[styles.levelBadgeText, { color: bondInfo.color }]}>
                {bondInfo.title}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="paw" size={14} color={Colors.primary} />
              <Text style={styles.metaChipText}>{cat.breed}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="location" size={14} color={Colors.blue} />
              <Text style={styles.metaChipText}>
                {typeof cat.location === 'object' ? cat.location?.regionName : cat.location}
              </Text>
            </View>
          </View>

          {/* Son Beslenme Zamanı Bilgi Kutusu */}
          <View style={styles.lastFedBox}>
            <Ionicons name="time" size={16} color={Colors.primaryDark} />
            <Text style={styles.lastFedText}>{getLastFedText()}</Text>
          </View>
        </View>

        {/* 2. OYUNLAŞTIRMA: BAĞ / LEVEL İLERLEME ÇUBUĞU (PROGRESS BAR) */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeaderRow}>
            <View>
              <Text style={styles.progressTitle}>Bağ Durumu: Seviye {bondInfo.level} ({bondInfo.title})</Text>
              <Text style={styles.progressSubtitle}>{bondInfo.description}</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{interactionCount} Etkileşim</Text>
            </View>
          </View>

          {/* İlerleme Çubuğu */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${bondInfo.progressPercent}%`, backgroundColor: bondInfo.color },
              ]}
            />
          </View>

          <View style={styles.tierIndicatorRow}>
            <Text style={[styles.tierText, interactionCount < 4 && styles.tierTextActive]}>
              1-3: Tanışıklık 🐾
            </Text>
            <Text style={[styles.tierText, interactionCount >= 4 && interactionCount < 9 && styles.tierTextActive]}>
              4-8: Dost 😺
            </Text>
            <Text style={[styles.tierText, interactionCount >= 9 && styles.tierTextActive]}>
              9+: Aile 💖
            </Text>
          </View>

          <Text style={styles.nextTargetMessage}>{bondInfo.nextTargetText}</Text>
        </View>
      </View>

      {/* 3. KOCAMAN VE TATLI 'KEDİYİ BESLE / İLGİLEN' BUTONU */}
      <View style={styles.feedActionSection}>
        <TouchableOpacity style={styles.bigFeedButton} onPress={handleFeedCat} activeOpacity={0.88}>
          <View style={styles.feedButtonContent}>
            <View style={styles.feedEmojiCircle}>
              <Text style={styles.feedEmojiText}>🥣</Text>
            </View>
            <View style={styles.feedTextWrapper}>
              <Text style={styles.bigFeedTitle}>Kediyi Besle / İlgilen 🐾</Text>
              <Text style={styles.bigFeedSubtitle}>
                Bugünün tarihini kaydet ve bağ seviyesini yükselt!
              </Text>
            </View>
            <Ionicons name="sparkles" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Ekstra Hızlı Etkileşim Seçenekleri */}
        <View style={styles.subActionsRow}>
          <TouchableOpacity style={styles.subActionBtn} onPress={handlePetCat}>
            <Text style={styles.subActionEmoji}>✨</Text>
            <Text style={styles.subActionText}>Sev / Başını Okşa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.subActionBtn} onPress={handlePlayCat}>
            <Text style={styles.subActionEmoji}>🧶</Text>
            <Text style={styles.subActionText}>Oyun Oyna</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. GEÇMİŞ ETKİLEŞİM TARİHLERİ LİSTESİ */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>📅 Geçmiş Etkileşim Tarihleri</Text>
          <View style={styles.historyCountPill}>
            <Text style={styles.historyCountPillText}>{interactions.length} Kayıt</Text>
          </View>
        </View>

        {interactions.length === 0 ? (
          <View style={styles.emptyHistoryBox}>
            <Text style={styles.emptyHistoryEmoji}>🥣</Text>
            <Text style={styles.emptyHistoryTitle}>Henüz bir etkileşim kaydı yok</Text>
            <Text style={styles.emptyHistorySub}>
              Yukarıdaki büyük butona dokunarak ilk beslemeni kaydedebilirsin!
            </Text>
          </View>
        ) : (
          interactions.map((item, index) => (
            <View key={item.id || index} style={styles.historyRow}>
              <View style={styles.historyIconCircle}>
                <Ionicons
                  name={
                    item.type === 'feeding'
                      ? 'restaurant'
                      : item.type === 'petting'
                      ? 'heart'
                      : 'game-controller'
                  }
                  size={16}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.historyTextCol}>
                <Text style={styles.historyNote}>{item.note || 'Besleme ve ilgi'}</Text>
                <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              </View>

              <View style={styles.historyTag}>
                <Text style={styles.historyTagText}>+1 Etkileşim</Text>
              </View>
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
    backgroundColor: Colors.background, // Fildişi Krem Arka Plan
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  heroImage: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
  heroInfo: {
    marginTop: 14,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  lastFedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F2',
    borderWidth: 1,
    borderColor: '#FFE8DF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 12,
    gap: 8,
  },
  lastFedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  progressCard: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5ECE6',
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  progressSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  progressBarTrack: {
    height: 14,
    backgroundColor: '#F3E8E2',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  tierIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tierTextActive: {
    color: Colors.text,
    fontWeight: '800',
  },
  nextTargetMessage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 8,
  },
  feedActionSection: {
    marginBottom: 18,
  },
  bigFeedButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 5,
  },
  feedButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedEmojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  feedEmojiText: {
    fontSize: 26,
  },
  feedTextWrapper: {
    flex: 1,
  },
  bigFeedTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bigFeedSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFF2EC',
    marginTop: 2,
  },
  subActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  subActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    paddingVertical: 11,
    gap: 6,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  subActionEmoji: {
    fontSize: 16,
  },
  subActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  historyCountPill: {
    backgroundColor: '#FAF5F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  historyCountPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptyHistoryBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyHistoryEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  emptyHistoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyHistorySub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF5F0',
  },
  historyIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTextCol: {
    flex: 1,
  },
  historyNote: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  historyDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyTag: {
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  historyTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
});
