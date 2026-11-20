import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';
import useAppTheme from '../theme/useAppTheme';

export default function VetListScreen({ navigation }) {
  const vets = useCatStore((state) => state.vets || []);
  const cats = useCatStore((state) => state.cats || []);
  const dogs = useCatStore((state) => state.dogs || []);
  const addVet = useCatStore((state) => state.addVet);
  const deleteVet = useCatStore((state) => state.deleteVet);
  const { isDark, colors, t, language } = useAppTheme();

  // Arama metni
  const [searchQuery, setSearchQuery] = useState('');

  // Bölge filtresi ('all' | bölge adı)
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Yeni veteriner ekleme modalı durumu
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Yeni veteriner form alanları
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newClinicName, setNewClinicName] = useState('');
  const [newRegionName, setNewRegionName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('');
  const [newWorkingHours, setNewWorkingHours] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newServices, setNewServices] = useState('');
  const [selectedAnimalIds, setSelectedAnimalIds] = useState([]);

  // Mevcut tüm benzersiz bölgeler
  const availableRegions = useMemo(() => {
    const set = new Set();
    vets.forEach((v) => {
      if (v.regionName) set.add(v.regionName);
    });
    return Array.from(set);
  }, [vets]);

  // Arama ve bölgeye göre filtrelenmiş veterinerler
  const filteredVets = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase('tr');

    return vets.filter((vet) => {
      // Bölge filtresi
      if (selectedRegion !== 'all' && vet.regionName !== selectedRegion) {
        return false;
      }

      if (!q) return true;

      const nameMatch = (vet.name || '').toLocaleLowerCase('tr').includes(q);
      const clinicMatch = (vet.clinicName || '').toLocaleLowerCase('tr').includes(q);
      const regionMatch = (vet.regionName || '').toLocaleLowerCase('tr').includes(q);
      const titleMatch = (vet.title || '').toLocaleLowerCase('tr').includes(q);

      return nameMatch || clinicMatch || regionMatch || titleMatch;
    });
  }, [vets, searchQuery, selectedRegion]);

  // Bir veterinerin sorumlu olduğu patili dostları bulma
  const getAssignedAnimalsForVet = (vet) => {
    const all = [
      ...cats.map((c) => ({ ...c, isDog: false })),
      ...dogs.map((d) => ({ ...d, isDog: true })),
    ];

    return all.filter((animal) => {
      if (Array.isArray(vet.assignedAnimalIds) && vet.assignedAnimalIds.includes(animal.id)) {
        return true;
      }
      const animalRegion =
        typeof animal.location === 'object'
          ? animal.location?.regionName
          : animal.location;
      return (
        animalRegion &&
        vet.regionName &&
        animalRegion.trim().toLocaleLowerCase('tr') === vet.regionName.trim().toLocaleLowerCase('tr')
      );
    });
  };

  // Telefon arama eylemi
  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert(
        language === 'en' ? 'No Phone' : 'Numara Yok',
        language === 'en' ? 'No phone number registered for this clinic.' : 'Bu klinik için telefon numarası kayıtlı değil.'
      );
      return;
    }
    const cleanNum = phoneNumber.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNum}`).catch(() => {
      Alert.alert(
        language === 'en' ? 'Call Error' : 'Arama Hatası',
        language === 'en' ? 'Unable to make phone call.' : 'Arama başlatılamadı.'
      );
    });
  };

  // Yeni veteriner kaydetme
  const handleSaveVet = () => {
    if (!newName.trim() || !newClinicName.trim() || !newRegionName.trim()) {
      Alert.alert(
        language === 'en' ? 'Missing Information' : 'Eksik Bilgi',
        language === 'en'
          ? 'Please enter Doctor Name, Clinic Name, and Responsible District.'
          : 'Lütfen Hekim Adı, Klinik Adı ve Sorumlu Bölge alanlarını doldurun.'
      );
      return;
    }

    const servicesList = newServices
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addVet({
      name: newName,
      title: newTitle || (language === 'en' ? 'Veterinary Surgeon' : 'Veteriner Hekim'),
      clinicName: newClinicName,
      regionName: newRegionName,
      address: newAddress,
      phone: newPhone,
      emergencyPhone: newEmergencyPhone,
      workingHours: newWorkingHours || '09:00 - 19:00',
      notes: newNotes,
      services: servicesList.length > 0 ? servicesList : ['Rutin Muayene', 'Aşı Takibi', 'Parazit Tedavisi'],
      assignedAnimalIds: selectedAnimalIds,
    });

    // Formu temizle ve kapat
    setNewName('');
    setNewTitle('');
    setNewClinicName('');
    setNewRegionName('');
    setNewAddress('');
    setNewPhone('');
    setNewEmergencyPhone('');
    setNewWorkingHours('');
    setNewNotes('');
    setNewServices('');
    setSelectedAnimalIds([]);
    setIsAddModalOpen(false);
  };

  const toggleAnimalSelection = (animalId) => {
    setSelectedAnimalIds((prev) =>
      prev.includes(animalId) ? prev.filter((id) => id !== animalId) : [...prev, animalId]
    );
  };

  const allAnimalsList = useMemo(() => [
    ...cats.map((c) => ({ ...c, isDog: false })),
    ...dogs.map((d) => ({ ...d, isDog: true })),
  ], [cats, dogs]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. ÜST ARAMA VE EKLEME ÇUBUĞU */}
      <View style={[styles.topBar, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? colors.background : '#F3F4F6' }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t.vetSearchPlaceholder}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Yeni Veteriner Ekle Butonu */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>
            {language === 'en' ? 'Add' : 'Ekle'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. BÖLGE FİLTRE BUTONLARI (CHIPS) */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedRegion === 'all'
                ? { backgroundColor: Colors.primary, borderColor: Colors.primary }
                : { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
            onPress={() => setSelectedRegion('all')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedRegion === 'all'
                  ? { color: '#FFFFFF', fontWeight: '800' }
                  : { color: colors.text },
              ]}
            >
              📍 {t.vetFilterAll} ({vets.length})
            </Text>
          </TouchableOpacity>

          {availableRegions.map((region) => {
            const count = vets.filter((v) => v.regionName === region).length;
            const isSelected = selectedRegion === region;
            return (
              <TouchableOpacity
                key={region}
                style={[
                  styles.filterChip,
                  isSelected
                    ? { backgroundColor: Colors.primary, borderColor: Colors.primary }
                    : { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
                onPress={() => setSelectedRegion(region)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected
                      ? { color: '#FFFFFF', fontWeight: '800' }
                      : { color: colors.text },
                  ]}
                >
                  {region} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. VETERİNER KARTLARI LİSTESİ */}
      <FlatList
        data={filteredVets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 44, marginBottom: 12 }}>🩺</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t.vetEmptyList}</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {t.vetEmptyListSub}
            </Text>
            <TouchableOpacity
              style={[styles.emptyAddBtn, { backgroundColor: Colors.primary }]}
              onPress={() => setIsAddModalOpen(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyAddBtnText}>{t.navAddVet}</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const assignedAnimals = getAssignedAnimalsForVet(item);

          return (
            <TouchableOpacity
              style={[
                styles.vetCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isDark ? colors.cardBorder : '#E5E7EB',
                },
              ]}
              onPress={() =>
                navigation.navigate('VetDetail', {
                  vetId: item.id,
                  vetName: item.name,
                })
              }
              activeOpacity={0.88}
            >
              {/* Üst Kısım: Foto / Avatar + İsim + Klinik */}
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  {item.photoUri ? (
                    <Image source={{ uri: item.photoUri }} style={styles.avatarImage} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? colors.primaryLight : '#EFF6FF' }]}>
                      <Text style={{ fontSize: 28 }}>{item.avatarEmoji || '🩺'}</Text>
                    </View>
                  )}
                  <View style={styles.medicalBadge}>
                    <Ionicons name="medkit" size={12} color="#FFFFFF" />
                  </View>
                </View>

                <View style={styles.headerTexts}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.vetName, { color: colors.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={[styles.vetTitle, { color: Colors.primary }]} numberOfLines={1}>
                    {item.title || 'Veteriner Hekim'}
                  </Text>
                  <Text style={[styles.clinicName, { color: colors.textSecondary }]} numberOfLines={1}>
                    🏥 {item.clinicName}
                  </Text>
                </View>
              </View>

              {/* Bölge & Çalışma Saatleri */}
              <View style={styles.infoRow}>
                <View style={[styles.badgePill, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                  <Ionicons name="location" size={13} color="#3B82F6" />
                  <Text style={[styles.badgeText, { color: '#3B82F6' }]}>
                    {item.regionName}
                  </Text>
                </View>

                {item.workingHours ? (
                  <View style={[styles.badgePill, { backgroundColor: isDark ? '#1E293B' : '#F3F4F6' }]}>
                    <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                    <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                      {item.workingHours}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Sorumlu Olduğu Patili Dostlar Özeti */}
              <View style={[styles.assignedSection, { borderTopColor: isDark ? colors.cardBorder : '#F3F4F6' }]}>
                <View style={styles.assignedHeader}>
                  <Text style={[styles.assignedTitle, { color: colors.textSecondary }]}>
                    {t.vetAssignedPawsTitle} ({assignedAnimals.length})
                  </Text>
                </View>

                {assignedAnimals.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.animalChipRow}>
                    {assignedAnimals.map((animal) => (
                      <TouchableOpacity
                        key={animal.id}
                        style={[
                          styles.animalMiniChip,
                          {
                            backgroundColor: isDark ? colors.background : '#F9FAFB',
                            borderColor: animal.isDog ? '#FDE68A' : '#FFD9CB',
                          },
                        ]}
                        onPress={() => {
                          if (animal.isDog) {
                            navigation.navigate('DogDetail', { dogId: animal.id, dogName: animal.name });
                          } else {
                            navigation.navigate('CatDetail', { catId: animal.id, catName: animal.name });
                          }
                        }}
                      >
                        <Text style={{ fontSize: 13, marginRight: 4 }}>
                          {animal.isDog ? '🐶' : '🐱'}
                        </Text>
                        <Text style={[styles.animalMiniName, { color: colors.text }]}>
                          {animal.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={[styles.noAnimalsText, { color: colors.textMuted }]}>
                    {t.vetNoAssignedPaws}
                  </Text>
                )}
              </View>

              {/* Alt Eylemler: Ara & Detay */}
              <View style={styles.cardActions}>
                {item.phone ? (
                  <TouchableOpacity
                    style={[styles.callBtn, { borderColor: isDark ? colors.cardBorder : '#E5E7EB' }]}
                    onPress={() => handleCall(item.phone)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call" size={15} color="#10B981" />
                    <Text style={styles.callBtnText}>{t.vetCallClinic}</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={[styles.detailBtn, { backgroundColor: Colors.primary }]}
                  onPress={() =>
                    navigation.navigate('VetDetail', {
                      vetId: item.id,
                      vetName: item.name,
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.detailBtnText}>{t.responsibleVetDetailBtn}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* 4. YENİ VETERİNER EKLEME MODALI */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.modalContainer, { backgroundColor: colors.background }]}
        >
          {/* Modal Başlık */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.cardBorder }]}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t.vetAddTitle}</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                {t.vetAddSubtitle}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeModalBtn, { backgroundColor: isDark ? colors.card : '#F3F4F6' }]}
              onPress={() => setIsAddModalOpen(false)}
            >
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            {/* Hekim Adı */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetNameLabel}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                placeholder={t.vetNamePlaceholder}
                placeholderTextColor={colors.textMuted}
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            {/* Uzmanlık / Görev */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetTitleLabel}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                placeholder={t.vetTitlePlaceholder}
                placeholderTextColor={colors.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>

            {/* Klinik Adı */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetClinicLabel}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                placeholder={t.vetClinicPlaceholder}
                placeholderTextColor={colors.textMuted}
                value={newClinicName}
                onChangeText={setNewClinicName}
              />
            </View>

            {/* Sorumlu Olduğu Bölge */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetRegionLabel}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                placeholder={t.vetRegionPlaceholder}
                placeholderTextColor={colors.textMuted}
                value={newRegionName}
                onChangeText={setNewRegionName}
              />
            </View>

            {/* Telefon & Acil Hat */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetPhoneLabel}</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                  placeholder={t.vetPhonePlaceholder}
                  placeholderTextColor={colors.textMuted}
                  value={newPhone}
                  onChangeText={setNewPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetEmergencyPhoneLabel}</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                  placeholder={t.vetEmergencyPhonePlaceholder}
                  placeholderTextColor={colors.textMuted}
                  value={newEmergencyPhone}
                  onChangeText={setNewEmergencyPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Çalışma Saatleri */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetHoursLabel}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                placeholder={t.vetHoursPlaceholder}
                placeholderTextColor={colors.textMuted}
                value={newWorkingHours}
                onChangeText={setNewWorkingHours}
              />
            </View>

            {/* Sağlanan Hizmetler */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetServicesLabel}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                placeholder={t.vetServicesPlaceholder}
                placeholderTextColor={colors.textMuted}
                value={newServices}
                onChangeText={setNewServices}
              />
            </View>

            {/* Sorumlu Olacağı Hayvanları Seçme */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {language === 'en' ? 'Assign Registered Animals' : 'Sorumlu Olacağı Hayvanları Seçin'}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginTop: 4 }}>
                {allAnimalsList.map((animal) => {
                  const isSelected = selectedAnimalIds.includes(animal.id);
                  return (
                    <TouchableOpacity
                      key={animal.id}
                      style={[
                        styles.animalSelectChip,
                        isSelected
                          ? { backgroundColor: Colors.primary, borderColor: Colors.primary }
                          : { backgroundColor: colors.card, borderColor: colors.cardBorder },
                      ]}
                      onPress={() => toggleAnimalSelection(animal.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontSize: 13, marginRight: 4 }}>
                        {animal.isDog ? '🐶' : '🐱'}
                      </Text>
                      <Text
                        style={[
                          styles.animalSelectChipText,
                          isSelected ? { color: '#FFFFFF', fontWeight: '700' } : { color: colors.text },
                        ]}
                      >
                        {animal.name}
                      </Text>
                      {isSelected ? (
                        <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Notlar & Misyon */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{t.vetNotesLabel}</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  styles.modalTextArea,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text },
                ]}
                placeholder={t.vetNotesPlaceholder}
                placeholderTextColor={colors.textMuted}
                value={newNotes}
                onChangeText={setNewNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Kaydet Butonu */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
              onPress={handleSaveVet}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>{t.vetSubmitBtn}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 20,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  filterSection: {
    paddingVertical: 8,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  vetCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicalBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTexts: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vetName: {
    fontSize: 16,
    fontWeight: '800',
  },
  vetTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  clinicName: {
    fontSize: 13,
    marginTop: 3,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  assignedSection: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 12,
  },
  assignedHeader: {
    marginBottom: 6,
  },
  assignedTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  animalChipRow: {
    flexDirection: 'row',
  },
  animalMiniChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
  },
  animalMiniName: {
    fontSize: 12,
    fontWeight: '700',
  },
  noAnimalsText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    gap: 6,
  },
  callBtnText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 13,
  },
  detailBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 19,
  },
  detailBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeModalBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  inputGroup: {
    gap: 6,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  modalTextArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  animalSelectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  animalSelectChipText: {
    fontSize: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
