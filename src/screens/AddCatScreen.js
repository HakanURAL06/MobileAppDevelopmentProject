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
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';

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

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [regionName, setRegionName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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
    if (selectedInteractions.length === INTERACTION_OPTIONS.length) {
      setSelectedInteractions([]);
    } else {
      setSelectedInteractions(INTERACTION_OPTIONS.map((opt) => opt.id));
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

      if (!regionName) {
        setRegionName('Yakınımdaki Sokak');
      }

      Alert.alert('Başarılı! 📍', 'Mevcut konum koordinatların alındı.');
    } catch (error) {
      Alert.alert('Hata', 'Konum bilgisi alınamadı.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // 4. Form Gönderimi & Zustand Store'a Kayıt
  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen sevimli dostumuzun adını veya lakabını yazın 🐾');
      return;
    }

    const defaultCatPhoto =
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80';

    const now = new Date().toISOString();

    // Seçilen etkileşimlerin detaylarını hazırla
    const initialInteractionsData = selectedInteractions.map((id) => {
      const option = INTERACTION_OPTIONS.find((opt) => opt.id === id);
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
        regionName: regionName.trim() || 'Genel Bölge Kedileri',
        latitude: coordinates?.latitude || 40.988,
        longitude: coordinates?.longitude || 29.025,
      },
      initialInteractions: initialInteractionsData,
    });

    const interactionCountText =
      initialInteractionsData.length > 0
        ? `${initialInteractionsData.length} adet ilk etkileşim kaydedildi ve bağ seviyeniz yükseltildi!`
        : 'İlk kedi kaydınız oluşturuldu!';

    Alert.alert(
      'Harika! 🐱💖',
      `"${name}" başarıyla kaydedildi!\n\n${interactionCountText}`,
      [
        {
          text: 'Harika ➔',
          onPress: () => {
            setName('');
            setBreed('');
            setRegionName('');
            setPhotoUri(null);
            setCoordinates(null);
            setSelectedInteractions(['feeding', 'petting']);
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const isAllSelected = selectedInteractions.length === INTERACTION_OPTIONS.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Başlık Alanı */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yeni Kedi Ekle 🐾</Text>
        <Text style={styles.headerSubtitle}>
          Sokakta karşılaştığın minik dostu kaydet, besle ve bağ kurmaya başla!
        </Text>
      </View>

      {/* FOTOĞRAF ALANI */}
      <View style={styles.photoContainer}>
        {photoUri ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => setPhotoUri(null)}
            >
              <Ionicons name="close-circle" size={26} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoEmptyBox}>
            <Ionicons name="paw" size={44} color={Colors.primary} />
            <Text style={styles.photoPromptTitle}>Fotoğraf Seç veya Çek</Text>
            <Text style={styles.photoPromptSub}>Tatlı bir portre eklemek harika olur!</Text>

            <View style={styles.photoButtonsRow}>
              <TouchableOpacity style={styles.photoOptionBtn} onPress={pickFromGallery}>
                <Ionicons name="images-outline" size={18} color={Colors.primary} />
                <Text style={styles.photoOptionText}>Galeri</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.photoOptionBtn} onPress={takePhotoWithCamera}>
                <Ionicons name="camera-outline" size={18} color={Colors.primary} />
                <Text style={styles.photoOptionText}>Kamera</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* FORM KARTI */}
      <View style={styles.formCard}>
        {/* Kedi Adı */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kedinin İsmi / Lakabı *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="heart-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Örn: Pamuk, Şımarık, Karamel..."
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Kedi Cinsi */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cinsi / Renk Deseni</Text>
          <View style={styles.inputBox}>
            <Ionicons name="color-palette-outline" size={20} color={Colors.blue} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Örn: Tekir, Sarman, Calico, Beyaz..."
              placeholderTextColor={Colors.textMuted}
              value={breed}
              onChangeText={setBreed}
            />
          </View>
        </View>

        {/* Konum / Bölge */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Konum / Bölge Adı</Text>
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Örn: Kadıköy Moda Sahili, Kampüs..."
              placeholderTextColor={Colors.textMuted}
              value={regionName}
              onChangeText={setRegionName}
            />
          </View>

          {/* GPS Konumu Otomatik Alma Butonu */}
          <TouchableOpacity
            style={[styles.locationBtn, coordinates && styles.locationBtnActive]}
            onPress={handleGetLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <>
                <Ionicons
                  name={coordinates ? 'checkmark-circle' : 'navigate-circle-outline'}
                  size={18}
                  color={coordinates ? Colors.green : Colors.primary}
                />
                <Text style={[styles.locationBtnText, coordinates && styles.locationBtnTextActive]}>
                  {coordinates
                    ? `GPS Konumu Alındı (${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)}) ✓`
                    : '📍 Mevcut Konumumu Otomatik Al'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ÇEŞİTLENDİRİLMİŞ İLK ETKİLEŞİM SEÇENEKLERİ ALANI */}
        <View style={styles.interactionSection}>
          <View style={styles.interactionHeaderRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.interactionTitleBox}>
                <Ionicons name="sparkles" size={18} color={Colors.primary} />
                <Text style={styles.interactionMainTitle}>İlk Tanışma & Etkileşimler</Text>
              </View>
              <Text style={styles.interactionMainSubtitle}>
                Bu sevimli dostla ilk karşılaştığında hangilerini yaptın?
              </Text>
            </View>

            {/* Hepsini Seç / Temizle Butonu */}
            <TouchableOpacity style={styles.toggleAllBtn} onPress={selectAllInteractions}>
              <Text style={styles.toggleAllBtnText}>
                {isAllSelected ? 'Temizle' : 'Tümünü Seç'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seçim Sayacı Rozeti */}
          <View style={styles.selectionCountBar}>
            <Ionicons name="heart" size={14} color={Colors.primaryDark} />
            <Text style={styles.selectionCountText}>
              {selectedInteractions.length > 0
                ? `${selectedInteractions.length} Etkileşim Seçildi (+${selectedInteractions.length} Bağ Puanı)`
                : 'Henüz bir etkileşim seçilmedi'}
            </Text>
          </View>

          {/* Etkileşim Seçenek Kartları */}
          <View style={styles.optionsList}>
            {INTERACTION_OPTIONS.map((option) => {
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

                  <View style={styles.optionTextBox}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && { color: Colors.text, fontWeight: '800' },
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text style={styles.optionDesc}>{option.desc}</Text>
                  </View>

                  {/* Seçim Göstergesi (Checkbox / Checkmark) */}
                  <View
                    style={[
                      styles.checkCircle,
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
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.88}>
          <Text style={styles.submitButtonText}>Patili Dostu Kaydet 🐾</Text>
        </TouchableOpacity>
      </View>
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
