import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';

/**
 * @typedef {Object} Interaction
 * @property {string} id - Benzersiz etkileşim kimliği
 * @property {string} date - ISO formatında etkileşim tarihi/saati
 * @property {('feeding'|'petting'|'playing'|'other')} type - Etkileşim türü (besleme, sevme vb.)
 * @property {string} [note] - İsteğe bağlı not
 */

/**
 * @typedef {Object} CatLocation
 * @property {number} [latitude] - Enlem
 * @property {number} [longitude] - Boylam
 * @property {string} regionName - Bölge/Semt/Sokak adı
 */

/**
 * @typedef {Object} Cat
 * @property {string} id - Benzersiz kedi kimliği
 * @property {string} name - Kedinin ismi
 * @property {string[]} photos - Kedinin fotoğraf albümü (URI dizisi)
 * @property {string|null} [photoUri] - Ana kapak fotoğrafı (geriye uyumluluk için)
 * @property {string} breed - Kedinin cinsi / türü (Tekir, Sarman, Calico vb.)
 * @property {CatLocation|string} location - Enlem/Boylam veya Bölge adı
 * @property {Interaction[]} interactionHistory - Etkileşim geçmişi (tarih dizisi)
 * @property {string} createdAt - Oluşturulma tarihi (ISO string)
 */

