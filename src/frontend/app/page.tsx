'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
import { supabase } from '@/lib/database/supabase';
import { Database } from '@/lib/database/types';
import DealCard from '@/components/user/DealCard';
import { motion } from 'framer-motion';
import { Search, MapPin, ShoppingBag, Utensils, Plane, Sparkles, TrendingUp, Tag } from 'lucide-react';
import { TierLevel } from '@/lib/loyalty/types';

type Deal = Database['public']['Tables']['deals']['Row'];

type DealWithMerchant = Deal & {
  merchants?: {
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
    state?: string | null;
    business_name?: string | null;
  } | null;
};

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

type CategoryOption = 'All' | 'Food & Beverage' | 'Retail' | 'Services' | 'Travel' | 'Entertainment' | 'Other';

const categories = [
  { name: 'All', icon: Sparkles, color: '#00ff4d' },
  { name: 'Food & Beverage', icon: Utensils, color: '#ff6b6b' },
  { name: 'Retail', icon: ShoppingBag, color: '#4ecdc4' },
  { name: 'Travel', icon: Plane, color: '#45b7d1' },
  { name: 'Entertainment', icon: Tag, color: '#ffa07a' },
  { name: 'Services', icon: TrendingUp, color: '#98d8c8' },
];

function HomePage() {
  const searchParams = useSearchParams();
  const { connected } = useWallet();
  const [deals, setDeals] = useState<ExtendedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('All');
  const [location, setLocation] = useState('Worldwide');

  // Fetch deals (platform + external)
  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);

        // Fetch platform deals from Supabase
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
          .gte('expiry_date', new Date().toISOString())
          .limit(20);

        if (error) throw error;

        // Flatten merchant data
        const dealsWithLocation: ExtendedDeal[] = (platformDeals || []).map((deal: DealWithMerchant) => ({
          ...deal,
          min_tier: deal.min_tier as TierLevel | null,
          latitude: deal.merchants?.latitude || null,
          longitude: deal.merchants?.longitude || null,
          merchant_city: deal.merchants?.city || null,
          merchant_state: deal.merchants?.state || null,
          merchant_name: deal.merchants?.business_name || null,
        }));

        // Fetch external deals
        let externalDeals: ExtendedDeal[] = [];
        try {
          const response = await fetch('/api/deals/aggregated');
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.deals) {
              externalDeals = result.deals.slice(0, 10); // Limit external deals
            }
          }
        } catch (externalError) {
          console.error('Error fetching external deals:', externalError);
        }

        // Merge and shuffle
        const allDeals = [...dealsWithLocation, ...externalDeals];
        setDeals(allDeals);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  // Filter deals
  const filteredDeals = useMemo(() => {
    let filtered = deals;

    if (searchQuery) {
      filtered = filtered.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((deal) => deal.category === selectedCategory);
    }

    return filtered;
  }, [deals, searchQuery, selectedCategory]);

  // Trending deals (highest discount)
  const trendingDeals = useMemo(() => {
    return [...deals]
      .sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0))
      .slice(0, 6);
  }, [deals]);

  return (
    <div className="min-h-screen bg-[#f2eecb]">
      {/* Header - Groupon Style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-[#00ff4d]" />
                <span className="text-2xl font-black text-[#0d2a13]">DealCoupon</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {connected ? (
                <>
                  <Link href="/coupons" className="text-sm text-gray-600 hover:text-[#0d2a13] font-medium">
                    My Coupons
                  </Link>
                  <Link href="/profile" className="text-sm text-gray-600 hover:text-[#0d2a13] font-medium">
                    Profile
                  </Link>
                </>
              ) : (
                <div className="wallet-adapter-button-container">
                  <WalletMultiButton />
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Groupon Style */}
          <div className="py-4">
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search deals, restaurants, activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00ff4d] focus:outline-none text-[#0d2a13] font-medium"
                />
              </div>

              {/* Location Selector */}
              <div className="relative min-w-[200px]">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00ff4d] focus:outline-none text-[#0d2a13] font-medium appearance-none bg-white cursor-pointer"
                >
                  <option>Worldwide</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                  <option>Miami</option>
                </select>
              </div>

              {/* Search Button */}
              <button className="px-8 py-3 bg-[#00ff4d] text-[#0d2a13] font-bold rounded-lg hover:bg-[#00cc3d] transition-all shadow-md">
                Search
              </button>
            </div>
          </div>

          {/* Category Navigation - Groupon Style */}
          <div className="flex items-center gap-6 py-3 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name as CategoryOption)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#0d2a13] text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <Icon className="w-5 h-5" style={{ color: isActive ? '#00ff4d' : cat.color }} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Hero Banner - Promotional */}
      <div className="bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff4d] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00ff4d] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#f2eecb] via-white to-[#00ff4d] bg-clip-text text-transparent">
              Web3 Deals Are Here! 🎉
            </h1>
            <p className="text-xl md:text-2xl text-[#f2eecb] max-w-3xl mx-auto">
              Discover amazing deals, collect NFT coupons, and save big on your favorite merchants
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <span className="px-4 py-2 bg-[#00ff4d]/30 border-2 border-[#00ff4d] rounded-full text-white font-bold">
                ⚡ Powered by Solana
              </span>
              <span className="px-4 py-2 bg-[#f2eecb]/20 border-2 border-[#f2eecb] rounded-full text-[#f2eecb] font-bold">
                🐵 MonkeDAO Track
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trending Section - Groupon Style */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[#00ff4d]" />
              <h2 className="text-3xl font-black text-[#0d2a13]">
                Trending in {location}
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="text-[#0d2a13] font-bold hover:text-[#00ff4d] transition-colors"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-white rounded-2xl animate-pulse shadow-lg"
                />
              ))}
            </div>
          ) : trendingDeals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <div className="mb-4 text-6xl">🔍</div>
              <p className="text-[#0d2a13] text-2xl font-bold mb-2">No deals yet</p>
              <p className="text-gray-600">Check back soon for amazing offers!</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {trendingDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DealCard deal={deal} userTier="Bronze" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* All Deals Section */}
        {filteredDeals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-[#0d2a13]">
                {selectedCategory === 'All' ? 'All Deals' : `${selectedCategory} Deals`}
              </h2>
              <p className="text-gray-600 font-semibold">
                {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} found
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredDeals.slice(0, 12).map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DealCard deal={deal} userTier="Bronze" />
                </motion.div>
              ))}
            </motion.div>

            {filteredDeals.length > 12 && (
              <div className="text-center mt-8">
                <Link
                  href="/marketplace"
                  className="inline-block px-8 py-4 bg-[#0d2a13] text-white font-bold rounded-lg hover:bg-[#174622] transition-all shadow-lg"
                >
                  View All {filteredDeals.length} Deals →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {!connected && (
        <div className="bg-[#0d2a13] text-white py-16 mt-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-black mb-4">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-[#f2eecb] mb-8">
              Connect your wallet to claim deals, collect NFT coupons, and unlock exclusive rewards
            </p>
            <div className="flex justify-center wallet-adapter-button-container">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f2eecb] flex items-center justify-center">Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
