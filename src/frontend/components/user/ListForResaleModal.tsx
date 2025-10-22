'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { UserCoupon } from '@/lib/solana/getUserCoupons';
import { motion } from 'framer-motion';
import { X, DollarSign, TrendingUp, Info } from 'lucide-react';

interface ListForResaleModalProps {
  coupon: UserCoupon;
  onClose: () => void;
}

export default function ListForResaleModal({ coupon, onClose }: ListForResaleModalProps) {
  const { publicKey } = useWallet();
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      setError('Please connect your wallet');
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Please enter a valid price greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/resale/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nft_mint: coupon.mint,
          seller_wallet: publicKey.toBase58(),
          price_sol: priceNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to list coupon for resale');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reload page to update coupon list
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list coupon');
    } finally {
      setLoading(false);
    }
  };

  // Calculate marketplace fee
  const priceNumber = parseFloat(price) || 0;
  const marketplaceFee = priceNumber * 0.025;
  const sellerProceeds = priceNumber - marketplaceFee;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#f2eecb] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d2a13] to-[#174622] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <DollarSign size={32} className="text-[#00ff4d]" />
            <div>
              <h2 className="text-2xl font-bold">List for Resale</h2>
              <p className="text-[#f2eecb]/80 text-sm">Set your price in SOL</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="mb-4 text-6xl">✅</div>
              <h3 className="text-2xl font-bold text-[#0d2a13] mb-2">
                Listed Successfully!
              </h3>
              <p className="text-[#174622]">
                Your coupon is now available in the resale marketplace.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Coupon Info */}
              <div className="bg-white border-2 border-[#0d2a13]/10 rounded-lg p-4">
                <h3 className="font-bold text-[#0d2a13] mb-2 line-clamp-1">
                  {coupon.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#174622]">
                  <TrendingUp size={16} />
                  <span className="font-semibold">{coupon.discount}% OFF</span>
                  <span className="text-[#0d2a13]/50">•</span>
                  <span>{coupon.category}</span>
                </div>
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-[#0d2a13] font-bold mb-2">
                  Listing Price (SOL)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  placeholder="0.100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#0d2a13]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ff4d] focus:border-transparent text-lg font-semibold"
                  required
                />
                <p className="text-sm text-[#174622] mt-1">
                  Minimum: 0.001 SOL
                </p>
              </div>

              {/* Fee Breakdown */}
              {priceNumber > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2 text-amber-800 mb-3">
                    <Info size={18} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold">
                      Fee Breakdown (2.5% platform fee)
                    </p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#0d2a13]">Listing Price:</span>
                      <span className="font-bold text-[#0d2a13]">
                        {priceNumber.toFixed(3)} SOL
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#174622]">Platform Fee (2.5%):</span>
                      <span className="font-semibold text-[#174622]">
                        -{marketplaceFee.toFixed(3)} SOL
                      </span>
                    </div>
                    <div className="border-t border-amber-300 pt-1 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#0d2a13]">You&apos;ll Receive:</span>
                        <span className="font-bold text-[#00ff4d] text-lg">
                          {sellerProceeds.toFixed(3)} SOL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !price}
                className="w-full bg-[#00ff4d] hover:bg-[#00cc3d] text-[#0d2a13] font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-[#0d2a13] border-t-transparent rounded-full animate-spin" />
                    Listing...
                  </span>
                ) : (
                  'List for Resale'
                )}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-white border-2 border-[#0d2a13]/20 hover:bg-[#0d2a13]/5 text-[#0d2a13] font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