const SAMPLE_CATS = [
  {
    id: 'sample-1',
    name: 'Pamuk',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&q=80',
    ],
    breed: 'Van Melezi',
    location: {
      latitude: 40.9880,
      longitude: 29.0255,
      regionName: 'Kadıköy Kedileri',
    },
    interactionHistory: [
      {
        id: 'int-1',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        type: 'feeding',
        note: 'Moda sahilinde yaş mama verildi 🥣',
      },
      {
        id: 'int-2',
        date: new Date(Date.now() - 3600000 * 26).toISOString(),
        type: 'petting',
        note: 'Güneşte mırıldayarak kendini sevdirdi ✨',
      },
      {
        id: 'int-3',
        date: new Date(Date.now() - 3600000 * 50).toISOString(),
        type: 'feeding',
        note: 'Taze su ve kuru mama bırakıldı 🥣',
      },
      {
        id: 'int-4',
        date: new Date(Date.now() - 3600000 * 74).toISOString(),
        type: 'playing',
        note: 'Kedi nanesi oyuncağıyla oynadı 🧶',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Duman',
    photos: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&q=80',
    ],
    breed: 'Gri Tekir',
    location: {
      latitude: 40.9915,
      longitude: 29.0280,
      regionName: 'Kadıköy Kedileri',
    },
    interactionHistory: [
      {
        id: 'int-5',
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        type: 'feeding',
        note: 'Kuru mama ve taze su verildi 🥣',
      },
      {
        id: 'int-6',
        date: new Date(Date.now() - 3600000 * 28).toISOString(),
        type: 'petting',
        note: 'Başını sevdirip patisiyle dokundu 🐾',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sample-3',
    name: 'Tarçın',
    photos: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&q=80',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&q=80',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&q=80',
    ],
    breed: 'Sarman',
    location: {
      latitude: 41.0855,
      longitude: 29.0435,
      regionName: 'Kampüs Kedileri',
    },
    interactionHistory: [
      { id: 'int-7', date: new Date(Date.now() - 3600000 * 1).toISOString(), type: 'feeding', note: 'Konserve mama verildi 🥣' },
      { id: 'int-8', date: new Date(Date.now() - 3600000 * 20).toISOString(), type: 'petting', note: 'Kucakta uyukladı 🐾' },
      { id: 'int-9', date: new Date(Date.now() - 3600000 * 44).toISOString(), type: 'playing', note: 'İp oyuncağıyla koştu 🧶' },
      { id: 'int-10', date: new Date(Date.now() - 3600000 * 68).toISOString(), type: 'feeding', note: 'Kuru mama verildi 🥣' },
      { id: 'int-11', date: new Date(Date.now() - 3600000 * 92).toISOString(), type: 'petting', note: 'Çene altı okşandı ✨' },
      { id: 'int-12', date: new Date(Date.now() - 3600000 * 116).toISOString(), type: 'feeding', note: 'Akşam ödül maması 🥣' },
      { id: 'int-13', date: new Date(Date.now() - 3600000 * 140).toISOString(), type: 'playing', note: 'Lazer noktası kovaladı 🧶' },
      { id: 'int-14', date: new Date(Date.now() - 3600000 * 164).toISOString(), type: 'feeding', note: 'Taze su yenilendi 🥣' },
      { id: 'int-15', date: new Date(Date.now() - 3600000 * 188).toISOString(), type: 'petting', note: 'Sırtı tarandı ve sevildi 💖' },
      { id: 'int-16', date: new Date(Date.now() - 3600000 * 212).toISOString(), type: 'feeding', note: 'Sabah kahvaltısı verildi 🥣' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

export const useCatStore = create(
  persist(
    (set, get) => ({
      cats: SAMPLE_CATS,
      isLoading: false,

      /**
       * 1. Yeni Kedi Ekleme
       * photoUri veya photos dizisini kabul eder, photos: [] olarak saklar.
       */
      addCat: (catData) => {
        const now = new Date().toISOString();
        const newCatId = Date.now().toString();

        // Fotoğraf listesi oluştur (photos dizisi veya tekil photoUri)
        const photoList = catData.photos && catData.photos.length > 0
          ? catData.photos
          : catData.photoUri
          ? [catData.photoUri]
          : [];

        let initialInteractions = [];

        if (Array.isArray(catData.initialInteractions) && catData.initialInteractions.length > 0) {
          initialInteractions = catData.initialInteractions.map((item, idx) => ({
            id: `int-${newCatId}-${idx}`,
            date: item.date || now,
            type: item.type || 'feeding',
            note: item.note || 'İlk etkileşim',
          }));
        } else if (catData.initialInteraction) {
          initialInteractions = [
            {
              id: `int-${newCatId}`,
              date: now,
              type: 'feeding',
              note: 'İlk tanışma ve besleme 🥣',
            },
          ];
        }

        const newCat = {
          id: newCatId,
          name: catData.name || 'İsimsiz Kedi',
          photos: photoList,
          photoUri: photoList[0] || null, // Geriye dönük uyumluluk
          breed: catData.breed || 'Tekir / Melez',
          location:
            typeof catData.location === 'object'
              ? catData.location
              : { regionName: catData.location || 'Genel Bölge Kedileri' },
          interactionHistory: initialInteractions,
          createdAt: now,
        };

        set((state) => ({
          cats: [newCat, ...state.cats],
        }));

        return newCat;
      },

      /**
       * 2. Kediyi Silme (Prompt 1 gereksinimi: deleteCat(id))
       */
      deleteCat: (id) => {
        set((state) => ({
          cats: state.cats.filter((cat) => cat.id !== id),
        }));
      },

      /**
       * 3. Var Olan Kediye Fotoğraf Ekleme (Prompt 1 gereksinimi: addPhotoToCat(id, photoUri))
       */
      addPhotoToCat: (id, photoUri) => {
        if (!photoUri) return;
        set((state) => ({
          cats: state.cats.map((cat) => {
            if (cat.id === id) {
              const currentPhotos = cat.photos || (cat.photoUri ? [cat.photoUri] : []);
              const updatedPhotos = [photoUri, ...currentPhotos];
              return {
                ...cat,
                photos: updatedPhotos,
                photoUri: updatedPhotos[0],
              };
            }
            return cat;
          }),
        }));
      },

      /**
       * 4. Yeni Etkileşim Ekleme (Besleme / Sevme)
       */
      addInteraction: (catId, interactionDetails = {}) => {
        const now = new Date().toISOString();
        const newInteraction = {
          id: `int-${Date.now()}`,
          date: interactionDetails.date || now,
          type: interactionDetails.type || 'feeding',
          note: interactionDetails.note || 'Besleme ve sevgi dolu an 🥣',
        };

        set((state) => ({
          cats: state.cats.map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                interactionHistory: [newInteraction, ...(cat.interactionHistory || [])],
              };
            }
            return cat;
          }),
        }));
      },

      getCatById: (catId) => {
        return get().cats.find((cat) => cat.id === catId);
      },

      updateCat: (catId, updatedFields) => {
        set((state) => ({
          cats: state.cats.map((cat) =>
            cat.id === catId ? { ...cat, ...updatedFields } : cat
          ),
        }));
      },

      seedSampleCats: () => {
        set({ cats: SAMPLE_CATS });
      },

      clearAllCats: () => {
        set({ cats: [] });
      },

      /**
       * Etkileşim sayısına göre seviye hesaplayıcı:
       * 1-3 etkileşim: Tanışıklık (Level 1)
       * 4-8 etkileşim: Dost (Level 2)
       * 9+ etkileşim: Aile (Level 3)
       */
      getBondLevelInfo: (interactionCount = 0) => {
        const count = typeof interactionCount === 'number' ? interactionCount : (interactionCount?.length || 0);

        if (count >= 9) {
          return {
            level: 3,
            title: 'Aile 💖',
            color: Colors.level3,
            badgeBg: Colors.level3Bg,
            progressPercent: 100,
            description: 'Bu kedi artık senin ailenden biri!',
            nextTargetText: 'En yüksek bağ seviyesine ulaşıldı! 🌟',
            remainingCount: 0,
          };
        } else if (count >= 4) {
          const progress = Math.min(100, Math.round(33 + ((count - 3) / 5) * 66));
          const remaining = 9 - count;
          return {
            level: 2,
            title: 'Dost 😺',
            color: Colors.level2,
            badgeBg: Colors.level2Bg,
            progressPercent: progress,
            description: 'Artık birbirinizi çok iyi tanıyorsunuz!',
            nextTargetText: `'Aile' seviyesine ${remaining} etkileşim kaldı.`,
            remainingCount: remaining,
          };
        } else if (count >= 1) {
          const progress = Math.min(33, Math.round((count / 3) * 33));
          const remaining = 4 - count;
          return {
            level: 1,
            title: 'Tanışıklık 🐾',
            color: Colors.level1,
            badgeBg: Colors.level1Bg,
            progressPercent: progress,
            description: 'İlk adımlar atıldı, bağınız güçleniyor.',
            nextTargetText: `'Dost' seviyesine ${remaining} etkileşim kaldı.`,
            remainingCount: remaining,
          };
        }

        return {
          level: 0,
          title: 'Yeni Tanışma 🌱',
          color: Colors.green,
          badgeBg: Colors.greenLight,
          progressPercent: 5,
          description: 'Henüz bir etkileşim girilmedi.',
          nextTargetText: "'Tanışıklık' için ilk mamayı veya sevgiyi ver!",
          remainingCount: 1,
        };
      },
    }),
    {
      name: 'street-cat-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCatStore;
