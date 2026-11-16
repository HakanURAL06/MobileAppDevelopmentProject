# Sokak Hayvanları Takip ve Etkileşim Uygulaması (Street Animal Tracker: Cats & Dogs 🐾)

React Native ve Expo kullanılarak geliştirilen; sokak kedileri ve köpeklerinin bakımını, beslenmesini, konumlarını, aşı takvimlerini ve insanlarla kurdukları bağı takip etmeyi sağlayan, **gerçek bir yerel JSON veritabanı (Local Database)** mimarisiyle çalışan kapsamlı bir mobil ve web uygulamasıdır.

---

## 🗄️ Yerel Veritabanı Mimarisi (Local JSON Database & Persistence)

Uygulamanın veri katmanı (`src/store/catStore.js`), GitHub'dan projeyi klonlayan her kullanıcının kendi cihazında sıfır ayar ile çalışan, kalıcı ve izole bir yerel veritabanına sahip olması için **Zustand Persist Middleware** ve **AsyncStorage** üzerine inşa edilmiştir:

1. **Sıfır Sahte Veri (Clean Initial State):**
   - Uygulama ilk kez kurulduğunda `cats: []` ve `dogs: []` tabloları tamamen **boş** olarak başlar.
   - Kod içerisine gömülü hiçbir sabit/sahte başlangıç verisi bulunmaz; böylece uygulama yeniden başlatıldığında kullanıcı verilerinin üzerine yazılması (overwrite) kesin olarak engellenir.
2. **Otomatik JSON Serileştirme (`persist` & `createJSONStorage`):**
   - `zustand/middleware` modülünün resmi `persist` ve `createJSONStorage(() => AsyncStorage)` yapıları kullanılarak tüm state değişiklikleri anında JSON formatına dönüştürülür ve cihaz hafızasına (`street-animal-local-db-v1` anahtarıyla) kaydedilir.
   - **Mobil (iOS & Android):** Veriler cihazın kendi yerel `AsyncStorage` (SQLite / yerel dosya sistemi) alanında saklanır.
   - **Web / Docker:** Veriler tarayıcının `localStorage` alanında JSON olarak saklanır.
3. **Tam CRUD Operasyonları (Create, Read, Update, Delete):**
   - **Kediler (`cats`):** `addCat`, `deleteCat`, `addPhotoToCat`, `addInteraction`, `updateCatInfo`, `updateCatNotes`, `addVaccination`, `scheduleVaccine`, `completeScheduledVaccine`, `deleteVaccine`
   - **Köpekler (`dogs`):** `addDog`, `deleteDog`, `addPhotoToDog`, `addDogInteraction`, `updateDogInfo`, `updateDogNotes`, `addDogVaccination`, `scheduleDogVaccine`, `completeScheduledDogVaccine`, `deleteDogVaccine`
   - Herhangi bir kayıt eklendiğinde, güncellendiğinde veya silindiğinde yerel JSON veritabanı milisaniyeler içinde senkronize edilir.
4. **Kalıcı Base64 & URI Fotoğraf Saklama:**
   - Kamera veya galeriden seçilen fotoğraflar Base64 Data URI desteğiyle doğrudan yerel JSON veritabanına kaydedilir; böylece uygulama veya tarayıcı kapatılıp açılsa dahi fotoğraflar asla kaybolmaz.

---

## 🌟 Öne Çıkan Özellikler

### 1. 🌐 Çoklu Dil Desteği (Türkçe & İngilizce / i18n)
- **Tek Dokunuşla Dil Değiştirme:** Uygulama genelinde Türkçe (🇹🇷 TR) ve İngilizce (🇬🇧 EN) dilleri arasında anında geçiş imkanı.
- **Tüm Arayüzde Bütünleşik Çeviri:** Sekmeler, ekran başlıkları, butonlar, form girişleri, arama çubukları, aşı türleri, oyunlaştırılmış bağ seviyeleri ve Toast bildirimlerinin tamamı dinamik olarak seçilen dile uyum sağlar.
- **Kalıcı Dil Tercihi:** Yapılan dil seçimi yerel veritabanında kalıcı olarak saklanır; uygulama tekrar açıldığında son tercih korunur.

### 2. 🌓 Açık ve Koyu Tema (Light / Dark Mode)
- **Özel Renk Paletleri:**
  - **☀️ Açık Tema:** Sıcak fildişi zemin, şeftali/mercan kedi vurguları, kehribar köpek tonları ve yumuşak pastel kartlar.
  - **🌙 Koyu Tema:** Gece kullanımına uygun derin arduvaz/grafit zeminler, yüksek kontrastlı tipografi ve gözü yormayan pastel vurgular.
