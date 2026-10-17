# Sokak Hayvanları Takip ve Etkileşim Uygulaması (Street Animal Tracker: Cats & Dogs 🐾)

React Native ve Expo kullanılarak geliştirilen; sokak kedileri ve köpeklerinin bakımını, beslenmesini, konumlarını, aşı takvimlerini ve insanlarla kurdukları bağı takip etmeyi sağlayan kapsamlı bir mobil uygulamadır.

---

## 🌟 Öne Çıkan Özellikler

### 1. 🐱 Kediler ve 🐶 Köpekler Çift Kategori Yönetimi
- **Ayrı Sekmeler ve Listeler:** Kedilerim ve Köpeklerim için bağımsız listeleme ve yönetim ekranları.
- **Türe Özel Arayüz ve Temalandırma:** Kedi dostlarımız için sıcak şeftali/mercan tonları, köpek dostlarımız için enerji dolu amber/kehribar renk paleti.

### 2. 🔍 Akıllı Arama, Filtreleme ve Gruplama
- **Canlı Arama Çubuğu:** İsim veya bölge/mahalle adına göre harf harf anında arama yapabilme.
- **Dinamik Gruplama Seçenekleri:**
  - 📋 **Tümü:** Sade liste görünümü.
  - 🧬 **Cins / Türüne Göre:** Örneğin Tekir, Calico, Golden vb. altında gruplu görünüm.
  - 📍 **Konum / Bölgeye Göre:** Kocatepe Metrosu, Üniversite Kampüsü vb. bölgelere göre ayrılmış bölümler.

### 3. 📷 Albüm ve Tam Ekran Fotoğraf Görüntüleyici (Lightbox)
- **Çoklu Fotoğraf Desteği:** Her patili dost için sınırsız fotoğraf albümü oluşturabilme ve kapak fotoğrafı belirleme.
- **Tam Ekran Görsel İnceleme:**
  - Kapak fotoğrafına veya albümdeki herhangi bir fotoğrafa dokunulduğunda tam ekran modal açılır.
  - Çoklu görsellerde sağ/sol geçiş okları ve alt şeritte küçük resim önizlemeleri (thumbnails) ile hızlı geçiş.
  - Fotoğraf sayacı (`1 / 3`) ve kapatma butonu.
  - Hem yerel paketlenmiş görselleri (`require`) hem de cihaz kamerasından/galerisinden eklenen fotoğrafları destekler.

### 4. 💉 Aşı Takibi ve Gelecek Aşı Planlama
- **Tamamlanan Aşılar:** Uygulanan aşı adı (Kuduz, Karma, İç-Dış Parazit vb.), yapılış tarihi, uygulayan veteriner kliniği ve özel notlar.
- **Planlanan / Yaklaşan Aşılar:** Gelecek aşı tarihi ve hatırlatma notuyla aşı planlama.
- **Tek Tıkla Tamamlama:** Planlanan aşı günü geldiğinde tek dokunuşla "Tamamlandı" olarak işaretlenir ve geçmiş aşılar listesine aktarılır.

### 5. 📍 Akıllı Konum ve Eski Konum Geçmişi
- **Özel Bölge İsimlendirme:** GPS koordinatlarının yanında el ile tanınabilir konum adı verebilme (örn: *"Kocatepe Metrosu - Çıkış Merdivenleri"*).
- **GPS Koordinat Entegrasyonu:** `expo-location` ile tek dokunuşla cihazın anlık enlem/boylam bilgilerini alabilme.
- **Konum Değişim Arşivi:** Bir patili dostun konumu güncellendiğinde, eski konumu otomatik olarak tarih damgasıyla *"Eski Konum Geçmişi"* listesine kaydedilir.

### 6. 🎮 Oyunlaştırılmış Bağ & Sadakat Seviyesi (Bond System)
Yapılan her sevgi dolu etkileşim aranızdaki bağı güçlendirir ve seviye atlatır:
- **Kedi Bağ Seviyeleri:**
  1. 🌱 *Yabancı* (0 - 1 etkileşim)
  2. 👀 *Meraklı Bakış* (2 - 4 etkileşim)
  3. 🐾 *Temkinli Dost* (5 - 8 etkileşim)
  4. 💖 *Güvenen Patili* (9 - 13 etkileşim)
  5. 👑 *Mırıldayan Sırdaş* (14+ etkileşim)
