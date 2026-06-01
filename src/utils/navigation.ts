import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

/**
 * Opens Google Maps to navigate to a specific destination.
 */
export async function openRoute(latitude: number, longitude: number, label?: string) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Tidak bisa membuka aplikasi peta.');
    }
  } catch (err) {
    Alert.alert('Error', 'Gagal membuka rute.');
  }
}
