import { AppleMaps, GoogleMaps, useLocationPermissions } from 'expo-maps';
import { useEffect } from 'react';
import { Platform, Text, View, type ViewStyle } from 'react-native';

export type CampusMapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
};

export type CampusMapProps = {
  markers: CampusMapMarker[];
  center: { latitude: number; longitude: number };
  zoom?: number;
  onMarkerClick?: (id: string) => void;
  style?: ViewStyle;
};

/**
 * Native campus map backed by expo-maps (Google Maps on Android, Apple Maps on
 * iOS). Custom pin/bottom-sheet chrome is overlaid by the Peta screen; here we
 * render the real map surface with the unit markers.
 */
export default function CampusMap({ markers, center, zoom = 16, onMarkerClick, style }: CampusMapProps) {
  const [permission, requestPermission] = useLocationPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const cameraPosition = { coordinates: center, zoom };

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        style={style}
        cameraPosition={cameraPosition}
        properties={{ isMyLocationEnabled: true }}
        markers={markers.map((m) => ({
          id: m.id,
          coordinates: { latitude: m.latitude, longitude: m.longitude },
          title: m.title,
        }))}
        onMarkerClick={(e) => e.id && onMarkerClick?.(e.id)}
      />
    );
  }

  if (Platform.OS === 'android') {
    return (
      <GoogleMaps.View
        style={style}
        cameraPosition={cameraPosition}
        properties={{ isMyLocationEnabled: true }}
        uiSettings={{ mapToolbarEnabled: false, zoomControlsEnabled: false }}
        markers={markers.map((m) => ({
          id: m.id,
          coordinates: { latitude: m.latitude, longitude: m.longitude },
          title: m.title,
          showCallout: true,
        }))}
        onMarkerClick={(e) => e.id && onMarkerClick?.(e.id)}
      />
    );
  }

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <Text>Peta hanya tersedia di Android & iOS.</Text>
    </View>
  );
}
