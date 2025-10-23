'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection as _Connection, PublicKey, Transaction as _Transaction, SystemProgram as _SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { X, Loader2, CheckCircle2, XCircle, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { purchaseCouponDirect, purchaseResaleCoupon } from '@/lib/solana/coupon-marketplace';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealTitle: string;
  priceSOL: number;
  discountPercentage?: number;
  imageUrl?: string;
  dealId?: string;
  merchantWallet?: string; // Merchant's wallet for direct purchases
  nftMintAddress?: string; // NFT mint address for transfer
  isResale?: boolean;
  resaleListingId?: string;
  sellerWallet?: string;
  onSuccess?: () => void;
}

const _PLATFORM_WALLET = process.env.NEXT_PUBLIC_PLATFORM_WALLET || 'HAtDqhYd52qhbRRwZG8xVJVJu3Mfp23xK7vdW5Ube5'; // Platform fee collection wallet
const MARKETPLACE_FEE_PERCENTAGE = 0.025; // 2.5% platform fee

export default function PurchaseModal({
  isOpen,
  onClose,
  dealTitle,
  priceSOL,
  discountPercentage,
  imageUrl,
  dealId,
  merchantWallet,
  nftMintAddress,
  isResale = false,
  resaleListingId,
  sellerWallet,
  onSuccess,
}: PurchaseModalProps) {
  const wallet = useWallet();
  const { publicKey, signTransaction, connected } = wallet;
  const { connection } = useConnection();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txSignature, setTxSignature] = useState('');

  const handlePurchase = async () => {
    console.log('[PurchaseModal] handlePurchase called with:', {
      dealTitle,
      dealId,
      merchantWallet,
      nftMintAddress,
      isResale,
      sellerWallet,
      priceSOL,
    });

    if (!connected || !publicKey || !signTransaction) {
      setStatus('error');
      setErrorMessage('Please connect your wallet first');
      return;
    }

    if (!nftMintAddress) {
      setStatus('error');
      setErrorMessage('NFT mint address is missing');
      return;
    }

    try {
      setStatus('processing');
      setErrorMessage('');

      let result;

      if (isResale) {
        // RESALE PURCHASE (P2P Atomic Swap)
        if (!sellerWallet) {
          setStatus('error');
          setErrorMessage('Seller wallet address is missing');
          return;
        }

        // Prevent self-purchase
        if (publicKey.toBase58() === sellerWallet) {
          setStatus('error');
          setErrorMessage('Cannot purchase your own listing. Please use a different wallet.');
          return;
        }

        console.log('[PurchaseModal] Starting P2P resale purchase (atomic swap)...');
        console.log('[PurchaseModal] Price:', priceSOL, 'SOL');
        console.log('[PurchaseModal] Seller:', sellerWallet);
        console.log('[PurchaseModal] NFT Mint:', nftMintAddress);
        console.log('[PurchaseModal] Buyer:', publicKey.toBase58());

        // ONE ATOMIC TRANSACTION: SOL payment + NFT transfer (seller → buyer)
        result = await purchaseResaleCoupon(
          connection,
          wallet,
          new PublicKey(nftMintAddress),
          new PublicKey(sellerWallet),
          Math.floor(priceSOL * LAMPORTS_PER_SOL)
        );
      } else {
        // PRIMARY PURCHASE (From Merchant)
        if (!merchantWallet) {
          setStatus('error');
          setErrorMessage('Merchant wallet address is missing');
          return;
        }

        // Prevent merchants from purchasing their own coupons
        if (publicKey.toBase58() === merchantWallet) {
          setStatus('error');
          setErrorMessage('Merchants cannot purchase their own coupons. Please use a different wallet.');
          return;
        }

        console.log('[PurchaseModal] Starting atomic purchase (payment + NFT transfer)...');
        console.log('[PurchaseModal] Price:', priceSOL, 'SOL');
        console.log('[PurchaseModal] Merchant:', merchantWallet);
        console.log('[PurchaseModal] NFT Mint:', nftMintAddress);
        console.log('[PurchaseModal] Buyer:', publicKey.toBase58());

        // ONE ATOMIC TRANSACTION: Payment + NFT transfer (escrow → buyer)
        result = await purchaseCouponDirect(
          connection,
          wallet,
          new PublicKey(nftMintAddress),
          new PublicKey(merchantWallet)
        );
      }

      if (!result.success) {
        throw new Error(result.error || 'Purchase failed');
      }

      console.log('[PurchaseModal] ✅ Atomic purchase complete!');
      console.log('[PurchaseModal] Transaction:', result.signature);
      console.log('[PurchaseModal] Solscan:', result.solscanUrl);

      if (isResale) {
        console.log('[PurchaseModal] - SOL payment to seller (97.5%)');
        console.log('[PurchaseModal] - SOL payment to platform (2.5%)');
        console.log('[PurchaseModal] - NFT transferred from seller to buyer');
      } else {
        console.log('[PurchaseModal] - SOL payment to merchant (97.5%)');
        console.log('[PurchaseModal] - SOL payment to platform (2.5%)');
        console.log('[PurchaseModal] - NFT transferred from Escrow PDA to buyer');
      }

      setTxSignature(result.signature || '');

      // Record purchase in database (non-critical)
      if (isResale && resaleListingId) {
        // Record resale purchase
        try {
          await fetch('/api/resale/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              listing_id: resaleListingId,
              buyer_wallet: publicKey.toBase58(),
              transaction_signature: result.signature,
            }),
          });
        } catch (dbError) {
          console.error('[PurchaseModal] Failed to record resale purchase (non-critical):', dbError);
        }
      } else if (dealId) {
        // Record primary purchase
        try {
          await fetch('/api/payments/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dealId,
              userWallet: publicKey.toBase58(),
              amount: priceSOL,
              transactionSignature: result.signature,
              paymentType: 'atomic_purchase_escrow',
            }),
          });
        } catch (dbError) {
          console.error('[PurchaseModal] Failed to record in database (non-critical):', dbError);
        }
      }

      setStatus('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('[PurchaseModal] Purchase error:', error);
      console.error('[PurchaseModal] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Transaction failed');
    }
  };

  const handleClose = () => {
    if (status !== 'processing') {
      setStatus('idle');
      setErrorMessage('');
      setTxSignature('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-monke-border"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-monke-primary to-[#174622] text-white p-6 relative">
              <button
                onClick={handleClose}
                disabled={status === 'processing'}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold mb-1">
                {isResale ? 'Purchase Resale Coupon' : 'Purchase Coupon'}
              </h3>
              <p className="text-monke-cream/80 text-sm">
                {isResale ? 'Buy from secondary market' : 'Get your NFT coupon'}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Deal Preview */}
              <div className="flex gap-4 items-start bg-monke-cream/30 p-4 rounded-lg border border-monke-border">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={dealTitle}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-monke-primary">{dealTitle}</h4>
                  {discountPercentage && (
                    <p className="text-sm text-monke-neon font-semibold">
                      {discountPercentage}% OFF
                    </p>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {isResale ? 'Listing Price' : 'Coupon Price'}
                  </span>
                  <span className="font-semibold">{priceSOL.toFixed(3)} SOL</span>
                </div>

                {isResale && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform Fee (2.5%)</span>
                      <span className="font-semibold">
                        {(priceSOL * MARKETPLACE_FEE_PERCENTAGE).toFixed(3)} SOL
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Seller Receives</span>
                      <span className="font-semibold text-green-600">
                        {(priceSOL * (1 - MARKETPLACE_FEE_PERCENTAGE)).toFixed(3)} SOL
                      </span>
                    </div>
                    <div className="border-t border-gray-300 my-2"></div>
                  </>
                )}

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-monke-primary">{priceSOL.toFixed(3)} SOL</span>
                </div>
              </div>

              {/* Status Messages */}
              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">Transaction Failed</p>
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800">Purchase Successful!</p>
                    <p className="text-sm text-green-600">
                      {isResale
                        ? 'The NFT coupon is now yours!'
                        : 'Your NFT coupon will be minted shortly.'}
                    </p>
                    {txSignature && (
                      <a
                        href={`https://solscan.io/tx/${txSignature}${
                          process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                      >
                        View Transaction
                      </a>
                    )}
                  </div>
                </div>
              )}

              {!connected && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <Wallet className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Please connect your wallet to make a purchase
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handlePurchase}
                disabled={!connected || status === 'processing' || status === 'success'}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2
                  ${
                    !connected || status === 'processing' || status === 'success'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-monke-primary text-white hover:bg-monke-primary/90 active:scale-95'
                  }`}
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Purchase Complete</span>
                  </>
                ) : (
                  <span>Confirm Purchase</span>
                )}
              </button>

              {/* Cancel Button */}
              {status !== 'success' && (
                <button
                  onClick={handleClose}
                  disabled={status === 'processing'}
                  className="w-full py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