- **Hızlı Kontrol Barı (ThemeLanguageBar):** Ana sayfa ve ekran başlıkları üzerinde yer alan interaktif butonlarla tema ve dil aynı anda kolayca değiştirilebilir.
- **Kalıcı Tema Tercihi:** Tema tercihi yerel JSON veritabanında güvenle saklanır.

### 3. 🐱 Kediler ve 🐶 Köpekler Çift Kategori Yönetimi
- **Ayrı Sekmeler ve Listeler:** Kedilerim ve Köpeklerim için bağımsız listeleme ve yönetim ekranları.
- **Türe Özel Arayüz ve Temalandırma:** Kedi dostlarımız için sıcak şeftali/mercan tonları, köpek dostlarımız için enerji dolu kehribar/amber renk paleti.

### 4. 🔍 Akıllı Arama, Filtreleme ve Gruplama
- **Canlı Arama Çubuğu:** İsim veya bölge/mahalle adına göre harf harf anında arama yapabilme.
- **Dinamik Gruplama Seçenekleri:**
  - 📋 **Tümü:** Sade liste görünümü.
  - 🧬 **Cins / Türüne Göre:** Örneğin Tekir, Calico, Golden vb. altında gruplu görünüm.
  - 📍 **Konum / Bölgeye Göre:** Mahalle, park veya kampüs bölgelerine göre ayrılmış bölümler.

### 5. 📷 Albüm ve Tam Ekran Fotoğraf Görüntüleyici (Lightbox)
- **Çoklu Fotoğraf Desteği:** Her patili dost için sınırsız fotoğraf albümü oluşturabilme ve kapak fotoğrafı belirleme.
- **Tam Ekran Görsel İnceleme:**
  - Kapak fotoğrafına veya albümdeki herhangi bir fotoğrafa dokunulduğunda tam ekran modal açılır.
  - Çoklu görsellerde sağ/sol geçiş okları ve alt şeritte küçük resim önizlemeleri (thumbnails) ile hızlı geçiş.
  - Fotoğraf sayacı (`1 / 3`) ve kapatma butonu.

### 6. 💉 Aşı Takibi ve Gelecek Aşı Planlama
- **Tamamlanan Aşılar:** Uygulanan aşı adı (Kuduz, Karma, İç-Dış Parazit vb.), yapılış tarihi, uygulayan veteriner kliniği ve özel notlar.
- **Planlanan / Yaklaşan Aşılar:** Gelecek aşı tarihi ve hatırlatma notuyla aşı planlama.
- **Tek Tıkla Tamamlama:** Planlanan aşı günü geldiğinde tek dokunuşla "Tamamlandı" olarak işaretlenir ve geçmiş aşılar listesine aktarılır.

### 7. 📍 Akıllı Konum ve Eski Konum Geçmişi
- **Özel Bölge İsimlendirme:** GPS koordinatlarının yanında el ile tanınabilir konum adı verebilme.
- **GPS Koordinat Entegrasyonu:** `expo-location` ile tek dokunuşla cihazın anlık enlem/boylam bilgilerini alabilme.
- **Konum Değişim Arşivi:** Bir patili dostun konumu güncellendiğinde, eski konumu otomatik olarak tarih damgasıyla *"Eski Konum Geçmişi"* listesine kaydedilir.

### 8. 🎮 Oyunlaştırılmış Bağ & Sadakat Seviyesi (Bond System)
Yapılan her sevgi dolu etkileşim aranızdaki bağı güçlendirir ve seviye atlatır (hem Türkçe hem İngilizce dilinde):
- **Kedi Bağ Seviyeleri:**
  1. 🌱 *Yabancı* / *Stranger* (0 - 1 etkileşim)
  2. 👀 *Meraklı Bakış* / *Curious Gazer* (2 - 4 etkileşim)
  3. 🐾 *Temkinli Dost* / *Cautious Friend* (5 - 8 etkileşim)
  4. 💖 *Güvenen Patili* / *Trusted Companion* (9 - 13 etkileşim)
  5. 👑 *Mırıldayan Sırdaş* / *Purring Confidant* (14+ etkileşim)
