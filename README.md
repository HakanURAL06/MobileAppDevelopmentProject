# Sokak Hayvanları Sağlık, Bakım ve Bölge Hekimliği Takip Sistemi
### *Street Animal Health, Care & Regional Veterinary Tracking System*

---

### 🎓 Akademik Proje Künyesi ve Resmi Bildiri

| Kriter | Detay Bilgi |
| :--- | :--- |
| **Ders Adı** | **Mobile Application Development (Mobil Uygulama Geliştirme)** |
| **Proje Türü** | Lisans Bitirme / Dönem Projesi (Term Project) |
| **Geliştirici / Proje Sahibi** | **Hakan Ural** |
| **Öğrenci Numarası** | **0515240030** |
| **Platform Desteği** | iOS, Android ve Web (Çapraz Platform) |
| **Geliştirme Çatısı** | React Native (v0.86.3) & Expo SDK 57 |
| **Bulut Dağıtım Kanalı** | Expo Application Services (EAS Update - Production) |
| **Expo Proje Bağlantısı** | [expo.dev/@hakanural06/street-animal-tracker](https://expo.dev/accounts/hakanural06/projects/street-animal-tracker) |

> ### 🏛️ Resmi Akademik Feragatname ve Kurgusal Bildirim
> **Bu mobil uygulama, Mobile Application Development dersi müfredatı kapsamında eğitim, araştırma ve akademik değerlendirme amacıyla hazırlanmış kurgusal bir dönem projesidir.**
> 
> Uygulama içerisinde bahsi geçen tüm **Bölge Veteriner Hekimleri, Klinik İsimleri, İletişim Telefon Numaraları ve Acil Nöbetçi Çağrı Hatları tamamen temsili bir simülasyon (mockup) niteliğindedir.** Gerçek kişi, kurum, belediye birimi veya tüzel kişiliklerle hiçbir doğrudan bağlantısı bulunmamaktadır. Uygulamadaki telefon butonları ve acil arama fonksiyonları simülasyon korumalı olup gerçek arama gerçekleştirmemekte; kullanıcıya akademik simülasyon bilgilendirmesi sunmaktadır.

---

## 📌 Projenin Amacı ve Kapsamı

Kent ekosisteminde yaşayan sokak canlılarının sağlık, aşı, beslenme ve mekânsal hareketlilik verilerinin tek bir dijital platformda toplanması; hayvanseverler, gönüllüler ve temsili sağlık ekipleri arasında koordinasyon sağlanması hedeflenmiştir. 

Sistem; sunucu bağımlılığı olmaksızın cihaz üzerinde yerel olarak çalışan reaktif bir veri mimarisi (Zustand Persist + AsyncStorage) üzerine inşa edilmiş olup, modern kullanıcı deneyimi (UX) ilkelerine uygun minimalist bir arayüz, çift dilli (Türkçe / İngilizce) dinamik çeviri desteği, karanlık/aydınlık tema uyumluluğu ve kapsamlı bir analitik modülü sunar.

---

## 🌟 Temel Fonksiyonel Modüller

### 1. Gerçek Sokak Dostları ve Yerel Medya Arşivi
Uygulama ilk kez açıldığında, İstanbul'un yoğun bölgelerindeki gerçek sokak sakinlerinden derlenen başlangıç verilerini yüksek çözünürlüklü yerel fotoğraflarıyla birlikte otomatik olarak yükler:
- **Habeş:** Forum İstanbul yerleşkesinde yaşayan, Calico ırkı, kendine has miyavlamasıyla tanınan sevimli dostumuz (`habes1.jpg`, `habes2.jpg`).
- **Tipsiz:** Forum İstanbul bölgesinde yaşayan, Habeş'in kardeşi, insanlara temkinli yaklaşan Calico ırkı kedi (`tipsiz1.jpg`, `tipsiz2.jpg`).
- **Avcı:** Kocatepe Metro İstasyonu çevresinde yıllardır barınan, fare avcılığıyla meşhur, sevecen Tekir kedi (`avci1.jpg`, `avci2.jpg`).
- **Püskül:** İstanbul Üniversitesi Tarihi Beyazıt Kampüsü çevresinde yaşayan, gizemli ve zarif Calico kedi (`puskul1.jpg`, `puskul2.jpg`).
- **Prenses:** İstanbul Üniversitesi İletişim & Edebiyat çevresinde barınan, ilgi bağımlısı Gri Tekir kedi (`prenses1.jpg`).
- **Pancarlar:** Forum İstanbul açık alanında yıllardır birlikte dolaşan, uyumayı çok seven 2 kardeş sokak köpeği (`pancarlar1.jpg`).

### 2. Temsili Bölge Hekimleri ve Klinik Ağı
Her canlının bulunduğu coğrafi konuma en yakın bölgeden sorumlu temsili bir veteriner kliniği ve hekimi atanmıştır:
- **Forum İstanbul Bölge Kliniği (Temsili Simülasyon):** Dr. Simülasyon Veteriner Hekim — *İletişim: 0 (000) 000 00 01 (Temsili) • Acil: 0 (000) 000 00 00 (Simülasyon)*
- **Kocatepe Metro Acil Veteriner Noktası (Temsili Simülasyon):** Dr. Kurgusal Nöbetçi Hekim — *İletişim: 0 (000) 000 00 02 (Temsili) • Acil: 0 (000) 000 00 00 (Simülasyon)*
- **Beyazıt Kampüs Veteriner Birimi (Temsili Simülasyon):** Dr. Temsili Fakülte Hekimi — *İletişim: 0 (000) 000 00 03 (Temsili) • Acil: 0 (000) 000 00 00 (Simülasyon)*

> 📍 **Yeni Hekim Ekleme & GPS Desteği:** Kullanıcılar "Yeni Veteriner Hekim Ekle" modalı üzerinden kliniğin ismini, sorumlu hekimi, uzmanlık alanını, çalışma saatlerini ve cihaz GPS'ini kullanarak ya da hazır bölge butonlarıyla enlem/boylam koordinatlarını sisteme kaydedebilirler.

### 3. Coğrafi Bilgi ve Harita Modülü (CatMap)
- **Doğal Harita Entegrasyonu:** iOS işletim sisteminde Apple Maps (MapKit), Android işletim sisteminde ise API anahtarı kısıtlaması olmaksızın doğrudan cihazın yerel Google Maps motoru kullanılır.
- **Birleşik Konum Görünümü:** Harita üzerinde kediler (kedi ikonu), köpekler (köpek ikonu) ve sorumlu veteriner klinikleri (yeşil medkit ikonu) eşzamanlı olarak işaretlenir.
- **Otomatik Kadrajlama (Fit to Coordinates):** Harita açıldığında tüm canlıları ve klinikleri kapsayacak şekilde kamera açısını otomatik optimize eder.

### 4. Dinamik Analitik Modülü: Pati Karnesi & İlgi Özeti
- Ana ekranda sade ve zarif bir özet kartı (`CareSummaryCard.js`) yer alır.
- Karta dokunulduğunda bağımsız ve detaylı analitik sayfası açılır (`AnalyticsScreen.js`):
  1. **Genel Bakış (Overview):** Toplam bakım adedi, tamamlanan ve planlanan aşılar, en yüksek bağ kurulan canlının profiline doğrudan yönlendirme.
  2. **Bölge / Mahalle Dağılımı:** Forum İstanbul, Kocatepe ve İstanbul Üniversitesi bölgelerindeki can ve bakım dağılımı.
  3. **Irk & Tür Analizi:** Calico, Tekir, Gri Tekir ve Sokak Köpeği ırklarına uygulanan sağlık aktiviteleri.

### 5. Sadeleştirilmiş UX, Hızlı Kayıt (Quick Save) ve Taslak Yönetimi
- **Açılır Aksiyon Menüsü:** Ana ekrandaki karmaşık buton kalabalığı tek bir "Yeni Can Ekle +" açılır menüsünde toplanmıştır.
- **Hızlı Kayıt (Quick Save):** Acil durumlarda yalnızca fotoğraf çekilip anlık GPS konumu alınarak tek tuşla hızlı taslak kaydı yapılabilir.
- **Taslak Tamamlama Sekmesi:** Kedi ve köpek listelerindeki "Eksik / Taslaklar" sekmesi sayesinde eksik profiller sonradan tek dokunuşla düzenlenebilir.

### 6. Çift Dilli Dinamik Çeviri Motoru (TR / EN)
- Uygulama genelindeki tüm arayüz butonları, etiketler ve navigasyon başlıkları Türkçe ve İngilizce olarak sunulur.
- Geliştirilen `dynamicTranslator.js` motoru sayesinde; yalnızca sabit arayüz metinleri değil, veritabanındaki ırklar (*Tekir ➔ Tabby*, *Sokak Köpeği ➔ Street Dog*), aşı türleri (*Kuduz Aşısı ➔ Rabies Vaccine*), bakım notları ve bölgeler anında hedef dile çevrilir. Özel hayvan isimleri ise korunur.

### 7. Tema ve Görsel Bütünlük
- **Açık (Light) ve Koyu (Dark) Tema:** Cihaz tercihlerine göre otomatik veya sağ üstteki tema butonuyla manuel olarak değiştirilebilir.
- **Tam Ekran Lightbox:** Fotoğrafların üzerine dokunulduğunda yüksek çözünürlüklü tam ekran görüntüleyici açılır.

---

## 📱 Expo Go İle Çalıştırma Rehberi

Uygulamayı fiziksel bir mobil cihazda (iPhone veya Android) ya da simülatörde çalıştırmak için aşağıdaki yöntemlerden dilediğinizi kullanabilirsiniz:

### 🚀 Yöntem 1: Doğrudan Expo Go Bulut Yayını Üzerinden Açma (Tavsiye Edilen En Hızlı Yol)

Bu yöntem için bilgisayarınızda herhangi bir geliştirme ortamı veya kod derleyici kurulu olmasına gerek yoktur:

1. **Expo Go Uygulamasını İndirin:**
   - **iOS (iPhone/iPad):** [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) üzerinden **Expo Go** uygulamasını yükleyin.
   - **Android:** [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) üzerinden **Expo Go** uygulamasını yükleyin.
2. **Projeyi Açın:**
   - **Android Cihazlar İçin:** Expo Go uygulamasını açın, *"Scan QR code"* butonuna basın ve aşağıdaki Expo proje bağlantısındaki QR kodu tarayın.
   - **iOS Cihazlar İçin:** iPhone'unuzun standart **Kamera** uygulamasını açın, QR kodu kadraja alın ve ekranda beliren *"Expo Go ile Aç"* sarı bildirimine dokunun.
3. **Doğrudan Bağlantı:**
   - Projenin resmi EAS bulut paneline tarayıcınızdan erişebilirsiniz:  
     🔗 **[https://expo.dev/accounts/hakanural06/projects/street-animal-tracker](https://expo.dev/accounts/hakanural06/projects/street-animal-tracker)**
   - Bu sayfadaki **production** dalı (branch) altındaki en güncel güncellemeye dokunarak QR kodu görüntüleyebilirsiniz.

---

### 💻 Yöntem 2: Yerel Geliştirici Ortamında Çalıştırma (Local Development)

Proje kaynak kodlarını kendi bilgisayarınızda derleyip çalıştırmak isterseniz:

#### Ön Koşullar:
- **Node.js** (v18.0.0 veya üzeri)
- **npm** veya **yarn** paket yöneticisi
- Bilgisayarınız ve test cihazınızın **aynı Wi-Fi ağına** bağlı olması önerilir.

#### Adım Adım Kurulum:
```bash
# 1. Proje deposunu bilgisayarınıza klonlayın
git clone https://github.com/HakanURAL06/MobileAppDevelopmentProject.git

# 2. Proje dizinine geçiş yapın
cd MobileAppDevelopmentProject

# 3. Gerekli tüm kütüphane bağımlılıklarını yükleyin
npm install

# 4. Expo geliştirme sunucusunu (Metro Bundler) başlatın
npx expo start
```

Terminalde beliren interaktif menüde:
- `a` tuşuna basarak bağlı **Android Emulator** üzerinde,
- `i` tuşuna basarak bağlı **iOS Simulator** üzerinde,
- `w` tuşuna basarak doğrudan **Web Tarayıcınızda** (`http://localhost:8081`) test edebilirsiniz.
- Terminaldeki QR kodu telefonunuzdaki **Expo Go** ile tarayarak anında canlı önizleme alabilirsiniz.

---

### ☁️ Yöntem 3: EAS Update ile Bulut Yayını Güncelleme

Yapılan değişiklikleri doğrudan buluta yükleyip kullanıcı cihazlarına anında iletmek için:

```bash
# 1. Expo hesabına giriş yapın
npx eas-cli login

# 2. Production kanalına yeni derleme paketini dağıtın
EAS_NO_VCS=1 npx eas-cli update --branch production --message "Surum Guncellemesi"
```

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Bileşen | Kullanılan Teknoloji / Kütüphane | Sürüm | Görev ve Açıklama |
| :--- | :--- | :--- | :--- |
| **Framework** | **React Native** | 0.86.3 | Çapraz platform mobil arayüz çekirdeği |
| **Runtime & SDK** | **Expo SDK** | ~57.0.0 | Cihaz API'leri, kamera, konum ve derleme ekosistemi |
| **Çekirdek Kütüphane**| **React** | 19.2.3 | Reaktif bileşen mimarisi ve durum döngüleri |
| **Durum Yönetimi** | **Zustand** | ^5.0.3 | Hızlı, merkezi ve reaktif global state yönetimi |
| **Veri Kalıcılığı** | **AsyncStorage** | 2.2.0 | Cihaz üzerinde kalıcı JSON depolama motoru |
| **Navigasyon** | **React Navigation** | ^7.0.0 | Alt menü (Bottom Tabs) ve Yerel Yığın (Native Stack) |
| **Harita Motoru** | **React Native Maps** | 1.20.1 | Apple Maps & Google Maps yerel harita entegrasyonu |
| **Coğrafi Konum** | **Expo Location** | ~57.0.0 | Cihaz GPS'i ile canlı enlem/boylam tespiti |
| **Görsel Seçimi** | **Expo ImagePicker** | ~57.0.0 | Cihaz galerisi ve kameraya yerel erişim |
| **Vektörel İkonlar**| **@expo/vector-icons**| ^15.0.0 | Ionicons tabanlı modern arayüz sembolleri |
| **Bulut Dağıtımı** | **EAS Update** | ^14.0.0 | Mağaza onayı beklemeksizin OTA bulut güncellemesi |
| **Test Koşucusu** | **Node.js Test Runner** | Node v18+ | Analitik ve iş mantığını doğrulayan birim testleri |

---

## 🧪 Birim Testleri (Unit Tests)

Uygulamanın analitik motorunu, aşı sayım mantığını ve seviye ilerleme algoritmalarını denetleyen otomatik birim testleri mevcuttur:

```bash
# Birim testlerini çalıştırmak için:
npm test
```

**Test Kapsamı (`tests/careAnalytics.test.js`):**
- Boş veri tabanı (initial state) sıfır değer doğrulaması,
- `null` veya `undefined` veri girişlerinde hata yakalama (safe fallback),
- Kedi ve köpek etkileşimlerinin ve tamamlanan/planlanan aşıların doğru toplanması,
- Zustand store veri modeli ile uyumluluk denetimi,
- Bağ ve sadakat seviyesi yüzdelik hesaplama doğrulaması.

---

## 📁 Proje Dizin Mimarisi

```text
MobileAppDevelopmentProject/
├── package.json                          # Proje metaverileri, betikler ve bağımlılıklar
├── app.json                              # Expo ve EAS proje yapılandırma ayarları
├── eas.json                              # EAS Update ve derleme kanalları (production)
├── index.js                              # Uygulamanın en dış giriş noktası
├── App.js                                # Navigasyon, tema sağlayıcıları ve künye modalı
├── README.md                             # Kapsamlı akademik proje dokümantasyonu
├── assets/
│   └── animals/                          # Yüksek çözünürlüklü gerçek hayvan fotoğrafları
│       ├── habes1.jpg, habes2.jpg
│       ├── tipsiz1.jpg, tipsiz2.jpg
│       ├── avci1.jpg, avci2.jpg
│       ├── puskul1.jpg, puskul2.jpg
│       ├── prenses1.jpg
│       └── pancarlar1.jpg
├── src/
│   ├── components/
│   │   ├── AddAnimalActionMenu.js        # Minimalist açılır yeni can ekleme menüsü
│   │   ├── CareSummaryCard.js            # Ana ekran Pati Karnesi sadeleştirilmiş kartı
│   │   ├── CatMap.native.js              # Mobil yerel harita motoru (Apple & Google Maps)
│   │   ├── CatMap.web.js                 # Web ortamı için harita kartları bileşeni
│   │   ├── ConfirmDeleteModal.js         # Güvenli kayıt silme teyit penceresi
│   │   ├── ImageViewerModal.js           # Tam ekran lightbox fotoğraf görüntüleyici
│   │   ├── ProjectDisclaimerModal.js     # Resmi akademik proje künyesi ve bildirim modalı
│   │   └── ToastBanner.js                # Dinamik kullanıcı bildirim çubuğu
│   ├── data/
│   │   └── seedData.js                   # 6 gerçek can ve 3 simülasyon kliniği başlangıç verileri
│   ├── i18n/
│   │   └── translations.js               # Türkçe ve İngilizce statik sözlük tablosu
│   ├── screens/
│   │   ├── HomeScreen.js                 # Karşılama, sayaçlar, künye kartı ve yönlendirmeler
│   │   ├── AnalyticsScreen.js            # Kapsamlı Pati Karnesi & İlgi Özeti analitik sayfası
│   │   ├── CatListScreen.js              # Kedi listeleme, canlı arama ve filtreleme
│   │   ├── CatDetailScreen.js            # Kedi detay, aşı takibi, 5 seviyeli bağ ve konum
│   │   ├── AddCatScreen.js               # Kedi kayıt formu (Hızlı ve Detaylı Kaydet)
│   │   ├── DogListScreen.js              # Köpek listeleme, canlı arama ve filtreleme
│   │   ├── DogDetailScreen.js            # Köpek detay, aşı takibi, 5 seviyeli sadakat ve konum
│   │   ├── AddDogScreen.js               # Köpek kayıt formu (Hızlı ve Detaylı Kaydet)
│   │   ├── CatMapScreen.js               # Canlı harita, canlı ve veteriner pinleri
│   │   ├── VetListScreen.js              # Bölge hekimleri listesi, arama ve hekim ekleme
│   │   └── VetDetailScreen.js            # Veteriner detay, klinik bilgileri ve acil hat
│   ├── store/
│   │   └── catStore.js                   # Zustand persist ve AsyncStorage tabanlı yerel veritabanı
│   ├── theme/
│   │   ├── colors.js                     # Aydınlık ve karanlık tema renk tanımları
│   │   └── useAppTheme.js                # Tema ve dil durumunu yöneten özel React kancası
│   └── utils/
│       ├── careAnalytics.js              # Analitik hesaplama ve istatistiksel filtreleme algoritması
│       ├── dynamicTranslator.js          # Veritabanı ve kullanıcı girdilerini hedef dile çeviren motor
│       └── imageHelper.js                # Yerel require ve uzak URI görselleri çözümleyici
└── tests/
    └── careAnalytics.test.js             # Otomatik birim testleri (Node.js Test Runner)
```

---

## 📜 Lisans ve Telif Hakları

Bu proje; **Mobile Application Development** dersi akademik değerlendirmesi kapsamında geliştirilmiş olup tüm hakları geliştiriciye aittir.

**Geliştirici:** Hakan Ural  
**Öğrenci Numarası:** 0515240030  


*Sokaktaki masum dostlarımızın yaşam kalitesini artırmak dileğiyle...* 🐾❤️
