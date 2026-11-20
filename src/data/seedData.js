/**
 * Başlangıç Verileri (Seed / Dummy Data) - Gerçek Sokak Dostları
 * 
 * Uygulama ilk kez açıldığında (AsyncStorage boşken) bu 6 gerçek sokak dostu
 * ve yerel paketlenmiş fotoğrafları otomatik olarak yüklenir.
 */

export const INITIAL_SEED_CATS = [
  // 1. Habeş
  {
    id: 'seed-cat-habes',
    name: 'Habeş',
    breed: 'Calico',
    photoUri: require('../../assets/animals/habes1.jpg'),
    photos: [
      require('../../assets/animals/habes1.jpg'),
      require('../../assets/animals/habes2.jpg'),
    ],
    location: {
      regionName: 'Forum İstanbul',
      latitude: 41.046031,
      longitude: 28.894292,
    },
    locationHistory: [
      {
        id: 'loc-habes-1',
        regionName: 'Forum İstanbul Açık Meydan',
        latitude: 41.046100,
        longitude: 28.894350,
        changedAt: '2026-10-10T11:00:00.000Z',
      },
    ],
    vaccinations: [
      {
        id: 'vac-habes-1',
        name: 'Kuduz Aşısı',
        date: '2026-09-15',
        clinic: 'Bayrampaşa Veteriner Kliniği',
        notes: 'Yıllık rutin kuduz aşısı yapıldı, sağlık durumu iyi.',
      },
      {
        id: 'vac-habes-2',
        name: 'İç-Dış Parazit',
        date: '2026-10-22',
        clinic: 'Pati Sağlık Merkezi',
        notes: 'Damlaları uygulandı, parazit kontrolü temiz.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-habes-1',
        name: 'Karma Aşı Rapeli',
        plannedDate: '2026-12-15',
        notes: 'Yıllık tekrar dozu yapılacak.',
      },
    ],
    notes: 'İsmine duyarlı, değişik bir miyavlaması var, sürekli farklı bir yerde uyuyor, Tipsiz ile kardeş.',
    interactionHistory: [
      {
        id: 'int-habes-1',
        date: '2026-11-18T09:30:00.000Z',
        type: 'feeding',
        note: 'Forum İstanbul yemek alanı arkasında somonlu yaş mama verildi 🥣',
      },
      {
        id: 'int-habes-2',
        date: '2026-11-18T14:15:00.000Z',
        type: 'petting',
        note: 'İsmiyle seslenildiğinde geldi, kendini sevdirdi ve mırıldadı ✨',
      },
      {
        id: 'int-habes-3',
        date: '2026-11-19T11:00:00.000Z',
        type: 'water',
        note: 'Temiz ve taze su kabı dolduruldu 💧',
      },
      {
        id: 'int-habes-4',
        date: '2026-11-19T16:45:00.000Z',
        type: 'playing',
        note: 'İple keyifle oyun oynandı 🧶',
      },
    ],
    createdAt: '2026-09-01T08:00:00.000Z',
  },

  // 2. Tipsiz
  {
    id: 'seed-cat-tipsiz',
    name: 'Tipsiz',
    breed: 'Calico',
    photoUri: require('../../assets/animals/tipsiz1.jpg'),
    photos: [
      require('../../assets/animals/tipsiz1.jpg'),
      require('../../assets/animals/tipsiz2.jpg'),
    ],
    location: {
      regionName: 'Forum İstanbul',
      latitude: 41.046031,
      longitude: 28.894292,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-tipsiz-1',
        name: 'Kuduz Aşısı',
        date: '2026-09-15',
        clinic: 'Bayrampaşa Veteriner Kliniği',
        notes: 'Kardeşi Habeş ile birlikte aşısı yapıldı.',
      },
      {
        id: 'vac-tipsiz-2',
        name: 'İç-Dış Parazit',
        date: '2026-10-22',
        clinic: 'Pati Sağlık Merkezi',
        notes: 'Parazit damlası uygulandı.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-tipsiz-1',
        name: 'Karma Aşı',
        plannedDate: '2026-12-15',
        notes: 'Planlı kontrol ve aşı randevusu.',
      },
    ],
    notes: 'Habeş ile kardeş, insanlara çok zor alışıyor, tüyleri çok temiz.',
    interactionHistory: [
      {
        id: 'int-tipsiz-1',
        date: '2026-11-18T10:00:00.000Z',
        type: 'feeding',
        note: 'Uzaktan taze mama bırakıldı, güvenli mesafeden yedi 🥣',
      },
      {
        id: 'int-tipsiz-2',
        date: '2026-11-19T11:15:00.000Z',
        type: 'water',
        note: 'Taze su yenilendi 💧',
      },
      {
        id: 'int-tipsiz-3',
        date: '2026-11-19T15:30:00.000Z',
        type: 'other',
        note: 'Tüyleri ve genel sağlık durumu gözlemlendi, çok bakımlı ve temiz 🩺',
      },
    ],
    createdAt: '2026-09-01T08:00:00.000Z',
  },

  // 3. Avcı
  {
    id: 'seed-cat-avci',
    name: 'Avcı',
    breed: 'Tekir',
    photoUri: require('../../assets/animals/avci1.jpg'),
    photos: [
      require('../../assets/animals/avci1.jpg'),
      require('../../assets/animals/avci2.jpg'),
    ],
    location: {
      regionName: 'Kocatepe Metro Durağı',
      latitude: 41.048417,
      longitude: 28.895278,
    },
    locationHistory: [
      {
        id: 'loc-avci-1',
        regionName: 'Metro Turnikeler Yanı',
        latitude: 41.048500,
        longitude: 28.895300,
        changedAt: '2026-10-01T09:00:00.000Z',
      },
    ],
    vaccinations: [
      {
        id: 'vac-avci-1',
        name: 'Kuduz Aşısı',
        date: '2026-08-10',
        clinic: 'Metro Çevresi Belediye Kliniği',
        notes: 'Kayıtlı metro kedisi yıllık aşısı yapıldı.',
      },
      {
        id: 'vac-avci-2',
        name: 'İç-Dış Parazit',
        date: '2026-10-18',
        clinic: 'Kocatepe Veteriner',
        notes: 'Rutin parazit damlası yapıldı.',
      },
      {
        id: 'vac-avci-3',
        name: 'Karma Aşı (2. Doz)',
        date: '2026-05-20',
        clinic: 'Kocatepe Veteriner',
        notes: 'Tamamlandı.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-avci-1',
        name: 'Kilo & Sağlık Kontrolü',
        plannedDate: '2026-12-05',
        notes: 'Diyet mama takibi ve genel kontrol.',
      },
    ],
    notes: 'Fare avlamayı seviyor, aşırı obez, yıllardır metroda yaşıyor.',
    interactionHistory: [
      {
        id: 'int-avci-1',
        date: '2026-11-17T08:30:00.000Z',
        type: 'feeding',
        note: 'Metro çıkışında hafif kuru mama verildi 🥣',
      },
      {
        id: 'int-avci-2',
        date: '2026-11-18T17:00:00.000Z',
        type: 'petting',
        note: 'Turnikelerin yanında tombiş göbeğini sevdirdi 🐾',
      },
      {
        id: 'int-avci-3',
        date: '2026-11-19T09:00:00.000Z',
        type: 'other',
        note: 'Metro peronunda fare kovalarken görüldü, avcılık yeteneği harika 🐭',
      },
      {
        id: 'int-avci-4',
        date: '2026-11-19T18:00:00.000Z',
        type: 'water',
        note: 'Kocatepe metro su kabı dolduruldu 💧',
      },
      {
        id: 'int-avci-5',
        date: '2026-11-20T08:45:00.000Z',
        type: 'petting',
        note: 'Sabah metrosunda yolcuların bacaklarına sürtündü ✨',
      },
    ],
    createdAt: '2026-08-01T08:00:00.000Z',
  },

  // 4. Püskül
  {
    id: 'seed-cat-puskul',
    name: 'Püskül',
    breed: 'Calico',
    photoUri: require('../../assets/animals/puskul1.jpg'),
    photos: [
      require('../../assets/animals/puskul1.jpg'),
      require('../../assets/animals/puskul2.jpg'),
    ],
    location: {
      regionName: 'İstanbul Üniversitesi',
      latitude: 41.014208,
      longitude: 28.963945,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-puskul-1',
        name: 'Kuduz Aşısı',
        date: '2026-07-14',
        clinic: 'Beyazıt Kampüs Veterinerliği',
        notes: 'Kampüs hekimliğinde aşılandı.',
      },
      {
        id: 'vac-puskul-2',
        name: 'İç-Dış Parazit',
        date: '2026-10-05',
        clinic: 'Fatih Hayvan Sağlık Merkezi',
        notes: 'Parazit kürü uygulandı.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-puskul-1',
        name: 'Yıllık Aşı Kontrolü',
        plannedDate: '2026-12-20',
        notes: 'Kampüs aşı takip takvimi randevusu.',
      },
    ],
    notes: 'Kendisini hiç sevdirmiyor, aşırı gizemli takılıyor.',
    interactionHistory: [
      {
        id: 'int-puskul-1',
        date: '2026-11-17T12:00:00.000Z',
        type: 'feeding',
        note: 'Kütüphane bahçesinde sakin bir köşeye mama bırakıldı 🥣',
      },
      {
        id: 'int-puskul-2',
        date: '2026-11-18T13:30:00.000Z',
        type: 'water',
        note: 'Tarihi kapı girişindeki su kabı tazelendi 💧',
      },
      {
        id: 'int-puskul-3',
        date: '2026-11-19T14:00:00.000Z',
        type: 'other',
        note: 'Gizemli şekilde ulu çınar ağacının altından kampüsü izlerken görüldü 🌿',
      },
    ],
    createdAt: '2026-07-01T08:00:00.000Z',
  },

  // 5. Prenses
  {
    id: 'seed-cat-prenses',
    name: 'Prenses',
    breed: 'Gri Tekir',
    photoUri: require('../../assets/animals/prenses1.jpg'),
    photos: [
      require('../../assets/animals/prenses1.jpg'),
    ],
    location: {
      regionName: 'İstanbul Üniversitesi',
      latitude: 41.013417,
      longitude: 28.962139,
    },
    locationHistory: [
      {
        id: 'loc-prenses-1',
        regionName: 'İ.Ü. Edebiyat Fakültesi Bahçesi',
        latitude: 41.013500,
        longitude: 28.962200,
        changedAt: '2026-10-12T10:00:00.000Z',
      },
    ],
    vaccinations: [
      {
        id: 'vac-prenses-1',
        name: 'Kuduz Aşısı',
        date: '2026-08-25',
        clinic: 'Beyazıt Veteriner Kliniği',
        notes: 'Aşısı tam ve sağlıklı.',
      },
      {
        id: 'vac-prenses-2',
        name: 'Karma Aşı (1. Doz)',
        date: '2026-09-30',
        clinic: 'Beyazıt Veteriner Kliniği',
        notes: 'Tamamlandı.',
      },
      {
        id: 'vac-prenses-3',
        name: 'İç-Dış Parazit',
        date: '2026-11-02',
        clinic: 'Pati Evi',
        notes: 'Rutin damla yapıldı.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-prenses-1',
        name: 'Parazit Tekrarı',
        plannedDate: '2026-12-10',
        notes: 'Kış dönemi parazit kontrolü.',
      },
    ],
    notes: 'Aşırı ilgi bağımlısı, her zaman aç, çanta üstünde uyumayı çok seviyor.',
    interactionHistory: [
      {
        id: 'int-prenses-1',
        date: '2026-11-18T11:20:00.000Z',
        type: 'feeding',
        note: 'Öğrenci kulübü önünde yaş mama verildi, afiyetle yedi 🥣',
      },
      {
        id: 'int-prenses-2',
        date: '2026-11-18T14:40:00.000Z',
        type: 'petting',
        note: 'Kucağa zıpladı, çanta üstüne kıvrılıp mırıldayarak uyudu ✨',
      },
      {
        id: 'int-prenses-3',
        date: '2026-11-19T10:30:00.000Z',
        type: 'playing',
        note: 'Kalem kapağı ve iple neşeyle oynadı 🧶',
      },
      {
        id: 'int-prenses-4',
        date: '2026-11-19T16:15:00.000Z',
        type: 'petting',
        note: 'Boynu ve başı sevildi, aşırı sevecen ve cana yakın 💖',
      },
      {
        id: 'int-prenses-5',
        date: '2026-11-20T09:10:00.000Z',
        type: 'feeding',
        note: 'Ödül maması ikram edildi 🥫',
      },
    ],
    createdAt: '2026-08-15T08:00:00.000Z',
  },
];

