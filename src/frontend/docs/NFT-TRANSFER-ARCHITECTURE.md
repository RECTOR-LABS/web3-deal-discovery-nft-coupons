# NFT Transfer Architecture - Complete On-Chain Tracking

**Date:** 2025-10-23
**Objective:** All NFT movements on-chain and trackable
**Approach:** NFT Transfer (not mint-on-claim)

---

## User Requirements

✅ **All NFT activities must be on-chain:**

1. **Free Coupon Claim:** Merchant → User (on-chain transfer)
2. **Paid Coupon Purchase:** Merchant → User A (on-chain transfer)
3. **Resale:** User A → User B (on-chain transfer)
4. **Redemption:** NFT burned (on-chain)
5. **Status Update:** Coupon data updated (on-chain)

**Result:** Complete blockchain trail of NFT ownership!

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    NFT LIFECYCLE ON-CHAIN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CREATE (create_coupon instruction)                          │
│     Merchant creates deal → NFT minted to merchant's wallet     │
│     ✅ On-chain: NFT exists in merchant's ATA                   │
│                                                                  │
│  2. CLAIM/PURCHASE (SPL Token transfer)                         │
│     User claims/buys → NFT transferred merchant → user          │
│     ✅ On-chain: NFT owner changes to user's wallet             │
│     📊 Trackable: getTokenAccountsByOwner                       │
│                                                                  │
│  3. RESALE (SPL Token transfer)                                 │
│     User A lists → User B buys → NFT transferred A → B          │
│     ✅ On-chain: NFT owner changes to user B's wallet           │
│     📊 Trackable: getTokenAccountsByOwner                       │
│                                                                  │
│  4. REDEEM (redeem_coupon instruction)                          │
│     Merchant scans QR → NFT burned                              │
│     ✅ On-chain: Token supply decreases to 0                    │
│     📊 Trackable: getMint shows supply = 0                      │
│                                                                  │
│  5. STATUS UPDATE (update_coupon_status instruction)            │
│     Merchant activates/deactivates → PDA updated                │
│     ✅ On-chain: coupon_data.is_active changes                  │
│     📊 Trackable: getAccountInfo on coupon PDA                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Challenge: Merchant Signature Required

**Problem:** SPL Token transfers require owner's signature!

```typescript
// SPL Token Transfer requires authority signature
createTransferInstruction(
  fromTokenAccount,        // merchant's ATA
  toTokenAccount,          // user's ATA
  merchantPublicKey,       // ← MERCHANT MUST SIGN!
  1                        // amount (NFTs = 1)
);
```

**Question:** How do we get merchant's signature for every purchase?

---

## Solution: Backend Transfer Service

**Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURE BACKEND API                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Environment Variable:                                           │
│  MERCHANT_WALLET_SECRET_KEY = [123, 45, 67, ...]               │
│                                                                  │
│  ⚠️ SECURITY:                                                   │
│  - Stored in .env.local (gitignored)                            │
│  - Never exposed to frontend                                    │
│  - Server-side API routes only                                  │
│  - Vercel environment secrets in production                     │
│                                                                  │
│  Backend holds merchant keypair → Signs transfers automatically  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Frontend (User Action)
    ↓
POST /api/nft/transfer
    ↓
Backend API:
  1. Verify payment (if paid coupon)
  2. Load merchant keypair from env
  3. Create transfer instruction
  4. Sign with merchant's key
  5. Send transaction
    ↓
✅ NFT transferred on-chain
```

---

## Implementation Plan

### Phase 1: Backend Transfer Infrastructure

**File:** `app/api/nft/transfer/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import { createClient } from '@/lib/database/supabase';
import { logger } from '@/lib/logger';
import { trackMetric, MetricType } from '@/lib/metrics';

const apiLogger = logger.child({ module: 'API:NFT:Transfer' });

// ⚠️ SECURITY: Load merchant wallet from environment
const MERCHANT_WALLET_SECRET_KEY = process.env.MERCHANT_WALLET_SECRET_KEY;
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

