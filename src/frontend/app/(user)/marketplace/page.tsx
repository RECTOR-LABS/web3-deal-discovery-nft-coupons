'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/database/supabase';
import { Database } from '@/lib/database/types';
import DealCard from '@/components/user/DealCard';
import DealFilters from '@/components/user/DealFilters';
import { motion } from 'framer-motion';

type Deal = Database['public']['Tables']['deals']['Row'];

// Extended Deal type to support external deals
export type ExtendedDeal = Deal & {
  is_external?: boolean;
  source?: string;
  external_url?: string;
  merchant?: string;
};

type SortOption = 'newest' | 'expiring-soon' | 'highest-discount';
type CategoryOption = 'All' | 'Food & Beverage' | 'Retail' | 'Services' | 'Travel' | 'Entertainment' | 'Other';

export default function MarketplacePage() {
  const [deals, setDeals] = useState<ExtendedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Fetch both platform and external deals
  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);

        // Fetch platform deals from Supabase
        const { data: platformDeals, error } = await supabase
          .from('deals')
          .select('*')
          .eq('is_active', true)
          .gte('expiry_date', new Date().toISOString());

        if (error) throw error;

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
          ...(platformDeals || []),
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

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
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
  }, [deals, searchQuery, selectedCategory, sortBy]);

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
              Collect NFT coupons, trade them, and save on your favorite merchants 🛍️
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
        />
      </div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Results Count */}
        {!loading && filteredDeals.length > 0 && (
          <div className="mb-6">
            <p className="text-[#0d2a13] font-semibold">
              {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} found
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
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
              >
                <DealCard deal={deal} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
