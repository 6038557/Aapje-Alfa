import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const cities = [
  { name: 'Leiden', latitude: 52.1601, longitude: 4.4970 },
  { name: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
  { name: 'Rotterdam', latitude: 51.9225, longitude: 4.4792 },
  { name: 'Utrecht', latitude: 52.0907, longitude: 5.1214 },
  { name: 'Groningen', latitude: 53.2194, longitude: 6.5665 },
];


export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <View style={styles.container}>
<MapView
  style={styles.map}
  initialRegion={{
    latitude: 52.1601,
    longitude: 4.4970,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  }}
>

        {selectedCity && (
          <Marker
            coordinate={{
              latitude: selectedCity.latitude,
              longitude: selectedCity.longitude,
            }}
            title={selectedCity.name}
          />
        )}
      </MapView>

      <View style={styles.buttons}>
        {cities.map((city) => (
          <TouchableOpacity key={city.name} style={styles.button} onPress={() => setSelectedCity(city)}>
            <Text>{city.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttons: {
    position: 'absolute',
    top: 40,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  button: {
    padding: 6,
  },
});