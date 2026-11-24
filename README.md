# Street Animal Tracker (Sokak Dostları Takip & Bakım Platformu) 🐾

![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue?style=flat-square)
![Framework](https://img.shields.io/badge/Framework-React%20Native%200.88-61DAFB?style=flat-square&logo=react)
![SDK](https://img.shields.io/badge/Expo%20SDK-58-000020?style=flat-square&logo=expo)
![State](https://img.shields.io/badge/State-Zustand%205-764ABC?style=flat-square)
![Storage](https://img.shields.io/badge/Storage-AsyncStorage-orange?style=flat-square)
![Cloud](https://img.shields.io/badge/Deployment-EAS%20Update%20OTA-4630EB?style=flat-square)

---

## 1. Yönetici Özeti (Executive Summary)

**Street Animal Tracker**, kentsel yaşam alanlarında ve üniversite yerleşkelerinde barınan sokak kedileri ve köpeklerinin beslenme, rutin sağlık kontrolleri, aşı takvimleri ve coğrafi hareketliliklerini kayıt altına almak üzere tasarlanmış modern, çevrimdışı öncelikli (offline-first) bir mobil platformdur. 

Platform; harici bir sunucu altyapısına ihtiyaç duymadan, cihaz üzerinde **Zustand Persist** ve **AsyncStorage** motorları aracılığıyla çalışan yerel JSON veritabanı mimarisini benimser. Çapraz platform desteği (iOS, Android, Web), iki dilli dinamik yerelleştirme (Türkçe / İngilizce), açık/koyu tema ve **EAS Update** kablosuz güncelleme (OTA) entegrasyonuyla uçtan uca eksiksiz bir mobil mühendislik çözümü sunar.

---

## 2. Problem Tanımı ve Çözüm Yaklaşımı (Academic & Domain Context)

### Problem
Büyük metropollerde ve geniş üniversite kampüslerinde sokak hayvanlarına yönelik bakım faaliyetleri çoğunlukla bireysel gönüllüler veya dağınık topluluklar tarafından yürütülmektedir. Bu durum:
- Mükerrer beslemelere veya günlerce süren açlık periyotlarına,
- Hayvanların hangi aşılarının tamamlandığı ve rapel tarihlerinin ne zaman olduğuna dair bilgi kopukluğuna,
- Belirli bir bölgede yaşayan canların sağlık ve konum geçmişinin kayıt altına alınamamasına yol açmaktadır.

### Çözüm Yaklaşımı
Street Animal Tracker, **yerel topluluk hafızası** oluşturarak bu aksaklıkları çözüme kavuşturur:
- **Merkezi Olmayan Yerel Kayıt:** Kullanıcılar sokakta karşılaştıkları canların fotoğraflarını, ırk/tür bilgilerini ve GPS koordinatlarını sisteme işler.
- **Dinamik Sağlık Takvimi:** Tamamlanan ve yaklaşan aşılar karne mantığıyla takip edilir.
- **Oyunlaştırılmış Bağ Seviyesi:** Canlarla yapılan her etkileşim (mama, yürüyüş, sevgi, oyun) 5 aşamalı sadakat/bağ algoritmasına katkı sağlar.

---

## 3. Temel Özellikler ve Kullanıcı Senaryoları (Features & User Flows)

| Modül | Kullanıcı Senaryosu & Fonksiyonel Kapsam |
| :--- | :--- |
| **Kayıt ve Profil Yönetimi** | Kedi ve köpeklerin isim, ırk, karakter özellikleri, çoklu fotoğrafları ve anlık GPS konumlarıyla sisteme kaydedilmesi; eksik kayıtların hızlı taslak olarak bırakılıp sonradan tamamlanabilmesi. |
| **Harita & Coğrafi Dağılım** | Apple Maps (iOS) ve Google Maps (Android) doğal harita motorları üzerinde canlı pinler; kedi, köpek ve kliniklerin aynı ekranda renk ve ikon ayrımıyla filtrelenmesi. |
| **Pati Karnesi & Analitik** | Mahalle ve ırk bazlı besleme/bakım istatistikleri, aşı tamamlanma oranları ve en çok ilgi gösterilen canlıların özet paneli (`AnalyticsScreen.js`). |
| **Temsili Bölge Hekimleri** | Canların bulunduğu konumlara yakın sorumlu veteriner klinikleri (simülasyon korumalı arama hatları ve hekim detayları). |
| **Dinamik Dil Desteği** | Kullanıcı girdilerini ve ırk/aşı terminolojisini (*Tekir ➔ Tabby*, *Kuduz ➔ Rabies Vaccine*) anında hedef dile dönüştüren reaktif çeviri motoru (`dynamicTranslator.js`). |

### Otomatik Başlangıç Verileri (Seed Data)
Uygulama ilk kez kurulduğunda (`AsyncStorage` boşken) İstanbul'un gerçek sokak sakinlerinden oluşan 6 profil ve fotoğrafları otomatik yüklenir:
1. **Habeş (Kedi - Calico):** Forum İstanbul yerleşkesi sakinlerinden, miyavlamasıyla bilinen kardeş kedi.
2. **Tipsiz (Kedi - Calico):** Forum İstanbul bölgesinde barınan, Habeş ile kardeş dostumuz.
3. **Avcı (Kedi - Tekir):** Kocatepe Metro İstasyonu çevresinde yaşayan tecrübeli fare avcısı.
4. **Püskül (Kedi - Calico):** İstanbul Üniversitesi Beyazıt Kampüsü çevresinde barınan sevimli kedi.
5. **Prenses (Kedi - Gri Tekir):** İstanbul Üniversitesi İletişim/Edebiyat fakültesi çevresinde ilgi bağımlısı dostumuz.
6. **Pancarlar (Köpek - Sokak Köpeği):** Forum İstanbul açık alanında yıllardır birlikte dolaşan kardeş köpekler.

---

## 4. Sistem Mimarisi ve Teknoloji Yığını (Architecture & Tech Stack)

| Kategori | Teknoloji | Versiyon | Tercih Nedeni ve Mimari Rolü |
| :--- | :--- | :--- | :--- |
| **Çekirdek Çatı** | React Native | 0.88.1 | Yerel köprü ve yüksek performanslı native arayüz bileşenleri. |
| **Platform / SDK** | Expo SDK | ^58.0.0 | Cihaz donanımına (kamera, konum) standartlaştırılmış erişim. |
| **Durum Yönetimi** | Zustand | ^5.0.3 | Redux'a kıyasla daha hafif, tek yönlü veri akışlı merkezi state motoru. |
| **Veri Kalıcılığı** | AsyncStorage | 2.2.0 | Cihaz diskine serileştirilmiş asenkron JSON depolama. |
| **Navigasyon** | React Navigation | ^7.0.0 | Bottom Tabs ve Native Stack ile akıcı ekran geçişleri. |
| **Harita** | React Native Maps | 1.29.11 | iOS üzerinde MapKit, Android üzerinde Google Maps desteği. |
| **Konum** | Expo Location | ~58.0.22 | Cihaz GPS donanımından anlık enlem/boylam koordinat tespiti. |
| **Medya** | Expo ImagePicker | ~58.0.10 | Cihaz galerisi ve kamerasından çoklu görsel seçimi. |
| **Bulut Dağıtımı** | EAS Update | ^14.0.0 | Mağaza onayı beklemeksizin anlık Over-The-Air (OTA) kod güncellemesi. |
| **Test Koşucusu** | Node.js Test Runner | Node v18+ | Analitik hesaplama motorunu denetleyen birim testleri. |

---

## 5. Proje Klasör Yapısı (Directory Structure)

```text
MobileAppDevelopmentProject/
├── app.json                              # Expo ve EAS proje tanımlayıcıları
├── eas.json                              # Bulut derleme ve OTA kanal ayarları
├── package.json                          # Bağımlılıklar ve çalıştırma betikleri
├── index.js                              # Uygulama ana giriş noktası
├── App.js                                # Navigasyon, tema sağlayıcıları ve künye modalı
├── README.md                             # Kapsamlı teknik ve akademik dokümantasyon
├── assets/
│   └── animals/                          # Yerel yüksek çözünürlüklü canlı fotoğrafları
│       ├── habes1.jpg, habes2.jpg
│       ├── tipsiz1.jpg, tipsiz2.jpg
│       ├── avci1.jpg, avci2.jpg
│       ├── puskul1.jpg, puskul2.jpg
│       ├── prenses1.jpg
│       └── pancarlar1.jpg
├── src/
│   ├── components/
│   │   ├── AddAnimalActionMenu.js        # Açılır yeni kayıt aksiyon menüsü
│   │   ├── ViewRecordsActionMenu.js      # Açılır kayıtlı canlar ve klinikler menüsü
│   │   ├── CareSummaryCard.js            # Ana ekran analitik özet kartı
│   │   ├── CatMap.native.js              # Native iOS/Android harita bileşeni
│   │   ├── CatMap.web.js                 # Web ortamı harita kartları
│   │   ├── ImageViewerModal.js           # Tam ekran lightbox görsel görüntüleyici
│   │   ├── ProjectDisclaimerModal.js     # Akademik künye ve simülasyon modalı
│   │   └── ToastBanner.js                # Bilgilendirme bildirim şeridi
│   ├── data/
│   │   └── seedData.js                   # Başlangıç veri kümesi (Canlar ve Hekimler)
│   ├── i18n/
│   │   └── translations.js               # TR / EN statik sözlük tablosu
│   ├── screens/
│   │   ├── HomeScreen.js                 # Ana gösterge ekranı
│   │   ├── AnalyticsScreen.js            # Pati Karnesi & İlgi Özeti analitik sayfası
│   │   ├── CatListScreen.js              # Kedi listesi, arama ve gruplama
│   │   ├── CatDetailScreen.js            # Kedi detay, aşı ve etkileşim geçmişi
│   │   ├── AddCatScreen.js               # Kedi ekleme formu
│   │   ├── DogListScreen.js              # Köpek listesi, arama ve gruplama
│   │   ├── DogDetailScreen.js            # Köpek detay, aşı ve etkileşim geçmişi
│   │   ├── AddDogScreen.js               # Köpek ekleme formu
│   │   ├── CatMapScreen.js               # Canlı harita ekranı
│   │   ├── VetListScreen.js              # Bölge veterinerleri listesi
│   │   └── VetDetailScreen.js            # Veteriner hekim profil ve nöbet detayları
│   ├── store/
│   │   └── catStore.js                   # Zustand persist ve AsyncStorage veri katmanı
│   ├── theme/
│   │   ├── colors.js                     # Renk paletleri (Açık ve Koyu tema)
│   │   └── useAppTheme.js                # Tema ve dil durumunu yöneten hook
│   └── utils/
│       ├── careAnalytics.js              # İstatistik ve bağ hesaplama algoritması
│       ├── dynamicTranslator.js          # Veritabanı verilerini dinamik çeviren motor
│       └── imageHelper.js                # Görsel kaynağı çözümleyici
└── tests/
    └── careAnalytics.test.js             # Otomatik birim testleri
```

---

## 6. Veri Modeli ve Yerel Depolama Stratejisi (Data Schema & Seed Logic)

Veri modeli, cihazın çevrimdışı çalışabilmesi amacıyla ilişkisel olmayan esnek bir JSON yapısında tutulur. 

### Örnek Hayvan Veri Şeması (JSON)
```json
{
  "id": "seed-cat-habes",
  "name": "Habeş",
  "species": "cat",
  "breed": "Calico",
  "photoUri": "require('../../assets/animals/habes1.jpg')",
  "photos": [
    "require('../../assets/animals/habes1.jpg')",
    "require('../../assets/animals/habes2.jpg')"
  ],
  "location": {
    "regionName": "Forum İstanbul",
    "latitude": 41.046031,
    "longitude": 28.894292
  },
  "locationHistory": [
    {
      "id": "loc-1",
      "regionName": "Forum İstanbul Açık Meydan",
      "latitude": 41.046100,
      "longitude": 28.894350,
      "changedAt": "2026-10-10T11:00:00.000Z"
    }
  ],
  "vaccinations": [
    {
      "id": "vac-1",
      "name": "Kuduz Aşısı",
      "date": "2026-09-15",
      "clinic": "Bayrampaşa Veteriner Kliniği",
      "notes": "Rutin kuduz aşısı uygulandı."
    }
  ],
  "scheduledVaccines": [
    {
      "id": "sch-1",
      "name": "Karma Aşı Rapeli",
      "plannedDate": "2026-12-15",
      "notes": "Yıllık tekrar dozu."
    }
  ],
  "notes": "İsmine duyarlı, sakin mizaçlı ve oyuncu bir kedi.",
  "interactionHistory": [
    {
      "id": "int-1",
      "date": "2026-11-18T09:30:00.000Z",
      "type": "feeding",
      "note": "Yaş mama verildi 🥣"
    }
  ],
  "createdAt": "2026-10-01T08:00:00.000Z"
}
```

### AsyncStorage & Sürüm Denetimi (Seed Versioning)
```javascript
// src/store/catStore.js içindeki sürüm kontrol mekanizması
export const SEED_VERSION = 'v4';

// Uygulama açılışında AsyncStorage kontrol edilir:
// Kayıtlı versiyon güncel değilse yeni başlangıç verileri (Seed Data) yüklenir.
```

---

## 7. Hızlı Başlangıç ve Canlı Test (Expo Go & EAS Update)

Değerlendirme esnasında projeyi bilgisayara herhangi bir SDK kurmadan doğrudan fiziksel bir mobil cihazda test etmek için:

### 1. Adım: Expo Go İndirme
- **iOS:** App Store üzerinden **Expo Go** uygulamasını yükleyin.
- **Android:** Google Play Store üzerinden **Expo Go** uygulamasını yükleyin.

### 2. Adım: Projeyi Cihazda Açma
1. Tarayıcınızda resmi EAS bulut paneline gidin:  
   👉 **[https://expo.dev/accounts/hakanural06/projects/street-animal-tracker](https://expo.dev/accounts/hakanural06/projects/street-animal-tracker)**
2. Panelde **production** dalı altında yayınlanan en güncel güncellemenin QR kodunu görüntüleyin.
3. **iPhone Kullanıcıları:** Standart iOS Kamera uygulamasını açıp QR kodu kadraja alın, ekranda beliren sarı *"Expo Go ile Aç"* seçeneğine dokunun.
4. **Android Kullanıcıları:** Expo Go uygulamasını açıp *"Scan QR code"* butonuyla kodu tarayın.

### EAS Update Proje Metaverileri
- **EAS Project ID:** `e35c83c7-2cc0-4642-b51f-9d44514b59be`
- **Kanal / Dal:** `production`
- **Güncelleme Dağıtım Türü:** Kablosuz Over-The-Air (OTA)

---

## 8. Yerel Geliştirme Ortamı Kurulumu (Local Installation)

Projeyi kendi yerel bilgisayarınızda derlemek ve geliştirmek isterseniz aşağıdaki adımları takip edebilirsiniz:

```bash
# 1. Proje deposunu yerel diskinize klonlayın
git clone https://github.com/HakanURAL06/MobileAppDevelopmentProject.git

# 2. Proje dizinine geçiş yapın
cd MobileAppDevelopmentProject

# 3. Bağımlılıkları yükleyin
npm install --legacy-peer-deps

# 4. Expo geliştirme sunucusunu başlatın
npx expo start
```

### Seçenekler:
- Terminalde `a` tuşuna basarak bağlı **Android Emulator**'de çalıştırın.
- Terminalde `i` tuşuna basarak bağlı **iOS Simulator**'de çalıştırın.
- Terminalde `w` tuşuna basarak **Web Tarayıcısı** üzerinde çalıştırın.

---

## 9. Ekran Görüntüleri ve Arayüz Akışı (UI Showcase)

| Ekran | Açıklama & Görsel Temsil |
| :--- | :--- |
| **Ana Gösterge Ekranı** | Can sayaçları, hızlı aksiyon menüsü ve yönlendirme kartları. *(Ekran görseli: HomeScreen)* |
| **Kedi & Köpek Listeleri** | İsim, ırk, konum filtreleme çipleri ve bağ seviyesi rozetleri. *(Ekran görseli: CatList / DogList)* |
| **Canlı Harita Görünümü** | Harita pinleri, kedi/köpek ikonları ve sorumlu veteriner klinikleri. *(Ekran görseli: CatMap)* |
| **Can Detay & Aşı Karnesi** | 5 aşamalı bağ ilerleme çubuğu, geçmiş etkileşim günlüğü ve aşı takvimi. *(Ekran görseli: CatDetail)* |
| **Pati Karnesi & Analitik** | Mahalle ve ırk bazlı bakım analitiği ile derinlemesine grafiksel döküm. *(Ekran görseli: AnalyticsScreen)* |
| **Bölge Veteriner Hekimleri** | Temsili veterinerlerin çalışma saatleri, konumları ve nöbetçi simülasyon hatları. *(Ekran görseli: VetDetail)* |

---

## 10. Geliştirici Bilgileri, Akademik Bağlam ve Lisans

### Akademik Künye
Bu mobil yazılım projesi, **İstanbul Üniversitesi Yönetim Bilişim Sistemleri (MIS)** lisans programı kapsamında **Mobil Uygulama Geliştirme (Mobile Application Development)** dersi dönem projesi olarak geliştirilmiştir.

- **Geliştirici:** Hakan Ural
- **Öğrenci Numarası:** 0515240030


