# Loyalty System Design - Epic 9

## Tier System

### Tier Definitions

| Tier | Redemptions Required | Bonus Discount | Benefits |
|------|---------------------|----------------|----------|
| **Bronze** | 0-5 | +0% | Standard access |
| **Silver** | 6-20 | +5% | Priority support, Silver badge |
| **Gold** | 21-50 | +10% | Exclusive deals, early access, Gold badge |
| **Platinum** | 51+ | +15% | VIP deals, max discounts, Platinum badge, special offers |

### Tier Progression Logic
- Tier calculated from total redemption count (lifetime)
- Tier cannot decrease (once achieved, permanent)
- Tier displayed on profile and in marketplace
- Tier benefits apply automatically at checkout

---

## Badge System

### Badge Catalog (8 Badges)

#### Milestone Badges (Activity-based)
1. **First Steps** - First coupon claimed
   - Image: Green checkmark
   - Rarity: Common
   - Auto-mint: On first claim

2. **Deal Hunter** - 10 redemptions completed
   - Image: Trophy icon
   - Rarity: Uncommon
   - Auto-mint: On 10th redemption

3. **Savvy Shopper** - 25 redemptions completed
   - Image: Shopping bag with star
   - Rarity: Rare
   - Auto-mint: On 25th redemption

4. **Discount Master** - 50 redemptions completed
   - Image: Crown
   - Rarity: Epic
   - Auto-mint: On 50th redemption

#### Social Badges (Engagement-based)
5. **Social Butterfly** - 10 successful referrals
   - Image: Network icon
   - Rarity: Uncommon
   - Auto-mint: On 10th referral claim

6. **Influencer** - 25 successful referrals
   - Image: Megaphone
   - Rarity: Rare
   - Auto-mint: On 25th referral claim

#### Review Badges (Quality-based)
7. **Critic** - 20 reviews written
   - Image: Star rating icon
   - Rarity: Uncommon
   - Auto-mint: On 20th review

8. **Community Champion** - 50 upvotes received on reviews
   - Image: Heart badge
   - Rarity: Rare
   - Auto-mint: On 50 cumulative upvotes

### Badge Properties
- **Non-transferable** (Soulbound NFTs)
- **On-chain metadata** (Metaplex Token Metadata)
- **Unique mint addresses** per user per badge type
- **Achievement timestamp** stored on-chain

---

## Database Schema Changes

### Users Table Extension
```sql
ALTER TABLE users ADD COLUMN tier TEXT DEFAULT 'Bronze';
ALTER TABLE users ADD COLUMN total_redemptions INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN total_referrals INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN total_reviews INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN total_upvotes INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN badges JSONB DEFAULT '[]';
```

### Deals Table Extension
```sql
ALTER TABLE deals ADD COLUMN min_tier TEXT DEFAULT 'Bronze';
ALTER TABLE deals ADD COLUMN is_exclusive BOOLEAN DEFAULT false;
```

### New Badges Table
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet TEXT NOT NULL,
  badge_type TEXT NOT NULL, -- 'first_steps', 'deal_hunter', etc.
  nft_mint_address TEXT UNIQUE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_wallet, badge_type)
);
```

---

## Smart Contract Changes

### Option 1: Extend Existing NFT Program
Add new instruction to `programs/nft_coupon/src/lib.rs`:

```rust
pub fn mint_badge(
    ctx: Context<MintBadge>,
    badge_type: String,
    metadata_uri: String,
) -> Result<()> {
    // Mint non-transferable NFT badge
    // Set badge metadata (name, image, attributes)
    // Mark as soulbound (disable transfers)
}
```

### Option 2: Create Separate Badge Program
New program: `programs/nft_badge/` (RECOMMENDED for cleaner separation)

---

## Implementation Phases

### Phase 1: Backend (3-4 hours)
- [x] Design tier and badge system (this document)
- [ ] Database migrations (users, deals, badges tables)
- [ ] Tier calculation helper functions
- [ ] Badge eligibility check functions
- [ ] API endpoints:
  - GET /api/user/tier (get current tier + progress)
  - GET /api/user/badges (get earned badges)
  - POST /api/badges/mint (trigger badge mint)

### Phase 2: Smart Contract (3-4 hours)
- [ ] Create badge program or extend NFT program
- [ ] Implement mint_badge instruction
- [ ] Add Metaplex metadata for badges
- [ ] Make badges non-transferable
- [ ] Deploy to devnet
- [ ] Test badge minting

### Phase 3: Frontend (2-3 hours)
- [ ] User profile page: /app/(user)/profile/page.tsx
- [ ] Badge gallery component: components/user/BadgeCollection.tsx
- [ ] Tier progress bar: components/user/TierProgress.tsx
- [ ] Exclusive deal badges in marketplace
- [ ] Tier-gated deal filtering
- [ ] Auto-mint badges on milestones

### Phase 4: Integration (1 hour)
- [ ] Hook badge minting into redemption flow
- [ ] Hook tier updates into redemption flow
- [ ] Hook referral badges into claim flow
- [ ] Hook review badges into review submission
- [ ] Test end-to-end

---

## Badge Metadata Structure

```json
{
  "name": "Deal Hunter Badge",
  "description": "Awarded for completing 10 coupon redemptions",
  "image": "https://arweave.net/badge-deal-hunter.png",
  "attributes": [
    {
      "trait_type": "Badge Type",
      "value": "Milestone"
    },
    {
      "trait_type": "Rarity",
      "value": "Uncommon"
    },
    {
      "trait_type": "Earned Date",
      "value": "2025-10-18"
    },
    {
      "trait_type": "Redemptions",
      "value": "10"
    },
    {
      "trait_type": "Soulbound",
      "value": "true"
    }
  ],
  "properties": {
    "category": "Achievement",
    "creators": [
      {
        "address": "merchant_wallet_address",
        "share": 100
      }
    ]
  }
}
```

---

## Exclusive Deals Strategy

### Tier Requirements
- **Bronze:** All deals visible, no restrictions
- **Silver:** Access to Silver+ exclusive deals
- **Gold:** Access to Gold+ exclusive deals (10-20% better discounts)
- **Platinum:** Access to VIP deals (highest discounts, limited quantity)

### UI Treatment
- Locked deals show preview with "🔒 Unlock at [Tier]" badge
- Clicking locked deal shows tier requirement modal
- Progress bar: "5 more redemptions to unlock Gold tier"
- Exclusive deals have "⭐ Exclusive" or "👑 VIP" badge

---

## Success Metrics
- [ ] Users can see their current tier
- [ ] Users can see progress to next tier
- [ ] Badges auto-mint on milestones
- [ ] Badge NFTs visible in user profile
- [ ] Exclusive deals filter by tier correctly
- [ ] Tier benefits apply automatically
- [ ] All badges are non-transferable (soulbound)

---

**Created:** October 18, 2025
**Last Updated:** October 18, 2025
**Status:** Design Complete - Ready for Implementation
