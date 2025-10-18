import { Coordinates, DistanceUnit } from './types';

/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 *
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @param unit Distance unit (miles or kilometers)
 * @returns Distance in specified unit
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates,
  unit: DistanceUnit = 'miles'
): number {
  const R = unit === 'miles' ? 3959 : 6371; // Earth's radius in miles or kilometers

  const lat1 = coord1.latitude;
  const lon1 = coord1.longitude;
  const lat2 = coord2.latitude;
  const lon2 = coord2.longitude;

  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}

/**
 * Format distance for display (e.g., "2.3 miles" or "15.7 km")
 */
export function formatDistance(distance: number, unit: DistanceUnit = 'miles'): string {
  const formattedDistance = distance < 10 ? distance.toFixed(1) : Math.round(distance);
  const unitLabel = unit === 'miles' ? 'mi' : 'km';
  return `${formattedDistance} ${unitLabel}`;
}

/**
 * Filter items by distance from a reference point
 */
export function filterByDistance<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLocation: Coordinates,
  maxDistance: number,
  unit: DistanceUnit = 'miles'
): Array<T & { distance: number }> {
  return items
    .filter((item) => item.latitude != null && item.longitude != null)
    .map((item) => ({
      ...item,
      distance: calculateDistance(
        userLocation,
        { latitude: item.latitude!, longitude: item.longitude! },
        unit
      ),
    }))
    .filter((item) => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance); // Sort by nearest first
}

/**
 * Get the nearest items to a location
 */
export function getNearestItems<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLocation: Coordinates,
  count: number = 10,
  unit: DistanceUnit = 'miles'
): Array<T & { distance: number }> {
  return items
    .filter((item) => item.latitude != null && item.longitude != null)
    .map((item) => ({
      ...item,
      distance: calculateDistance(
        userLocation,
        { latitude: item.latitude!, longitude: item.longitude! },
        unit
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

/**
 * Check if a point is within a certain radius
 */
export function isWithinRadius(
  point: Coordinates,
  center: Coordinates,
  radius: number,
  unit: DistanceUnit = 'miles'
): boolean {
  const distance = calculateDistance(point, center, unit);
  return distance <= radius;
}
