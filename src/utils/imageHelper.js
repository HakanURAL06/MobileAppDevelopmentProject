/**
 * Yerel kedi fotoğrafları ve dinamik görsel yardımcı fonksiyonu
 * Windows, macOS, Android, iOS ve Web platformlarıyla %100 uyumludur.
 */

export const LOCAL_CAT_IMAGES = {
  // Avcı
  'avci1.jpg': require('../../assets/cats/avci1.jpg'),
  'avci2.jpg': require('../../assets/cats/avci2.jpg'),
  'avci3.jpg': require('../../assets/cats/avci3.jpg'),
  'avcı2.jpg': require('../../assets/cats/avci2.jpg'), // Eski Türkçe karakterli referanslar için alias

  // Habeş
  'habes1.jpg': require('../../assets/cats/habes1.jpg'),
  'habes2.jpg': require('../../assets/cats/habes2.jpg'),

  // Prenses
  'prenses1.jpg': require('../../assets/cats/prenses1.jpg'),
  'prenses2.jpg': require('../../assets/cats/prenses2.jpg'),
  'prenses3.jpg': require('../../assets/cats/prenses3.jpg'),

  // Püskül
  'puskul1.jpg': require('../../assets/cats/puskul1.jpg'),
  'puskul2.jpg': require('../../assets/cats/puskul2.jpg'),
  'puskul3.jpg': require('../../assets/cats/puskul3.jpg'),

  // Diğer kedi albüm fotoğrafları
  'tipsiz1.jpg': require('../../assets/cats/tipsiz1.jpg'),
  'floryaaslani1.jpg': require('../../assets/cats/floryaaslani1.jpg'),
  'floryaaslani2.jpg': require('../../assets/cats/floryaaslani2.jpg'),
  'floryaaslani3.jpg': require('../../assets/cats/floryaaslani3.jpg'),
  'floryaaslanı1.jpg': require('../../assets/cats/floryaaslani1.jpg'),
  'floryaaslanı2.jpg': require('../../assets/cats/floryaaslani2.jpg'),
  'floryaaslanı3.jpg': require('../../assets/cats/floryaaslani3.jpg'),
};

/**
 * Hem yerel require(...) assetlerini hem de uzaktaki / galeriden gelen
 * string URI'leri güvenle React Native <Image source={...} /> için hazırlar.
 * Windows dosya yolu ters slash (\) ve Webpack/Metro { default: ... } nesnelerini de destekler.
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

  // 3. String formatı (dosya adı, URL veya dosya yolu)
  if (typeof photo === 'string') {
    const trimmed = photo.trim();

    // A. Doğrudan dosya adı olarak kayıtlıysa (örn: 'avci1.jpg')
    if (LOCAL_CAT_IMAGES[trimmed]) {
      return LOCAL_CAT_IMAGES[trimmed];
    }

    // B. Türkçe karakter normalizasyonu ile dene (ı -> i)
    const normalized = trimmed.replace(/ı/g, 'i');
    if (LOCAL_CAT_IMAGES[normalized]) {
      return LOCAL_CAT_IMAGES[normalized];
    }

    // C. Dosya yolu verilmişse hem '/' (POSIX) hem '\' (Windows) ayraçlarına göre dosya adını ayıkla
    const basename = trimmed.split(/[/\\]/).pop();
    if (basename) {
      if (LOCAL_CAT_IMAGES[basename]) {
        return LOCAL_CAT_IMAGES[basename];
      }
      const normBasename = basename.replace(/ı/g, 'i');
      if (LOCAL_CAT_IMAGES[normBasename]) {
        return LOCAL_CAT_IMAGES[normBasename];
      }
    }

    // D. Normal Web veya Cihaz URI (http, https, file, data, blob)
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('file://') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:')
    ) {
      return { uri: trimmed };
    }

    // E. Windows veya yerel dosya yoluysa
    return { uri: trimmed };
  }

  return photo;
};

export default getImageSource;
