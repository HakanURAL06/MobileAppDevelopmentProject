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
 * @property {string} [notes] - Kedi hakkında kullanıcı notları (karakter, aşı, özel bilgiler)
 * @property {Interaction[]} interactionHistory - Etkileşim geçmişi (tarih dizisi)
 * @property {string} createdAt - Oluşturulma tarihi (ISO string)
 */

export const INITIAL_CATS = [
  {
    id: 'cat-avci',
    name: 'Avcı',
    photos: [
      require('../../assets/cats/avci1.jpg'),
      require('../../assets/cats/avci3.jpg'),
    ],
    photoUri: require('../../assets/cats/avci1.jpg'),
    breed: 'Tekir',
    location: {
      latitude: 41.0475,
      longitude: 28.8945,
      regionName: 'Kocatepe Metrosu',
    },
    notes: 'Fare avlamayı seviyor, çok şişman, metrodan ayrılmıyor.',
    interactionHistory: [
      {
        id: 'int-avci-1',
        date: new Date(Date.now() - 3600000 * 3).toISOString(),
        type: 'feeding',
        note: 'Metro çıkışında yaş mama verildi 🥣',
      },
      {
        id: 'int-avci-2',
        date: new Date(Date.now() - 3600000 * 27).toISOString(),
        type: 'petting',
        note: 'Göbüşünü sevdirip mırıldadı 🐾',
      },
      {
        id: 'int-avci-3',
        date: new Date(Date.now() - 3600000 * 51).toISOString(),
        type: 'feeding',
        note: 'Kuru mama ve taze su bırakıldı 🥣',
      },
      {
        id: 'int-avci-4',
        date: new Date(Date.now() - 3600000 * 75).toISOString(),
        type: 'petting',
        note: 'Turnikelerin yanında başı okşandı ✨',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'cat-habes',
    name: 'Habeş',
    photos: [
      require('../../assets/cats/habes1.jpg'),
      require('../../assets/cats/habes2.jpg'),
    ],
    photoUri: require('../../assets/cats/habes1.jpg'),
    breed: 'Uzun Tüylü Calico',
    location: {
      latitude: 41.0250,
      longitude: 28.9850,
      regionName: 'Site',
    },
    notes: "Değişik bir şekilde miyavlıyor, adına duyarlı, 'göbüş' deyince göbek açıyor, favori mekanlarından ayrılmıyor.",
    interactionHistory: [
      { id: 'int-habes-1', date: new Date(Date.now() - 3600000 * 1).toISOString(), type: 'feeding', note: 'Sabah yaş maması verildi 🥣' },
      { id: 'int-habes-2', date: new Date(Date.now() - 3600000 * 8).toISOString(), type: 'petting', note: "Göbüş deyince göbeğini açtı, dakikalarca sevildi 💖" },
      { id: 'int-habes-3', date: new Date(Date.now() - 3600000 * 24).toISOString(), type: 'playing', note: 'İp oyuncağıyla neşeyle oynadı 🧶' },
      { id: 'int-habes-4', date: new Date(Date.now() - 3600000 * 48).toISOString(), type: 'feeding', note: 'Ödül maması ikram edildi 🥣' },
      { id: 'int-habes-5', date: new Date(Date.now() - 3600000 * 72).toISOString(), type: 'petting', note: 'Çene altı ve kulak arkası okşandı ✨' },
      { id: 'int-habes-6', date: new Date(Date.now() - 3600000 * 96).toISOString(), type: 'feeding', note: 'Taze su yenilendi ve kuru mama konuldu 💧' },
      { id: 'int-habes-7', date: new Date(Date.now() - 3600000 * 120).toISOString(), type: 'petting', note: 'Mırıl mırıl kucağa uzandı 🐾' },
      { id: 'int-habes-8', date: new Date(Date.now() - 3600000 * 144).toISOString(), type: 'feeding', note: 'Konserve somonlu mama verildi 🥣' },
      { id: 'int-habes-9', date: new Date(Date.now() - 3600000 * 168).toISOString(), type: 'playing', note: 'Lazer ışığını kovaladı 🧶' },
      { id: 'int-habes-10', date: new Date(Date.now() - 3600000 * 192).toISOString(), type: 'petting', note: 'Tüyleri tarandı ve sevildi 💖' },
      { id: 'int-habes-11', date: new Date(Date.now() - 3600000 * 216).toISOString(), type: 'feeding', note: 'Akşam yemeği verildi 🥣' },
      { id: 'int-habes-12', date: new Date(Date.now() - 3600000 * 240).toISOString(), type: 'petting', note: 'Site bahçesinde sıcak karşıladı 🐾' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'cat-prenses',
    name: 'Prenses',
    photos: [
      require('../../assets/cats/prenses1.jpg'),
      require('../../assets/cats/prenses2.jpg'),
      require('../../assets/cats/prenses3.jpg'),
    ],
    photoUri: require('../../assets/cats/prenses1.jpg'),
    breed: 'Gri-Beyaz',
    location: {
      latitude: 41.0125,
      longitude: 28.9635,
      regionName: 'İstanbul Üniversitesi EK-1 Kantini',
    },
    notes: 'Çanta üstünde uyumaya bayılıyor, sürekli yargılarmış gibi bakıyor.',
    interactionHistory: [
      { id: 'int-prenses-1', date: new Date(Date.now() - 3600000 * 3).toISOString(), type: 'petting', note: 'Kantin masasında sırt çantası üzerinde uyurken sevildi 🎒' },
      { id: 'int-prenses-2', date: new Date(Date.now() - 3600000 * 25).toISOString(), type: 'feeding', note: 'Tavuklu yaş mama ikram edildi 🥣' },
      { id: 'int-prenses-3', date: new Date(Date.now() - 3600000 * 49).toISOString(), type: 'petting', note: 'Gözlerini kısıp yargılayarak kendini sevdirdi 😸' },
      { id: 'int-prenses-4', date: new Date(Date.now() - 3600000 * 73).toISOString(), type: 'feeding', note: 'Kuru mama ve temiz su bırakıldı 🥣' },
      { id: 'int-prenses-5', date: new Date(Date.now() - 3600000 * 97).toISOString(), type: 'playing', note: 'Kantin fişiyle oyun oynadı 🧶' },
      { id: 'int-prenses-6', date: new Date(Date.now() - 3600000 * 121).toISOString(), type: 'petting', note: 'İlk tanışma ve baş okşama ✨' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'cat-puskul',
    name: 'Püskül',
    photos: [
      require('../../assets/cats/puskul1.jpg'),
      require('../../assets/cats/puskul2.jpg'),
      require('../../assets/cats/puskul3.jpg'),
    ],
    photoUri: require('../../assets/cats/puskul1.jpg'),
    breed: 'Uzun Tüylü Calico',
    location: {
      latitude: 41.0138,
      longitude: 28.9642,
      regionName: 'İstanbul Üniversitesi İktisat Fakültesi',
    },
    notes: 'Çok gizemli bir kedi, kendisini sevdirmiyor.',
    interactionHistory: [
      {
        id: 'int-puskul-1',
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        type: 'feeding',
        note: 'Uzaktan sakin bir köşeye kuru mama bırakıldı, gizemli bakışlarla izledi 🥣',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const useCatStore = create(
  persist(
    (set, get) => ({
      cats: INITIAL_CATS,
      isLoading: false,
      toast: null, // { message: string, type: 'success' | 'delete' | 'info', id: number }

      /**
       * Toast Bildirimi Gösterme
       */
      showToast: (message, type = 'success') => {
        const toastId = Date.now();
        set({ toast: { message, type, id: toastId } });
        setTimeout(() => {
          if (get().toast?.id === toastId) {
            set({ toast: null });
          }
        }, 3200);
      },

      /**
       * Toast Bildirimini Gizleme
       */
      hideToast: () => {
        set({ toast: null });
      },

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
          name: (catData.name || '').trim() || 'İsimsiz Kedi',
          photos: photoList,
          photoUri: photoList[0] || null, // Geriye dönük uyumluluk
          breed: (catData.breed || '').trim() || 'Tekir / Melez',
          location:
            typeof catData.location === 'object'
              ? {
                  regionName: (catData.location?.regionName || '').trim() || 'Bilinmeyen Bölge',
                  latitude: catData.location?.latitude ?? null,
                  longitude: catData.location?.longitude ?? null,
                }
              : {
                  regionName: (catData.location || '').trim() || 'Bilinmeyen Bölge',
                  latitude: null,
                  longitude: null,
                },
          notes: (catData.notes || '').trim(),
          interactionHistory: initialInteractions,
          createdAt: now,
        };

        set((state) => ({
          cats: [newCat, ...state.cats],
        }));

        // Otomatik küçük pop-up toast bildirimi
        get().showToast(`"${newCat.name}" başarıyla kaydedildi! 🐾`, 'success');

        return newCat;
      },

      /**
       * 2. Kedi Notlarını Güncelleme
       */
      updateCatNotes: (id, notes) => {
        set((state) => ({
          cats: state.cats.map((cat) =>
            cat.id === id ? { ...cat, notes: (notes || '').trim() } : cat
          ),
        }));
        get().showToast('Not güncellendi 📝', 'success');
      },

      /**
       * 3. Kediyi Silme (Pop-up bildirimi ile)
       */
      deleteCat: (id) => {
        const target = get().cats.find((cat) => cat.id === id);
        const catName = target?.name || 'Kedi';

        set((state) => ({
          cats: state.cats.filter((cat) => cat.id !== id),
        }));

        // Otomatik küçük pop-up toast bildirimi
        get().showToast(`"${catName}" başarıyla silindi 🗑️`, 'delete');
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

      resetToInitialCats: () => {
        set({ cats: INITIAL_CATS });
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
      name: 'street-cat-tracker-v4-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ cats: state.cats }),
    }
  )
);

export default useCatStore;
