import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';

export default function CatMap({ cats = [], animals = null, location, onSelectCat }) {
  const list = animals || cats;

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
      {list.map((animal) => {
        const lat = animal.location?.latitude || 40.988;
        const lng = animal.location?.longitude || 29.025;
        const isDog = animal.isDog || animal.id?.startsWith('dog-');
        const emoji = isDog ? '🐶' : '🐱';
        const borderColor = isDog ? '#D97706' : '#FF6B6B';

        return (
          <Marker
            key={animal.id}
            coordinate={{ latitude: lat, longitude: lng }}
            title={animal.name}
            description={animal.breed}
          >
            <View style={[styles.customMarker, { borderColor }]}>
              <Text style={styles.markerText}>{emoji}</Text>
            </View>
            <Callout onPress={() => onSelectCat && onSelectCat(animal)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{animal.name}</Text>
                <Text style={[styles.calloutSub, { color: borderColor }]}>Detaya Git ➔</Text>
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
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
});
