import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useMapLogic } from '../model/useMapLogic';
import { SearchBar } from './SearchBar';
import { SelectedMarkerModal } from './SelectedMarkerModal';
import { AddMarkerModal } from './AddMarkerModal';
import { FavouritesMarkersModal } from './FavouritesMarkersModal';
import { MapViewContainer } from './MapViewContainer';
import { MapControls } from './MapControls';
import MarkerInfo from '../../../entities/marker/ui/markerInfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from '../../../app/styles/globalStyles';

export default function MapPage() {
  const {
    userMarkers,
    userLocationMarker,
    selectedUserMarker,
    selectedMarker,
    modalVisible,
    setModalVisible,
    newMarkerTitle,
    setNewMarkerTitle,
    addUserMarker,
    deleteUserMarker,
    setSelectedUserMarker,
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
    addToFavourites,
    removeFromFavourites,
    isFavourite,
    handleSearch,
    handleMapLongPress,
    setSelectedMarker,
    focusOnUser,
  } = useMapLogic();

  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <View style={globalStyles.container}>
        <SearchBar
          searchMarker={searchMarker}
          setSearchMarker={setSearchMarker}
          notFoundMessage={notFoundMessage}
          onSearch={handleSearch}
        />

        <MapViewContainer
          initialRegion={initialRegion}
          userMarkers={userMarkers}
          userLocationMarker={userLocationMarker}
          onMapPress={mapPress}
          onMapLongPress={handleMapLongPress}
          onUserMarkerPress={setSelectedUserMarker}
          onSystemMarkerPress={setSelectedMarker}
          mapType={mapType}
          mapRef={mapRef}
        />

        <SelectedMarkerModal
          visible={!!selectedUserMarker}
          marker={selectedUserMarker}
          onDelete={deleteUserMarker}
          onClose={() => setSelectedUserMarker(null)}
          onAddToFavourites={addToFavourites}
          onRemoveFromFavourites={removeFromFavourites}
          isFavourite={isFavourite}
          notDeleteMessage={notDeleteMessage}
        />

        <AddMarkerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={addUserMarker}
          title={newMarkerTitle}
          setTitle={setNewMarkerTitle}
          coords={selectedMarker}
        />

        <FavouritesMarkersModal
          visible={favouritesVisible}
          markers={favouriteMarkers}
          onSelect={(marker) => {
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
          onClose={() => setFavouritesVisible(false)}
        />

        <MapControls
          onOpenFavourites={() => setFavouritesVisible(true)}
          onFocusUser={focusOnUser}
          onToggleMapType={() => setMapType(type => (type === 'standard' ? 'satellite' : 'standard'))}
        />

        {selectedMarker && (
          <MarkerInfo
            title={selectedMarker.title}
            description={selectedMarker.description}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
