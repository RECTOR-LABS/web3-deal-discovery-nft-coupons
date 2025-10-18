# DEAL Token Economics

**Document Version:** 1.0
**Created:** October 18, 2025
**Last Updated:** October 18, 2025
**Status:** Epic 8 Implementation

---

## Executive Summary

**DEAL Token** is the platform utility token for the Web3 Deal Discovery & Loyalty Platform. It powers staking rewards and cashback incentives to drive user retention and engagement.

**Key Metrics:**
- **Token Name:** DEAL Token
- **Symbol:** DEAL
- **Standard:** SPL Token (Solana)
- **Total Supply:** 1,000,000,000 DEAL (1 billion, fixed supply)
- **Decimals:** 9 (Solana standard)
- **Blockchain:** Solana (devnet for hackathon, mainnet-ready)

---

## Token Distribution

**Initial Allocation (1 billion DEAL):**

| Allocation | Tokens | Percentage | Vesting | Purpose |
|------------|--------|------------|---------|---------|
| **Community Rewards** | 400M | 40% | 4 years linear | Staking rewards, cashback, referrals |
| **Platform Reserve** | 250M | 25% | 6 years linear | Future incentives, partnerships |
| **Team & Development** | 150M | 15% | 3 years (1yr cliff) | Core team, advisors |
| **Liquidity Pool** | 100M | 10% | Unlocked | DEX liquidity (Raydium, Orca) |
| **Initial Airdrop** | 100M | 10% | Unlocked | Early users, merchants, hackathon judges 😉 |

**Distribution Timeline:**
- **Month 1:** Airdrop (100M) + Liquidity Pool (100M) = 200M circulating
- **Year 1:** +200M from rewards pool (gradual unlock)
- **Year 4:** All community rewards distributed (400M total)

---

## Token Utility

### 1. **Staking Rewards** 🏦

**Staking Mechanism:**
- Users stake DEAL tokens to earn passive rewards
- Staking APY: **12% annually** (paid in DEAL tokens)
- Rewards calculated per second (Solana timestamp-based)
- No lockup period (unstake anytime, rewards stop immediately)

**Staking Formula:**
```
Rewards Earned = (Staked Amount × APY × Time Staked) / 365 days

Example:
- Stake: 1,000 DEAL
- APY: 12%
- Time: 30 days
- Rewards: 1,000 × 0.12 × (30/365) = 9.86 DEAL
```

**Reward Pool:**
- Annual rewards budget: 100M DEAL/year (from 400M community pool)
- Sustainable for 4 years at 12% APY (assuming stable staking participation)
- Adjustable APY based on total staked (dynamic rewards)

---

### 2. **Cashback on Redemptions** 💸

**Cashback Mechanism:**
- Users earn DEAL tokens when redeeming NFT coupons
- Cashback amount = **Base Rate × Tier Multiplier × Deal Value**
- Automatically distributed to user wallet on redemption

**Tier-Based Cashback Rates:**

| Loyalty Tier | Base Cashback Rate | Example (50% discount deal) |
|--------------|-------------------|----------------------------|
| **Bronze** | 5% | 100 DEAL (5% of 2000 DEAL deal value) |
| **Silver** | 8% | 160 DEAL (8% of 2000 DEAL) |
| **Gold** | 12% | 240 DEAL (12% of 2000 DEAL) |
| **Platinum** | 15% | 300 DEAL (15% of 2000 DEAL) |

**Deal Value Calculation:**
```
Deal Value (in DEAL) = Discount Percentage × 100 × 20
(Simplified: 50% discount = 1000 DEAL base value, scaled by category)

Category Multipliers:
- Food & Beverage: 1x
- Retail: 1.5x
- Services: 1.2x
- Travel: 2x (highest value)
- Entertainment: 1.3x
- Other: 1x
```

**Cashback Budget:**
- Monthly budget: 5M DEAL (from 400M community pool)
- Estimated redemptions: ~100k/month → avg 50 DEAL/redemption
- Sustainable for 6+ years at current rate

---

### 3. **Governance (Future)** 🗳️

**Not implemented for hackathon, but designed for production:**
- DEAL holders can vote on platform decisions
- Proposals: new features, APY adjustments, treasury allocation
- 1 DEAL = 1 vote (linear voting)
- Minimum proposal threshold: 1M DEAL (0.1% of supply)

---

## Token Economics Model

### Supply & Demand Drivers

**Token Demand (Upward Price Pressure):**
1. **Staking APY:** Users buy DEAL to earn 12% rewards
2. **Cashback:** Users hold DEAL from redemptions
3. **Exclusive deals:** Future tier-gated deals require DEAL holdings
4. **Merchant fees:** Merchants pay DEAL to list deals (future)

