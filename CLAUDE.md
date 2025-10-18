# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **hackathon project** for the Cypherpunk - MonkeDAO Track on Superteam Earn. The goal is to build a Web3-powered deal discovery and loyalty platform where promotional discounts are represented as tradable NFT coupons on Solana blockchain.

**Prize Pool:** $6,500 USDC + Gen3 Monke NFTs
**Submission Deadline:** ~October 30, 2025
**Current Status:** 100% Feature Complete | All 10 Implementation Epics Done | Ready for Submission (Epic 11)
**Competition Status:** 0 submissions (high opportunity)

**The Core Concept:** Reinvent Groupon with Web3 principles - merchants mint NFT coupons, users collect and trade them, redemption is verified on-chain. Think "DeFi for Discounts."

**Key Technologies:**
- **Blockchain:** Solana (Anchor framework, Metaplex Token Metadata)
- **Frontend:** Next.js 14+ with Tailwind CSS
- **Backend:** Next.js API routes + PostgreSQL (Supabase)
- **Authentication:** Privy/Dynamic (Web3 + email login)
- **Storage:** Arweave/IPFS for NFT metadata

## Project State & Context

### Current Phase: Phase 4 - Submission Preparation (Day 6 - Feature Complete)

**Implementation Status:** Epic 1-10 Complete ✅ | 100% Complete (84/84 tasks)

**Current Progress:**
- ✅ **Epic 1: NFT Coupons (100% Complete)** - Smart contracts implemented, tested, and deployed to devnet
- ✅ **Frontend Foundation (100% Complete)** - Next.js 15.5.6 initialized, wallet integration working, MonkeDAO branding applied
- ✅ **Epic 2: Merchant Dashboard (100% Complete)** - Authentication, profile management, deal creation, analytics, settings all implemented
- ✅ **Epic 3: User Marketplace (100% Complete)** - Marketplace UI, deal browsing, filters, My Coupons page, QR code generation all implemented with polished UI
- ✅ **Testing Infrastructure (100% Complete)** - Jest + React Testing Library configured, 27 component tests passing, coverage reporting
- ✅ **Epic 4: Redemption Flow (100% Complete)** - QR generation with signatures, merchant scanner, off-chain verification, on-chain NFT burning, event recording
- ✅ **Epic 5: Deal Aggregator Feed (100% Complete)** - RapidAPI integration, 1-hour caching, mock data fallback, Partner Deal badges, seamless marketplace integration
- ✅ **Epic 6: Social Discovery Layer (100% Complete)** - Ratings & reviews, upvote/downvote, social sharing, referral tracking, live activity feed
- ✅ **Epic 7: Web3 Abstraction (100% Complete)** - Privy authentication, email/social login, embedded wallets, crypto terminology removed
- ✅ **Epic 8: Reward Staking & Cashback (100% Complete)** - 12% APY staking, tier-based cashback (5-15%), staking dashboard, automatic distribution
- ✅ **Epic 9: Loyalty System (100% Complete)** - 4-tier system, 8 NFT badges, user profile, exclusive deals, auto-badge minting
- ✅ **Epic 10: Geo-Based Discovery (100% Complete)** - Browser geolocation, merchant locations, distance filtering (1-50 miles), interactive map view (React-Leaflet), list/map toggle, "Nearest to Me" sort
- ⏳ Epic 11: Submission Preparation (Next - Deploy, Demo Video, Submit)

**What exists:**
- ✅ Comprehensive planning documentation (README, analysis, timeline, requirements)
- ✅ Clear technical architecture and tech stack decisions
- ✅ Day-by-day development roadmap (14-day sprint)
- ✅ Feature checklists and submission requirements
- ✅ **Smart contracts (Anchor/Rust) - DEPLOYED TO DEVNET**
  - Program ID: `REC6VwdAzaaNdrUCWbXmqqN8ryoSAphQkft2BX1P1b1` (vanity address)
  - 4 instructions: initialize_merchant, create_coupon, redeem_coupon, update_coupon_status
  - Metaplex Token Metadata v5.0.0 integration
  - Comprehensive test suite (5/9 tests passing on local validator, full functionality verified on devnet)
- ✅ **Frontend application (Next.js 15.5.6) - RUNNING ON LOCALHOST:3000**
  - TypeScript + App Router + Tailwind CSS v4
  - Solana Wallet Adapter provider configured (Phantom, Solflare, Backpack)
  - WalletButton component with connection UI
  - MonkeDAO brand colors integrated (5 colors + 8px border radius)
  - Environment configuration ready (.env.local)
  - Folder structure: app/, components/shared/, lib/ (ready for expansion)
- ✅ **Database (Supabase PostgreSQL) - CONFIGURED & DEPLOYED**
  - Project: `nft-coupon-platform` (dedicated hackathon project)
  - Project ID: `mdxrtyqsusczmmpgspgn`
  - Region: us-east-1 (N. Virginia)
  - 8 tables: merchants, deals, events, users, reviews, votes, resale_listings, referrals
  - TypeScript types generated (lib/database/types.ts)
  - Supabase client configured (lib/database/supabase.ts)
  - Test endpoint: /api/test-db