export const INITIAL_SEED_DOGS = [
  // 6. Pancarlar
  {
    id: 'seed-dog-pancarlar',
    name: 'Pancarlar',
    breed: 'Sokak Köpeği',
    photoUri: require('../../assets/animals/pancarlar1.jpg'),
    photos: [
      require('../../assets/animals/pancarlar1.jpg'),
    ],
    location: {
      regionName: 'Forum İstanbul',
      latitude: 41.045821,
      longitude: 28.894476,
    },
    locationHistory: [
      {
        id: 'loc-pancarlar-1',
        regionName: 'Forum İstanbul Yeşil Alan',
        latitude: 41.045900,
        longitude: 28.894500,
        changedAt: '2026-09-20T10:00:00.000Z',
      },
    ],
    vaccinations: [
      {
        id: 'vac-pancarlar-1',
        name: 'Kuduz Aşısı',
        date: '2026-06-12',
        clinic: 'Bayrampaşa Belediyesi Hayvan Bakımevi',
        notes: 'Kayıtlı mahalle köpekleri yıllık aşısı yapıldı.',
      },
      {
        id: 'vac-pancarlar-2',
        name: 'Karma Aşı (DHPPi)',
        date: '2026-07-20',
        clinic: 'Bayrampaşa Belediyesi',
        notes: 'Rutin karma aşısı tamamlandı.',
      },
      {
        id: 'vac-pancarlar-3',
        name: 'İç-Dış Parazit',
        date: '2026-10-15',
        clinic: 'Gezici Veteriner Aracı',
        notes: 'Rutin koruyucu tedavi uygulandı.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-pancarlar-1',
        name: 'Yıllık Kuduz Tekrarı',
        plannedDate: '2026-12-15',
        notes: 'Bayrampaşa Belediyesi aşı randevusu.',
      },
    ],
    notes: 'Pancar isminde 2 kardeş köpek, yıllardır beraber dolanıyorlar, uyumayı seviyorlar.',
    interactionHistory: [
      {
        id: 'int-pancarlar-1',
        date: '2026-11-17T10:00:00.000Z',
        type: 'feeding',
        note: 'Forum İstanbul açık otopark kenarında kuru mama ve temiz su verildi 🥣',
      },
      {
        id: 'int-pancarlar-2',
        date: '2026-11-18T15:30:00.000Z',
        type: 'walking',
        note: 'Birlikte açık alanda neşeyle yürüyüş yapıldı 🦮',
      },
      {
        id: 'int-pancarlar-3',
        date: '2026-11-19T12:00:00.000Z',
        type: 'petting',
        note: 'Güneşte uzanırken iki kardeşin de başları okşandı, kuyruk salladılar 🐕',
      },
      {
        id: 'int-pancarlar-4',
        date: '2026-11-19T17:30:00.000Z',
        type: 'other',
        note: 'Çimlerin üzerinde birbirine sokulup uyurken görüldüler 💤',
      },
      {
        id: 'int-pancarlar-5',
        date: '2026-11-20T09:30:00.000Z',
        type: 'water',
        note: 'Büyük su kapları taze suyla dolduruldu 💧',
      },
    ],
    createdAt: '2026-06-01T08:00:00.000Z',
  },
];

