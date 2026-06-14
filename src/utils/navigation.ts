import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

/**
 * Opens Google Maps or the device's default map app to navigate to a specific destination.
 */
export async function openRoute(latitude: number, longitude: number, label?: string) {
  // Use geo: scheme for Android as it directly targets map apps
  // Fallback to https google maps for universal compatibility
  const scheme = Platform.select({
    android: `geo:0,0?q=${latitude},${longitude}(${label || 'Unit'})`,
    ios: `maps:0,0?q=${label || 'Unit'}@${latitude},${longitude}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  });

  const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  
  try {
    // Try the native scheme first
    const success = await Linking.openURL(scheme).catch(() => false);
    
    // If native scheme fails (e.g. on web or if scheme is rejected), try the web URL
    if (!success) {
      await Linking.openURL(webUrl);
    }
  } catch (err) {
    Alert.alert('Error', 'Gagal membuka rute. Pastikan Google Maps terinstal.');
  }
}
