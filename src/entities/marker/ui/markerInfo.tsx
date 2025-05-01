import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../../app/styles/globalStyles';

interface Props {
  title: string;
  description: string;
}

export default function MarkerInfo({ title, description }: Props) {
  return (
    <View style={globalStyles.info}>
      <Text style={globalStyles.titleInfo}>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
}