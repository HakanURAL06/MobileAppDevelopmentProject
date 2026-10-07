import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @typedef {Object} Interaction
 * @property {string} id - Benzersiz etkileşim kimliği
 * @property {string} date - ISO formatında etkileşim tarihi/saati
 * @property {('feeding'|'petting'|'playing'|'other')} type - Etkileşim türü (besleme, sevme vb.)
 * @property {string} [note] - İsteğe bağlı not
 * @property {number} [pointsEarned] - Bu etkileşimden kazanılan puan
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
 * @property {string|null} photoUri - Fotoğraf URI veya yerel dosya yolu
 * @property {string} breed - Kedinin cinsi / türü (Tekir, Sarman, Calico vb.)
 * @property {CatLocation|string} location - Enlem/Boylam veya Bölge adı
 * @property {Interaction[]} interactionHistory - Etkileşim geçmişi (tarih dizisi ve detayları)
 * @property {number} bondScore - Seviye / Bağ puanı (ör. 0 - 100+)
 * @property {string} createdAt - Oluşturulma tarihi (ISO string)
 */

const SAMPLE_CATS = [
  {
    id: 'sample-1',
    name: 'Pamuk',
    photoUri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    breed: 'Van Melezi',
    location: {
      latitude: 40.9880,
      longitude: 29.0255,
      regionName: 'Kadıköy Kedileri',
    },
    bondScore: 65,
    interactionHistory: [
      {
        id: 'int-1',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        type: 'feeding',
        note: 'Moda sahilinde yaş mama verildi 🥣',
        pointsEarned: 15,
      },
      {
        id: 'int-2',
        date: new Date(Date.now() - 3600000 * 26).toISOString(),
        type: 'petting',
        note: 'Güneşte mırıldayarak kendini sevdirdi ✨',
        pointsEarned: 10,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Duman',
    photoUri: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&q=80',
    breed: 'Gri Tekir',
    location: {
      latitude: 40.9915,
      longitude: 29.0280,
      regionName: 'Kadıköy Kedileri',
    },
    bondScore: 30,
    interactionHistory: [
      {
        id: 'int-3',
        date: new Date(Date.now() - 3600000 * 5).toISOString(),
        type: 'feeding',
        note: 'Kuru mama ve taze su verildi.',
        pointsEarned: 10,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sample-3',
    name: 'Tarçın',
    photoUri: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&q=80',
    breed: 'Sarman',
    location: {
      latitude: 41.0855,
      longitude: 29.0435,
      regionName: 'Kampüs Kedileri',
    },
    bondScore: 115,
    interactionHistory: [
      {
        id: 'int-4',
        date: new Date(Date.now() - 3600000 * 1).toISOString(),
        type: 'playing',
        note: 'İp oyuncağıyla 15 dk koşturdu 🧶',
        pointsEarned: 20,
      },
      {
        id: 'int-5',
        date: new Date(Date.now() - 3600000 * 20).toISOString(),
        type: 'feeding',
        note: 'Kütüphane önünde ödül maması verildi.',
        pointsEarned: 15,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'sample-4',
    name: 'Gofret',
    photoUri: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80',
    breed: 'Calico (Üç Renkli)',
    location: {
      latitude: 41.0830,
      longitude: 29.0460,
      regionName: 'Kampüs Kedileri',
    },
    bondScore: 40,
    interactionHistory: [
      {
        id: 'int-6',
        date: new Date(Date.now() - 3600000 * 8).toISOString(),
        type: 'petting',
        note: 'Çimlerde başını okşattı 🐾',
        pointsEarned: 10,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-5',
    name: 'Zeytin',
    photoUri: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80',
    breed: 'Siyah Bombay',
    location: {
      latitude: 41.0435,
      longitude: 29.0085,
      regionName: 'Beşiktaş Kedileri',
    },
    bondScore: 15,
    interactionHistory: [
      {
        id: 'int-7',
        date: new Date(Date.now() - 3600000 * 18).toISOString(),
        type: 'feeding',
        note: 'Çarşıda balıkçı yanında beslendi.',
        pointsEarned: 15,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const useCatStore = create(
  persist(
    (set, get) => ({
      // State
      cats: SAMPLE_CATS, // Başlangıçta örnek kedi verileri yüklü gelir
      isLoading: false,

      /**
       * Yeni kedi ekleme fonksiyonu
       * @param {Omit<Cat, 'id' | 'createdAt' | 'bondScore' | 'interactionHistory'> & { initialInteraction?: boolean }} catData
       * @returns {Cat} Eklenen yeni kedi nesnesi
       */
      addCat: (catData) => {
        const now = new Date().toISOString();
        const newCatId = Date.now().toString();

        const initialInteractions = catData.initialInteraction
          ? [
              {
                id: `${newCatId}-init`,
                date: now,
                type: 'feeding',
                note: 'İlk tanışma ve besleme',
                pointsEarned: 15,
              },
            ]
          : [];

        const newCat = {
          id: newCatId,
          name: catData.name || 'İsimsiz Kedi',
          photoUri: catData.photoUri || null,
          breed: catData.breed || 'Melez / Sokak Kedisi',
          location:
            typeof catData.location === 'object'
              ? catData.location
              : { regionName: catData.location || 'Bilinmeyen Konum' },
          interactionHistory: initialInteractions,
          bondScore: initialInteractions.length > 0 ? 15 : 5,
          createdAt: now,
        };

        set((state) => ({
          cats: [newCat, ...state.cats],
        }));

        return newCat;
      },

      /**
       * Var olan bir kediye yeni etkileşim (besleme/sevme vb.) ekleme
       * Bu eylem kedinin bağ seviyesini / puanını artırır.
       * 
       * @param {string} catId - Etkileşim eklenecek kedinin id'si
       * @param {Object} interactionDetails - Etkileşim bilgileri
       * @param {('feeding'|'petting'|'playing'|'other')} [interactionDetails.type='feeding'] - Tür
       * @param {string} [interactionDetails.note] - Not
       * @param {number} [interactionDetails.points=10] - Eklenecek bağ puanı
       */
      addInteraction: (catId, interactionDetails = {}) => {
        const points = interactionDetails.points ?? 10;
        const now = new Date().toISOString();

        const newInteraction = {
          id: `${catId}-${Date.now()}`,
          date: interactionDetails.date || now,
          type: interactionDetails.type || 'feeding',
          note: interactionDetails.note || '',
          pointsEarned: points,
        };

        set((state) => ({
          cats: state.cats.map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                bondScore: (cat.bondScore || 0) + points,
                interactionHistory: [newInteraction, ...(cat.interactionHistory || [])],
              };
            }
            return cat;
          }),
        }));
      },

      /**
       * Belirli bir kediyi ID ile getirme
       * @param {string} catId
       * @returns {Cat | undefined}
       */
      getCatById: (catId) => {
        return get().cats.find((cat) => cat.id === catId);
      },

      /**
       * Kedi bilgilerini güncelleme
       * @param {string} catId
       * @param {Partial<Cat>} updatedFields
       */
      updateCat: (catId, updatedFields) => {
        set((state) => ({
          cats: state.cats.map((cat) =>
            cat.id === catId ? { ...cat, ...updatedFields } : cat
          ),
        }));
      },

      /**
       * Kediyi silme
       * @param {string} catId
       */
      deleteCat: (catId) => {
        set((state) => ({
          cats: state.cats.filter((cat) => cat.id !== catId),
        }));
      },

      /**
       * Örnek verileri yeniden yükleme
       */
      seedSampleCats: () => {
        set({ cats: SAMPLE_CATS });
      },

      /**
       * Tüm kedi verilerini sıfırlama / temizleme
       */
      clearAllCats: () => {
        set({ cats: [] });
      },

      /**
       * Bağ puanına göre seviye ve rozet hesaplayıcı
       * @param {number} score
       * @returns {{ level: number, title: string, color: string, badgeBg: string }}
       */
      getBondLevelInfo: (score = 0) => {
        if (score >= 100) return { level: 4, title: 'Can Dostu 💖', color: '#D946EF', badgeBg: '#FDF4FF' };
        if (score >= 50) return { level: 3, title: 'Sıkı Dost 🐾', color: '#F97316', badgeBg: '#FFF7ED' };
        if (score >= 20) return { level: 2, title: 'Tanıdık Arkadaş 😺', color: '#EAB308', badgeBg: '#FEFCE8' };
        return { level: 1, title: 'Yeni Tanışma 🌱', color: '#10B981', badgeBg: '#ECFDF5' };
      },
    }),
    {
      name: 'street-cat-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCatStore;