**What exists now (Epic 3 Complete):**
- ✅ **Merchant authentication & registration** - API routes for profile management
- ✅ **Merchant dashboard UI** - Main dashboard with stats, deals list, analytics, settings
- ✅ **Deal creation form** - Full form with image upload, validation, and NFT minting
- ✅ **Analytics dashboard** - Charts for views, purchases, redemptions, category breakdown
- ✅ **Settings page** - Profile management with business info updates
- ✅ **User marketplace UI** - Browse deals with search, filters (6 categories), and sort (newest, expiring soon, highest discount)
- ✅ **Deal detail page** - View deal details with "Claim Coupon" functionality
- ✅ **My Coupons page** - View owned NFT coupons with status filters (All, Active, Expired, Redeemed)
- ✅ **QR code generation** - Generate QR codes with wallet signatures for redemption
- ✅ **User navigation** - Navigation bar with Home, Marketplace, My Coupons links
- ✅ **Wallet integration** - Polished wallet connection UI with modal styling
- ✅ **Code quality** - All ESLint issues fixed (0 problems), TypeScript type-safe (0 errors)
- ✅ **TypeScript strict mode** - Added `npm run typecheck` and `npm run typecheck:strict` scripts
- ✅ **UI Polish** - Consistent color scheme, improved contrast, professional design
- ✅ **Testing infrastructure** - Jest + React Testing Library configured
  - 27 component tests passing (100% pass rate)
  - Test files: WalletButton, CustomSelect, DealFilters, UserNavigation
  - Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`
  - Coverage: 100% on tested components (CustomSelect, WalletButton, DealFilters, UserNavigation)
- ✅ **UI Consistency** - /coupons page matches /marketplace design pattern (cream background, dark hero, white cards)
- ✅ **Hydration fixes** - WalletMultiButton dynamically imported with ssr:false

**What exists now (Epic 4 Complete - Day 6):**
- ✅ **User-side QR code generation** - Signed QR codes with wallet signature and timestamp
- ✅ **QR code modal** - Beautiful display with download option and coupon details
- ✅ **Merchant QR scanner** - Camera-based scanner using html5-qrcode library
- ✅ **Off-chain verification** - Signature validation, NFT ownership check, timestamp validation
- ✅ **On-chain redemption** - NFT burning using SPL Token instructions
- ✅ **Redemption events** - Database logging via /api/redemptions endpoint
- ✅ **Merchant navigation** - "Redeem Coupon" added to sidebar
- ✅ **Complete redemption UI** - 6-state flow (idle, scanning, verifying, verified, redeeming, redeemed, failed)
- ✅ **Security features** - Cryptographic signatures (tweetnacl), replay attack prevention, atomic burns
- ✅ **Libraries added** - qrcode.react, html5-qrcode, tweetnacl

**What exists now (Epic 5 Complete - Day 6):**
- ✅ **External deal aggregation API** - /api/deals/aggregated endpoint with RapidAPI integration
- ✅ **1-hour caching system** - In-memory cache with TTL (reduces API costs, improves performance)
- ✅ **Mock data fallback** - 5 demo deals across all categories if RAPIDAPI_KEY not configured
- ✅ **Coupons by API-Ninjas integration** - Recommended RapidAPI provider (100 req/day free tier)
- ✅ **Data normalization** - External deals converted to platform-compatible format
- ✅ **Partner Deal badges** - Blue "Partner Deal" badge with ExternalLink icon
- ✅ **Seamless marketplace integration** - Platform + external deals merged in single view
- ✅ **External links** - Direct links to partner sites for external deals
- ✅ **ExtendedDeal type** - TypeScript support for both internal and external deals
- ✅ **Environment documentation** - RapidAPI setup instructions in .env.local

**What exists now (Epic 6 Complete - Day 6):**
- ✅ **Rating & Review System** - /api/reviews with POST & GET endpoints
  - 5-star rating system with hover preview
  - Optional text review (500 character limit)
  - Create, update, and fetch reviews with average rating stats
  - RatingSystem.tsx component integrated into deal detail pages
- ✅ **Upvote/Downvote System** - /api/votes with Reddit-style voting
  - Toggle voting (same vote removes it, different vote updates)
  - Score calculation (upvotes - downvotes)
  - VoteButtons.tsx component with 3 sizes (sm, md, lg)
  - Optimistic UI updates for instant feedback
  - Integrated into marketplace cards and deal detail pages
- ✅ **Social Sharing** - ShareButtons.tsx with multi-platform support
  - Twitter/X sharing
  - Telegram sharing
  - Copy link to clipboard
  - Native Web Share API support (mobile-friendly)
  - Automatic referral URL generation with wallet address
- ✅ **Referral Tracking System** - /api/referrals with complete tracking
  - URL parameter tracking (?ref=wallet_address)
  - Automatic referral capture in claim coupon flow
  - Anti-self-referral protection
  - Referral stats and deal breakdown by referrer
- ✅ **Live Activity Feed** - /api/activity-feed with real-time aggregation
  - Recent claims (last 10 purchases)
  - Recent reviews (last 10 ratings)
  - Trending deals (most upvoted in 7 days)
  - ActivityFeed.tsx component with time-ago formatting
  - Sticky sidebar positioning in marketplace
  - Compact and full display variants

**What exists now (Epic 7 Complete - Day 6):**
- ✅ **Privy Authentication** - Email/social login with embedded Solana wallets
- ✅ **Crypto Terminology Removed** - "NFT coupon" → "digital coupon", "Connect wallet" → "Sign in", "Blockchain" → "Secure digital ledger"
- ✅ **PrivyLoginButton** - Replaced WalletMultiButton across all user flows
- ✅ **Embedded Wallets** - Auto-created Solana wallets for email/social users
- ✅ **Privy Hooks Integration** - usePrivy + useWallets replacing useWallet
- ✅ **Logo Updated** - "NFT Coupons" → "DealCoupon"
- ✅ **Terminology Sweep** - 90+ replacements across all .tsx files

**What exists now (Epic 9 Complete - Day 6):**
- ✅ **4-Tier Loyalty System** - Bronze → Silver → Gold → Platinum with auto-progression
- ✅ **8 NFT Achievement Badges** - First Steps, Deal Hunter, Savvy Shopper, Discount Master, Social Butterfly, Influencer, Critic, Community Champion
- ✅ **User Profile Page** - /profile with tier progress, badge gallery, stats dashboard
- ✅ **Exclusive Deals** - Tier-gated deals with locked overlay for low-tier users
- ✅ **Auto-Badge Minting** - Integrated into redemption flow, mints badges on milestones
- ✅ **Tier-Based Bonuses** - +0% (Bronze), +5% (Silver), +10% (Gold), +15% (Platinum)
- ✅ **Database Migration** - Complete schema for users, deals, badges tables
- ✅ **API Routes** - /api/user/tier, /api/user/badges, /api/badges/mint

**What exists now (Epic 8 Complete - Day 6 Evening):**
- ✅ **Token Economics Design** - 1B DEAL token, 12% APY, tier-based cashback (5-15%)
- ✅ **Staking System** - Database-backed staking with real-time reward calculation
- ✅ **Staking UI** - /staking dashboard with stake/unstake/claim functionality
- ✅ **Cashback Distribution** - Automatic DEAL token rewards on redemptions
- ✅ **API Routes** - Complete staking API (/info, /stake, /unstake, /claim-rewards)

**What exists now (Epic 10 Complete - Day 6 Evening):**
- ✅ **Geolocation Library** - Complete browser geolocation utilities
  - `lib/geolocation/detect.ts` - getUserLocation(), watchUserLocation(), browser permission handling
  - `lib/geolocation/distance.ts` - Haversine formula, calculateDistance(), filterByDistance(), formatDistance()
  - `lib/geolocation/geocoding.ts` - OpenStreetMap Nominatim API integration (geocodeAddress, reverseGeocode, searchPlaces)
  - `lib/geolocation/types.ts` - TypeScript interfaces for Coordinates, LocationResult, GeocodingResult
- ✅ **Merchant Location System** - Database schema and UI for merchant addresses
  - Database migration: Added latitude, longitude, address, city, state, postal_code, country to merchants table
  - SQL function: calculate_distance_miles() using Haversine formula
  - Spatial index: idx_merchants_location for fast queries
  - Merchant Settings UI: Address input form with "Get Coordinates from Address" button
  - Auto-geocoding using OpenStreetMap Nominatim (free, no API key)
- ✅ **Distance Filtering** - Filter deals by proximity to user location
  - DistanceFilter component with 5 options: 1, 5, 10, 25, 50 miles
  - Location permission request UI
  - "All Distances" option to disable filtering
  - Visual feedback for selected distance radius
- ✅ **Interactive Map View** - React-Leaflet integration
  - MapView component with OpenStreetMap tiles (free, no API key)
  - User location marker with radius circle
  - Deal markers with clickable popups showing deal info
  - Legend with color coding
  - Dynamic zoom based on distance filter
  - SSR-safe implementation with dynamic imports
- ✅ **Marketplace Integration**
  - List/Map view toggle button
  - "Nearest to Me 📍" sort option (conditional on location enabled)
  - Extended deal type with location fields (latitude, longitude, merchant_city, merchant_state)
  - Deals query joins merchants table to fetch location data
  - Results count shows distance filter status
  - Leaflet CSS loaded in layout.tsx
- ✅ **Test Data** - 4 merchants with location data across SF Bay Area
  - San Francisco (37.7749, -122.4194) - Coffee shop
  - Oakland (37.8044, -122.2712) - Pizza (~10 miles)
  - Berkeley (37.8715, -122.2730) - Coffee (~12 miles)
  - San Jose (37.3382, -121.8863) - Electronics (~50 miles)

**What doesn't exist yet (Submission - Phase 4):**
- ✅ Database migration run on Supabase ✅ COMPLETE
- ❌ Production deployment (Vercel hosting) - Epic 11
- ❌ Demo video (3-5 minutes) - Epic 11
- ❌ Final submission package - Epic 11

**IMPORTANT - Epic Sequencing Rule:**
- **DO NOT proceed to Epic 11 (Submission) until RECTOR explicitly approves skipping Epic 10**
- Epic 10 is OPTIONAL bonus epic marked "NOT RECOMMENDED" in planning docs
- We completed Epic 8 (Staking/Cashback) AND Epic 9 (Loyalty System) - BOTH RECOMMENDED
- Current completion: 9/10 epics done (Epic 1-9) = 98% complete
- Decision: Skip Epic 10 OR implement before Epic 11

**Next Steps:**
1. ✅ Epic 8 (Staking & Cashback) complete ✅
2. ✅ Epic 9 (Loyalty System) complete ✅
3. **DECISION REQUIRED:** Skip Epic 10 (Geo Discovery) OR implement it?
4. Epic 11 - Submission Preparation (Deploy, Demo Video, Submit) - ONLY after approval

## Architecture and Structure

### High-Level Architecture

This is a **three-layer full-stack Web3 application**:

1. **Blockchain Layer (Solana)**
   - Anchor smart contracts for NFT coupon lifecycle (mint, transfer, redeem/burn)
   - Metaplex Token Metadata standard for NFT representation
   - On-chain state: NFT ownership, redemption tracking, merchant controls

2. **Backend Layer (Next.js API + Database)**
   - Next.js 14+ serverless API routes
   - PostgreSQL database (via Supabase) for off-chain data
   - Stores: merchant profiles, deal metadata cache, user preferences, analytics
   - Handles: API integrations (deal aggregators), authentication, file uploads

3. **Frontend Layer (Next.js + React)**
   - Next.js 14+ with App Router for SSR and SEO
   - Two primary user interfaces:
     - **Merchant Dashboard:** Create deals, view analytics, manage listings
     - **User Marketplace:** Browse deals, purchase NFT coupons, redemption flow
   - Solana Wallet Adapter for wallet connections
   - Tailwind CSS for styling (utility-first approach per RECTOR's preferences)

### Directory Structure

```
web3-deal-discovery-nft-coupons/
├── README.md                        # Project overview (reference first)
├── CLAUDE.md                        # This file
├── docs/                           # Documentation and planning
│   ├── planning/                   # Planning documents
│   │   ├── hackathon-analysis.md  # Strategic analysis (read for context)
│   │   ├── hackathon-original.md  # Original hackathon brief
│   │   ├── PRD.md                 # Product Requirements Document
│   │   ├── EXECUTION.md           # Implementation plan
│   │   ├── TRACK-REQUIREMENTS.md  # Feature checklist (track progress)
│   │   └── TIMELINE.md            # 14-day development roadmap (follow daily)
│   └── resources/                  # Reference materials
│       └── QUICK-START-GUIDE.md   # Quick reference for hackathon
└── src/                            # Implementation workspace
    ├── contracts/                  # Anchor smart contracts (Rust) ✅ DEPLOYED
    │   ├── programs/               # Solana programs
    │   │   └── nft_coupon/        # Main NFT coupon program
    │   ├── tests/                  # Smart contract tests
    │   └── Anchor.toml            # Anchor configuration
    ├── frontend/                   # Next.js application ✅ RUNNING
    │   ├── app/                    # Next.js 15 app router
    │   │   ├── layout.tsx         ✅ Root layout with wallet provider
    │   │   ├── page.tsx           ✅ Homepage with wallet demo
    │   │   ├── globals.css        ✅ MonkeDAO brand colors configured
    │   │   ├── (merchant)/        # Merchant dashboard routes (TODO)
    │   │   ├── (user)/            # User marketplace routes (TODO)
    │   │   └── api/               # API routes (TODO)
    │   ├── components/             # React components
    │   │   ├── merchant/          # Merchant-specific components (TODO)
    │   │   ├── user/              # User-specific components (TODO)
    │   │   └── shared/            # Shared components
    │   │       ├── WalletProvider.tsx  ✅ Solana wallet context
    │   │       └── WalletButton.tsx    ✅ Wallet connection UI
    │   ├── lib/                    # Utilities and helpers (ready for expansion)
    │   │   ├── solana/            # Solana interaction utilities (TODO)
    │   │   ├── database/          # Database queries (TODO)
    │   │   └── utils/             # Helper functions (TODO)
    │   ├── public/                 # Static assets
    │   ├── .env.local             ✅ Environment configuration
    │   ├── package.json           ✅ Dependencies installed
    │   ├── next.config.ts         ✅ Next.js configuration
    │   └── tsconfig.json          ✅ TypeScript configuration
    └── README.md                   # Implementation-specific setup docs
