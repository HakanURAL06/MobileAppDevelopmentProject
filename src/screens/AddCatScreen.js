import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';
import ImageViewerModal from '../components/ImageViewerModal';
import useAppTheme from '../theme/useAppTheme';

// Çeşitlendirilmiş İlk Etkileşim Seçenekleri
const INTERACTION_OPTIONS = [
  {
    id: 'feeding',
    type: 'feeding',
    emoji: '🥣',
    title: 'Mama Verdim',
    desc: 'Kuru veya yaş mama ile besledim',
    note: 'İlk tanışmada taze mama verildi 🥣',
    color: Colors.primaryDark,
    activeBg: '#FFF2EC',
    activeBorder: '#FFBFA8',
  },
  {
    id: 'petting',
    type: 'petting',
    emoji: '🐾',
    title: 'Sevdim / Okşadım',
    desc: 'Başını, çenesini okşadım, kendini sevdirdi',
    note: 'Kendini sevdirdi, başı okşandı ✨',
    color: Colors.secondary,
    activeBg: '#FFF0F4',
    activeBorder: '#FFBAC9',
  },
  {
    id: 'water',
    type: 'feeding',
    emoji: '💧',
    title: 'Temiz Su Bıraktım',
    desc: 'Taze ve temiz bir kap su koydum',
    note: 'Taze ve temiz su bırakıldı 💧',
    color: Colors.blue,
    activeBg: '#EDF6FD',
    activeBorder: '#BCE0FB',
  },
  {
    id: 'playing',
    type: 'playing',
    emoji: '🧶',
    title: 'Oyun Oynadım',
    desc: 'İp veya oyuncakla neşeyle vakit geçirdik',
    note: 'Oyun oynandı, neşeyle koşturdu 🧶',
    color: '#D97706',
    activeBg: '#FEF9E7',
    activeBorder: '#FDE68A',
  },
  {
    id: 'health',
    type: 'other',
    emoji: '🩺',
    title: 'Sağlık / Durum Kontrolü',
    desc: 'Tüy, göz ve genel sağlık durumunu inceledim',
    note: 'Genel sağlık ve tüy durumu kontrol edildi 🩺',
    color: '#059669',
    activeBg: '#EEFBF3',
    activeBorder: '#A7F3D0',
  },
];

