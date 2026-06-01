import React from 'react';
import { StyleSheet, View, Platform, type ViewStyle } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type CampusMapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  subtitle?: string;
};

export type CampusMapProps = {
  markers: CampusMapMarker[];
  center: { latitude: number; longitude: number };
  userLocation?: { latitude: number; longitude: number };
  zoom?: number;
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
  style?: ViewStyle;
};

/**
 * Interactive campus map using react-native-maps (Google Maps Provider).
 */
export default function CampusMap({
  markers,
  center,
  userLocation,
  zoom = 16,
  selectedId,
  onMarkerClick,
  style,
}: CampusMapProps) {
  const theme = useTheme();

  // Convert zoom level to latitudeDelta/longitudeDelta
  const delta = 0.01; // Base delta for zoom 16

  return (
    <View style={[styles.container, style]}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          ...center,
          latitudeDelta: delta,
          longitudeDelta: delta,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapToolbarEnabled={false}
        moveOnMarkerPress={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => onMarkerClick?.(marker.id)}
            pinColor={selectedId === marker.id ? theme.route : undefined}
          >
            {/* Callout matching design specs */}
            <Callout tooltip onPress={() => onMarkerClick?.(marker.id)}>
              <View style={[styles.callout, { backgroundColor: theme.text }]}>
                <ThemedText style={{ color: theme.background, fontSize: 12, fontWeight: '700' }}>
                  {marker.title}
                </ThemedText>
                {marker.subtitle && (
                  <ThemedText style={{ color: theme.background, fontSize: 10, opacity: 0.8 }}>
                    {marker.subtitle}
                  </ThemedText>
                )}
                {/* Simple tail indicator using border tricks doesn't work well in cross-platform callouts, 
                    so we rely on the default platform callout behavior or a styled box. */}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  callout: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
});
