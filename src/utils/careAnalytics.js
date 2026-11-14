/**
 * Mahalle Dostları (Street Cat & Dog Tracker) - Bakım İstatistikleri ve Analiz Yardımcıları
 *
 * Bu modül, yerel veritabanındaki (cats ve dogs) kayıtları tarayarak
 * toplam etkileşim, tamamlanan/planlanan aşı sayıları ve en yüksek bağ
 * seviyesine sahip dostumuzu güvenli (defensive) şekilde hesaplar.
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

  for (const animal of allAnimals) {
    if (!animal || typeof animal !== 'object') continue;

    const interactionsLen = Array.isArray(animal.interactions)
      ? animal.interactions.length
      : 0;
    const vaccinesLen = Array.isArray(animal.vaccines)
      ? animal.vaccines.length
      : 0;
    const scheduledLen = Array.isArray(animal.scheduledVaccines)
      ? animal.scheduledVaccines.length
      : 0;

    totalInteractions += interactionsLen;
    completedVaccinesCount += vaccinesLen;
    scheduledVaccinesCount += scheduledLen;

    if (
      !topFriend ||
      interactionsLen > topFriend.interactionCount
    ) {
      topFriend = {
        id: animal.id || '',
        name: animal.name || '',
        species: animal.species || 'cat',
        interactionCount: interactionsLen,
      };
    }
  }

  return {
    totalAnimals: allAnimals.length,
    totalCats: safeCats.length,
    totalDogs: safeDogs.length,
    totalInteractions,
    completedVaccinesCount,
    scheduledVaccinesCount,
    topFriend,
  };
}

module.exports = {
  calculateBondLevel,
  calculateCareAnalytics,
};
