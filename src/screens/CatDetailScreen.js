import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CatDetailScreen({ route }) {
  const catName = route.params?.catName || 'Bilinmeyen Kedi';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐱 CatDetail (Kedi Detay Ekranı)</Text>
      <Text style={styles.catName}>Seçilen: {catName}</Text>
      <Text style={styles.subtitle}>
        Kedinin fotoğraflarının, son beslenme zamanının ve bağ/seviye durumunun gösterileceği detay ekranı.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  catName: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
  },
});
