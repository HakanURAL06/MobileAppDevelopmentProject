/**
 * Başlangıç Verileri (Seed / Dummy Data)
 * 
 * Hoca veya yeni bir kullanıcı uygulamayı cihazında ilk kez açtığında
 * arayüzün boş görünmemesi için İstanbul'un farklı semtlerinden
 * gerçekçi kedi ve köpek profilleri, aşı kayıtları ve bakım geçmişi sağlar.
 */

export const INITIAL_SEED_CATS = [
  {
    id: 'seed-cat-1',
    name: 'Kadife',
    breed: 'Calico',
    photoUri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Kadıköy Moda Parkı',
      latitude: 40.9845,
      longitude: 29.0289,
    },
    locationHistory: [
      {
        id: 'loc-hist-cat1-1',
        regionName: 'Moda Sahil Çay Bahçesi',
        latitude: 40.9822,
        longitude: 29.0255,
        changedAt: '2026-10-15T10:00:00.000Z',
      }
    ],
    vaccinations: [
      {
        id: 'vac-cat1-1',
        name: 'Kuduz Aşısı',
        date: '2026-09-12',
        clinic: 'Moda Veteriner Kliniği',
        notes: 'Yıllık rutin kuduz aşısı yapıldı.',
      },
      {
        id: 'vac-cat1-2',
        name: 'İç-Dış Parazit',
        date: '2026-10-20',
        clinic: 'Kadıköy Pati Polikliniği',
        notes: 'Damlalar uygulandı, parazit taraması temiz.',
      }
    ],
    scheduledVaccines: [
      {
        id: 'sch-cat1-1',
        name: 'Karma Aşı Rapeli',
        plannedDate: '2026-12-10',
        notes: 'İkinci doz karma aşı randevusu.',
      }
    ],
    notes: 'Moda iskelesine yakın bankların altında dinlenmeyi çok seviyor. Kuru mamaya bayılır, insan canlısıdır.',
    interactionHistory: [
      {
        id: 'int-cat1-1',
        date: '2026-11-15T09:30:00.000Z',
        type: 'feeding',
        note: 'Sabah kahvaltısı için somonlu kuru mama verildi 🥣',
      },
      {
        id: 'int-cat1-2',
        date: '2026-11-16T14:15:00.000Z',
        type: 'petting',
        note: 'Güneşlenirken başı ve çenesi okşandı, bol bol mırıldadı ✨',
      },
      {
        id: 'int-cat1-3',
        date: '2026-11-17T11:00:00.000Z',
        type: 'water',
        note: 'Moda parkı su kabı taze suyla dolduruldu 💧',
      }
    ],
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'seed-cat-2',
    name: 'Tarçın',
    breed: 'Sarman',
    photoUri: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Beşiktaş Çarşı',
      latitude: 41.0428,
      longitude: 29.0077,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-cat2-1',
        name: 'Karma Aşı (1. Doz)',
        date: '2026-10-05',
        clinic: 'Beşiktaş Belediyesi Hayvan Barınağı',
        notes: 'İlk doz tamamlandı.',
      }
    ],
    scheduledVaccines: [
      {
        id: 'sch-cat2-1',
        name: 'Kuduz Aşısı',
        plannedDate: '2026-11-28',
        notes: 'Beşiktaş veterinerlik işleri randevusu.',
      }
    ],
    notes: 'Çarşı esnafının maskotu. Çok hareketli ve oyuncu.',
    interactionHistory: [
      {
        id: 'int-cat2-1',
        date: '2026-11-16T16:00:00.000Z',
        type: 'playing',
        note: 'İp ve peluş topla oyun oynandı 🧶',
      },
      {
        id: 'int-cat2-2',
        date: '2026-11-17T12:30:00.000Z',
        type: 'feeding',
        note: 'Öğle saatinde yaş mama ikram edildi 🥫',
      }
    ],
    createdAt: '2026-10-01T09:00:00.000Z',
  },
  {
    id: 'seed-cat-3',
    name: 'Pusat',
    breed: 'Tekir',
    photoUri: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Üsküdar Kuzguncuk Bostanı',
      latitude: 41.0360,
      longitude: 29.0298,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-cat3-1',
        name: 'İç-Dış Parazit',
        date: '2026-10-18',
        clinic: 'Kuzguncuk Veteriner Evi',
        notes: 'Rutin mevsimsel parazit uygulaması.',
      }
    ],
    scheduledVaccines: [],
    notes: 'Kuzguncuk bostanında ağaç dallarında tırmanmayı sever. Karakteri biraz temkinli.',
    interactionHistory: [
      {
        id: 'int-cat3-1',
        date: '2026-11-14T15:00:00.000Z',
        type: 'health',
        note: 'Sol patisindeki hafif çizik kontrol edildi, temizlendi 🩺',
      },
      {
        id: 'int-cat3-2',
        date: '2026-11-17T09:00:00.000Z',
        type: 'feeding',
        note: 'Tavuklu kuru mama bırakıldı 🥣',
      }
    ],
    createdAt: '2026-10-10T11:00:00.000Z',
  },
  {
    id: 'seed-cat-4',
    name: 'Fıstık',
    breed: 'Yavru / Melez',
    photoUri: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Cihangir Sanatkarlar Parkı',
      latitude: 41.0315,
      longitude: 28.9839,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-cat4-1',
        name: 'Genel Sağlık & Vitamin',
        date: '2026-11-02',
        clinic: 'Cihangir Pet Klinik',
        notes: 'Yavru gelişim kontrolleri yapıldı, kilo alımı gayet iyi.',
      }
    ],
    scheduledVaccines: [
      {
        id: 'sch-cat4-1',
        name: 'Karma Aşı (1. Doz)',
        plannedDate: '2026-11-25',
        notes: '2. ayı dolunca yapılacak ilk aşı.',
      }
    ],
    notes: 'Parkın sevimli yavrusu. Özel ilgiye ve kaliteli yavru kedi mamasına ihtiyaç duyuyor.',
    interactionHistory: [
      {
        id: 'int-cat4-1',
        date: '2026-11-16T10:00:00.000Z',
        type: 'feeding',
        note: 'Yavru kedi süt tozu ve püre mama verildi 🥫',
      },
      {
        id: 'int-cat4-2',
        date: '2026-11-16T17:30:00.000Z',
        type: 'petting',
        note: 'Kucakta sakinleştirildi ve sevildi 🐾',
      }
    ],
    createdAt: '2026-11-01T14:00:00.000Z',
  },
  {
    id: 'seed-cat-5',
    name: 'Zeytin',
    breed: 'Bombay / Siyah',
    photoUri: 'https://images.unsplash.com/photo-1503777119540-ce54b422baff?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1503777119540-ce54b422baff?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Karaköy Rıhtım',
      latitude: 41.0238,
      longitude: 28.9778,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-cat5-1',
        name: 'Kuduz Aşısı',
        date: '2026-08-20',
        clinic: 'Beyoğlu Belediyesi Veterinerlik',
        notes: 'Kısırlaştırma operasyonu sonrası kuduz aşısı tamamlandı.',
      }
    ],
    scheduledVaccines: [],
    notes: 'Rıhtım boyunca gezinir, balıkçıların yanında bekler. Gözleri parlak sarıdır.',
    interactionHistory: [
      {
        id: 'int-cat5-1',
        date: '2026-11-17T15:45:00.000Z',
        type: 'feeding',
        note: 'Balık aromalı mama verildi 🥣',
      }
    ],
    createdAt: '2026-08-15T12:00:00.000Z',
  }
];

