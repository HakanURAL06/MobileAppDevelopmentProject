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

export default function AddCatScreen({ navigation }) {
  const addCat = useCatStore((state) => state.addCat);

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [regionName, setRegionName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Galeriden Fotoğraf Seçme (expo-image-picker)
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri iznine ihtiyacımız var.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir sorun oluştu.');
    }
  };

  // Mevcut GPS Konumunu Alma (expo-location)
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Konum İzni', 'GPS koordinatlarını almak için konum izni gereklidir.');
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

      // Varsayılan bölge adı boşsa doldur
      if (!regionName) {
        setRegionName('Yakınımdaki Sokak');
      }

      Alert.alert('Başarılı', 'Mevcut konum koordinatları alındı!');
    } catch (error) {
      Alert.alert('Hata', 'Konum bilgisi alınamadı.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Kediyi Kaydetme
  const handleSaveCat = () => {
    if (!name.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen kedinin ismini veya lakabını giriniz.');
      return;
    }

    const finalRegion = regionName.trim() || 'Genel Bölge Kedileri';

    addCat({
      name: name.trim(),
      breed: breed.trim() || 'Tekir / Melez',
      photoUri: photoUri || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
      location: {
        regionName: finalRegion,
        latitude: coordinates?.latitude || 40.988,
        longitude: coordinates?.longitude || 29.025,
      },
      initialInteraction: true,
    });

    Alert.alert('Harika! 🐾', `${name} başarıyla sisteme eklendi ve ilk etkileşim puanı verildi!`, [
      {
        text: 'Tamam',
        onPress: () => {
          // Formu sıfırla ve ana ekrana dön
          setName('');
          setBreed('');
          setRegionName('');
          setPhotoUri(null);
          setCoordinates(null);
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Yeni Kedi Dostu Ekle 🐱</Text>
      <Text style={styles.headerSubtitle}>
        Sokakta karşılaştığın sevimli dostunu kaydet ve bağ kurmaya başla!
      </Text>

      {/* Fotoğraf Seçim Alanı */}
      <View style={styles.photoSection}>
        <TouchableOpacity style={styles.photoPicker} onPress={pickImage} activeOpacity={0.8}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.pickedPhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={36} color="#FF6B6B" />
              <Text style={styles.photoText}>Fotoğraf Ekle</Text>
              <Text style={styles.photoHint}>Galeriden seçmek için dokunun</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Alanları */}
      <View style={styles.formCard}>
        {/* İsim */}
        <Text style={styles.label}>Kedinin İsmi / Lakabı *</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Pamuk, Çorap, Sarman..."
          placeholderTextColor="#A0AEC0"
          value={name}
          onChangeText={setName}
        />

        {/* Cins */}
        <Text style={styles.label}>Cinsi / Renk Deseni</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Tekir, Sarman, Calico, Beyaz..."
          placeholderTextColor="#A0AEC0"
          value={breed}
          onChangeText={setBreed}
        />

        {/* Bölge Adı */}
        <Text style={styles.label}>Konum / Bölge Adı *</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Kadıköy Moda Parkı, Kampüs Kafeterya..."
          placeholderTextColor="#A0AEC0"
          value={regionName}
          onChangeText={setRegionName}
        />

        {/* GPS Konumu Alma Butonu */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : (
            <>
              <Ionicons
                name={coordinates ? 'checkmark-circle' : 'location'}
                size={18}
                color={coordinates ? '#10B981' : '#FF6B6B'}
              />
              <Text style={[styles.locationButtonText, coordinates && styles.locationSuccessText]}>
                {coordinates
                  ? `GPS Konumu Alındı (${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)})`
                  : 'Mevcut GPS Konumumu Al'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Kaydet Butonu */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveCat} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Patili Dostu Kaydet 🐾</Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3748',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
    marginBottom: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoPicker: {
    width: '100%',
    height: 180,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FED7D7',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B6B',
    marginTop: 6,
  },
  photoHint: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2D3748',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  locationButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  locationSuccessText: {
    color: '#10B981',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
