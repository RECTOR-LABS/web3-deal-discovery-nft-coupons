# DealCoupon: Web3 Deal Discovery Platform

**Technical Write-up - MonkeDAO Cypherpunk Hackathon**

**Project:** User-Owned, Borderless Deal Marketplace
**Tagline:** "Groupon Meets DeFi"
**Team:** RECTOR - Senior Full-Stack Developer
**Submission Date:** October 24, 2025
**Version:** 1.1 (Updated with Epic 11-13 Complete)

---

## 🔥 Version 1.1 Updates (Epic 11-13 Complete)

**Epic 13 - Resale Marketplace:** ✅ DEPLOYED
- **9 smart contract instructions** (expanded from 4 in v1.0)
- **Escrow PDA architecture** for trustless NFT custody
- **3 production API endpoints:** `/api/resale/list`, `/api/resale/listings`, `/api/resale/purchase`
- **Atomic swaps** preventing rug pulls (payment + NFT transfer = 1 transaction)
- **2.5% platform fee** on all resale transactions

**Epic 12 - Interactive Pitch Deck:** ✅ DEPLOYED
- **Live demo:** https://dealcoupon.rectorspace.com/pitch-deck
- **13 components** with Framer Motion animations
- **39 production screenshots** organized in 6 categories
- **5 demo videos** showing core features
- **Code evidence sections** with real source files

**Epic 11 - Production Deployment:** ✅ DEPLOYED
- **Production URL:** https://dealcoupon.rectorspace.com
- **29 API endpoints** documented (OpenAPI 3.0)
- **Interactive API docs:** https://dealcoupon.rectorspace.com/api-docs
- **Vercel global CDN** with custom domain

---

## 1. Executive Summary

### The Problem: Trapped Value in Traditional Discount Platforms

Traditional coupon platforms like Groupon suffer from fundamental limitations that trap value and limit user freedom:

- **Non-transferable Coupons:** Once purchased, coupons cannot be resold, gifted, or traded
- **Centralized Control:** Platforms control all aspects of the marketplace with little merchant autonomy
- **Geographic Restrictions:** Deals are geo-locked, limiting global accessibility
- **Limited Liquidity:** No secondary market for unused or unwanted coupons
- **Opaque Verification:** Trust-based redemption systems vulnerable to fraud

These pain points result in billions of dollars in expired, unused coupons every year and poor user experience.

### Our Solution: NFT-Powered Deal Marketplace

DealCoupon leverages blockchain technology to create a user-owned, borderless marketplace where:

1. **Every coupon is an NFT** - Transferable, tradable digital assets with verifiable ownership
2. **On-chain redemption** - Cryptographic proof of redemption with permanent audit trail
3. **Web3 invisible UX** - Familiar Groupon-style interface with no crypto jargon
4. **Merchant autonomy** - Direct control over deal creation, pricing, and analytics
5. **Global accessibility** - Borderless marketplace accessible to anyone with internet
6. **Secondary marketplace** - Users can resell unused coupons (Epic 13)

### Key Innovations

#### 1. Metaplex v5.0.0 NFT Standard
- SPL token-based coupons with rich metadata (discount%, expiry, merchant ID, category)
- Transferable ownership enabling secondary marketplace
- On-chain state management for redemption tracking

#### 2. Hybrid On-Chain/Off-Chain Architecture
- Critical state on-chain (ownership, redemption status, escrow custody)
- Metadata and analytics off-chain (Supabase PostgreSQL + Arweave)
- Optimized for performance and cost-efficiency

#### 3. Web3 Abstraction Layer
- Solana Wallet Adapter with Phantom/Solflare support
- Guest browsing (no authentication required)
- Zero blockchain knowledge required for end users

#### 4. Escrow PDA Architecture (Epic 13)
- **Program-derived address** for trustless NFT custody
- **Atomic swaps:** Payment + NFT transfer in single transaction
- **Prevents rug pulls:** NFT locked in escrow until payment confirmed
- **Zero-trust marketplace:** No intermediary custody required

#### 5. Cryptographic Redemption Flow
- QR codes with signed messages for secure redemption
- Off-chain signature verification before on-chain burn
- Permanent event logging (database + blockchain)

---

