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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';
import ImageViewerModal from '../components/ImageViewerModal';
import useAppTheme from '../theme/useAppTheme';

export default function AddDogScreen({ navigation }) {
  const addDog = useCatStore((state) => state.addDog);
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

  // Köpeklere Özel Çeşitlendirilmiş İlk Etkileşim Seçenekleri
  const dogInteractionOptions = useMemo(() => [
    {
      id: 'feeding',
      type: 'feeding',
      emoji: '🥣',
      title: t.interactionDogFeeding,
      desc: language === 'en' ? 'Fed with dry or canned food' : 'Kuru veya konserve mama ile besledim',
      note: t.interactionDogFeedingNote,
      color: colors.primary,
      activeBg: isDark ? '#2C1D18' : '#FFF2EC',
      activeBorder: isDark ? '#4A2A20' : '#FFBFA8',
    },
    {
      id: 'walking',
      type: 'walking',
      emoji: '🦮',
      title: t.interactionDogWalking,
      desc: language === 'en' ? 'Walked together safely and happily' : 'Güvenle yürüdük, etrafı kokladı ve enerjisini attı',
      note: t.interactionDogWalkingNote,
      color: '#0284C7',
      activeBg: isDark ? '#142536' : '#F0F9FF',
      activeBorder: isDark ? '#1E3E5C' : '#BAE6FD',
    },
    {
      id: 'petting',
      type: 'petting',
      emoji: '🐕',
      title: t.interactionDogPetting,
      desc: language === 'en' ? 'Wagged tail, belly rubbed' : 'Kuyruk salladı, sırtüstü yattı ve kendini sevdirdi',
      note: t.interactionDogPettingNote,
      color: '#D946EF',
      activeBg: isDark ? '#2B142E' : '#FDF4FF',
      activeBorder: isDark ? '#4A2050' : '#F5D0FE',
    },
    {
      id: 'playing',
      type: 'playing',
      emoji: '🎾',
      title: t.interactionDogPlaying,
      desc: language === 'en' ? 'Played fetch with ball or toy' : 'Top veya nesne yakalama oyunu oynadık',
      note: t.interactionDogPlayingNote,
      color: '#D97706',
      activeBg: isDark ? '#2C2310' : '#FEF9E7',
      activeBorder: isDark ? '#4B3F1E' : '#FDE68A',
    },
    {
      id: 'water',
      type: 'feeding',
      emoji: '💧',
      title: t.interactionDogWater,
      desc: language === 'en' ? 'Placed cool, fresh water' : 'Taze ve serin bir kap su koydum',
      note: t.interactionDogWaterNote,
      color: '#0D9488',
      activeBg: isDark ? '#122826' : '#EDF6FD',
      activeBorder: isDark ? '#1C4541' : '#BCE0FB',
    },
    {
      id: 'treat',
      type: 'feeding',
      emoji: '🦴',
      title: t.interactionDogTreat,
      desc: language === 'en' ? 'Treated with delicious chew bone' : 'Lezzetli ödül bisküvisi veya çiğneme kemiği verdim',
      note: t.interactionDogTreatNote,
      color: '#7C3AED',
      activeBg: isDark ? '#23173D' : '#F5F3FF',
      activeBorder: isDark ? '#3D256D' : '#DDD6FE',
    },
    {
      id: 'health',
      type: 'other',
      emoji: '🩺',
      title: t.interactionDogHealth,
      desc: language === 'en' ? 'Checked paws, ears, coat and health' : 'Pati, kulak, tüy ve genel sağlık durumunu inceledim',
      note: t.interactionDogHealthNote,
      color: '#059669',
      activeBg: isDark ? '#13281E' : '#EEFBF3',
      activeBorder: isDark ? '#1C4530' : '#A7F3D0',
    },
  ], [t, colors, isDark, language]);

  // Başlangıçta mama ve yürüyüş varsayılan seçili
  const [selectedInteractions, setSelectedInteractions] = useState(['feeding', 'petting']);

  const toggleInteraction = (id) => {
    setSelectedInteractions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllInteractions = () => {
    if (selectedInteractions.length === dogInteractionOptions.length) {
      setSelectedInteractions([]);
    } else {
      setSelectedInteractions(dogInteractionOptions.map((opt) => opt.id));
    }
  };

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
    } catch {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
    }
  };

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
    } catch {
      Alert.alert('Hata', 'Kamera başlatılırken bir hata oluştu.');
    }
  };

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

      if (!regionName.trim()) {
        setRegionName('Konumum (GPS)');
      }

      showToast('GPS koordinatları kaydedildi 📍', 'info');
    } catch {
      Alert.alert('Hata', 'Konum bilgisi alınamadı.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      showToast('Lütfen sevimli dostumuzun adını yazın 🐶', 'info');
      return;
    }

    const defaultDogPhoto =
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80';

    const now = new Date().toISOString();

    const initialInteractionsData = selectedInteractions.map((id) => {
      const option = dogInteractionOptions.find((opt) => opt.id === id);
      return {
        type: option?.type || 'feeding',
        note: option?.note || 'İlk etkileşim',
        date: now,
      };
    });

    addDog({
      name: name.trim(),
      breed: breed.trim() || 'Sokak Köpeği / Melez',
      photoUri: photoUri || defaultDogPhoto,
      location: {
        regionName: regionName.trim() || 'Bilinmeyen Bölge',
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,
      },
      notes: notes.trim(),
      initialInteractions: initialInteractionsData,
    });

    setName('');
    setBreed('');
    setRegionName('');
    setNotes('');
    setPhotoUri(null);
    setCoordinates(null);
    setSelectedInteractions(['feeding', 'petting']);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'DogList' });
    }
  };

  const isAllSelected = selectedInteractions.length === dogInteractionOptions.length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t.addDogHeaderTitle}</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {t.addDogHeaderSubtitle}
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
          <View style={[styles.photoEmptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ fontSize: 44, marginBottom: 6 }}>🐶</Text>
            <Text style={[styles.photoPromptTitle, { color: colors.text }]}>{t.photoPickPromptTitle}</Text>
            <Text style={[styles.photoPromptSub, { color: colors.textSecondary }]}>{t.photoPickPromptSub}</Text>

            <View style={styles.photoButtonsRow}>
              <TouchableOpacity
                style={[styles.photoOptionBtn, { backgroundColor: isDark ? '#2D2310' : '#FEF9E7', borderColor: isDark ? '#4B3F1E' : '#FDE68A' }]}
                onPress={pickFromGallery}
              >
                <Ionicons name="images-outline" size={18} color="#D97706" />
                <Text style={[styles.photoOptionText, { color: '#D97706' }]}>{t.galleryBtn}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.photoOptionBtn, { backgroundColor: isDark ? '#2D2310' : '#FEF9E7', borderColor: isDark ? '#4B3F1E' : '#FDE68A' }]}
                onPress={takePhotoWithCamera}
              >
                <Ionicons name="camera-outline" size={18} color="#D97706" />
                <Text style={[styles.photoOptionText, { color: '#D97706' }]}>{t.cameraBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* FORM KARTI */}
      <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Köpek Adı */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.inputNameLabel} *</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons name="heart-outline" size={20} color="#D97706" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t.inputNamePlaceholderDog}
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Köpek Cinsi */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.inputBreedLabel}</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons name="paw-outline" size={20} color="#0284C7" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t.inputBreedPlaceholderDog}
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

          <TouchableOpacity
            style={[
              styles.locationBtn,
              { backgroundColor: isDark ? '#2D2310' : '#FEF9E7', borderColor: isDark ? '#4B3F1E' : '#FDE68A' },
              coordinates && (isDark ? { backgroundColor: '#143022', borderColor: '#1F4E36' } : styles.locationBtnActive),
            ]}
            onPress={handleGetLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <ActivityIndicator size="small" color="#D97706" />
            ) : (
              <>
                <Ionicons
                  name={coordinates ? 'checkmark-circle' : 'navigate-circle-outline'}
                  size={18}
                  color={coordinates ? colors.green : '#D97706'}
                />
                <Text style={[styles.locationBtnText, coordinates && styles.locationBtnTextActive]}>
                  {coordinates
                    ? `${t.locationAcquired} (${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)})`
                    : t.getLocationBtn}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Notlar */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t.inputNotesLabel} 📝</Text>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t.notesTitle}
          </Text>
          <View style={[styles.inputBox, styles.notesInputBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons
              name="create-outline"
              size={20}
              color="#D97706"
              style={[styles.inputIcon, { marginTop: 12, alignSelf: 'flex-start' }]}
            />
            <TextInput
              style={[styles.input, styles.notesInput, { color: colors.text }]}
              placeholder={t.inputNotesPlaceholderDog}
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* KÖPEKLERE ÖZEL İLK ETKİLEŞİM SEÇENEKLERİ */}
        <View style={[styles.interactionSection, { borderTopColor: colors.border }]}>
          <View style={styles.interactionHeaderRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.interactionTitleBox}>
                <Ionicons name="sparkles" size={18} color="#D97706" />
                <Text style={[styles.interactionMainTitle, { color: colors.text }]}>{t.initialInteractionsTitle}</Text>
              </View>
              <Text style={[styles.interactionMainSubtitle, { color: colors.textSecondary }]}>
                {t.initialInteractionsHelp}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.toggleAllBtn, { backgroundColor: isDark ? '#2D3748' : '#FAF5F0' }]}
              onPress={selectAllInteractions}
            >
              <Text style={[styles.toggleAllBtnText, { color: colors.textSecondary }]}>
                {isAllSelected ? t.clearAll : t.selectAll}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.selectionCountBar, { backgroundColor: isDark ? '#2D2310' : '#FFFBEB' }]}>
            <Ionicons name="heart" size={14} color="#D97706" />
            <Text style={styles.selectionCountText}>
              {selectedInteractions.length > 0
                ? `${selectedInteractions.length} ${t.recordsCount}`
                : '...'}
            </Text>
          </View>

          <View style={styles.optionsList}>
            {dogInteractionOptions.map((option) => {
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

                  <View style={styles.optionTextCol}>
                    <Text
                      style={[
                        styles.optionTitle,
                        { color: colors.text },
                        isSelected && { color: option.color, fontWeight: '800' },
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>{option.desc}</Text>
                  </View>

                  <View
                    style={[
                      styles.checkboxCircle,
                      { borderColor: colors.border, backgroundColor: isDark ? '#2D3748' : '#FFFFFF' },
                      isSelected && {
                        backgroundColor: option.color,
                        borderColor: option.color,
                      },
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* KAYDET BUTONU */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.88}>
          <Text style={styles.submitButtonEmoji}>🐶</Text>
          <Text style={styles.submitButtonText}>{t.submitAddDogBtn}</Text>
          <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tam Ekran Fotoğraf Görüntüleyici */}
      <ImageViewerModal
        visible={isViewerVisible}
        images={photoUri ? [photoUri] : []}
        initialIndex={0}
        onClose={() => setIsViewerVisible(false)}
        title={name ? `${name} Fotoğrafı 🐶` : 'Seçilen Fotoğraf 🐶'}
      />
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
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  photoContainer: {
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 220,
    borderRadius: 22,
    overflow: 'hidden',
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
  },
  photoEmptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    borderStyle: 'dashed',
  },
  photoPromptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  photoPromptSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 6,
  },
  photoOptionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupingHintBadge: {
    backgroundColor: '#FFF2EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  groupingHintBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  helperText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
    lineHeight: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF9',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: Colors.text,
  },
  notesInputBox: {
    alignItems: 'flex-start',
  },
  notesInput: {
    height: 80,
    paddingTop: 10,
    paddingBottom: 10,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 8,
    gap: 6,
  },
  locationBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  locationBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  locationBtnTextActive: {
    color: '#059669',
  },
  interactionSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5ECE6',
  },
  interactionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  interactionTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interactionMainTitle: {
    fontSize: 15,
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
    borderRadius: 10,
  },
  toggleAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  selectionCountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
    gap: 6,
  },
  selectionCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  optionsList: {
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderWidth: 1.5,
    borderColor: '#F3E8E2',
    borderRadius: 16,
    padding: 10,
  },
  optionEmojiBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  optionDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D4C5BC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 20,
    gap: 8,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonEmoji: {
    fontSize: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
