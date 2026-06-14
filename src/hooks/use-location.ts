import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { CAMPUS_CENTER } from '@/constants/units';

export type LocationState = {
  latitude: number;
  longitude: number;
  granted: boolean;
  loading: boolean;
  error?: string;
};

/**
 * Hook to manage user location permissions and real-time position updates.
 * Returns the current location or campus center as fallback.
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    ...CAMPUS_CENTER,
    granted: false,
    loading: true,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startWatching() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setState((s) => ({
            ...s,
            granted: false,
            loading: false,
            error: 'Izin lokasi ditolak. Aktifkan di Setelan untuk melihat rute.',
          }));
          return;
        }

        // Get initial position quickly
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setState({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          granted: true,
          loading: false,
        });

        // Start watching for changes
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1, // Update every 1 meter
            timeInterval: 1000,   // Or every 1 second
          },
          (location) => {
            setState({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              granted: true,
              loading: false,
            });
          }
        );
      } catch (err: any) {
        setState((s) => ({
          ...s,
          loading: false,
          error: 'Gagal mengambil lokasi. Pastikan GPS aktif.',
        }));
      }
    }

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return state;
}