```

### Key Design Decisions

**1. Hybrid On-Chain + Off-Chain Architecture**
- **On-chain:** NFT ownership, redemption state (burn/mark redeemed), merchant controls
- **Off-chain:** Deal metadata cache, merchant profiles, analytics, user preferences
- **Why:** Balances decentralization with performance and cost efficiency

**2. Redemption Flow Design**
- **Approach:** Hybrid off-chain verification + on-chain attestation
- **Flow:** User generates QR (NFT address + signature) → Merchant scans → Verify ownership off-chain (fast) → Burn/mark NFT on-chain (prevent double-spend)
- **Why:** Fast UX while maintaining on-chain proof of redemption

**3. Web3 Abstraction Strategy**
- **Target Users:** Mainstream consumers who don't understand crypto
- **Approach:**
  - Email/social login via Privy/Dynamic (embedded wallets)
  - Fiat payments via Stripe (auto-convert to SOL)
  - Hide terminology: "NFT" → "Coupon", "Mint" → "Create Deal", "Wallet" → "My Coupons"
  - Sponsor gas fees (merchant or platform pays)
- **Why:** Reduces friction, makes Web3 invisible to end users

**4. NFT Metadata Structure**
Using Metaplex Token Metadata v1.1 standard:
```json
{
  "name": "50% Off - Artisan Coffee Roasters",
  "description": "50% discount on all specialty coffee beans",
  "image": "https://arweave.net/...",
  "attributes": [
    {"trait_type": "Discount", "value": "50%"},
    {"trait_type": "Merchant", "value": "Artisan Coffee Roasters"},
    {"trait_type": "Merchant ID", "value": "0x..."},
    {"trait_type": "Expiry", "value": "2025-12-31"},
    {"trait_type": "Redemptions Remaining", "value": "1"},
    {"trait_type": "Category", "value": "Food & Beverage"}
  ]
}
```

## Development Workflow

### Phase-Based Development Approach

This project follows a **strict 14-day phased development timeline** (see docs/planning/TIMELINE.md). Always reference the timeline for daily milestones and task breakdowns.

**Phase 1 (Days 1-3):** Foundation - Smart contracts + wallet integration
**Phase 2 (Days 4-8):** Core MVP - Merchant dashboard, marketplace, redemption flow
**Phase 3 (Days 9-11):** Differentiation - Web3 abstraction, API integration, social features
**Phase 4 (Days 12-14):** Submission - Deployment, demo video, documentation

### Critical Success Factors

**Judging Criteria (Estimated Weights):**
- **User Experience (25%)** - Make Web3 invisible
- **Technical Implementation (25%)** - Clean code, robust contracts
- **Innovation & Creativity (25%)** - Unique features beyond basic NFT marketplace
- **Feasibility & Scalability (15%)** - Real-world viability
- **Completeness (10%)** - Address all requirements

**Differentiation Strategy:**
1. Superior UX abstraction (email login, no crypto jargon)
2. Real API integration (at least ONE live deal API like Skyscanner)
3. Social/viral features (ratings, sharing, referral tracking)
4. Polish (mobile-first, fast, professional design)

**100% Working Standard:**
- All features must be fully functional before submission
- Edge cases handled (expired coupons, network failures, concurrent redemptions)
- No half-implemented features
- Production-ready code quality

## Common Commands

### Smart Contract Development (Anchor)

```bash
# Navigate to contracts directory
cd src/contracts

