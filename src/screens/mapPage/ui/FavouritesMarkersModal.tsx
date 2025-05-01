import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { UserMarker } from '../../../entities/marker/model/userMarker';
import globalStyles from '../../../app/styles/globalStyles';

type Props = {
  visible: boolean;
  markers: UserMarker[];
  onSelect: (marker: UserMarker) => void;
  onClose: () => void;
};

export const FavouritesMarkersModal: React.FC<Props> = ({ visible, markers, onSelect, onClose }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
    >
      <View style={globalStyles.modalContainer}>
        <Text style={globalStyles.textTitle}>⭐ Избранные метки</Text>

        {markers.length === 0 ? (
          <Text style={{ padding: 10 }}>Нет избранных меток</Text>
        ) : (
          <FlatList
            data={markers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[globalStyles.modalButton, { backgroundColor: '#ffc309'}]}
                onPress={() => onSelect(item)}
              >
                <Text style={globalStyles.modalText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity onPress={onClose} style={[globalStyles.modalButton, { backgroundColor: '#4287f5'}]}>
          <Text style={globalStyles.modalText}>Закрыть</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
