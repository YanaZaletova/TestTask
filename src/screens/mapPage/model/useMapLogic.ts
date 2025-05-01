import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import MapView, { MapType, LongPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { UserMarker } from '../../../entities/marker/model/userMarker';
import { markers } from '../../../entities/marker/model/markers';

const USER_MARKERS_KEY = 'USER_MARKERS_KEY';
const FAVOURITE_MARKERS_KEY = 'FAVOURITE_MARKERS_KEY';

export const useMapLogic = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [userLocationMarker, setUserLocationMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userMarkers, setUserMarkers] = useState<UserMarker[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerCoords, setNewMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [newMarkerTitle, setNewMarkerTitle] = useState('');
  const [selectedUserMarker, setSelectedUserMarker] = useState<UserMarker | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [searchMarker, setSearchMarker] = useState('');
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [favouriteMarkers, setFavouriteMarkers] = useState<UserMarker[]>([]);
  const [favouritesVisible, setFavouritesVisible] = useState(false);
  const [notDeleteMessage, setNotDeleteMessage] = useState('');
  const mapRef = useRef<MapView>(null);

  const initialRegion = {
    latitude: 54.70933778858266,
    longitude: 20.508267189176646,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    loadUserMarkers();
    loadFavouriteMarkers();
  }, []);

  const loadUserMarkers = async () => {
    const saved = await AsyncStorage.getItem(USER_MARKERS_KEY);
    if (saved) setUserMarkers(JSON.parse(saved));
  };

  const saveUserMarkers = async (data: UserMarker[]) => {
    await AsyncStorage.setItem(USER_MARKERS_KEY, JSON.stringify(data));
  };

  const loadFavouriteMarkers = async () => {
    const saved = await AsyncStorage.getItem(FAVOURITE_MARKERS_KEY);
    if (saved) setFavouriteMarkers(JSON.parse(saved));
  };

  const saveFavouriteMarkers = async (data: UserMarker[]) => {
    await AsyncStorage.setItem(FAVOURITE_MARKERS_KEY, JSON.stringify(data));
  };

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
      id: uuid.v4() as string,
      title: newMarkerTitle,
      latitude: newMarkerCoords.latitude,
      longitude: newMarkerCoords.longitude,
    };
    const updated = [...userMarkers, newMarker];
    setUserMarkers(updated);
    saveUserMarkers(updated);
    setNewMarkerTitle('');
    setNewMarkerCoords(null);
    setModalVisible(false);
  };

  const deleteUserMarker = (id: string) => {
    const marker = userMarkers.find((m) => m.id === id);
    if (marker && isFavourite(marker)) {
      setNotDeleteMessage('Избранную метку нельзя удалить');
      setTimeout(() => setNotDeleteMessage(''), 1500);
      return;
    }
    const updated = userMarkers.filter((m) => m.id !== id);
    setUserMarkers(updated);
    saveUserMarkers(updated);
    setSelectedUserMarker(null);
  };

  const isFavourite = (marker: UserMarker) =>
    favouriteMarkers.some((m) => m.id === marker.id);

  const addToFavourites = async (marker: UserMarker) => {
    const updated = [...favouriteMarkers, marker];
    setFavouriteMarkers(updated);
    saveFavouriteMarkers(updated);
  };

  const removeFromFavourites = async (marker: UserMarker) => {
    const updated = favouriteMarkers.filter((m) => m.id !== marker.id);
    setFavouriteMarkers(updated);
    saveFavouriteMarkers(updated);
  };

  const handleSearch = () => {
    const query = searchMarker.toLowerCase();
    const foundMarker = markers.find((m) =>
      m.title.toLowerCase().includes(query)
    );
    const foundUserMarker = userMarkers.find((m) =>
      m.title.toLowerCase().includes(query)
    );

    const result = foundMarker || foundUserMarker;

    if (result && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: result.latitude,
        longitude: result.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      if (foundMarker) {
        setSelectedMarker(foundMarker);
        setSelectedUserMarker(null);
      } else {
        setSelectedUserMarker(foundUserMarker!);
        setSelectedMarker(null);
      }

      setNotFoundMessage('');
    } else {
      setNotFoundMessage('Метка не найдена');
      setTimeout(() => setNotFoundMessage(''), 2000);
      setSelectedMarker(null);
      setSelectedUserMarker(null);
    }

    Keyboard.dismiss();
  };

  const handleMapLongPress = (event: LongPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setNewMarkerCoords(coordinate);
    setModalVisible(true);
  };

  return {
    location,
    userLocationMarker,
    userMarkers,
    modalVisible,
    setModalVisible,
    newMarkerCoords,
    setNewMarkerCoords,
    newMarkerTitle,
    setNewMarkerTitle,
    selectedUserMarker,
    setSelectedUserMarker,
    selectedMarker,
    setSelectedMarker,
    mapType,
    setMapType,
    searchMarker,
    setSearchMarker,
    notFoundMessage,
    favouriteMarkers,
    favouritesVisible,
    setFavouritesVisible,
    notDeleteMessage,
    mapRef,
    initialRegion,
    mapPress,
    focusOnUser,
    addUserMarker,
    deleteUserMarker,
    addToFavourites,
    removeFromFavourites,
    isFavourite,
    handleSearch,
    handleMapLongPress,
  };
};