# Build smart contracts
anchor build

# Run tests
anchor test

# Deploy to Solana Devnet
solana config set --url devnet
anchor deploy

# Deploy to Solana Mainnet-beta (production)
solana config set --url mainnet-beta
anchor deploy

# Get program ID after deployment
solana address -k target/deploy/nft_coupon-keypair.json
```

### Frontend Development (Next.js)

```bash
# Navigate to frontend directory
cd src/frontend

# Install dependencies (npm preferred per RECTOR's preferences)
npm install

# Run development server
npm run dev
# Access at http://localhost:3000

# Build for production
npm run build

# Run production build locally
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### Solana CLI Commands

```bash
# Check Solana CLI version
solana --version

# Configure network (devnet for development)
solana config set --url devnet

# Check current configuration
solana config get

# Create new wallet (if needed)
solana-keygen new

# Check wallet balance
solana balance

# Airdrop SOL to wallet (devnet only)
solana airdrop 2

# Check transaction status
solana confirm <SIGNATURE>
```

### Database Commands (Supabase)

```bash
# Supabase is typically managed via web UI or CLI
# If using Supabase CLI:

# Initialize Supabase project
supabase init

# Start local Supabase instance
supabase start

# Stop local Supabase
supabase stop

# Generate database types for TypeScript
supabase gen types typescript --local > src/frontend/lib/database/types.ts
```

