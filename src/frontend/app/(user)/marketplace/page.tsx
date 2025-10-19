'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { supabase } from '@/lib/database/supabase';
import { Database } from '@/lib/database/types';
import DealCard from '@/components/user/DealCard';
import DealFilters from '@/components/user/DealFilters';
import ActivityFeed from '@/components/user/ActivityFeed';
import DistanceFilter from '@/components/user/DistanceFilter';
import MapView, { MapMarker } from '@/components/user/MapView';
import { motion } from 'framer-motion';
import { TierLevel } from '@/lib/loyalty/types';
import { getUserLocation, filterByDistance, Coordinates } from '@/lib/geolocation';
import { List, Map } from 'lucide-react';

type Deal = Database['public']['Tables']['deals']['Row'];

// Deal with joined merchant data
type DealWithMerchant = Deal & {
  merchants?: {
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
    state?: string | null;
    business_name?: string | null;
  } | null;
};

// Extended Deal type to support external deals, tier requirements, and location (Epic 10)
export type ExtendedDeal = Deal & {
  is_external?: boolean;
  source?: string;
  external_url?: string;
  merchant?: string;
  min_tier?: TierLevel | null;
  is_exclusive?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  merchant_city?: string | null;
  merchant_state?: string | null;
  merchant_name?: string | null;
};

type SortOption = 'newest' | 'expiring-soon' | 'highest-discount' | 'nearest';
type CategoryOption = 'All' | 'Food & Beverage' | 'Retail' | 'Services' | 'Travel' | 'Entertainment' | 'Other';

