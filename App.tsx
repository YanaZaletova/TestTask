import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity, TextInput, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import * as Location from 'expo-location';
import { markers } from './assets/markers';
import MarkerInfo from './assets/marker_info';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [userLocationMarker, setUserLocationMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [searchMarker, setSearchMarker] = useState('');
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const mapRef = useRef<MapView>(null);

  const initialRegion = {
    latitude: 54.70933778858266,
    longitude: 20.508267189176646,
    latitudeDelta: 2,
    longitudeDelta: 2
  };

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
    setNotFoundMessage('');
    Keyboard.dismiss();
  };

  const focusOnUser = () => {
    if (location && mapRef.current) {
      const { latitude, longitude } = location.coords;
      
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
  
      setUserLocationMarker({ latitude, longitude });
    }
  };

  const Search = () => {
    const found = markers.find(marker =>
      searchMarker.toLowerCase() === marker.title.toLowerCase()
    );

    if (found && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: found.latitude,
        longitude: found.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setSelectedMarker(found);
    } else {
      setNotFoundMessage('Метка не найдена');
    }
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={mapPress}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔎 Поиск метки..."
            value={searchMarker}
            onChangeText={setSearchMarker}
            onSubmitEditing={Search}
            returnKeyType="search"        
          />
            {notFoundMessage !== '' && (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{notFoundMessage}</Text>
              </View>
            )}
        </View>

        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          ref={mapRef}
          onPress={mapPress}
          mapType={mapType}
          provider={PROVIDER_GOOGLE}
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
            >
            </Marker>
          ))}

          {userLocationMarker && (
              <Marker coordinate={userLocationMarker}>
                <Image source={require('./assets/user.png')} style={{ width: 30, height: 30 }} />
              </Marker>
          )}
        </MapView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={focusOnUser}>
            <Image source={require('./assets/user.png')} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setMapType((type) => (type === 'standard' ? 'satellite' : 'standard'))}>
          <Image source={require('./assets/map.png')} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
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

  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 8,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 3,
    marginBottom: 10,
  },

  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },

  searchInput: {
    height: 40,
    fontSize: 16,
  },

  messageContainer: {
    position: 'absolute',
    top: 55,
    left: 10,
    right: 10,
    borderRadius: 20,
    padding: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f76157',
    alignItems: 'center',
  },
  
  messageText: {
    color: '#f76157',
    fontWeight: 'bold',
  }, 
});