**Token Supply (Downward Price Pressure):**
1. **Staking rewards:** 100M DEAL/year distributed
2. **Cashback distribution:** 60M DEAL/year distributed
3. **Team vesting:** 50M DEAL/year unlocking (years 2-3)

**Net Result:** Balanced tokenomics with 4-year reward sustainability

---

## Staking Contract Architecture

**Smart Contract: `deal_staking`**

**Instructions:**
1. `initialize_staking_pool()` - One-time setup, create reward pool
2. `stake()` - User stakes DEAL tokens, start earning rewards
3. `unstake()` - User withdraws staked DEAL + earned rewards
4. `claim_rewards()` - Claim rewards without unstaking principal
5. `update_apy()` - Admin adjusts APY (future governance)

**Accounts:**
- `StakingPool` - Global pool account (total staked, reward pool balance)
- `UserStake` - Per-user stake account (amount, start time, claimed rewards)

**Math:**
```rust
// Rewards calculation (per second)
let time_staked = current_timestamp - user_stake.start_time;
let annual_seconds = 365 * 24 * 60 * 60;
let rewards = (user_stake.amount * APY * time_staked) / (annual_seconds * 100);
```

---

## Cashback Distribution Flow

**Redemption Flow Integration:**

```
1. User redeems NFT coupon (burns NFT)
2. System calculates cashback:
   - Deal value = discount % × category multiplier
   - Cashback = deal value × tier rate
3. Mint DEAL tokens to user wallet (from cashback pool)
4. Record transaction in events table
5. Update user's lifetime cashback earned
```

**Example Transaction:**
```
User: Platinum tier
Deal: 50% off travel package
Category: Travel (2x multiplier)
Deal Value: 50 × 100 × 2 = 10,000 DEAL
Cashback Rate: 15% (Platinum)
Cashback Earned: 10,000 × 0.15 = 1,500 DEAL
```

---

## Risk Mitigation

### Token Price Volatility
- **Risk:** DEAL token price crashes, rewards become worthless
- **Mitigation:**
  - Use stable APY (12%) instead of dynamic rates
  - Diversify rewards pool (partial SOL payouts)
  - Implement price floor via buyback mechanism (future)

### Reward Pool Depletion
- **Risk:** Staking rewards run out in <4 years
- **Mitigation:**
  - Dynamic APY adjustment (reduce if pool depleting fast)
  - Cap max staking participation (e.g., max 50% of supply staked)
  - Treasury refills from platform revenue

### Regulatory Concerns
- **Risk:** Token classified as security, legal issues
- **Mitigation:**
  - Utility-focused design (not investment contract)
  - No promises of profit (APY is reward, not investment return)
  - Consult legal counsel before mainnet (hackathon exempt)

---

## Roadmap

**Phase 1: Hackathon (October 2025)**
- ✅ Token economics designed
- ⏳ Staking contract deployed to devnet
- ⏳ Staking UI built
- ⏳ Cashback integration complete
- Demo-ready with test DEAL tokens

**Phase 2: Mainnet Beta (Q4 2025)**
- Deploy staking contract to Solana mainnet
- Launch liquidity pool on Raydium/Orca
- Initial airdrop to early users (100M DEAL)
- Enable cashback with real DEAL tokens

**Phase 3: DAO Transition (2026)**
- Enable governance voting
- Transition APY control to DAO
- Community-driven tokenomics adjustments

---

## Technical Specifications

**Token Mint Authority:**
- Initial: Platform wallet (for hackathon)
- Future: Multisig DAO wallet (3-of-5 governance)

**Staking Pool Address:** `TBD` (deploy during Task 8.1.2)
**Token Mint Address:** `TBD` (create during Task 8.1.2)

**Smart Contract Repository:**
- Location: `src/contracts/programs/deal_staking/`
- Framework: Anchor 0.28+
- Language: Rust
- Tests: Anchor test suite (stake, unstake, rewards)

---

## Appendix: Comparison with Other Platforms

| Platform | Token | Staking APY | Cashback Rate | Notes |
|----------|-------|-------------|---------------|-------|
| **DealCoupon (Ours)** | DEAL | 12% | 5-15% | Tier-based, simple |
| Brave Browser | BAT | N/A | 70% (ads) | Different model |
| Crypto.com | CRO | 4-14% | 1-8% | Card tiers |
| Binance | BNB | 5-20% | 25% (fees) | Exchange-focused |

**Our Differentiator:** Seamless Web3 integration with NFT coupons + tier-based rewards aligned with loyalty system (Epic 9).

---

**Document Status:** ✅ Complete - Ready for implementation (Task 8.1.2 - Smart Contract)

Alhamdulillah! Token economics designed. Next: Build the staking contract! 🚀
