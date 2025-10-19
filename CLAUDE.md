# CLAUDE.md

Web3 deal discovery platform: NFT coupons on Solana. "Groupon meets DeFi."

## Quick Facts

- **Track:** Cypherpunk - MonkeDAO (Superteam Earn)
- **Prize:** $6,500 USDC + Gen3 Monke NFTs | **Deadline:** ~Oct 30, 2025
- **Status:** 100% Feature Complete (Epic 1-10 ✅) | All Epics Audited ✅ | Ready for Epic 11
- **Competition:** 0 submissions yet (high opportunity)

**Stack:** Solana + Anchor | Next.js 15 + Tailwind v4 | Supabase PostgreSQL | Privy Auth

## Epic Status (100% Feature Complete + Audited - 84/84 tasks)

**✅ Completed & Audited (Epics 1-10):**
1. **NFT Coupons** - Contracts deployed (devnet: `REC6VwdAzaaNdrUCWbXmqqN8ryoSAphQkft2BX1P1b1`) | Audit: ✅
2. **Merchant Dashboard** - Auth, profiles, deal creation, analytics, settings | Audit: ✅
3. **User Marketplace** - Browse, filters, My Coupons, QR codes | 27 tests passing | Audit: ✅
4. **Redemption Flow** - QR scanning, off-chain verify, on-chain burn, event logging | Audit: ✅
5. **Deal Aggregator** - RapidAPI integration, 1hr cache, Partner Deal badges | Audit: ✅
6. **Social Layer** - Reviews, voting, sharing, referrals, activity feed | Audit: ✅
7. **Web3 Abstraction** - Privy auth, email/social login, embedded wallets, no crypto jargon | Audit: ✅
8. **Staking/Cashback** - 12% APY, tier-based (5-15%), auto-distribution | Audit: ✅ B+ (85/100)
9. **Loyalty System** - 4 tiers, 8 NFT badges, exclusive deals, auto-minting | Audit: ✅ A- (88/100)
10. **Geo Discovery** - Geolocation, distance filter (1-50mi), interactive map (Leaflet) | Audit: ✅ A (90/100)

**⏳ Next: Epic 11 - Submission** (Deploy to Vercel, Demo Video, Submit)

## Audit Reports Status

**Location:** `docs/audits/`
**Total Reports:** 10 (Epic 1-10)
**Quality Scores:**
- Epic 8 (Staking/Cashback): B+ (85/100) - TypeScript blockers resolved ✅
- Epic 9 (Loyalty System): A- (88/100) - TypeScript blockers resolved ✅
- Epic 10 (Geo Discovery): A (90/100) - Production ready ✅

**Known Issues to Fix:**
- Epic 8: 3 minor improvements (nullable handling patterns)
- Epic 9: 2 minor improvements (test coverage)
- Epic 10: 3 minor improvements (unit tests, rate limiting, validation)
- Test suite: Jest matchers type errors (non-blocking)

## Deployed Infrastructure

**Smart Contracts (Devnet):** `REC6VwdAzaaNdrUCWbXmqqN8ryoSAphQkft2BX1P1b1`
- Metaplex v5.0.0 | 4 instructions (init, create, redeem, update_status)

**Frontend:** Next.js 15.5.6 @ localhost:3000
- TypeScript strict | Tailwind v4 | Privy auth | 27 tests ✅

**Database:** Supabase (mdxrtyqsusczmmpgspgn, us-east-1)
- 11 tables: merchants, deals, events, users, reviews, votes, resale_listings, referrals, staking, cashback_transactions, badges
- 2 views: merchants_with_location
- 1 function: calculate_distance_miles()
- Types: lib/database/types.ts (auto-generated)

## Remaining Tasks (Epic 11)

- ❌ Deploy to Vercel (production)
- ❌ Demo video (3-5 min)
- ❌ Submission package

## Architecture

**3-Layer Stack:**
1. **Blockchain:** Solana (Anchor) - NFT ownership, redemption state
2. **Backend:** Next.js API + Supabase - Merchant profiles, analytics, API aggregation
3. **Frontend:** Next.js 15 + Tailwind - Merchant Dashboard & User Marketplace

**Key Paths:**
```
docs/planning/  - PRD.md, TIMELINE.md, TRACK-REQUIREMENTS.md
src/contracts/  - Anchor programs, tests, Anchor.toml
src/frontend/
  ├── app/              - Routes: (merchant)/, (user)/, api/
  ├── components/       - merchant/, user/, shared/
  └── lib/              - database/, solana/, geolocation/, utils/
```