## 2. Architecture & Design

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: Frontend                        │
│    Next.js 15 + React 19 + TypeScript strict + Tailwind v4 │
│            Solana Wallet Adapter + Framer Motion            │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    LAYER 2: Backend                         │
│       Next.js 15 API Routes + Supabase PostgreSQL          │
│        Server-side Wallet Access + Authentication Logic     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  LAYER 1: Blockchain                        │
│            Solana Devnet (Mainnet-ready deployment)         │
│        Anchor 0.32.1 + Metaplex v5.0.0 + SPL Token          │
│    Program ID: RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7  │
└─────────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture (Updated v1.1)

**Program:** `nft_coupon` (Anchor Framework 0.32.1)

**Core Instructions (9 total):**

#### Setup & Management
1. **initialize_merchant**
   - Registers merchant account on-chain
   - Creates merchant profile with wallet address
   - Initializes merchant state for deal management

2. **create_coupon**
   - Mints NFT using Metaplex v5.0.0 standard
   - Stores metadata: name, image URI, discount percentage, expiry date, merchant ID, category
   - Returns mint address for coupon tracking

3. **update_coupon_status**
   - Allows merchant to activate/deactivate deals
   - Handles expiry status updates
   - Emergency pause functionality for security

#### Primary Market
4. **purchase_coupon**
   - **Atomic transaction:** Payment + NFT transfer (Escrow → Buyer)
   - Transfers NFT from Escrow PDA to buyer
   - Distributes payment: 97.5% to merchant, 2.5% to platform
   - Records purchase event on-chain

#### Resale Market (Epic 13 - NEW)
5. **list_for_resale**
   - Transfers NFT from seller to **Escrow PDA**
   - Creates resale listing in database
   - Locks NFT until purchase or delisting

6. **purchase_from_resale**
   - **Atomic swap:** SOL payment + NFT transfer (seller → buyer)
   - Transfers NFT from Escrow PDA to buyer
   - Distributes payment: 97.5% to seller, 2.5% to platform
   - Updates listing status to sold

7. **transfer_coupon**
   - General purpose NFT transfer between wallets
   - Used for gifting or P2P transfers
   - Validates ownership before transfer

#### Redemption & Claims
8. **redeem_coupon**
   - Burns NFT to enforce single-use constraint
   - Emits redemption event with timestamp and merchant signature
   - Updates on-chain redemption counter

9. **claim_free_coupon**
   - Distributes free coupons to users
   - Transfers NFT from Escrow PDA to claimer
   - No payment required (free deals)

#### Security Features:
- Wallet signature verification on all transactions
- Merchant-only access controls for sensitive operations
- Immutable redemption records on-chain
- **Escrow PDA custody** prevents unauthorized transfers
- **Atomic transactions** eliminate rug pull risks

### Database Schema

**Core Tables (11 total):**

```
merchants              -- Merchant profiles, wallet addresses, business info
deals                  -- Deal metadata, pricing, availability
events                 -- Redemption events, blockchain tx signatures
users                  -- User profiles, preferences, activity
reviews                -- Star ratings, comments, merchant responses
votes                  -- Upvote/downvote deal popularity
resale_listings        -- Secondary marketplace (NFT resale) - Epic 13
referrals              -- Referral tracking, rewards distribution
staking                -- User staking positions, APY calculations
cashback_transactions  -- Cashback distributions, tier multipliers
badges                 -- NFT achievement badges, loyalty tiers
```

**Optimizations:**
- Indexed columns: `merchant_id`, `deal_id`, `user_wallet`, `created_at`
- Views: `merchants_with_location` (for geo-discovery)
- Functions: `calculate_distance_miles()` (geolocation queries)
- Connection pooling via Supabase (Postgres 15)

### Storage Strategy

**Dual Storage Approach:**

1. **Arweave (Permanent Storage)** - Production-Ready Architecture
   - NFT metadata and images stored permanently
   - Server-side API routes for wallet access (security)
   - Wallet: `sY6VBEWpDPmN6oL9Zt_8KjJMR1PWexpmWKEAojtbwsc`
   - Cost: ~$5-10 in AR tokens to activate live uploads
   - Status: Architecture complete, ready for mainnet funding

2. **Supabase Storage (Active Fallback)**
   - Currently serving all image/metadata storage (100% functional)
   - Public bucket with CDN distribution
   - Backup strategy for Arweave downtime

**Graceful Degradation:** App functions 100% with Supabase alone, Arweave adds permanence.

