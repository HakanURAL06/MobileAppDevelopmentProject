# Sokak Hayvanları Takip ve Etkileşim Uygulaması (Street Animal Tracker: Cats & Dogs 🐾)

React Native ve Expo kullanılarak geliştirilen; sokak kedileri ve köpeklerinin bakımını, beslenmesini, konumlarını, aşı takvimlerini ve insanlarla kurdukları bağı takip etmeyi sağlayan kapsamlı bir mobil uygulamadır.

---

## 🌟 Öne Çıkan Özellikler

### 1. 🌐 Çoklu Dil Desteği (Türkçe & İngilizce / i18n)
- **Tek Dokunuşla Dil Değiştirme:** Uygulama genelinde Türkçe (🇹🇷 TR) ve İngilizce (🇬🇧 EN) dilleri arasında anında geçiş imkanı.
- **Tüm Arayüzde Bütünleşik Çeviri:** Sekmeler, ekran başlıkları, butonlar, form girişleri, arama çubukları, aşı türleri, oyunlaştırılmış bağ seviyeleri ve Toast bildirimlerinin tamamı dinamik olarak seçilen dile uyum sağlar.
- **Kalıcı Dil Tercihi:** Yapılan dil seçimi AsyncStorage ile kalıcı olarak cihazda saklanır; uygulama tekrar açıldığında son tercih korunur.

### 2. 🌓 Açık ve Koyu Tema (Light / Dark Mode)
- **Özel Renk Paletleri:**
  - **☀️ Açık Tema:** Sıcak fildişi zemin, şeftali/mercan kedi vurguları, kehribar köpek tonları ve yumuşak pastel kartlar.
  - **🌙 Koyu Tema:** Gece kullanımına uygun derin arduvaz/grafit zeminler, yüksek kontrastlı tipografi ve gözü yormayan pastel vurgular.
- **Hızlı Kontrol Barı (ThemeLanguageBar):** Ana sayfa ve ekran başlıkları üzerinde yer alan interaktif butonlarla tema ve dil aynı anda kolayca değiştirilebilir.
- **Kalıcı Tema Tercihi:** Tema tercihi cihaz hafızasında güvenle saklanır.