export default function MarketplacePage() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  // Support both embedded and external Solana wallets
  const solanaWallet = wallets.find((wallet) => (wallet as { chainType?: string }).chainType === 'solana');

  const [deals, setDeals] = useState<ExtendedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [userTier, setUserTier] = useState<TierLevel>('Bronze');

  // Geolocation state (Epic 10)
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Request user location (Epic 10)
  const handleRequestLocation = async () => {
    const result = await getUserLocation();
    if (result.success && result.coordinates) {
      setUserLocation(result.coordinates);
    } else {
      alert(result.error || 'Unable to get your location');
    }
  };

  // Fetch user's tier
  useEffect(() => {
    async function fetchUserTier() {
      if (!authenticated || !solanaWallet) {
        setUserTier('Bronze');
        return;
      }

      try {
        const response = await fetch(`/api/user/tier?wallet=${solanaWallet.address}`);
        if (response.ok) {
          const data = await response.json();
          setUserTier(data.tierInfo.currentTier);
        }
      } catch (error) {
        console.error('Error fetching user tier:', error);
      }
    }

    fetchUserTier();
  }, [authenticated, solanaWallet]);

  // Fetch both platform and external deals
  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);

        // Fetch platform deals from Supabase with merchant location data (Epic 10)
        const { data: platformDeals, error } = await supabase
          .from('deals')
          .select(`
            *,
            merchants (
              latitude,
              longitude,
              city,
              state,
              business_name
            )
          `)
          .eq('is_active', true)
          .gte('expiry_date', new Date().toISOString());

        if (error) throw error;

        // Flatten merchant location data into deals (Epic 10)
        const dealsWithLocation: ExtendedDeal[] = (platformDeals || []).map((deal: DealWithMerchant) => ({
          ...deal,
          min_tier: deal.min_tier as TierLevel | null,
          latitude: deal.merchants?.latitude || null,
          longitude: deal.merchants?.longitude || null,
          merchant_city: deal.merchants?.city || null,
          merchant_state: deal.merchants?.state || null,
          merchant_name: deal.merchants?.business_name || null,
        }));

        // Fetch external deals from aggregator API
        let externalDeals: ExtendedDeal[] = [];
        try {
          const response = await fetch('/api/deals/aggregated');
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.deals) {
              externalDeals = result.deals;
            }
          }
        } catch (externalError) {
          console.error('Error fetching external deals:', externalError);
          // Continue with platform deals only if external fetch fails
        }

        // Merge platform and external deals
        const allDeals: ExtendedDeal[] = [
          ...dealsWithLocation,
          ...externalDeals,
        ];

        setDeals(allDeals);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    let filtered = deals;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((deal) => deal.category === selectedCategory);
    }

    // Distance filter (Epic 10) - Only filter if user location and distance are set
    if (userLocation && selectedDistance) {
      // Filter deals with valid lat/lng and within selected distance
      const dealsWithDistance = filterByDistance(
        filtered.filter((deal) => deal.latitude && deal.longitude) as Array<ExtendedDeal & { latitude: number; longitude: number }>,
        userLocation,
        selectedDistance,
        'miles'
      );

      // Add back deals without location (external deals, etc.) but mark distance as null
      const dealsWithoutLocation = filtered
        .filter((deal) => !deal.latitude || !deal.longitude)
        .map((deal) => ({ ...deal, distance: undefined }));

      filtered = [...dealsWithDistance, ...dealsWithoutLocation] as ExtendedDeal[];
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'nearest' && userLocation) {
        // Sort by distance if user has location
        const aDistance = (a as ExtendedDeal & { distance?: number }).distance;
        const bDistance = (b as ExtendedDeal & { distance?: number }).distance;

        // Deals without location go to the end
        if (aDistance === undefined && bDistance === undefined) return 0;
        if (aDistance === undefined) return 1;
        if (bDistance === undefined) return -1;

        return aDistance - bDistance;
      } else if (sortBy === 'newest') {
        const aCreated = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bCreated = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bCreated - aCreated;
      } else if (sortBy === 'expiring-soon') {
        const aExpiry = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
        const bExpiry = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
        return aExpiry - bExpiry;
      } else if (sortBy === 'highest-discount') {
        return (b.discount_percentage || 0) - (a.discount_percentage || 0);
      }
      return 0;
    });

    return filtered;
  }, [deals, searchQuery, selectedCategory, sortBy, userLocation, selectedDistance]);

  // Prepare map markers (Epic 10)
  const mapMarkers: MapMarker[] = useMemo(() => {
    return filteredDeals
      .filter((deal) => deal.latitude && deal.longitude)
      .map((deal) => ({
        id: deal.id,
        position: {
          latitude: deal.latitude!,
          longitude: deal.longitude!,
        },
        title: deal.title,
        description: `${deal.discount_percentage}% OFF`,
        imageUrl: deal.image_url || undefined,
        onClick: () => {
          // Navigate to deal detail page
          window.location.href = `/marketplace/${deal.id}`;
        },
      }));
  }, [filteredDeals]);

  return (
    <div className="min-h-screen bg-[#f2eecb]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] text-white py-20 px-4 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff4d] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00ff4d] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#f2eecb] via-white to-[#00ff4d] bg-clip-text text-transparent">
              Discover Amazing Deals
            </h1>
            <p className="text-xl md:text-2xl text-[#f2eecb] max-w-3xl mx-auto">
              Collect coupons, trade them, and save on your favorite merchants 🛍️
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DealFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          hasLocation={!!userLocation}
        />

        {/* View Mode Toggle (List vs Map) - Epic 10 */}
        {userLocation && (
          <div className="mt-6 flex justify-end">
            <div className="inline-flex bg-white border-2 border-monke-border rounded-lg p-1 shadow-md">
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-monke-primary text-white'
                    : 'text-monke-primary hover:bg-monke-cream/50'
                }`}
              >
                <List size={18} />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'map'
                    ? 'bg-monke-primary text-white'
                    : 'text-monke-primary hover:bg-monke-cream/50'
                }`}
              >
                <Map size={18} />
                <span>Map View</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column - Deals (List or Map View) */}
          <div className="lg:col-span-8">
            {/* Results Count */}
            {!loading && filteredDeals.length > 0 && (
              <div className="mb-6">
                <p className="text-[#0d2a13] font-semibold">
                  {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} found
                  {userLocation && selectedDistance && (
                    <span className="text-monke-neon ml-2">
                      (within {selectedDistance} miles)
                    </span>
                  )}
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-96 bg-white/50 rounded-2xl animate-pulse shadow-lg"
                  />
                ))}
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="text-center py-24 bg-white/50 rounded-2xl border-2 border-dashed border-[#174622]/30">
                <div className="mb-4 text-6xl">🔍</div>
                <p className="text-[#0d2a13] text-2xl font-bold mb-2">
                  {searchQuery || selectedCategory !== 'All'
                    ? 'No deals found'
                    : 'No active deals yet'}
                </p>
                <p className="text-[#174622] mb-6">
                  {searchQuery || selectedCategory !== 'All'
                    ? 'Try adjusting your search or filters'
                    : 'Check back soon for amazing deals!'}
                </p>
              </div>
            ) : viewMode === 'map' && userLocation ? (
              // Map View (Epic 10)
              <div className="space-y-4">
                <MapView
                  center={userLocation}
                  markers={mapMarkers}
                  zoom={selectedDistance ? Math.min(13 - Math.log2(selectedDistance), 13) : 12}
                  height="600px"
                  showUserLocation={true}
                  userLocation={userLocation}
                  radiusInMiles={selectedDistance || undefined}
                />
                {mapMarkers.length === 0 && (
                  <div className="text-center p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
                    <p className="text-amber-700 font-semibold">
                      No deals with location data found. Switch to List View to see all deals.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // List View (Default)
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <DealCard deal={deal} userTier={userTier} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar - Distance Filter & Activity Feed */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Distance Filter (Epic 10) */}
              <DistanceFilter
                selectedDistance={selectedDistance}
                onDistanceChange={setSelectedDistance}
                hasLocation={!!userLocation}
                onRequestLocation={handleRequestLocation}
              />

              {/* Activity Feed */}
              <ActivityFeed limit={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