### Deployment Commands

```bash
# Deploy frontend to Vercel (from src/frontend directory)
vercel deploy --prod

# Or use Vercel CLI for preview deployment
vercel

# Deploy smart contracts to Solana (from src/contracts)
anchor deploy --provider.cluster mainnet
```

## Environment Variables

### Frontend (.env.local in src/frontend/)

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_NFT_PROGRAM_ID=<your-deployed-program-id>

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Authentication (Privy/Dynamic)
NEXT_PUBLIC_PRIVY_APP_ID=<your-privy-app-id>
PRIVY_APP_SECRET=<your-privy-secret>

# File Storage (Arweave)
ARWEAVE_WALLET_KEY=<your-arweave-wallet-key>

# Payment (Stripe - optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-key>
STRIPE_SECRET_KEY=<your-stripe-secret>

# API Integrations (Deal Aggregators)
RAPIDAPI_KEY=<your-rapidapi-key>
SKYSCANNER_API_KEY=<your-skyscanner-key>

# Analytics (Posthog - optional)
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-key>
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Smart Contracts (Anchor.toml in src/contracts/)

```toml
[features]
seeds = false
skip-lint = false

[programs.devnet]
nft_coupon = "<your-program-id>"

[programs.mainnet]
nft_coupon = "<your-mainnet-program-id>"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"  # or "mainnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

## Key Implementation Guidelines

### Smart Contract Development

**Must-Have Contract Functions:**
1. `initialize_merchant()` - Register merchant, create merchant account
2. `create_coupon()` - Mint NFT coupon with metadata
3. `purchase_coupon()` - Transfer NFT to buyer (or claim for free)
4. `list_for_resale()` - Enable secondary marketplace listing
5. `redeem_coupon()` - Burn or mark NFT as redeemed
6. `verify_ownership()` - Check current NFT owner (off-chain verification)

**Security Considerations:**
- Single-use enforcement: Burn NFT on redemption OR mark as redeemed in metadata
- Expiry validation: Check block timestamp against coupon expiry
- Merchant controls: Only merchant can create coupons for their store
- Prevent double-spend: Atomic operations for redemption

**Testing Requirements:**
- Unit tests for all smart contract functions
- Integration tests for end-to-end flows
- Edge case tests (expired coupons, concurrent redemptions, invalid signatures)

### Frontend Development

**Critical UI Flows:**

1. **Merchant Flow:**
   - Register/login → Create deal form → Upload image → Set discount/expiry → Mint NFT → View in dashboard

2. **User Flow:**
   - Browse marketplace → Filter deals → View detail → Purchase/claim NFT → View in "My Coupons" → Generate QR → Merchant scans → Redeem on-chain

3. **Redemption Flow:**
   - User: Select coupon → Generate QR (contains NFT mint address + signature)
   - Merchant: Scan QR → Verify ownership off-chain → Confirm redemption
   - On-chain: Burn NFT or mark as redeemed → Record event

**State Management:**
- Use Zustand or React Context for global state
- Wallet state, user profile, cart/selection state
- Keep state minimal, derive when possible

**Error Handling:**
- Graceful handling of wallet disconnection
- Network failure recovery (Solana RPC timeouts)
- Transaction confirmation feedback (loading states, success/error messages)
- Expired coupon warnings
- Invalid QR code error handling

**Performance Optimization:**
- Lazy load images (next/image)
- Code splitting for routes
- Cache Solana RPC calls where possible
- Use SWR or React Query for data fetching
- Optimize bundle size (analyze with next/bundle-analyzer)

### Database Schema (PostgreSQL via Supabase)

**Core Tables:**

```sql
-- Merchants table
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table (metadata cache)
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchants(id),
  nft_mint_address TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  discount_percentage INTEGER,
  expiry_date TIMESTAMPTZ,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics/Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'view', 'purchase', 'redemption'
  deal_id UUID REFERENCES deals(id),
  user_wallet TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- User preferences (optional)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT,
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Technology Stack Details