export default function AddCatScreen({ navigation }) {
  const addCat = useCatStore((state) => state.addCat);
  const showToast = useCatStore((state) => state.showToast);
  const { isDark, colors, t, language } = useAppTheme();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [regionName, setRegionName] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const interactionOptions = useMemo(() => [
    {
      id: 'feeding',
      type: 'feeding',
      emoji: '🥣',
      title: t.interactionCatFeeding,
      desc: language === 'en' ? 'Fed with dry or wet food' : 'Kuru veya yaş mama ile besledim',
      note: t.interactionCatFeedingNote,
      color: colors.primary,
      activeBg: isDark ? '#2C1D18' : '#FFF2EC',
      activeBorder: isDark ? '#4A2A20' : '#FFBFA8',
    },
    {
      id: 'petting',
      type: 'petting',
      emoji: '🐾',
      title: t.interactionCatPetting,
      desc: language === 'en' ? 'Pet head and chin, purred gently' : 'Başını, çenesini okşadım, kendini sevdirdi',
      note: t.interactionCatPettingNote,
      color: '#D946EF',
      activeBg: isDark ? '#2B142E' : '#FDF4FF',
      activeBorder: isDark ? '#4A2050' : '#F5D0FE',
    },
    {
      id: 'treat',
      type: 'feeding',
      emoji: '🥫',
      title: t.interactionCatTreat,
      desc: language === 'en' ? 'Treated with delicious snacks' : 'Ödül krakeri / kreması ikram ettim',
      note: t.interactionCatTreatNote,
      color: '#D97706',
      activeBg: isDark ? '#2C2310' : '#FFFBEB',
      activeBorder: isDark ? '#4B3F1E' : '#FDE68A',
    },
    {
      id: 'playing',
      type: 'playing',
      emoji: '🪶',
      title: t.interactionCatPlaying,
      desc: language === 'en' ? 'Played with yarn or toy' : 'İp veya oyuncakla oynadık',
      note: t.interactionCatPlayingNote,
      color: '#0284C7',
      activeBg: isDark ? '#142536' : '#F0F9FF',
      activeBorder: isDark ? '#1E3E5C' : '#BAE6FD',
    },
    {
      id: 'water',
      type: 'feeding',
      emoji: '💧',
      title: t.interactionCatWater,
      desc: language === 'en' ? 'Placed fresh clean water' : 'Temiz içme suyu koydum',
      note: t.interactionCatWaterNote,
      color: '#0D9488',
      activeBg: isDark ? '#122826' : '#F0FDFA',
      activeBorder: isDark ? '#1C4541' : '#CCFBF1',
    },
    {
      id: 'health',
      type: 'other',
      emoji: '🩺',
      title: t.interactionCatHealth,
      desc: language === 'en' ? 'Checked general health' : 'Göz, kulak, pati ve genel durumuna baktım',
      note: t.interactionCatHealthNote,
      color: '#059669',
      activeBg: isDark ? '#13281E' : '#EEFBF3',
      activeBorder: isDark ? '#1C4530' : '#A7F3D0',
    },
  ], [t, isDark, colors, language]);

  // Çoklu seçim: Başlangıçta mama ve sevme varsayılan seçili
  const [selectedInteractions, setSelectedInteractions] = useState(['feeding', 'petting']);

  // Etkileşim Seçimini Aç/Kapat
  const toggleInteraction = (id) => {
    setSelectedInteractions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Hepsini Seç / Temizle
  const selectAllInteractions = () => {
    if (selectedInteractions.length === interactionOptions.length) {
      setSelectedInteractions([]);
    } else {
      setSelectedInteractions(interactionOptions.map((opt) => opt.id));
    }
  };

  // 1. Galeriden Fotoğraf Seçme
  const pickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçebilmek için galeri erişim iznine ihtiyacımız var 📷');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
    }
  };

  // 2. Kameradan Fotoğraf Çekme
  const takePhotoWithCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('İzin Gerekli', 'Kamera ile çekim yapabilmek için kamera izni vermeniz gerekir 📸');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Hata', 'Kamera başlatılırken bir hata oluştu.');
    }
  };

  // 3. expo-location ile Mevcut GPS Konumunu Alma
  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Konum İzni', 'GPS koordinatları için konum iznine izin vermeniz gerekir.');
        setIsGettingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoordinates({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      // Kullanıcı zaten bir isim yazmışsa ezme, boşsa öneri ver
      if (!regionName.trim()) {
        setRegionName('Konumum (GPS)');
      }

      Alert.alert(
        'GPS Konumu Alındı! 📍',
        `Koordinatlar (${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}) başarıyla kaydedildi!\n\nYukarıdaki "Konum / Bölge Adı" kutusuna bu alan için istediğin ismi (örn: Moda Parkı, Evimin Önü) verebilirsin. Kediler bu isme göre gruplanacaktır.`
      );
    } catch (error) {
      Alert.alert('Hata', 'Konum bilgisi alınamadı.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // 4. Form Gönderimi & Zustand Store'a Kayıt
  const handleSubmit = () => {
    if (!name.trim()) {
      showToast('Lütfen sevimli dostumuzun adını yazın 🐾', 'info');
      return;
    }

    const defaultCatPhoto =
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80';

    const now = new Date().toISOString();

    // Seçilen etkileşimlerin detaylarını hazırla
    const initialInteractionsData = selectedInteractions.map((id) => {
      const option = interactionOptions.find((opt) => opt.id === id);
      return {
        type: option?.type || 'feeding',
        note: option?.note || 'İlk etkileşim',
        date: now,
      };
    });

    addCat({
      name: name.trim(),
      breed: breed.trim() || 'Tekir / Melez',
      photoUri: photoUri || defaultCatPhoto,
      location: {
        regionName: regionName.trim() || 'Bilinmeyen Bölge',
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,
      },
      notes: notes.trim(),
      initialInteractions: initialInteractionsData,
    });

    // Formu temizle
    setName('');
    setBreed('');
    setRegionName('');
    setNotes('');
    setPhotoUri(null);
    setCoordinates(null);
    setSelectedInteractions(['feeding', 'petting']);

    // Listeye dön
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'CatList' });
    }
  };

  const isAllSelected = selectedInteractions.length === interactionOptions.length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Başlık Alanı */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t.addCatHeaderTitle}</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {t.addCatHeaderSubtitle}
        </Text>
      </View>

      {/* FOTOĞRAF ALANI */}
      <View style={styles.photoContainer}>
        {photoUri ? (
          <View style={[styles.imageWrapper, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={{ width: '100%', height: '100%' }}
              activeOpacity={0.92}
              onPress={() => setIsViewerVisible(true)}
            >
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
              <View style={styles.previewZoomBadge}>
                <Ionicons name="scan-outline" size={13} color="#FFFFFF" />
                <Text style={styles.previewZoomBadgeText}>{t.enlargePhotoBadge}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.removePhotoButton, { backgroundColor: colors.card }]}
              onPress={() => setPhotoUri(null)}
            >
              <Ionicons name="close-circle" size={26} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.photoEmptyBox, { backgroundColor: colors.card, borderColor: isDark ? colors.border : '#FED7D7' }]}>
            <Ionicons name="paw" size={44} color={colors.primary} />
            <Text style={[styles.photoPromptTitle, { color: colors.text }]}>{t.photoPickPromptTitle}</Text>
            <Text style={[styles.photoPromptSub, { color: colors.textSecondary }]}>{t.photoPickPromptSub}</Text>

            <View style={styles.photoButtonsRow}>
              <TouchableOpacity style={[styles.photoOptionBtn, { backgroundColor: isDark ? '#2D201A' : Colors.primaryLight }]} onPress={pickFromGallery}>
                <Ionicons name="images-outline" size={18} color={colors.primary} />
                <Text style={[styles.photoOptionText, { color: colors.primary }]}>{t.galleryBtn}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.photoOptionBtn, { backgroundColor: isDark ? '#2D201A' : Colors.primaryLight }]} onPress={takePhotoWithCamera}>
                <Ionicons name="camera-outline" size={18} color={colors.primary} />
                <Text style={[styles.photoOptionText, { color: colors.primary }]}>{t.cameraBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* FORM KARTI */}
      <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Kedi Adı */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.inputNameLabel} *</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons name="heart-outline" size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t.inputNamePlaceholderCat}
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Kedi Cinsi */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.inputBreedLabel}</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons name="color-palette-outline" size={20} color={colors.blue} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t.inputBreedPlaceholderCat}
              placeholderTextColor={colors.textMuted}
              value={breed}
              onChangeText={setBreed}
            />
          </View>
        </View>

        {/* Konum / Bölge */}
        <View style={styles.inputGroup}>
          <View style={styles.labelWithBadgeRow}>
            <Text style={[styles.label, { color: colors.text }]}>{t.inputRegionLabel} *</Text>
            <View style={[styles.groupingHintBadge, { backgroundColor: isDark ? '#2C1D18' : '#FFF2EC' }]}>
              <Text style={[styles.groupingHintBadgeText, { color: colors.primary }]}>📍 {t.filterLocation}</Text>
            </View>
          </View>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t.inputRegionHelp}
          </Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t.inputRegionPlaceholder}
              placeholderTextColor={colors.textMuted}
              value={regionName}
              onChangeText={setRegionName}
            />
          </View>

          {/* GPS Konumu Otomatik Alma Butonu */}
          <TouchableOpacity
            style={[
              styles.locationBtn,
              { backgroundColor: isDark ? '#2D201A' : Colors.primaryLight },
              coordinates && { backgroundColor: isDark ? '#143022' : Colors.greenLight }
            ]}
            onPress={handleGetLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Ionicons
                  name={coordinates ? 'checkmark-circle' : 'navigate-circle-outline'}
                  size={18}
                  color={coordinates ? colors.green : colors.primary}
                />
                <Text style={[
                  styles.locationBtnText,
                  { color: colors.primary },
                  coordinates && { color: colors.green }
                ]}>
                  {coordinates
                    ? `${t.locationAcquired} (${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)})`
                    : t.getLocationBtn}
                </Text>
              </>
            )}
          </TouchableOpacity>
          {coordinates && (
            <Text style={[styles.gpsSuccessHint, { color: colors.green }]}>
              💡 {t.locationAcquired}
            </Text>
          )}
        </View>

        {/* Kedi Hakkında Notlar & Bilgiler */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.inputNotesLabel} 📝</Text>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t.notesTitle}
          </Text>
          <View style={[styles.inputBox, styles.notesInputBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons
              name="create-outline"
              size={20}
              color={colors.primary}
              style={[styles.inputIcon, { marginTop: 12, alignSelf: 'flex-start' }]}
            />
            <TextInput
              style={[styles.input, styles.notesInput, { color: colors.text }]}
              placeholder={t.inputNotesPlaceholderCat}
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* ÇEŞİTLENDİRİLMİŞ İLK ETKİLEŞİM SEÇENEKLERİ ALANI */}
        <View style={[styles.interactionSection, { borderTopColor: colors.border }]}>
          <View style={styles.interactionHeaderRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.interactionTitleBox}>
                <Ionicons name="sparkles" size={18} color={colors.primary} />
                <Text style={[styles.interactionMainTitle, { color: colors.text }]}>{t.initialInteractionsTitle}</Text>
              </View>
              <Text style={[styles.interactionMainSubtitle, { color: colors.textSecondary }]}>
                {t.initialInteractionsHelp}
              </Text>
            </View>

            {/* Hepsini Seç / Temizle Butonu */}
            <TouchableOpacity style={[styles.toggleAllBtn, { backgroundColor: isDark ? '#2D3748' : '#FAF5F0' }]} onPress={selectAllInteractions}>
              <Text style={[styles.toggleAllBtnText, { color: colors.textSecondary }]}>
                {isAllSelected ? t.clearAll : t.selectAll}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seçim Sayacı Rozeti */}
          <View style={[styles.selectionCountBar, { backgroundColor: isDark ? '#2C1D18' : '#FFF7F2' }]}>
            <Ionicons name="heart" size={14} color={colors.primary} />
            <Text style={[styles.selectionCountText, { color: colors.primary }]}>
              {selectedInteractions.length > 0
                ? `${selectedInteractions.length} ${t.recordsCount}`
                : '...'}
            </Text>
          </View>

          {/* Etkileşim Seçenek Kartları */}
          <View style={styles.optionsList}>
            {interactionOptions.map((option) => {
              const isSelected = selectedInteractions.includes(option.id);

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    { backgroundColor: isDark ? colors.card : '#FFFDF9', borderColor: colors.border },
                    isSelected && {
                      backgroundColor: option.activeBg,
                      borderColor: option.activeBorder,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleInteraction(option.id)}
                >
                  <View style={[styles.optionEmojiBox, { backgroundColor: isDark ? '#2D3748' : '#FFFFFF' }]}>
                    <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  </View>

                  <View style={styles.optionTextBox}>
                    <Text
                      style={[
                        styles.optionTitle,
                        { color: colors.text },
                        isSelected && { color: colors.text, fontWeight: '800' },
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>{option.desc}</Text>
                  </View>

                  {/* Seçim Göstergesi (Checkbox / Checkmark) */}
                  <View
                    style={[
                      styles.checkCircle,
                      { borderColor: colors.border, backgroundColor: isDark ? '#2D3748' : '#FFFFFF' },
                      isSelected && {
                        backgroundColor: option.color,
                        borderColor: option.color,
                      },
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* KAYDET BUTONU */}
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleSubmit} activeOpacity={0.88}>
          <Text style={styles.submitButtonText}>{t.submitAddCatBtn}</Text>
        </TouchableOpacity>
      </View>

      {/* Tam Ekran Fotoğraf Görüntüleyici */}
      <ImageViewerModal
        visible={isViewerVisible}
        images={photoUri ? [photoUri] : []}
        initialIndex={0}
        onClose={() => setIsViewerVisible(false)}
        title={name ? `${name} Fotoğrafı 🐾` : 'Seçilen Fotoğraf 🐾'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Fildişi Krem
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  photoContainer: {
    marginBottom: 18,
  },
  imageWrapper: {
    position: 'relative',
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewZoomBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  previewZoomBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 2,
  },
  photoEmptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FED7D7',
    borderStyle: 'dashed',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  photoPromptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  photoPromptSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 14,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 6,
  },
  photoOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    marginLeft: 2,
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  groupingHintBadge: {
    backgroundColor: '#FFF2EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  groupingHintBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  helperText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
    marginLeft: 2,
    lineHeight: 15,
  },
  gpsSuccessHint: {
    fontSize: 11,
    color: '#059669',
    marginTop: 6,
    marginLeft: 2,
    fontWeight: '600',
    lineHeight: 15,
  },
  notesInputBox: {
    height: 96,
    alignItems: 'flex-start',
    paddingTop: 8,
  },
  notesInput: {
    height: 80,
    paddingTop: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF9',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 11,
    borderRadius: 14,
    marginTop: 8,
    gap: 6,
  },
  locationBtnActive: {
    backgroundColor: Colors.greenLight,
  },
  locationBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  locationBtnTextActive: {
    color: '#059669',
  },
  interactionSection: {
    marginTop: 10,
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5ECE6',
  },
  interactionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  interactionTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interactionMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  interactionMainSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  toggleAllBtn: {
    backgroundColor: '#FAF5F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  toggleAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  selectionCountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 6,
    marginBottom: 12,
  },
  selectionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  optionEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionTextBox: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  optionDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
