import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import { UserMarker } from '../../../entities/marker/model/userMarker';
import globalStyles from '../../../app/styles/globalStyles';

type Props = {
  visible: boolean;
  marker: UserMarker | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onAddToFavourites: (marker: UserMarker) => Promise<void>;
  onRemoveFromFavourites: (marker: UserMarker) => Promise<void>;
  isFavourite: (marker: UserMarker) => boolean;
  notDeleteMessage: string;
  clearMessage: () => void;
};

export const SelectedMarkerModal: React.FC<Props> = ({
  visible,
  marker,
  onClose,
  onDelete,
  onAddToFavourites,
  onRemoveFromFavourites,
  isFavourite,
  notDeleteMessage,
  clearMessage,
}) => {
  if (!marker) return null;

  const handleFavouriteToggle = () => {
    isFavourite(marker)
      ? onRemoveFromFavourites(marker)
      : onAddToFavourites(marker);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onModalWillShow={clearMessage}
    >
      <View style={globalStyles.modalContainer}>
        <View style={globalStyles.modalTitleContainer}>
          <Text style={globalStyles.textTitle}>{marker.title}</Text>

          <TouchableOpacity onPress={handleFavouriteToggle}>
            <Image
              source={
                isFavourite(marker)
                  ? require('../../../../assets/remove_favourites.png')
                  : require('../../../../assets/favourites.png')
              }
              style={globalStyles.modalFavouriteButton}
            />
          </TouchableOpacity>
        </View>

        <Text style={[globalStyles.textCoords, { marginTop: 10 }]}>
          Координаты: {marker.latitude.toFixed(10)}, {marker.longitude.toFixed(10)}
        </Text>

        <TouchableOpacity
          onPress={() => onDelete(marker.id)}
          style={[globalStyles.modalButton, { backgroundColor: '#f76157' }]}
        >
          <Text style={globalStyles.modalText}>Удалить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClose}
          style={[globalStyles.modalButton, { backgroundColor: '#4287f5' }]}
        >
          <Text style={globalStyles.modalText}>Отмена</Text>
        </TouchableOpacity>

        {notDeleteMessage !== '' && (
          <View style={globalStyles.messageContainer}>
            <Text style={globalStyles.messageText}>{notDeleteMessage}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};
