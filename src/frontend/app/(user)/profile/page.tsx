'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import TierProgress from '@/components/user/TierProgress';
import BadgeCollection from '@/components/user/BadgeCollection';
import { UserTierInfo, Badge } from '@/lib/loyalty/types';

const PrivyLoginButton = dynamic(
  async () => (await import('@/components/shared/PrivyLoginButton')).default,
  { ssr: false }
);

export default function ProfilePage() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const solanaWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  const [loading, setLoading] = useState(true);
  const [tierInfo, setTierInfo] = useState<UserTierInfo | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [nextBadges, setNextBadges] = useState<any[]>([]);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const [stats, setStats] = useState({
    totalRedemptions: 0,
    totalReferrals: 0,
    totalReviews: 0,
    totalUpvotes: 0,
  });

  useEffect(() => {
    if (authenticated && solanaWallet) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [authenticated, solanaWallet]);

  async function fetchUserProfile() {
    if (!solanaWallet) return;

    try {
      setLoading(true);

      // Fetch tier info
      const tierResponse = await fetch(
        `/api/user/tier?wallet=${solanaWallet.address}`
      );
      if (tierResponse.ok) {
        const tierData = await tierResponse.json();
        setTierInfo(tierData.tierInfo);
        setStats(tierData.stats);
      }

      // Fetch badges
      const badgesResponse = await fetch(
        `/api/user/badges?wallet=${solanaWallet.address}`
      );
      if (badgesResponse.ok) {
        const badgesData = await badgesResponse.json();
        setBadges(badgesData.earnedBadges || []);
        setNextBadges(badgesData.nextBadges || []);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!authenticated || !solanaWallet) {
    return (
      <div className="min-h-screen bg-[#f2eecb] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg"
        >
          <User className="w-16 h-16 mx-auto mb-4 text-[#174622]" />
          <h2 className="text-2xl font-bold text-[#0d2a13] mb-2">
            Sign In to View Profile
          </h2>
          <p className="text-[#174622] mb-6">
            Connect your account to view your tier, badges, and stats
          </p>
          <PrivyLoginButton />
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2eecb] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white rounded-2xl" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-96 bg-white rounded-2xl" />
              <div className="h-96 bg-white rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2eecb] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-[#174622] hover:text-[#0d2a13] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-[#0d2a13]">My Profile</h1>
            <p className="text-[#174622] mt-2">
              Track your tier progress, earned badges, and achievements
            </p>
          </motion.div>
        </div>

        {/* Wallet Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0d2a13] mb-1">Account</h3>
              <p className="text-sm font-mono text-[#174622] break-all">
                {solanaWallet.address}
              </p>
            </div>
            <User className="w-12 h-12 text-[#00ff4d]" />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Redemptions', value: stats.totalRedemptions, color: '#00ff4d' },
            { label: 'Referrals', value: stats.totalReferrals, color: '#174622' },
            { label: 'Reviews', value: stats.totalReviews, color: '#2196F3' },
            { label: 'Upvotes', value: stats.totalUpvotes, color: '#9C27B0' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-lg text-center"
            >
              <div
                className="text-3xl font-black mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-[#174622]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tier Progress and Badge Collection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Tier Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {tierInfo && <TierProgress tierInfo={tierInfo} />}
          </motion.div>

          {/* Badge Collection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <BadgeCollection earnedBadges={badges} nextBadges={nextBadges} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
