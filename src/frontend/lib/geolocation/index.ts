// Export all geolocation utilities
export * from './types';
export * from './detect';
export * from './distance';
export * from './geocoding';

// Re-export commonly used functions for convenience
export {
  getUserLocation,
  isGeolocationSupported,
  watchUserLocation,
  clearLocationWatch,
} from './detect';

export {
  calculateDistance,
  formatDistance,
  filterByDistance,
  getNearestItems,
  isWithinRadius,
} from './distance';

export {
  geocodeAddress,
  reverseGeocode,
  searchPlaces,
} from './geocoding';
