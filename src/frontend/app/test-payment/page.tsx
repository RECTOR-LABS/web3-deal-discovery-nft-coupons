'use client';

import SimplePaymentButton from '@/components/payments/SimplePaymentButton';
import { createCouponPaymentConfig } from '@/lib/payments/moonpay';

export default function TestPaymentPage() {
  const testConfig = createCouponPaymentConfig(
    'Test Deal - 25% Off Pizza',
    'Testing MoonPay/Helio payment integration with a delicious pizza deal!',
    25,
    5.00, // $5 USDC
    undefined, // No image for test
    'test-deal-123'
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payment Integration Test</h1>
            <p className="text-gray-400 text-sm">
              Testing MoonPay Commerce / Helio Checkout
            </p>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="space-y-2 mb-6">
              <h2 className="font-semibold text-lg">{testConfig.productName}</h2>
              <p className="text-gray-400 text-sm">{testConfig.productDescription}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-purple-400">
                  ${testConfig.amount.toFixed(2)}
                </span>
                <span className="text-gray-500">{testConfig.currency}</span>
              </div>
            </div>

            <SimplePaymentButton
              config={testConfig}
              onSuccess={(txId) => {
                console.log('✅ Payment successful!', txId);
                alert(`Payment successful! Transaction ID: ${txId}`);
              }}
              onError={(error) => {
                console.error('❌ Payment failed:', error);
                alert(`Payment failed: ${error}`);
              }}
            />
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-semibold mb-2">Test Info:</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✓ RapidAPI: Configured</li>
              <li>✓ Arweave: Configured</li>
              <li>✓ MoonPay: Testing...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
