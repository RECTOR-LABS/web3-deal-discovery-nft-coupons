// Geolocation types

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  success: boolean;
  coordinates?: Coordinates;
  error?: string;
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  city?: string;
  country?: string;
}

export type DistanceUnit = 'miles' | 'kilometers';

export interface DistanceFilterOption {
  value: number;
  label: string;
  unit: DistanceUnit;
}
