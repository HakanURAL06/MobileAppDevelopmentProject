import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddCatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ AddCat (Kedi Ekleme Ekranı)</Text>
      <Text style={styles.subtitle}>
        Kedi ekleme ve etkileşim (besleme, sevme vb.) girme formu.
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
  subtitle: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
  },
});
