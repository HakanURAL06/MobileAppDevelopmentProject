/**
 * Yerel kedi fotoğrafları ve dinamik görsel yardımcı fonksiyonu
 */

export const LOCAL_CAT_IMAGES = {
  'avci1.jpg': require('../../assets/cats/avci1.jpg'),
  'avci3.jpg': require('../../assets/cats/avci3.jpg'),
  'habes1.jpg': require('../../assets/cats/habes1.jpg'),
  'habes2.jpg': require('../../assets/cats/habes2.jpg'),
  'prenses1.jpg': require('../../assets/cats/prenses1.jpg'),
  'prenses2.jpg': require('../../assets/cats/prenses2.jpg'),
  'prenses3.jpg': require('../../assets/cats/prenses3.jpg'),
  'puskul1.jpg': require('../../assets/cats/puskul1.jpg'),
  'puskul2.jpg': require('../../assets/cats/puskul2.jpg'),
  'puskul3.jpg': require('../../assets/cats/puskul3.jpg'),
};

/**
 * Hem yerel require(...) assetlerini hem de uzaktaki / galeriden gelen
 * string URI'leri güvenle React Native <Image source={...} /> için hazırlar.
 */
export const getImageSource = (photo) => {
  if (!photo) {
    return {
      uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    };
  }

  // Zaten require(...) ile çözümlenmiş asset numarası veya obje
  if (typeof photo === 'number') {
    return photo;
  }

  if (typeof photo === 'object' && photo !== null && photo.uri) {
    return photo;
  }

  if (typeof photo === 'string') {
    // 1. Doğrudan dosya adı olarak kayıtlıysa
    if (LOCAL_CAT_IMAGES[photo]) {
      return LOCAL_CAT_IMAGES[photo];
    }

    // 2. assets/cats/avci1.jpg gibi bir path verilmişse basename'e bak
    const basename = photo.split('/').pop();
    if (basename && LOCAL_CAT_IMAGES[basename]) {
      return LOCAL_CAT_IMAGES[basename];
    }

    // 3. Normal URL (http, https, file, data, blob)
    return { uri: photo };
  }

  return photo;
};

export default getImageSource;
