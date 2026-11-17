# Sokak Hayvanları Sağlık ve Bakım Takip Sistemi (Street Animal Tracker) 🐾

**Sokak Hayvanları Sağlık ve Bakım Takip Sistemi**, kentsel alanlarda ve üniversite kampüslerinde yaşayan sokak kedileri ve sokak köpeklerinin beslenme, sağlık, aşı ve konum geçmişlerini kayıt altına almak amacıyla **React Native** ve **Expo** teknolojileriyle geliştirilmiş çapraz platform (iOS, Android ve Web) bir mobil uygulamadır.

Uygulama; harici bir sunucu bağımlılığı gerektirmeksizin, cihaz üzerinde çalışan **Zustand Persist** ve **AsyncStorage** tabanlı tam teşekküllü **yerel JSON veritabanı (Local JSON Database)** mimarisine sahiptir. Bu sayede çevrimdışı (offline) koşullarda dahi tam veri bütünlüğü ve kalıcılık sağlar.

---

## 📑 İçindekiler
1. [Proje Mimarisi ve Veri Yönetimi](#-proje-mimarisi-ve-veri-yönetimi)
2. [Temel Fonksiyonlar ve Ekranlar](#-temel-fonksiyonlar-ve-ekranlar)
3. [Öne Çıkan Teknik Nitelikler](#-öne-çıkan-teknik-nitelikler)
4. [Teknoloji Yığını (Tech Stack)](#-teknoloji-yığını-tech-stack)
5. [Kurulum ve Çalıştırma Rehberi](#-kurulum-ve-çalıştırma-rehberi)
6. [Olası Dağıtım ve Ağ Sorunları Çözüm Rehberi (Troubleshooting)](#-olası-dağıtım-ve-ağ-sorunları-çözüm-rehberi-troubleshooting)
7. [Birim Testleri (Unit Tests)](#-birim-testleri-unit-tests)
8. [Proje Dizin Yapısı](#-proje-dizin-yapısı)

---

## 🗄️ Proje Mimarisi ve Veri Yönetimi

Uygulamanın veri katmanı (`src/store/catStore.js`), modern mobil uygulama standartlarına uygun olarak tasarlanmıştır:

- **Sıfır Statik Başlangıç Verisi (Clean Slate Initial State):** Uygulama ilk kez yüklendiğinde hayvan listeleri tamamen boş (`cats: []`, `dogs: []`) olarak başlar. Kod tabanında sahte veya geçici mock veriler bulunmaz; böylece uygulamanın yeniden başlatılması durumunda kullanıcı verilerinin üzerine yazılması kesin olarak önlenir.
- **Otomatik JSON Kalıcılığı (Persistence Engine):** `zustand/middleware` modülünün resmi `persist` ve `createJSONStorage(() => AsyncStorage)` arayüzleri üzerinden durum değişiklikleri eşzamanlı olarak yerel depolama alanına serileştirilir.
- **Tam CRUD Desteği (Create, Read, Update, Delete):**
  - **Kayıt Oluşturma:** Kedi ve köpek profilleri, isim, ırk/cins, fotoğraf albümü, anlık GPS koordinatları ve ilk karşılaşma etkileşimleriyle oluşturulur.
  - **Kayıt Güncelleme:** Profil bilgileri, sağlık/bakım notları, geçmiş aşı kayıtları, planlanan aşılar ve konum değişiklikleri güncellenir.
  - **Kayıt Silme:** Kayıtlı hayvan profilleri veya aşı kartları kullanıcı teyidi eşliğinde güvenli bir şekilde silinir.
- **Görsel Saklama Bütünlüğü:** Seçilen ya da kamera ile çekilen görseller, Base64 URI veri formatında doğrudan veritabanı kayıt nesnesiyle ilişkilendirilir.

---

## 📱 Temel Fonksiyonlar ve Ekranlar

Uygulama, kullanıcı deneyimini maksimize eden zengin ekran ve bileşen hiyerarşisine sahiptir:

### 1. Ana Karşılama ve Kontrol Paneli (`HomeScreen.js`)
- **İstatistiksel Genel Bakış:** Kayıtlı toplam kedi, köpek ve genel hayvan sayısı özet rozetleri.
- **Mahalle Bakım Özeti (`CareSummaryCard.js`):** Topluluk tarafından gerçekleştirilen toplam bakım eylemleri (besleme, su, sevgi vb.), tamamlanan toplam aşılar, yaklaşan aşılar ve en yüksek bağ seviyesine sahip olan hayvan bilgisini gerçek zamanlı hesaplayan analitik paneli.
- **Hızlı Aksiyonlar:** Kedi ekleme, köpek ekleme ve harita görünümüne tek dokunuşla geçiş kartları.

### 2. Kedi ve Köpek Yönetim Listeleri (`CatListScreen.js` & `DogListScreen.js`)
- **Dinamik Filtreleme ve Gruplama:** Tümü, Konuma Göre, Cinsine Göre ve Bağ Seviyesine Göre anlık gruplandırma seçenekleri.
- **Canlı Metin Araması:** İsim ve bölgeye duyarlı dinamik arama çubuğu.
- **Hızlı İşlemler:** Kart üzerinden doğrudan silme modalı çağırma ve yüzen ekleme butonu (FAB).

### 3. Detay ve Sağlık Takip Sayfaları (`CatDetailScreen.js` & `DogDetailScreen.js`)
- **Oyunlaştırılmış Bağ Seviyesi Sistemi (Bond Level):** Gerçekleştirilen etkileşim sayısına paralel olarak artan 5 aşamalı görsel ilerleme çubuğu.
- **Fotoğraf Galerisi ve Lightbox:** Sınırsız albüm desteği, kapak fotoğrafı yönetimi ve tam ekran yüksek çözünürlüklü slayt görüntüleyici (`ImageViewerModal.js`).
- **Aşı ve Sağlık Takvimi:**
  - *Geçmiş Aşılar:* Uygulanan aşı türü, tarih, veteriner kliniği ve tıbbi notlar.
  - *Planlanan Aşılar:* Gelecek tarihe randevulanan aşılar ve tek dokunuşla tamamlandıya çevirme özelliği.
- **Konum ve Bölge Geçmişi:** Hayvanın bulunduğu ana konum güncellendiğinde, eski bölgeleri zaman damgasıyla listeleyen konum günlüğü.
- **Türe Özel Etkileşim Butonları:**
  - *Kedi:* Mama verme, su bırakma, sevme, oyun, sağlık kontrolü.
  - *Köpek:* Mama verme, yürüyüşe çıkarma, göbek kaşıma, top oyunu, ödül maması, sağlık kontrolü.

### 4. Coğrafi Takip ve Harita Ekranı (`CatMapScreen.js`)
- Cihaz GPS entegrasyonu (`expo-location`) ile hayvanların harita üzerindeki dağılımı (`react-native-maps`).
- Tür filtreleme (Tümü, Yalnızca Kediler, Yalnızca Köpekler).
- Platforma duyarlı modüler mimari: Mobil cihazlarda yerel harita motoru (`CatMap.native.js`), web ortamında ise uyumlu görsel liste haritası (`CatMap.web.js`).

### 5. Yeni Hayvan Kayıt Arayüzleri (`AddCatScreen.js` & `AddDogScreen.js`)
- Kamera veya cihaz galerisinden fotoğraf çekme/seçme.
- Tek dokunuşla bulunulan yerin GPS koordinatlarını ve adres bilgisini alma.
- Çoklu seçimli ilk karşılaşma etkileşim çipleri.

---

## 🌟 Öne Çıkan Teknik Nitelikler

- **Uluslararasılaştırma (i18n):** Uygulama başlığında yer alan minimalist buton ile Türkçe (TR) ve İngilizce (EN) dilleri arasında anında geçiş.
- **Açık ve Koyu Tema Desteği:** Sistem kontrast standartlarına uygun, göz yormayan Açık (Light) ve Koyu (Dark) mod mimarisi.
- **Kalıcı Alt Menü (Bottom Navigation):** Uygulama içerisinde gezinirken tüm ana ekranlara doğrudan erişim sunan alt sekme çubuğu.
- **Mobil Ekran Güvenli Alan Uyumluluğu:** `react-native-safe-area-context` ile modern çentikli (Notch / Dynamic Island) ve kıvrımlı ekran köşelerine duyarlı dinamik boşluklar (`useSafeAreaInsets`).
- **Ergonomik Dokunma Alanları:** Mobil tasarım standartları gereği kritik butonlar için genişletilmiş dokunma toleransları (`hitSlop`).

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
| **Medya ve Donanım Erişimi** | Expo ImagePicker | ~57.0.0 |
| **Birim Testleri (Unit Tests)** | Node.js Test Runner (`node:test`) | Node v18+ |
| **Konteynerizasyon** | Docker & Docker Compose | Güncel |

---

## 🚀 Kurulum ve Çalıştırma Rehberi

Uygulama iki farklı geliştirme ortamında çalıştırılabilir:

### Yöntem 1: Yerel Ortamda Çalıştırma (Tavsiye Edilen)

#### Gereksinimler:
- Node.js (v18 veya üzeri)
- npm veya yarn
- Test cihazında **Expo Go** mobil uygulaması

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın
npx expo start

# 3. İsteğe bağlı olarak Web tarayıcısında görüntülemek için:
npx expo start --web
```

---

### Yöntem 2: Docker ile Konteyner Üzerinde Çalıştırma

Docker altyapısı, harici ortam bağımlılıklarını izole ederek sunucunun hızlıca ayağa kaldırılmasını sağlar:

```bash
# Konteyneri inşa edin ve başlatın
docker compose up --build
```

Container çalıştıktan sonra:
- Web çıktısına `http://localhost:8081` adresinden erişilebilir.
- Container'ı sonlandırmak için `docker compose down` komutu kullanılır.

---

## 🔧 Olası Dağıtım ve Ağ Sorunları Çözüm Rehberi (Troubleshooting)

Farklı ağ yapılandırmalarında ve cihaz modellerinde karşılaşılabilecek durumlar ve standart çözüm yöntemleri aşağıda listelenmiştir:

### 1. Docker Üzerinde Fiziksel Cihazın Expo Go Bağlantı Zaman Aşımı (Connection Timeout)
- **Olası Neden:** Docker varsayılan olarak dahili bir köprü ağı (bridge network) kullanır. Mobil cihaz, geliştirme sunucusunun yerel ağ (LAN) IP adresi yerine Docker'ın iç sanal IP'sine yönlendirilirse bağlantı kurulamaz.
- **Çözüm:** 
  Ana makinenin yerel ağdaki IP adresini ortam değişkeni olarak Docker'a ileterek çalıştırın:
  ```bash
  # Linux / macOS:
  HOST_IP=$(hostname -I | awk '{print $1}') docker compose up
  # veya
  HOST_IP=<BILGISAYAR_YEREL_IP_ADRESI> docker compose up

  # Windows (PowerShell):
  $env:HOST_IP="<BILGISAYAR_YEREL_IP_ADRESI>"; docker compose up
  ```

### 2. Fiziksel Cihaz ile Expo Go SDK Sürüm Uyuşmazlığı
- **Olası Neden:** Cihazdaki Expo Go istemcisi yakın zamanda güncellendiyse eski SDK sürümlerine sahip projeleri derlemeyi reddedebilir.
- **Çözüm:** Proje **Expo SDK 57** ile tam uyumlu hale getirilmiştir. `package.json` bağımlılıklarının kurulu olduğundan emin olun (`npm install`).

### 3. Web Ortamında Harita Kütüphanesi (`react-native-maps`) Uyarısı
- **Olası Neden:** `react-native-maps`, yerel iOS (Apple Maps) ve Android (Google Maps) bileşenlerine dayanır ve web tarayıcılarında yerel derlenemez.
- **Çözüm:** Proje modüler mimarisinde `CatMap.native.js` ve `CatMap.web.js` dosyaları platform bazlı ayrıştırılmıştır; Expo platform motoru otomatik olarak uygun dosyayı yükler.

---

## 🧪 Birim Testleri (Unit Tests)

Uygulamanın veri analiz motorunu, aşı sayaçlarını, uç durum korumalarını (null/undefined toleransı) ve bağ hesaplama algoritmalarını doğrulayan otomatik birim testleri mevcuttur:

```bash
# Birim testlerini çalıştırmak için:
npm test
```

Test paketi harici kütüphane bağımlılığı olmaksızın doğrudan Node.js yerleşik test motoru (`node:test`, `node:assert/strict`) üzerinde çalışır.

---

## 📁 Proje Dizin Yapısı

```text
MobileAppDevelopmentProject/
├── Dockerfile                      # Docker derleme yapılandırması
├── docker-compose.yml              # Konteyner servis ve port tanımları
├── package.json                    # Bağımlılıklar ve npm betikleri
├── app.json                        # Expo uygulama ayarları
├── index.js                        # Uygulama giriş noktası
├── App.js                          # Ana navigasyon ve tema sağlayıcıları
├── src/
│   ├── components/
│   │   ├── CareSummaryCard.js      # Mahalle bakım özeti bileşeni
│   │   ├── ConfirmDeleteModal.js   # Silme doğrulama modalı
│   │   ├── ImageViewerModal.js     # Tam ekran lightbox görsel görüntüleyici
│   │   ├── ToastBanner.js          # Bildirim bildirim çubuğu
│   │   ├── CatMap.native.js        # Mobil yerel harita motoru
│   │   └── CatMap.web.js           # Web ortamı harita bileşeni
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
│       ├── careAnalytics.js        # İstatistiksel analiz ve bağ algoritması
│       └── imageHelper.js          # Görsel URI çözümleyici yardımcı modül
└── tests/
    └── careAnalytics.test.js       # Otomatik doğrulama birim testleri
```

---

## 📄 Lisans
Bu proje eğitim ve topluluk faydası amacıyla geliştirilmiş açık kaynaklı bir mobil sistemdir. 🐾
