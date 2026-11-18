# Sokak Hayvanları Sağlık ve Bakım Takip Sistemi (Street Animal Tracker) 🐾

**Sokak Hayvanları Sağlık ve Bakım Takip Sistemi**, kentsel alanlarda ve üniversite kampüslerinde yaşayan sokak kedileri ve sokak köpeklerinin beslenme, sağlık, aşı ve konum geçmişlerini kayıt altına almak amacıyla **React Native** ve **Expo** teknolojileriyle geliştirilmiş çapraz platform (iOS, Android ve Web) bir mobil uygulamadır.

Uygulama; harici bir sunucu bağımlılığı gerektirmeksizin, cihaz üzerinde çalışan **Zustand Persist** ve **AsyncStorage** tabanlı tam teşekküllü **yerel JSON veritabanı (Local JSON Database)** mimarisine ve **EAS Update** bulut yayın altyapısına sahiptir.

---

## 📑 İçindekiler
1. [Proje Mimarisi ve Veri Yönetimi](#-proje-mimarisi-ve-veri-yönetimi)
2. [Pati Karnesi & İlgi Özeti (Dinamik Analitik Modülü)](#-pati-karnesi--ilgi-özeti-dinamik-analitik-modülü)
3. [Otomatik Başlangıç Verileri (Seed Data)](#-otomatik-başlangıç-verileri-seed-data)
4. [Temel Fonksiyonlar ve Ekranlar](#-temel-fonksiyonlar-ve-ekranlar)
5. [Teknoloji Yığını (Tech Stack)](#-teknoloji-yığını-tech-stack)
6. [Kurulum ve Çalıştırma Rehberi](#-kurulum-ve-çalıştırma-rehberi)
7. [EAS Update ile Bulut Yayını (Cloud Deployment)](#-eas-update-ile-bulut-yayını-cloud-deployment)
8. [Birim Testleri (Unit Tests)](#-birim-testleri-unit-tests)
9. [Proje Dizin Yapısı](#-proje-dizin-yapısı)

---

## 🗄️ Proje Mimarisi ve Veri Yönetimi

Uygulamanın veri katmanı (`src/store/catStore.js`), modern mobil uygulama standartlarına uygun olarak tasarlanmıştır:

- **Otomatik JSON Kalıcılığı (Persistence Engine):** `zustand/middleware` modülünün resmi `persist` ve `createJSONStorage(() => AsyncStorage)` arayüzleri üzerinden durum değişiklikleri eşzamanlı olarak yerel depolama alanına serileştirilir.
- **Akıllı Başlangıç Senkronizasyonu (Seed Hydration):** Uygulama ilk kez kurulduğunda (`AsyncStorage` boş olduğunda) otomatik olarak 5 kedi ve 5 köpekten oluşan gerçekçi verileri yükler. Kullanıcı yeni veri eklediğinde, güncellediğinde veya sildiğinde mevcut durum korunur.
- **Tam CRUD Desteği (Create, Read, Update, Delete):**
  - **Kayıt Oluşturma:** Kedi ve köpek profilleri, isim, ırk/cins, fotoğraf albümü, anlık GPS koordinatları ve ilk karşılaşma etkileşimleriyle oluşturulur.
  - **Kayıt Güncelleme:** Profil bilgileri, sağlık/bakım notları, geçmiş aşı kayıtları, planlanan aşılar ve konum değişiklikleri güncellenir.
  - **Kayıt Silme:** Kayıtlı hayvan profilleri veya aşı kartları kullanıcı teyidi eşliğinde güvenli bir şekilde silinir.
- **Görsel Saklama Bütünlüğü:** Seçilen ya da kamera ile çekilen görseller, Base64 URI veri formatında doğrudan veritabanı kayıt nesnesiyle ilişkilendirilir.

---

## 📊 Pati Karnesi & İlgi Özeti (Dinamik Analitik Modülü)

Ana ekranda (`HomeScreen.js`) yer alan analitik kartı (`CareSummaryCard.js` & `careAnalytics.js`), düz bir sayı paneli olmanın ötesinde üç farklı sekmede derinlemesine içgörü sunar:

1. **Genel Bakış (Overview):**
   - Toplam bakım & ilgi sayısı (mama, su, sevgi, oyun, yürüyüş vb.),
   - Tamamlanan ve randevulanan aşı sayıları,
   - En yüksek bağ seviyesine ulaşılan dostumuzun profili ve etkileşim rozeti.
2. **Mahalle / Konum Bazlı Dağılım (Location Breakdown):**
   - Hangi semt/park bölgesinde kaç hayvanın barındığı (kedi ve köpek dağılımı),
   - O bölgede gerçekleştirilen toplam besleme/bakım sayısı ve uygulanan aşıların dökümü.
3. **Tür ve Cins Bazlı Bakım (Breeds & Care Breakdown):**
   - Tekir, Sarman, Calico, Yavru ve melez ırklara göre bakım hareketlerinin dağılımı.

---

## 🐾 Otomatik Başlangıç Verileri (Seed Data)

Yeni kurulan bir cihazda veya sunum esnasında ekranların dolu ve işlevsel görünmesi adına İstanbul'un simge noktalarından gerçekçi veriler hazırlanmıştır (`src/data/seedData.js`):
- **Kediler:** Kadife (Moda Parkı / Calico), Tarçın (Beşiktaş Çarşı / Sarman), Pusat (Kuzguncuk Bostanı / Tekir), Fıstık (Cihangir Sanatkarlar Parkı / Yavru Melez), Zeytin (Karaköy Rıhtım / Bombay Siyah).
- **Köpekler:** Karabaş (Yoğurtçu Parkı / Kangal Melezi), Boncuk (Abbasağa Parkı / Golden Melezi), Duman (Bankalar Caddesi / Sokak Köpeği), Pamuk (Salacak Sahili / Terrier Karışımı), Çakıl (Emirgan Korusu / Yavru Çoban Melezi).

---

## 📱 Temel Fonksiyonlar ve Ekranlar

- **HomeScreen:** İstatistikler, dinamik Pati Karnesi & İlgi Özeti, hızlı kedi/köpek ekleme aksiyonları.
- **CatListScreen & DogListScreen:** Canlı arama, türe/konuma/bağ seviyesine göre gruplama, hızlı silme.
- **CatDetailScreen & DogDetailScreen:** 5 seviyeli oyunlaştırılmış bağ göstergesi, tam ekran fotoğraf lightbox, aşı geçmişi ve gelecek planlama, eski konum geçmişi günlüğü.
- **CatMapScreen:** Cihaz GPS'i ile harita üzerinde hayvan konumlarını filtreleme ve pinleme.
- **AddCatScreen & AddDogScreen:** Galeri/kamera entegrasyonu, anlık GPS koordinat alma, çoklu ilk etkileşim seçimi.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Kategori | Teknoloji / Kütüphane | Sürüm |
| :--- | :--- | :--- |
| **Mobil Çatı (Framework)** | React Native | 0.86.3 |
| **Geliştirme Platformu** | Expo SDK | ~57.0.0 |
| **Çekirdek Kütüphane** | React | 19.2.3 |
| **Durum Yönetimi (State Management)** | Zustand | ^5.0.3 |
| **Yerel Veri Saklama** | @react-native-async-storage/async-storage | 2.2.0 |
| **Navigasyon ve Yönlendirme** | React Navigation (Bottom Tabs & Native Stack) | ^7.0.0 |
| **Harita ve Konum** | React Native Maps & Expo Location | 1.20.1 / ~57.0.0 |
| **Medya Erişimi** | Expo ImagePicker | ~57.0.0 |
| **Bulut Güncelleme & Dağıtım** | EAS Update & eas-cli | ^14.0.0 / ~57.0.28 |
| **Birim Testleri (Unit Tests)** | Node.js Test Runner (`node:test`) | Node v18+ |

---

## 🚀 Kurulum ve Çalıştırma Rehberi

Proje tamamen yerel Node.js ve Expo ortamında çalıştırılır:

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Yerel Expo geliştirme sunucusunu başlatın
npx expo start

# 3. İsteğe bağlı olarak Web üzerinde çalıştırmak için:
npx expo start --web
```

---

## ☁️ EAS Update ile Bulut Yayını (Cloud Deployment)

Uygulamanın en güncel JavaScript paketini Expo bulutuna yüklemek ve fiziki cihazlarda yerel sunucuya ihtiyaç duymadan çalıştırmak için:

```bash
# 1. Expo hesabınıza giriş yapın
npx eas-cli login

# 2. Production kanalına bulut güncellemesi yayınlayın
EAS_NO_VCS=1 npx eas-cli update --branch production --message "Pati Karnesi ve Dummy Veriler"
```

---

## 🧪 Birim Testleri (Unit Tests)

Uygulamanın analitik motorunu, konum ve tür dağılım hesaplamalarını ve bağ seviyesi algoritmasını doğrulayan otomatik testler:

```bash
npm test
```

---

## 📁 Proje Dizin Yapısı

```text
MobileAppDevelopmentProject/
├── package.json                    # Bağımlılıklar ve npm betikleri
├── app.json                        # Expo ve EAS proje ayarları
├── eas.json                        # EAS derleme ve güncelleme yapılandırması
├── index.js                        # Uygulama giriş noktası
├── App.js                          # Ana navigasyon ve tema sağlayıcıları
├── src/
│   ├── components/
│   │   ├── CareSummaryCard.js      # Pati Karnesi & İlgi Özeti bileşeni
│   │   ├── ConfirmDeleteModal.js   # Silme doğrulama modalı
│   │   ├── ImageViewerModal.js     # Tam ekran lightbox görsel görüntüleyici
│   │   ├── ToastBanner.js          # Bildirim pop-up bileşeni
│   │   ├── CatMap.native.js        # Mobil yerel harita motoru
│   │   └── CatMap.web.js           # Web ortamı harita bileşeni
│   ├── data/
│   │   └── seedData.js             # Otomatik başlangıç verileri (Seed Data)
│   ├── i18n/
│   │   └── translations.js         # Türkçe ve İngilizce dil sözlüğü
│   ├── screens/
│   │   ├── HomeScreen.js           # Ana gösterge ekranı
│   │   ├── CatListScreen.js        # Kedi listeleme ve filtreleme
│   │   ├── CatDetailScreen.js      # Kedi detay, aşı ve etkileşim ekranı
│   │   ├── AddCatScreen.js         # Kedi kayıt formu
│   │   ├── DogListScreen.js        # Köpek listeleme ve filtreleme
│   │   ├── DogDetailScreen.js      # Köpek detay, aşı ve etkileşim ekranı
│   │   ├── AddDogScreen.js         # Köpek kayıt formu
│   │   └── CatMapScreen.js         # Coğrafi harita ekranı
│   ├── store/
│   │   └── catStore.js             # Yerel veritabanı (Zustand persist + AsyncStorage)
│   ├── theme/
│   │   ├── colors.js               # Açık ve Koyu tema renk paletleri
│   │   └── useAppTheme.js          # Tema ve dil yönetim kancası (Hook)
│   └── utils/
│       ├── careAnalytics.js        # İstatistiksel analiz ve dağılım algoritması
│       └── imageHelper.js          # Görsel URI çözümleyici yardımcı modül
└── tests/
    └── careAnalytics.test.js       # Otomatik doğrulama birim testleri
```

---

## 📄 Lisans
Bu proje eğitim ve topluluk faydası amacıyla geliştirilmiş açık kaynaklı bir mobil sistemdir. 🐾
