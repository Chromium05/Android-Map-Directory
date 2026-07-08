import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { CAMPUS_CENTER } from '@/constants/units';

export type LocationState = {
  latitude: number;
  longitude: number;
  heading?: number;
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
    let positionSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;

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

        setState((s) => ({
          ...s,
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          granted: true,
          loading: false,
        }));

        // Start watching for changes
        positionSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1, // Update every 1 meter
            timeInterval: 1000,   // Or every 1 second
          },
          (location) => {
            setState((s) => ({
            ...s,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              granted: true,
              loading: false,
            }));
          }
        );

        // Watch device compass heading — bekerja walau HP diam di tempat,
        // beda dengan coords.heading dari GPS yang cuma valid saat bergerak.
        headingSubscription = await Location.watchHeadingAsync((headingData) => {
          const heading = headingData.trueHeading >= 0 ? headingData.trueHeading : headingData.magHeading;
          setState((s) => ({ ...s, heading }));
        });
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
      if (positionSubscription) {
        positionSubscription.remove();
      }
      if (headingSubscription) {
       headingSubscription.remove();
     }
    };
  }, []);

  return state;
}
