'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useWallets } from '@privy-io/react-auth';
import { PublicKey } from '@solana/web3.js';
import { getUserCoupons, type UserCoupon } from '@/lib/solana/getUserCoupons';
import CouponCard from '@/components/user/CouponCard';
import { motion } from 'framer-motion';
import { Tag, Filter } from 'lucide-react';

const PrivyLoginButton = dynamic(
  async () => (await import('@/components/shared/PrivyLoginButton')).default,
  { ssr: false }
);

type CouponStatus = 'all' | 'active' | 'expired' | 'redeemed';

export default function MyCouponsPage() {
  const { wallets } = useWallets();
  const solanaWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  const publicKey = solanaWallet ? new PublicKey(solanaWallet.address) : null;
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
          <Tag className="w-16 h-16 text-[#0d2a13] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0d2a13] mb-4">
            Sign In to View Your Coupons
          </h1>
          <p className="text-[#174622] mb-6">
            Sign in to access all your saved coupons
          </p>
          <PrivyLoginButton />
        </motion.div>
      </div>
    );
  }

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
              My Coupons
            </h1>
            <p className="text-xl md:text-2xl text-[#f2eecb] max-w-3xl mx-auto">
              Your coupon collection
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#f3efcd] shadow-lg">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-[#174622]" />
            <div className="flex flex-wrap gap-2">
              {(['all', 'active', 'expired', 'redeemed'] as CouponStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md cursor-pointer transition-all capitalize ${
                    filter === status
                      ? 'bg-[#00ff4d] text-[#0d2a13] shadow-[#00ff4d]/30'
                      : 'bg-white text-[#0d2a13] border-2 border-[#f3efcd] hover:border-[#00ff4d] hover:shadow-lg'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-white/50 rounded-2xl animate-pulse shadow-lg"
              />
            ))}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-24 bg-white/50 rounded-2xl border-2 border-dashed border-[#174622]/30 mt-8">
            <div className="mb-4 text-6xl">🎫</div>
            <p className="text-[#0d2a13] text-2xl font-bold mb-2">
              {filter === 'all'
                ? 'You don\'t have any coupons yet'
                : `No ${filter} coupons found`}
            </p>
            <p className="text-[#174622] mb-6">
              {filter === 'all'
                ? 'Start collecting coupons from amazing deals!'
                : 'Try adjusting your filter'}
            </p>
            {filter === 'all' && (
              <Link
                href="/marketplace"
                className="inline-block bg-[#00ff4d] hover:bg-[#00cc3d] text-[#0d2a13] font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Browse Deals
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
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
