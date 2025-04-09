import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity, TextInput, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import * as Location from 'expo-location';
import { markers } from './assets/markers';
import MarkerInfo from './assets/marker_info';
import { UserMarker } from './assets/user_marker';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [userLocationMarker, setUserLocationMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const USER_MARKERS_KEY = 'USER_MARKERS_KEY';
  const [userMarkers, setUserMarkers] = useState<UserMarker[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerCoords, setNewMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [newMarkerTitle, setNewMarkerTitle] = useState('');
  const [selectedUserMarker, setSelectedUserMarker] = useState<UserMarker | null>(null);

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

    const loadUserMarkers = async () => {
      const savedMarkers = await AsyncStorage.getItem(USER_MARKERS_KEY);
      if (savedMarkers) {
        setUserMarkers(JSON.parse(savedMarkers));
      }
    };
  
    loadUserMarkers();
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

  const addUserMarker = () => {
    if (!newMarkerCoords || !newMarkerTitle) return;
  
    const newMarker: UserMarker = {
      id: uuidv4(),
      title: newMarkerTitle,
      latitude: newMarkerCoords.latitude,
      longitude: newMarkerCoords.longitude,
    };
  
    setUserMarkers((prev) => {
      const updated = [...prev, newMarker];
      saveUserMarkers(updated);
      return updated;
    });
  
    setNewMarkerTitle('');
    setNewMarkerCoords(null);
    setModalVisible(false);
  };
  
  const deleteUserMarker = (id: string) => {
    setUserMarkers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveUserMarkers(updated);
      return updated;
    });
  
    setSelectedUserMarker(null);
  };
  
  
  const saveUserMarkers = async (markers: UserMarker[]) => {
      await AsyncStorage.setItem(USER_MARKERS_KEY, JSON.stringify(markers));
  };  

  const Search = () => {
    const foundMarkers = markers.find(marker =>
      searchMarker.toLowerCase() === marker.title.toLowerCase()
    );
  
    const foundUserMarkers = userMarkers.find(marker =>
      searchMarker.toLowerCase() === marker.title.toLowerCase()
    );
  
    const found = foundMarkers || foundUserMarkers;
  
    if (found && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: found.latitude,
        longitude: found.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
  
      if (foundMarkers) {
        setSelectedMarker(foundMarkers);
        setSelectedUserMarker(null);
      } else if (foundUserMarkers) {
        setSelectedUserMarker(foundUserMarkers);
        setSelectedMarker(null);
      }
      setNotFoundMessage('');
    } else {
      setNotFoundMessage('Метка не найдена');
      setSelectedMarker(null);
      setSelectedUserMarker(null);
    }
  
    Keyboard.dismiss();
  };
  

  return (
    <TouchableWithoutFeedback onPress={mapPress}>
      <View style={{flex: 1}}>
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
          style={{flex: 1}}
          initialRegion={initialRegion}
          ref={mapRef}
          onPress={mapPress}
          onLongPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setNewMarkerCoords({ latitude, longitude });
            setModalVisible(true);
          }}          
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

          {userMarkers.map((m) => (
            <Marker
              key={m.id}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              title={m.title}
              pinColor="#4287f5"
              onPress={() => setSelectedUserMarker(m)}
            />
          ))}

        </MapView>

        <Modal isVisible={modalVisible}>
          <View style={styles.modalContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Добавить метку</Text>
            <TextInput
              style={{ borderBottomWidth: 1, marginTop: 10 }}
              placeholder="Введите название..."
              value={newMarkerTitle}
              onChangeText={setNewMarkerTitle}
            />
            {newMarkerCoords && (
              <Text style={{ marginTop: 20, marginBottom: 10, textAlign: 'center' }}>
                Координаты: {newMarkerCoords.latitude.toFixed(10)}, {newMarkerCoords.longitude.toFixed(10)}
              </Text>
            )}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#5ea926' }]}
              onPress={addUserMarker}
            >
              <Text style={styles.modalText}>Добавить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: '#f76157'}]}
            >
              <Text style={styles.modalText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {selectedUserMarker && (
        <Modal isVisible={true}>
          <View style={styles.modalContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{selectedUserMarker.title}</Text>
            <Text style={{ marginTop: 10, marginBottom: 10, textAlign: 'center' }}>
              Координаты: {selectedUserMarker.latitude.toFixed(10)}, {selectedUserMarker.longitude.toFixed(10)}
            </Text>
            <TouchableOpacity
              onPress={() => deleteUserMarker(selectedUserMarker.id)}
              style={[styles.modalButton, {backgroundColor: '#f76157'}]}
            >
              <Text style={styles.modalText}>Удалить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedUserMarker(null)}
              style={[styles.modalButton, {backgroundColor: '#4287f5'}]}
            >
              <Text style={styles.modalText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        )}


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
  
  modalContainer:{
    backgroundColor: '#ffffff',
    padding: 20,
    borderWidth: 2,
    borderColor: '#4287f5',
    borderRadius: 10 
  },

  modalButton:{
    padding: 10, 
    marginTop: 8, 
    borderRadius: 20
  },

  modalText:{
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
