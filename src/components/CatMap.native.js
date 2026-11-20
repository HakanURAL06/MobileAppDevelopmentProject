import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

export default function CatMap({ cats = [], animals = null, vets = [], location, onSelectCat, onSelectVet }) {
  const list = animals || cats;
  const mapRef = React.useRef(null);

  // Varsayılan odak: İstanbul'daki hayvan ve kliniklerin orta noktası (Bayrampaşa - Fatih aksı)
  const initialRegion = location || {
    latitude: 41.040,
    longitude: 28.920,
    latitudeDelta: 0.09,
    longitudeDelta: 0.09,
  };

  React.useEffect(() => {
    const coords = [];
    list.forEach((a) => {
      if (a.location?.latitude && a.location?.longitude) {
        coords.push({ latitude: a.location.latitude, longitude: a.location.longitude });
      }
    });
    vets.forEach((v) => {
      if (v.latitude && v.longitude) {
        coords.push({ latitude: v.latitude, longitude: v.longitude });
      }
    });

    if (coords.length > 0 && mapRef.current?.fitToCoordinates) {
      const timer = setTimeout(() => {
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
          animated: true,
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [list, vets]);

  return (
    <MapView
      ref={mapRef}
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

      {vets.map((vet) => {
        if (!vet.latitude || !vet.longitude) return null;
        return (
          <Marker
            key={vet.id}
            coordinate={{ latitude: vet.latitude, longitude: vet.longitude }}
            title={vet.clinicName}
            description={vet.name}
          >
            <View style={[styles.customMarker, { borderColor: '#10B981' }]}>
              <Text style={styles.markerText}>🩺</Text>
            </View>
            <Callout onPress={() => onSelectVet && onSelectVet(vet)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{vet.clinicName}</Text>
                <Text style={{ fontSize: 11, color: '#4B5563', marginTop: 1 }}>{vet.name}</Text>
                <Text style={[styles.calloutSub, { color: '#10B981' }]}>Hekim Detayı ➔</Text>
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
