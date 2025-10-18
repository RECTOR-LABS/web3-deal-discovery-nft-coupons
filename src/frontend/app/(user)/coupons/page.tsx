'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getUserCoupons, type UserCoupon } from '@/lib/solana/getUserCoupons';
import CouponCard from '@/components/user/CouponCard';
import { motion } from 'framer-motion';
import { Wallet, Filter } from 'lucide-react';

type CouponStatus = 'all' | 'active' | 'expired' | 'redeemed';

export default function MyCouponsPage() {
  const { publicKey } = useWallet();
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<CouponStatus>('all');

  useEffect(() => {
    async function fetchCoupons() {
      if (!publicKey) {
        setCoupons([]);
        return;
      }

      try {
        setLoading(true);
        const userCoupons = await getUserCoupons(publicKey);
        setCoupons(userCoupons);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, [publicKey]);

  const filteredCoupons = coupons.filter((coupon) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !coupon.isExpired && !coupon.isRedeemed;
    if (filter === 'expired') return coupon.isExpired;
    if (filter === 'redeemed') return coupon.isRedeemed;
    return true;
  });

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d2a13] to-[#174622] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f2eecb] rounded-lg p-8 max-w-md w-full text-center"
        >
          <Wallet className="w-16 h-16 text-[#0d2a13] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0d2a13] mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-[#174622] mb-6">
            Connect your Solana wallet to view your NFT coupons
          </p>
          <WalletMultiButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d2a13] to-[#174622]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d2a13] to-[#174622] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            My Coupons
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#f2eecb]"
          >
            Your NFT coupon collection
          </motion.p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Filter className="w-5 h-5 text-[#f2eecb]" />
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'expired', 'redeemed'] as CouponStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === status
                    ? 'bg-[#00ff4d] text-[#0d2a13]'
                    : 'bg-[#174622] text-[#f2eecb] hover:bg-[#174622]/80'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-[#174622]/30 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#f2eecb] text-xl mb-4">
              {filter === 'all'
                ? 'You don\'t have any coupons yet'
                : `No ${filter} coupons found`}
            </p>
            {filter === 'all' && (
              <Link
                href="/marketplace"
                className="inline-block bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Browse Deals
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCoupons.map((coupon, index) => (
              <motion.div
                key={coupon.mint}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CouponCard coupon={coupon} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
