'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/database/supabase';
import { Database } from '@/lib/database/types';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { Calendar, Tag, TrendingUp, ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import RatingSystem from '@/components/user/RatingSystem';
import VoteButtons from '@/components/user/VoteButtons';
import ShareButtons from '@/components/user/ShareButtons';
import PurchaseModal from '@/components/payments/PurchaseModal';
import { claimCouponDirect } from '@/lib/solana/coupon-marketplace';

type Deal = Database['public']['Tables']['deals']['Row'];
type Merchant = Database['public']['Tables']['merchants']['Row'];

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const wallet = useWallet();
  const { publicKey, signTransaction } = wallet;
  const { connection } = useConnection();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Get referrer wallet from URL params (if shared via referral link)
  const referrerWallet = searchParams.get('ref');

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
    if (!publicKey || !signTransaction || !deal || !merchant) return;

    try {
      setClaiming(true);

      console.log('[handleClaimCoupon] Starting free coupon claim...');
      console.log('[handleClaimCoupon] Deal:', deal.id, deal.title);
      console.log('[handleClaimCoupon] NFT Mint:', deal.nft_mint_address);
      console.log('[handleClaimCoupon] Merchant:', merchant.wallet_address);

      // Call smart contract directly (Escrow PDA → User)
      const result = await claimCouponDirect(
        connection,
        wallet,
        new PublicKey(deal.nft_mint_address),
        new PublicKey(merchant.wallet_address)
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to claim coupon');
      }

      console.log('[handleClaimCoupon] ✅ Coupon claimed on-chain:', result.signature);
      console.log('[handleClaimCoupon] 🔗 Solscan:', result.solscanUrl);

      // Record referral if user came via referral link
      if (referrerWallet && referrerWallet !== publicKey.toBase58()) {
        try {
          await fetch('/api/referrals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deal_id: deal.id,
              referrer_wallet: referrerWallet,
              referee_wallet: publicKey.toBase58(),
            }),
          });
        } catch (referralError) {
          console.error('Failed to record referral:', referralError);
        }
      }

      // Record claim event in database (non-critical)
      try {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'purchase',
            deal_id: deal.id,
            user_wallet: publicKey.toBase58(),
            metadata: {
              nft_mint: deal.nft_mint_address,
              claim_signature: result.signature,
              transfer_type: 'claim',
              timestamp: new Date().toISOString(),
            },
          }),
        });
      } catch (dbError) {
        console.error('Failed to record claim in database (non-critical):', dbError);
      }

      alert(`Coupon claimed successfully!\n\nNFT transferred to your wallet from Escrow PDA.\nView on Solscan: ${result.solscanUrl}`);
      router.push('/coupons');
    } catch (error) {
      console.error('[handleClaimCoupon] Error:', error);
      alert(`Failed to claim coupon: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

            {/* Community Voting */}
            <div className="bg-[#0d2a13]/5 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-[#0d2a13] mb-3">Community Rating</h3>
              <div className="flex items-center justify-center">
                <VoteButtons dealId={deal.id} size="lg" showScore={true} />
              </div>
              <p className="text-xs text-[#174622] text-center mt-2">
                Help others discover great deals by voting
              </p>
            </div>

            {/* Coupon Details */}
            <div className="bg-[#0d2a13]/5 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-[#0d2a13] mb-2">Coupon Details</h3>
              <div className="space-y-1 text-sm text-[#174622]">
                <p>Coupon ID: <span className="font-mono text-xs">{deal.nft_mint_address}</span></p>
                <p>Usage: Single-use only</p>
                <a
                  href={`https://explorer.solana.com/address/${deal.nft_mint_address}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#00ff4d] hover:underline mt-2"
                >
                  View Details <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!publicKey ? (
                <div className="text-center">
                  <p className="text-[#174622] mb-4">Sign in to get this coupon</p>
                  <WalletMultiButton />
                </div>
              ) : isExpired ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white font-bold py-4 rounded-lg cursor-not-allowed"
                >
                  Deal Expired
                </button>
              ) : deal.price ? (
                // Paid coupon - show purchase button
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full bg-[#00ff4d] hover:bg-[#00cc3d] text-[#0d2a13] font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Buy Coupon - {deal.price.toFixed(3)} SOL
                </button>
              ) : (
                // Free coupon - show claim button
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={claiming}
                  className="w-full bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold py-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {claiming ? 'Getting Coupon...' : 'Get Coupon (FREE)'}
                </button>
              )}

              {/* Share Buttons */}
              <div className="bg-[#f2eecb]/50 rounded-lg p-4">
                <ShareButtons dealId={deal.id} dealTitle={deal.title} variant="default" />
              </div>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <RatingSystem dealId={params.id as string} />
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
            <h2 className="text-2xl font-bold text-[#0d2a13] mb-4">Confirm</h2>
            <p className="text-[#174622] mb-6">
              You are about to get this coupon. It will be added to your account instantly.
            </p>

            <div className="bg-[#0d2a13]/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#174622]"><strong>Deal:</strong> {deal.title}</p>
              <p className="text-sm text-[#174622]"><strong>Discount:</strong> {deal.discount_percentage}%</p>
              <p className="text-sm text-[#174622]"><strong>Processing Fee:</strong> FREE</p>
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
                {claiming ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Purchase Modal for Paid Coupons */}
      {deal && merchant && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          dealTitle={deal.title}
          priceSOL={deal.price || 0}
          discountPercentage={deal.discount_percentage || 0}
          imageUrl={deal.image_url || undefined}
          dealId={deal.id}
          merchantWallet={merchant.wallet_address}
          nftMintAddress={deal.nft_mint_address}
          isResale={false}
          onSuccess={() => {
            router.push('/coupons');
          }}
        />
      )}
    </div>
  );
}
