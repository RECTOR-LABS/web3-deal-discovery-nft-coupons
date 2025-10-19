# Web3 Deal Discovery & Loyalty Platform with NFT Coupons

> Building the next evolution of Groupon - user-owned, borderless, and Web3-powered.

**Hackathon:** Cypherpunk - MonkeDAO Track
**Sponsor:** MonkeDAO
**Platform:** Superteam Earn
**Prize Pool:** $6,500 USDC + Gen3 Monke NFTs
**Submission Deadline:** ~October 30, 2025

---

## 📋 Project Overview

This project reimagines deal discovery platforms like Groupon using Web3 principles. Every promotion is a collectible, tradable NFT that grants real-world savings - from flights to shopping experiences. Users own their discounts, merchants control issuance, and everyone benefits from a transparent, liquid deal economy.

### The Problem
Traditional discount platforms (like Groupon):
- ❌ Centralized control (platform owns data)
- ❌ Non-transferable coupons (locked to buyer)
- ❌ Opaque redemption tracking
- ❌ No secondary market for unused deals
- ❌ Merchant lock-in to platform

### Our Solution
Web3-powered deal marketplace where:
- ✅ Promotions are verifiable NFTs
- ✅ Redemption is tracked on-chain
- ✅ Ownership is transferable (trade, gift, resell)
- ✅ Merchants retain control of issuance & limits
- ✅ Users discover, collect, and share deals globally

---

## 🎯 Core Features

### 1. NFT Promotions / Coupons
- Each deal is a transferable NFT with rich metadata
- Includes: discount %, expiry, merchant ID, redemption rules
- Built on Solana using Metaplex Token Metadata standards

### 2. Merchant Dashboard
- User-friendly interface to create promotions
- Automatic NFT minting from form inputs
- Analytics: views, conversions, redemption tracking
- No crypto knowledge required

### 3. User Marketplace
- Browse and search available deals
- Filter by category, discount, expiry
- Purchase NFT coupons (claim deals)
- Re-list owned coupons for resale
- "My Coupons" wallet view

### 4. Redemption Verification Flow
- QR code generation with user signature
- Merchant scanning interface
- Off-chain verification + on-chain attestation
- Single-use enforcement (NFT burn on redemption)

### 5. Deal Aggregator Feed *(Differentiation)*
- Integration with external APIs (Skyscanner, Booking.com, etc.)
- Live deals from real-world sources
- Critical mass of offers from day one

### 6. Social Discovery Layer *(Differentiation)*
- Rate, review, and comment on deals
- Upvote/downvote functionality (Reddit-style)
- Share-to-earn referral system
- "Deal of the Day" community voting

### 7. Web3 Abstraction *(Competitive Advantage)*
- Email/social login via Privy/Dynamic
- Embedded wallets (no crypto friction)
- Fiat on-ramp (credit card → auto-convert to SOL)
- Consumer-friendly terminology (no "NFT", "mint", "wallet")

---

## 🏗️ Tech Stack

### Blockchain
- **Network:** Solana
- **Framework:** Anchor (Rust)
- **Token Standard:** Metaplex Token Metadata
- **Wallets:** Solana Wallet Adapter (Phantom, Solflare, Backpack)

### Backend
- **Framework:** Next.js 15+ (API routes + SSR)
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Privy (Web3 + email/social login)
- **Storage:** Arweave (permanent) + Supabase Storage (fallback)

### Frontend
- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS v4
- **State Management:** React Context
- **UI Library:** Lucide React icons

### APIs & Integrations
- **Payment:** MoonPay Commerce (Helio) - USDC on Solana
- **Deals:** RapidAPI (Get Promo Codes API - 1M+ coupons)
- **QR Codes:** qrcode.react + html5-qrcode
- **Analytics:** Vercel Analytics + Speed Insights
- **Monitoring:** Sentry (error tracking)
- **Geo Discovery:** React-Leaflet (interactive maps)

### Security & DevOps
- **Security:** CORS, Rate Limiting, Security Headers, Health Checks
- **Tools:** Jest/RTL (27 tests), ESLint, Husky, npm
- **DevOps:** Docker, Vercel, Bundle Analyzer
- **Git Hooks:** Husky + lint-staged (pre-commit checks)

### Deployment
- **Frontend:** Vercel
- **Backend:** Vercel serverless functions
- **Blockchain:** Solana Devnet (testing) → Mainnet-beta (production)
- **Database:** Supabase (us-east-1)

---

## 📂 Project Structure

```
web3-deal-discovery-nft-coupons/
├── README.md                        # This file
├── hackathon-original.md            # Original hackathon requirements
├── hackathon-analysis.md            # Comprehensive strategy & analysis
├── TRACK-REQUIREMENTS.md            # Feature checklist
├── TIMELINE.md                      # Milestones & deadlines
├── resources/                       # Related documentation
│   ├── official-docs/               # Solana, Metaplex docs
│   ├── starter-kits/                # Boilerplates and templates
│   └── references/                  # API docs, design inspiration
└── src/                             # Implementation workspace
    ├── contracts/                   # Anchor smart contracts
    │   ├── programs/                # Solana programs
    │   ├── tests/                   # Contract tests
    │   └── migrations/              # Deployment scripts
    ├── frontend/                    # Next.js application
    │   ├── app/                     # Next.js 14 app router
    │   ├── components/              # React components
    │   ├── lib/                     # Utilities and helpers
    │   ├── styles/                  # Tailwind CSS
    │   └── public/                  # Static assets
    └── README.md                    # Development setup instructions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/bun
- Rust and Cargo (for Anchor)
- Solana CLI
- Anchor CLI
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd web3-deal-discovery-nft-coupons
   ```

