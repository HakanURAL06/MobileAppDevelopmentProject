# Sokak Kedisi Takip ve Etkileşim Uygulaması (Street Cat Tracker) 🐾

React Native ve Expo kullanılarak geliştirilen sokak kedisi takip ve etkileşim mobil uygulaması.

---

## 🚀 Docker ile Tek Komutla Çalıştırma

Projeyi bilgisayarınıza hiçbir paket (Node.js/npm bağımlılıkları vb.) manuel kurmadan Docker ile anında çalıştırabilirsiniz:

```bash
# Container'ı derle ve başlat
docker compose up --build
```

Sunucu başladığında:
- **Web Çıktısı:** Tarayıcınızdan [`http://localhost:8081`](http://localhost:8081) adresine giderek uygulamayı bilgisayarınızda anında test edebilirsiniz.
- **Canlı Yenileme (Hot-Reloading):** `src/` altındaki kodları değiştirdiğiniz anda tarayıcıda otomatik olarak güncellenir.

Durdurmak için:
```bash
docker compose down
```

---

## 📱 Yerel Olarak (Docker Olmadan) Çalıştırma

```bash
npm install
npx expo start
```

---

## 📁 Proje Yapısı

```text
├── Dockerfile               # Docker imaj yapılandırması
├── docker-compose.yml       # Tek komutla ayağa kaldırma & port/volume ayarları
├── App.js                   # Ana uygulama ve NavigationContainer
└── src/
    ├── navigation/
    │   ├── RootNavigator.js # Stack Navigator (Tabs + CatDetail)
    │   └── TabNavigator.js  # Bottom Tab (Home + AddCat)
    └── screens/
        ├── HomeScreen.js    # Kedilerin listelendiği ana ekran
        ├── AddCatScreen.js  # Kedi ekleme ve etkileşim ekranı
        └── CatDetailScreen.js # Kedi profili ve detay ekranı
```