## Key Design Patterns

1. **Hybrid Architecture:** On-chain (NFT ownership, redemption) + Off-chain (metadata, analytics)
2. **Redemption Flow:** QR w/ signature → Merchant scans → Verify off-chain → Burn NFT on-chain
3. **Web3 Abstraction:** Privy email/social login, no crypto jargon ("NFT" → "Coupon")
4. **NFT Metadata:** Metaplex v1.1 standard (name, image, discount%, expiry, category)

## Success Criteria

**Judging (Estimated):** UX 25% | Technical 25% | Innovation 25% | Feasibility 15% | Completeness 10%

**Differentiation:**
1. Web3 invisible (email login, no jargon)
2. Real API integration (RapidAPI ✅)
3. Social/viral (reviews, voting, sharing ✅)
4. Mobile-first polish ✅

**Standard:** 100% working, all edge cases handled, production-ready

## Quick Commands

**Contracts (src/contracts/):**
```bash
anchor build && anchor test
anchor deploy  # devnet (solana config set --url devnet)
```

**Frontend (src/frontend/):**
```bash
npm run dev          # localhost:3000
npm run build        # production build
npm test            # run tests (27 passing)
npm run typecheck   # strict type checking
```

**Deploy:**
```bash
vercel deploy --prod  # frontend
anchor deploy --provider.cluster mainnet  # contracts
```

## Environment (.env.local)

**Required:**
```bash
# Solana & Smart Contracts
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_NFT_PROGRAM_ID=REC6VwdAzaaNdrUCWbXmqqN8ryoSAphQkft2BX1P1b1

# Database
NEXT_PUBLIC_SUPABASE_URL=https://mdxrtyqsusczmmpgspgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-key>

# Authentication
NEXT_PUBLIC_PRIVY_APP_ID=<privy-id>

# External APIs
RAPIDAPI_KEY=<rapidapi-key>  # Get Promo Codes API

# Arweave Storage (configured)
ARWEAVE_WALLET_PATH=../arweave-wallet.json
ARWEAVE_GATEWAY=https://arweave.net
NEXT_PUBLIC_ARWEAVE_GATEWAY=https://arweave.net

# MoonPay Commerce (configured)
NEXT_PUBLIC_MOONPAY_PUBLIC_KEY=<public-key>
MOONPAY_SECRET_KEY=<secret-key>
```

## Implementation Notes

**Contract Functions (Implemented):**
- initialize_merchant, create_coupon, redeem_coupon (burn NFT), update_coupon_status

**UI Flows:**
- **Merchant:** Register → Create deal → Upload → Mint NFT → Analytics
- **User:** Browse → Filter → Claim → My Coupons → Generate QR → Redeem

**DB Schema:** 11 tables (merchants, deals, events, users, reviews, votes, resale_listings, referrals, staking, cashback_transactions, badges)

## Tech Stack

**Blockchain:** Solana + Anchor 0.28+ + Metaplex v5.0.0
**Backend:** Next.js 15 API + Supabase PostgreSQL + Privy Auth
**Frontend:** Next.js 15 + TypeScript strict + Tailwind v4 + React-Leaflet
**Storage:** Arweave (permanent) + Supabase Storage (fallback)
**Payments:** MoonPay Commerce (Helio) - USDC on Solana
**External APIs:** RapidAPI (Get Promo Codes)
**Tools:** Jest/RTL (27 tests), ESLint, npm
**Libraries:** qrcode.react, html5-qrcode, tweetnacl, arweave, @heliofi/checkout-react

## MonkeDAO Branding

**Colors:** `#0d2a13` (forest green), `#f2eecb` (cream), `#00ff4d` (neon accent)
**Fonts:** Inter (primary), Poppins, Taviraj
**Design:** 8px border radius, forest/jungle palette
**Reference:** https://monkedao.io/brand-kit

## Submission Checklist (Epic 11)

**Deploy:**
- [ ] Vercel production deployment
- [ ] Environment variables configured
- [ ] Test all flows in production

**Demo Video (3-5 min, 1080p):**
- [ ] Script: Problem → Demo → Innovation → Outro
- [ ] Show: Merchant + User + Redemption flows
- [ ] Upload to YouTube

**Package:**
- [ ] Live demo URL
- [ ] GitHub repo (clean, documented, public)
- [ ] Demo video URL
- [ ] Technical write-up (2-4 pages)

## External APIs & Integrations (Implemented)

