import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';

/**
 * @typedef {Object} Interaction
 * @property {string} id - Benzersiz etkileşim kimliği
 * @property {string} date - ISO formatında etkileşim tarihi/saati
 * @property {('feeding'|'walking'|'petting'|'playing'|'training'|'other')} type - Etkileşim türü
 * @property {string} [note] - İsteğe bağlı not
 */

/**
 * @typedef {Object} LocationHistoryItem
 * @property {string} id - Benzersiz kayıt kimliği
 * @property {string} regionName - Önceki bölge / konum adı
 * @property {number|null} [latitude] - Önceki enlem
 * @property {number|null} [longitude] - Önceki boylam
 * @property {string} changedAt - Konumun değiştiği tarih (ISO string)
 */

/**
 * @typedef {Object} Vaccination
 * @property {string} id - Benzersiz aşı kimliği
 * @property {string} name - Aşı adı (örn: Kuduz, Karma, Parazit)
 * @property {string} date - Yapılış tarihi (YYYY-MM-DD)
 * @property {string} [clinic] - Uygulanan veteriner / klinik
 * @property {string} [notes] - Aşıya dair notlar
 */

/**
 * @typedef {Object} ScheduledVaccine
 * @property {string} id - Benzersiz plan kimliği
 * @property {string} name - Planlanan aşı adı
 * @property {string} plannedDate - Planlanan tarih (YYYY-MM-DD)
 * @property {string} [notes] - Hatırlatma notu
 */

/**
 * @typedef {Object} Animal
 * @property {string} id - Benzersiz kimlik
 * @property {string} name - İsim
 * @property {string[]} photos - Fotoğraf albümü
 * @property {string|null} [photoUri] - Kapak fotoğrafı
 * @property {string} breed - Cinsi / türü
 * @property {Object} location - Bölge adı ve koordinatlar
 * @property {LocationHistoryItem[]} locationHistory - Eski konum geçmişi
 * @property {Vaccination[]} vaccinations - Tamamlanan aşılar
 * @property {ScheduledVaccine[]} scheduledVaccines - Gelecek / planlanan aşılar
 * @property {string} [notes] - Notlar
 * @property {Interaction[]} interactionHistory - Etkileşim geçmişi
 * @property {string} createdAt - Oluşturulma tarihi
 */

