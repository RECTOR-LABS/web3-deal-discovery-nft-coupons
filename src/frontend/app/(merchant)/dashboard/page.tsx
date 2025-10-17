'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PlusCircle,
  Package,
  Eye,
  ShoppingCart,
  CheckCircle,
  TrendingUp,
  Loader2,
} from 'lucide-react';

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

export default function DashboardHomePage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalDeals: 0,
    totalViews: 0,
    totalPurchases: 0,
    totalRedemptions: 0,
  });

  useEffect(() => {
    const checkMerchantStatus = async () => {
      if (!connected || !publicKey) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(
          `/api/merchant/profile?wallet=${publicKey.toBase58()}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.merchant) {
            setMerchant(data.merchant);
            // TODO: Fetch actual stats from database
            // For now, showing placeholder zeros
          } else {
            // Merchant not registered, redirect to registration
            router.push('/register');
          }
        } else if (response.status === 404) {
          // Merchant not found, redirect to registration
          router.push('/register');
        }
      } catch (error) {
        console.error('Error checking merchant status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMerchantStatus();
  }, [connected, publicKey, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-monke-primary" size={40} />
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!merchant) {
    return null; // Will redirect
  }

  const statCards = [
    {
      label: 'Total Deals',
      value: stats.totalDeals,
      icon: Package,
      color: 'bg-blue-500',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'bg-purple-500',
      iconBg: 'bg-purple-100',
    },
    {
      label: 'Purchases',
      value: stats.totalPurchases,
      icon: ShoppingCart,
      color: 'bg-green-500',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Redemptions',
      value: stats.totalRedemptions,
      icon: CheckCircle,
      color: 'bg-orange-500',
      iconBg: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white border-2 border-monke-border rounded-lg p-6">
        <h1 className="text-3xl font-bold text-monke-primary mb-2">
          Welcome back, {merchant.business_name}! 👋
        </h1>
        <p className="text-foreground/60">
          Here's an overview of your NFT coupon platform performance
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-monke-primary to-monke-accent border-2 border-monke-border rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Ready to create deals?</h2>
            <p className="text-white/80 text-sm">
              Start minting NFT coupons and attract more customers
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="px-6 py-3 bg-white text-monke-primary font-bold rounded-lg hover:bg-monke-cream transition-colors flex items-center space-x-2"
          >
            <PlusCircle size={20} />
            <span>Create Deal</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border-2 border-monke-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  <Icon className={`text-${stat.color.replace('bg-', '')}`} size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="text-3xl font-bold text-monke-primary mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-foreground/60">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Empty State - First Deal */}
      {stats.totalDeals === 0 && (
        <div className="bg-white border-2 border-monke-border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-monke-cream border-2 border-monke-border rounded-full mx-auto flex items-center justify-center">
              <Package size={40} className="text-monke-primary" />
            </div>
            <h3 className="text-2xl font-bold text-monke-primary">
              Create Your First Deal
            </h3>
            <p className="text-foreground/60">
              Start by creating your first promotional NFT coupon. Your customers
              will be able to purchase, trade, and redeem them on-chain.
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors"
            >
              <PlusCircle size={20} />
              <span>Create Your First Deal</span>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity Placeholder */}
      <div className="bg-white border-2 border-monke-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-monke-primary mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-12 text-foreground/50">
          <p>No recent activity yet</p>
          <p className="text-sm mt-2">
            Activity will appear here once you create deals
          </p>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white border-2 border-monke-border rounded-lg">
          <p className="text-2xl font-bold text-monke-primary">0%</p>
          <p className="text-xs text-foreground/60">Conversion Rate</p>
        </div>
        <div className="p-4 bg-white border-2 border-monke-border rounded-lg">
          <p className="text-2xl font-bold text-monke-primary">0</p>
          <p className="text-xs text-foreground/60">Active Deals</p>
        </div>
        <div className="p-4 bg-white border-2 border-monke-border rounded-lg">
          <p className="text-2xl font-bold text-monke-primary">0%</p>
          <p className="text-xs text-foreground/60">Redemption Rate</p>
        </div>
        <div className="p-4 bg-white border-2 border-monke-border rounded-lg">
          <p className="text-2xl font-bold text-monke-primary">
            {new Date(merchant.created_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-foreground/60">Member Since</p>
        </div>
      </div>
    </div>
  );
}