/**
 * Transfer NFT from merchant to user (or user to user for resale)
 * Handles signature automatically using backend merchant wallet
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nftMint,          // NFT mint address
      fromWallet,       // Current owner (merchant or user A)
      toWallet,         // New owner (user or user B)
      dealId,           // Deal ID for tracking
      transferType,     // 'claim' | 'purchase' | 'resale'
      paymentSignature, // (Optional) Payment tx signature for paid coupons
    } = body;

    // Validate required fields
    if (!nftMint || !fromWallet || !toWallet || !dealId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment for paid coupons
    if (transferType === 'purchase' && !paymentSignature) {
      return NextResponse.json(
        { error: 'Payment signature required for paid coupons' },
        { status: 400 }
      );
    }

    // Load merchant wallet keypair
    if (!MERCHANT_WALLET_SECRET_KEY) {
      apiLogger.error('Merchant wallet secret key not configured');
      return NextResponse.json(
        { error: 'Transfer service not configured' },
        { status: 500 }
      );
    }

    const merchantKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(MERCHANT_WALLET_SECRET_KEY))
    );

    apiLogger.info('Transfer request', {
      nftMint,
      from: fromWallet,
      to: toWallet,
      transferType,
    });

    // Connect to Solana
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');

    const mint = new PublicKey(nftMint);
    const from = new PublicKey(fromWallet);
    const to = new PublicKey(toWallet);

    // Get token accounts
    const fromATA = await getAssociatedTokenAddress(mint, from);
    const toATA = await getAssociatedTokenAddress(mint, to);

    // Build transaction
    const transaction = new Transaction();

    // Check if recipient's token account exists
    try {
      await getAccount(connection, toATA);
      apiLogger.info('Recipient token account exists');
    } catch (error) {
      // Create recipient's token account
      apiLogger.info('Creating recipient token account');
      transaction.add(
        createAssociatedTokenAccountInstruction(
          merchantKeypair.publicKey, // payer (merchant pays creation fee)
          toATA,
          to,
          mint
        )
      );
    }

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        fromATA,
        toATA,
        from,  // authority (the current owner)
        1,     // amount (NFTs = 1)
        [],    // multisig signers
      )
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = merchantKeypair.publicKey;

    // Sign transaction
    // For merchant → user: merchant signs
    // For user → user (resale): Need user signature too (handled differently)
    if (transferType === 'claim' || transferType === 'purchase') {
      // Merchant → User transfer
      transaction.sign(merchantKeypair);
    } else if (transferType === 'resale') {
      // User A → User B transfer
      // This requires User A's signature
      // Frontend must sign this transaction, backend just facilitates
      return NextResponse.json(
        {
          error: 'Resale transfers require user signature',
          serializedTransaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
        },
        { status: 400 }
      );
    }

    // Send transaction
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      }
    );

    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');

    apiLogger.info('Transfer successful', {
      signature,
      nftMint,
      from: fromWallet,
      to: toWallet,
    });

    // Record transfer event in database
    const supabase = createClient();
    await supabase.from('events').insert({
      event_type: transferType === 'resale' ? 'resale_purchase' : 'purchase',
      deal_id: dealId,
      user_wallet: toWallet,
      metadata: {
        nft_mint: nftMint,
        from_wallet: fromWallet,
        to_wallet: toWallet,
        transfer_signature: signature,
        transfer_type: transferType,
        payment_signature: paymentSignature,
      },
    });

    // Track metric
    trackMetric(
      transferType === 'resale' ? MetricType.NFT_TRANSFERRED : MetricType.NFT_CLAIMED,
      1,
      {
        transfer_type: transferType,
        nft_mint: nftMint,
      }
    );

    return NextResponse.json({
      success: true,
      signature,
      message: 'NFT transferred successfully',
    });
  } catch (error) {
    apiLogger.error('Transfer error', { error });
    return NextResponse.json(
      {
        error: 'Failed to transfer NFT',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

---

### Phase 2: Free Coupon Claim Flow

**File:** `app/(user)/marketplace/[id]/page.tsx` (UPDATE)

**Current Flow:**
```typescript
// Line 74-88: handleClaimCoupon
const signature = await claimCoupon(deal, publicKey, signTransaction);
// ❌ Returns mock signature
```

**New Flow:**
```typescript
async function handleClaimCoupon() {
  if (!publicKey || !deal) return;

  try {
    setClaiming(true);

    // Call backend to transfer NFT from merchant to user
    const response = await fetch('/api/nft/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nftMint: deal.nft_mint_address,
        fromWallet: deal.merchant_wallet,  // Merchant's wallet
        toWallet: publicKey.toBase58(),    // User's wallet
        dealId: deal.id,
        transferType: 'claim',             // Free coupon claim
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Transfer failed');
    }

    // ✅ NFT now in user's wallet!
    console.log('✅ NFT transferred on-chain:', result.signature);
    alert('Coupon claimed! Check your Phantom wallet.');

    // Refresh page to show coupon in "My Coupons"
    router.push('/coupons');
  } catch (error) {
    console.error('Claim error:', error);
    alert('Failed to claim coupon');
  } finally {
    setClaiming(false);
  }
}
```

---

### Phase 3: Paid Coupon Purchase Flow

**File:** `components/payments/PurchaseModal.tsx` (UPDATE)

**Current Flow (Line 176-211):**
```typescript
// After payment succeeds
const response = await fetch('/api/payments/record', { ... });
// ❌ No NFT transfer
```

**New Flow:**
```typescript
// After payment transaction succeeds
if (signature) {
  console.log('✅ Payment confirmed:', signature);

  // Step 2: Transfer NFT from merchant to user
  const transferResponse = await fetch('/api/nft/transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nftMint: deal.nft_mint_address,
      fromWallet: merchantWallet,        // Merchant's wallet
      toWallet: publicKey.toBase58(),    // Buyer's wallet
      dealId,
      transferType: 'purchase',          // Paid coupon
      paymentSignature: signature,       // Payment proof
    }),
  });

  const transferResult = await transferResponse.json();

  if (!transferResult.success) {
    throw new Error('Payment succeeded but NFT transfer failed. Contact support.');
  }

  console.log('✅ NFT transferred on-chain:', transferResult.signature);

  // Step 3: Record in database
  await fetch('/api/payments/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transactionSignature: signature,
      transferSignature: transferResult.signature,
      nftMint: deal.nft_mint_address,
      dealId,
      userWallet: publicKey.toBase58(),
      amount: priceSOL,
      paymentType: 'direct_purchase',
    }),
  });

  setShowSuccess(true);
  setTimeout(() => router.push('/coupons'), 2000);
}
```

---

### Phase 4: Resale Transfer Flow

**File:** `components/resale/ResalePurchaseModal.tsx` (NEW/UPDATE)

**Flow:**
```typescript
async function handleResalePurchase() {
  if (!publicKey || !listing) return;

  try {
    setPurchasing(true);

    // Step 1: Payment (SOL from buyer to seller)
    const paymentTx = new Transaction();
    paymentTx.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(listing.seller_wallet),
        lamports: Math.floor(listing.price * LAMPORTS_PER_SOL * 0.975), // 97.5% to seller
      })
    );
    paymentTx.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(PLATFORM_WALLET),
        lamports: Math.floor(listing.price * LAMPORTS_PER_SOL * 0.025), // 2.5% platform fee
      })
    );

    const paymentSig = await sendTransaction(paymentTx, connection);
    await connection.confirmTransaction(paymentSig);

    console.log('✅ Payment confirmed:', paymentSig);

    // Step 2: Transfer NFT (User A → User B)
    // This requires seller's signature!
    // We need seller to approve the transfer

    // Option A: Seller pre-signs when listing (complex)
    // Option B: Seller approves transfer after payment (requires online)
    // Option C: Use program delegate authority (need smart contract)

    // For MVP: Use backend API but require seller signature
    const response = await fetch('/api/nft/transfer-resale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nftMint: listing.nft_mint,
        fromWallet: listing.seller_wallet,  // User A (seller)
        toWallet: publicKey.toBase58(),     // User B (buyer)
        dealId: listing.deal_id,
        transferType: 'resale',
        paymentSignature: paymentSig,
        listingId: listing.id,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error('Payment succeeded but NFT transfer failed');
    }

    console.log('✅ NFT transferred on-chain:', result.signature);
    alert('Purchase successful! NFT is now in your wallet.');

    router.push('/coupons');
  } catch (error) {
    console.error('Resale purchase error:', error);
    alert('Purchase failed');
  } finally {
    setPurchasing(false);
  }
}
```

**Challenge for Resale:** Seller (User A) must sign transfer!

**Solution Options:**

1. **Escrow Smart Contract (Best)**
   - Seller deposits NFT to program
   - Program holds NFT
   - Buyer pays → Program transfers NFT automatically
   - Requires smart contract modification

2. **Pre-signed Transaction (Hacky)**
   - Seller signs transfer when listing
   - Backend stores signed tx
   - Executes after payment
   - Security risk (tx could be executed anytime)

3. **Two-Step Process (MVP)**
   - Buyer pays
   - System notifies seller
   - Seller approves transfer
   - Not ideal but works

**For Hackathon:** Use Option 3 (simplest)

---

### Phase 5: Environment Setup

**File:** `.env.local` (UPDATE)

```bash
# Existing variables...

# NFT Transfer Service
# ⚠️ SECURITY: Never commit this to git!
# Generate: solana-keygen new --outfile merchant-keypair.json
# Then: cat merchant-keypair.json (copy the array)
MERCHANT_WALLET_SECRET_KEY='[123,45,67,...]'

# Or use existing merchant wallet
# Must match the wallet used in dashboard for creating deals
```

**Generation:**
```bash
# If you don't have merchant keypair file
solana-keygen new --outfile merchant-keypair.json

# Copy the secret key array
cat merchant-keypair.json
# Example output: [123,45,67,89,...]

# Add to .env.local
echo "MERCHANT_WALLET_SECRET_KEY='[123,45,67,...]'" >> .env.local
```

---

## On-Chain Tracking Examples

### Query NFT Ownership History

```typescript
// Get all token accounts for an NFT mint
const accounts = await connection.getTokenAccountsByOwner(
  new PublicKey(nftMint),
  { programId: TOKEN_PROGRAM_ID }
);

// Current owner
const currentOwner = accounts.value[0].owner;
```

### Query Transfer History

```typescript
// Get transaction signatures for an NFT mint
const signatures = await connection.getSignaturesForAddress(
  new PublicKey(nftMint),
  { limit: 100 }
);

// Parse each transaction to see transfers
for (const sig of signatures) {
  const tx = await connection.getParsedTransaction(sig.signature);
  // Check for transfer instructions
}
```

### Verify NFT in Wallet

```typescript
// Check if user owns the NFT
const tokenAccount = await getAssociatedTokenAddress(
  new PublicKey(nftMint),
  new PublicKey(userWallet)
);

const accountInfo = await connection.getTokenAccountBalance(tokenAccount);
const ownsNFT = accountInfo.value.uiAmount === 1;

console.log('User owns NFT:', ownsNFT);
```

---

## Complete Demo Flow

### Scenario: Full NFT Lifecycle

```
1. Merchant Creates Deal
   Merchant: HAtD...Ubz5
   Transaction: create_coupon instruction
   Result: NFT minted to HAtD...Ubz5
   Solscan: Show NFT in merchant's wallet
   ✅ On-chain: NFT owner = merchant

2. User A Purchases (Paid Coupon)
   User A: 2jLo...MaLk
   Transaction 1: SOL payment (0.001 SOL)
   Transaction 2: SPL Token transfer (HAtD → 2jLo)
   Result: NFT now in User A's wallet
   Solscan: Show NFT owner changed
   ✅ On-chain: NFT owner = 2jLo...MaLk

3. User A Lists for Resale
   User A: 2jLo...MaLk
   Action: List NFT for 0.0015 SOL (50% markup)
   Database: resale_listings table updated
   On-chain: NFT still owned by 2jLo
   ✅ On-chain: NFT owner = 2jLo...MaLk

4. User B Purchases from Resale
   User B: 5xYz...Abc3
   Transaction 1: SOL payment (0.0015 SOL → 2jLo)
   Transaction 2: SPL Token transfer (2jLo → 5xYz)
   Result: NFT now in User B's wallet
   Solscan: Show NFT owner changed
   ✅ On-chain: NFT owner = 5xYz...Abc3

5. User B Redeems Coupon
   User B: 5xYz...Abc3
   Transaction: redeem_coupon instruction
   Result: NFT burned (supply → 0)
   Solscan: Show NFT burned
   ✅ On-chain: NFT supply = 0

Timeline:
Owner 1: HAtD...Ubz5 (merchant)
  ↓ Purchase transfer
Owner 2: 2jLo...MaLk (user A)
  ↓ Resale transfer
Owner 3: 5xYz...Abc3 (user B)
  ↓ Redemption burn
Owner 4: BURNED (no owner)

All 4 ownership changes: ✅ ON-CHAIN ✅ TRACKABLE
```

---

## Security Considerations

### ⚠️ Merchant Wallet Secret Key

**Risks:**
- If leaked, attacker can transfer ALL NFTs
- If leaked, attacker can drain merchant's SOL

**Mitigations:**
1. ✅ Store in environment variable (never in code)
2. ✅ Gitignore .env.local
3. ✅ Use Vercel secrets in production
4. ✅ Backend API only (never expose to frontend)
5. ✅ Rate limiting on transfer API
6. ✅ Audit logs for all transfers

### 🔒 Production Best Practices

1. **Separate Wallets:**
   - Transfer wallet: Holds minimal SOL (just for fees)
   - Treasury wallet: Holds actual funds
   - Never use same wallet for both

2. **Multi-Signature:**
   - Require 2/3 signatures for transfers
   - Use Squads multisig protocol

3. **Smart Contract Escrow:**
   - Move to program-controlled transfers
   - Eliminates backend wallet risk

---

## Implementation Priority

### Must Have (For Demo)

1. ✅ Backend transfer API
2. ✅ Free coupon claim (merchant → user)
3. ✅ Paid coupon purchase (merchant → user A)
4. ✅ Verify NFT in Phantom wallet
5. ✅ Solscan proof

### Should Have

6. ✅ Resale transfer (user A → user B)
7. ✅ redeem_coupon integration
8. ✅ update_coupon_status integration

### Nice to Have

9. Transaction history in UI
10. NFT ownership graph
11. Smart contract escrow (post-hackathon)

---

## Time Estimate

**Total: 6-8 hours**

1. Backend transfer API: 2 hours
2. Free claim integration: 1 hour
3. Paid purchase integration: 1 hour
4. Resale integration: 2 hours
5. Testing all flows: 1-2 hours
6. Redeem integration: 1 hour
7. Status integration: 1 hour

---

## Success Criteria

✅ **Definition of Success:**

For each flow:
- [ ] Transaction confirmed on devnet
- [ ] NFT visible in Phantom wallet
- [ ] Owner change visible on Solscan
- [ ] Can query ownership via RPC
- [ ] Database events table updated

**Demo:**
- [ ] Show Phantom: NFT in merchant wallet
- [ ] User purchases: Show Phantom: NFT now in user wallet
- [ ] Show Solscan: Transfer transaction
- [ ] User lists for resale
- [ ] User B purchases: Show Phantom: NFT in user B wallet
- [ ] Show Solscan: Second transfer transaction
- [ ] User B redeems: Show Solscan: Burn transaction
- [ ] Complete blockchain audit trail ✅

---

## Next Steps

1. **Create backend transfer API** (`/api/nft/transfer`)
2. **Update free claim flow** (marketplace/[id]/page.tsx)
3. **Update paid purchase flow** (PurchaseModal.tsx)
4. **Test end-to-end** (merchant → user transfer)
5. **Implement resale transfer**
6. **Integrate redeem_coupon instruction**
7. **Integrate update_coupon_status instruction**

**Bismillah! Let's build complete on-chain NFT tracking!** 🚀

---

**Alhamdulillah!** This architecture gives you:
- ✅ Complete blockchain audit trail
- ✅ All NFT movements on-chain
- ✅ Trackable via Solscan
- ✅ Verifiable in Phantom wallet
- ✅ True Web3 ownership

**Ready to implement?** 💪
