'use client';

import { useState, useEffect } from 'react';
import { HelioCheckout } from '@heliofi/checkout-react';
import { type PaymentConfig, handlePaymentSuccess, formatUSDC } from '@/lib/payments/moonpay';
import { Loader2, CreditCard, CheckCircle2, XCircle } from 'lucide-react';

interface PaymentButtonProps {
  config: PaymentConfig;
  userWallet?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function PaymentButton({
  config,
  userWallet,
  onSuccess,
  onError,
  className = '',
  disabled = false,
}: PaymentButtonProps) {
  const [paylinkId, setPaylinkId] = useState<string | null>(null);
  const [isCreatingPaylink, setIsCreatingPaylink] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Create paylink when component mounts
  useEffect(() => {
    const createPaylink = async () => {
      setIsCreatingPaylink(true);
      try {
        const response = await fetch('/api/payments/create-paylink', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dealTitle: config.productName,
            dealDescription: config.productDescription,
            discountPercentage: 0, // Can extract from product name if needed
            priceUSDC: config.amount,
            imageUrl: config.productImageUrl,
            dealId: config.dealId,
            merchantWallet: userWallet,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to create payment link');
        }

        setPaylinkId(data.paylinkId);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to initialize payment';
        setErrorMessage(message);
        setStatus('error');
        onError?.(message);
      } finally {
        setIsCreatingPaylink(false);
      }
    };

    createPaylink();
  }, [config, userWallet, onError]);

  const handlePaymentSuccessInternal = async (transaction: unknown) => {
    setIsProcessing(true);
    setStatus('idle');

    try {
      const txId = (transaction as { id?: string }).id || 'unknown';

      // Record payment in database
      if (config.dealId && userWallet) {
        const result = await handlePaymentSuccess(txId, config.dealId, userWallet, config.amount);

        if (!result.success) {
          throw new Error(result.error || 'Failed to record payment');
        }
      }

      setStatus('success');
      onSuccess?.(txId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment processing failed';
      setStatus('error');
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentErrorInternal = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Payment failed';
    setStatus('error');
    setErrorMessage(message);
    onError?.(message);
  };

  // Show loading state while creating paylink
  if (isCreatingPaylink || !paylinkId) {
    return (
      <button
        disabled
        className={`
          w-full flex items-center justify-center gap-2
          px-6 py-3 rounded-lg font-semibold
          bg-gray-400 cursor-not-allowed text-white
          ${className}
        `}
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Preparing payment...</span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Note: HelioCheckout doesn't support children prop in types, but works at runtime */}
      {/* Using 'as any' to bypass strict typing */}
      <HelioCheckout
        config={{
          paylinkId,
        }}
        onSuccess={handlePaymentSuccessInternal}
        onError={handlePaymentErrorInternal}
        theme="dark"
        {...({ children: (
          <button
            disabled={disabled || isProcessing}
            className={`
              relative w-full flex items-center justify-center gap-2
              px-6 py-3 rounded-lg font-semibold transition-all
              ${
                disabled || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
              }
              text-white shadow-lg
              ${className}
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Payment Successful!</span>
              </>
            ) : status === 'error' ? (
              <>
                <XCircle className="w-5 h-5" />
                <span>Payment Failed</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay {formatUSDC(config.amount)}</span>
              </>
            )}
          </button>
        ) } as any)}
      />

      {status === 'error' && errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Payment confirmed! Your NFT coupon will be minted shortly.
          </p>
        </div>
      )}
    </div>
  );
}