- **Köpek Bağ Seviyeleri:**
  1. 🌿 *Çekingen Gözlemci* / *Shy Observer* (0 - 1 etkileşim)
  2. 🐕 *Kuyruk Sallayan* / *Tail Wagger* (2 - 4 etkileşim)
  3. 🎾 *Sadık Arkadaş* / *Loyal Buddy* (5 - 8 etkileşim)
  4. 🌟 *En İyi Dost* / *Best Pal* (9 - 13 etkileşim)
  5. 🏆 *Can Yoldaşı* / *Soul Companion* (14+ etkileşim)

### 9. 🥣 Çeşitlendirilmiş Hızlı Etkileşimler
- **Kediler İçin:** Mama Verdim (🥣), Başını/Çenesini Sevdim (😽), Yaş Mama/Ödül Verdim (🥫), Oyun Oynadık (🪶), Taze Su Koydum (💧), Sağlık Kontrolü (🩺).
- **Köpekler İçin:** Mama Verdim (🥣), Yürüyüş Yaptık (🦮), Göbüşünü Kaşıdım (🐕), Topla Oynadık (🎾), Ödül / Kemik Verdim (🦴), Taze Su Koydum (💧), Sağlık Kontrolü (🩺).
- **Yeni Kayıtta Çoklu İlk Etkileşim:** Yeni kedi/köpek eklerken ilk karşılaşma anında yapılan etkileşimleri seçerek kayda başlayabilme.

### 10. 🔔 Estetik Toast Pop-up Bildirimleri
- Kedi/köpek ekleme, silme, aşı kaydetme, dil ve tema değiştirme işlemlerinde ekranın üst kısmından yumuşak geçişle inen ve otomatik kapanan modern Toast banner'ı.

### 11. 📊 Mahalle Bakım Özeti (Community Care Summary) ve Otomatik Birim Testleri
- **Canlı Bakım İstatistikleri (`CareSummaryCard.js` & `careAnalytics.js`):** Ana ekranda yerel veritabanındaki tüm kedi ve köpekler için toplam bakım/ilgi sayısını, tamamlanan aşıları, planlanan aşıları ve en yüksek bağ kurulan dostumuzu anlık olarak özetler.
- **Mobil Safe Area & Köşe Ergonomisi:** `react-native-safe-area-context` (`useSafeAreaInsets`) kullanılarak çentikli (Notch / Dynamic Island) ve kıvrımlı ekranlarda üst/alt barların, fotoğraf kapatma butonlarının ve kart içi aksiyonların köşelere sıkışması engellenmiştir.

---

## 🎯 Problem Tanımı, Hedef Kitle ve Mimari Kararlar (Final Project Overview)

### 1. Problem Tanımı ve Motivasyon (Problem Definition & Motivation)
Sokak hayvanlarının yoğun olduğu mahallelerde ve üniversite kampüslerinde hayvanseverler genellikle bireysel hareket etmekte; hangi kedi veya köpeğin ne zaman beslendiği, suyunun yenilendiği, hangi aşılarının yapıldığı veya en son hangi sokakta görüldüğü düzenli olarak takip edilememektedir. Bu uygulama, sokak kedileri ve köpekleri için **kalıcı, çevrimdışı çalışabilen ve kullanımı kolay bir dijital bakım/sağlık karnesi** oluşturarak bu problemi çözmeyi hedefler.

### 2. Hedef Kullanıcı Kitlesi (Target User Group)
- Mahalle sakinleri ve yerel hayvansever gönüllüler,
- Üniversite kampüslerindeki hayvan koruma toplulukları ve öğrenciler,
- Sokak hayvanlarının düzenli beslenme ve aşı takvimini tutmak isteyen bireysel bakıcılar.

### 3. Karşılaşılan Teknik Zorluklar ve Çözümleri (Technical Challenges & Solutions)
1. **Docker Konteyneri Üzerinden Fiziksel Telefona (iPhone Expo Go) LAN Bağlantısı:**
   - *Sorun:* Docker varsayılan olarak kendi iç sanal IP'sini (`172.19.0.2`) ürettiği için fiziksel telefondan `Connection Timeout` hatası alınıyordu.
   - *Çözüm:* `docker-compose.yml` üzerinde portlar `0.0.0.0` ile tüm yerel ağa açıldı, `REACT_NATIVE_PACKAGER_HOSTNAME` ortam değişkeni ve `npx expo start --host lan` başlatma komutu ile doğrudan fiziksel cihaza yayın yapıldı.
