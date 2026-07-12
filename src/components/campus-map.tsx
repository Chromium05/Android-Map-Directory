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
  glyph?: string;
};

export type CampusMapProps = {
  markers: CampusMapMarker[];
  center: { latitude: number; longitude: number };
  userLocation?: { latitude: number; longitude: number; heading?: number };
  routeCoordinates?: { latitude: number; longitude: number }[];
  fitRouteTrigger?: number;
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
  routeCoordinates,
  fitRouteTrigger,
  zoom = 16,
  selectedId,
  onMarkerClick,
  style,
}: CampusMapProps) {
  const theme = useTheme();
  const webViewRef = useRef<WebView>(null);
  const initialDataRef = useRef({ markers, selectedId, userLocation, routeCoordinates, fitRouteTrigger});

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
        .user-marker-rotate {
          position: relative;
          width: 40px;
          height: 40px;
        }
        .user-dot {
          position: absolute;
          top: 50%; left: 50%;
          width: 14px;
          height: 14px;
          margin: -7px 0 0 -7px;
          background-color: ${theme.route};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          z-index: 2;
        }
        .pulse {
          position: absolute;
          top: 50%; left: 50%;
          width: 40px;
          height: 40px;
          margin: -20px 0 0 -20px;
          background-color: ${theme.route}33;
          border-radius: 50%;
          animation: pulse 2s infinite;
          z-index: 1;
        }
        .user-cone {
          position: absolute;
          top: 50%; left: 50%;
          width: 0;
          height: 0;
          margin: -34px 0 0 -9px;
          border-left: 9px solid transparent;
          border-right: 9px solid transparent;
          border-bottom: 16px solid ${theme.route};
          opacity: 0.85;
          z-index: 0;
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
        var lastFitTrigger = null;

        // Path SVG persis sama dengan Glyph di src/components/icons.tsx,
        // supaya ikon marker peta konsisten dengan ikon kategori di seluruh app.
        var GLYPH_ICONS = {
          all: '<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/>',
          dept: '<path d="M3 9 12 4l9 5"/><path d="M5 10v8M19 10v8M3 19h18"/><path d="M9 11v6M15 11v6"/>',
          kesehatan: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
          vokasi: '<path d="M14.5 6a3.5 3.5 0 1 0 3.5 4l2.5 2.5-3 3L15 13a3.5 3.5 0 1 1-.5-7Z"/><path d="M11 11 4 18l2 2 7-7"/>',
          paa: '<path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5"/><path d="M8 12h8M8 15h8M8 18h5"/>',
          kemahasiswaan: '<circle cx="9" cy="9" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="8" r="2.4"/><path d="M14.5 14.5c1 0 6 0 6.5 5.5"/>',
          lab: '<path d="M10 3h4"/><path d="M10 3v6L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-10V3"/><path d="M7.5 14h9"/>'
        };

        // Warna beda per kategori supaya marker yang berdekatan tetap
        // gampang dibedakan sekilas tanpa perlu baca ikonnya dulu.
        var GLYPH_COLORS = {
          all: '#6b7280',
          dept: '#2f6f4f',
          kesehatan: '#c0392b',
          vokasi: '#e08e2b',
          paa: '#2b6cb0',
          kemahasiswaan: '#7c3aed',
          lab: '#0f766e'
        };

        function buildUserIcon(heading) {
          var rotation = (typeof heading === 'number' && !isNaN(heading)) ? heading : 0;
          return L.divIcon({
            className: '',
            html: '<div class="user-marker-rotate" style="transform: rotate(' + rotation + 'deg);">' +
                    '<div class="pulse"></div>' +
                    '<div class="user-cone"></div>' +
                    '<div class="user-dot"></div>' +
                  '</div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });
        }

        function updateData(markers, selectedId, userLoc, routeCoords, fitTrigger) {
          markersLayer.clearLayers();
          markersMap = {};
          
          markers.forEach(function(m) {
            var isSelected = String(m.id) == String(selectedId);
            var pinColor = isSelected ? '${theme.route}' : (GLYPH_COLORS[m.glyph] || '${theme.text}');
            var iconInner = GLYPH_ICONS[m.glyph] || GLYPH_ICONS.dept;
            var html =
              '<svg width="34" height="34" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));">' +
                '<path d="M12 22s7.5-6.6 7.5-11.6A7.5 7.5 0 1 0 4.5 10.4C4.5 15.4 12 22 12 22Z" fill="' + pinColor + '" stroke="white" stroke-width="1"/>' +
                '<circle cx="12" cy="9.5" r="6.2" fill="white"/>' +
                '<g transform="translate(12 9.5) scale(0.46) translate(-12 -12)" fill="none" stroke="' + pinColor + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
                  iconInner +
                '</g>' +
              '</svg>';
            var marker = L.marker([m.latitude, m.longitude], {
              icon: L.divIcon({ className: '', html: html, iconSize: [34, 34], iconAnchor: [17, 31] }),
              zIndexOffset: isSelected ? 1000 : 0
            }).on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'CLICK', id: String(m.id)}));
            });
            marker.addTo(markersLayer);
            markersMap[String(m.id)] = m;
          });

          // Update User Location
          if (userLoc) {
            if (!userMarker) {
              userMarker = L.marker([userLoc.latitude, userLoc.longitude], {
                icon: buildUserIcon(userLoc.heading)
              }).addTo(map);
            } else {
              userMarker.setLatLng([userLoc.latitude, userLoc.longitude]);
              userMarker.setIcon(buildUserIcon(userLoc.heading));
            }
          }

          // Draw the actual walking route if we have one; otherwise fall back
          // to the old straight dashed line (e.g. while the route API is
          // loading, or if it failed/user is offline).
          if (pubgLine) {
            map.removeLayer(pubgLine);
            pubgLine = null;
          }
          if (routeCoords && routeCoords.length > 1) {
            var routeLatLngs = routeCoords.map(function(p) { return [p.latitude, p.longitude]; });
            pubgLine = L.polyline(routeLatLngs, {
              color: '${theme.route}',
              weight: 4,
              opacity: 0.9
            }).addTo(map);
          } else if (userLoc && selectedId) {
            var sel = markersMap[String(selectedId)];
            if (sel) {
              pubgLine = L.polyline(
                [[userLoc.latitude, userLoc.longitude], [sel.latitude, sel.longitude]],
                { color: '${theme.route}', weight: 3, dashArray: '6, 8', opacity: 0.8 }
              ).addTo(map);
            }
          }

          // Tombol "Lihat Rute" bump nilai ini setiap dipencet — kalau berubah,
          // fokuskan/zoom peta supaya seluruh garis rute yang sedang tergambar
          // (baik rute asli dari ORS maupun fallback garis lurus) kelihatan utuh.
          if (typeof fitRouteTrigger === 'number' && fitRouteTrigger !== lastFitTrigger) {
            lastFitTrigger = fitRouteTrigger;
            if (pubgLine) {
              map.fitBounds(pubgLine.getBounds(), { padding: [48, 48] });
            }
          }
        }

        function handleMessage(e) {
          var data = JSON.parse(e.data);
          if (data.type === 'UPDATE') {
            updateData(data.markers, data.selectedId, data.userLocation, data.routeCoordinates, data.fitRouteTrigger);
          }
        }
        document.addEventListener('message', handleMessage);
        window.addEventListener('message', handleMessage);
        

        // Initial update
         uupdateData(${JSON.stringify(initialDataRef.current.markers)}, "${initialDataRef.current.selectedId}", ${JSON.stringify(initialDataRef.current.userLocation)}, ${JSON.stringify(initialDataRef.current.routeCoordinates)}, ${JSON.stringify(initialDataRef.current.fitRouteTrigger)});
       </script>
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
      userLocation,
      routeCoordinates,
      fitRouteTrigger
    };
    webViewRef.current?.postMessage(JSON.stringify(data));
  }, [markers, selectedId, userLocation, routeCoordinates, fitRouteTrigger]);

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