export const INITIAL_SEED_DOGS = [
  {
    id: 'seed-dog-1',
    name: 'Karabaş',
    breed: 'Kangal / Anadolu Çoban Melezi',
    photoUri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Kadıköy Yoğurtçu Parkı',
      latitude: 40.9858,
      longitude: 29.0345,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-dog1-1',
        name: 'Kuduz & Karma Aşısı',
        date: '2026-09-10',
        clinic: 'Kadıköy Hayvan Hastanesi',
        notes: 'Yıllık koruyucu aşıları yapıldı.',
      },
      {
        id: 'vac-dog1-2',
        name: 'İç-Dış Parazit',
        date: '2026-10-15',
        clinic: 'Kadıköy Hayvan Hastanesi',
        notes: 'Hap ve ense damlası verildi.',
      }
    ],
    scheduledVaccines: [
      {
        id: 'sch-dog1-1',
        name: 'Bronşin (Boğmaca) Aşısı',
        plannedDate: '2026-12-05',
        notes: 'Kış öncesi solunum yolu koruyucu aşısı.',
      }
    ],
    notes: 'Parkın uysal devi. Çocuklara ve diğer köpeklere karşı çok sakin ve koruyucudur.',
    interactionHistory: [
      {
        id: 'int-dog1-1',
        date: '2026-11-15T17:00:00.000Z',
        type: 'walking',
        note: 'Yoğurtçu parkı çevresinde 30 dakika yürüyüş yapıldı 🦮',
      },
      {
        id: 'int-dog1-2',
        date: '2026-11-16T11:00:00.000Z',
        type: 'feeding',
        note: 'Büyük ırk kuru mama ve temiz su verildi 🥣',
      },
      {
        id: 'int-dog1-3',
        date: '2026-11-17T16:30:00.000Z',
        type: 'petting',
        note: 'Göbüşü kaşındı, kuyruk sallayarak teşekkür etti 🐕',
      }
    ],
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'seed-dog-2',
    name: 'Boncuk',
    breed: 'Golden Retriever Melezi',
    photoUri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Beşiktaş Abbasağa Parkı',
      latitude: 41.0490,
      longitude: 29.0060,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-dog2-1',
        name: 'Karma Aşı',
        date: '2026-10-01',
        clinic: 'Beşiktaş Hayvan Kliniği',
        notes: 'Rutin aşısı tamamlandı.',
      }
    ],
    scheduledVaccines: [],
    notes: 'Top oynamaya bayılır. Getir-götür oyunlarında çok başarılı ve enerjiktir.',
    interactionHistory: [
      {
        id: 'int-dog2-1',
        date: '2026-11-16T14:00:00.000Z',
        type: 'fetch',
        note: 'Parkta tenis topuyla keyifle oynandı 🎾',
      },
      {
        id: 'int-dog2-2',
        date: '2026-11-17T10:15:00.000Z',
        type: 'feeding',
        note: 'Besleyici mama ve kemik ödülü verildi 🦴',
      }
    ],
    createdAt: '2026-09-15T09:00:00.000Z',
  },
  {
    id: 'seed-dog-3',
    name: 'Duman',
    breed: 'Sokak Köpeği / Melez',
    photoUri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Karaköy Bankalar Caddesi',
      latitude: 41.0245,
      longitude: 28.9740,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-dog3-1',
        name: 'Kuduz Aşısı',
        date: '2026-09-25',
        clinic: 'Beyoğlu Belediyesi Veteriner Merkezi',
        notes: 'Kulağında belediye küpesi mevcuttur.',
      }
    ],
    scheduledVaccines: [
      {
        id: 'sch-dog3-1',
        name: 'İç-Dış Parazit Tekrarı',
        plannedDate: '2026-11-30',
        notes: 'Mevsim geçişi parazit koruması.',
      }
    ],
    notes: 'Bankalar caddesindeki tarihi binaların önünde uyur. Çok akıllı ve sadıktır.',
    interactionHistory: [
      {
        id: 'int-dog3-1',
        date: '2026-11-17T13:00:00.000Z',
        type: 'feeding',
        note: 'Öğle saatinde etli konserve mama verildi 🥣',
      }
    ],
    createdAt: '2026-09-20T12:00:00.000Z',
  },
  {
    id: 'seed-dog-4',
    name: 'Pamuk',
    breed: 'Beyaz Melez / Terrier Karışımı',
    photoUri: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Üsküdar Salacak Sahili',
      latitude: 41.0185,
      longitude: 29.0065,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-dog4-1',
        name: 'Karma Aşı',
        date: '2026-10-12',
        clinic: 'Salacak Veteriner Polikliniği',
        notes: 'Aşı sonrası genel kontrol yapıldı.',
      }
    ],
    scheduledVaccines: [],
    notes: 'Kız Kulesi manzaralı sahilde yürüyenlerin neşesi. İnsanlara hemen yanaşır.',
    interactionHistory: [
      {
        id: 'int-dog4-1',
        date: '2026-11-16T15:20:00.000Z',
        type: 'walking',
        note: 'Sahil boyu neşeli bir yürüyüş yapıldı 🦮',
      },
      {
        id: 'int-dog4-2',
        date: '2026-11-17T16:00:00.000Z',
        type: 'petting',
        note: 'Kulak arkası sevildi, çok neşeli 💖',
      }
    ],
    createdAt: '2026-10-05T08:30:00.000Z',
  },
  {
    id: 'seed-dog-5',
    name: 'Çakıl',
    breed: 'Yavru Çoban Melezi',
    photoUri: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&auto=format&fit=crop&q=80'
    ],
    location: {
      regionName: 'Sarıyer Emirgan Korusu',
      latitude: 41.1090,
      longitude: 29.0520,
    },
    locationHistory: [],
    vaccinations: [
      {
        id: 'vac-dog5-1',
        name: 'Genel Sağlık & Parazit',
        date: '2026-11-05',
        clinic: 'Sarıyer Belediyesi Sahipsiz Hayvan Kliniği',
        notes: 'Yavru köpek iç parazit damlası yapıldı.',
      }
    ],
    scheduledVaccines: [
      {
        id: 'sch-dog5-1',
        name: 'Karma Aşı (1. Doz)',
        plannedDate: '2026-11-26',
        notes: 'İlk karma aşı planlaması.',
      }
    ],
    notes: 'Koru içinde korumaya alınan sevimli yavru köpek. Enerjisi çok yüksek.',
    interactionHistory: [
      {
        id: 'int-dog5-1',
        date: '2026-11-17T11:45:00.000Z',
        type: 'feeding',
        note: 'Yavru köpek kuru maması ve ılık su verildi 🥣',
      }
    ],
    createdAt: '2026-11-01T15:00:00.000Z',
  }
];