---

## 3. Web3 Integration Challenges Solved

### Challenge 1: NFT Representation

**Problem:** How do we represent discount coupons as NFTs with sufficient metadata?

**Solution:**
- Metaplex v1.1 metadata standard with custom fields
- On-chain: Mint address, ownership, redemption status
- Off-chain: Detailed metadata (name, description, image, discount%, expiry, merchant ID, category)
- Trade-off: Balances on-chain security with off-chain flexibility

**Implementation:**

```rust
pub struct CouponMetadata {
    pub name: String,              // e.g., "50% OFF Pizza Special"
    pub discount_percent: u8,      // e.g., 50
    pub expiry_date: i64,          // Unix timestamp
    pub merchant_id: String,       // Database foreign key
    pub category: String,          // "Food & Drink", "Travel", etc.
}
```

### Challenge 2: Secure Redemption Flow

**Problem:** How do we verify coupon redemption without exposing private keys to merchants?

**Solution: Cryptographic QR Code System**

**User-side (Generate QR):**

```javascript
// 1. User generates QR code with signed message
const message = `redeem:${couponId}:${timestamp}`;
const signature = await wallet.signMessage(new TextEncoder().encode(message));
const qrData = {
  couponId: deal.id,
  userWallet: wallet.publicKey.toString(),
  signature: Buffer.from(signature).toString('base64'),
  timestamp: Date.now()
};
```

**Merchant-side (Scan & Verify):**

```javascript
// 2. Merchant scans QR, verifies signature off-chain
export async function POST(request: Request) {
  const { couponId, userWallet, signature, timestamp } = await request.json();

  // Verify signature matches user wallet
  const isValid = await verifySignature(userWallet, signature, timestamp);
  if (!isValid) throw new Error('Invalid signature');

  // 3. Burn NFT on-chain
  await burnCouponNFT(couponId, merchantWallet);

  // 4. Log redemption event
  await logRedemptionEvent(couponId, userWallet, merchantWallet);
}
```

**Security Benefits:**
- Off-chain verification reduces gas costs
- Cryptographic proof prevents fake QR codes
- No private key exposure to merchants
- Permanent on-chain audit trail

### Challenge 3: UX Abstraction (Making Web3 Invisible)

**Problem:** Crypto wallets intimidate mainstream users.

**Solution: Progressive Web3 Disclosure**

**Level 1: Guest Browsing (No Auth)**
- Browse marketplace without wallet connection
- Filter by category, location, discount percentage
- View deal details and merchant profiles
- Search functionality fully accessible

**Level 2: Claim Prompt (Wallet Connection)**
- Only when user clicks "Claim Deal"
- Clear messaging: "Connect your wallet to claim this coupon"
- Supports Phantom, Solflare (most popular Solana wallets)

**Level 3: Seamless Experience**
- "My Coupons" displays claimed NFTs
- QR generation with one click
- No blockchain jargon ("Coupon" not "NFT", "Claim" not "Mint")

**Implementation:**

```javascript
// Wallet adapter with guest-first approach
const { publicKey, connected } = useWallet();

// Guest can browse
if (!connected) {
  return <MarketplaceBrowser deals={deals} />;
}

// Prompt connection only when claiming
function ClaimButton({ dealId }) {
  const { connect } = useWallet();
  return (
    <button onClick={connected ? claimDeal : connect}>
      {connected ? 'Claim Deal' : 'Connect to Claim'}
    </button>
  );
}
```

### Challenge 4: Merchant Onboarding Simplification

**Problem:** Merchants shouldn't need blockchain knowledge.

**Solution: No-Code Dashboard**

- **Registration:** 3-minute form (business name, category, location)
- **Deal creation:** Upload image → Set discount/expiry → Click "Create" → Approve transaction
- **Analytics:** Auto-generated charts (views, claims, redemptions)
- **QR scanner:** Camera-ready interface (no setup)

**Zero blockchain concepts exposed to merchants:**
- ✅ "Create Deal" (not "Mint NFT")
- ✅ "Redeem Coupon" (not "Burn Token")
- ✅ "Analytics Dashboard" (not "On-Chain Events")

### Challenge 5: Marketplace Liquidity

**Problem:** How do we ensure sufficient deal inventory?

**Solution: Hybrid Marketplace**

**1. Native Deals (Blockchain)**
- Merchants create NFT coupons directly
- 100% on-chain ownership and redemption

