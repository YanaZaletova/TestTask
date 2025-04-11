import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Info {
  title: string;
  description: string;
}

export default function marker_info({ title, description }: Info) {
  return (
    <View style={styles.info}>
      <Text style={styles.title}>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    position: 'absolute',
    bottom: 60,
    left: 15,
    right: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#4287f5',
    padding: 15,
    borderRadius: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
});