2. **Web ve Mobil (Native) Harita Uyumluluğu (`react-native-maps`):**
   - *Sorun:* `react-native-maps` kütüphanesi sadece iOS/Android üzerinde çalışmakta, Web derlemesinde çökme yaratmaktaydı.
   - *Çözüm:* Platforma özel dosya uzantıları (`CatMap.native.js` ve `CatMap.web.js`) kullanılarak mobil cihazlarda yerel harita, web ortamında ise interaktif konum kartları sorunsuz şekilde ayrıştırıldı.
3. **Veri Kalıcılığı ve Sahte Verilerin Üzerine Yazma Sorunu:**
   - *Sorun:* Uygulama yeniden başlatıldığında kullanıcı verilerinin sıfırlanmaması gerekiyordu.
   - *Çözüm:* `Zustand persist` middleware ve `@react-native-async-storage/async-storage` kullanılarak tüm CRUD işlemleri (`street-animal-local-db-v1`) cihaz hafızasına otomatik JSON serileştirme ile kalıcı hale getirildi.
4. **Çentikli (Notch / Dynamic Island) ve Kıvrımlı Mobil Ekranlarda Köşe Ergonomisi:**
   - *Sorun:* Tam ekran fotoğraf görüntüleyici ve kart köşelerindeki butonlar telefonun kıvrımlı köşelerinde veya çentik altında kalarak tıklanmayı zorlaştırıyordu.
   - *Çözüm:* `useSafeAreaInsets` ile dinamik güvenli alan boşlukları, genişletilmiş `hitSlop` dokunma toleransları, `KeyboardAvoidingView` ve alt başparmak erişim butonları eklendi.

### 4. Gelecek Geliştirme Fikirleri (Future Improvement Ideas)
- **Bulut Senkronizasyonu (Firebase / Supabase):** Aynı mahalledeki tüm komşuların ortak bir canlı veritabanı üzerinden aynı kedi/köpek profillerini güncelleyebilmesi.
- **Anlık Bildirimler (Push Notifications):** Planlanan aşı günü geldiğinde cihaza otomatik hatırlatma bildirimi gönderilmesi.
- **Veteriner Kliniği Entegrasyonu:** Harita üzerinde nöbetçi veya anlaşmalı veteriner kliniklerinin gösterilmesi.

---

## 🧪 Otomatik Birim Testleri (Unit Tests)

Proje içerisinde veri analizi ve bağ seviyesi hesaplama motorunu (`src/utils/careAnalytics.js`) doğrulayan otomatik birim testleri (`tests/careAnalytics.test.js`) yer almaktadır. Herhangi bir ek paket kurulumuna gerek kalmadan doğrudan çalıştırılabilir:

```bash
npm test
# veya doğrudan:
node --test tests/careAnalytics.test.js
```

---

## 🚀 Docker ile Tek Komutla Çalıştırma

Bilgisayarınıza Node.js veya herhangi bir mobil bağımlılık kurmadan, Docker ile uygulamayı izole bir container içinde anında çalıştırabilirsiniz.

### ⚡ Otomatik IP Tespiti ile Hızlı Başlatma (Tavsiye Edilen)
Mac'inizin o an bağlı olduğu Wi-Fi / yerel ağ IP'sini otomatik algılayıp Docker'a aktaran ve Expo'yu telefonunuzla sorunsuz bağlayan başlatıcı:

```bash
./baslat.sh
```

### 🐳 Klasik Docker Compose ile Başlatma

```bash
# Container'ı derle ve başlat (HOST_IP çevre değişkeni ile)
HOST_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1) docker compose up --build
```

