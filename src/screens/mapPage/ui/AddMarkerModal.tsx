import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import globalStyles from '../../../app/styles/globalStyles';

type AddMarkerModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  title: string;
  setTitle: (title: string) => void;
  coords: { latitude: number; longitude: number } | null;
};

export const AddMarkerModal: React.FC<AddMarkerModalProps> = ({
  visible,
  onClose,
  onAdd,
  title,
  setTitle,
  coords,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      avoidKeyboard
    >
      <View style={globalStyles.modalContainer}>
        <Text style={globalStyles.textTitle}>Добавить метку</Text>

        <TextInput
          style={globalStyles.inputTitle}
          placeholder="Введите название..."
          value={title}
          onChangeText={setTitle}
        />

        {coords && (
          <Text style={globalStyles.textCoords}>
            Координаты: {coords.latitude.toFixed(10)}, {coords.longitude.toFixed(10)}
          </Text>
        )}

        <TouchableOpacity
          style={[globalStyles.modalButton, { backgroundColor: '#5ea926' }]}
          onPress={onAdd}
        >
          <Text style={globalStyles.modalText}>Добавить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.modalButton, { backgroundColor: '#f76157' }]}
          onPress={onClose}
        >
          <Text style={globalStyles.modalText}>Отмена</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
