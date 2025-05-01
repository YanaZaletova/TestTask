import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MapPage from './src/screens/mapPage/ui/Map';

console.log('MapPage:', MapPage);

export default function App() {
  return (
    <SafeAreaProvider>
      <MapPage />
    </SafeAreaProvider>
  );
}

