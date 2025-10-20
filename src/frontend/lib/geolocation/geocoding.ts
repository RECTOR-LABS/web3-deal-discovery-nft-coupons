import { GeocodingResult } from './types';

/**
 * Nominatim API response interface
 */
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

/**
 * Sleep helper for retry logic
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Geocode an address to coordinates using OpenStreetMap Nominatim API
 * Free, no API key required
 * Includes retry logic with exponential backoff for rate limiting (429 errors)
 *
 * @param address Full address string (e.g., "1600 Amphitheatre Parkway, Mountain View, CA")
 * @param retries Number of retry attempts remaining (default: 3)
 * @returns Geocoding result with coordinates and formatted address
 */
export async function geocodeAddress(address: string, retries = 3): Promise<GeocodingResult | null> {
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

    // Handle rate limiting (429 Too Many Requests)
    if (response.status === 429 && retries > 0) {
      const backoffMs = (4 - retries) * 1000; // 1s, 2s, 3s
      console.warn(`Geocoding rate limited. Retrying in ${backoffMs}ms (${retries} retries left)...`);
      await sleep(backoffMs);
      return geocodeAddress(address, retries - 1);
    }

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
    // Retry on network errors
    if (retries > 0 && error instanceof Error) {
      const backoffMs = (4 - retries) * 1000;
      console.warn(`Geocoding error: ${error.message}. Retrying in ${backoffMs}ms...`);
      await sleep(backoffMs);
      return geocodeAddress(address, retries - 1);
    }

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

    return data.map((result: NominatimResult) => ({
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
