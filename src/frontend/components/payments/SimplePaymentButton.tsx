'use client';

import { useState } from 'react';
import { HelioCheckout } from '@heliofi/checkout-react';
import { type PaymentConfig, handlePaymentSuccess, formatUSDC } from '@/lib/payments/moonpay';
import { getPaylinkId } from '@/lib/payments/paylink-config';
import { Loader2, CreditCard, CheckCircle2, XCircle } from 'lucide-react';

interface SimplePaymentButtonProps {
  config: PaymentConfig;
  userWallet?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

// Type for HelioCheckout extra props (not in official types but work at runtime)
interface HelioCheckoutExtraProps {
  children: React.ReactNode;
  onSuccess?: (transaction: unknown) => void | Promise<void>;
  onError?: (error: unknown) => void;
  theme?: string;
}

/**
 * Simplified Payment Button
 * Works directly with Helio Checkout without backend paylink creation
 * Good for testing and simple use cases
 */
export default function SimplePaymentButton({
  config,
  userWallet,
  onSuccess,
  onError,
  className = '',
  disabled = false,
}: SimplePaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePaymentSuccessInternal = async (transaction: unknown) => {
    setIsProcessing(true);
    setStatus('idle');

    try {
      const txId = (transaction as { id?: string }).id || 'unknown';

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

  // Try to get paylink ID for this amount
  const paylinkId = getPaylinkId(config.amount);

  // Use paylink if available, otherwise use direct config
  const checkoutConfig = paylinkId
    ? { paylinkId } // Dashboard-created paylink (preferred)
    : {
        // Direct payment configuration (fallback)
        amount: config.amount.toString(),
        currency: config.currency,
        name: config.productName,
        description: config.productDescription,
      };

  return (
    <div className="space-y-4">
      {/* Show mode indicator for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500">
          {paylinkId ? `✓ Using paylink: ${paylinkId.slice(0, 8)}...` : '⚠️ Direct mode (no paylink)'}
        </div>
      )}

      {/* Note: HelioCheckout doesn't support extra props in types, but works at runtime */}
      <HelioCheckout
        config={checkoutConfig}
        {...({
          theme: "dark",
          onSuccess: handlePaymentSuccessInternal,
          onError: handlePaymentErrorInternal,
          children: (
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
        ) } as HelioCheckoutExtraProps)}
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
