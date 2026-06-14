import React, { useRef, useEffect, useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
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

// OpenStreetMap Tile URL
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

/**
 * Interactive campus map using OpenStreetMap (Leaflet) via WebView.
 * This avoids the need for a Google Maps API key on Android.
 * Features a PUBG-style dashed line from user location to selected marker.
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
  const webViewRef = useRef<WebView>(null);

  // Prepare HTML content for Leaflet
  const htmlContent = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background: ${theme.background}; }
        #map { height: 100vh; width: 100vw; }
        .user-dot {
          width: 14px;
          height: 14px;
          background-color: ${theme.route};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          background-color: ${theme.route}33;
          border-radius: 50%;
          margin-top: -13px;
          margin-left: -13px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          attributionControl: false
        }).setView([${center.latitude}, ${center.longitude}], ${zoom});

        L.tileLayer('${TILE_URL}', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var markersLayer = L.layerGroup().addTo(map);
        var userMarker = null;
        var pubgLine = null;
        var markersMap = {};

        function updateData(markers, selectedId, userLoc) {
          markersLayer.clearLayers();
          markersMap = {};
          
          markers.forEach(function(m) {
            var isSelected = m.id === selectedId;
            var marker = L.marker([m.latitude, m.longitude], {
              icon: L.divIcon({
                className: '',
                html: '<div style="background-color: ' + (isSelected ? '${theme.route}' : '${theme.text}') + '; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })
            }).on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'CLICK', id: m.id}));
            });
            marker.addTo(markersLayer);
            markersMap[m.id] = m;
          });

          // Update User Location
          if (userLoc) {
            if (!userMarker) {
              userMarker = L.marker([userLoc.latitude, userLoc.longitude], {
                icon: L.divIcon({
                  className: '',
                  html: '<div class="pulse"></div><div class="user-dot"></div>',
                  iconSize: [14, 14],
                  iconAnchor: [7, 7]
                })
              }).addTo(map);
            } else {
              userMarker.setLatLng([userLoc.latitude, userLoc.longitude]);
            }
          }

          // Update PUBG Line
          if (pubgLine) {
            map.removeLayer(pubgLine);
            pubgLine = null;
          }

          if (userLoc && selectedId && markersMap[selectedId]) {
            var target = markersMap[selectedId];
            pubgLine = L.polyline([
              [userLoc.latitude, userLoc.longitude],
              [target.latitude, target.longitude]
            ], {
              color: '${theme.route}',
              weight: 3,
              dashArray: '5, 10',
              opacity: 0.8
            }).addTo(map);
          }
        }

        window.addEventListener('message', function(e) {
          var data = JSON.parse(e.data);
          if (data.type === 'UPDATE') {
            updateData(data.markers, data.selectedId, data.userLocation);
          }
        });

        // Initial update
        updateData(${JSON.stringify(markers)}, "${selectedId}", ${JSON.stringify(userLocation)});
      </script>
    </body>
    </html>
  `, [theme, center, zoom]);

  // Sync data whenever props change
  useEffect(() => {
    const data = {
      type: 'UPDATE',
      markers,
      selectedId,
      userLocation
    };
    webViewRef.current?.postMessage(JSON.stringify(data));
  }, [markers, selectedId, userLocation]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'CLICK') {
        onMarkerClick?.(data.id);
      }
    } catch (e) {
      console.warn('Failed to parse WebView message', e);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={false}
        overScrollMode="never"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        onLoadEnd={() => {
          // Send initial update again just in case
          const data = {
            type: 'UPDATE',
            markers,
            selectedId,
            userLocation
          };
          webViewRef.current?.postMessage(JSON.stringify(data));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

