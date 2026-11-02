/**
 * Renk Paleti ve Tema Tanımları (Light & Dark Theme)
 */

export const LightColors = {
  // Pastel Ana Renkler (Gündüz / Sıcak Şeftali & Mercan)
  primary: '#FF9A76',        // Pastel Şeftali / Turuncu
  primaryDark: '#F08055',    // Vurgulu Şeftali
  primaryLight: '#FFF2EC',   // Çok Açık Şeftali Krem
  
  secondary: '#FF8DA1',      // Soft Pembe
  secondaryLight: '#FFF0F3', // Çok Açık Pembe

  blue: '#6CB4EE',           // Açık Bebek Mavi
  blueLight: '#EDF6FD',      // Çok Açık Mavi

  green: '#7ED99C',          // Pastel Nane Yeşili
  greenLight: '#EEFBF3',     // Çok Açık Nane

  yellow: '#FCD34D',         // Pastel Bal Sarısı
  yellowLight: '#FEF9E7',    // Çok Açık Krem Sarı

  // Arka Plan ve Kartlar
  background: '#FFFDF9',     // Sıcak Fildişi / Krem Arka Plan
  card: '#FFFFFF',           // Beyaz Kart
  cardBorder: '#FFEFE6',     // Çok Yumuşak Kenarlık
  cardShadow: '#FF9A76',     // Pastel Şeftali Gölge
  cardMuted: '#FAF5F0',      // Yumuşak Nötr Kutu

  // Giriş Alanları (Inputs)
  inputBg: '#FFFFFF',
  inputBorder: '#FFEFE6',

  // Metin Renkleri
  text: '#2D3142',           // Okunaklı Koyu Grafit
  textSecondary: '#6B7280',  // Yumuşak Gri
  textMuted: '#9CA3AF',      // Açık Gri / İpucu

  // Seviye Renkleri
  level1: '#6CB4EE',         // Tanışıklık (Bebek Mavi)
  level1Bg: '#EDF6FD',
  level2: '#FF9A76',         // Dost (Pastel Turuncu)
  level2Bg: '#FFF2EC',
  level3: '#FF7597',         // Aile (Soft Pembe)
  level3Bg: '#FFF0F5',
};

export const DarkColors = {
  // Canlı Vurgulu Ana Renkler (Koyu Mod)
  primary: '#FF9A76',        // Sıcak Şeftali Vurgusu
  primaryDark: '#FFAA8A',    // Parlak Şeftali
  primaryLight: '#2C1D18',   // Koyu Şeftali Zemin

  secondary: '#FF8DA1',      // Pembe Vurgu
  secondaryLight: '#2D1820', // Koyu Pembe Zemin

  blue: '#6CB4EE',           // Bebek Mavi Vurgu
  blueLight: '#142536',      // Koyu Mavi Zemin

  green: '#4ADE80',          // Nane Yeşili Vurgu
  greenLight: '#13281E',     // Koyu Nane Zemin

  yellow: '#FBBF24',         // Bal Sarısı Vurgu
  yellowLight: '#2C2310',    // Koyu Sarı Zemin

  // Arka Plan ve Kartlar
  background: '#0F1117',     // Derin Koyu Grafit Arka Plan
  card: '#1A1D27',           // Yükseltilmiş Koyu Kart
  cardBorder: '#272C3D',     // Koyu Mod Kenarlık
  cardShadow: '#000000',     // Koyu Gölge
  cardMuted: '#141722',      // Nötr Koyu Kutu

  // Giriş Alanları (Inputs)
  inputBg: '#13151F',
  inputBorder: '#272C3D',

  // Metin Renkleri
  text: '#F9FAFB',           // Parlak Beyaz Metin
  textSecondary: '#9CA3AF',  // Açık Gri
  textMuted: '#6B7280',      // Koyu Gri / İpucu

  // Seviye Renkleri
  level1: '#6CB4EE',
  level1Bg: '#142536',
  level2: '#FF9A76',
  level2Bg: '#2C1D18',
  level3: '#FF8DA1',
  level3Bg: '#2D1820',
};

/**
 * Aktif temaya göre renk nesnesini döndürür.
 * @param {'light'|'dark'} theme 
 * @returns {typeof LightColors}
 */
export const getThemeColors = (theme = 'light') => {
  return theme === 'dark' ? DarkColors : LightColors;
};

// Geriye dönük tam uyumluluk: Mevcut dosyalardaki `import { Colors } from '../theme/colors'`
// çağrılarının LightColors olarak problemsiz çalışmasını sağlar.
export const Colors = LightColors;

export default Colors;
