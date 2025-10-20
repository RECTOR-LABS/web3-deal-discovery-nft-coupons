# MoonPay Commerce Payment Integration

Complete guide for integrating Solana payments (SOL, USDC, BONK) into your NFT coupon marketplace.

## 🚀 Quick Start

### 1. Basic Payment Button

```tsx
import PaymentButton from '@/components/payments/PaymentButton';
import { createCouponPaymentConfig } from '@/lib/payments/moonpay';

function DealCard({ deal }) {
  const { publicKey } = useWallet(); // Solana wallet

  const paymentConfig = createCouponPaymentConfig(
    deal.title,
    deal.description,
    deal.discount_percentage,
    5.00, // Price in USDC
    deal.image_url,
    deal.id,
    deal.nft_mint_address
  );

  return (
    <div>
      <h2>{deal.title}</h2>
      <p>{deal.description}</p>

      <PaymentButton
        config={paymentConfig}
        userWallet={publicKey?.toBase58()}
        onSuccess={(txId) => {
          console.log('Payment successful!', txId);
          // Redirect to success page or show NFT
        }}
        onError={(error) => {
          console.error('Payment failed:', error);
        }}
      />
    </div>
  );
}
```

---

## 💡 Advanced Usage

### Custom Pricing

```tsx
import { calculateCouponPrice } from '@/lib/payments/moonpay';

// Auto-calculate price based on discount percentage
const price = calculateCouponPrice(deal.discount_percentage);

// Or set custom price
const customPrice = 10.00; // $10 USDC
```

### Multiple Currencies

```tsx
const config = {
  amount: 0.05,
  currency: 'SOL', // or 'USDC', 'BONK'
  productName: deal.title,
  productDescription: deal.description,
};
```

### Custom Styling

```tsx
<PaymentButton
  config={paymentConfig}
  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
  disabled={!publicKey}
/>
```

---

## 🔧 Integration Points

### Marketplace Page

```tsx
// src/frontend/app/(user)/marketplace/page.tsx

import PaymentButton from '@/components/payments/PaymentButton';
import { createCouponPaymentConfig } from '@/lib/payments/moonpay';

export default function MarketplacePage() {
  const { publicKey } = useWallet();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <div key={deal.id} className="border rounded-lg p-4">
          <img src={deal.image_url} alt={deal.title} />
          <h3>{deal.title}</h3>
          <p className="text-2xl font-bold">{deal.discount_percentage}% OFF</p>

          <PaymentButton
            config={createCouponPaymentConfig(
              deal.title,
              deal.description,
              deal.discount_percentage,
              5.00, // Price
              deal.image_url,
              deal.id
            )}
            userWallet={publicKey?.toBase58()}
            onSuccess={(txId) => router.push(`/success?tx=${txId}`)}
          />
        </div>
      ))}
    </div>
  );
}
```

### Deal Detail Page

```tsx
// More detailed payment flow with wallet connection check

function DealDetailPage({ deal }) {
  const { publicKey, connect } = useWallet();

  if (!publicKey) {
    return (
      <button onClick={connect} className="btn-primary">
        Connect Wallet to Purchase
      </button>
    );
  }

  return (
    <PaymentButton
      config={createCouponPaymentConfig(
        deal.title,
        deal.description,
        deal.discount_percentage,
        calculateCouponPrice(deal.discount_percentage),
        deal.image_url,
        deal.id
      )}
      userWallet={publicKey.toBase58()}
      onSuccess={async (txId) => {
        // Trigger NFT minting
        await mintCoupon(connection, wallet, dealData, merchantId);
        router.push('/my-coupons');
      }}
    />
  );
}
```

---

## 🗄️ Database Setup

The payment recording requires a `payments` table in Supabase:

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE NOT NULL,
  deal_id UUID REFERENCES deals(id),
  user_wallet TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDC',
  status TEXT NOT NULL DEFAULT 'completed',
  payment_method TEXT NOT NULL DEFAULT 'moonpay',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_payments_user_wallet ON payments(user_wallet);
CREATE INDEX idx_payments_deal_id ON payments(deal_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
```

---

## 🔒 Security Notes

- ✅ Public key is safe for frontend (already in .env.local)
- ✅ Secret key used only in API routes (server-side)
- ✅ Payment verification happens on backend
- ✅ Transaction IDs prevent duplicate payments

---

## 🧪 Testing

### Test on Devnet

```tsx
// In components/payments/PaymentButton.tsx
// Line 84: cluster is set to 'devnet'

config={{
  apiKey: getMoonPayPublicKey(),
  amount: 5.00,
  currency: 'USDC',
  cluster: 'devnet', // ← Test mode
}}
```

### Test Flow

1. Connect Solana wallet (Phantom/Solflare)
2. Click payment button
3. MoonPay popup opens
4. Complete payment with test USDC
5. Payment recorded in database
6. NFT minting triggered

---

## 📊 Supported Currencies

- **USDC** (Recommended - stablecoin)
- **SOL** (Native Solana token)
- **BONK** (Meme coin - for fun deals)

---

## 🆘 Troubleshooting

**Payment button doesn't appear:**
- Check NEXT_PUBLIC_MOONPAY_PUBLIC_KEY in .env.local
- Ensure @heliofi/checkout-react is installed

**Payment fails:**
- Verify user has sufficient balance
- Check network (devnet vs mainnet)
- Check console for error messages

**Database error:**
- Ensure `payments` table exists
- Check Supabase connection

---

## 🎯 Production Checklist

- [ ] Switch cluster from 'devnet' to 'mainnet-beta'
- [ ] Update pricing logic for real deals
- [ ] Test with real USDC on mainnet
- [ ] Set up payment webhooks for confirmations
- [ ] Add analytics tracking
- [ ] Configure proper error handling
- [ ] Set up email notifications for successful payments

---

**Need help?** Check MoonPay Commerce docs: https://docs.hel.io
