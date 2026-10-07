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

export const useCatStore = create(
  persist(
    (set, get) => ({
      // State
      cats: [],
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
          bondScore: initialInteractions.length > 0 ? 15 : 5, // Başlangıç bağ puanı
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
       * Tüm kedi verilerini sıfırlama / temizleme (Test ve debug için)
       */
      clearAllCats: () => {
        set({ cats: [] });
      },

      /**
       * Bağ puanına göre seviye hesaplama yardımcısı
       * @param {number} score
       * @returns {{ level: number, title: string, color: string }}
       */
      getBondLevelInfo: (score = 0) => {
        if (score >= 100) return { level: 4, title: 'Can Dostu 💖', color: '#E53E3E' };
        if (score >= 50) return { level: 3, title: 'Sıkı Dost 🐾', color: '#ED8936' };
        if (score >= 20) return { level: 2, title: 'Tanıdık Arkadaş 😺', color: '#ECC94B' };
        return { level: 1, title: 'Yeni Tanışma 🌱', color: '#48BB78' };
      },
    }),
    {
      name: 'street-cat-tracker-storage', // AsyncStorage anahtar adı
      storage: createJSONStorage(() => AsyncStorage), // Kalıcı depolama motoru
    }
  )
);

export default useCatStore;
