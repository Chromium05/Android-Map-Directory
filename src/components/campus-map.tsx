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

// Loaded at module level so we don't violate rules of hooks — NativeCampusMap
// is only mounted when this is non-null, so the hook it calls is always invoked.
let Maps: typeof import('expo-maps') | null = null;
try {
  Maps = require('expo-maps');
} catch {
  // expo-maps native module not present (Expo Go / bare without pod install)
}

function NativeCampusMap({ markers, center, zoom = 16, onMarkerClick, style }: CampusMapProps) {
  // Destructure before JSX so `!` doesn't appear in element names.
  const { AppleMaps, GoogleMaps, useLocationPermissions } = Maps!;
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

function MapPlaceholder({ style }: { style?: ViewStyle }) {
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f1eb' }, style]}>
      <Text style={{ fontSize: 13, color: '#838c87', textAlign: 'center', lineHeight: 20, paddingHorizontal: 32 }}>
        Peta membutuhkan development build.{'\n'}Jalankan dengan Expo Dev Client.
      </Text>
    </View>
  );
}

/**
 * Native campus map backed by expo-maps (Google Maps on Android, Apple Maps on
 * iOS). Falls back to a placeholder when the native module isn't available
 * (e.g. Expo Go or missing pod install).
 */
export default function CampusMap(props: CampusMapProps) {
  if (!Maps) return <MapPlaceholder style={props.style} />;
  return <NativeCampusMap {...props} />;
}
