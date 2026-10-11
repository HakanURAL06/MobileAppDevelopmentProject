import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';
import { getImageSource } from '../utils/imageHelper';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 36 - 20) / 3;

// Hızlı Etkileşim Butonları (Kedi kaydederken ve detay sayfasında ortak çeşitlilik)
const QUICK_INTERACTIONS = [
  {
    id: 'feeding',
    type: 'feeding',
    emoji: '🥣',
    title: 'Mama Verdim',
    note: 'Taze ve lezzetli mama ile beslendi 🥣',
    color: '#E06D53',
    bg: '#FFF2EC',
    border: '#FFD9CB',
  },
  {
    id: 'petting',
    type: 'petting',
    emoji: '🐾',
    title: 'Sevdim / Okşadım',
    note: 'Kendini sevdirdi, başı ve çenesi okşandı ✨',
    color: '#D946EF',
    bg: '#FDF4FF',
    border: '#F5D0FE',
  },
  {
    id: 'water',
    type: 'feeding',
    emoji: '💧',
    title: 'Su Bıraktım',
    note: 'Taze ve temiz su kabı yenilendi 💧',
    color: '#0284C7',
    bg: '#F0F9FF',
    border: '#BAE6FD',
  },
  {
    id: 'playing',
    type: 'playing',
    emoji: '🧶',
    title: 'Oyun Oynadım',
    note: 'İp ve oyuncakla neşeyle oynadı 🧶',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    id: 'health',
    type: 'other',
    emoji: '🩺',
    title: 'Sağlık Kontrolü',
    note: 'Tüy, göz ve genel sağlık durumu kontrol edildi 🩺',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
];

// Hızlı Aşı Seçenekleri
const QUICK_VACCINE_SUGGESTIONS = [
  'Kuduz Aşısı',
  'Karma Aşı (1. Doz)',
  'Karma Aşı (2. Doz)',
  'İç-Dış Parazit',
  'Lösemi Aşısı',
];

const QUICK_SCHEDULE_SUGGESTIONS = [
  'İç-Dış Parazit Tekrarı',
  'Yıllık Kuduz Tekrarı',
  'Karma Aşı Rapeli',
  'Veteriner Genel Kontrolü',
];

export default function CatDetailScreen({ route, navigation }) {
  const { catId } = route.params || {};

  const cat = useCatStore((state) => state.cats.find((c) => c.id === catId));
  const addInteraction = useCatStore((state) => state.addInteraction);
  const addPhotoToCat = useCatStore((state) => state.addPhotoToCat);
  const updateCatNotes = useCatStore((state) => state.updateCatNotes);
  const updateCatInfo = useCatStore((state) => state.updateCatInfo);
  const addVaccination = useCatStore((state) => state.addVaccination);
  const scheduleVaccine = useCatStore((state) => state.scheduleVaccine);
  const completeScheduledVaccine = useCatStore((state) => state.completeScheduledVaccine);
  const deleteVaccine = useCatStore((state) => state.deleteVaccine);
  const showToast = useCatStore((state) => state.showToast);
  const getBondLevelInfo = useCatStore((state) => state.getBondLevelInfo);

  // Not Düzenleme Durumu
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(cat?.notes || '');

  // Bilgi Düzenleme Modalı
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBreed, setEditBreed] = useState('');
  const [editRegionName, setEditRegionName] = useState('');
  const [editCoordinates, setEditCoordinates] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Aşı Sekmesi (completed | scheduled)
  const [vaccineTab, setVaccineTab] = useState('completed');

  // Aşı Ekleme Modalı
  const [isAddVaccineModalVisible, setIsAddVaccineModalVisible] = useState(false);
  const [newVacName, setNewVacName] = useState('');
  const [newVacDate, setNewVacDate] = useState('');
  const [newVacClinic, setNewVacClinic] = useState('');
  const [newVacNotes, setNewVacNotes] = useState('');

  // Aşı Planlama Modalı
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [newSchName, setNewSchName] = useState('');
  const [newSchDate, setNewSchDate] = useState('');
  const [newSchNotes, setNewSchNotes] = useState('');

  useEffect(() => {
    if (cat?.notes !== undefined) {
      setNoteText(cat.notes);
    }
  }, [cat?.notes]);

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

  const completedVaccines = Array.isArray(cat.vaccinations) ? cat.vaccinations : [];
  const scheduledVaccines = Array.isArray(cat.scheduledVaccines) ? cat.scheduledVaccines : [];
  const locationHistory = Array.isArray(cat.locationHistory) ? cat.locationHistory : [];

  const locationName =
    typeof cat.location === 'object'
      ? cat.location?.regionName || 'Bilinmeyen Bölge'
      : cat.location || 'Bilinmeyen Bölge';

  const catPhotos =
    cat.photos && cat.photos.length > 0
      ? cat.photos
      : cat.photoUri
      ? [cat.photoUri]
      : [];

  const coverPhoto =
    catPhotos[0] ||
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80';

  // Son Etkileşim Zamanı
  const getLastFedText = () => {
    if (interactions.length === 0) {
      return 'Henüz etkileşim kaydedilmedi 🌱';
    }
    const last = interactions[0];
    const dateObj = new Date(last.date);
    const now = new Date();
    const diffHours = Math.round((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (diffHours < 1) return `Az önce ilgilenildi (${timeStr}) 🥣`;
    if (diffHours < 24) return `Bugün ${timeStr} civarında ilgilenildi (${diffHours} saat önce) 🥣`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce (${dateObj.toLocaleDateString('tr-TR')}) ilgilenildi 🥣`;
  };

  // Çeşitlendirilmiş Hızlı Etkileşim Yapma
  const handleQuickInteraction = (option) => {
    addInteraction(cat.id, {
      type: option.type,
      note: option.note,
    });

    const newCount = interactionCount + 1;
    const newBond = getBondLevelInfo(newCount);

    showToast(`"${cat.name}" için kaydedildi: ${option.emoji} ${option.title}! (${newBond.title})`, 'success');
  };

  // Bilgi Düzenleme Modalını Aç
  const handleOpenEditModal = () => {
    setEditName(cat.name || '');
    setEditBreed(cat.breed || '');
    setEditRegionName(
      typeof cat.location === 'object' ? cat.location?.regionName || '' : cat.location || ''
    );
    setEditCoordinates(
      typeof cat.location === 'object' && cat.location?.latitude
        ? { latitude: cat.location.latitude, longitude: cat.location.longitude }
        : null
    );
    setEditNotes(cat.notes || '');
    setIsEditModalVisible(true);
  };

  // GPS Konumu Alma (Düzenleme ekranında)
  const handleGetLocationInEdit = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Konum İzni', 'GPS koordinatları için konum iznine ihtiyaç var.');
        setIsGettingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setEditCoordinates({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (!editRegionName.trim()) {
        setEditRegionName('Güncel Konum (GPS)');
      }

      showToast('GPS koordinatları alındı 📍', 'info');
    } catch {
      Alert.alert('Hata', 'Konum bilgisi alınamadı.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Bilgi Güncellemelerini Kaydet
  const handleSaveEditModal = () => {
    if (!editName.trim()) {
      showToast('Kedi ismi boş bırakılamaz 🐾', 'info');
      return;
    }

    updateCatInfo(cat.id, {
      name: editName.trim(),
      breed: editBreed.trim() || 'Tekir / Melez',
      location: {
        regionName: editRegionName.trim() || 'Bilinmeyen Bölge',
        latitude: editCoordinates?.latitude ?? null,
        longitude: editCoordinates?.longitude ?? null,
      },
      notes: editNotes.trim(),
    });

    setIsEditModalVisible(false);
  };

  // Hızlı Not Kaydetme
  const handleSaveNotes = () => {
    updateCatNotes(cat.id, noteText);
    setIsEditingNote(false);
  };

  // Albüme Yeni Fotoğraf Ekleme
  const handlePickNewPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast('Fotoğraf seçmek için galeri izni gereklidir 📷', 'info');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhotoUri = result.assets[0].uri;
        addPhotoToCat(cat.id, newPhotoUri);
        showToast(`"${cat.name}" albümüne yeni fotoğraf eklendi 📸`, 'success');
      }
    } catch {
      showToast('Fotoğraf seçilirken bir hata oluştu', 'info');
    }
  };

  // Aşı Ekleme Modalını Aç
  const handleOpenAddVaccine = () => {
    setNewVacName('');
    setNewVacDate(new Date().toISOString().split('T')[0]);
    setNewVacClinic('');
    setNewVacNotes('');
    setIsAddVaccineModalVisible(true);
  };

  // Aşı Kaydet
  const handleSaveVaccine = () => {
    if (!newVacName.trim()) {
      showToast('Lütfen aşı adını belirtin 💉', 'info');
      return;
    }

    addVaccination(cat.id, {
      name: newVacName.trim(),
      date: newVacDate.trim() || new Date().toISOString().split('T')[0],
      clinic: newVacClinic.trim(),
      notes: newVacNotes.trim(),
    });

    setIsAddVaccineModalVisible(false);
  };

  // Aşı Planlama Modalını Aç
  const handleOpenScheduleModal = () => {
    setNewSchName('');
    const inOneMonth = new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0];
    setNewSchDate(inOneMonth);
    setNewSchNotes('');
    setIsScheduleModalVisible(true);
  };

  // Aşı Planı Kaydet
  const handleSaveSchedule = () => {
    if (!newSchName.trim()) {
      showToast('Lütfen planlanan aşı adını girin 📅', 'info');
      return;
    }

    scheduleVaccine(cat.id, {
      name: newSchName.trim(),
      plannedDate: newSchDate.trim() || new Date().toISOString().split('T')[0],
      notes: newSchNotes.trim(),
    });

    setIsScheduleModalVisible(false);
    setVaccineTab('scheduled');
  };

  // Planlanan Aşıyı Tamamlandı Yap
  const handleCompletePlan = (planItem) => {
    Alert.alert(
      'Aşı Tamamlandı mı? 💉',
      `"${planItem.name}" aşısının uygulandığını onaylıyor musunuz? Aşı tamamlananlar listesine aktarılacaktır.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Tamamlandı ✓',
          onPress: () => {
            completeScheduledVaccine(cat.id, planItem.id, {
              completionDate: new Date().toISOString().split('T')[0],
            });
          },
        },
      ]
    );
  };

  const formatDate = (isoOrYmd) => {
    try {
      const d = new Date(isoOrYmd);
      if (isNaN(d.getTime())) return isoOrYmd;
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoOrYmd;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* 1. KEDİ KAPAK KARTI VE BİLGİLERİ */}
      <View style={styles.heroCard}>
        <Image source={getImageSource(coverPhoto)} style={styles.heroImage} />

        <View style={styles.heroInfo}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.catName}>{cat.name}</Text>
            </View>

            <TouchableOpacity
              style={styles.editInfoBtn}
              onPress={handleOpenEditModal}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={14} color={Colors.primaryDark} />
              <Text style={styles.editInfoBtnText}>Düzenle</Text>
            </TouchableOpacity>

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
              <Text style={styles.metaChipText}>{locationName}</Text>
            </View>
          </View>

          {/* Son Etkileşim Zamanı */}
          <View style={styles.lastFedBox}>
            <Ionicons name="time" size={16} color={Colors.primaryDark} />
            <Text style={styles.lastFedText}>{getLastFedText()}</Text>
          </View>
        </View>

        {/* 2. OYUNLAŞTIRMA: BAĞ / LEVEL İLERLEME ÇUBUĞU */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeaderRow}>
            <View>
              <Text style={styles.progressTitle}>
                Bağ Seviyesi: Seviye {bondInfo.level} ({bondInfo.title})
              </Text>
              <Text style={styles.progressSubtitle}>{bondInfo.description}</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{interactionCount} Etkileşim</Text>
            </View>
          </View>

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

      {/* 3. ÇEŞİTLENDİRİLMİŞ HIZLI ETKİLEŞİM BUTONLARI (KEDİYİ BESLE / SEV / OYNA) */}
      <View style={styles.quickInteractionsCard}>
        <View style={styles.sectionHeaderBox}>
          <Ionicons name="sparkles" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Hızlı Etkileşimler & İlgi 🐾</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Dokunarak minik dostunla yaptığın aktiviteyi anında kaydet ve bağınızı güçlendir:
        </Text>

        <View style={styles.interactionGrid}>
          {QUICK_INTERACTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.interactionBtn,
                { backgroundColor: option.bg, borderColor: option.border },
              ]}
              onPress={() => handleQuickInteraction(option)}
              activeOpacity={0.8}
            >
              <Text style={styles.interactionBtnEmoji}>{option.emoji}</Text>
              <Text style={[styles.interactionBtnTitle, { color: option.color }]}>
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. KONUM & ESKİ KONUM GEÇMİŞİ KARTI */}
      <View style={styles.locationHistoryCard}>
        <View style={styles.sectionHeaderBetween}>
          <View style={styles.sectionHeaderBox}>
            <Ionicons name="navigate-circle" size={20} color={Colors.blue} />
            <Text style={styles.sectionTitle}>Konum & Hareket Geçmişi 📍</Text>
          </View>
          <TouchableOpacity style={styles.editLocationShortBtn} onPress={handleOpenEditModal}>
            <Text style={styles.editLocationShortText}>Konumu Değiştir</Text>
          </TouchableOpacity>
        </View>

        {/* Mevcut Konum */}
        <View style={styles.currentLocationBox}>
          <View style={styles.currentLocationPin}>
            <Ionicons name="location" size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.currentLocLabelRow}>
              <Text style={styles.currentLocLabel}>Mevcut Konum</Text>
              <View style={styles.activeLocBadge}>
                <Text style={styles.activeLocBadgeText}>Aktif</Text>
              </View>
            </View>
            <Text style={styles.currentLocTitle}>{locationName}</Text>
          </View>
        </View>

        {/* Eski Konumlar */}
        <Text style={styles.pastLocHeaderTitle}>Önceki Konum Kayıtları</Text>
        {locationHistory.length === 0 ? (
          <View style={styles.emptyHistoryLocBox}>
            <Text style={styles.emptyHistoryLocText}>
              Henüz eski bir konum kaydı bulunmuyor. Konumu güncellediğinde önceki yerler burada otomatik listelenir.
            </Text>
          </View>
        ) : (
          locationHistory.map((item, idx) => (
            <View key={item.id || idx} style={styles.historyLocRow}>
              <View style={styles.historyLocDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.historyLocName}>{item.regionName}</Text>
                <Text style={styles.historyLocDate}>{formatDate(item.changedAt)} tarihine kadar buradaydı</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* 5. AŞI TAKİBİ & GELECEK AŞI PLANLAMA KARTI */}
      <View style={styles.vaccineCard}>
        <View style={styles.sectionHeaderBetween}>
          <View style={styles.sectionHeaderBox}>
            <Ionicons name="shield-checkmark" size={20} color="#059669" />
            <Text style={styles.sectionTitle}>Aşı Takibi & Sağlık Takvimi 💉</Text>
          </View>

          <View style={styles.vaccineActionButtonsRow}>
            <TouchableOpacity
              style={styles.addVaccineHeaderBtn}
              onPress={handleOpenAddVaccine}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={14} color="#FFFFFF" />
              <Text style={styles.addVaccineHeaderBtnText}>Aşı Ekle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scheduleHeaderBtn}
              onPress={handleOpenScheduleModal}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={13} color="#D97706" />
              <Text style={styles.scheduleHeaderBtnText}>Planla</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Aşı Sekmeleri */}
        <View style={styles.vaccineTabsContainer}>
          <TouchableOpacity
            style={[styles.vaccineTabBtn, vaccineTab === 'completed' && styles.vaccineTabBtnActive]}
            onPress={() => setVaccineTab('completed')}
          >
            <Ionicons
              name="checkmark-circle"
              size={15}
              color={vaccineTab === 'completed' ? '#059669' : Colors.textMuted}
            />
            <Text
              style={[
                styles.vaccineTabBtnText,
                vaccineTab === 'completed' && styles.vaccineTabBtnTextActive,
              ]}
            >
              Tamamlanan ({completedVaccines.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.vaccineTabBtn, vaccineTab === 'scheduled' && styles.vaccineTabBtnActive]}
            onPress={() => setVaccineTab('scheduled')}
          >
            <Ionicons
              name="time"
              size={15}
              color={vaccineTab === 'scheduled' ? '#D97706' : Colors.textMuted}
            />
            <Text
              style={[
                styles.vaccineTabBtnText,
                vaccineTab === 'scheduled' && styles.vaccineTabBtnTextActive,
              ]}
            >
              Planlanan / Gelecek ({scheduledVaccines.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sekme 1: Tamamlanan Aşılar */}
        {vaccineTab === 'completed' && (
          <View style={styles.tabContentArea}>
            {completedVaccines.length === 0 ? (
              <View style={styles.emptyVaccineBox}>
                <Ionicons name="shield-outline" size={32} color={Colors.textMuted} />
                <Text style={styles.emptyVaccineTitle}>Tamamlanan Aşı Yok</Text>
                <Text style={styles.emptyVaccineSub}>
                  Minik dostumuzun yapılmış olan aşılarını yukarıdaki "+ Aşı Ekle" butonuyla kaydedebilirsin.
                </Text>
              </View>
            ) : (
              completedVaccines.map((vac) => (
                <View key={vac.id} style={styles.vaccineRowItem}>
                  <View style={styles.vaccineIconCircle}>
                    <Ionicons name="shield-checkmark" size={18} color="#059669" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.vaccineTitleRow}>
                      <Text style={styles.vaccineItemName}>{vac.name}</Text>
                      <Text style={styles.vaccineItemDate}>{formatDate(vac.date)}</Text>
                    </View>
                    {vac.clinic ? (
                      <Text style={styles.vaccineItemClinic}>🏥 {vac.clinic}</Text>
                    ) : null}
                    {vac.notes ? (
                      <Text style={styles.vaccineItemNote}>📝 {vac.notes}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.deleteVacBtn}
                    onPress={() => deleteVaccine(cat.id, vac.id, false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={15} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* Sekme 2: Planlanan / Gelecek Aşılar */}
        {vaccineTab === 'scheduled' && (
          <View style={styles.tabContentArea}>
            {scheduledVaccines.length === 0 ? (
              <View style={styles.emptyVaccineBox}>
                <Ionicons name="calendar-outline" size={32} color={Colors.textMuted} />
                <Text style={styles.emptyVaccineTitle}>Planlanmış Aşı Yok</Text>
                <Text style={styles.emptyVaccineSub}>
                  Gelecek kuduz, parazit veya karma aşı randevularını "+ Planla" butonuyla ekleyebilirsin.
                </Text>
              </View>
            ) : (
              scheduledVaccines.map((plan) => (
                <View key={plan.id} style={styles.scheduledRowItem}>
                  <View style={styles.scheduledIconCircle}>
                    <Ionicons name="calendar" size={18} color="#D97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.vaccineTitleRow}>
                      <Text style={styles.scheduledItemName}>{plan.name}</Text>
                      <View style={styles.plannedDateBadge}>
                        <Text style={styles.plannedDateBadgeText}>📅 {formatDate(plan.plannedDate)}</Text>
                      </View>
                    </View>
                    {plan.notes ? (
                      <Text style={styles.vaccineItemNote}>📌 {plan.notes}</Text>
                    ) : null}

                    {/* Tamamlandı Olarak İşaretle Butonu */}
                    <TouchableOpacity
                      style={styles.markCompleteBtn}
                      onPress={() => handleCompletePlan(plan)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark-circle" size={14} color="#059669" />
                      <Text style={styles.markCompleteBtnText}>Aşı Yapıldı Olarak İşaretle ✓</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteVacBtn}
                    onPress={() => deleteVaccine(cat.id, plan.id, true)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={15} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </View>

      {/* 6. HAKKINDA & ÖZEL NOTLAR BÖLÜMÜ */}
      <View style={styles.notesCard}>
        <View style={styles.notesHeader}>
          <View style={styles.notesTitleBox}>
            <Ionicons name="document-text" size={20} color={Colors.primary} />
            <Text style={styles.notesTitle}>Hakkında & Notlar 📝</Text>
          </View>

          {!isEditingNote && (
            <TouchableOpacity
              style={styles.editNoteBtn}
              onPress={() => setIsEditingNote(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={15} color={Colors.primaryDark} />
              <Text style={styles.editNoteBtnText}>
                {cat.notes && cat.notes.trim().length > 0 ? 'Düzenle' : 'Not Ekle'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditingNote ? (
          <View style={styles.editNoteBox}>
            <TextInput
              style={styles.noteTextInput}
              placeholder={`${cat.name} hakkında notlar al (karakteri, huyları, sevdiği şeyler)...`}
              placeholderTextColor={Colors.textMuted}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
            />

            <View style={styles.noteActionsRow}>
              <TouchableOpacity
                style={styles.cancelNoteBtn}
                onPress={() => {
                  setNoteText(cat?.notes || '');
                  setIsEditingNote(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelNoteBtnText}>Vazgeç</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveNoteBtn}
                onPress={handleSaveNotes}
                activeOpacity={0.85}
              >
                <Ionicons name="save-outline" size={16} color="#FFFFFF" />
                <Text style={styles.saveNoteBtnText}>Notu Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {cat.notes && cat.notes.trim().length > 0 ? (
              <View style={styles.noteDisplayBox}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.noteQuoteIcon}
                />
                <Text style={styles.noteDisplayText}>{cat.notes}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.emptyNotePromptBox}
                onPress={() => setIsEditingNote(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={28} color={Colors.primary} />
                <Text style={styles.emptyNotePromptTitle}>Henüz bir not yazılmadı</Text>
                <Text style={styles.emptyNotePromptSub}>
                  {cat.name} dostumuzun huyları veya sevdiği şeyler hakkında buraya not alabilirsin.
                </Text>
                <View style={styles.addNotePill}>
                  <Text style={styles.addNotePillText}>+ Not Ekle</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* 7. FOTOĞRAF ALBÜMÜ BÖLÜMÜ (GRID VIEW) */}
      <View style={styles.albumCard}>
        <View style={styles.albumHeader}>
          <View style={styles.albumTitleBox}>
            <Ionicons name="images" size={20} color={Colors.primary} />
            <Text style={styles.albumTitle}>Fotoğraf Albümü</Text>
            <View style={styles.albumCountBadge}>
              <Text style={styles.albumCountText}>{catPhotos.length}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addPhotoBtn}
            onPress={handlePickNewPhoto}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={16} color="#FFFFFF" />
            <Text style={styles.addPhotoBtnText}>Fotoğraf Ekle</Text>
          </TouchableOpacity>
        </View>

        {catPhotos.length === 0 ? (
          <View style={styles.emptyAlbumBox}>
            <Ionicons name="image-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyAlbumText}>Henüz albümde fotoğraf yok.</Text>
            <TouchableOpacity style={styles.emptyAlbumAddBtn} onPress={handlePickNewPhoto}>
              <Text style={styles.emptyAlbumAddBtnText}>İlk Fotoğrafı Çek / Seç 📷</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoGrid}>
            {catPhotos.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.photoGridItem}>
                <Image source={getImageSource(uri)} style={styles.gridImage} />
                {index === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Kapak</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 8. GEÇMİŞ ETKİLEŞİM TARİHLERİ */}
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
              Yukarıdaki butonlara dokunarak ilk ilgilenmeni kaydedebilirsin!
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
                      : item.type === 'playing'
                      ? 'game-controller'
                      : 'medkit'
                  }
                  size={16}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.historyTextCol}>
                <Text style={styles.historyNote}>{item.note || 'Etkileşim'}</Text>
                <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              </View>

              <View style={styles.historyTag}>
                <Text style={styles.historyTagText}>+1 Bağ</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* MODAL 1: BİLGİLERİ DÜZENLEME MODALI */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Kedi Bilgilerini Düzenle ✏️</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* İsim */}
              <Text style={styles.modalInputLabel}>Kedinin İsmi *</Text>
              <TextInput
                style={styles.modalInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Kedinin ismi"
                placeholderTextColor={Colors.textMuted}
              />

              {/* Cins */}
              <Text style={styles.modalInputLabel}>Cinsi / Renk Deseni</Text>
              <TextInput
                style={styles.modalInput}
                value={editBreed}
                onChangeText={setEditBreed}
                placeholder="Örn: Tekir, Calico, Sarman"
                placeholderTextColor={Colors.textMuted}
              />

              {/* Konum / Bölge */}
              <Text style={styles.modalInputLabel}>Konum / Bölge Adı *</Text>
              <Text style={styles.modalHelperText}>
                💡 Konumu değiştirdiğinde eski konum otomatik olarak geçmişe kaydedilir.
              </Text>
              <TextInput
                style={styles.modalInput}
                value={editRegionName}
                onChangeText={setEditRegionName}
                placeholder="Örn: Kocatepe Metrosu, Moda Parkı..."
                placeholderTextColor={Colors.textMuted}
              />

              {/* GPS Al Butonu */}
              <TouchableOpacity
                style={[styles.modalGpsBtn, editCoordinates && styles.modalGpsBtnActive]}
                onPress={handleGetLocationInEdit}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <>
                    <Ionicons
                      name={editCoordinates ? 'checkmark-circle' : 'navigate-circle-outline'}
                      size={18}
                      color={editCoordinates ? Colors.green : Colors.primary}
                    />
                    <Text style={styles.modalGpsBtnText}>
                      {editCoordinates
                        ? `GPS Alındı (${editCoordinates.latitude.toFixed(3)}, ${editCoordinates.longitude.toFixed(3)}) ✓`
                        : '📍 Güncel GPS Konumumu Al'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Notlar */}
              <Text style={styles.modalInputLabel}>Hakkında Notlar & Bilgiler</Text>
              <TextInput
                style={[styles.modalInput, styles.modalMultilineInput]}
                value={editNotes}
                onChangeText={setEditNotes}
                placeholder="Kedi hakkında notlar..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Vazgeç</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveEditModal}>
                  <Text style={styles.modalSaveBtnText}>Güncellemeleri Kaydet</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: TAMAMLANAN AŞI EKLEME MODALI */}
      <Modal
        visible={isAddVaccineModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddVaccineModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Tamamlanan Aşı Ekle 💉</Text>
              <TouchableOpacity onPress={() => setIsAddVaccineModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalInputLabel}>Hızlı Aşı Seç</Text>
              <View style={styles.quickTagsWrap}>
                {QUICK_VACCINE_SUGGESTIONS.map((sug) => (
                  <TouchableOpacity
                    key={sug}
                    style={[styles.quickTagBtn, newVacName === sug && styles.quickTagBtnActive]}
                    onPress={() => setNewVacName(sug)}
                  >
                    <Text
                      style={[
                        styles.quickTagBtnText,
                        newVacName === sug && styles.quickTagBtnTextActive,
                      ]}
                    >
                      {sug}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalInputLabel}>Aşı Adı *</Text>
              <TextInput
                style={styles.modalInput}
                value={newVacName}
                onChangeText={setNewVacName}
                placeholder="Örn: Kuduz Aşısı"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.modalInputLabel}>Uygulanma Tarihi (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.modalInput}
                value={newVacDate}
                onChangeText={setNewVacDate}
                placeholder="2026-10-11"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.modalInputLabel}>Klinik / Veteriner (İsteğe bağlı)</Text>
              <TextInput
                style={styles.modalInput}
                value={newVacClinic}
                onChangeText={setNewVacClinic}
                placeholder="Örn: Kadıköy Belediye Vet."
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.modalInputLabel}>Notlar (İsteğe bağlı)</Text>
              <TextInput
                style={styles.modalInput}
                value={newVacNotes}
                onChangeText={setNewVacNotes}
                placeholder="Örn: Ense damlası uygulandı"
                placeholderTextColor={Colors.textMuted}
              />

              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsAddVaccineModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Vazgeç</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveVaccine}>
                  <Text style={styles.modalSaveBtnText}>Aşıyı Kaydet</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: GELECEK AŞI PLANLAMA MODALI */}
      <Modal
        visible={isScheduleModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsScheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Gelecek Aşı Planla 📅</Text>
              <TouchableOpacity onPress={() => setIsScheduleModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalInputLabel}>Hızlı Öneri Seç</Text>
              <View style={styles.quickTagsWrap}>
                {QUICK_SCHEDULE_SUGGESTIONS.map((sug) => (
                  <TouchableOpacity
                    key={sug}
                    style={[styles.quickTagBtn, newSchName === sug && styles.quickTagBtnActive]}
                    onPress={() => setNewSchName(sug)}
                  >
                    <Text
                      style={[
                        styles.quickTagBtnText,
                        newSchName === sug && styles.quickTagBtnTextActive,
                      ]}
                    >
                      {sug}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalInputLabel}>Planlanan Aşı Adı *</Text>
              <TextInput
                style={styles.modalInput}
                value={newSchName}
                onChangeText={setNewSchName}
                placeholder="Örn: İç-Dış Parazit Tekrarı"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.modalInputLabel}>Planlanan Tarih (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.modalInput}
                value={newSchDate}
                onChangeText={setNewSchDate}
                placeholder="2026-11-15"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.modalInputLabel}>Hatırlatma Notu (İsteğe bağlı)</Text>
              <TextInput
                style={styles.modalInput}
                value={newSchNotes}
                onChangeText={setNewSchNotes}
                placeholder="Örn: 3 aylık periyot için ense damlası"
                placeholderTextColor={Colors.textMuted}
              />

              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsScheduleModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Vazgeç</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveSchedule}>
                  <Text style={styles.modalSaveBtnText}>Aşıyı Planla</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginBottom: 16,
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
    fontSize: 25,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  editInfoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EC',
    borderWidth: 1,
    borderColor: '#FFD9CB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    marginRight: 6,
  },
  editInfoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  levelBadge: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
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
    marginTop: 16,
    paddingTop: 14,
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
    fontSize: 14,
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
    height: 12,
    backgroundColor: '#F3E8E2',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
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
  quickInteractionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 17,
  },
  interactionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 6,
  },
  interactionBtnEmoji: {
    fontSize: 17,
  },
  interactionBtnTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  locationHistoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  editLocationShortBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  editLocationShortText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.blue,
  },
  currentLocationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currentLocationPin: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentLocLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currentLocLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeLocBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  activeLocBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  currentLocTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  pastLocHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptyHistoryLocBox: {
    backgroundColor: '#FAF5F0',
    borderRadius: 12,
    padding: 10,
  },
  emptyHistoryLocText: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  historyLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8E2',
    gap: 10,
  },
  historyLocDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  historyLocName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  historyLocDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  vaccineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  vaccineActionButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  addVaccineHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  addVaccineHeaderBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scheduleHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  scheduleHeaderBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  vaccineTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F0',
    borderRadius: 14,
    padding: 4,
    marginTop: 6,
    marginBottom: 12,
    gap: 4,
  },
  vaccineTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  vaccineTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  vaccineTabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  vaccineTabBtnTextActive: {
    color: Colors.text,
    fontWeight: '800',
  },
  tabContentArea: {
    marginTop: 2,
  },
  emptyVaccineBox: {
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3E8E2',
    borderStyle: 'dashed',
  },
  emptyVaccineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 6,
  },
  emptyVaccineSub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 3,
    maxWidth: 260,
    lineHeight: 16,
  },
  vaccineRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF5F0',
    gap: 10,
  },
  vaccineIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaccineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaccineItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  vaccineItemDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  vaccineItemClinic: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  vaccineItemNote: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  deleteVacBtn: {
    padding: 6,
  },
  scheduledRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF5F0',
    gap: 10,
  },
  scheduledIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  scheduledItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  plannedDateBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  plannedDateBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  markCompleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },
  markCompleteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notesTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  editNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  editNoteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  editNoteBox: {
    marginTop: 4,
  },
  noteTextInput: {
    backgroundColor: '#FFFBF9',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    borderRadius: 16,
    padding: 12,
    fontSize: 13,
    color: Colors.text,
    height: 100,
    lineHeight: 19,
  },
  noteActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  cancelNoteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FAF5F0',
  },
  cancelNoteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  saveNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  saveNoteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noteDisplayBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#F8EDE7',
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  noteQuoteIcon: {
    marginTop: 2,
  },
  noteDisplayText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 19,
    fontWeight: '500',
  },
  emptyNotePromptBox: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F8EDE7',
    borderStyle: 'dashed',
  },
  emptyNotePromptTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  emptyNotePromptSub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 10,
    lineHeight: 16,
    maxWidth: 270,
  },
  addNotePill: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  addNotePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  albumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  albumTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  albumTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  albumCountBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  albumCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 5,
  },
  addPhotoBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyAlbumBox: {
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#FFFBF9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F8EDE7',
    borderStyle: 'dashed',
  },
  emptyAlbumText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 8,
  },
  emptyAlbumAddBtn: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  emptyAlbumAddBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoGridItem: {
    position: 'relative',
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.primaryLight,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  historyCountPill: {
    backgroundColor: '#FAF5F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  historyCountPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptyHistoryBox: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  emptyHistoryEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyHistoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyHistorySub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF5F0',
  },
  historyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyTextCol: {
    flex: 1,
  },
  historyNote: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  historyDate: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  historyTag: {
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  historyTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8E2',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 10,
    marginBottom: 5,
  },
  modalHelperText: {
    fontSize: 11,
    color: Colors.primaryDark,
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: '#FFFBF9',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: Colors.text,
  },
  modalMultilineInput: {
    height: 70,
  },
  modalGpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EC',
    borderWidth: 1.5,
    borderColor: '#FFD9CB',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 8,
    gap: 6,
  },
  modalGpsBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  modalGpsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FAF5F0',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  quickTagBtn: {
    backgroundColor: '#FAF5F0',
    borderWidth: 1,
    borderColor: '#F3E8E2',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  quickTagBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  quickTagBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  quickTagBtnTextActive: {
    color: Colors.primaryDark,
    fontWeight: '800',
  },
});