### 3. 🖼️ Windows ve GitHub Görsel Uyumluluğu (HEIC -> Baseline JPEG Çözümü)
- **Sorun Tespiti:** iPhone modellerinden çekilen bazı fotoğraflar `.jpg` uzantılı olsa da dosya başlığında Apple HEIF/HEVC (`ftypheic`) taşıyordu. macOS ve Safari HEIC'i yerel olarak çözerken; Windows işletim sistemi, GitHub web arayüzü ve Windows üzerindeki Chromium tarayıcılar bu görselleri desteklemediği için fotoğraflar kırık görünüyordu. Ayrıca Türkçe karakter içeren dosya adları (`avcı2`, `floryaaslanı`) Windows dosya sisteminde yol hatalarına yol açıyordu.
- **Kapsamlı Çözüm:**
  - Tüm görseller `sips` motoruyla gerçek standart JPEG (`ffd8 ffe1...`) formatına dönüştürüldü.
  - Dosya adları tamamen temiz ASCII standartlarına (`avci2.jpg`, `floryaaslani1.jpg`) uyarlandı.
  - `src/utils/imageHelper.js` motoru hem Windows ters bölü (`\`) hem Unix düz bölü (`/`) dosya yollarını regex ile ayrıştıracak şekilde güçlendirildi.
  - Zustand store'unda Metro'nun geçici numeric asset id'leri yerine kalıcı string dosya adları saklanarak platformlar arası kusursuz senkronizasyon sağlandı.

### 4. 🐱 Kediler ve 🐶 Köpekler Çift Kategori Yönetimi
- **Ayrı Sekmeler ve Listeler:** Kedilerim ve Köpeklerim için bağımsız listeleme ve yönetim ekranları.
- **Türe Özel Arayüz ve Temalandırma:** Kedi dostlarımız için sıcak şeftali/mercan tonları, köpek dostlarımız için enerji dolu kehribar/amber renk paleti.

### 5. 🔍 Akıllı Arama, Filtreleme ve Gruplama
- **Canlı Arama Çubuğu:** İsim veya bölge/mahalle adına göre harf harf anında arama yapabilme.
- **Dinamik Gruplama Seçenekleri:**
  - 📋 **Tümü:** Sade liste görünümü.
  - 🧬 **Cins / Türüne Göre:** Örneğin Tekir, Calico, Golden vb. altında gruplu görünüm.
  - 📍 **Konum / Bölgeye Göre:** Kocatepe Metrosu, Üniversite Kampüsü vb. bölgelere göre ayrılmış bölümler.

### 6. 📷 Albüm ve Tam Ekran Fotoğraf Görüntüleyici (Lightbox)
- **Çoklu Fotoğraf Desteği:** Her patili dost için sınırsız fotoğraf albümü oluşturabilme ve kapak fotoğrafı belirleme.
- **Tam Ekran Görsel İnceleme:**
  - Kapak fotoğrafına veya albümdeki herhangi bir fotoğrafa dokunulduğunda tam ekran modal açılır.
  - Çoklu görsellerde sağ/sol geçiş okları ve alt şeritte küçük resim önizlemeleri (thumbnails) ile hızlı geçiş.
  - Fotoğraf sayacı (`1 / 3`) ve kapatma butonu.
  - Hem yerel paketlenmiş görselleri hem de cihaz kamerasından/galerisinden eklenen fotoğrafları destekler.

### 7. 💉 Aşı Takibi ve Gelecek Aşı Planlama
- **Tamamlanan Aşılar:** Uygulanan aşı adı (Kuduz, Karma, İç-Dış Parazit vb.), yapılış tarihi, uygulayan veteriner kliniği ve özel notlar.
- **Planlanan / Yaklaşan Aşılar:** Gelecek aşı tarihi ve hatırlatma notuyla aşı planlama.
- **Tek Tıkla Tamamlama:** Planlanan aşı günü geldiğinde tek dokunuşla "Tamamlandı" olarak işaretlenir ve geçmiş aşılar listesine aktarılır.

### 8. 📍 Akıllı Konum ve Eski Konum Geçmişi
- **Özel Bölge İsimlendirme:** GPS koordinatlarının yanında el ile tanınabilir konum adı verebilme (örn: *"Kocatepe Metrosu - Çıkış Merdivenleri"*).
- **GPS Koordinat Entegrasyonu:** `expo-location` ile tek dokunuşla cihazın anlık enlem/boylam bilgilerini alabilme.
- **Konum Değişim Arşivi:** Bir patili dostun konumu güncellendiğinde, eski konumu otomatik olarak tarih damgasıyla *"Eski Konum Geçmişi"* listesine kaydedilir.

### 9. 🎮 Oyunlaştırılmış Bağ & Sadakat Seviyesi (Bond System)
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

### 10. 🥣 Çeşitlendirilmiş Hızlı Etkileşimler
- **Kediler İçin:** Mama Verdim (🥣), Başını/Çenesini Sevdim (😽), Yaş Mama/Ödül Verdim (🥫), Oyun Oynadık (🪶), Taze Su Koydum (💧), Sağlık Kontrolü (🩺).
- **Köpekler İçin:** Mama Verdim (🥣), Yürüyüş Yaptık (🦮), Göbüşünü Kaşıdım (🐕), Topla Oynadık (🎾), Ödül / Kemik Verdim (🦴), Taze Su Koydum (💧), Sağlık Kontrolü (🩺).
- **Yeni Kayıtta Çoklu İlk Etkileşim:** Yeni kedi/köpek eklerken ilk karşılaşma anında yapılan etkileşimleri seçerek kayda başlayabilme.

### 11. 🔔 Estetik Toast Pop-up Bildirimleri
- Kedi/köpek ekleme, silme, aşı kaydetme, dil ve tema değiştirme işlemlerinde ekranın üst kısmından yumuşak geçişle inen ve otomatik kapanan modern Toast banner'ı.

### 12. 💾 Çevrimdışı ve Kalıcı Veri Saklama
- Zustand Store ve `@react-native-async-storage/async-storage` entegrasyonu sayesinde internet bağlantısı olmasa bile tüm veriler, temalar ve dil tercihleri cihazda güvenle saklanır.

---

## 🚀 Docker ile Tek Komutla Çalıştırma

Bilgisayarınıza Node.js veya herhangi bir mobil bağımlılık kurmadan, Docker ile uygulamayı izole bir container içinde anında çalıştırabilirsiniz:

```bash
# Container'ı derle ve başlat
docker compose up --build
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
# 1. Bağımlılıkları yükleyin
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
| **React Native (0.76)** | Çapraz platform mobil uygulama altyapısı |
| **Expo (SDK 52)** | Hızlı geliştirme, derleme ve test ortamı |
| **Zustand (v5)** | Hafif, performanslı ve modüler global state yönetimi |
| **AsyncStorage** | Cihaz üzerinde kalıcı yerel veri saklama (Local Persistence) |
| **React Navigation (v6)** | Native Stack ve Bottom Tabs yönlendirme altyapısı |
| **Expo ImagePicker** | Galeri ve kameradan fotoğraf seçme/çekme |
| **Expo Location** | Cihaz GPS'i üzerinden anlık koordinat alma |
| **Expo Vector Icons (Ionicons)** | Modern ve tutarlı ikon seti |
| **Docker & Docker Compose** | Konteynerize geliştirme ve dağıtım ortamı |

---

## 📁 Proje Dizin Yapısı

```text
MobileAppDevelopmentProject/
├── Dockerfile                      # Docker imaj yapılandırması
├── docker-compose.yml              # Konteyner port ve volume ayarları
├── package.json                    # Bağımlılıklar ve npm betikleri
├── App.js                          # Ana uygulama, navigasyon, tema ve dil sağlayıcıları
├── assets/
│   └── cats/                       # Standart Baseline JPEG formatına dönüştürülmüş kedi görselleri
└── src/
    ├── components/
    │   ├── ImageViewerModal.js     # Tam ekran fotoğraf görüntüleyici (Lightbox & Slider)
    │   ├── ToastBanner.js          # Bildirim pop-up bileşeni (Açık/Koyu tema ve çoklu dil uyumlu)
    │   ├── ThemeLanguageBar.js     # Hızlı tema ve dil geçiş çubuğu bileşeni
    │   ├── CatMap.native.js        # Mobil için interaktif harita bileşeni
    │   └── CatMap.web.js           # Web ortamı için harita yedek bileşeni
    ├── i18n/
    │   └── translations.js         # Kapsamlı Türkçe ve İngilizce dil sözlüğü
    ├── navigation/
    │   ├── RootNavigator.js        # Stack navigasyon tanımları
    │   └── TabNavigator.js         # Alt sekme navigasyon tanımları
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
    │   └── catStore.js             # Zustand store (Kedi & köpek CRUD, aşılar, tema/dil state'i, kalıcılık)
    ├── theme/
    │   ├── colors.js               # Açık (LightColors) ve Koyu (DarkColors) renk temaları
    │   └── useAppTheme.js          # Birleşik tema, dil ve çeviri kancası (hook)
    └── utils/
        └── imageHelper.js          # Platformlar arası (Windows & Mac) güvenli görsel çözümleyici
```

---

## 🐱 Başlangıç Kedi Verileri (Örnek Dostlarımız)

Uygulama ilk açıldığında boş gelmemesi için Zustand store'unda yerleşik olarak gelen kedi dostlarımız:

1. **Avcı (Tekir):** Kocatepe Metrosu'nun sevilen şişman avcısı. Orta düzey bağ seviyesi ve aşı geçmişi.
2. **Habeş (Uzun Tüylü Calico):** Göbüş deyince göbek açan sevimli site sakini. Maksimum seviye bağ ve düzenli aşı kayıtları.
3. **Prenses (Gri-Beyaz):** İstanbul Üniversitesi EK-1 Kantini'nin çanta üstünde uyuyan ağırbaşlı prensesi.
4. **Püskül (Uzun Tüylü Calico):** İstanbul Üniversitesi İktisat Fakültesi'nin gizemli ve temkinli sakini.

---

## 📄 Lisans
Bu proje eğitim ve topluluk amaçlı geliştirilmiş bir açık kaynak projesidir. Patili dostlarımıza sevgiyle! 🐾
