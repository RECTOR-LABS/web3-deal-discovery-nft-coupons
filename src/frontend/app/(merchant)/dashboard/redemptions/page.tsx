'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { History, ExternalLink, Loader2, Filter, Calendar } from 'lucide-react';
import { createClient } from '@/lib/database/supabase';

interface Redemption {
  id: string;
  created_at: string;
  deal_title: string;
  deal_id: string;
  user_wallet: string;
  transaction_signature: string | null;
  discount_percentage: number;
  original_price: number | null;
  category: string;
}

export default function RedemptionsPage() {
  const { publicKey } = useWallet();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | '7days' | '30days'>('all');

  useEffect(() => {
    const fetchRedemptions = async () => {
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

        // Fetch redemption events with deal details
        const { data: events, error } = await supabase
          .from('events')
          .select(`
            id,
            created_at,
            user_wallet,
            transaction_signature,
            deal_id,
            deals (
              id,
              title,
              discount_percentage,
              original_price,
              category,
              merchant_id
            )
          `)
          .eq('event_type', 'redeem')
          .eq('deals.merchant_id', merchantId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching redemptions:', error);
          setLoading(false);
          return;
        }

        // Transform data
        const redemptionData: Redemption[] = (events || [])
          .filter(event => event.deals) // Filter out events without deal data
          .map(event => ({
            id: event.id,
            created_at: event.created_at,
            deal_title: (event.deals as any).title,
            deal_id: event.deal_id,
            user_wallet: event.user_wallet,
            transaction_signature: event.transaction_signature,
            discount_percentage: (event.deals as any).discount_percentage,
            original_price: (event.deals as any).original_price,
            category: (event.deals as any).category,
          }));

        // Apply date filter
        let filteredData = redemptionData;
        if (filter !== 'all') {
          const now = new Date();
          const cutoffDate = new Date();
          if (filter === '7days') {
            cutoffDate.setDate(now.getDate() - 7);
          } else if (filter === '30days') {
            cutoffDate.setDate(now.getDate() - 30);
          }

          filteredData = redemptionData.filter(
            r => new Date(r.created_at) >= cutoffDate
          );
        }

        setRedemptions(filteredData);
      } catch (error) {
        console.error('Error fetching redemptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRedemptions();
  }, [publicKey, filter]);

  const truncateAddress = (address: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-monke-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-monke-primary mb-2">
            Redemption History
          </h1>
          <p className="text-foreground/60">
            View all coupon redemptions for your deals ({redemptions.length} total)
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-foreground/60" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | '7days' | '30days')}
            className="px-4 py-2 border-2 border-monke-border rounded-lg bg-white text-monke-primary font-medium focus:outline-none focus:ring-2 focus:ring-monke-accent"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Redemptions Table */}
      {redemptions.length > 0 ? (
        <div className="bg-white border-2 border-monke-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-monke-primary/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-monke-primary">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-monke-primary">
                    Deal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-monke-primary">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-monke-primary">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-monke-primary">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-monke-primary">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-monke-border">
                {redemptions.map((redemption) => (
                  <tr
                    key={redemption.id}
                    className="hover:bg-monke-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground/80">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-foreground/40" />
                        <span>{formatDate(redemption.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-monke-primary truncate">
                          {redemption.deal_title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/80">
                      {redemption.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-monke-accent/10 text-monke-accent">
                        {redemption.discount_percentage}% OFF
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-monke-primary/5 rounded text-sm font-mono text-foreground/80">
                        {truncateAddress(redemption.user_wallet)}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      {redemption.transaction_signature ? (
                        <a
                          href={`https://explorer.solana.com/tx/${redemption.transaction_signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <span>{truncateAddress(redemption.transaction_signature)}</span>
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-sm text-foreground/40">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-monke-border rounded-lg p-16">
          <div className="text-center">
            <History size={64} className="mx-auto mb-6 text-foreground/20" />
            <h3 className="text-xl font-bold text-monke-primary mb-2">
              No Redemptions Yet
            </h3>
            <p className="text-foreground/60 mb-6">
              Redemptions will appear here once customers redeem your coupons
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-monke-primary/5 rounded-lg text-sm text-foreground/60">
              <Calendar size={16} />
              <span>
                {filter === 'all'
                  ? 'Showing all time'
                  : filter === '7days'
                  ? 'No redemptions in the last 7 days'
                  : 'No redemptions in the last 30 days'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {redemptions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-monke-border rounded-lg p-6">
            <p className="text-sm text-foreground/60 mb-1">Total Redemptions</p>
            <p className="text-3xl font-bold text-monke-primary">
              {redemptions.length}
            </p>
          </div>
          <div className="bg-white border-2 border-monke-border rounded-lg p-6">
            <p className="text-sm text-foreground/60 mb-1">Average Discount</p>
            <p className="text-3xl font-bold text-monke-accent">
              {(
                redemptions.reduce((sum, r) => sum + r.discount_percentage, 0) /
                redemptions.length
              ).toFixed(0)}%
            </p>
          </div>
          <div className="bg-white border-2 border-monke-border rounded-lg p-6">
            <p className="text-sm text-foreground/60 mb-1">Unique Customers</p>
            <p className="text-3xl font-bold text-monke-primary">
              {new Set(redemptions.map(r => r.user_wallet)).size}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
