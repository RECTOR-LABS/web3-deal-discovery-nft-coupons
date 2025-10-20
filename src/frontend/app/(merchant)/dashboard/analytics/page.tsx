'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BarChart3, Eye, ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { createClient } from '@/lib/database/supabase';

interface Analytics {
  totalDeals: number;
  totalViews: number;
  totalPurchases: number;
  totalRedemptions: number;
  conversionRate: number;
  redemptionRate: number;
  dealPerformance: Array<{
    name: string;
    purchases: number;
    views: number;
  }>;
  categoryBreakdown: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#0d2a13', '#174622', '#00ff4d', '#f2eecb', '#8b7355'];

export default function AnalyticsPage() {
  const { publicKey } = useWallet();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalDeals: 0,
    totalViews: 0,
    totalPurchases: 0,
    totalRedemptions: 0,
    conversionRate: 0,
    redemptionRate: 0,
    dealPerformance: [],
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        // Get merchant ID
        const merchantResponse = await fetch(
          `/api/merchant/profile?wallet=${publicKey.toBase58()}`
        );

        if (!merchantResponse.ok) {
          setLoading(false);
          return;
        }

        const merchantData = await merchantResponse.json();
        if (!merchantData.merchant) {
          setLoading(false);
          return;
        }

        const merchantId = merchantData.merchant.id;
        const supabase = createClient();

        // Fetch deals
        const { data: deals } = await supabase
          .from('deals')
          .select('*')
          .eq('merchant_id', merchantId);

        const totalDeals = deals?.length || 0;

        // Fetch events
        const { data: events } = await supabase
          .from('events')
          .select('*')
          .in('deal_id', deals?.map(d => d.id) || []);

        // Calculate metrics
        const views = events?.filter(e => e.event_type === 'view').length || 0;
        const purchases = events?.filter(e => e.event_type === 'purchase').length || 0;
        const redemptions = events?.filter(e => e.event_type === 'redemption').length || 0;

        const conversionRate = views > 0 ? ((purchases / views) * 100) : 0;
        const redemptionRate = purchases > 0 ? ((redemptions / purchases) * 100) : 0;

        // Deal performance
        const dealPerformance = deals?.map(deal => {
          const dealViews = events?.filter(e => e.deal_id === deal.id && e.event_type === 'view').length || 0;
          const dealPurchases = events?.filter(e => e.deal_id === deal.id && e.event_type === 'purchase').length || 0;

          return {
            name: deal.title.slice(0, 20) + (deal.title.length > 20 ? '...' : ''),
            purchases: dealPurchases,
            views: dealViews,
          };
        }).slice(0, 5) || []; // Top 5 deals

        // Category breakdown
        const categoryMap = new Map<string, number>();
        deals?.forEach(deal => {
          if (deal.category) {
            const count = categoryMap.get(deal.category) || 0;
            categoryMap.set(deal.category, count + 1);
          }
        });

        const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, value]) => ({
          name,
          value,
        }));

        setAnalytics({
          totalDeals,
          totalViews: views,
          totalPurchases: purchases,
          totalRedemptions: redemptions,
          conversionRate,
          redemptionRate,
          dealPerformance,
          categoryBreakdown,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [publicKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-monke-primary" size={40} />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      change: '+0%',
      icon: Eye,
      color: 'text-blue-500',
    },
    {
      label: 'Total Purchases',
      value: analytics.totalPurchases.toLocaleString(),
      change: '+0%',
      icon: ShoppingCart,
      color: 'text-green-500',
    },
    {
      label: 'Redemptions',
      value: analytics.totalRedemptions.toLocaleString(),
      change: '+0%',
      icon: CheckCircle,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0d2a13] mb-2">Analytics</h1>
        <p className="text-[#174622]">
          Track performance metrics for your {analytics.totalDeals} deals
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border-2 border-monke-border rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={stat.color} size={24} />
                <span className="text-sm font-medium text-green-500">
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-[#0d2a13] mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[#174622] font-semibold">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Conversion Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-monke-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#0d2a13] mb-2">
            Conversion Rate
          </h3>
          <p className="text-4xl font-bold text-[#174622] mb-1">
            {analytics.conversionRate.toFixed(1)}%
          </p>
          <p className="text-sm text-[#174622] font-semibold">
            Purchases / Views
          </p>
        </div>

        <div className="bg-white border-2 border-monke-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#0d2a13] mb-2">
            Redemption Rate
          </h3>
          <p className="text-4xl font-bold text-orange-600 mb-1">
            {analytics.redemptionRate.toFixed(1)}%
          </p>
          <p className="text-sm text-[#174622] font-semibold">
            Redemptions / Purchases
          </p>
        </div>
      </div>

      {/* Deal Performance Chart */}
      {analytics.dealPerformance.length > 0 ? (
        <div className="bg-white border-2 border-monke-border rounded-lg p-8">
          <h2 className="text-xl font-bold text-[#0d2a13] mb-6">
            Top Performing Deals
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dealPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="purchases" fill="#174622" name="Purchases" />
              <Bar dataKey="views" fill="#00ff4d" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white border-2 border-monke-border rounded-lg p-8">
          <h2 className="text-xl font-bold text-[#0d2a13] mb-6">
            Performance Over Time
          </h2>
          <div className="h-64 flex items-center justify-center text-[#174622] border-2 border-dashed border-monke-border rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-4 text-[#174622]" />
              <p className="font-semibold">Charts will appear once you have data</p>
              <p className="text-sm mt-2">Create deals to start tracking metrics</p>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {analytics.categoryBreakdown.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-monke-border rounded-lg p-8">
            <h2 className="text-xl font-bold text-[#0d2a13] mb-6">
              Deals by Category
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border-2 border-monke-border rounded-lg p-8">
            <h2 className="text-xl font-bold text-[#0d2a13] mb-6">
              Category Summary
            </h2>
            <div className="space-y-4">
              {analytics.categoryBreakdown.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-[#0d2a13] font-semibold">{category.name}</span>
                  </div>
                  <span className="font-bold text-[#0d2a13]">
                    {category.value} {category.value === 1 ? 'deal' : 'deals'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