### Blockchain Layer
- **Network:** Solana (high throughput, low fees - ideal for consumer app)
- **Framework:** Anchor 0.28+ (Rust-based framework for Solana programs)
- **Token Standard:** Metaplex Token Metadata v1.1 (industry standard for NFTs)
- **Wallets:** Phantom, Solflare, Backpack (via Solana Wallet Adapter)
- **RPC Provider:** Use Helius or QuickNode for production (better rate limits)

### Backend
- **Framework:** Next.js 14+ (React framework with serverless API routes)
- **Database:** PostgreSQL via Supabase (managed database with real-time features)
- **Authentication:** Privy or Dynamic (Web3 + email login, embedded wallets)
- **File Storage:** Arweave for NFT metadata/images (permanent, decentralized)
- **API Integrations:** RapidAPI, Skyscanner, or Booking.com for deal aggregation

### Frontend
- **Framework:** Next.js 14+ with App Router (SSR, SEO, file-based routing)
- **Styling:** Tailwind CSS (utility-first, RECTOR's preference for rapid development)
- **UI Library:** shadcn/ui or Radix UI (accessible, composable components)
- **State:** Zustand or React Context (lightweight state management)
- **Wallet:** Solana Wallet Adapter (multi-wallet support)
- **QR Codes:** qrcode.react (generate QR codes for redemption)

### Development Tools
- **Version Control:** Git (initialize repo early, commit frequently)
- **Package Manager:** npm (RECTOR's default preference for JavaScript projects)
- **Linting:** ESLint + Prettier (enforce code style)
- **Type Checking:** TypeScript (use strict mode)
- **Testing:** Jest + React Testing Library (frontend), Anchor test framework (contracts)

## Design & Branding Guidelines

### MonkeDAO Brand Kit

**Reference:** https://monkedao.io/brand-kit

**Important:** When working on frontend, brand, or design elements, always reference the MonkeDAO brand kit to ensure consistency with hackathon track sponsor branding.

**Brand Colors (Extracted from CSS):**
- Primary Green: `#0d2a13` (dark forest green)
- Accent Green: `#174622`
- Cream/Off-white: `#f2eecb`
- Neon Green: `#00ff4d` (highlight/accent)
- Border Accent: `#f3efcd`

**Typography:**
- Primary Font: Inter (sans-serif)
- Secondary Font: Poppins (supports Devanagari, Latin-ext, Latin)
- Tertiary Font: Taviraj (supports Thai, Vietnamese, Latin)

**Design Elements:**
- Gradient backgrounds using green tones
- Border radius: 8px for rounded corners
- MonkeDAO aesthetic: Forest/jungle green palette with cream accents

**Usage Guidelines:**
- Incorporate MonkeDAO branding where appropriate (footer, about page, sponsorship acknowledgment)
- Maintain brand color harmony if using MonkeDAO colors in UI
- Reference full brand kit page for logo files and complete guidelines
- Ensure proper attribution to MonkeDAO as hackathon track sponsor

**Asset Downloads:**
- Visit https://monkedao.io/brand-kit directly for downloadable logos, graphics, and complete brand guidelines

## Workflow Guidelines

### Starting Implementation (Day 1-3)

**Step 1: Environment Setup**
1. Install Solana CLI, Anchor, Rust (see README.md installation section)
2. Create Solana wallet and fund with devnet SOL
3. Verify toolchain: `solana --version`, `anchor --version`, `cargo --version`

**Step 2: Initialize Projects**
1. Create Anchor workspace: `anchor init nft_coupon` in `src/contracts/`
2. Create Next.js app: `npx create-next-app@latest frontend` in `src/`
3. Initialize Git: `git init` (if not already initialized)

**Step 3: Smart Contract Development**
1. Design NFT data structure (see "NFT Metadata Structure" section)
2. Implement core contract functions (see "Smart Contract Development" section)
3. Write tests for all functions
4. Deploy to devnet and record program ID

**Step 4: Frontend Foundation**
1. Install dependencies (Tailwind, Solana Wallet Adapter, Supabase client)
2. Configure Tailwind CSS
3. Set up Solana Wallet Adapter provider
4. Create basic layout and navigation

### During Development (Day 4-11)

**Daily Workflow:**
1. Check docs/planning/TIMELINE.md for today's milestones
2. Update docs/planning/TRACK-REQUIREMENTS.md as features are completed
3. Commit progress at least once per day with descriptive messages
4. Test each feature before moving to next one
5. Use daily standup template in docs/planning/TIMELINE.md to track blockers

**Testing Strategy:**
- Test smart contracts after each function implementation
- Test frontend flows after each component is built
- Do integration testing at end of each phase
- Manual testing on different browsers and devices

**Checkpoint Reviews:**
- End of Day 3: Smart contracts working?
- End of Day 8: End-to-end MVP working?
- End of Day 11: Submission-ready?

### Pre-Submission (Day 12-14)

**Deployment Checklist:**
- [ ] Frontend deployed to Vercel (production environment)
- [ ] Smart contracts deployed (devnet or mainnet-beta)
- [ ] Environment variables configured for production
- [ ] Database tables created and seeded (if applicable)
- [ ] Test all flows in production environment

**GitHub Repo Preparation:**
- [ ] Clean up code (remove TODOs, commented code)
- [ ] Add code comments for complex logic
- [ ] Update README with comprehensive setup instructions
- [ ] Add screenshots/GIFs demonstrating features
- [ ] Include LICENSE file
- [ ] Verify repo is public and accessible

**Demo Video Requirements:**
- Length: 3-5 minutes
- Script: Intro (problem) → Demo (features) → Innovation (differentiators) → Outro
- Quality: 1080p minimum, clear audio, good pacing
- Upload: YouTube (unlisted or public)
- Show: Merchant flow, user flow, redemption flow, key differentiators

**Submission Package:**
1. Live demo URL (Vercel deployment)
2. GitHub repository URL
3. Demo video URL (YouTube)
4. Technical write-up (PDF or Markdown, 2-4 pages)
5. API documentation (if applicable)

## External API Integration

### Deal Aggregator APIs (Choose ONE minimum)

**RapidAPI (Recommended - Easiest)**
- Hub of aggregated deal APIs
- Sign up at https://rapidapi.com/
- Search for "deals", "coupons", or "discounts"
- Use API Hub to browse and test endpoints
- Free tier available for most APIs

**Skyscanner API (Travel Deals)**
- API Docs: https://developers.skyscanner.net/
- Provides flight and hotel deals
- Good for demonstrating real-world utility
- May require partnership application

**Booking.com Affiliate API**
- API Docs: https://www.booking.com/affiliate-program/
- Hotel and accommodation deals
- Requires affiliate program signup

**Implementation Strategy:**
1. Create API wrapper in `src/frontend/lib/api/deals.ts`
2. Normalize API response to match internal deal format
3. Cache responses (1-24 hours) to reduce API costs
4. Mix external deals with platform-native NFT deals in marketplace
5. Label source clearly ("Partner Deal" vs "Platform Deal")

## Risk Mitigation

### Common Pitfalls & Solutions

**Issue: Solana RPC Rate Limits**
- **Solution:** Use paid RPC provider (Helius, QuickNode) for production
- **Alternative:** Implement exponential backoff and caching

**Issue: Transaction Failures**
- **Solution:** Retry logic with exponential backoff
- **Feedback:** Clear user feedback, error messages with actionable steps

**Issue: Scope Creep**
- **Solution:** Ruthlessly prioritize MVP features, cut bonus features if behind schedule
- **Reference:** Check docs/planning/TIMELINE.md checkpoints to assess if on track

**Issue: Poor Demo Video**
- **Solution:** Write script, practice delivery, record early (Day 12-13)
- **Avoid:** Last-minute rush, poor audio quality, too long (>5 min)

**Issue: Incomplete Features**
- **Solution:** Follow "100% working standard" - complete one feature fully before moving to next
- **Avoid:** Half-implemented features scattered across codebase

## Key Files and Locations

### Documentation Files (Read These First!)

- **README.md** - Project overview, setup instructions, tech stack (start here)
- **docs/planning/hackathon-analysis.md** - Comprehensive strategy, competition analysis, winning approach (critical context)
- **docs/planning/PRD.md** - Product Requirements Document (Epic → Story → Task hierarchy)
- **docs/planning/EXECUTION.md** - Implementation plan tracking progress against PRD
- **docs/planning/TRACK-REQUIREMENTS.md** - Detailed feature checklist (track progress during implementation)
- **docs/planning/TIMELINE.md** - Day-by-day roadmap with milestones (follow daily)
- **docs/resources/QUICK-START-GUIDE.md** - Quick reference summary

### Configuration Files (When Implemented)

- **src/contracts/Anchor.toml** - Anchor project configuration, program IDs
- **src/contracts/Cargo.toml** - Rust dependencies for smart contracts
- **src/frontend/package.json** - Frontend dependencies and scripts
- **src/frontend/next.config.js** - Next.js configuration
- **src/frontend/tailwind.config.js** - Tailwind CSS configuration
- **src/frontend/.env.local** - Environment variables (not committed to git)

### Entry Points (When Implemented)

- **src/contracts/programs/nft_coupon/src/lib.rs** - Main smart contract entry point
- **src/frontend/app/layout.tsx** - Root layout with providers (wallet, theme)
- **src/frontend/app/page.tsx** - Homepage/landing page
- **src/frontend/app/api/** - API routes directory

## Notes for Future Claude Instances

### When Asked to Implement Features

1. **Check current phase:** Reference docs/planning/TIMELINE.md to see if this feature aligns with current day's goals
2. **Check requirements:** Reference docs/planning/TRACK-REQUIREMENTS.md to understand feature scope
3. **Follow architecture:** Stick to planned tech stack and design decisions
4. **Test thoroughly:** Ensure feature works 100% before marking complete
5. **Update docs:** Update docs/planning/TRACK-REQUIREMENTS.md and docs/planning/TIMELINE.md as features are completed

### When Encountering Blockers

1. **Document blocker:** Add to "Notes & Decisions Log" in docs/planning/TRACK-REQUIREMENTS.md
2. **Assess impact:** Does this affect timeline? Can we work around it?
3. **Propose solution:** Offer alternative approaches, reference documentation
4. **Escalate if needed:** Suggest reaching out to hackathon support (Telegram: @moonsettler)

### Project Success Criteria

**Minimum Viable Submission (3rd Place):**
- All 4 core features working (NFT, dashboard, marketplace, redemption)
- Basic UI (mobile-responsive)
- Demo video + GitHub + documentation

**Competitive Submission (2nd Place):**
- MVP + Web3 abstraction (email login)
- 1 bonus feature (social OR API integration)
- Polished UX
- Good demo video

**Winning Submission (1st Place):**
- Competitive features + real API integration
- Social/viral features
- Exceptional UX (Web3 invisible)
- Merchant analytics
- Professional demo video

**Target:** Competitive minimum, Winning if time permits

### Strategic Reminders

- **Focus on UX (25% of score)** - This is the biggest differentiator
- **Integrate real APIs** - Shows feasibility and scalability
- **Web3 abstraction is critical** - Hide crypto jargon, use email login
- **Mobile-first design** - 90% of deal discovery happens on mobile
- **Submit 24-48h early** - Buffer for unexpected issues
- **Tell a story in demo video** - First impression matters most

---

**Created:** October 17, 2025
**Last Updated:** October 18, 2025 (Day 6 Evening - Epic 10 Complete, 100% Feature Complete, Ready for Epic 11)
**Next Review:** Epic 11 - Submission Preparation (Deploy, Demo Video, Submit)

Bismillah! May Allah grant barakah and ease to all who work on this project. Tawfeeq min Allah!
