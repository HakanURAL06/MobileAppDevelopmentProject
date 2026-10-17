import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageSource } from '../utils/imageHelper';

const { width, height } = Dimensions.get('window');

/**
 * Tam Ekran Fotoğraf Görüntüleyici (Lightbox / Fullscreen Image Viewer)
 *
 * @param {boolean} visible - Modalın görünürlük durumu
 * @param {Array<string|number>} images - Görüntülenecek fotoğraf listesi
 * @param {number} initialIndex - Başlangıçta açılacak fotoğrafın indeksi
 * @param {function} onClose - Kapatma fonksiyonu
 * @param {string} [title] - Başlık (örn: Kedinin / Köpeğin adı)
 */
export default function ImageViewerModal({
  visible,
  images = [],
  initialIndex = 0,
  onClose,
  title = 'Fotoğraf Görüntüleyici',
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0);
    }
  }, [visible, initialIndex, images.length]);

  if (!visible || !images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.95)" />

        <SafeAreaView style={styles.safeArea}>
          {/* ÜST BİLGİ VE KAPATMA ÇUBUĞU */}
          <View style={styles.headerBar}>
            <View style={styles.titleInfo}>
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
              {images.length > 1 && (
                <View style={styles.counterBadge}>
                  <Text style={styles.counterText}>
                    {currentIndex + 1} / {images.length}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* MERKEZ: BÜYÜK RESİM VE GEÇİŞ OKLARI */}
          <View style={styles.imageContainer}>
            <Image
              source={getImageSource(currentImage)}
              style={styles.fullImage}
              resizeMode="contain"
            />

            {/* Sol Geçiş Oku */}
            {images.length > 1 && currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.arrowBtn, styles.arrowLeft]}
                onPress={handlePrev}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {/* Sağ Geçiş Oku */}
            {images.length > 1 && currentIndex < images.length - 1 && (
              <TouchableOpacity
                style={[styles.arrowBtn, styles.arrowRight]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* ALT: ÇOKLU FOTOĞRAF KÜÇÜK ÖNİZLEME ŞERİDİ (THUMBNAILS) */}
          {images.length > 1 ? (
            <View style={styles.footerContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailScroll}
              >
                {images.map((img, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <TouchableOpacity
                      key={`thumb-${idx}`}
                      style={[styles.thumbnailWrap, isActive && styles.thumbnailActive]}
                      onPress={() => setCurrentIndex(idx)}
                      activeOpacity={0.75}
                    >
                      <Image
                        source={getImageSource(img)}
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Text style={styles.hintText}>
                Fotoğraflar arasında geçiş yapmak için oklara veya küçük resimlere dokunabilirsiniz
              </Text>
            </View>
          ) : (
            <View style={styles.footerContainer}>
              <Text style={styles.hintText}>Tam ekran görünümünü kapatmak için çarpıya dokunun</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  titleInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  counterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  fullImage: {
    width: width,
    height: height * 0.72,
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  arrowLeft: {
    left: 14,
  },
  arrowRight: {
    right: 14,
  },
  footerContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  thumbnailScroll: {
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  thumbnailWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.6,
  },
  thumbnailActive: {
    borderColor: '#FF6B6B',
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  hintText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
