const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateBondLevel,
  calculateCareAnalytics,
} = require('../src/utils/careAnalytics');

test('calculateCareAnalytics - boş veritabanında (initial state) sıfır değerlerini döndürmeli', () => {
  const result = calculateCareAnalytics([], []);

  assert.equal(result.totalAnimals, 0);
  assert.equal(result.totalCats, 0);
  assert.equal(result.totalDogs, 0);
  assert.equal(result.totalInteractions, 0);
  assert.equal(result.completedVaccinesCount, 0);
  assert.equal(result.scheduledVaccinesCount, 0);
  assert.equal(result.topFriend, null);
});

test('calculateCareAnalytics - null veya undefined parametrelerde çökmeden güvenli çalışmalı', () => {
  const result = calculateCareAnalytics(null, undefined);

  assert.equal(result.totalAnimals, 0);
  assert.equal(result.totalInteractions, 0);
  assert.equal(result.topFriend, null);
});

test('calculateCareAnalytics - kedi ve köpek etkileşim ile aşı sayılarını doğru toplamalı', () => {
  const mockCats = [
    {
      id: 'cat-1',
      name: 'Pamuk',
      interactions: [{ id: 'i1', type: 'feeding' }, { id: 'i2', type: 'water' }],
      vaccines: [{ id: 'v1', name: 'Kuduz' }],
      scheduledVaccines: [{ id: 'sv1', name: 'Karma' }],
    },
  ];

  const mockDogs = [
    {
      id: 'dog-1',
      name: 'Karabaş',
      interactions: [
        { id: 'i3', type: 'walking' },
        { id: 'i4', type: 'feeding' },
        { id: 'i5', type: 'fetch' },
      ],
      vaccines: [{ id: 'v2', name: 'Kuduz' }, { id: 'v3', name: 'Bronşin' }],
      scheduledVaccines: [],
    },
  ];

  const result = calculateCareAnalytics(mockCats, mockDogs);

  assert.equal(result.totalAnimals, 2);
  assert.equal(result.totalCats, 1);
  assert.equal(result.totalDogs, 1);
  assert.equal(result.totalInteractions, 5);
  assert.equal(result.completedVaccinesCount, 3);
  assert.equal(result.scheduledVaccinesCount, 1);
  assert.deepEqual(result.topFriend, {
    id: 'dog-1',
    name: 'Karabaş',
    species: 'dog',
    interactionCount: 3,
  });
});

test('calculateCareAnalytics - store veri modeliyle (interactionHistory ve vaccinations) eksiksiz calismali', () => {
  const storeCats = [
    {
      id: 'cat-store-1',
      name: 'Mırmır',
      interactionHistory: [{ id: 'int-1', type: 'feeding' }],
      vaccinations: [{ id: 'vac-1', name: 'Kuduz' }, { id: 'vac-2', name: 'Lösemi' }],
      scheduledVaccines: [{ id: 'sch-1', name: 'Parazit' }],
    },
  ];

  const storeDogs = [
    {
      id: 'dog-store-1',
      name: 'Duman',
      interactionHistory: [{ id: 'int-2', type: 'walking' }, { id: 'int-3', type: 'belly_rub' }],
      vaccinations: [{ id: 'vac-3', name: 'Karma' }],
      scheduledVaccines: [],
    },
  ];

  const result = calculateCareAnalytics(storeCats, storeDogs);
  assert.equal(result.totalAnimals, 2);
  assert.equal(result.totalInteractions, 3);
  assert.equal(result.completedVaccinesCount, 3);
  assert.equal(result.scheduledVaccinesCount, 1);
  assert.deepEqual(result.topFriend, {
    id: 'dog-store-1',
    name: 'Duman',
    species: 'dog',
    interactionCount: 2,
  });
});

test('calculateBondLevel - etkileşim sayısına göre bağ yüzdesini ve seviyeyi doğru hesaplamalı', () => {
  const zeroBond = calculateBondLevel(0);
  assert.equal(zeroBond.progressPercent, 0);
  assert.equal(zeroBond.level, 1);

  const midBond = calculateBondLevel(4);
  assert.equal(midBond.progressPercent, 40);
  assert.equal(midBond.level, 3);

  const maxBond = calculateBondLevel(15);
  assert.equal(maxBond.progressPercent, 100);
  assert.equal(maxBond.level, 5);
});
