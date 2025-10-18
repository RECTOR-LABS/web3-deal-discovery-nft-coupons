import { Coordinates, LocationResult } from './types';

/**
 * Check if geolocation is supported by the browser
 */
export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Get the user's current location using the browser's Geolocation API
 * Requests permission if not already granted
 */
export async function getUserLocation(): Promise<LocationResult> {
  if (!isGeolocationSupported()) {
    return {
      success: false,
      error: 'Geolocation is not supported by your browser',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }

        resolve({
          success: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: false, // Faster, less battery
        timeout: 10000, // 10 seconds
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
}

/**
 * Watch user's location for continuous updates
 * Returns a watchId that can be used to clear the watch
 */
export function watchUserLocation(
  onLocationUpdate: (coordinates: Coordinates) => void,
  onError?: (error: string) => void
): number | null {
  if (!isGeolocationSupported()) {
    onError?.('Geolocation is not supported by your browser');
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onLocationUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      let errorMessage = 'Unable to watch your location';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      onError?.(errorMessage);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // Update every minute
    }
  );

  return watchId;
}

/**
 * Stop watching user's location
 */
export function clearLocationWatch(watchId: number): void {
  if (isGeolocationSupported()) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coordinates: Coordinates): string {
  return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
}
