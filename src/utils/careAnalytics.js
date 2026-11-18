/**
 * Mahalle Dostları (Street Cat & Dog Tracker) - Pati Karnesi & İlgi Özeti Analiz Yardımcıları
 *
 * Bu modül, yerel veritabanındaki (cats ve dogs) kayıtları tarayarak:
 * 1. Toplam metrikleri (toplam can, etkileşim, tamamlanan/planlanan aşı)
 * 2. Mahalle / Konum bazlı bakım ve işlem dağılımını
 * 3. Kedi ve köpek ırkı / türüne göre bakım ve ilgi dağılımını
 * 4. En yüksek bağ seviyesine sahip olan dostumuzu
 * güvenli (defensive) ve reaktif şekilde hesaplar.
 */

function calculateBondLevel(interactionCount = 0) {
  const safeCount =
    typeof interactionCount === 'number' && interactionCount > 0
      ? Math.floor(interactionCount)
      : 0;
  const progressPercent = Math.min(safeCount * 10, 100);
  const level = Math.min(Math.floor(safeCount / 2) + 1, 5);

  return {
    interactionCount: safeCount,
    progressPercent,
    level,
  };
}

function calculateCareAnalytics(cats = [], dogs = []) {
  const safeCats = Array.isArray(cats) ? cats : [];
  const safeDogs = Array.isArray(dogs) ? dogs : [];

  const allAnimals = [
    ...safeCats.map((c) => ({ ...c, species: 'cat' })),
    ...safeDogs.map((d) => ({ ...d, species: 'dog' })),
  ];

  let totalInteractions = 0;
  let completedVaccinesCount = 0;
  let scheduledVaccinesCount = 0;
  let topFriend = null;

  // 1. Konum / Mahalle Bazlı Dağılım Haritası
  const locationMap = {};

  // 2. Kedi Türü / Cinsine Göre Bakım Dağılım Haritası
  const breedMap = {};

  // 3. Etkileşim Türü Sayacı
  const interactionTypeCounts = {
    feeding: 0,
    water: 0,
    petting: 0,
    playing: 0,
    walking: 0,
    health: 0,
    other: 0,
  };

  for (const animal of allAnimals) {
    if (!animal || typeof animal !== 'object') continue;

    const interactionsList = Array.isArray(animal.interactionHistory)
      ? animal.interactionHistory
      : Array.isArray(animal.interactions)
      ? animal.interactions
      : [];
    const interactionsLen = interactionsList.length;

    const vaccinesList = Array.isArray(animal.vaccinations)
      ? animal.vaccinations
      : Array.isArray(animal.vaccines)
      ? animal.vaccines
      : [];
    const vaccinesLen = vaccinesList.length;

    const scheduledList = Array.isArray(animal.scheduledVaccines)
      ? animal.scheduledVaccines
      : [];
    const scheduledLen = scheduledList.length;

    totalInteractions += interactionsLen;
    completedVaccinesCount += vaccinesLen;
    scheduledVaccinesCount += scheduledLen;

    // Etkileşim türlerini ayrıştır
    for (const inter of interactionsList) {
      const type = inter?.type || 'other';
      if (interactionTypeCounts[type] !== undefined) {
        interactionTypeCounts[type]++;
      } else {
        interactionTypeCounts.other++;
      }
    }

    // Konum Çözümleme
    const locName = (
      typeof animal.location === 'object'
        ? animal.location?.regionName
        : animal.location
    )?.trim() || 'Genel Mahalle';

    if (!locationMap[locName]) {
      locationMap[locName] = {
        regionName: locName,
        totalAnimals: 0,
        catsCount: 0,
        dogsCount: 0,
        interactionsCount: 0,
        vaccinesCount: 0,
      };
    }
    locationMap[locName].totalAnimals++;
    if (animal.species === 'cat') {
      locationMap[locName].catsCount++;
    } else {
      locationMap[locName].dogsCount++;
    }
    locationMap[locName].interactionsCount += interactionsLen;
    locationMap[locName].vaccinesCount += vaccinesLen;

    // Tür / Irk Çözümleme (Özellikle Kediler İçin: Tekir, Sarman, Calico vb.)
    const breedName = (animal.breed || (animal.species === 'cat' ? 'Tekir' : 'Melez')).trim();
    if (!breedMap[breedName]) {
      breedMap[breedName] = {
        breed: breedName,
        species: animal.species || 'cat',
        count: 0,
        careActions: 0,
        vaccines: 0,
      };
    }
    breedMap[breedName].count++;
    breedMap[breedName].careActions += interactionsLen;
    breedMap[breedName].vaccines += vaccinesLen;

    // En Yüksek Bağ Tespiti
    if (!topFriend || interactionsLen > topFriend.interactionCount) {
      topFriend = {
        id: animal.id || '',
        name: animal.name || '',
        species: animal.species || 'cat',
        interactionCount: interactionsLen,
      };
    }
  }

  // Konumları en çok hayvan/bakım olan sırayla listeye çevir
  const locationsBreakdown = Object.values(locationMap).sort(
    (a, b) => b.interactionsCount + b.totalAnimals - (a.interactionsCount + a.totalAnimals)
  );

  // Kedi/Köpek türlerini en popüler sırayla listeye çevir
  const breedBreakdown = Object.values(breedMap).sort(
    (a, b) => b.careActions + b.count - (a.careActions + a.count)
  );

  return {
    totalAnimals: allAnimals.length,
    totalCats: safeCats.length,
    totalDogs: safeDogs.length,
    totalInteractions,
    completedVaccinesCount,
    scheduledVaccinesCount,
    topFriend,
    interactionTypeCounts,
    locationsBreakdown,
    breedBreakdown,
  };
}

module.exports = {
  calculateBondLevel,
  calculateCareAnalytics,
};
