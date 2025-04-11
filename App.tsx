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

  const FAVOURITE_MARKERS_KEY = 'FAVOURITE_MARKERS_KEY';
  const [favouriteMarkers, setFavouriteMarkers] = useState<UserMarker[]>([]);
  const [favouritesVisible, setFavouritesVisible] = useState(false);
  const [notDeleteMessage, setNotDeleteMessage] = useState('');

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
    loadFavouriteMarkers();
  }, []);

  const mapPress = () => {
    setSelectedMarker(null);
    setNotFoundMessage('');
    Keyboard.dismiss();
  };

  const loadFavouriteMarkers = async () => {
    const savedFavourites = await AsyncStorage.getItem(FAVOURITE_MARKERS_KEY);
    if (savedFavourites) {
      setFavouriteMarkers(JSON.parse(savedFavourites));
    }
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
  
    setUserMarkers((preview) => {
      const updated = [...preview, newMarker];
      saveUserMarkers(updated);
      return updated;
    });
  
    setNewMarkerTitle('');
    setNewMarkerCoords(null);
    setModalVisible(false);
  };
  
  const deleteUserMarker = (id: string) => {
    const markerToDelete = userMarkers.find((m) => m.id === id);
  
    if (markerToDelete && isFavourite(markerToDelete)) {
      setNotDeleteMessage('Избранную метку нельзя удалить');
      setTimeout(() => {
        setNotDeleteMessage('');
      }, 1500);
    } 
    else {
      setUserMarkers((preview) => {
        const updated = preview.filter((m) => m.id !== id);
        saveUserMarkers(updated);
        return updated;
      });
      setSelectedUserMarker(null);
    }
  };
  
  const saveUserMarkers = async (markers: UserMarker[]) => {
      await AsyncStorage.setItem(USER_MARKERS_KEY, JSON.stringify(markers));
  };

  const addToFavourites = async (marker: UserMarker) => {
    const updated = [...favouriteMarkers, marker];
    setFavouriteMarkers(updated);
    await AsyncStorage.setItem(FAVOURITE_MARKERS_KEY, JSON.stringify(updated));
  };

  const isFavourite = (marker: UserMarker) => {
    return favouriteMarkers.some((fav) => fav.id === marker.id);
  };  
  
  const removeFromFavourites = async (marker: UserMarker) => {
    const updated = favouriteMarkers.filter((fav) => fav.id !== marker.id);
    setFavouriteMarkers(updated);
    await AsyncStorage.setItem(FAVOURITE_MARKERS_KEY, JSON.stringify(updated));
  };  

  const Search = () => {
    const lowerSearch = searchMarker.toLowerCase();
  
    const foundMarkers = markers.find(marker =>
      marker.title.toLowerCase().includes(lowerSearch)
    );
  
    const foundUserMarkers = userMarkers.find(marker =>
      marker.title.toLowerCase().includes(lowerSearch)
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
      setTimeout(() => {
        setNotFoundMessage('');
      }, 2000);
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
          onLongPress={(ev) => {
            const { latitude, longitude } = ev.nativeEvent.coordinate;
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
              image={m.icon}
              onPress={() => setSelectedMarker(m)}
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
            <Text style={styles.textTitle}>Добавить метку</Text>
            <TextInput
              style={styles.inputTitle}
              placeholder="Введите название..."
              value={newMarkerTitle}
              onChangeText={setNewMarkerTitle}
            />
            {newMarkerCoords && (
              <Text style={styles.textCoords}>
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
          <TouchableWithoutFeedback onPress={() => {setNotDeleteMessage('');}}>
            <Modal isVisible={true}>
              <View style={styles.modalContainer}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.textTitle}>{selectedUserMarker.title}</Text>
                {isFavourite(selectedUserMarker) ? (
                  <TouchableOpacity onPress={() => removeFromFavourites(selectedUserMarker)}>
                    <Image
                      source={require('./assets/remove_favourites.png')}
                      style={styles.modalFavouriteButton}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => addToFavourites(selectedUserMarker)}>
                    <Image
                      source={require('./assets/favourites.png')}
                      style={styles.modalFavouriteButton}
                    />
                  </TouchableOpacity>
                )}
              </View>
                <Text style={[styles.textCoords, {marginTop: 10}]}>
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

                {notDeleteMessage !== '' && (
                  <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{notDeleteMessage}</Text>
                  </View>
                )}
              </View>
            </Modal>
          </TouchableWithoutFeedback>
        )}

        <Modal isVisible={favouritesVisible}>
          <View style={styles.modalContainer}>
            <Text style={styles.textTitle}>⭐ Избранные метки</Text>

            {favouriteMarkers.length === 0 ? (
              <Text style={{ padding: 10 }}>Нет избранных меток</Text>
            ) : (
              favouriteMarkers.map((marker) => (
                <TouchableOpacity
                  key={marker.id}
                  style={[styles.modalButton, {backgroundColor: '#ffc309'}]}
                  onPress={() => {
                    setFavouritesVisible(false);
                    mapRef.current?.animateToRegion({
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    });
                    setSelectedUserMarker(marker);
                    setSelectedMarker(null);
                  }}
                >
                  <Text style={styles.modalText}>{marker.title}</Text>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#4287f5' }]}
              onPress={() => setFavouritesVisible(false)}
            >
              <Text style={styles.modalText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setFavouritesVisible(true)}>
            <Image source={require('./assets/favourites.png')} style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={focusOnUser}>
            <Image source={require('./assets/user.png')} style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setMapType((type) => (type === 'standard' ? 'satellite' : 'standard'))}>
          <Image source={require('./assets/map.png')} style={styles.buttonImage} />
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

  buttonImage: {
    width: 40,
    height: 40
  },

  searchContainer: {
    position: 'absolute',
    top: 20,
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

  modalTitleContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },

  modalFavouriteButton:{
    width: 30, 
    height: 30, 
    marginLeft: 10 
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
  },

  textCoords: {
    marginTop: 20, 
    marginBottom: 10, 
    textAlign: 'center'
  },

  textTitle:{
    fontWeight: 'bold', 
    fontSize: 16
  },

  inputTitle:{
    borderBottomWidth: 0.5, 
    marginTop: 10
  }
});
