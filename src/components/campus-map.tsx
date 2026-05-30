import { useEffect } from 'react';
import { Platform, type ViewStyle } from 'react-native';

import CampusPlan from '@/components/campus-plan';

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
  selectedId?: string;
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

/**
 * Native campus map backed by expo-maps (Google Maps on Android, Apple Maps on
 * iOS). Falls back to the SVG campus plan when the native module isn't available
 * (e.g. Expo Go or missing pod install).
 */
export default function CampusMap(props: CampusMapProps) {
  if (!Maps) {
    return (
      <CampusPlan
        visibleIds={props.markers.map((m) => Number(m.id))}
        selectedId={props.selectedId !== undefined ? Number(props.selectedId) : undefined}
        onPinPress={(id) => props.onMarkerClick?.(String(id))}
        style={props.style}
      />
    );
  }
  return <NativeCampusMap {...props} />;
}
