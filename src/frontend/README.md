# DealCoupon - Web3 Deal Discovery & NFT Loyalty Platform

> **"Groupon meets DeFi"** - Secondary marketplace for NFT coupons on Solana

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-Devnet-purple)](https://solana.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)

## 📋 Overview

DealCoupon is a **Web3-powered discount marketplace** where merchants mint NFT coupons and users collect, trade, and redeem them. Built for the **MonkeDAO track** at the **Cypherpunk Hackathon** (Superteam Earn).

### Key Features

- ✅ **NFT-based coupons** (mint, transfer, redeem on Solana)
- ✅ **Secondary resale marketplace** with 2.5% platform fee
- ✅ **Merchant dashboard** for deal creation and analytics
- ✅ **User marketplace** with geolocation discovery
- ✅ **Staking & cashback** (12% APY, tier-based rewards)
- ✅ **Loyalty system** (4 tiers, 8 NFT badges)
- ✅ **Social features** (reviews, voting, referrals)
- ✅ **API documentation** (25 REST endpoints, OpenAPI 3.0)

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x
- npm 10.x
- Solana wallet (Phantom or Solflare)
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/web3-deal-discovery-nft-coupons.git
cd web3-deal-discovery-nft-coupons/src/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Required variables in `.env.local`:

```bash
# Solana & Smart Contracts
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_NFT_PROGRAM_ID=RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# External APIs (optional)
RAPIDAPI_KEY=your_rapidapi_key
```

See `.env.example` for the complete list.

## 🏗️ Architecture

### Tech Stack

**Blockchain:**
- Solana (Devnet)
- Anchor 0.32.1
- Metaplex Token Metadata v5.0.0

**Backend:**
- Next.js 15.5.6 (App Router)
- Supabase PostgreSQL
- 25 REST API endpoints

**Frontend:**
- React 18+
- TypeScript (strict mode)
- Tailwind CSS v4
- Framer Motion
- Solana Wallet Adapter

**Storage:**
- Arweave (permanent NFT metadata)
- Supabase Storage (fallback)

**Monitoring:**
- Sentry (error tracking)
- Vercel Analytics
- Pino (structured logging)

### Project Structure

```
src/frontend/
├── app/                    # Next.js 15 App Router
│   ├── (merchant)/         # Merchant dashboard routes
│   ├── (user)/             # User marketplace routes
│   ├── api/                # 25 REST API endpoints
│   ├── api-docs/           # Interactive API documentation
│   └── pitch-deck/         # Hackathon pitch deck
├── components/             # React components
│   ├── merchant/           # Merchant-specific UI
│   ├── user/               # User-specific UI
│   └── shared/             # Shared components
├── lib/                    # Utilities & business logic
│   ├── database/           # Supabase types & queries
│   ├── solana/             # Blockchain interactions
│   ├── loyalty/            # Tier & badge system
│   ├── geolocation/        # Location-based discovery
│   ├── logger.ts           # Structured logging (Pino)
│   └── metrics.ts          # Custom metrics (Sentry)
├── public/                 # Static assets
│   └── openapi.yaml        # API specification
└── migrations/             # Database migrations
```

## 📱 Features

### For Users

1. **Browse Deals**
   - Search & filter by category
   - Geolocation discovery (1-50 miles)
   - Interactive map view
   - External deal aggregation (RapidAPI)

2. **My Coupons**
   - View owned NFT coupons
   - Generate QR codes for redemption
   - List coupons for resale
   - Filter by status (active/expired/redeemed)

3. **Resale Marketplace** ← NEW
   - Buy NFT coupons from other users
   - List unused coupons with custom price
   - 2.5% platform fee on sales
   - Real-time fee calculator

4. **Staking & Rewards**
   - Stake SOL for 12% APY
   - Tier-based cashback (5-15%)
   - Auto-distribution of rewards

5. **Loyalty Tiers**
   - 4 tiers: Bronze → Silver → Gold → Diamond
   - 8 NFT badge types
   - Tier-exclusive deals

### For Merchants

1. **Deal Creation**
   - Upload images (Arweave/Supabase)
   - Set discount %, expiry, quantity
   - Mint NFT coupons automatically

2. **Analytics Dashboard**
   - Total deals & redemptions
   - Revenue tracking
   - Customer analytics

3. **QR Scanner**
   - Scan user QR codes
   - Verify signatures off-chain
   - Burn NFT on-chain

4. **Settings**
   - Update business profile
   - Manage contact info
   - Configure location (geolocation)

## 🔌 API Documentation

### REST API (25 Endpoints)

Interactive documentation available at `/api-docs`.

**Download OpenAPI Spec:** [openapi.yaml](/openapi.yaml)

**Key Endpoints:**

```bash
# Deals
GET  /api/deals/aggregated         # Fetch external deals (RapidAPI)

# Resale Marketplace
POST /api/resale/list               # List coupon for resale
GET  /api/resale/listings           # Fetch resale listings
POST /api/resale/purchase           # Purchase resale listing

# Merchant
POST /api/merchant/register         # Register merchant
GET  /api/merchant/profile          # Get merchant profile
PUT  /api/merchant/profile          # Update profile

# Staking
POST /api/staking/stake             # Stake SOL
POST /api/staking/unstake           # Unstake SOL
POST /api/staking/claim-rewards     # Claim rewards

# Social
POST /api/reviews                   # Submit review
POST /api/votes                     # Vote on deal
POST /api/referrals                 # Track referral

# User
GET  /api/user/tier                 # Get loyalty tier
GET  /api/user/badges               # Get NFT badges

# Health
GET  /api/health                    # Health check
```

### Authentication

Most endpoints require **Solana wallet signature** authentication.

**Example (JavaScript):**

```javascript
const response = await fetch('https://your-domain.com/api/resale/listings', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Wallet-Signature': walletSignature,
  },
});
```

## 🧪 Testing

### Unit Tests

```bash
npm test                 # Run Jest tests
npm run test:coverage    # Coverage report
```

### E2E Tests

```bash
npm run test:e2e         # Playwright tests
```

### Manual Testing

- **User flows:** `docs/testing/MANUAL-TESTING-GUIDE-LOGGED-IN.md`
- **Merchant flows:** `docs/testing/MERCHANT-TESTING-GUIDE.md`

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

### Environment Variables

Configure in Vercel dashboard:
- Database credentials
- API keys
- Solana RPC endpoint

See `docs/deployment/VERCEL-DEPLOYMENT-GUIDE.md` for details.

### Docker

```bash
# Build image
docker build -t dealcoupon-frontend .

# Run container
docker run -p 3000:3000 dealcoupon-frontend
```

## 📊 Database Schema

**11 Tables:**
- `merchants` - Business profiles
- `deals` - NFT coupon metadata
- `events` - Blockchain event log
- `users` - User profiles
- `reviews` - Deal reviews
- `votes` - Upvotes/downvotes
- `resale_listings` - Secondary marketplace
- `referrals` - Referral tracking
- `staking` - Staking positions
- `cashback_transactions` - Cashback history
- `badges` - Loyalty NFT badges

**Views:**
- `merchants_with_location` - Geo-enabled merchant data

**Functions:**
- `calculate_distance_miles()` - Geolocation distance

See `migrations/` for SQL schema.

## 🎨 Design System

**MonkeDAO Branding:**
- Primary: `#0d2a13` (forest green)
- Accent: `#00ff4d` (neon green)
- Cream: `#f2eecb`

**Fonts:**
- Inter (primary)
- Poppins (headings)

**UI Library:**
- Tailwind CSS v4
- lucide-react icons
- Framer Motion animations

## 📈 Monitoring & Observability

**Error Tracking:**
- Sentry integration
- Custom metrics (NFT lifecycle, performance)
- Request tracing (X-Request-ID)

**Analytics:**
- Vercel Analytics
- Speed Insights
- Custom dashboards

**Logging:**
- Pino structured logging
- Module-specific loggers
- JSON output with timestamps

## 🔐 Security

- ✅ CORS headers
- ✅ Rate limiting (3 tiers)
- ✅ Security headers (CSP, X-Frame-Options)
- ✅ Input validation
- ✅ Row-level security (Supabase)
- ✅ Secret management (.env, gitignored)

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create feature branch
2. Implement changes
3. Run tests (`npm test`)
4. Lint code (`npm run lint`)
5. Type check (`npm run typecheck`)
6. Build (`npm run build`)
7. Open pull request

### Pre-commit Hooks

Husky + lint-staged configured:

```bash
npm run prepare         # Initialize Husky
```

## 📄 License

MIT License - see [LICENSE](../../LICENSE)

## 🏆 Hackathon Submission

**Track:** MonkeDAO (Cypherpunk Hackathon)
**Prize:** $6,500 USDC + Gen3 Monke NFTs
**Status:** 100% Feature Complete ✅

**Pitch Deck:** [/pitch-deck](http://localhost:3000/pitch-deck)

## 🔗 Links

- **Live Demo:** [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)
- **API Docs:** [/api-docs](http://localhost:3000/api-docs)
- **GitHub:** [github.com/your-org/dealcoupon](https://github.com/your-org/dealcoupon)
- **Hackathon:** [Superteam Earn](https://earn.superteam.fun)

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-org/dealcoupon/issues)
- **Telegram:** [@RZ1989sol](https://t.me/RZ1989sol)
- **Email:** support@dealcoupon.com

---

**Built with ❤️ for the Solana ecosystem**

*Bismillah! Alhamdulillah! Tawfeeq min Allah.*