**1. RapidAPI Integration ✅**
- API: "Get Promo Codes" (1M+ coupons, 10K+ merchants)
- Endpoint: `get-promo-codes.p.rapidapi.com/data/get-coupons/`
- 1-hour cache, mock fallback
- "Partner Deal" badges in marketplace
- Location: `app/api/deals/aggregated/route.ts`

**2. Arweave Permanent Storage ✅**
- Network: AR.IO Testnet (10,000 AR balance)
- Wallet: `sY6VBEWpDPmN6oL9Zt_8KjJMR1PWexpmWKEAojtbwsc`
- Usage: NFT image and metadata permanent storage
- Fallback: Supabase Storage (graceful degradation)
- Location: `lib/storage/arweave.ts`, `lib/storage/upload.ts`

**3. MoonPay Commerce (Helio) Payment Integration ✅**
- 8 paylinks configured: $1, $2, $5, $10, $15, $20, $25, $50 USDC
- Dashboard: https://moonpay.hel.io/dashboard
- Network: Solana (USDC payments)
- Widget: `@heliofi/checkout-react@^4.0.0`
- Configuration: `lib/payments/paylink-config.ts`
- Components: `components/payments/SimplePaymentButton.tsx`
- Test page: `/test-payment`
- Note: Backend SDK incompatible with new MoonPay API (using dashboard paylinks)

## Common Risks

- **RPC Limits:** Use Helius/QuickNode for prod
- **Tx Failures:** Retry logic + clear error feedback
- **Scope Creep:** Stick to TIMELINE.md, cut bonus features if behind
- **Demo Video:** Script early (Day 12-13), 1080p, <5 min
- **Incomplete:** 100% working standard - finish features fully

## Key Files

**Docs:**
- README.md, CLAUDE.md
- docs/planning/{PRD,TIMELINE,TRACK-REQUIREMENTS}.md
- MOONPAY-SETUP-GUIDE.md, MOONPAY-SOLUTION.md, PAYLINK-CHECKLIST.md

**Contracts:**
- src/contracts/programs/nft_coupon/src/lib.rs
- Anchor.toml

**Frontend Core:**
- src/frontend/app/{layout,page}.tsx
- .env.local
- arweave-wallet.json (gitignored)

**Integrations:**
- lib/storage/arweave.ts (Arweave uploads)
- lib/storage/upload.ts (unified upload with fallback)
- lib/payments/paylink-config.ts (MoonPay paylink mapping)
- lib/payments/moonpay.ts (payment utilities)
- components/payments/SimplePaymentButton.tsx (payment widget)
- app/api/deals/aggregated/route.ts (RapidAPI integration)

## Guidelines

**For New Features:**
1. Check TIMELINE.md (current phase), TRACK-REQUIREMENTS.md (scope)
2. Follow architecture, test 100%, update docs

**Success Tiers:**
- **3rd:** Core 4 features + basic UI + demo
- **2nd:** + Web3 abstraction + 1 bonus (social/API) + polish ✅ **WE ARE HERE**
- **1st:** + Exceptional UX + analytics + professional demo

**Strategy:** UX is 25% of score. Web3 invisible. Mobile-first. Submit 24-48h early.

---

---

## Recent Updates (2025-10-19)

**Three Major Integrations Completed:**

1. **RapidAPI - Deal Aggregation ✅**
   - Switched from non-existent API to "Get Promo Codes" (1M+ coupons)
   - Successfully fetching 20 deals per request
   - Tested and working

2. **Arweave - Permanent Storage ✅**
   - Wallet created and funded (10,000 AR on testnet)
   - Keyfile secured (gitignored)
   - Upload functions implemented with Supabase fallback
   - Ready for NFT metadata storage

3. **MoonPay Commerce - Payments ✅**
   - 8 paylinks created ($1, $2, $5, $10, $15, $20, $25, $50 USDC)
   - Configuration complete in `paylink-config.ts`
   - Payment widget integrated with automatic paylink routing
   - Test page available at `/test-payment`
   - Issue documented: Backend SDK incompatible (using dashboard paylinks)

**Files Created:**
- MOONPAY-SETUP-GUIDE.md (setup instructions)
- MOONPAY-SOLUTION.md (technical details)
- PAYLINK-CHECKLIST.md (tracking document)
- lib/storage/arweave.ts
- lib/payments/paylink-config.ts
- components/payments/SimplePaymentButton.tsx

**Status:** All core integrations complete and tested. Ready for Epic 11 (deployment).

---

**Last Updated:** 2025-10-19 (All Epics 1-10 Audited ✅ + 3 Major Integrations Complete ✅ + Ready for Epic 11)

*Bismillah! Tawfeeq min Allah.*
