import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCatStore from '../store/catStore';

export default function ToastBanner() {
  const toast = useCatStore((state) => state.toast);
  const hideToast = useCatStore((state) => state.hideToast);

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      // Giriş animasyonu
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Çıkış animasyonu
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast]);

  if (!toast) return null;

  const isDelete = toast.type === 'delete';
  const isInfo = toast.type === 'info';

  const config = isDelete
    ? {
        bg: '#FFF1F2',
        border: '#FECDD3',
        icon: 'trash',
        iconColor: '#E11D48',
        iconBg: '#FFE4E6',
        title: 'Kedi Silindi',
      }
    : isInfo
    ? {
        bg: '#FFF7ED',
        border: '#FED7AA',
        icon: 'information-circle',
        iconColor: '#EA580C',
        iconBg: '#FFEDD5',
        title: 'Bilgi',
      }
    : {
        bg: '#F0FDF4',
        border: '#BBF7D0',
        icon: 'checkmark-circle',
        iconColor: '#16A34A',
        iconBg: '#DCFCE7',
        title: 'İşlem Başarılı',
      };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={[
          styles.toastCard,
          {
            backgroundColor: config.bg,
            borderColor: config.border,
          },
        ]}
        activeOpacity={0.9}
        onPress={hideToast}
      >
        <View style={[styles.iconCircle, { backgroundColor: config.iconBg }]}>
          <Ionicons name={config.icon} size={20} color={config.iconColor} />
        </View>

        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: config.iconColor }]}>
            {config.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {toast.message}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={hideToast}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 42,
    left: 16,
    right: 16,
    zIndex: 999999,
    elevation: 999,
    alignItems: 'center',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
    paddingRight: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 17,
  },
  closeBtn: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
});
