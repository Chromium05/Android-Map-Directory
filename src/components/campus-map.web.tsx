import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

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
 * Web fallback — expo-maps renders only on Android/iOS. Shows a styled
 * placeholder so the Peta screen layout still composes on web.
 */
export default function CampusMap({ markers, style }: CampusMapProps) {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.backgroundSelected }, style]}>
      <Icon.map size={28} color={theme.ink3} />
      <ThemedText type="monoMeta" themeColor="ink3" style={styles.label}>
        peta · {markers.length} unit · android & ios
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { textTransform: 'uppercase', letterSpacing: 1 },
});
