import { NextRequest, NextResponse } from 'next/server';

// RapidAPI response item structure (Get Promo Codes API)
// Flexible structure to handle multiple response formats
interface RapidAPICouponItem {
  name?: string;
  title?: string;
  description?: string;
  discount?: string;
  discount_amount?: string;
  discount_percentage?: string;
  code?: string;
  merchant?: string;
  store?: string;
  retailer?: string;
  category?: string;
  categories?: string[];
  expires?: string;
  expiry?: string;
  expiration_date?: string;
  url?: string;
  link?: string;
}

interface ExternalDeal {
  name: string;
  description: string;
  discount: string;
  merchant: string;
  category: string;
  expires?: string;
  url?: string;
  source: 'rapidapi' | 'mock';
}

interface NormalizedDeal {
  id: string;
  title: string;
  description: string;
  discount: number;
  merchant: string;
  category: string;
  expiry_date: string;
  image_url: string;
  is_external: true;
  source: string;
  external_url?: string;
}

// Simple in-memory cache
const cache: {
  data: NormalizedDeal[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

async function fetchFromRapidAPI(): Promise<ExternalDeal[]> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    console.warn('RAPIDAPI_KEY not set - returning mock data');
    return getMockDeals();
  }

  try {
    // Using Get Promo Codes API
    // Endpoint: /data/get-coupons/ (supports ?page=1 for pagination)
    const apiHost = 'get-promo-codes.p.rapidapi.com';
    const endpoint = '/data/get-coupons/';
    const params = '?page=1'; // Start with page 1

    const response = await fetch(`https://${apiHost}${endpoint}${params}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
    });

    if (!response.ok) {
      console.error(`RapidAPI error: ${response.status} ${response.statusText}`);
      throw new Error(`RapidAPI returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle different response formats (array or object with data property)
    const coupons = Array.isArray(data) ? data : (data.data || data.coupons || data.results || []);

    if (!Array.isArray(coupons) || coupons.length === 0) {
      console.warn('No coupons returned from API, using mock data');
      return getMockDeals();
    }

    // Transform API response to our ExternalDeal format
    return coupons.slice(0, 20).map((item: RapidAPICouponItem) => ({
      name: item.name || item.title || 'Limited Time Offer',
      description: item.description || 'Check out this amazing deal!',
      discount: item.discount || item.discount_percentage || item.discount_amount || item.code || '10',
      merchant: item.merchant || item.store || item.retailer || 'Partner Store',
      category: mapCategory(
        item.category ||
        (Array.isArray(item.categories) ? item.categories[0] : undefined) ||
        'Other'
      ),
      expires: item.expires || item.expiry || item.expiration_date || undefined,
      url: item.url || item.link || undefined,
      source: 'rapidapi' as const,
    }));
  } catch (error) {
    console.error('Error fetching from RapidAPI:', error);
    console.warn('Falling back to mock data');
    return getMockDeals();
  }
}

function getMockDeals(): ExternalDeal[] {
  return [
    {
      name: '25% Off All Electronics',
      description: 'Get 25% off all electronics including laptops, phones, and accessories',
      discount: '25',
      merchant: 'TechMart',
      category: 'Retail',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'mock',
    },
    {
      name: 'Buy 1 Get 1 Free Pizza',
      description: 'Order any large pizza and get a second one absolutely free',
      discount: '50',
      merchant: 'Pizza Paradise',
      category: 'Food & Beverage',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'mock',
    },
    {
      name: '30% Off Spa Services',
      description: 'Relax and rejuvenate with 30% off all spa treatments',
      discount: '30',
      merchant: 'Serenity Spa',
      category: 'Services',
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'mock',
    },
    {
      name: 'Flight Deals - Up to 40% Off',
      description: 'Book your next adventure with up to 40% off domestic and international flights',
      discount: '40',
      merchant: 'SkyWings Airlines',
      category: 'Travel',
      expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'mock',
    },
    {
      name: '2-for-1 Movie Tickets',
      description: 'See the latest blockbusters with 2-for-1 ticket deals every Tuesday',
      discount: '50',
      merchant: 'Cinema Central',
      category: 'Entertainment',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'mock',
    },
  ];
}

function mapCategory(externalCategory: string): string {
  const categoryMap: { [key: string]: string } = {
    'electronics': 'Retail',
    'technology': 'Retail',
    'food': 'Food & Beverage',
    'dining': 'Food & Beverage',
    'restaurant': 'Food & Beverage',
    'spa': 'Services',
    'beauty': 'Services',
    'health': 'Services',
    'travel': 'Travel',
    'flights': 'Travel',
    'hotel': 'Travel',
    'entertainment': 'Entertainment',
    'movies': 'Entertainment',
    'events': 'Entertainment',
  };

  const normalizedCategory = externalCategory.toLowerCase();
  return categoryMap[normalizedCategory] || 'Other';
}

function normalizeDeals(externalDeals: ExternalDeal[]): NormalizedDeal[] {
  return externalDeals.map((deal, index) => {
    // Extract discount percentage
    const discountMatch = deal.discount.match(/(\d+)/);
    const discountPercentage = discountMatch ? parseInt(discountMatch[1], 10) : 10;

    // Generate expiry date if not provided
    const expiryDate = deal.expires || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Generate placeholder image based on category
    const imageUrl = getCategoryImage(deal.category);

    return {
      id: `external-${deal.source}-${index}-${Date.now()}`,
      title: deal.name,
      description: deal.description,
      discount: discountPercentage,
      merchant: deal.merchant,
      category: deal.category,
      expiry_date: expiryDate,
      image_url: imageUrl,
      is_external: true,
      source: deal.source === 'rapidapi' ? 'Partner Network' : 'Demo Deals',
      external_url: deal.url,
    };
  });
}

function getCategoryImage(category: string): string {
  const imageMap: { [key: string]: string } = {
    'Food & Beverage': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    'Retail': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    'Services': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    'Travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
    'Entertainment': 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
    'Other': 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400',
  };

  return imageMap[category] || imageMap['Other'];
}

export async function GET(_request: NextRequest) {
  try {
    const now = Date.now();

    // Check cache
    if (cache.data && now - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        deals: cache.data,
        cached: true,
        cache_age: Math.floor((now - cache.timestamp) / 1000),
      });
    }

    // Fetch fresh data
    const externalDeals = await fetchFromRapidAPI();
    const normalizedDeals = normalizeDeals(externalDeals);

    // Update cache
    cache.data = normalizedDeals;
    cache.timestamp = now;

    return NextResponse.json({
      success: true,
      deals: normalizedDeals,
      cached: false,
      count: normalizedDeals.length,
    });
  } catch (error) {
    console.error('Error in aggregated deals API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch aggregated deals',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
