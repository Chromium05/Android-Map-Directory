import type { ViewStyle } from 'react-native';

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

/**
 * Web — react-native-maps is Android/iOS only. Renders the SVG campus plan with
 * interactive pins so the Peta screen is fully functional on web.
 */
export default function CampusMap({ markers, selectedId, onMarkerClick, style }: CampusMapProps) {
  return (
    <CampusPlan
      visibleIds={markers.map((m) => Number(m.id))}
      selectedId={selectedId !== undefined ? Number(selectedId) : undefined}
      onPinPress={(id) => onMarkerClick?.(String(id))}
      style={style}
    />
  );
}
