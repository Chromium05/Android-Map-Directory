const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY!;

export type RoutePoint = { latitude: number; longitude: number };

export type WalkingRoute = {
  coordinates: RoutePoint[];
  distanceM: number;
  durationS: number;
};

/**
 * Fetches a walking route between two points using OpenRouteService (OSM-based).
 * Returns null on any failure so callers can fall back to a straight line.
 */
export async function getWalkingRoute(
  from: RoutePoint,
  to: RoutePoint
): Promise<WalkingRoute | null> {
  try {
    const res = await fetch(
      'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',
      {
        method: 'POST',
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [
            [from.longitude, from.latitude],
            [to.longitude, to.latitude],
          ],
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;

    const coordinates: RoutePoint[] = feature.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng })
    );
    const summary = feature.properties?.summary;

    return {
      coordinates,
      distanceM: summary?.distance ?? 0,
      durationS: summary?.duration ?? 0,
    };
  } catch {
    return null;
  }
}