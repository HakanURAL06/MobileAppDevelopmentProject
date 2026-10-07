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
  Switch,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';

export default function AddCatScreen({ navigation }) {
  const addCat = useCatStore((state) => state.addCat);

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [regionName, setRegionName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [initialFeeding, setInitialFeeding] = useState(true); // İlk besleme/etkileşim varsayılan açık

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

    addCat({
      name: name.trim(),
      breed: breed.trim() || 'Tekir / Melez',
      photoUri: photoUri || defaultCatPhoto,
      location: {
        regionName: regionName.trim() || 'Genel Bölge Kedileri',
        latitude: coordinates?.latitude || 40.988,
        longitude: coordinates?.longitude || 29.025,
      },
      initialInteraction: initialFeeding,
    });

    Alert.alert(
      'Harika! 🐱',
      `${name} başarıyla kaydedildi! ${initialFeeding ? 'İlk besleme etkileşimi de eklendi.' : ''}`,
      [
        {
          text: 'Ana Sayfaya Git ➔',
          onPress: () => {
            setName('');
            setBreed('');
            setRegionName('');
            setPhotoUri(null);
            setCoordinates(null);
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

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

        {/* İLK ETKİLEŞİM / BESLEME SEÇENEĞİ */}
        <View style={styles.initialFeedingCard}>
          <View style={styles.feedingLeft}>
            <View style={styles.feedingEmojiBox}>
              <Text style={styles.feedingEmoji}>🥣</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.feedingTitle}>İlk Etkileşim / Besleme</Text>
              <Text style={styles.feedingSub}>
                Şimdi besledim veya sevdim (+1 Etkileşim & Bağ Başlangıcı)
              </Text>
            </View>
          </View>
          <Switch
            value={initialFeeding}
            onValueChange={setInitialFeeding}
            trackColor={{ false: '#E5E7EB', true: Colors.primaryLight }}
            thumbColor={initialFeeding ? Colors.primary : '#FFFFFF'}
          />
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
  initialFeedingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7F2',
    borderRadius: 18,
    padding: 14,
    marginTop: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE8DF',
  },
  feedingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  feedingEmojiBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedingEmoji: {
    fontSize: 20,
  },
  feedingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  feedingSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
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
