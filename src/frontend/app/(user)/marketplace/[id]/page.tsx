'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/database/supabase';
import { Database } from '@/lib/database/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Calendar, Tag, TrendingUp, ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { claimCoupon } from '@/lib/solana/purchase';

type Deal = Database['public']['Tables']['deals']['Row'];
type Merchant = Database['public']['Tables']['merchants']['Row'];

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey, signTransaction } = useWallet();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function fetchDealAndMerchant() {
      if (!params.id || typeof params.id !== 'string') return;

      try {
        setLoading(true);

        // Fetch deal
        const { data: dealData, error: dealError } = await supabase
          .from('deals')
          .select('*')
          .eq('id', params.id)
          .single();

        if (dealError) throw dealError;
        setDeal(dealData);

        // Fetch merchant
        if (dealData.merchant_id) {
          const { data: merchantData, error: merchantError } = await supabase
            .from('merchants')
            .select('*')
            .eq('id', dealData.merchant_id)
            .single();

          if (merchantError) throw merchantError;
          setMerchant(merchantData);
        }
      } catch (error) {
        console.error('Error fetching deal:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchDealAndMerchant();
    }
  }, [params.id]);

  const handleClaimCoupon = async () => {
    if (!publicKey || !signTransaction || !deal) return;

    try {
      setClaiming(true);
      const signature = await claimCoupon(deal, publicKey, signTransaction);

      // Record purchase event
      await supabase.from('events').insert({
        event_type: 'purchase',
        deal_id: deal.id,
        user_wallet: publicKey.toBase58(),
        metadata: { signature },
      });

      alert('Coupon claimed successfully! Check your wallet and My Coupons.');
      router.push('/coupons');
    } catch (error) {
      console.error('Error claiming coupon:', error);
      alert('Failed to claim coupon. Please try again.');
    } finally {
      setClaiming(false);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d2a13] to-[#174622] flex items-center justify-center">
        <div className="text-[#f2eecb] text-xl">Loading deal...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d2a13] to-[#174622] flex items-center justify-center">
        <div className="text-[#f2eecb] text-xl">Deal not found</div>
      </div>
    );
  }

  const expiryDate = new Date(deal.expiry_date!);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 3;
  const isExpired = expiryDate < now;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d2a13] to-[#174622]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/marketplace')}
          className="flex items-center text-[#f2eecb] hover:text-[#00ff4d] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative h-96 lg:h-full rounded-lg overflow-hidden bg-gradient-to-br from-[#0d2a13] to-[#174622]">
              {deal.image_url ? (
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-32 h-32 text-[#f2eecb]/50" />
                </div>
              )}

              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-[#00ff4d] text-[#0d2a13] px-6 py-3 rounded-lg font-bold text-3xl shadow-lg">
                {deal.discount_percentage}% OFF
              </div>

              {/* Expiring Soon Badge */}
              {isExpiringSoon && !isExpired && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold animate-pulse">
                  Expiring Soon!
                </div>
              )}

              {/* Expired Badge */}
              {isExpired && (
                <div className="absolute top-4 left-4 bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Expired
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#f2eecb] rounded-lg p-8"
          >
            <h1 className="text-4xl font-bold text-[#0d2a13] mb-4">{deal.title}</h1>

            {/* Merchant Info */}
            {merchant && (
              <div className="mb-6 pb-6 border-b border-[#174622]/20">
                <p className="text-[#174622] text-sm font-medium">Merchant</p>
                <p className="text-[#0d2a13] text-lg font-semibold">
                  {merchant.business_name}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0d2a13] mb-2">Description</h2>
              <p className="text-[#174622]">
                {deal.description || 'No description available'}
              </p>
            </div>

            {/* Metadata */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-[#174622]">
                <Tag className="w-5 h-5 mr-3" />
                <span className="font-medium">Category: {deal.category}</span>
              </div>

              <div className="flex items-center text-[#174622]">
                <Calendar className="w-5 h-5 mr-3" />
                <span className="font-medium">
                  Expires: {expiryDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center text-[#174622]">
                <TrendingUp className="w-5 h-5 mr-3" />
                <span className={`font-medium ${isExpiringSoon ? 'text-red-600' : ''}`}>
                  {isExpired ? 'Expired' : `${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'day' : 'days'} remaining`}
                </span>
              </div>
            </div>

            {/* NFT Metadata */}
            <div className="bg-[#0d2a13]/5 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-[#0d2a13] mb-2">NFT Coupon Details</h3>
              <div className="space-y-1 text-sm text-[#174622]">
                <p>Mint Address: <span className="font-mono text-xs">{deal.nft_mint_address}</span></p>
                <p>Redemptions: Single-use (burn on redeem)</p>
                <a
                  href={`https://explorer.solana.com/address/${deal.nft_mint_address}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#00ff4d] hover:underline mt-2"
                >
                  View on Solana Explorer <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!publicKey ? (
                <div className="text-center">
                  <p className="text-[#174622] mb-4">Connect your wallet to claim this coupon</p>
                  <WalletMultiButton />
                </div>
              ) : isExpired ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white font-bold py-4 rounded-lg cursor-not-allowed"
                >
                  Deal Expired
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={claiming}
                  className="w-full bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold py-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {claiming ? 'Claiming...' : 'Claim Coupon (FREE)'}
                </button>
              )}

              {/* Share Button */}
              <button className="w-full bg-[#174622] hover:bg-[#174622]/90 text-[#f2eecb] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share Deal
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f2eecb] rounded-lg p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-[#0d2a13] mb-4">Confirm Claim</h2>
            <p className="text-[#174622] mb-6">
              You are about to claim this NFT coupon. The NFT will be minted to your wallet.
            </p>

            <div className="bg-[#0d2a13]/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#174622]"><strong>Deal:</strong> {deal.title}</p>
              <p className="text-sm text-[#174622]"><strong>Discount:</strong> {deal.discount_percentage}%</p>
              <p className="text-sm text-[#174622]"><strong>Gas Fee:</strong> ~0.000005 SOL</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-[#0d2a13] font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClaimCoupon}
                disabled={claiming}
                className="flex-1 bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {claiming ? 'Claiming...' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
