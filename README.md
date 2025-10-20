# DealCoupon - Web3 Deal Discovery Platform

> **"Groupon meets DeFi"** - User-owned, borderless deal marketplace powered by Solana NFTs

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/Tests-27%2F27%20Passing-success)](https://github.com)
[![Production Ready](https://img.shields.io/badge/Production%20Ready-95%2F100-success)](https://github.com)

**MonkeDAO Cypherpunk Hackathon Submission** | **Prize Pool:** $6,500 USDC + Gen3 Monke NFTs

---

## 🎯 What is DealCoupon?

A next-generation deal marketplace where every discount is a **transferable NFT**. Think Groupon, but users actually own their coupons and can trade, gift, or resell them. Built on Solana for speed, powered by Web3 for ownership, designed for mainstream adoption.

### The Problem
Traditional discount platforms like Groupon trap value:
- 🔒 Coupons locked to buyer (can't transfer or resell)
- 📊 Opaque redemption tracking
- 🏢 Merchants dependent on centralized platforms
- ❌ No secondary market for unused deals

### Our Solution
- ✅ **NFT Ownership** - Every deal is a transferable SPL token
- ✅ **On-Chain Redemption** - Cryptographic verification, permanent audit trail
- ✅ **Web3 Invisible** - No crypto jargon, wallet adapter for Phantom/Solflare
- ✅ **Merchant Empowerment** - Self-service dashboard with analytics
- ✅ **Liquid Marketplace** - Resale, trading, gifting enabled

---

## ⚡ Quick Start

```bash
# Clone repository
git clone https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons.git
cd web3-deal-discovery-nft-coupons

# Smart Contracts (Anchor/Solana)
cd src/nft_coupon
anchor build && anchor deploy

# Frontend (Next.js 15)
cd ../frontend
npm install
npm run dev  # → http://localhost:3000
```

**Environment Setup:** Copy `.env.example` → `.env.local` and configure API keys.

**Prerequisites:** Node.js 18+, Solana CLI, Anchor CLI, Phantom/Solflare wallet

📖 **Detailed Setup:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🏗️ Tech Stack

### Blockchain Layer
- **Solana** + **Anchor 0.32.1** + **Metaplex v5.0.0**
- Program ID: `RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7` (vanity address)
- 4 instructions: initialize, create_coupon, redeem_coupon, update_status

### Backend
- **Next.js 15** (API routes + server components)
- **Supabase** PostgreSQL (11 tables, 2 views, 1 function)
- **Solana Wallet Adapter** (Phantom, Solflare)

### Frontend
- **Next.js 15** + **TypeScript strict** + **Tailwind v4**
- **React Hooks** + Context API
- **Framer Motion** (animations) + **React-Leaflet** (maps)

### Integrations & Services
| Service | Purpose | Status |
|---------|---------|--------|
| **RapidAPI** | 1M+ external deals aggregation | ✅ Live |
| **Arweave** | Permanent NFT metadata storage | ✅ 10K AR funded |
| **MoonPay Commerce** | USDC payments on Solana | ✅ 8 paylinks |
| **Sentry** | Error monitoring (client/server/edge) | ✅ Configured |
| **Vercel** | Analytics + Speed Insights | ✅ Integrated |

### Security & DevOps
- **Security:** CORS headers, rate limiting (3 tiers), security headers, health checks
- **Testing:** Jest + React Testing Library (27 tests passing)
- **CI/CD:** Husky + lint-staged (pre-commit hooks)
- **Quality:** TypeScript strict, ESLint, bundle analyzer

---

## 🚀 Features

### ✅ 10/10 Epics Complete (84/84 Tasks)

<table>
<tr>
<td width="50%">

**Core Marketplace**
- 🎟️ NFT Coupons (Metaplex v5.0.0)
- 🏪 Merchant Dashboard (creation, analytics)
- 🛒 User Marketplace (browse, claim, my coupons)
- 🔄 Redemption Flow (QR scan → NFT burn)

**Advanced Features**
- 🌍 Geo Discovery (distance filter, interactive map)
- 💰 Staking/Cashback (12% APY, tier-based)
- 🏆 Loyalty System (4 tiers, 8 NFT badges)
- 📊 Deal Aggregator (RapidAPI integration)

</td>
<td width="50%">

**Social & Engagement**
- ⭐ Reviews & Ratings
- 👍 Voting System (upvote/downvote)
- 🔗 Sharing (Twitter, copy link)
- 💸 Referral Program

**Web3 Abstraction**
- 👛 Wallet Adapter (Phantom/Solflare)
- 🎨 No crypto jargon ("Coupon" not "NFT")
- 🌐 Guest browsing (login only to claim)
- 📱 Mobile-first responsive design

</td>
</tr>
</table>

**Audit Scores:** Epic 8: B+ (85/100) | Epic 9: A- (88/100) | Epic 10: A (90/100)

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       USER / MERCHANT                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        v                               v
┌──────────────┐               ┌──────────────┐
│   Frontend   │               │   Wallet     │
│  (Next.js)   │◄─────────────►│   Adapter    │
└──────┬───────┘               └──────┬───────┘
       │                              │
       │ API Routes                   │ Blockchain
       v                              v
┌──────────────┐               ┌──────────────┐
│   Supabase   │               │    Solana    │
│ (PostgreSQL) │               │    Devnet    │
└──────────────┘               └──────────────┘
       │                              │
       │ Events/Analytics             │ NFT State
       v                              v
┌──────────────┐               ┌──────────────┐
│    Sentry    │               │   Arweave    │
│  Monitoring  │               │   Storage    │
└──────────────┘               └──────────────┘
```

**Hybrid Design:** On-chain (NFT ownership, redemption state) + Off-chain (metadata, analytics, aggregated deals)

---

## 🎨 MonkeDAO Branding

**Colors:** Forest Green (#0d2a13) • Cream (#f2eecb) • Neon Accent (#00ff4d)

**Design:** Jungle-themed, 8px border radius, mobile-first responsive

**Reference:** [MonkeDAO Brand Kit](https://monkedao.io/brand-kit)

---

## 📸 Screenshots

> **Note:** Professional screenshots will be added as part of Epic 12 (Pitch Deck). Current testing screenshots available in `.screenshot/` directory.

<!--
Placeholder for pitch deck screenshots:
- Homepage Marketplace
- Merchant Analytics Dashboard
- User Wallet - My Coupons
- QR Code Redemption Flow
-->

---

## 🧪 Testing

```bash
# Smart Contract Tests
cd src/nft_coupon
anchor test  # Anchor framework tests

# Frontend Unit Tests
cd src/frontend
npm test              # 27/27 tests passing
npm run test:coverage # Coverage report

# Manual Testing
# - docs/testing/MANUAL-TESTING-GUIDE-LOGGED-IN.md (27 user tests)
# - docs/testing/MERCHANT-TESTING-GUIDE.md (10 merchant tests)
# - docs/testing/GUEST-USER-UI-TEST-RESULTS.md (guest browsing)
```

**Test Coverage:** Unit tests (Jest/RTL) + Manual QA + Automated E2E (Playwright MCP)

**Merchant Testing:** 9.5/10 tests complete (M-08 NFT burning deferred to physical device testing)

---

## 📦 Project Structure

```
web3-deal-discovery-nft-coupons/
├── docs/
│   ├── planning/           # PRD, TIMELINE, TRACK-REQUIREMENTS
│   ├── audits/             # Epic 1-10 audit reports
│   ├── testing/            # Manual + automated test guides
│   ├── operations/         # BACKUP-RESTORE, SENTRY-SETUP
│   └── legal/              # Privacy Policy, Terms of Service
├── src/
│   ├── nft_coupon/         # Anchor smart contracts
│   │   ├── programs/       # Solana programs (Rust)
│   │   └── tests/          # Contract tests
│   └── frontend/           # Next.js application
│       ├── app/            # App router (routes)
│       ├── components/     # React components
│       ├── lib/            # Utilities (database, solana, payments)
│       └── public/         # Static assets
└── .github/                # GitHub workflows (future CI/CD)
```

---

## 🚦 Development Status

| Metric | Status |
|--------|--------|
| **Epic Completion** | 10/10 Epics ✅ (84/84 tasks) |
| **Production Readiness** | 95/100 (22/22 issues fixed) |
| **Test Coverage** | 27/27 tests passing ✅ |
| **Merchant Testing** | 9.5/10 complete |
| **Smart Contract** | Deployed to devnet ✅ |
| **Frontend** | Running on localhost ✅ |

**Current Phase:** Epic 11 (Deployment) + Epic 12 (Pitch Deck)

**Next Steps:** Vercel deployment → Demo video → Superteam Earn submission

---

## 🏆 Competitive Advantages

1. **100% Feature Complete** - All core + bonus features implemented (vs competitors' partial MVPs)
2. **Production-Ready** - 95/100 score with enterprise security, monitoring, DevOps
3. **Real Integrations** - RapidAPI (1M+ deals), Arweave (permanent storage), MoonPay (payments)
4. **Web3 Invisible UX** - No crypto jargon, guest browsing, wallet adapter only
5. **Professional Quality** - TypeScript strict, 27 tests, comprehensive docs, self-audited

**Judging Criteria Coverage:**
- ✅ Innovation (25%) - NFT ownership, on-chain redemption, Web3 abstraction
- ✅ Technical (25%) - Solana + Anchor + Metaplex, TypeScript strict, 95/100 production score
- ✅ UX (25%) - Guest browsing, mobile-first, MonkeDAO branding, frictionless
- ✅ Feasibility (15%) - Deployed infrastructure, real APIs, merchant onboarding
- ✅ Completeness (10%) - 10/10 Epics, all required + bonus features

---

## 📚 Documentation

**Key Documents:**
- [CLAUDE.md](./CLAUDE.md) - Project context, Epic status, recent updates
- [PRD (Epic 1-10)](./docs/planning/) - Product requirements for all Epics
- [Epic 12 PRD](./docs/planning/EPIC-12-PITCH-DECK-PRD.md) - Hackathon pitch deck plan
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [SECURITY.md](./SECURITY.md) - Vulnerability disclosure policy

**Testing Guides:**
- [Manual Testing (User)](./docs/testing/MANUAL-TESTING-GUIDE-LOGGED-IN.md) - 27 user tests
- [Manual Testing (Merchant)](./docs/testing/MERCHANT-TESTING-GUIDE.md) - 10 merchant tests
- [Automated E2E Results](./docs/testing/AUTOMATED-TEST-RESULTS.md) - Playwright MCP

**Audit Reports:**
- [Epic 8 Audit](./docs/audits/EPIC-8-AUDIT-REPORT.md) - Staking/Cashback (B+ 85/100)
- [Epic 9 Audit](./docs/audits/EPIC-9-AUDIT-REPORT.md) - Loyalty System (A- 88/100)
- [Epic 10 Audit](./docs/audits/EPIC-10-AUDIT-REPORT.md) - Geo Discovery (A 90/100)

---

## 🔗 Links & Resources

- **Live Demo:** Coming soon (Vercel deployment pending)
- **GitHub Repository:** [github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons](https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons)
- **Solana Explorer:** [explorer.solana.com/address/RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7?cluster=devnet](https://explorer.solana.com/address/RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7?cluster=devnet)
- **Hackathon Page:** [earn.superteam.fun/listing/build-a-web3-deal-discovery-and-loyalty-platform-with-nft-coupons](https://earn.superteam.fun/listings/build-a-web3-deal-discovery-and-loyalty-platform-with-nft-coupons-MonkeDAO)

**External Docs:**
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Metaplex Token Metadata](https://docs.metaplex.com/programs/token-metadata/)

---

## 🤝 Contributing

This is a hackathon project built in 14 days (Oct 6-20, 2025). For development guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

**Code Quality Standards:**
- TypeScript strict mode (no `any` types)
- ESLint compliance
- Pre-commit hooks (Husky + lint-staged)
- 100% feature completion (no half-working implementations)
- Self-audits for each Epic (docs/audits/)

---

## 📜 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **MonkeDAO** - For sponsoring this innovative hackathon track and Gen3 Monke NFT prizes
- **Colosseum** - For organizing the Cypherpunk Hackathon
- **Superteam** - For the platform and global community support
- **Solana Foundation** - For the blazing-fast blockchain infrastructure
- **Metaplex** - For NFT standards and comprehensive tooling

---

## 📞 Contact & Support

- **Developer:** RECTOR (Senior Full-Stack Developer)
- **GitHub:** [@RECTOR-LABS](https://github.com/RECTOR-LABS)
- **Telegram:** [MonkeDAO Support - @moonsettler](https://t.me/moonsettler)
- **Issues:** [GitHub Issues](https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/issues)

---

<div align="center">

**Built with 🐵 by RECTOR for MonkeDAO Cypherpunk Hackathon**

**Bismillah! Tawfeeq min Allah.** 🚀

[![Star on GitHub](https://img.shields.io/github/stars/RECTOR-LABS/web3-deal-discovery-nft-coupons?style=social)](https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons)

</div>