- **Köpek Bağ Seviyeleri:**
  1. 🌿 *Çekingen Gözlemci* (0 - 1 etkileşim)
  2. 🐕 *Kuyruk Sallayan* (2 - 4 etkileşim)
  3. 🎾 *Sadık Arkadaş* (5 - 8 etkileşim)
  4. 🌟 *En İyi Dost* (9 - 13 etkileşim)
  5. 🏆 *Can Yoldaşı* (14+ etkileşim)

### 7. 🥣 Çeşitlendirilmiş Hızlı Etkileşimler
- **Kediler İçin:** Mama Verdim (🥣), Başını/Çenesini Sevdim (😽), Yaş Mama/Ödül Verdim (🥫), Oyun Oynadık (🪶), Taze Su Koydum (💧), Sağlık Kontrolü (🩺).
- **Köpekler İçin:** Mama Verdim (🥣), Yürüyüş Yaptık (🦮), Göbüşünü Kaşıdım (🐕), Topla Oynadık (🎾), Ödül / Kemik Verdim (🦴), Taze Su Koydum (💧), Sağlık Kontrolü (🩺).
- **Yeni Kayıtta Çoklu İlk Etkileşim:** Yeni kedi/köpek eklerken ilk karşılaşma anında yapılan etkileşimleri seçerek kayda başlayabilme.

### 8. 🔔 Estetik Toast Pop-up Bildirimleri
- Kedi/köpek ekleme, silme, aşı kaydetme ve not güncelleme işlemlerinde ekranın üst kısmından yumuşak geçişle inen ve otomatik kapanan modern Toast banner'ı.

### 9. 💾 Çevrimdışı ve Kalıcı Veri Saklama
- Zustand Store ve `@react-native-async-storage/async-storage` entegrasyonu sayesinde internet bağlantısı olmasa bile tüm veriler cihazda güvenle saklanır.

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
├── App.js                          # Ana uygulama, BottomTabs, Stack Navigator ve ToastBanner
├── assets/
│   └── cats/                       # Başlangıç ve albüm görselleri (avci, habes, prenses, puskul...)
└── src/
    ├── components/
    │   ├── ImageViewerModal.js     # Tam ekran fotoğraf görüntüleyici (Lightbox & Slider)
    │   ├── ToastBanner.js          # Bildirim pop-up bileşeni
    │   ├── CatMap.native.js        # Mobil için interaktif harita bileşeni
    │   └── CatMap.web.js           # Web ortamı için harita yedek bileşeni
    ├── navigation/
    │   ├── RootNavigator.js        # Stack navigasyon tanımları
    │   └── TabNavigator.js         # Alt sekme navigasyon tanımları
    ├── screens/
    │   ├── HomeScreen.js           # Ana karşılama ve istatistik ekranı
    │   ├── CatListScreen.js        # Kedilerim ekranı (Arama, gruplama, hızlı silme)
    │   ├── CatDetailScreen.js      # Kedi detay sayfası (Albüm, aşılar, etkileşimler, bağ barı)
    │   ├── AddCatScreen.js         # Yeni kedi ekleme ve ilk etkileşim formu
    │   ├── DogListScreen.js        # Köpeklerim ekranı (Arama, gruplama, hızlı silme)
    │   ├── DogDetailScreen.js      # Köpek detay sayfası (Albüm, aşılar, yürüyüş/etkileşimler)
    │   ├── AddDogScreen.js         # Yeni köpek ekleme ve ilk etkileşim formu
    │   └── CatMapScreen.js         # Patili dostların harita üzerindeki konumları
    ├── store/
    │   └── catStore.js             # Zustand store (Kedi & köpek CRUD, aşılar, konum geçmişi, kalıcılık)
    ├── theme/
    │   └── colors.js               # Ortak pastel renk paleti ve tema sabitleri
    └── utils/
        └── imageHelper.js          # require() assetleri ile remote URI'leri bağdaştıran yardımcı fonksiyon
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