2. **Install Solana CLI**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   ```

3. **Install Anchor**
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install latest
   avm use latest
   ```

4. **Set up Solana wallet**
   ```bash
   solana-keygen new
   solana config set --url devnet
   solana airdrop 2
   ```

5. **Install project dependencies**
   ```bash
   # Smart contracts
   cd src/contracts
   anchor build
   anchor deploy

   # Frontend
   cd ../frontend
   npm install  # or: bun install
   ```

6. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys and configuration
   ```

7. **Run development server**
   ```bash
   npm run dev  # or: bun dev
   ```

8. **Open browser**
   - Navigate to http://localhost:3000

---

## 🧪 Development

### Running Smart Contracts
```bash
cd src/contracts
anchor build
anchor test
anchor deploy
```

### Running Frontend
```bash
cd src/frontend
npm run dev              # Development server
npm run build            # Production build
npm run build:analyze    # Build with bundle analyzer
npm run lint             # Linting
npm run typecheck        # TypeScript check
npm run test             # Run tests (27 passing)
npm run test:coverage    # Test coverage report
npm run prepare          # Initialize Husky git hooks
```

### Running Tests
```bash
# Smart contract tests
cd src/contracts
anchor test

# Frontend tests (if implemented)
cd src/frontend
npm test
```

---

## 📚 Documentation

- **[hackathon-original.md](./hackathon-original.md)** - Original hackathon requirements (backup reference)
- **[hackathon-analysis.md](./hackathon-analysis.md)** - Comprehensive strategy, tech stack decisions, and winning approach
- **[TRACK-REQUIREMENTS.md](./TRACK-REQUIREMENTS.md)** - Detailed feature checklist with completion tracking
- **[TIMELINE.md](./TIMELINE.md)** - Day-by-day development milestones and deadlines

### External Resources
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Metaplex Token Metadata](https://docs.metaplex.com/programs/token-metadata/)
- [Solana Cookbook](https://solanacookbook.com/)

---

## 🎯 Development Roadmap

### Phase 1: Foundation (Days 1-3)
- ✅ Environment setup (Solana, Anchor, Next.js)
- ✅ Smart contract architecture
- ✅ NFT coupon program implementation
- ✅ Wallet integration
- ✅ Database setup

### Phase 2: Core Features (Days 4-8)
- [ ] Merchant dashboard (create deals, analytics)
- [ ] User marketplace (browse, purchase, re-list)
- [ ] Redemption verification flow (QR code + on-chain)
- [ ] End-to-end testing

### Phase 3: Differentiation (Days 9-11)
- [ ] Web3 abstraction (email login, embedded wallets)
- [ ] Deal aggregator (API integration)
- [ ] Social features (ratings, comments, sharing)
- [ ] Bonus feature (reputation system, geo-discovery, or group deals)

### Phase 4: Submission (Days 12-14)
- [ ] Production deployment (Vercel + Solana)
- [ ] Demo video (3-5 minutes)
- [ ] Documentation and write-up
- [ ] GitHub repo polish
- [ ] Superteam Earn submission

---

## 🏆 Judging Criteria

The hackathon will judge submissions based on:

1. **Innovation & Creativity (25%)** - Novel use of Web3, unique features
2. **Technical Implementation (25%)** - Code quality, smart contract robustness
3. **User Experience (25%)** - Ease of use, Web3 abstraction, intuitive design
4. **Feasibility & Scalability (15%)** - Real-world viability, growth potential
5. **Completeness (10%)** - Addressed requirements, feature coverage

**Our Strategy:** Focus heavily on UX and Technical Implementation (50% combined) as these are the biggest differentiators.

---

## 🎁 Prize Structure

- **1st Place:** $5,000 USDC + up to 3 12-month Locked Gen3 Monkes
- **2nd Place:** $1,000 USDC + 1 12-month Locked Gen3 Monke
- **3rd Place:** $500 USDC + 1 12-month Locked Gen3 Monke

---

## 🤝 Contributing

This is a hackathon project with a tight timeline. If you're part of the team:

1. **Follow the timeline** - Check TIMELINE.md for daily milestones
2. **Update checklists** - Mark completed items in TRACK-REQUIREMENTS.md
3. **Communicate blockers** - Use daily standup template in TIMELINE.md
4. **Code quality** - Write clean, documented code (we're judged on implementation!)
5. **Test thoroughly** - All features must work 100% for submission

---

## 📞 Contact

**Hackathon Support:** [Telegram - @moonsettler](https://t.me/moonsettler)
**Hackathon Page:** https://earn.superteam.fun/listing/build-a-web3-deal-discovery-and-loyalty-platform-with-nft-coupons

---

## 📜 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- **MonkeDAO** - For sponsoring this innovative hackathon track
- **Colosseum** - For organizing the Cypherpunk Hackathon
- **Superteam** - For the platform and community support
- **Solana Foundation** - For the incredible blockchain infrastructure
- **Metaplex** - For the NFT standards and tooling

---

## 🚦 Project Status

**Current Phase:** Epic 11 - Submission Preparation
**Completion:** 100% (All Epics 1-10 ✅)
**Production Readiness:** 95+/100 (22/22 issues fixed)
**Test Coverage:** 27/27 tests passing
**Submission Deadline:** ~October 30, 2025

---

**Bismillah!** May Allah grant barakah in this project and ease in execution. Tawfeeq min Allah! 🚀

---

*Generated with strategic analysis and comprehensive planning. Ready to build something groundbreaking in the Web3 deals space!*
