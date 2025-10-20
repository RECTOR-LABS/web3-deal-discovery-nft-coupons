'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { PlusCircle, Package, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/database/supabase';

interface Deal {
  id: string;
  nft_mint_address: string;
  title: string;
  description: string | null;
  image_url: string | null;
  discount_percentage: number | null;
  expiry_date: string | null;
  category: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

export default function MyDealsPage() {
  const { publicKey } = useWallet();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setMerchantId] = useState<string>('');

  useEffect(() => {
    const fetchDeals = async () => {
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

        setMerchantId(merchantData.merchant.id);

        // Fetch deals
        const supabase = createClient();
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('merchant_id', merchantData.merchant.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching deals:', error);
        } else {
          setDeals(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [publicKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-monke-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0d2a13] mb-2">My Deals</h1>
          <p className="text-[#174622]">
            Manage your digital coupon deals ({deals.length} total)
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="px-6 py-3 bg-monke-primary text-white font-bold rounded-lg hover:bg-monke-accent transition-colors flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Create Deal</span>
        </Link>
      </div>

      {deals.length === 0 ? (
        /* Empty State */
        <div className="bg-white border-2 border-monke-border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-monke-cream border-2 border-monke-border rounded-full mx-auto flex items-center justify-center">
              <Package size={40} className="text-monke-primary" />
            </div>
            <h3 className="text-2xl font-bold text-[#0d2a13]">No Deals Yet</h3>
            <p className="text-[#174622]">
              You haven&apos;t created any deals yet. Start by creating your first
              promotional digital coupon.
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
      ) : (
        /* Deals Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const isExpired = deal.expiry_date ? new Date(deal.expiry_date) < new Date() : false;
            const daysUntilExpiry = deal.expiry_date ? Math.ceil(
              (new Date(deal.expiry_date).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            ) : 0;

            return (
              <div
                key={deal.id}
                className="bg-white border-2 border-monke-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Deal Image */}
                {deal.image_url && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Deal Content */}
                <div className="p-4 space-y-3">
                  {/* Status & Discount Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                        isExpired
                          ? 'bg-gray-200 text-gray-600'
                          : deal.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {isExpired ? 'Expired' : deal.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="bg-monke-neon text-white px-3 py-1 rounded-full text-sm font-bold">
                      {deal.discount_percentage}% OFF
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0d2a13] line-clamp-2">
                    {deal.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#174622] line-clamp-2">
                    {deal.description}
                  </p>

                  {/* Metadata */}
                  <div className="pt-3 border-t border-monke-border space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#174622] font-medium">Category</span>
                      <span className="font-bold text-[#0d2a13]">
                        {deal.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#174622] font-medium">Expires</span>
                      <span
                        className={`font-bold ${
                          isExpired
                            ? 'text-red-600'
                            : daysUntilExpiry <= 3
                            ? 'text-orange-600'
                            : 'text-[#0d2a13]'
                        }`}
                      >
                        {isExpired
                          ? 'Expired'
                          : daysUntilExpiry === 0
                          ? 'Today'
                          : daysUntilExpiry === 1
                          ? 'Tomorrow'
                          : `${daysUntilExpiry} days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#174622] font-medium">Coupon ID</span>
                      <span className="font-mono text-xs text-[#0d2a13] font-semibold">
                        {deal.nft_mint_address.slice(0, 4)}...
                        {deal.nft_mint_address.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