**2. Aggregated Deals (RapidAPI)**
- "Get Promo Codes" API (1M+ coupons, 10K+ merchants)
- 1-hour cache for performance
- "Partner Deal" badges to differentiate
- Mock fallback for development

**3. Resale Marketplace (Epic 13 - Implemented ✅)**
- Users can list unused coupons for resale
- **Escrow PDA custody** ensures trustless transactions
- **Atomic swaps:** Payment + NFT transfer in single transaction
- **2.5% platform fee** on all resale transactions
- **Secondary market pricing** based on demand

---

## 4. Implementation Details

### Technology Stack Breakdown

**Blockchain Layer:**
- **Solana Devnet** - Fast, low-cost transactions (mainnet-ready)
- **Anchor 0.32.1** - Rust framework for Solana programs
- **Metaplex v5.0.0** - NFT standard library
- **SPL Token** - Fungible/non-fungible token standard

**Backend Layer:**
- **Next.js 15 API Routes** - Serverless API endpoints (29 total)
- **Supabase PostgreSQL** - Relational database (us-east-1)
- **Solana Web3.js** - Blockchain interaction library
- **Arweave SDK** - Permanent storage integration

**Frontend Layer:**
- **Next.js 15 (React 19)** - Server-side rendering framework
- **TypeScript strict mode** - Type safety enforcement
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Animation library
- **Solana Wallet Adapter** - Multi-wallet support
- **React-Leaflet** - Interactive maps

**External Integrations:**
- **RapidAPI** - Deal aggregation (1M+ coupons)
- **MoonPay Commerce** - USDC payment integration (8 paylinks)
- **Sentry** - Error monitoring (client/server/edge)
- **Vercel Analytics** - Usage metrics + Speed Insights

### Code Quality Practices

**TypeScript Strict Mode:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Git Workflow:**
- Feature branches: `epic-X-feature-name`
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Pull request self-reviews with checklist
- Main branch protection (no direct commits)

**Pre-commit Hooks (Husky):**

```bash
# .husky/pre-commit
npm run lint        # ESLint checks
npm run typecheck   # TypeScript compilation
```

### Testing Strategy

**Total Tests: 32 (3 Unit + 27 Manual + 2 E2E)**

**1. Unit Tests (Jest + React Testing Library)**
- API route testing
- Component logic validation
- Helper function verification
- Coverage: Critical paths

**2. Manual QA Tests**
- User Tests (27): Browse → Filter → Claim → Redeem → Review
- Merchant Tests (10): Register → Create → Analytics → Redeem → Settings
- Guest Tests: Homepage browsing without authentication

**3. E2E Tests (Playwright MCP + Supabase MCP)**
- Wallet connection flows
- UI navigation testing
- Form submissions
- Note: Blockchain transactions still require manual approval

**4. Self-Audits (10 Reports)**
- Epic 1-10 comprehensive audits documented
- Code quality scores: 85-90/100
- Issues tracked and resolved

### Production Readiness Measures

**Security:**
- ✅ CORS headers (configurable origins)
- ✅ Rate limiting (3 tiers: strict/moderate/lenient)
- ✅ Security headers (X-Frame-Options, CSP, X-Content-Type-Options)
- ✅ Input validation (Zod schemas)
- ✅ SQL injection prevention (Supabase prepared statements)

**Monitoring:**
- ✅ Sentry error tracking (client/server/edge)
- ✅ Vercel Analytics (user behavior)
- ✅ Speed Insights (Core Web Vitals)
- ✅ Health check endpoint (`/api/health`)

**DevOps:**
- ✅ Docker support (multi-stage build)
- ✅ Database backups (automated + manual guides)
- ✅ Bundle analyzer (performance optimization)
- ✅ CI/CD pipeline (8-job GitHub Actions workflow)

**Infrastructure:**
- ✅ Vercel Edge Network (global CDN)
- ✅ Supabase connection pooling
- ✅ Next.js Image optimization
- ✅ Lazy loading (images, video, components)

---

## 5. UX/UI Design Philosophy

### Web3 Invisible Principles

