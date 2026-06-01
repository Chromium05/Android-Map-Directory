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
 * Hook to manage user location permissions and current position.
 * Returns the current location or campus center as fallback.
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    ...CAMPUS_CENTER,
    granted: false,
    loading: true,
  });

  useEffect(() => {
    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setState((s) => ({
            ...s,
            granted: false,
            loading: false,
            error: 'Izin lokasi ditolak. Aktifkan di Setelan untuk melihat jarak.',
          }));
          return;
        }

        // Low accuracy for initial quick check, then high accuracy for precision
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setState({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          granted: true,
          loading: false,
        });
      } catch (err: any) {
        setState((s) => ({
          ...s,
          loading: false,
          error: 'Gagal mengambil lokasi. Pastikan GPS aktif.',
        }));
      }
    }

    getLocation();
  }, []);

  return state;
}
