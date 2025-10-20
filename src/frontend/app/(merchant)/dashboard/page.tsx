'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Package,
  Eye,
  ShoppingCart,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import MerchantOnboarding from '@/components/merchant/MerchantOnboarding';

interface MerchantProfile {
  business_name: string;
  wallet_address: string;
  created_at: string;
}

interface DashboardStats {
  totalDeals: number;
  totalViews: number;
  totalPurchases: number;
  totalRedemptions: number;
}

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

// Loading skeleton component
function SkeletonCard() {
  return (
    <div className="bg-white border-2 border-monke-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-monke-cream rounded-lg" />
        <div className="w-6 h-6 bg-monke-cream rounded" />
      </div>
      <div className="w-16 h-8 bg-monke-cream rounded mb-2" />
      <div className="w-24 h-4 bg-monke-cream rounded" />
    </div>
  );
}

export default function DashboardHomePage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletChecked, setWalletChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [stats] = useState<DashboardStats>({
    totalDeals: 0,
    totalViews: 0,
    totalPurchases: 0,
    totalRedemptions: 0,
  });

  // Give wallet adapter time to initialize before checking authentication
  useEffect(() => {
    const timer = setTimeout(() => {
      setWalletChecked(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMerchantStatus = async () => {
      // Wait for initial wallet check
      if (!walletChecked) {
        return;
      }

      // After initial check, verify wallet is connected
      if (!connected || !publicKey) {
        console.log('Not signed in, redirecting to home...');
        router.push('/');
        return;
      }

      try {
        console.log('Fetching merchant profile for:', publicKey.toBase58());
        const response = await fetch(
          `/api/merchant/profile?wallet=${publicKey.toBase58()}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.merchant) {
            console.log('Merchant found:', data.merchant);
            setMerchant(data.merchant);
            // TODO: Fetch actual stats from database
            // For now, showing placeholder zeros
          } else {
            console.log('Merchant not registered, showing onboarding...');
            // Merchant not registered, show onboarding guide
            setShowOnboarding(true);
          }
        } else if (response.status === 404) {
          console.log('Merchant not found (404), showing onboarding...');
          // Merchant not found, show onboarding guide
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking merchant status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMerchantStatus();
  }, [connected, publicKey, router, walletChecked]);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton Welcome */}
        <div className="bg-white border-2 border-monke-border rounded-lg p-8 animate-pulse">
          <div className="w-64 h-8 bg-monke-cream rounded mb-3" />
          <div className="w-96 h-4 bg-monke-cream rounded" />
        </div>

        {/* Skeleton CTA */}
        <div className="h-32 bg-gradient-to-r from-monke-primary to-monke-accent rounded-lg animate-pulse" />

        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Show onboarding for unregistered merchants
  if (showOnboarding) {
    return <MerchantOnboarding />;
  }

  if (!merchant) {
    return null; // Still loading or redirecting
  }

  const statCards = [
    {
      label: 'Total Deals',
      value: stats.totalDeals,
      icon: Package,
      color: '#3b82f6',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+0%',
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: '#8b5cf6',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '+0%',
    },
    {
      label: 'Purchases',
      value: stats.totalPurchases,
      icon: ShoppingCart,
      color: '#10b981',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+0%',
    },
    {
      label: 'Redemptions',
      value: stats.totalRedemptions,
      icon: CheckCircle,
      color: '#f59e0b',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trend: '+0%',
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Animated Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-white via-monke-cream/30 to-white border-2 border-monke-border rounded-lg p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-monke-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-monke-primary/5 rounded-full blur-3xl" />

        <div className="relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3 mb-3"
          >
            <Sparkles className="text-monke-neon" size={28} />
            <h1 className="text-4xl font-black text-monke-primary">
              Welcome back, {merchant.business_name}!
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-monke-primary/70 font-medium"
          >
            Here&apos;s an overview of your digital coupon platform performance
          </motion.p>
        </div>
      </motion.div>

      {/* Quick Actions - Animated CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden bg-gradient-to-r from-monke-primary via-monke-accent to-monke-primary bg-[length:200%_100%] animate-gradient border-2 border-monke-accent rounded-lg p-8 shadow-xl shadow-monke-primary/20"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
              Ready to create deals?
              <motion.span
                animate={{ rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                🚀
              </motion.span>
            </h2>
            <p className="text-white/90 text-base font-medium">
              Start minting digital coupons and attract more customers
            </p>
          </div>
          <Link href="/dashboard/create">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,255,77,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-monke-neon text-monke-primary font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-monke-neon/50 cursor-pointer"
            >
              <PlusCircle size={22} />
              <span className="text-lg">Create Deal</span>
              <ArrowUpRight size={20} />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Animated Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 20px 40px ${stat.color}20`,
                borderColor: stat.color,
              }}
              className="bg-white border-2 border-monke-border rounded-lg p-6 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className={stat.iconColor} size={24} />
                </motion.div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <TrendingUp size={16} />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <h3 className="text-4xl font-black text-monke-primary mb-1">
                <AnimatedCounter value={stat.value} duration={1500} />
              </h3>
              <p className="text-sm text-monke-primary/70 font-semibold">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State - First Deal with Animation */}
      {stats.totalDeals === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gradient-to-br from-white via-monke-cream/20 to-white border-2 border-monke-border rounded-lg p-12 text-center shadow-lg"
        >
          <div className="max-w-md mx-auto space-y-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="w-24 h-24 bg-gradient-to-br from-monke-cream to-monke-neon/20 border-2 border-monke-border rounded-full mx-auto flex items-center justify-center shadow-xl"
            >
              <Package size={48} className="text-monke-primary" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-3xl font-black text-monke-primary"
            >
              Create Your First Deal
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-monke-primary/70 font-medium text-lg"
            >
              Start by creating your first promotional digital coupon. Your customers
              will be able to purchase, trade, and redeem them on-chain.
            </motion.p>
            <Link href="/dashboard/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors shadow-lg hover:shadow-xl cursor-pointer"
              >
                <PlusCircle size={22} />
                <span className="text-lg">Create Your First Deal</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Recent Activity with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-white border-2 border-monke-border rounded-lg p-6 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-monke-primary mb-4 flex items-center gap-2">
          Recent Activity
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 bg-monke-neon rounded-full"
          />
        </h2>
        <div className="text-center py-16 text-monke-primary/60">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Package size={48} className="mx-auto mb-4 opacity-30" />
          </motion.div>
          <p className="font-semibold text-lg mb-2">No recent activity yet</p>
          <p className="text-sm font-medium">
            Activity will appear here once you create deals
          </p>
        </div>
      </motion.div>

      {/* Quick Stats Footer with Stagger Animation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { label: 'Conversion Rate', value: '0%' },
          { label: 'Active Deals', value: '0' },
          { label: 'Redemption Rate', value: '0%' },
          { label: 'Member Since', value: new Date(merchant.created_at).toLocaleDateString() },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, borderColor: '#00ff4d' }}
            className="p-6 bg-white border-2 border-monke-border rounded-lg transition-all"
          >
            <p className="text-3xl font-black text-monke-primary mb-2">{item.value}</p>
            <p className="text-xs text-monke-primary/70 font-semibold uppercase tracking-wide">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
