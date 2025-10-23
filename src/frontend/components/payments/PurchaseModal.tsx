'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { X, Loader2, CheckCircle2, XCircle, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealTitle: string;
  priceSOL: number;
  discountPercentage?: number;
  imageUrl?: string;
  dealId?: string;
  isResale?: boolean;
  resaleListingId?: string;
  sellerWallet?: string;
  onSuccess?: () => void;
}

const PLATFORM_WALLET = process.env.NEXT_PUBLIC_PLATFORM_WALLET || 'HAtD...Ube5'; // TODO: Replace with actual platform wallet
const MARKETPLACE_FEE_PERCENTAGE = 0.025; // 2.5% fee

export default function PurchaseModal({
  isOpen,
  onClose,
  dealTitle,
  priceSOL,
  discountPercentage,
  imageUrl,
  dealId,
  isResale = false,
  resaleListingId,
  sellerWallet,
  onSuccess,
}: PurchaseModalProps) {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txSignature, setTxSignature] = useState('');

  const handlePurchase = async () => {
    if (!connected || !publicKey) {
      setStatus('error');
      setErrorMessage('Please connect your wallet first');
      return;
    }

    if (isResale && !sellerWallet) {
      setStatus('error');
      setErrorMessage('Seller wallet address is missing');
      return;
    }

    try {
      setStatus('processing');
      setErrorMessage('');

      // Connect to Solana
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet'
          ? 'https://api.mainnet-beta.solana.com'
          : 'https://api.devnet.solana.com',
        'confirmed'
      );

      // Calculate amounts
      const totalLamports = Math.floor(priceSOL * LAMPORTS_PER_SOL);

      let platformFeeLamports = 0;
      let sellerProceedsLamports = totalLamports;

      if (isResale) {
        platformFeeLamports = Math.floor(totalLamports * MARKETPLACE_FEE_PERCENTAGE);
        sellerProceedsLamports = totalLamports - platformFeeLamports;
      }

      // Create transaction
      const transaction = new Transaction();

      if (isResale && sellerWallet) {
        // Resale purchase: Split payment between seller and platform
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(sellerWallet),
            lamports: sellerProceedsLamports,
          })
        );

        if (platformFeeLamports > 0) {
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(PLATFORM_WALLET),
              lamports: platformFeeLamports,
            })
          );
        }
      } else if (dealId) {
        // Direct purchase: Payment to platform wallet (merchant gets paid later)
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(PLATFORM_WALLET),
            lamports: totalLamports,
          })
        );
      }

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);

      // Wait for confirmation
      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed'
      );

      // Record purchase in database
      if (isResale && resaleListingId) {
        // Record resale purchase
        const response = await fetch('/api/resale/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listing_id: resaleListingId,
            buyer_wallet: publicKey.toBase58(),
            transaction_signature: signature,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to record resale purchase');
        }
      } else if (dealId) {
        // Record direct purchase
        const response = await fetch('/api/payments/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dealId,
            userWallet: publicKey.toBase58(),
            amount: priceSOL,
            transactionSignature: signature,
            paymentType: 'direct_purchase',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to record purchase');
        }
      }

      setStatus('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Purchase error:', error);
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
