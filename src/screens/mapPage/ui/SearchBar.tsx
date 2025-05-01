import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import globalStyles from '../../../app/styles/globalStyles';

type Props = {
  searchMarker: string;
  setSearchMarker: React.Dispatch<React.SetStateAction<string>>;
  notFoundMessage: string;
  onSearch: () => void;
};

export const SearchBar: React.FC<Props> = ({
  searchMarker,
  setSearchMarker,
  notFoundMessage,
  onSearch,
}) => {
  const onChange = (text: string) => setSearchMarker(text);

  const onSearchSubmit = () => {
    onSearch();
  };

  return (
    <View style={globalStyles.searchContainer}>
      <TextInput
        style={globalStyles.searchInput}
        placeholder="🔎 Поиск метки..."
        value={searchMarker}
        onChangeText={onChange}
        onSubmitEditing={onSearchSubmit}
        returnKeyType="search"
      />

      {notFoundMessage !== '' && (
        <View style={globalStyles.messageContainer}>
          <Text style={globalStyles.messageText}>{notFoundMessage}</Text>
        </View>
      )}
    </View>
  );
};
