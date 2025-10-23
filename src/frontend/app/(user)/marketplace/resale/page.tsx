'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Database } from '@/lib/database/types';
import DealCard, { ExtendedDeal as DealCardExtendedDeal } from '@/components/user/DealCard';
import { TierLevel } from '@/lib/loyalty/types';
import { ShoppingCart, TrendingUp, Repeat } from 'lucide-react';
import PurchaseModal from '@/components/payments/PurchaseModal';

type Deal = Database['public']['Tables']['deals']['Row'];
type ResaleListing = Database['public']['Tables']['resale_listings']['Row'];

// Extended Deal type for resale listings
type ResaleListingWithDeal = ResaleListing & {
  deal: Deal & {
    merchants?: {
      business_name?: string | null;
      city?: string | null;
      state?: string | null;
    } | null;
  } | null;
};

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'discount_desc';
type CategoryOption = 'All' | 'Food & Beverage' | 'Retail' | 'Services' | 'Travel' | 'Entertainment' | 'Other';

export default function ResaleMarketplacePage() {
  const { publicKey, connected } = useWallet();

  const [listings, setListings] = useState<ResaleListingWithDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [userTier, setUserTier] = useState<TierLevel>('Bronze');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedListing, setSelectedListing] = useState<ResaleListingWithDeal | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Fetch user's tier
  useEffect(() => {
    async function fetchUserTier() {
      if (!connected || !publicKey) {
        setUserTier('Bronze');
        return;
      }

      try {
        const response = await fetch(`/api/user/tier?wallet=${publicKey.toBase58()}`);
        if (response.ok) {
          const data = await response.json();
          setUserTier(data.tierInfo.currentTier);
        }
      } catch (error) {
        console.error('Error fetching user tier:', error);
      }
    }

    fetchUserTier();
  }, [connected, publicKey]);

  // Fetch resale listings
  useEffect(() => {
    async function fetchResaleListings() {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (minPrice !== null) params.append('min_price', minPrice.toString());
        if (maxPrice !== null) params.append('max_price', maxPrice.toString());
        params.append('sort', sortBy);

        const response = await fetch(`/api/resale/listings?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch resale listings');

        const data = await response.json();
        if (data.success) {
          setListings(data.listings);
        }
      } catch (error) {
        console.error('Error fetching resale listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResaleListings();
  }, [selectedCategory, sortBy, minPrice, maxPrice]);

  // Filter listings based on search query
  const filteredListings = useMemo(() => {
    if (!searchQuery) return listings;

    return listings.filter(
      (listing) =>
        listing.deal?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.deal?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listings, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalListings = filteredListings.length;
    const avgPrice = totalListings > 0
      ? filteredListings.reduce((sum, l) => sum + (l.price_sol || 0), 0) / totalListings
      : 0;
    const avgDiscount = totalListings > 0
      ? filteredListings.reduce((sum, l) => sum + (l.deal?.discount_percentage || 0), 0) / totalListings
      : 0;

    return { totalListings, avgPrice, avgDiscount };
  }, [filteredListings]);

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
            <div className="flex items-center justify-center gap-3 mb-4">
              <Repeat size={48} className="text-[#00ff4d]" />
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#f2eecb] via-white to-[#00ff4d] bg-clip-text text-transparent">
              Resale Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-[#f2eecb] max-w-3xl mx-auto mb-8">
              Browse and purchase NFT coupons from other users. Secondary market for unused deals 🔄
            </p>

            {/* Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6"
              >
                <ShoppingCart size={32} className="text-[#00ff4d] mb-3 mx-auto" />
                <div className="text-4xl font-black text-white mb-2">{stats.totalListings}</div>
                <div className="text-[#f2eecb] font-semibold">Active Listings</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6"
              >
                <TrendingUp size={32} className="text-[#00ff4d] mb-3 mx-auto" />
                <div className="text-4xl font-black text-white mb-2">{stats.avgPrice.toFixed(3)} SOL</div>
                <div className="text-[#f2eecb] font-semibold">Average Price</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6"
              >
                <div className="text-4xl font-black text-[#00ff4d] mb-2">{Math.round(stats.avgDiscount)}%</div>
                <div className="text-[#f2eecb] font-semibold">Avg Discount</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Custom Filters for Resale */}
        <div className="bg-white border-2 border-monke-border rounded-lg p-6 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-monke-primary mb-2">
                Search Deals
              </label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-monke-border rounded-lg focus:outline-none focus:ring-2 focus:ring-monke-neon"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-monke-primary mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryOption)}
                className="w-full px-4 py-2 border-2 border-monke-border rounded-lg focus:outline-none focus:ring-2 focus:ring-monke-neon bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Retail">Retail</option>
                <option value="Services">Services</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-monke-primary mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 border-2 border-monke-border rounded-lg focus:outline-none focus:ring-2 focus:ring-monke-neon bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount_desc">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mt-6 bg-white border-2 border-monke-border rounded-lg p-4 shadow-md">
          <h3 className="text-monke-primary font-bold mb-3">Price Range (SOL)</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-monke-primary mb-2">
                Min Price
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="0.000"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-4 py-2 border-2 border-monke-border rounded-lg focus:outline-none focus:ring-2 focus:ring-monke-neon"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-monke-primary mb-2">
                Max Price
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="10.000"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-4 py-2 border-2 border-monke-border rounded-lg focus:outline-none focus:ring-2 focus:ring-monke-neon"
              />
            </div>
            {(minPrice !== null || maxPrice !== null) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setMinPrice(null);
                    setMaxPrice(null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Marketplace Fee Notice */}
        <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 font-semibold text-center">
            ℹ️ All resale purchases include a 2.5% platform fee. Sellers receive 97.5% of the listing price.
          </p>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Results Count */}
        {!loading && filteredListings.length > 0 && (
          <div className="mb-6">
            <p className="text-[#0d2a13] font-semibold">
              {filteredListings.length} resale {filteredListings.length === 1 ? 'listing' : 'listings'} found
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-white/50 rounded-2xl animate-pulse shadow-lg"
              />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-24 bg-white/50 rounded-2xl border-2 border-dashed border-[#174622]/30">
            <div className="mb-4 text-6xl">🛒</div>
            <p className="text-[#0d2a13] text-2xl font-bold mb-2">
              No resale listings found
            </p>
            <p className="text-[#174622] mb-6">
              {searchQuery || selectedCategory !== 'All' || minPrice !== null || maxPrice !== null
                ? 'Try adjusting your search or filters'
                : 'Be the first to list a coupon for resale!'}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredListings.map((listing, index) => {
              // Convert listing to Deal format for DealCard
              const dealForCard = listing.deal
                ? {
                    ...listing.deal,
                    // Add resale-specific metadata
                    is_resale: true,
                    resale_price: listing.price_sol,
                    resale_listing_id: listing.id,
                    resale_seller: listing.seller_wallet,
                  }
                : null;

              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  onClick={() => {
                    setSelectedListing(listing);
                    setShowPurchaseModal(true);
                  }}
                  className="cursor-pointer"
                >
                  {dealForCard && (
                    <div className="relative">
                      {/* Resale Badge */}
                      <div className="absolute top-4 right-4 z-10 bg-[#00ff4d] text-[#0d2a13] px-3 py-1 rounded-full font-bold text-sm shadow-lg border-2 border-[#0d2a13]">
                        🔄 Resale: {listing.price_sol?.toFixed(3)} SOL
                      </div>
                      <DealCard deal={dealForCard as DealCardExtendedDeal} userTier={userTier} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Purchase Modal for Resale */}
      {selectedListing && selectedListing.deal && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedListing(null);
          }}
          dealTitle={selectedListing.deal.title}
          priceSOL={selectedListing.price_sol || 0}
          discountPercentage={selectedListing.deal.discount_percentage || 0}
          imageUrl={selectedListing.deal.image_url || undefined}
          isResale={true}
          resaleListingId={selectedListing.id}
          sellerWallet={selectedListing.seller_wallet}
          onSuccess={() => {
            // Refresh listings
            setShowPurchaseModal(false);
            setSelectedListing(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
