/**
 * Dinamik görsel yardımcı fonksiyonu
 * Yerel veritabanında (AsyncStorage / localStorage JSON) saklanan Base64 Data URI,
 * cihaz galeri/kamera dosya yolları (file://, content://) ve uzak URL'leri
 * Windows, macOS, Android, iOS ve Web platformlarıyla %100 uyumlu şekilde çözümler.
 *
 * @param {string|number|object} photo
 * @returns {any}
 */
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

  // 3. String formatı (Base64 data URI, URL veya yerel cihaz dosya yolu)
  if (typeof photo === 'string') {
    const trimmed = photo.trim();
    if (!trimmed) {
      return {
        uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
      };
    }
    return { uri: trimmed };
  }

  return photo;
};

export default getImageSource;
