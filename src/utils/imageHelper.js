/**
 * Dinamik görsel yardımcı fonksiyonu
 * Yerel paketlenmiş görseller (require(...) veya asset adları), Base64 Data URI,
 * cihaz galeri/kamera dosya yolları (file://, content://) ve uzak URL'leri
 * iOS, Android ve Web platformlarıyla %100 uyumlu şekilde çözümler.
 */

const LOCAL_ANIMAL_ASSETS = {
  'habes1': require('../../assets/animals/habes1.jpg'),
  'habes1.jpg': require('../../assets/animals/habes1.jpg'),
  'habes2': require('../../assets/animals/habes2.jpg'),
  'habes2.jpg': require('../../assets/animals/habes2.jpg'),
  'tipsiz1': require('../../assets/animals/tipsiz1.jpg'),
  'tipsiz1.jpg': require('../../assets/animals/tipsiz1.jpg'),
  'tipsiz2': require('../../assets/animals/tipsiz2.jpg'),
  'tipsiz2.jpg': require('../../assets/animals/tipsiz2.jpg'),
  'avci1': require('../../assets/animals/avci1.jpg'),
  'avci1.jpg': require('../../assets/animals/avci1.jpg'),
  'avci2': require('../../assets/animals/avci2.jpg'),
  'avci2.jpg': require('../../assets/animals/avci2.jpg'),
  'puskul1': require('../../assets/animals/puskul1.jpg'),
  'puskul1.jpg': require('../../assets/animals/puskul1.jpg'),
  'puskul2': require('../../assets/animals/puskul2.jpg'),
  'puskul2.jpg': require('../../assets/animals/puskul2.jpg'),
  'prenses1': require('../../assets/animals/prenses1.jpg'),
  'prenses1.jpg': require('../../assets/animals/prenses1.jpg'),
  'pancarlar1': require('../../assets/animals/pancarlar1.jpg'),
  'pancarlar1.jpg': require('../../assets/animals/pancarlar1.jpg'),
};

export const getImageSource = (photo) => {
  if (!photo) {
    return {
      uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    };
  }

  // 1. Zaten require(...) ile çözümlenmiş asset numarası (React Native packager ID)
  if (typeof photo === 'number') {
    return photo;
  }

  // 2. Obje formatı (React Native { uri: '...' } veya Webpack/Metro { default: '...' })
  if (typeof photo === 'object' && photo !== null) {
    if (photo.uri) {
      return photo;
    }
    if (photo.default) {
      return typeof photo.default === 'string' ? { uri: photo.default } : photo.default;
    }
    return photo;
  }

  // 3. String formatı
  if (typeof photo === 'string') {
    const trimmed = photo.trim();
    if (!trimmed) {
      return {
        uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
      };
    }

    // Yerel asset adıyla eşleşme kontrolü (örn: "habes1.jpg", "habes1", "assets/animals/habes1.jpg")
    const cleanKey = trimmed.split('/').pop().toLowerCase();
    if (LOCAL_ANIMAL_ASSETS[cleanKey]) {
      return LOCAL_ANIMAL_ASSETS[cleanKey];
    }
    const cleanKeyWithoutExt = cleanKey.replace(/\.[^/.]+$/, '');
    if (LOCAL_ANIMAL_ASSETS[cleanKeyWithoutExt]) {
      return LOCAL_ANIMAL_ASSETS[cleanKeyWithoutExt];
    }

    return { uri: trimmed };
  }

  return photo;
};

export default getImageSource;