Sunucu hazır olduğunda:
- **Web Çıktısı:** Tarayıcınızdan [`http://localhost:8081`](http://localhost:8081) adresini açarak uygulamayı test edebilirsiniz.
- **Canlı Yenileme (Hot-Reload):** `src/` altındaki kodları değiştirdiğiniz anda tarayıcı otomatik güncellenir.

Container'ı durdurmak için:
```bash
docker compose down
```

---

## 📱 Yerel Olarak (Docker Olmadan) Çalıştırma

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn
- Expo Go mobil uygulaması (iOS / Android cihazda test için)

```bash
# 1. Bağımlılıkları yükleyin (Zustand ve AsyncStorage otomatik kurulur)
npm install

# 2. Expo geliştirme sunucusunu başlatın
npx expo start

# Web tarayıcısında açmak için:
npx expo start --web
```

---

## 🛠️ Kullanılan Teknolojiler ve Kütüphaneler

| Kütüphane / Teknoloji | Açıklama |
| :--- | :--- |
| **React Native (0.86.3) & React (19.2.3)** | Çapraz platform mobil uygulama altyapısı |
| **Expo (SDK 57 - `~57.0.0`)** | Güncel Expo Go istemcisiyle tam uyumlu geliştirme ve derleme ortamı |
| **Zustand (v5) + Persist** | Yerel veritabanı mimarisi, CRUD işlemleri ve otomatik JSON serileştirme |
| **AsyncStorage (2.2.0)** | Cihaz üzerinde kalıcı yerel JSON veritabanı motoru (`@react-native-async-storage/async-storage`) |
| **React Navigation (v7)** | Native Stack ve Bottom Tabs yönlendirme altyapısı |
| **React Native Safe Area Context** | Mobil çentik (Notch / Dynamic Island) ve alt bar güvenli alan yönetimi |
| **Expo ImagePicker & Location** | Kamera/galeri fotoğraf seçimi (Base64 destekli) ve GPS koordinat entegrasyonu |
| **React Native Maps (1.20.1)** | iOS ve Android için yerel interaktif harita ve pin gösterimi |
| **Node Test Runner (`node:test`)** | Sıfır bağımlılıklı hızlı birim testi (Unit Test) altyapısı |
| **Docker & Docker Compose** | LAN destekli konteynerize geliştirme ve dağıtım ortamı |

---

## 📁 Proje Dizin Yapısı

```text
MobileAppDevelopmentProject/
├── Dockerfile                      # Docker imaj yapılandırması
├── docker-compose.yml              # Konteyner port ve volume ayarları
├── package.json                    # Bağımlılıklar ve npm betikleri
├── app.json                        # Expo uygulama yapılandırması
├── index.js                        # Uygulama giriş noktası
├── App.js                          # Ana uygulama, navigasyon, tema ve dil sağlayıcıları
└── src/
    ├── components/
    │   ├── CareSummaryCard.js      # Mahalle bakım özeti ve istatistik kartı bileşeni
    │   ├── ConfirmDeleteModal.js   # Silme işlemi onay modalı
    │   ├── ImageViewerModal.js     # Tam ekran fotoğraf görüntüleyici (Lightbox & Slider)
    │   ├── ToastBanner.js          # Bildirim pop-up bileşeni (Açık/Koyu tema ve çoklu dil uyumlu)
    │   ├── ThemeLanguageBar.js     # Hızlı tema ve dil geçiş çubuğu bileşeni
    │   ├── CatMap.native.js        # Mobil için interaktif harita bileşeni
    │   └── CatMap.web.js           # Web ortamı için harita yedek bileşeni
    ├── i18n/
    │   └── translations.js         # Kapsamlı Türkçe ve İngilizce dil sözlüğü
    ├── screens/
    │   ├── HomeScreen.js           # Ana karşılama, istatistikler ve tema/dil kontrolü
    │   ├── CatListScreen.js        # Kedilerim ekranı (Arama, gruplama, hızlı silme)
    │   ├── CatDetailScreen.js      # Kedi detay sayfası (Albüm, aşılar, etkileşimler, bağ barı)
    │   ├── AddCatScreen.js         # Yeni kedi ekleme ve ilk etkileşim formu
    │   ├── DogListScreen.js        # Köpeklerim ekranı (Arama, gruplama, hızlı silme)
    │   ├── DogDetailScreen.js      # Köpek detay sayfası (Albüm, aşılar, yürüyüş/etkileşimler)
    │   ├── AddDogScreen.js         # Yeni köpek ekleme ve ilk etkileşim formu
    │   └── CatMapScreen.js         # Patili dostların harita üzerindeki konumları
    ├── store/
    │   └── catStore.js             # Yerel JSON veritabanı (Zustand persist + AsyncStorage CRUD)
    ├── theme/
    │   ├── colors.js               # Açık (LightColors) ve Koyu (DarkColors) renk temaları
    │   └── useAppTheme.js          # Birleşik tema, dil ve çeviri kancası (hook)
    ├── utils/
    │   ├── careAnalytics.js        # Bakım istatistikleri ve bağ seviyesi hesaplama modülü
    │   └── imageHelper.js          # Base64, yerel URI ve uzak görsel çözümleyici
└── tests/
    └── careAnalytics.test.js       # Otomatik birim testleri (Unit Tests)
```

---

## 📄 Lisans
Bu proje eğitim ve topluluk amaçlı geliştirilmiş bir açık kaynak projesidir. Patili dostlarımıza sevgiyle! 🐾
