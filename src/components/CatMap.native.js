import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';

export default function CatMap({ cats = [], location, onSelectCat }) {
  const initialRegion = location || {
    latitude: 40.988,
    longitude: 29.025,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
    >
      {cats.map((cat) => {
        const lat = cat.location?.latitude || 40.988;
        const lng = cat.location?.longitude || 29.025;
        return (
          <Marker
            key={cat.id}
            coordinate={{ latitude: lat, longitude: lng }}
            title={cat.name}
            description={cat.breed}
          >
            <View style={styles.customMarker}>
              <Text style={styles.markerText}>🐱</Text>
            </View>
            <Callout onPress={() => onSelectCat && onSelectCat(cat)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{cat.name}</Text>
                <Text style={styles.calloutSub}>Detaya Git ➔</Text>
              </View>
            </Callout>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  customMarker: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  markerText: {
    fontSize: 16,
  },
  callout: {
    padding: 8,
    alignItems: 'center',
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  calloutSub: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 2,
  },
});
