'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { verifyRedemption, VerificationResult } from '@/lib/solana/verifyRedemption';
import { redeemCouponOnChain, recordRedemptionEvent } from '@/lib/solana/redeemCoupon';
import { CheckCircle, XCircle, QrCode, AlertTriangle, ArrowLeft, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Dynamic import to avoid SSR issues with camera access
const QRScanner = dynamic(() => import('@/components/merchant/QRScanner'), {
  ssr: false,
});

type RedemptionState = 'idle' | 'scanning' | 'verifying' | 'verified' | 'failed' | 'redeeming' | 'redeemed';

export default function RedeemPage() {
  const { publicKey, signTransaction } = useWallet();
  const [state, setState] = useState<RedemptionState>('idle');
  const [showScanner, setShowScanner] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [redemptionSignature, setRedemptionSignature] = useState<string>('');

  const handleScanSuccess = async (decodedText: string) => {
    setShowScanner(false);
    setState('verifying');
    setErrorMessage('');

    try {
      // Verify the QR code data
      const result = await verifyRedemption(decodedText);
      setVerificationResult(result);

      if (result.isValid) {
        setState('verified');
      } else {
        setState('failed');
        setErrorMessage(result.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setState('failed');
      setErrorMessage('An error occurred during verification');
    }
  };

  const handleRedeemConfirm = async () => {
    if (!verificationResult?.couponData || !publicKey || !signTransaction) {
      setErrorMessage('Merchant wallet not connected');
      setState('failed');
      return;
    }

    setState('redeeming');
    setErrorMessage('');

    try {
      // Call on-chain redemption (burn NFT)
      const result = await redeemCouponOnChain(
        {
          nftMint: verificationResult.couponData.nftMint,
          userWallet: verificationResult.couponData.userWallet,
          merchantWallet: publicKey,
        },
        signTransaction
      );

      if (!result.success) {
        setState('failed');
        setErrorMessage(result.error || 'Failed to redeem coupon on-chain');
        return;
      }

      setRedemptionSignature(result.signature || '');

      // Record redemption event in database
      if (result.signature) {
        await recordRedemptionEvent({
          nftMint: verificationResult.couponData.nftMint,
          userWallet: verificationResult.couponData.userWallet,
          merchantWallet: publicKey.toBase58(),
          signature: result.signature,
        });
      }

      setState('redeemed');
    } catch (error) {
      console.error('Redemption error:', error);
      setState('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error during redemption');
    }
  };

  const resetState = () => {
    setState('idle');
    setVerificationResult(null);
    setErrorMessage('');
    setShowScanner(false);
  };

  return (
    <div className="min-h-screen bg-[#f2eecb] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-[#174622] hover:text-[#0d2a13] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-[#0d2a13]">Redeem Coupon</h1>
          <p className="text-[#174622] mt-2">
            Scan customer QR codes to verify and redeem NFT coupons
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {state === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-[#00ff4d]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-12 h-12 text-[#0d2a13]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0d2a13] mb-4">
                Ready to Scan
              </h2>
              <p className="text-[#174622] mb-8 max-w-md mx-auto">
                Click the button below to start scanning customer QR codes for coupon redemption
              </p>
              <button
                onClick={() => setShowScanner(true)}
                className="bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <QrCode className="w-5 h-5 inline mr-2" />
                Start Scanner
              </button>
            </motion.div>
          )}

          {state === 'verifying' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="animate-spin w-16 h-16 border-4 border-[#00ff4d] border-t-transparent rounded-full mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#0d2a13] mb-2">
                Verifying Coupon...
              </h2>
              <p className="text-[#174622]">
                Checking NFT ownership and coupon validity
              </p>
            </motion.div>
          )}

          {state === 'verified' && verificationResult?.couponData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Success Banner */}
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 text-center mb-2">
                  Coupon Verified!
                </h2>
                <p className="text-green-700 text-center">
                  The NFT coupon is valid and ready to be redeemed
                </p>
              </div>

              {/* Coupon Details */}
              <div className="bg-[#f2eecb] rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-[#0d2a13] mb-4">
                  Coupon Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-[#174622] font-semibold">Title:</span>
                    <span className="ml-2 text-[#0d2a13]">
                      {verificationResult.couponData.title}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#174622] font-semibold">Discount:</span>
                    <span className="ml-2 text-[#0d2a13] font-bold text-xl">
                      {verificationResult.couponData.discount}% OFF
                    </span>
                  </div>
                  <div>
                    <span className="text-[#174622] font-semibold">Customer Wallet:</span>
                    <span className="ml-2 text-[#0d2a13] text-sm font-mono break-all">
                      {verificationResult.couponData.userWallet}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#174622] font-semibold">NFT Mint:</span>
                    <span className="ml-2 text-[#0d2a13] text-sm font-mono break-all">
                      {verificationResult.couponData.nftMint}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <strong>Important:</strong> Once you confirm redemption, the NFT will be
                    burned on-chain and cannot be reused. Make sure you've provided the
                    service/product before confirming.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleRedeemConfirm}
                  className="flex-1 bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Confirm Redemption
                </button>
                <button
                  onClick={resetState}
                  className="flex-1 bg-[#174622] hover:bg-[#174622]/90 text-[#f2eecb] font-semibold py-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {state === 'redeeming' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Loader className="animate-spin w-16 h-16 text-[#00ff4d] mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#0d2a13] mb-2">
                Redeeming Coupon...
              </h2>
              <p className="text-[#174622]">
                Burning NFT on-chain and recording redemption event
              </p>
            </motion.div>
          )}

          {state === 'redeemed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Success Banner */}
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-8 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-2">
                  Redemption Successful!
                </h2>
                <p className="text-green-700 text-center mb-4">
                  The NFT coupon has been burned on-chain
                </p>
                {redemptionSignature && (
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-600 mb-1">Transaction Signature:</p>
                    <p className="text-xs font-mono break-all text-gray-800">
                      {redemptionSignature}
                    </p>
                    <a
                      href={`https://explorer.solana.com/tx/${redemptionSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00ff4d] hover:underline text-sm mt-2 inline-block"
                    >
                      View on Solana Explorer →
                    </a>
                  </div>
                )}
              </div>

              {/* Coupon Details */}
              {verificationResult?.couponData && (
                <div className="bg-[#f2eecb] rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-[#0d2a13] mb-3">
                    Redeemed Coupon
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[#174622] font-semibold">Title:</span>
                      <span className="ml-2 text-[#0d2a13]">
                        {verificationResult.couponData.title}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#174622] font-semibold">Discount Applied:</span>
                      <span className="ml-2 text-[#0d2a13] font-bold text-xl">
                        {verificationResult.couponData.discount}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={resetState}
                className="w-full bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] font-bold py-4 rounded-xl transition-all"
              >
                Redeem Another Coupon
              </button>
            </motion.div>
          )}

          {state === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Error Banner */}
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-800 text-center mb-2">
                  Verification Failed
                </h2>
                <p className="text-red-700 text-center">{errorMessage}</p>
              </div>

              {/* Action Button */}
              <button
                onClick={resetState}
                className="w-full bg-[#0d2a13] hover:bg-[#0d2a13]/90 text-[#f2eecb] font-bold py-4 rounded-xl transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </div>

        {/* Instructions Panel */}
        <div className="mt-8 bg-white/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#0d2a13] mb-3">
            How Redemption Works
          </h3>
          <ol className="space-y-2 text-[#174622]">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Customer shows their QR code generated from their NFT coupon</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>You scan the QR code using the scanner</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>System verifies NFT ownership and coupon validity on-chain</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Upon confirmation, NFT is burned to prevent reuse</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">5.</span>
              <span>Customer receives the discount/service</span>
            </li>
          </ol>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