export const INITIAL_SEED_VETS = [
  // 1. Forum İstanbul Sorumlu Veteriner Hekimi
  {
    id: 'vet-forum-istanbul',
    name: 'Uzm. Vet. Selin Acar',
    title: 'Cerrahi & Dahiliye Uzmanı',
    clinicName: 'Forum Pati & Yaşam Kliniği',
    regionName: 'Forum İstanbul',
    address: 'Forum İstanbul AVM Yanı No: 12, Bayrampaşa / İstanbul',
    phone: '0212 555 43 21',
    emergencyPhone: '0532 555 43 21',
    workingHours: '09:00 - 19:30 (Haftanın 7 Günü)',
    avatarEmoji: '👩‍⚕️',
    photoUri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
    notes: 'Forum İstanbul ve çevresinde yaşayan Habeş, Tipsiz ve Pancarlar\'ın düzenli beslenme takipleri, aşı programları ve rutin sağlık kontrollerinden sorumludur. Bayrampaşa Belediyesi ve mahalle gönüllüleriyle koordineli çalışmaktadır.',
    latitude: 41.046031,
    longitude: 28.894292,
    assignedAnimalIds: ['seed-cat-habes', 'seed-cat-tipsiz', 'seed-dog-pancarlar'],
    services: ['Kuduz & Karma Aşı', 'İç-Dış Parazit', 'Mikroçip & Pasaport', 'Acil Tedavi'],
    completedCareCount: 14,
    createdAt: '2026-09-01T08:00:00.000Z',
  },

  // 2. Kocatepe Metro Durağı Sorumlu Veteriner Hekimi
  {
    id: 'vet-kocatepe-metro',
    name: 'Vet. Hekim Barış Demir',
    title: 'Sokak Hayvanları Hekimi & Beslenme Uzmanı',
    clinicName: 'Kocatepe Metro Veteriner İstasyonu',
    regionName: 'Kocatepe Metro Durağı',
    address: 'Kocatepe Metro İstasyonu Doğu Çıkışı No: 4, Bayrampaşa / İstanbul',
    phone: '0212 555 12 34',
    emergencyPhone: '0533 555 12 34',
    workingHours: '08:30 - 20:00 (Hafta İçi & Cmt)',
    avatarEmoji: '👨‍⚕️',
    photoUri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
    notes: 'Metro çevresinin efsanevi obez kedisi Avcı\'nın diyet mama programını, rutin kilo kontrolünü, yıllık aşılarını ve metro peronundaki sağlık güvenliğini takip etmektedir.',
    latitude: 41.048417,
    longitude: 28.895278,
    assignedAnimalIds: ['seed-cat-avci'],
    services: ['Kilo & Diyet Takibi', 'Aşı Takvimi', 'Parazit Tedavisi', 'Rutin Muayene'],
    completedCareCount: 9,
    createdAt: '2026-08-01T08:00:00.000Z',
  },

  // 3. İstanbul Üniversitesi Kampüs Sorumlu Veteriner Hekimi
  {
    id: 'vet-istanbul-universitesi',
    name: 'Doç. Dr. Emre Yıldız',
    title: 'Kampüs Hayvan Sağlığı Koordinatörü',
    clinicName: 'Beyazıt Kampüs Hayvan Sağlığı Birimi',
    regionName: 'İstanbul Üniversitesi',
    address: 'İ.Ü. Beyazıt Ana Kampüsü Rektörlük Bahçesi, Fatih / İstanbul',
    phone: '0212 555 78 90',
    emergencyPhone: '0535 555 78 90',
    workingHours: '09:00 - 18:00 (Öğrenci & Gönüllü Destekli)',
    avatarEmoji: '👨‍⚕️',
    photoUri: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
    notes: 'Tarihi Beyazıt kampüsünde yaşayan Püskül ve Prenses\'in aşı takvimleri, kış dönemi beslenme ihtiyaçlarını ve kampüs içi sağlık takiplerini öğrenci kulüpleriyle birlikte koordine eder.',
    latitude: 41.013800,
    longitude: 28.963000,
    assignedAnimalIds: ['seed-cat-puskul', 'seed-cat-prenses'],
    services: ['Kampüs Aşı Programı', 'Kışlık Bakım & Besleme', 'Acil Tedavi', 'Gönüllü Eğitimi'],
    completedCareCount: 12,
    createdAt: '2026-07-01T08:00:00.000Z',
  },
];

