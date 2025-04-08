import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, Keyboard, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import * as Location from 'expo-location';
import { markers } from './assets/markers';
import MarkerInfo from './assets/marker_info';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [mapType, setMapType] = useState<MapType>('standard');
  const mapRef = useRef<MapView>(null);

  const initialRegion = {
    latitude: 54.70933778858266,
    longitude: 20.508267189176646,
    latitudeDelta: 2,
    longitudeDelta: 2
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const mapPress = () => {
    setSelectedMarker(null);
    Keyboard.dismiss();
  };

  const focusOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={mapPress}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          mapType={mapType}
          onPress={mapPress}
          zoomEnabled={true}
          zoomControlEnabled={true}
        >
          {markers.map((m) => (
            <Marker
              key={m.key}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              title={m.title}
              onPress={() => setSelectedMarker(m)}
              image={m.icon}
            />
          ))}
        </MapView>

        <View style={styles.button}>
          <Button title="На меня" onPress={focusOnUser} />
          <Button title="Вид карты" onPress={() =>
            setMapType((type) => type === 'standard' ? 'satellite' : 'standard')
          } />
        </View>

        {selectedMarker && (
          <MarkerInfo title={selectedMarker.title} description={selectedMarker.description} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  button: {
    position: 'absolute',
    color: '#4287f5',
    top: 70,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
