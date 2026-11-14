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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getImageSource } from '../utils/imageHelper';
import useAppTheme from '../theme/useAppTheme';

const { width, height } = Dimensions.get('window');

/**
 * Tam Ekran Fotoğraf Görüntüleyici (Lightbox / Fullscreen Image Viewer)
 * Mobil ekran çentik (Dynamic Island / Notch) ve alt Home Bar güvenli alanlarıyla tam uyumludur.
 */
export default function ImageViewerModal({
  visible,
  images = [],
  initialIndex = 0,
  onClose,
  title = 'Fotoğraf Görüntüleyici',
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const insets = useSafeAreaInsets();
  const { language } = useAppTheme();

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

  const topSafePadding = Math.max(insets.top + 14, 52);
  const bottomSafePadding = Math.max(insets.bottom + 18, 28);

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

        <View
          style={[
            styles.safeArea,
            {
              paddingTop: topSafePadding,
              paddingBottom: bottomSafePadding,
            },
          ]}
        >
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
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
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
                hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
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
                hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              >
                <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* ALT: KÜÇÜK ÖNİZLEME ŞERİDİ VE KOLAY KAPATMA BUTONU */}
          <View style={styles.footerContainer}>
            {images.length > 1 && (
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
            )}

            <TouchableOpacity
              style={styles.bottomClosePill}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Ionicons name="close-circle" size={18} color="#FFFFFF" />
              <Text style={styles.bottomCloseText}>
                {language === 'en' ? 'Close Viewer' : 'Fotoğrafı Kapat'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 22,
    paddingBottom: 12,
    zIndex: 10,
  },
  titleInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 14,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  counterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
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
    height: height * 0.64,
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -26,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  arrowLeft: {
    left: 16,
  },
  arrowRight: {
    right: 16,
  },
  footerContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  thumbnailScroll: {
    gap: 10,
    paddingHorizontal: 6,
  },
  thumbnailWrap: {
    width: 54,
    height: 54,
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
  bottomClosePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 11,
    paddingHorizontal: 26,
    borderRadius: 24,
  },
  bottomCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
