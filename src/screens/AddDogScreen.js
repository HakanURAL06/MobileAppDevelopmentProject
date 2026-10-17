import React, { useState } from 'react';
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

// Köpeklere Özel Çeşitlendirilmiş İlk Etkileşim Seçenekleri
const DOG_INTERACTION_OPTIONS = [
  {
    id: 'feeding',
    type: 'feeding',
    emoji: '🥣',
    title: 'Mama Verdim',
    desc: 'Kuru veya konserve mama ile besledim',
    note: 'İlk tanışmada mama verildi 🥣',
    color: Colors.primaryDark,
    activeBg: '#FFF2EC',
    activeBorder: '#FFBFA8',
  },
  {
    id: 'walking',
    type: 'walking',
    emoji: '🦮',
    title: 'Birlikte Yürüdük',
    desc: 'Güvenle yürüdük, etrafı kokladı ve enerjisini attı',
    note: 'Birlikte keyifle yürüyüş yapıldı 🦮',
    color: '#0284C7',
    activeBg: '#F0F9FF',
    activeBorder: '#BAE6FD',
  },
  {
    id: 'petting',
    type: 'petting',
    emoji: '🐕',
    title: 'Sevdim / Göbüşünü Kaşıdım',
    desc: 'Kuyruk salladı, sırtüstü yattı ve kendini sevdirdi',
    note: 'Baş ve göbüş okşandı, neşeyle kuyruk salladı 🐕',
    color: Colors.secondary,
    activeBg: '#FFF0F4',
    activeBorder: '#FFBAC9',
  },
  {
    id: 'playing',
    type: 'playing',
    emoji: '🎾',
    title: 'Top / Oyun Oynadık',
    desc: 'Top veya nesne yakalama oyunu oynadık',
    note: 'Top yakalama oyunu oynandı, neşeyle koştu 🎾',
    color: '#D97706',
    activeBg: '#FEF9E7',
    activeBorder: '#FDE68A',
  },
  {
    id: 'water',
    type: 'feeding',
    emoji: '💧',
    title: 'Temiz Su Bıraktım',
    desc: 'Taze ve serin bir kap su koydum',
    note: 'Taze ve temiz su bırakıldı 💧',
    color: Colors.blue,
    activeBg: '#EDF6FD',
    activeBorder: '#BCE0FB',
  },
  {
    id: 'treat',
    type: 'feeding',
    emoji: '🦴',
    title: 'Ödül Maması / Kemik',
    desc: 'Lezzetli ödül bisküvisi veya çiğneme kemiği verdim',
    note: 'Ödül bisküvisi veya kemik ikram edildi 🦴',
    color: '#7C3AED',
    activeBg: '#F5F3FF',
    activeBorder: '#DDD6FE',
  },
  {
    id: 'health',
    type: 'other',
    emoji: '🩺',
    title: 'Sağlık / Durum Kontrolü',
    desc: 'Pati, kulak, tüy ve genel sağlık durumunu inceledim',
    note: 'Pati, kulak ve genel sağlık kontrol edildi 🩺',
    color: '#059669',
    activeBg: '#EEFBF3',
    activeBorder: '#A7F3D0',
  },
];