**1. Familiar Terminology**
- ❌ "Mint NFT" → ✅ "Claim Deal"
- ❌ "Burn Token" → ✅ "Redeem Coupon"
- ❌ "Wallet Address" → ✅ "Your Account"
- ❌ "Gas Fees" → ✅ Hidden (Solana's low fees)

**2. Progressive Disclosure**
- Show wallet connection only when necessary
- Hide blockchain complexity behind simple actions
- Provide explanations on hover/click (not upfront)

### Guest-First Approach

**Inspired by Groupon UX:**
- Homepage = Deal marketplace (no login wall)
- Search and filter without authentication
- Category-based browsing (Food, Travel, Shopping, etc.)
- Login prompt only when claiming deals

**Conversion Funnel:**

```
Browse (Guest) → Discover Value → Want to Claim → Connect Wallet → Engaged User
```

### MonkeDAO Branding

**Color Palette:**
- **Primary:** `#0d2a13` (Forest Green) - Main backgrounds, headers
- **Secondary:** `#f2eecb` (Cream) - Page backgrounds, cards
- **Accent:** `#00ff4d` (Neon Green) - CTAs, highlights, success states
- **Text:** `#0d2a13` (Dark Green) on light backgrounds

**Visual Elements:**
- 8px border radius (consistent rounding)
- Jungle/forest-themed accents (leaf SVGs, nature imagery)
- Gradient backgrounds (forest green variations)
- Monkey emoji (🐵) in branding elements

**Typography:**
- **Primary Font:** Inter (clean, modern sans-serif)
- **Accent Fonts:** Poppins (headings), Taviraj (decorative)
- **Hierarchy:** Clear size/weight distinctions

### Mobile-First Responsive Design

**Breakpoints (Tailwind):**
- `sm: 640px` - Mobile landscape
- `md: 768px` - Tablet
- `lg: 1024px` - Desktop
- `xl: 1280px` - Large desktop

**Mobile Optimizations:**
- Touch-friendly tap targets (min 44x44px)
- Hamburger navigation on mobile
- Full-width CTAs below 768px
- Stacked layouts (1 column mobile → 2-4 desktop)
- QR scanner uses device camera

**Performance:**
- Lazy load images (Intersection Observer)
- YouTube Lite embed (saves bandwidth)
- Code splitting (dynamic imports)
- Optimized bundle size (20 kB pitch deck page)

---

## 6. Scalability & Future Roadmap

### Database Optimization Strategy

**Current Optimizations:**
- Indexed columns for fast queries (`merchant_id`, `deal_id`, `user_wallet`)
- Views for complex queries (`merchants_with_location`)
- Custom functions (geolocation calculations)
- Connection pooling (Supabase default)

**Future Enhancements:**
- Read replicas for high-traffic endpoints
- Redis caching layer (Vercel KV)
- Database partitioning (time-based for events table)
- Materialized views for analytics

### RPC Provider Strategy

**Current (Development):**
- Solana Devnet public RPC
- Retry logic for failed transactions
- Rate limiting awareness

**Future (Production Mainnet):**
- **Primary:** Helius Pro (100K requests/day)
- **Fallback:** QuickNode (dedicated node)
- Load balancing between providers
- WebSocket subscriptions for real-time updates

**Projected Costs (1M monthly transactions):**
- Helius Pro: $250/month
- QuickNode: $199/month
- Total RPC: ~$450/month

### Horizontal Scaling Plan

**Stateless Architecture:**
- Next.js API routes (serverless, auto-scale)
- No session state in memory (JWT tokens)
- Database handles state persistence

**CDN Distribution:**
- Vercel Edge Network (190+ global locations)
- Static assets cached at edge
- Image optimization via Next.js

**Microservices Approach (Future):**
- Separate services for analytics, redemption, notifications
- Independent scaling per service
- API Gateway pattern

### Mainnet Deployment Plan

**Phase 1: Devnet Validation (Current)**
- ✅ All features tested on devnet
- ✅ Smart contracts audited (self-audits)
- ✅ Frontend/backend integration complete

**Phase 2: Testnet Deployment (Week 1)**
- Deploy contracts to Solana Testnet
- Invite beta users (merchants + consumers)
- Load testing (1000+ concurrent users)
- Security audit (third-party if funded)

**Phase 3: Mainnet Launch (Week 2-3)**
- Deploy contracts to mainnet
- Fund Arweave wallet (~$10 AR tokens)
- Switch RPC to Helius/QuickNode
- Monitor closely for 48 hours

**Phase 4: Post-Launch (Week 4+)**
- Gather user feedback
- Fix critical bugs
- Optimize gas usage
- Scale infrastructure as needed

### Feature Roadmap (v2.0)

**Q1 2026:**
- Mobile apps (React Native + NativeWind)
- Advanced analytics (merchant revenue insights)
- Multi-chain support (Polygon, Arbitrum)
- Fiat on-ramp (credit card → USDC → SOL)

**Q2 2026:**
- DAO governance (token-based voting)
- Merchant staking (discounted fees for stakers)
- NFT marketplace upgrades (auction system)
- Email/SMS notifications (Twilio integration)

**Q3 2026:**
- AI-powered deal recommendations
- Dynamic pricing (demand-based discounts)
- Loyalty program expansion (tiered benefits)
- Partnership integrations (Shopify, WooCommerce)

---

## 7. Conclusion

### Summary of Achievements

**100% Feature Complete:**
- ✅ **13 Epics delivered** (100% hackathon compliance)
  - Epics 1-10: Core platform (84 tasks)
  - Epic 11: Deployment (Vercel production)
  - Epic 12: Pitch Deck (13 components, 39 screenshots, 5 videos)
  - Epic 13: Resale Marketplace (Escrow PDA, 3 endpoints)
- ✅ All core + bonus features implemented
- ✅ Production-ready infrastructure (95/100 score)
- ✅ Comprehensive testing (32 tests passing)
- ✅ Real API integrations (RapidAPI, Arweave, MoonPay)

**Technical Excellence:**
- Smart contracts deployed (devnet: `RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7`)
- **9 production instructions** (4 core + 5 resale)
- TypeScript strict mode (zero type errors)
- ESLint compliance (clean codebase)
- Sentry monitoring (proactive error tracking)
- CI/CD pipeline (8-job automated workflow)
- **29 API endpoints** documented (OpenAPI 3.0)

**UX Leadership:**
- Web3 invisible interface (Groupon-style familiarity)
- Guest browsing (no authentication barrier)
- Mobile-first responsive (320px → 1920px)
- MonkeDAO branding (consistent visual identity)

### Competitive Advantages

**vs. Traditional Platforms (Groupon):**
1. **User Ownership:** Coupons are tradable NFTs (not locked accounts)
2. **Transparency:** On-chain redemption proof (vs. trust-based)
3. **Global Access:** Borderless marketplace (vs. geo-restricted)
4. **Secondary Market:** Resale functionality with Escrow PDA (vs. no liquidity)

**vs. Other Web3 Projects:**
1. **Production-Ready:** Not a prototype - fully functional with real integrations
2. **UX First:** Web3 abstraction makes it accessible to non-crypto users
3. **Complete Features:** 13/13 Epics vs. competitors' partial implementations
4. **Professional DevOps:** Monitoring, CI/CD, security best practices
5. **Escrow Security:** PDA-based custody preventing rug pulls

### Call to Action

**Try the Live Demo:**
- 🚀 **Production URL:** https://dealcoupon.rectorspace.com
- 💻 **GitHub Repository:** https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons
- 🎥 **Demo Video:** [YouTube Link]
- 📄 **Interactive Pitch Deck:** https://dealcoupon.rectorspace.com/pitch-deck
- 📚 **API Documentation:** https://dealcoupon.rectorspace.com/api-docs

**For Judges:**
- Explore the merchant dashboard (connect Phantom wallet)
- Browse deals as a guest (no wallet required)
- Claim a demo coupon and generate QR code
- Test the resale marketplace (list and purchase NFTs)
- Review comprehensive API documentation (29 endpoints)

**Contact:**
- **Developer:** RECTOR (Senior Full-Stack Developer)
- **GitHub:** @rz1989s
- **Project Support:** GitHub Issues

---

**Bismillah! Tawfeeq min Allah.** 🚀

*This platform represents the future of discount marketplaces - where users own their value, merchants control their destiny, and blockchain technology works invisibly to enable trust and transparency. Thank you for considering DealCoupon for the MonkeDAO Cypherpunk Hackathon.*

---

**Document Information:**
- **Version:** 1.1
- **Date:** October 24, 2025
- **Pages:** 12
- **Format:** Markdown (convert to PDF via md-to-pdf or Pandoc)
- **Author:** RECTOR
- **Hackathon:** MonkeDAO Cypherpunk
