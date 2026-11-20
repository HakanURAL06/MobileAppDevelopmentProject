import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';
import { Colors } from '../theme/colors';
import useAppTheme from '../theme/useAppTheme';
import { getImageSource } from '../utils/imageHelper';
import { dt } from '../utils/dynamicTranslator';

export default function VetDetailScreen({ route, navigation }) {
  const { vetId } = route.params || {};
  const vets = useCatStore((state) => state.vets || []);
  const cats = useCatStore((state) => state.cats || []);
  const dogs = useCatStore((state) => state.dogs || []);
  const updateVet = useCatStore((state) => state.updateVet);
  const deleteVet = useCatStore((state) => state.deleteVet);
  const { isDark, colors, t, language } = useAppTheme();

  // Hedef veterineri bul
  const vet = vets.find((v) => v.id === vetId);

  // Düzenleme modalı durumu
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(vet?.name || '');
  const [editTitle, setEditTitle] = useState(vet?.title || '');
  const [editClinicName, setEditClinicName] = useState(vet?.clinicName || '');
  const [editRegionName, setEditRegionName] = useState(vet?.regionName || '');
  const [editPhone, setEditPhone] = useState(vet?.phone || '');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(vet?.emergencyPhone || '');
  const [editWorkingHours, setEditWorkingHours] = useState(vet?.workingHours || '');
  const [editNotes, setEditNotes] = useState(vet?.notes || '');
  const [editAddress, setEditAddress] = useState(vet?.address || '');
  const [editLatitude, setEditLatitude] = useState(vet?.latitude ? vet.latitude.toString() : '');
  const [editLongitude, setEditLongitude] = useState(vet?.longitude ? vet.longitude.toString() : '');

  if (!vet) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: 44, marginBottom: 12 }}>🩺</Text>
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          {language === 'en' ? 'Veterinarian Not Found' : 'Veteriner Hekim Bulunamadı'}
        </Text>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>{t.navBack}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Bu hekime veya bölgesine bağlı hayvanlar
  const allAnimals = [
    ...cats.map((c) => ({ ...c, isDog: false })),
    ...dogs.map((d) => ({ ...d, isDog: true })),
  ];

  const assignedAnimals = allAnimals.filter((animal) => {
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

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert(
        language === 'en' ? 'No Phone' : 'Numara Yok',
        language === 'en' ? 'No phone number registered.' : 'Bu numara kayıtlı değil.'
      );
      return;
    }
    // Sahte/Simülasyon numarası kontrolü
    if (phoneNumber.includes('000') || phoneNumber.includes('Temsili') || phoneNumber.includes('Simülasyon')) {
      Alert.alert(
        language === 'en' ? 'Simulated Academic Line 🩺' : 'Temsili Simülasyon Hattı 🩺',
        language === 'en'
          ? `Selected phone (${phoneNumber}) is a fictional demo number created for Mobile App Development project. No actual call is initiated.`
          : `Aranan numara (${phoneNumber}) Mobile App Development proje ödevi kapsamında kurgulanmış temsili bir simülasyon numarasıdır. Gerçek arama yapılmaz.`
      );
      return;
    }
    const cleanNum = phoneNumber.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNum}`).catch(() => {
      Alert.alert(
        language === 'en' ? 'Call Error' : 'Arama Hatası',
        language === 'en' ? 'Unable to place call.' : 'Arama başlatılamadı.'
      );
    });
  };

  const handleOpenEdit = () => {
    setEditName(vet.name || '');
    setEditTitle(vet.title || '');
    setEditClinicName(vet.clinicName || '');
    setEditRegionName(vet.regionName || '');
    setEditPhone(vet.phone || '');
    setEditEmergencyPhone(vet.emergencyPhone || '');
    setEditWorkingHours(vet.workingHours || '');
    setEditNotes(vet.notes || '');
    setEditAddress(vet.address || '');
    setEditLatitude(vet.latitude ? vet.latitude.toString() : '');
    setEditLongitude(vet.longitude ? vet.longitude.toString() : '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editClinicName.trim()) {
      Alert.alert(
        language === 'en' ? 'Missing Information' : 'Eksik Bilgi',
        language === 'en' ? 'Name and Clinic Name are required.' : 'Hekim adı ve klinik adı gereklidir.'
      );
      return;
    }

    updateVet(vet.id, {
      name: editName.trim(),
      title: editTitle.trim(),
      clinicName: editClinicName.trim(),
      regionName: editRegionName.trim(),
      phone: editPhone.trim(),
      emergencyPhone: editEmergencyPhone.trim(),
      workingHours: editWorkingHours.trim(),
      notes: editNotes.trim(),
      address: editAddress.trim(),
      latitude: editLatitude ? parseFloat(editLatitude) : null,
      longitude: editLongitude ? parseFloat(editLongitude) : null,
    });

    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    Alert.alert(
      language === 'en' ? 'Delete Record' : 'Kaydı Sil',
      language === 'en'
        ? `Are you sure you want to remove "${vet.name}"?`
        : `"${vet.name}" hekim kaydını silmek istediğinize emin misiniz?`,
      [
        { text: language === 'en' ? 'Cancel' : 'Vazgeç', style: 'cancel' },
        {
          text: language === 'en' ? 'Delete' : 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteVet(vet.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 1. ÜST PROFİL KARTI */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.card,
            borderColor: isDark ? colors.cardBorder : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.avatarRow}>
          {vet.photoUri ? (
            <Image source={{ uri: vet.photoUri }} style={styles.avatarLarge} />
          ) : (
            <View style={[styles.avatarPlaceholderLarge, { backgroundColor: isDark ? colors.primaryLight : '#EFF6FF' }]}>
              <Text style={{ fontSize: 44 }}>{vet.avatarEmoji || '🩺'}</Text>
            </View>
          )}

          <View style={styles.profileTextWrapper}>
            <View style={styles.titleEditRow}>
              <Text style={[styles.vetNameLarge, { color: colors.text }]}>{vet.name}</Text>
              <TouchableOpacity onPress={handleOpenEdit} style={styles.editIconBtn}>
                <Ionicons name="pencil" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Text style={[styles.vetTitleText, { color: Colors.primary }]}>
                {dt(vet.title, language) || (language === 'en' ? 'Veterinary Surgeon (Simulated)' : 'Veteriner Hekim (Temsili)')}
              </Text>
              <View style={[styles.academicPill, { backgroundColor: '#4F46E5' }]}>
                <Text style={styles.academicPillText}>{language === 'en' ? 'Demo' : 'Temsili'}</Text>
              </View>
            </View>
            <Text style={[styles.clinicNameText, { color: colors.textSecondary }]}>
              🏥 {dt(vet.clinicName, language)}
            </Text>
            <View style={[styles.regionBadge, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
              <Ionicons name="location" size={13} color="#3B82F6" />
              <Text style={[styles.regionBadgeText, { color: '#3B82F6' }]}>
                {dt(vet.regionName, language)}
              </Text>
            </View>
          </View>
        </View>

        {/* Hızlı Arama Butonları */}
        <View style={styles.actionButtonsRow}>
          {vet.phone ? (
            <TouchableOpacity
              style={[styles.primaryCallBtn, { backgroundColor: '#10B981' }]}
              onPress={() => handleCall(vet.phone)}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.primaryCallBtnText}>{t.vetCallClinic}</Text>
            </TouchableOpacity>
          ) : null}

          {vet.emergencyPhone ? (
            <TouchableOpacity
              style={[styles.emergencyCallBtn, { backgroundColor: '#EF4444' }]}
              onPress={() => handleCall(vet.emergencyPhone)}
              activeOpacity={0.85}
            >
              <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
              <Text style={styles.emergencyCallBtnText}>{t.vetEmergencyCall}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 2. KLİNİK DETAYLARI & ÇALIŞMA SAATLERİ */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.card,
            borderColor: isDark ? colors.cardBorder : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="time" size={18} color={Colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.vetWorkingHours} & {language === 'en' ? 'Address' : 'Adres'}
          </Text>
        </View>

        <View style={styles.infoItemRow}>
          <Ionicons name="alarm-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoItemText, { color: colors.text }]}>
            {vet.workingHours || (language === 'en' ? '09:00 - 19:30 (Every Day)' : '09:00 - 19:30 (Haftanın 7 Günü)')}
          </Text>
        </View>

        {vet.address ? (
          <View style={styles.infoItemRow}>
            <Ionicons name="map-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoItemText, { color: colors.text }]}>{vet.address}</Text>
          </View>
        ) : null}

        {vet.phone ? (
          <View style={styles.infoItemRow}>
            <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoItemText, { color: colors.text }]}>{vet.phone}</Text>
          </View>
        ) : null}
      </View>

      {/* 3. SORUMLU OLDUĞU PATİLİ DOSTLAR LİSTESİ */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.card,
            borderColor: isDark ? colors.cardBorder : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={{ fontSize: 18 }}>🐾</Text>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.vetAssignedPawsTitle} ({assignedAnimals.length})
          </Text>
        </View>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          {language === 'en'
            ? 'Street animals under the regular care and vaccination plan of this veterinarian'
            : 'Bu hekimin düzenli aşı, besleme ve sağlık takibinde olan sokak dostlarımız'}
        </Text>

        {assignedAnimals.length > 0 ? (
          <View style={styles.animalListGrid}>
            {assignedAnimals.map((animal) => {
              const imageSource = getImageSource(animal.photoUri || animal.photos?.[0]);
              return (
                <TouchableOpacity
                  key={animal.id}
                  style={[
                    styles.animalCard,
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
                  activeOpacity={0.85}
                >
                  {imageSource ? (
                    <Image source={imageSource} style={styles.animalThumb} />
                  ) : (
                    <View style={styles.animalThumbFallback}>
                      <Text style={{ fontSize: 24 }}>{animal.isDog ? '🐶' : '🐱'}</Text>
                    </View>
                  )}
                  <View style={styles.animalCardBody}>
                    <View style={styles.animalNameRow}>
                      <Text style={[styles.animalNameText, { color: colors.text }]}>
                        {animal.name}
                      </Text>
                      <Text style={{ fontSize: 13 }}>{animal.isDog ? '🐶' : '🐱'}</Text>
                    </View>
                    <Text style={[styles.animalBreedText, { color: colors.textSecondary }]} numberOfLines={1}>
                      {dt(animal.breed, language)}
                    </Text>
                    <Text style={[styles.animalGotoLink, { color: Colors.primary }]}>
                      {language === 'en' ? 'View Details ➔' : 'Profili Gör ➔'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyAssignedBox}>
            <Text style={[styles.emptyAssignedText, { color: colors.textMuted }]}>
              {t.vetNoAssignedPaws}
            </Text>
          </View>
        )}
      </View>

      {/* 4. SAĞLANAN HİZMETLER */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.card,
            borderColor: isDark ? colors.cardBorder : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="shield-checkmark" size={18} color="#10B981" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.vetServicesTitle}
          </Text>
        </View>

        <View style={styles.servicesGrid}>
          {(vet.services || ['Rutin Muayene', 'Aşı Takibi', 'Parazit Tedavisi']).map((service, index) => (
            <View
              key={index}
              style={[
                styles.servicePill,
                { backgroundColor: isDark ? '#064E3B' : '#ECFDF5', borderColor: isDark ? '#047857' : '#A7F3D0' },
              ]}
            >
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={[styles.servicePillText, { color: isDark ? '#A7F3D0' : '#065F46' }]}>
                {dt(service, language)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 5. BÖLGE MİSYONU & NOTLAR */}
      {vet.notes ? (
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: isDark ? colors.cardBorder : '#E5E7EB',
            },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="document-text" size={18} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t.vetMissionTitle}
            </Text>
          </View>
          <Text style={[styles.notesText, { color: colors.text }]}>{dt(vet.notes, language)}</Text>
        </View>
      ) : null}

      {/* 6. SİL BUTONU */}
      <TouchableOpacity
        style={[styles.deleteBtn, { borderColor: isDark ? colors.cardBorder : '#FEE2E2' }]}
        onPress={handleDelete}
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={16} color="#EF4444" />
        <Text style={styles.deleteBtnText}>
          {language === 'en' ? 'Delete Veterinarian Record' : 'Veteriner Hekim Kaydını Sil'}
        </Text>
      </TouchableOpacity>

      {/* DÜZENLEME MODALI */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={[styles.modalWrapper, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.cardBorder }]}>
            <Text style={[styles.modalTitleText, { color: colors.text }]}>
              {language === 'en' ? 'Edit Clinic Info' : 'Hekim & Klinik Bilgilerini Düzenle'}
            </Text>
            <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetNameLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                value={editName}
                onChangeText={setEditName}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetTitleLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                value={editTitle}
                onChangeText={setEditTitle}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetClinicLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                value={editClinicName}
                onChangeText={setEditClinicName}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetRegionLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                value={editRegionName}
                onChangeText={setEditRegionName}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetPhoneLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                value={editPhone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetEmergencyPhoneLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                value={editEmergencyPhone}
                onChangeText={setEditEmergencyPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetHoursLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                value={editWorkingHours}
                onChangeText={setEditWorkingHours}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetAddressLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                value={editAddress}
                onChangeText={setEditAddress}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[styles.inputField, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>{language === 'en' ? 'Latitude' : 'Enlem'}</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                  value={editLatitude}
                  onChangeText={setEditLatitude}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputField, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>{language === 'en' ? 'Longitude' : 'Boylam'}</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
                  value={editLongitude}
                  onChangeText={setEditLongitude}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputField}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t.vetNotesLabel}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text, height: 80 }]}
                value={editNotes}
                onChangeText={setEditNotes}
                multiline
              />
            </View>

            <TouchableOpacity
              style={[styles.saveChangesBtn, { backgroundColor: Colors.primary }]}
              onPress={handleSaveEdit}
              activeOpacity={0.85}
            >
              <Text style={styles.saveChangesBtnText}>
                {language === 'en' ? 'Save Changes' : 'Değişiklikleri Kaydet'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E5E7EB',
  },
  avatarPlaceholderLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTextWrapper: {
    flex: 1,
  },
  titleEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vetNameLarge: {
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
  },
  editIconBtn: {
    padding: 6,
  },
  vetTitleText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  clinicNameText: {
    fontSize: 13,
    marginTop: 3,
  },
  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    gap: 4,
  },
  regionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 21,
    gap: 8,
  },
  primaryCallBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emergencyCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 21,
    gap: 8,
  },
  emergencyCallBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  infoItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  infoItemText: {
    fontSize: 13,
    flex: 1,
  },
  animalListGrid: {
    gap: 10,
  },
  animalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    gap: 12,
  },
  animalThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  animalThumbFallback: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  animalCardBody: {
    flex: 1,
  },
  animalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  animalNameText: {
    fontSize: 14,
    fontWeight: '700',
  },
  animalBreedText: {
    fontSize: 12,
    marginTop: 2,
  },
  animalGotoLink: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  emptyAssignedBox: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  emptyAssignedText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  servicePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  deleteBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 13,
  },
  modalWrapper: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitleText: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  inputField: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  textInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  saveChangesBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveChangesBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  academicPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  academicPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
