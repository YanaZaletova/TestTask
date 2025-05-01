import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Marker, LongPressEvent , MapType, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { UserMarker } from '../../../entities/marker/model/userMarker';
import { markers } from '../../../entities/marker/model/markers';
import globalStyles from '../../../app/styles/globalStyles';

type Props = {
  initialRegion: Region;
  userMarkers: UserMarker[];
  userLocationMarker: { latitude: number; longitude: number } | null;
  onMapLongPress: (event: LongPressEvent ) => void;
  onMapPress: () => void;
  onUserMarkerPress: (marker: UserMarker) => void;
  onSystemMarkerPress: (marker: any) => void;
  mapType: MapType;
  mapRef: React.RefObject<MapView>;
};

export const MapViewContainer: React.FC<Props> = ({
  initialRegion,
  userMarkers,
  userLocationMarker,
  onMapLongPress,
  onMapPress,
  onUserMarkerPress,
  onSystemMarkerPress,
  mapType,
  mapRef,
}) => {
  return (
    <View style={globalStyles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        onPress={onMapPress}
        onLongPress={onMapLongPress}
        mapType={mapType}
        zoomEnabled
        zoomControlEnabled
      >
        {markers.map((m) => (
          <Marker
            key={m.key}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            image={m.icon}
            onPress={() => onSystemMarkerPress(m)}
          />
        ))}

        {userLocationMarker && (
          <Marker coordinate={userLocationMarker}>
            <Image source={require('../../../../assets/user.png')} style={{ width: 30, height: 30 }} />
          </Marker>
        )}

        {userMarkers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            pinColor="#4287f5"
            onPress={() => onUserMarkerPress(m)}
          />
        ))}
      </MapView>
    </View>
  );
};
