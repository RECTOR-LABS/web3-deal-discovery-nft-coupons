'use client';

import { BarChart3, TrendingUp, Eye, ShoppingCart, CheckCircle } from 'lucide-react';

export default function AnalyticsPage() {
  // TODO: Implement analytics with real data from events table

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-monke-primary mb-2">Analytics</h1>
        <p className="text-foreground/60">
          Track performance metrics for your deals
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Views',
            value: '0',
            change: '+0%',
            icon: Eye,
            color: 'text-blue-500',
          },
          {
            label: 'Total Purchases',
            value: '0',
            change: '+0%',
            icon: ShoppingCart,
            color: 'text-green-500',
          },
          {
            label: 'Redemptions',
            value: '0',
            change: '+0%',
            icon: CheckCircle,
            color: 'text-orange-500',
          },
        ].map((stat) => {
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
              <p className="text-3xl font-bold text-monke-primary mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-foreground/60">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white border-2 border-monke-border rounded-lg p-8">
        <h2 className="text-xl font-bold text-monke-primary mb-6">
          Performance Over Time
        </h2>
        <div className="h-64 flex items-center justify-center text-foreground/40 border-2 border-dashed border-monke-border rounded-lg">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto mb-4" />
            <p>Charts will appear here once you have data</p>
            <p className="text-sm mt-2">Create deals to start tracking metrics</p>
          </div>
        </div>
      </div>

      {/* Deal Performance Table Placeholder */}
      <div className="bg-white border-2 border-monke-border rounded-lg p-8">
        <h2 className="text-xl font-bold text-monke-primary mb-6">
          Deal Performance
        </h2>
        <div className="text-center py-12 text-foreground/50">
          <p>No deals to analyze yet</p>
          <p className="text-sm mt-2">Performance metrics will appear here</p>
        </div>
      </div>
    </div>
  );
}
