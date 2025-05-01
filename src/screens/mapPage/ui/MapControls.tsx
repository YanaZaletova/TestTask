import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../../../app/styles/globalStyles';

interface Props {
  onOpenFavourites: () => void;
  onFocusUser: () => void;
  onToggleMapType: () => void;
}

export const MapControls = ({ onOpenFavourites, onFocusUser, onToggleMapType }: Props) => {
  return (
    <View style={globalStyles.buttonContainer}>
      <TouchableOpacity style={globalStyles.button} onPress={onOpenFavourites}>
        <Image source={require('../../../../assets/favourites.png')} style={globalStyles.buttonImage} />
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.button} onPress={onFocusUser}>
        <Image source={require('../../../../assets/user.png')} style={globalStyles.buttonImage} />
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.button} onPress={onToggleMapType}>
        <Image source={require('../../../../assets/map.png')} style={globalStyles.buttonImage} />
      </TouchableOpacity>
    </View>
  );
};