export default function AddDogScreen({ navigation }) {
  const addDog = useCatStore((state) => state.addDog);
  const showToast = useCatStore((state) => state.showToast);

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [regionName, setRegionName] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  // Başlangıçta mama ve yürüyüş varsayılan seçili
  const [selectedInteractions, setSelectedInteractions] = useState(['feeding', 'petting']);

  const toggleInteraction = (id) => {
    setSelectedInteractions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllInteractions = () => {
    if (selectedInteractions.length === DOG_INTERACTION_OPTIONS.length) {
      setSelectedInteractions([]);
    } else {
      setSelectedInteractions(DOG_INTERACTION_OPTIONS.map((opt) => opt.id));
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
      const option = DOG_INTERACTION_OPTIONS.find((opt) => opt.id === id);
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

  const isAllSelected = selectedInteractions.length === DOG_INTERACTION_OPTIONS.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yeni Köpek Ekle 🐶</Text>
        <Text style={styles.headerSubtitle}>
          Sokakta karşılaştığın sadık dostu kaydet, yürüyüşe çıkar, besle ve bağ kurmaya başla!
        </Text>
      </View>

      {/* FOTOĞRAF ALANI */}
      <View style={styles.photoContainer}>
        {photoUri ? (
          <View style={styles.imageWrapper}>
            <TouchableOpacity
              style={{ width: '100%', height: '100%' }}
              activeOpacity={0.92}
              onPress={() => setIsViewerVisible(true)}
            >
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
              <View style={styles.previewZoomBadge}>
                <Ionicons name="scan-outline" size={13} color="#FFFFFF" />
                <Text style={styles.previewZoomBadgeText}>Fotoğrafı Büyüt 🔍</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => setPhotoUri(null)}
            >
              <Ionicons name="close-circle" size={26} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoEmptyBox}>
            <Text style={{ fontSize: 44, marginBottom: 6 }}>🐶</Text>
            <Text style={styles.photoPromptTitle}>Fotoğraf Seç veya Çek</Text>
            <Text style={styles.photoPromptSub}>Sadık dostumuzun tatlı bir fotoğrafını ekle!</Text>

            <View style={styles.photoButtonsRow}>
              <TouchableOpacity style={styles.photoOptionBtn} onPress={pickFromGallery}>
                <Ionicons name="images-outline" size={18} color="#D97706" />
                <Text style={[styles.photoOptionText, { color: '#D97706' }]}>Galeri</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.photoOptionBtn} onPress={takePhotoWithCamera}>
                <Ionicons name="camera-outline" size={18} color="#D97706" />
                <Text style={[styles.photoOptionText, { color: '#D97706' }]}>Kamera</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* FORM KARTI */}
      <View style={styles.formCard}>
        {/* Köpek Adı */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Köpeğin İsmi / Lakabı *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="heart-outline" size={20} color="#D97706" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Örn: Karabaş, Dost, Çomar, Zeytin..."
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Köpek Cinsi */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cinsi / Irk Deseni</Text>
          <View style={styles.inputBox}>
            <Ionicons name="paw-outline" size={20} color="#0284C7" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Örn: Sokak Melezi, Golden Kırması, Kangal Melezi..."
              placeholderTextColor={Colors.textMuted}
              value={breed}
              onChangeText={setBreed}
            />
          </View>
        </View>

        {/* Konum / Bölge */}
        <View style={styles.inputGroup}>
          <View style={styles.labelWithBadgeRow}>
            <Text style={styles.label}>Konum / Bölge Adı *</Text>
            <View style={styles.groupingHintBadge}>
              <Text style={styles.groupingHintBadgeText}>📍 Gruplamada Kullanılır</Text>
            </View>
          </View>
          <Text style={styles.helperText}>
            GPS koordinatı alsan bile buraya istediğin ismi (örn: Park Girişi, Meydan, Sahil) verebilirsin.
          </Text>
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Örn: Bebek Parkı, Üniversite Kampüsü, Meydan..."
              placeholderTextColor={Colors.textMuted}
              value={regionName}
              onChangeText={setRegionName}
            />
          </View>

          <TouchableOpacity
            style={[styles.locationBtn, coordinates && styles.locationBtnActive]}
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
                  color={coordinates ? Colors.green : '#D97706'}
                />
                <Text style={[styles.locationBtnText, coordinates && styles.locationBtnTextActive]}>
                  {coordinates
                    ? `GPS Alındı (${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)}) ✓`
                    : '📍 Mevcut GPS Konumumu Al'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Notlar */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hakkında Notlar & Bilgiler 📝</Text>
          <Text style={styles.helperText}>
            Karakteri, tasması var mı, aşı durumu veya sevdiği oyunlar
          </Text>
          <View style={[styles.inputBox, styles.notesInputBox]}>
            <Ionicons
              name="create-outline"
              size={20}
              color="#D97706"
              style={[styles.inputIcon, { marginTop: 12, alignSelf: 'flex-start' }]}
            />
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Örn: Tasması mavi, top oynamayı çok seviyor, yabancılara karşı uysal ve sıcakkanlı..."
              placeholderTextColor={Colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* KÖPEKLERE ÖZEL İLK ETKİLEŞİM SEÇENEKLERİ */}
        <View style={styles.interactionSection}>
          <View style={styles.interactionHeaderRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.interactionTitleBox}>
                <Ionicons name="sparkles" size={18} color="#D97706" />
                <Text style={styles.interactionMainTitle}>İlk Tanışma & Etkileşimler</Text>
              </View>
              <Text style={styles.interactionMainSubtitle}>
                Bu sadık dostla karşılaştığında hangilerini yaptın?
              </Text>
            </View>

            <TouchableOpacity style={styles.toggleAllBtn} onPress={selectAllInteractions}>
              <Text style={styles.toggleAllBtnText}>
                {isAllSelected ? 'Temizle' : 'Tümünü Seç'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectionCountBar}>
            <Ionicons name="heart" size={14} color="#D97706" />
            <Text style={styles.selectionCountText}>
              {selectedInteractions.length > 0
                ? `${selectedInteractions.length} Etkileşim Seçildi (+${selectedInteractions.length} Sadakat Puanı)`
                : 'Henüz bir etkileşim seçilmedi'}
            </Text>
          </View>

          <View style={styles.optionsList}>
            {DOG_INTERACTION_OPTIONS.map((option) => {
              const isSelected = selectedInteractions.includes(option.id);

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && {
                      backgroundColor: option.activeBg,
                      borderColor: option.activeBorder,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleInteraction(option.id)}
                >
                  <View style={styles.optionEmojiBox}>
                    <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  </View>

                  <View style={styles.optionTextCol}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && { color: option.color, fontWeight: '800' },
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text style={styles.optionDesc}>{option.desc}</Text>
                  </View>

                  <View
                    style={[
                      styles.checkboxCircle,
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
          <Text style={styles.submitButtonText}>Köpeği Kaydet</Text>
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
