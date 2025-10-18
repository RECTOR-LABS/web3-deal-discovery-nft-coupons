import { GeocodingResult } from './types';

/**
 * Geocode an address to coordinates using OpenStreetMap Nominatim API
 * Free, no API key required
 *
 * @param address Full address string (e.g., "1600 Amphitheatre Parkway, Mountain View, CA")
 * @returns Geocoding result with coordinates and formatted address
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address || address.trim().length === 0) {
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DealCoupon-Web3-Platform', // Nominatim requires a User-Agent
      },
    });

    if (!response.ok) {
      console.error('Geocoding request failed:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.error('No geocoding results found for address:', address);
      return null;
    }

    const result = data[0];

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village,
      country: result.address?.country,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to an address
 *
 * @param latitude Latitude
 * @param longitude Longitude
 * @returns Human-readable address
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodingResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DealCoupon-Web3-Platform',
      },
    });

    if (!response.ok) {
      console.error('Reverse geocoding request failed:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (!data) {
      console.error('No reverse geocoding results found');
      return null;
    }

    return {
      latitude,
      longitude,
      displayName: data.display_name,
      city: data.address?.city || data.address?.town || data.address?.village,
      country: data.address?.country,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Search for places matching a query
 * Useful for autocomplete
 *
 * @param query Search query (e.g., "coffee shops in san francisco")
 * @param limit Maximum number of results
 * @returns Array of geocoding results
 */
export async function searchPlaces(
  query: string,
  limit: number = 5
): Promise<GeocodingResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DealCoupon-Web3-Platform',
      },
    });

    if (!response.ok) {
      console.error('Place search request failed:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((result: any) => ({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village,
      country: result.address?.country,
    }));
  } catch (error) {
    console.error('Place search error:', error);
    return [];
  }
}
