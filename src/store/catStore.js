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
    locationHistory: [
      {
        id: 'loc-avci-prev-1',
        regionName: 'Bayrampaşa Şehir Parkı',
        latitude: 41.042,
        longitude: 28.891,
        changedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
      },
    ],
    vaccinations: [
      {
        id: 'vac-avci-1',
        name: 'Kuduz Aşısı',
        date: new Date(Date.now() - 86400000 * 90).toISOString().split('T')[0],
        clinic: 'Bayrampaşa Belediyesi Vet. Hizmetleri',
        notes: 'Yıllık rutin kuduz aşısı yapıldı, mikroçip kontrol edildi.',
      },
      {
        id: 'vac-avci-2',
        name: 'İç-Dış Parazit',
        date: new Date(Date.now() - 86400000 * 28).toISOString().split('T')[0],
        clinic: 'Mobil Veteriner',
        notes: 'Ense damlası ve iç parazit hapı uygulandı.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-avci-1',
        name: 'İç-Dış Parazit Tekrarı',
        plannedDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        notes: '3 aylık periyot için ense damlası tekrarlanacak.',
      },
    ],
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
      latitude: 41.025,
      longitude: 28.985,
      regionName: 'Site',
    },
    locationHistory: [
      {
        id: 'loc-habes-prev-1',
        regionName: 'Site B Blok Bahçesi',
        latitude: 41.0245,
        longitude: 28.9845,
        changedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      },
      {
        id: 'loc-habes-prev-2',
        regionName: 'Site Otopark Girişi',
        latitude: 41.0248,
        longitude: 28.9848,
        changedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
      },
    ],
    vaccinations: [
      {
        id: 'vac-habes-1',
        name: 'Karma Aşı (1. Doz)',
        date: new Date(Date.now() - 86400000 * 120).toISOString().split('T')[0],
        clinic: 'Pati Dostu Vet Kliniği',
        notes: 'İlk doz uygulandı, genel sağlık durumu mükemmel.',
      },
      {
        id: 'vac-habes-2',
        name: 'Karma Aşı (2. Doz)',
        date: new Date(Date.now() - 86400000 * 99).toISOString().split('T')[0],
        clinic: 'Pati Dostu Vet Kliniği',
        notes: 'Rapel dozu yapıldı, bağışıklık koruması sağlandı.',
      },
      {
        id: 'vac-habes-3',
        name: 'Kuduz Aşısı',
        date: new Date(Date.now() - 86400000 * 70).toISOString().split('T')[0],
        clinic: 'Pati Dostu Vet Kliniği',
        notes: 'Mikroçip taraması yapıldı, kuduz aşısı işlendi.',
      },
      {
        id: 'vac-habes-4',
        name: 'İç-Dış Parazit',
        date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0],
        clinic: 'Pati Dostu Vet Kliniği',
        notes: 'Boyun damlası yapıldı.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-habes-1',
        name: 'İç-Dış Parazit Tekrarı',
        plannedDate: new Date(Date.now() + 86400000 * 25).toISOString().split('T')[0],
        notes: 'Site sakinleri ortak yaptıracak.',
      },
      {
        id: 'sch-habes-2',
        name: 'Yıllık Karma Aşı Rapeli',
        plannedDate: new Date(Date.now() + 86400000 * 240).toISOString().split('T')[0],
        notes: 'Gelecek yılın karma aşı tekrarı.',
      },
    ],
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
    locationHistory: [
      {
        id: 'loc-prenses-prev-1',
        regionName: 'Beyazıt Kampüs Havuzu Çevresi',
        latitude: 41.0118,
        longitude: 28.9625,
        changedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
    ],
    vaccinations: [
      {
        id: 'vac-prenses-1',
        name: 'Kuduz Aşısı',
        date: new Date(Date.now() - 86400000 * 150).toISOString().split('T')[0],
        clinic: 'Fatih Belediyesi Vet İşleri',
        notes: 'Kulak çentiği ve aşı kontrolü yapıldı.',
      },
      {
        id: 'vac-prenses-2',
        name: 'İç Parazit Hapı',
        date: new Date(Date.now() - 86400000 * 40).toISOString().split('T')[0],
        clinic: 'Öğrenci Kulübü Desteği',
        notes: 'Yaş mama içine toz haline getirilerek verildi.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-prenses-1',
        name: 'Dış Parazit Ense Damlası',
        plannedDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
        notes: 'Bahar başlangıcı için kene/pire koruması yapılacak.',
      },
    ],
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
    locationHistory: [
      {
        id: 'loc-puskul-prev-1',
        regionName: 'İktisat Fakültesi Arka Bahçe',
        latitude: 41.0135,
        longitude: 28.9638,
        changedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      },
    ],
    vaccinations: [
      {
        id: 'vac-puskul-1',
        name: 'Kuduz Aşısı',
        date: new Date(Date.now() - 86400000 * 180).toISOString().split('T')[0],
        clinic: 'İÜ Hayvan Hakları Kulübü Vet İşbirliği',
        notes: 'Kısırlaştırma sonrası kuduz aşısı tamamlandı.',
      },
    ],
    scheduledVaccines: [
      {
        id: 'sch-puskul-1',
        name: 'Karma Aşı & Parazit Kontrolü',
        plannedDate: new Date(Date.now() + 86400000 * 18).toISOString().split('T')[0],
        notes: 'Fakülte bahçesinde sakin bir anda kafese alınarak kontrole götürülecek.',
      },
    ],
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

// Kullanıcı isteği: Şu anlık örnek köpek ekleme (başlangıçta boş liste)
export const INITIAL_DOGS = [];

export const useCatStore = create(
  persist(
    (set, get) => ({
      cats: INITIAL_CATS,
      dogs: INITIAL_DOGS,
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

      // ==========================================
      // KEDİ İŞLEMLERİ (CATS)
      // ==========================================

      addCat: (catData) => {
        const now = new Date().toISOString();
        const newCatId = Date.now().toString();

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
          locationHistory: catData.locationHistory || [],
          vaccinations: catData.vaccinations || [],
          scheduledVaccines: catData.scheduledVaccines || [],
          notes: (catData.notes || '').trim(),
          interactionHistory: initialInteractions,
          createdAt: now,
        };

        set((state) => ({
          cats: [newCat, ...state.cats],
        }));

        get().showToast(`"${newCat.name}" başarıyla kaydedildi! 🐾`, 'success');
        return newCat;
      },

      updateCatInfo: (catId, updatedFields) => {
        const currentCat = get().cats.find((c) => c.id === catId);
        if (!currentCat) return;

        const currentRegion =
          typeof currentCat.location === 'object'
            ? currentCat.location?.regionName
            : currentCat.location;

        let newHistory = Array.isArray(currentCat.locationHistory) ? [...currentCat.locationHistory] : [];

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
              latitude: typeof currentCat.location === 'object' ? currentCat.location?.latitude ?? null : null,
              longitude: typeof currentCat.location === 'object' ? currentCat.location?.longitude ?? null : null,
              changedAt: new Date().toISOString(),
            };
            newHistory = [historyItem, ...newHistory];
          }
        }

        set((state) => ({
          cats: state.cats.map((cat) => {
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

        get().showToast(`"${updatedFields.name || currentCat.name}" bilgileri güncellendi ✨`, 'success');
      },

      updateCatNotes: (id, notes) => {
        set((state) => ({
          cats: state.cats.map((cat) =>
            cat.id === id ? { ...cat, notes: (notes || '').trim() } : cat
          ),
        }));
        get().showToast('Not güncellendi 📝', 'success');
      },

      deleteCat: (id) => {
        const target = get().cats.find((cat) => cat.id === id);
        const catName = target?.name || 'Kedi';

        set((state) => ({
          cats: state.cats.filter((cat) => cat.id !== id),
        }));

        get().showToast(`"${catName}" başarıyla silindi 🗑️`, 'delete');
      },

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

      addVaccination: (catId, vaccinationData) => {
        const newVac = {
          id: `vac-${Date.now()}`,
          name: (vaccinationData.name || '').trim() || 'Aşı',
          date: vaccinationData.date || new Date().toISOString().split('T')[0],
          clinic: (vaccinationData.clinic || '').trim(),
          notes: (vaccinationData.notes || '').trim(),
        };

        set((state) => ({
          cats: state.cats.map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                vaccinations: [newVac, ...(cat.vaccinations || [])],
              };
            }
            return cat;
          }),
        }));

        get().showToast(`Aşı kaydı eklendi: ${newVac.name} 💉`, 'success');
        return newVac;
      },

      scheduleVaccine: (catId, scheduleData) => {
        const newSchedule = {
          id: `sch-${Date.now()}`,
          name: (scheduleData.name || '').trim() || 'Planlanan Aşı',
          plannedDate:
            scheduleData.plannedDate ||
            new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
          notes: (scheduleData.notes || '').trim(),
        };

        set((state) => ({
          cats: state.cats.map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                scheduledVaccines: [newSchedule, ...(cat.scheduledVaccines || [])],
              };
            }
            return cat;
          }),
        }));

        get().showToast(`Gelecek aşı planlandı: ${newSchedule.name} 📅`, 'success');
        return newSchedule;
      },

      completeScheduledVaccine: (catId, scheduledId, completionDetails = {}) => {
        const currentCat = get().cats.find((c) => c.id === catId);
        if (!currentCat) return;

        const targetPlan = (currentCat.scheduledVaccines || []).find((s) => s.id === scheduledId);
        if (!targetPlan) return;

        const completedVac = {
          id: `vac-${Date.now()}`,
          name: targetPlan.name,
          date: completionDetails.completionDate || new Date().toISOString().split('T')[0],
          clinic: (completionDetails.clinic || '').trim() || 'Veteriner Kliniği',
          notes: completionDetails.notes
            ? `${targetPlan.notes ? targetPlan.notes + ' • ' : ''}${completionDetails.notes}`
            : targetPlan.notes || 'Planlanan aşı başarıyla uygulandı',
        };

        set((state) => ({
          cats: state.cats.map((cat) => {
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

      deleteVaccine: (catId, vaccineId, isScheduled = false) => {
        set((state) => ({
          cats: state.cats.map((cat) => {
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

      getCatById: (catId) => {
        return get().cats.find((cat) => cat.id === catId);
      },

      // ==========================================
      // KÖPEK İŞLEMLERİ (DOGS)
      // ==========================================

      addDog: (dogData) => {
        const now = new Date().toISOString();
        const newDogId = `dog-${Date.now()}`;

        const photoList = dogData.photos && dogData.photos.length > 0
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
          locationHistory: dogData.locationHistory || [],
          vaccinations: dogData.vaccinations || [],
          scheduledVaccines: dogData.scheduledVaccines || [],
          notes: (dogData.notes || '').trim(),
          interactionHistory: initialInteractions,
          createdAt: now,
        };

        set((state) => ({
          dogs: [newDog, ...(state.dogs || [])],
        }));

        get().showToast(`"${newDog.name}" başarıyla kaydedildi! 🐶`, 'success');
        return newDog;
      },

      updateDogInfo: (dogId, updatedFields) => {
        const currentDog = (get().dogs || []).find((d) => d.id === dogId);
        if (!currentDog) return;

        const currentRegion =
          typeof currentDog.location === 'object'
            ? currentDog.location?.regionName
            : currentDog.location;

        let newHistory = Array.isArray(currentDog.locationHistory) ? [...currentDog.locationHistory] : [];

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
              latitude: typeof currentDog.location === 'object' ? currentDog.location?.latitude ?? null : null,
              longitude: typeof currentDog.location === 'object' ? currentDog.location?.longitude ?? null : null,
              changedAt: new Date().toISOString(),
            };
            newHistory = [historyItem, ...newHistory];
          }
        }

        set((state) => ({
          dogs: (state.dogs || []).map((dog) => {
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

        get().showToast(`"${updatedFields.name || currentDog.name}" bilgileri güncellendi ✨`, 'success');
      },

      updateDogNotes: (id, notes) => {
        set((state) => ({
          dogs: (state.dogs || []).map((dog) =>
            dog.id === id ? { ...dog, notes: (notes || '').trim() } : dog
          ),
        }));
        get().showToast('Not güncellendi 📝', 'success');
      },

      deleteDog: (id) => {
        const target = (get().dogs || []).find((dog) => dog.id === id);
        const dogName = target?.name || 'Köpek';

        set((state) => ({
          dogs: (state.dogs || []).filter((dog) => dog.id !== id),
        }));

        get().showToast(`"${dogName}" başarıyla silindi 🗑️`, 'delete');
      },

      addPhotoToDog: (id, photoUri) => {
        if (!photoUri) return;
        set((state) => ({
          dogs: (state.dogs || []).map((dog) => {
            if (dog.id === id) {
              const currentPhotos = dog.photos || (dog.photoUri ? [dog.photoUri] : []);
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

      addDogInteraction: (dogId, interactionDetails = {}) => {
        const now = new Date().toISOString();
        const newInteraction = {
          id: `int-${Date.now()}`,
          date: interactionDetails.date || now,
          type: interactionDetails.type || 'feeding',
          note: interactionDetails.note || 'Sadık dostla ilgilenildi 🐕',
        };

        set((state) => ({
          dogs: (state.dogs || []).map((dog) => {
            if (dog.id === dogId) {
              return {
                ...dog,
                interactionHistory: [newInteraction, ...(dog.interactionHistory || [])],
              };
            }
            return dog;
          }),
        }));
      },

      addDogVaccination: (dogId, vaccinationData) => {
        const newVac = {
          id: `vac-${Date.now()}`,
          name: (vaccinationData.name || '').trim() || 'Aşı',
          date: vaccinationData.date || new Date().toISOString().split('T')[0],
          clinic: (vaccinationData.clinic || '').trim(),
          notes: (vaccinationData.notes || '').trim(),
        };

        set((state) => ({
          dogs: (state.dogs || []).map((dog) => {
            if (dog.id === dogId) {
              return {
                ...dog,
                vaccinations: [newVac, ...(dog.vaccinations || [])],
              };
            }
            return dog;
          }),
        }));

        get().showToast(`Aşı kaydı eklendi: ${newVac.name} 💉`, 'success');
        return newVac;
      },

      scheduleDogVaccine: (dogId, scheduleData) => {
        const newSchedule = {
          id: `sch-${Date.now()}`,
          name: (scheduleData.name || '').trim() || 'Planlanan Aşı',
          plannedDate:
            scheduleData.plannedDate ||
            new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
          notes: (scheduleData.notes || '').trim(),
        };

        set((state) => ({
          dogs: (state.dogs || []).map((dog) => {
            if (dog.id === dogId) {
              return {
                ...dog,
                scheduledVaccines: [newSchedule, ...(dog.scheduledVaccines || [])],
              };
            }
            return dog;
          }),
        }));

        get().showToast(`Gelecek aşı planlandı: ${newSchedule.name} 📅`, 'success');
        return newSchedule;
      },

      completeScheduledDogVaccine: (dogId, scheduledId, completionDetails = {}) => {
        const currentDog = (get().dogs || []).find((d) => d.id === dogId);
        if (!currentDog) return;

        const targetPlan = (currentDog.scheduledVaccines || []).find((s) => s.id === scheduledId);
        if (!targetPlan) return;

        const completedVac = {
          id: `vac-${Date.now()}`,
          name: targetPlan.name,
          date: completionDetails.completionDate || new Date().toISOString().split('T')[0],
          clinic: (completionDetails.clinic || '').trim() || 'Veteriner Kliniği',
          notes: completionDetails.notes
            ? `${targetPlan.notes ? targetPlan.notes + ' • ' : ''}${completionDetails.notes}`
            : targetPlan.notes || 'Planlanan aşı başarıyla uygulandı',
        };

        set((state) => ({
          dogs: (state.dogs || []).map((dog) => {
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

      deleteDogVaccine: (dogId, vaccineId, isScheduled = false) => {
        set((state) => ({
          dogs: (state.dogs || []).map((dog) => {
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

      getDogById: (dogId) => {
        return (get().dogs || []).find((dog) => dog.id === dogId);
      },

      clearAllDogs: () => {
        set({ dogs: [] });
      },

      // ==========================================
      // ORTAK / GENEL İŞLEMLER
      // ==========================================

      resetToInitialCats: () => {
        set({ cats: INITIAL_CATS });
      },

      clearAllCats: () => {
        set({ cats: [] });
      },

      /**
       * Kediler için Bağ Seviyesi
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

      /**
       * Köpekler için Bağ Seviyesi (Özelleştirilmiş Sadakat Dereceleri)
       */
      getDogBondLevelInfo: (interactionCount = 0) => {
        const count = typeof interactionCount === 'number' ? interactionCount : (interactionCount?.length || 0);

        if (count >= 9) {
          return {
            level: 3,
            title: 'Can Yoldaşı 💖',
            color: Colors.level3,
            badgeBg: Colors.level3Bg,
            progressPercent: 100,
            description: 'Bu sadık dost artık senin ailenden ve canından biri!',
            nextTargetText: 'En yüksek sadakat ve bağ seviyesine ulaşıldı! 🌟',
            remainingCount: 0,
          };
        } else if (count >= 4) {
          const progress = Math.min(100, Math.round(33 + ((count - 3) / 5) * 66));
          const remaining = 9 - count;
          return {
            level: 2,
            title: 'Sadık Dost 🐕',
            color: Colors.level2,
            badgeBg: Colors.level2Bg,
            progressPercent: progress,
            description: 'Seni görünce neşeyle kuyruk sallıyor, aranızda harika bir bağ var!',
            nextTargetText: `'Can Yoldaşı' seviyesine ${remaining} etkileşim kaldı.`,
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
            description: 'İlk adımlar atıldı, yavaş yavaş sana ısınıyor.',
            nextTargetText: `'Sadık Dost' seviyesine ${remaining} etkileşim kaldı.`,
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
          nextTargetText: "'Tanışıklık' için ilk mamayı veya yürüyüşü yap!",
          remainingCount: 1,
        };
      },
    }),
    {
      name: 'street-paws-tracker-v7-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cats: state.cats,
        dogs: state.dogs || [],
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!Array.isArray(state.dogs)) {
            state.dogs = [];
          }

          if (Array.isArray(state.cats)) {
            state.cats = state.cats.map((cat) => {
              const seedMatch = INITIAL_CATS.find((c) => c.id === cat.id);
              return {
                ...cat,
                locationHistory: cat.locationHistory || seedMatch?.locationHistory || [],
                vaccinations: cat.vaccinations || seedMatch?.vaccinations || [],
                scheduledVaccines: cat.scheduledVaccines || seedMatch?.scheduledVaccines || [],
              };
            });

            INITIAL_CATS.forEach((seedCat) => {
              if (!state.cats.some((c) => c.id === seedCat.id)) {
                state.cats.push(seedCat);
              }
            });
          }
        }
      },
    }
  )
);

export default useCatStore;