export const useCatStore = create(
  persist(
    (set, get) => ({
      // KURAL 1: Başlangıçta hiçbir sahte/sabit veri yok, diziler tamamen BOŞ ([]) başlar.
      cats: [],
      dogs: [],
      hasHydrated: false,
      isLoading: false,
      toast: null, // { message: string, type: 'success' | 'delete' | 'info', id: number }

      // Uygulama Tercihleri (Tema & Dil)
      theme: 'light', // 'light' | 'dark'
      language: 'tr', // 'tr' | 'en'

      setHasHydrated: (stateVal) => set({ hasHydrated: stateVal }),

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        const isEn = get().language === 'en';
        get().showToast(
          nextTheme === 'dark'
            ? (isEn ? 'Dark mode activated 🌙' : 'Koyu tema aktif edildi 🌙')
            : (isEn ? 'Light mode activated ☀️' : 'Açık tema aktif edildi ☀️'),
          'info'
        );
      },

      setLanguage: (language) => set({ language }),
      toggleLanguage: () => {
        const nextLang = get().language === 'tr' ? 'en' : 'tr';
        set({ language: nextLang });
        get().showToast(
          nextLang === 'tr'
            ? 'Uygulama dili Türkçe olarak ayarlandı 🇹🇷'
            : 'Language switched to English 🇬🇧',
          'info'
        );
      },

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

      // ==========================================
      // KEDİ CRUD OPERASYONLARI (CATS DATABASE)
      // ==========================================

      /**
       * CREATE: Yeni Kedi Kaydı Ekleme
       */
      addCat: (catData) => {
        const now = new Date().toISOString();
        const newCatId = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        const photoList =
          Array.isArray(catData.photos) && catData.photos.length > 0
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
          photoUri: photoList[0] || null,
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
          locationHistory: Array.isArray(catData.locationHistory) ? catData.locationHistory : [],
          vaccinations: Array.isArray(catData.vaccinations) ? catData.vaccinations : [],
          scheduledVaccines: Array.isArray(catData.scheduledVaccines) ? catData.scheduledVaccines : [],
          notes: (catData.notes || '').trim(),
          interactionHistory: initialInteractions,
          createdAt: now,
        };

        set((state) => ({
          cats: [newCat, ...(Array.isArray(state.cats) ? state.cats : [])],
        }));

        get().showToast(`"${newCat.name}" başarıyla kaydedildi! 🐾`, 'success');
        return newCat;
      },

      /**
       * DELETE: Kedi Kaydını Silme
       */
      deleteCat: (id) => {
        const target = (get().cats || []).find((cat) => cat.id === id);
        const catName = target?.name || 'Kedi';

        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).filter((cat) => cat.id !== id),
        }));

        get().showToast(`"${catName}" başarıyla silindi 🗑️`, 'delete');
      },

      /**
       * UPDATE: Kediye Yeni Fotoğraf Ekleme
       */
      addPhotoToCat: (id, photoUri) => {
        if (!photoUri) return;

        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).map((cat) => {
            if (cat.id === id) {
              const currentPhotos = Array.isArray(cat.photos)
                ? cat.photos
                : cat.photoUri
                ? [cat.photoUri]
                : [];
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
       * UPDATE: Kediye Yeni Etkileşim Ekleme
       */
      addInteraction: (catId, interactionDetails = {}) => {
        const now = new Date().toISOString();
        const newInteraction = {
          id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          date: interactionDetails.date || now,
          type: interactionDetails.type || 'feeding',
          note: interactionDetails.note || 'Besleme ve sevgi dolu an 🥣',
        };

        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).map((cat) => {
            if (cat.id === catId) {
              const currentHistory = Array.isArray(cat.interactionHistory)
                ? cat.interactionHistory
                : [];
              return {
                ...cat,
                interactionHistory: [newInteraction, ...currentHistory],
              };
            }
            return cat;
          }),
        }));
      },

      /**
       * UPDATE: Kedi Genel Bilgilerini ve Konum Geçmişini Güncelleme
       */
      updateCatInfo: (catId, updatedFields) => {
        const currentCat = (get().cats || []).find((c) => c.id === catId);
        if (!currentCat) return;

        const currentRegion =
          typeof currentCat.location === 'object'
            ? currentCat.location?.regionName
            : currentCat.location;

        let newHistory = Array.isArray(currentCat.locationHistory)
          ? [...currentCat.locationHistory]
          : [];

        if (updatedFields.location) {
          const newRegion =
            typeof updatedFields.location === 'object'
              ? updatedFields.location?.regionName
              : updatedFields.location;

          if (
            currentRegion &&
            newRegion &&
            currentRegion.trim().toLowerCase() !== newRegion.trim().toLowerCase()
          ) {
            const historyItem = {
              id: `loc-hist-${Date.now()}`,
              regionName: currentRegion.trim(),
              latitude:
                typeof currentCat.location === 'object'
                  ? currentCat.location?.latitude ?? null
                  : null,
              longitude:
                typeof currentCat.location === 'object'
                  ? currentCat.location?.longitude ?? null
                  : null,
              changedAt: new Date().toISOString(),
            };
            newHistory = [historyItem, ...newHistory];
          }
        }

        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                ...updatedFields,
                locationHistory: newHistory,
              };
            }
            return cat;
          }),
        }));

        get().showToast(
          `"${updatedFields.name || currentCat.name}" bilgileri güncellendi ✨`,
          'success'
        );
      },

      /**
       * UPDATE: Kedi Notlarını Güncelleme
       */
      updateCatNotes: (id, notes) => {
        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).map((cat) =>
            cat.id === id ? { ...cat, notes: (notes || '').trim() } : cat
          ),
        }));
        get().showToast('Not güncellendi 📝', 'success');
      },

      /**
       * UPDATE: Kediye Tamamlanan Aşı Ekleme
       */
      addVaccination: (catId, vaccinationData) => {
        const newVac = {
          id: `vac-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: (vaccinationData.name || '').trim() || 'Aşı',
          date: vaccinationData.date || new Date().toISOString().split('T')[0],
          clinic: (vaccinationData.clinic || '').trim(),
          notes: (vaccinationData.notes || '').trim(),
        };

        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                vaccinations: [newVac, ...(Array.isArray(cat.vaccinations) ? cat.vaccinations : [])],
              };
            }
            return cat;
          }),
        }));

        get().showToast(`Aşı kaydı eklendi: ${newVac.name} 💉`, 'success');
        return newVac;
      },

      /**
       * UPDATE: Kedi İçin Gelecek Aşı Planlama
       */
      scheduleVaccine: (catId, scheduleData) => {
        const newSchedule = {
          id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: (scheduleData.name || '').trim() || 'Planlanan Aşı',
          plannedDate:
            scheduleData.plannedDate ||
            new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
          notes: (scheduleData.notes || '').trim(),
        };

        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                scheduledVaccines: [
                  newSchedule,
                  ...(Array.isArray(cat.scheduledVaccines) ? cat.scheduledVaccines : []),
                ],
              };
            }
            return cat;
          }),
        }));

        get().showToast(`Gelecek aşı planlandı: ${newSchedule.name} 📅`, 'success');
        return newSchedule;
      },

      /**
       * UPDATE: Planlanan Aşıyı Tamamlandı Olarak İşaretleme
       */
      completeScheduledVaccine: (catId, scheduledId, completionDetails = {}) => {
        const currentCat = (get().cats || []).find((c) => c.id === catId);
        if (!currentCat) return;

        const targetPlan = (currentCat.scheduledVaccines || []).find((s) => s.id === scheduledId);
        if (!targetPlan) return;

        const completedVac = {
          id: `vac-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: targetPlan.name,
          date: completionDetails.completionDate || new Date().toISOString().split('T')[0],
          clinic: (completionDetails.clinic || '').trim() || 'Veteriner Kliniği',
          notes: completionDetails.notes
            ? `${targetPlan.notes ? targetPlan.notes + ' • ' : ''}${completionDetails.notes}`
            : targetPlan.notes || 'Planlanan aşı başarıyla uygulandı',
        };

        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                scheduledVaccines: (cat.scheduledVaccines || []).filter((s) => s.id !== scheduledId),
                vaccinations: [completedVac, ...(cat.vaccinations || [])],
              };
            }
            return cat;
          }),
        }));

        get().showToast(`"${targetPlan.name}" tamamlandı olarak kaydedildi! 💉✓`, 'success');
      },

      /**
       * DELETE: Kedi Aşı Kaydını Silme
       */
      deleteVaccine: (catId, vaccineId, isScheduled = false) => {
        set((state) => ({
          cats: (Array.isArray(state.cats) ? state.cats : []).map((cat) => {
            if (cat.id === catId) {
              if (isScheduled) {
                return {
                  ...cat,
                  scheduledVaccines: (cat.scheduledVaccines || []).filter((v) => v.id !== vaccineId),
                };
              } else {
                return {
                  ...cat,
                  vaccinations: (cat.vaccinations || []).filter((v) => v.id !== vaccineId),
                };
              }
            }
            return cat;
          }),
        }));

        get().showToast('Aşı kaydı silindi 🗑️', 'delete');
      },

      /**
       * READ: ID ile Kedi Bulma
       */
      getCatById: (catId) => {
        return (get().cats || []).find((cat) => cat.id === catId);
      },

      /**
       * DELETE ALL: Tüm Kedileri Temizleme
       */
      clearAllCats: () => {
        set({ cats: [] });
      },

      // ==========================================
      // KÖPEK CRUD OPERASYONLARI (DOGS DATABASE)
      // ==========================================

      /**
       * CREATE: Yeni Köpek Kaydı Ekleme
       */
      addDog: (dogData) => {
        const now = new Date().toISOString();
        const newDogId = `dog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        const photoList =
          Array.isArray(dogData.photos) && dogData.photos.length > 0
            ? dogData.photos
            : dogData.photoUri
            ? [dogData.photoUri]
            : [];

        let initialInteractions = [];

        if (Array.isArray(dogData.initialInteractions) && dogData.initialInteractions.length > 0) {
          initialInteractions = dogData.initialInteractions.map((item, idx) => ({
            id: `int-${newDogId}-${idx}`,
            date: item.date || now,
            type: item.type || 'feeding',
            note: item.note || 'İlk tanışma',
          }));
        } else if (dogData.initialInteraction) {
          initialInteractions = [
            {
              id: `int-${newDogId}`,
              date: now,
              type: 'feeding',
              note: 'İlk tanışma ve besleme 🥣',
            },
          ];
        }

        const newDog = {
          id: newDogId,
          name: (dogData.name || '').trim() || 'İsimsiz Köpek',
          photos: photoList,
          photoUri: photoList[0] || null,
          breed: (dogData.breed || '').trim() || 'Sokak Köpeği / Melez',
          location:
            typeof dogData.location === 'object'
              ? {
                  regionName: (dogData.location?.regionName || '').trim() || 'Bilinmeyen Bölge',
                  latitude: dogData.location?.latitude ?? null,
                  longitude: dogData.location?.longitude ?? null,
                }
              : {
                  regionName: (dogData.location || '').trim() || 'Bilinmeyen Bölge',
                  latitude: null,
                  longitude: null,
                },
          locationHistory: Array.isArray(dogData.locationHistory) ? dogData.locationHistory : [],
          vaccinations: Array.isArray(dogData.vaccinations) ? dogData.vaccinations : [],
          scheduledVaccines: Array.isArray(dogData.scheduledVaccines) ? dogData.scheduledVaccines : [],
          notes: (dogData.notes || '').trim(),
          interactionHistory: initialInteractions,
          createdAt: now,
        };

        set((state) => ({
          dogs: [newDog, ...(Array.isArray(state.dogs) ? state.dogs : [])],
        }));

        get().showToast(`"${newDog.name}" başarıyla kaydedildi! 🐶`, 'success');
        return newDog;
      },

      /**
       * DELETE: Köpek Kaydını Silme
       */
      deleteDog: (id) => {
        const target = (get().dogs || []).find((dog) => dog.id === id);
        const dogName = target?.name || 'Köpek';

        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).filter((dog) => dog.id !== id),
        }));

        get().showToast(`"${dogName}" başarıyla silindi 🗑️`, 'delete');
      },

      /**
       * UPDATE: Köpeğe Yeni Fotoğraf Ekleme
       */
      addPhotoToDog: (id, photoUri) => {
        if (!photoUri) return;

        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).map((dog) => {
            if (dog.id === id) {
              const currentPhotos = Array.isArray(dog.photos)
                ? dog.photos
                : dog.photoUri
                ? [dog.photoUri]
                : [];
              const updatedPhotos = [photoUri, ...currentPhotos];
              return {
                ...dog,
                photos: updatedPhotos,
                photoUri: updatedPhotos[0],
              };
            }
            return dog;
          }),
        }));
      },

      /**
       * UPDATE: Köpeğe Yeni Etkileşim Ekleme
       */
      addDogInteraction: (dogId, interactionDetails = {}) => {
        const now = new Date().toISOString();
        const newInteraction = {
          id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          date: interactionDetails.date || now,
          type: interactionDetails.type || 'feeding',
          note: interactionDetails.note || 'Sadık dostla ilgilenildi 🐕',
        };

        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).map((dog) => {
            if (dog.id === dogId) {
              const currentHistory = Array.isArray(dog.interactionHistory)
                ? dog.interactionHistory
                : [];
              return {
                ...dog,
                interactionHistory: [newInteraction, ...currentHistory],
              };
            }
            return dog;
          }),
        }));
      },

      /**
       * UPDATE: Köpek Genel Bilgilerini ve Konum Geçmişini Güncelleme
       */
      updateDogInfo: (dogId, updatedFields) => {
        const currentDog = (get().dogs || []).find((d) => d.id === dogId);
        if (!currentDog) return;

        const currentRegion =
          typeof currentDog.location === 'object'
            ? currentDog.location?.regionName
            : currentDog.location;

        let newHistory = Array.isArray(currentDog.locationHistory)
          ? [...currentDog.locationHistory]
          : [];

        if (updatedFields.location) {
          const newRegion =
            typeof updatedFields.location === 'object'
              ? updatedFields.location?.regionName
              : updatedFields.location;

          if (
            currentRegion &&
            newRegion &&
            currentRegion.trim().toLowerCase() !== newRegion.trim().toLowerCase()
          ) {
            const historyItem = {
              id: `loc-hist-${Date.now()}`,
              regionName: currentRegion.trim(),
              latitude:
                typeof currentDog.location === 'object'
                  ? currentDog.location?.latitude ?? null
                  : null,
              longitude:
                typeof currentDog.location === 'object'
                  ? currentDog.location?.longitude ?? null
                  : null,
              changedAt: new Date().toISOString(),
            };
            newHistory = [historyItem, ...newHistory];
          }
        }

        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).map((dog) => {
            if (dog.id === dogId) {
              return {
                ...dog,
                ...updatedFields,
                locationHistory: newHistory,
              };
            }
            return dog;
          }),
        }));

        get().showToast(
          `"${updatedFields.name || currentDog.name}" bilgileri güncellendi ✨`,
          'success'
        );
      },

      /**
       * UPDATE: Köpek Notlarını Güncelleme
       */
      updateDogNotes: (id, notes) => {
        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).map((dog) =>
            dog.id === id ? { ...dog, notes: (notes || '').trim() } : dog
          ),
        }));
        get().showToast('Not güncellendi 📝', 'success');
      },

      /**
       * UPDATE: Köpeğe Tamamlanan Aşı Ekleme
       */
      addDogVaccination: (dogId, vaccinationData) => {
        const newVac = {
          id: `vac-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: (vaccinationData.name || '').trim() || 'Aşı',
          date: vaccinationData.date || new Date().toISOString().split('T')[0],
          clinic: (vaccinationData.clinic || '').trim(),
          notes: (vaccinationData.notes || '').trim(),
        };

        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).map((dog) => {
            if (dog.id === dogId) {
              return {
                ...dog,
                vaccinations: [newVac, ...(Array.isArray(dog.vaccinations) ? dog.vaccinations : [])],
              };
            }
            return dog;
          }),
        }));

        get().showToast(`Aşı kaydı eklendi: ${newVac.name} 💉`, 'success');
        return newVac;
      },

      /**
       * UPDATE: Köpek İçin Gelecek Aşı Planlama
       */
      scheduleDogVaccine: (dogId, scheduleData) => {
        const newSchedule = {
          id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: (scheduleData.name || '').trim() || 'Planlanan Aşı',
          plannedDate:
            scheduleData.plannedDate ||
            new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
          notes: (scheduleData.notes || '').trim(),
        };

        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).map((dog) => {
            if (dog.id === dogId) {
              return {
                ...dog,
                scheduledVaccines: [
                  newSchedule,
                  ...(Array.isArray(dog.scheduledVaccines) ? dog.scheduledVaccines : []),
                ],
              };
            }
            return dog;
          }),
        }));

        get().showToast(`Gelecek aşı planlandı: ${newSchedule.name} 📅`, 'success');
        return newSchedule;
      },

      /**
       * UPDATE: Planlanan Köpek Aşısını Tamamlandı Olarak İşaretleme
       */
      completeScheduledDogVaccine: (dogId, scheduledId, completionDetails = {}) => {
        const currentDog = (get().dogs || []).find((d) => d.id === dogId);
        if (!currentDog) return;

        const targetPlan = (currentDog.scheduledVaccines || []).find((s) => s.id === scheduledId);
        if (!targetPlan) return;

        const completedVac = {
          id: `vac-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: targetPlan.name,
          date: completionDetails.completionDate || new Date().toISOString().split('T')[0],
          clinic: (completionDetails.clinic || '').trim() || 'Veteriner Kliniği',
          notes: completionDetails.notes
            ? `${targetPlan.notes ? targetPlan.notes + ' • ' : ''}${completionDetails.notes}`
            : targetPlan.notes || 'Planlanan aşı başarıyla uygulandı',
        };

        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).map((dog) => {
            if (dog.id === dogId) {
              return {
                ...dog,
                scheduledVaccines: (dog.scheduledVaccines || []).filter((s) => s.id !== scheduledId),
                vaccinations: [completedVac, ...(dog.vaccinations || [])],
              };
            }
            return dog;
          }),
        }));

        get().showToast(`"${targetPlan.name}" tamamlandı olarak kaydedildi! 💉✓`, 'success');
      },

      /**
       * DELETE: Köpek Aşı Kaydını Silme
       */
      deleteDogVaccine: (dogId, vaccineId, isScheduled = false) => {
        set((state) => ({
          dogs: (Array.isArray(state.dogs) ? state.dogs : []).map((dog) => {
            if (dog.id === dogId) {
              if (isScheduled) {
                return {
                  ...dog,
                  scheduledVaccines: (dog.scheduledVaccines || []).filter((v) => v.id !== vaccineId),
                };
              } else {
                return {
                  ...dog,
                  vaccinations: (dog.vaccinations || []).filter((v) => v.id !== vaccineId),
                };
              }
            }
            return dog;
          }),
        }));

        get().showToast('Aşı kaydı silindi 🗑️', 'delete');
      },

      /**
       * READ: ID ile Köpek Bulma
       */
      getDogById: (dogId) => {
        return (get().dogs || []).find((dog) => dog.id === dogId);
      },

      /**
       * DELETE ALL: Tüm Köpekleri Temizleme
       */
      clearAllDogs: () => {
        set({ dogs: [] });
      },

      // ==========================================
      // BAĞ & SADAKAT SEVİYESİ HESAPLAMALARI
      // ==========================================

      /**
       * Kediler için Bağ Seviyesi
       */
      getBondLevelInfo: (interactionCount = 0, langParam = null) => {
        const count =
          typeof interactionCount === 'number'
            ? interactionCount
            : interactionCount?.length || 0;
        const isEn = (langParam || get().language) === 'en';

        if (count >= 9) {
          return {
            level: 3,
            title: isEn ? 'Family 💖' : 'Aile 💖',
            color: Colors.level3,
            badgeBg: Colors.level3Bg,
            progressPercent: 100,
            description: isEn
              ? 'This cat is now part of your family!'
              : 'Bu kedi artık senin ailenden biri!',
            nextTargetText: isEn
              ? 'Highest bond level achieved! 🌟'
              : 'En yüksek bağ seviyesine ulaşıldı! 🌟',
            remainingCount: 0,
          };
        } else if (count >= 4) {
          const progress = Math.min(100, Math.round(33 + ((count - 3) / 5) * 66));
          const remaining = 9 - count;
          return {
            level: 2,
            title: isEn ? 'Friend 😺' : 'Dost 😺',
            color: Colors.level2,
            badgeBg: Colors.level2Bg,
            progressPercent: progress,
            description: isEn
              ? 'You know each other very well now!'
              : 'Artık birbirinizi çok iyi tanıyorsunuz!',
            nextTargetText: isEn
              ? `${remaining} more interactions to 'Family' level.`
              : `'Aile' seviyesine ${remaining} etkileşim kaldı.`,
            remainingCount: remaining,
          };
        } else if (count >= 1) {
          const progress = Math.min(33, Math.round((count / 3) * 33));
          const remaining = 4 - count;
          return {
            level: 1,
            title: isEn ? 'Acquaintance 🐾' : 'Tanışıklık 🐾',
            color: Colors.level1,
            badgeBg: Colors.level1Bg,
            progressPercent: progress,
            description: isEn
              ? 'First steps taken, your bond is growing.'
              : 'İlk adımlar atıldı, bağınız güçleniyor.',
            nextTargetText: isEn
              ? `${remaining} more interactions to 'Friend' level.`
              : `'Dost' seviyesine ${remaining} etkileşim kaldı.`,
            remainingCount: remaining,
          };
        }

        return {
          level: 0,
          title: isEn ? 'New Encounter 🌱' : 'Yeni Tanışma 🌱',
          color: Colors.green,
          badgeBg: Colors.greenLight,
          progressPercent: 5,
          description: isEn
            ? 'No interactions recorded yet.'
            : 'Henüz bir etkileşim girilmedi.',
          nextTargetText: isEn
            ? "Give some food or affection for 'Acquaintance'!"
            : "'Tanışıklık' için ilk mamayı veya sevgiyi ver!",
          remainingCount: 1,
        };
      },

      /**
       * Köpekler için Bağ Seviyesi (Özelleştirilmiş Sadakat Dereceleri)
       */
      getDogBondLevelInfo: (interactionCount = 0, langParam = null) => {
        const count =
          typeof interactionCount === 'number'
            ? interactionCount
            : interactionCount?.length || 0;
        const isEn = (langParam || get().language) === 'en';

        if (count >= 9) {
          return {
            level: 3,
            title: isEn ? 'Soul Companion 💖' : 'Can Yoldaşı 💖',
            color: Colors.level3,
            badgeBg: Colors.level3Bg,
            progressPercent: 100,
            description: isEn
              ? 'This loyal friend is now part of your heart and family!'
              : 'Bu sadık dost artık senin ailenden ve canından biri!',
            nextTargetText: isEn
              ? 'Highest loyalty and bond level achieved! 🌟'
              : 'En yüksek sadakat ve bağ seviyesine ulaşıldı! 🌟',
            remainingCount: 0,
          };
        } else if (count >= 4) {
          const progress = Math.min(100, Math.round(33 + ((count - 3) / 5) * 66));
          const remaining = 9 - count;
          return {
            level: 2,
            title: isEn ? 'Loyal Friend 🐕' : 'Sadık Dost 🐕',
            color: Colors.level2,
            badgeBg: Colors.level2Bg,
            progressPercent: progress,
            description: isEn
              ? 'Wags tail happily when seeing you, you have a great bond!'
              : 'Seni görünce neşeyle kuyruk sallıyor, aranızda harika bir bağ var!',
            nextTargetText: isEn
              ? `${remaining} more interactions to 'Soul Companion'.`
              : `'Can Yoldaşı' seviyesine ${remaining} etkileşim kaldı.`,
            remainingCount: remaining,
          };
        } else if (count >= 1) {
          const progress = Math.min(33, Math.round((count / 3) * 33));
          const remaining = 4 - count;
          return {
            level: 1,
            title: isEn ? 'Acquaintance 🐾' : 'Tanışıklık 🐾',
            color: Colors.level1,
            badgeBg: Colors.level1Bg,
            progressPercent: progress,
            description: isEn
              ? 'First steps taken, slowly getting warm to you.'
              : 'İlk adımlar atıldı, yavaş yavaş sana ısınıyor.',
            nextTargetText: isEn
              ? `${remaining} more interactions to 'Loyal Friend'.`
              : `'Sadık Dost' seviyesine ${remaining} etkileşim kaldı.`,
            remainingCount: remaining,
          };
        }

        return {
          level: 0,
          title: isEn ? 'New Encounter 🌱' : 'Yeni Tanışma 🌱',
          color: Colors.green,
          badgeBg: Colors.greenLight,
          progressPercent: 5,
          description: isEn
            ? 'No interactions recorded yet.'
            : 'Henüz bir etkileşim girilmedi.',
          nextTargetText: isEn
            ? "Give some food or take a walk for 'Acquaintance'!"
            : "'Tanışıklık' için ilk mamayı veya yürüyüşü yap!",
          remainingCount: 1,
        };
      },
    }),
    {
      // KURAL 2 & 4: Resmi persist + createJSONStorage + AsyncStorage kurulumu.
      // Yalnızca yerel veritabanındaki (AsyncStorage) kullanıcı verileri okunur ve korunur.
      name: 'street-animal-local-db-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cats: Array.isArray(state.cats) ? state.cats : [],
        dogs: Array.isArray(state.dogs) ? state.dogs : [],
        theme: state.theme || 'light',
        language: state.language || 'tr',
      }),
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }
        return {
          ...currentState,
          ...persistedState,
          cats: Array.isArray(persistedState.cats) ? persistedState.cats : currentState.cats,
          dogs: Array.isArray(persistedState.dogs) ? persistedState.dogs : currentState.dogs,
          theme: persistedState.theme || currentState.theme,
          language: persistedState.language || currentState.language,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

export default useCatStore;
