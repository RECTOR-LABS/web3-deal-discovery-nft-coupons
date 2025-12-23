<div align="center">

# 🎟️ Web3 Deal Discovery

**Reimagining Groupon with tradable NFT coupons on Solana**

## 🏆 1ST PLACE WINNER - MonkeDAO Cypherpunk Track

**$5,000 USDC + Gen3 Monke NFT**

[![1st Place](https://img.shields.io/badge/🏆_1ST_PLACE-MonkeDAO_Cypherpunk-gold?style=for-the-badge)](https://superteam.fun)
[![Stars](https://img.shields.io/github/stars/RECTOR-LABS/web3-deal-discovery-nft-coupons?style=social)](https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/stargazers)
[![Solana](https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

🥇 **Superteam Earn Winner** | 🌏 **Built in Indonesia** | 🕌 **Built with Ihsan**

[📦 Demo](#) • [📖 Docs](#) • [🏛️ RECTOR LABS](https://github.com/RECTOR-LABS)

</div>

---

## 🎯 The Problem

**Traditional coupon platforms waste value.**

Groupon pioneered local deals—but the model is broken:

- 🗓️ **Expiration Waste** - Unused coupons lose 100% value after expiry
- 🔒 **Non-Transferable** - Can't sell/gift coupons you won't use
- 📉 **Fixed Pricing** - No market dynamics, merchants can't adjust
- 💸 **Lost Money** - Consumers can't recoup value from unused deals
- 🏪 **Inflexible** - Merchants locked into rigid discount campaigns

**Result:** $billions in unrealized value, frustrated users, limited merchant control.

---

## ✨ The Solution: Tradable NFT Coupons

**Turn coupons into liquid assets.**

Web3 Deal Discovery transforms local deals into Solana NFTs with:

- 🎟️ **NFT Coupons** - Every deal is a unique, ownable NFT
- 💰 **Secondary Market** - Trade coupons on-chain, recover value
- 🔄 **Dynamic Pricing** - Coupon value adjusts based on demand
- 🏪 **Merchant Control** - Real-time campaign management dashboard
- ⛓️ **On-Chain Verification** - Tamper-proof redemption tracking
- 🌍 **Global Liquidity** - Anyone can buy/sell local deals

**Tagline:** *"Your unused coupon is someone else's bargain."*

---

## 🛠️ Tech Stack

**Blockchain:**
- Solana (mainnet-beta)
- SPL Token Program
- Metaplex Token Metadata
- Metaplex Auction House

**Smart Contracts:**
- Rust + Anchor 0.29+
- NFT minting contracts
- Marketplace contracts
- Redemption verification

**Frontend:**
- TypeScript + React
- Next.js 14
- TailwindCSS
- Solana Wallet Adapter
- Phantom/Solflare integration

**Backend:**
- Node.js + Express
- PostgreSQL (merchant data)
- Redis (caching)
- Real-time WebSocket updates

**Services:**
- Vercel (frontend)
- AWS S3 (NFT metadata)
- Dedicated Solana RPC

---

## 🚀 Quick Start

### Prerequisites

```bash
- Node.js 18+ or Bun
- Solana CLI 1.18+
- Anchor 0.29+
- Phantom wallet
```

### Installation

```bash
# Clone
git clone https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons.git
cd web3-deal-discovery-nft-coupons

# Install
npm install

# Environment
cp .env.example .env
# Add your Solana RPC URL

# Build contracts
cd programs/deals
anchor build
anchor deploy --provider.cluster devnet

# Run frontend
cd ../../app
npm run dev
```

---

## 📖 How It Works

### For Consumers

1. **Browse Deals** → Local restaurants, services, activities
2. **Mint Coupon NFT** → Pay discounted price, receive NFT
3. **Use or Trade** → Redeem at merchant OR list on marketplace
4. **Recover Value** → Sell unused coupons to others

### For Merchants

1. **Create Campaign** → Set discount, supply, expiration
2. **Mint Coupons** → Platform creates NFT collection
3. **Dashboard** → Monitor sales, redemptions, analytics
4. **Flexible Control** → Adjust pricing, extend expiry

### Technical Flow

```
Merchant Creates Deal → Smart Contract Mints NFTs → User Purchases NFT
                                ↓
                    Listed on Marketplace (optional)
                                ↓
                    User Redeems at Merchant → NFT Burned
```

---

## 🎨 Key Features

### NFT Marketplace
- 💰 **Buy/Sell Coupons** - Secondary market with liquidity
- 📊 **Price Discovery** - Market-driven coupon values
- 🔍 **Filter & Search** - Location, category, expiry date
- ⭐ **Ratings** - Merchant reviews and trust scores

### Merchant Dashboard
- 📈 **Real-time Analytics** - Sales, redemptions, revenue
- 🎯 **Campaign Management** - Create, edit, pause deals
- 💳 **Instant Settlement** - Funds in USDC/SOL
- 🛠️ **Flexible Pricing** - Dynamic discount adjustments

### Consumer Experience
- 🎟️ **NFT Wallet** - All coupons in one place
- 🔔 **Expiry Alerts** - Notifications before expiration
- 🗺️ **Location-Based** - Discover deals nearby
- 💎 **Portfolio View** - Track coupon value over time

### Technical Excellence
- ⚡ **Fast Transactions** - Sub-second Solana speed
- 🔐 **Secure Redemption** - On-chain verification prevents fraud
- 📱 **Mobile-First** - Responsive design, PWA support
- 🌐 **Low Fees** - ~$0.00025 per transaction

---

## 🏆 Hackathon Result: 1ST PLACE WINNER

**Competition:** MonkeDAO Cypherpunk Track (Superteam Earn)
**Result:** 🥇 **1ST PLACE** - $5,000 USDC + Gen3 Monke NFT

| Rank | Builder | Prize |
|------|---------|-------|
| 🥇 **1st** | **RECTOR SOL** | **$5,000 USDC** |
| 🥈 2nd | Andrea Chello | $1,000 USDC |
| 🥉 3rd | Aneesha Rama | $500 USDC |

### Why We Won

**What made us stand out:**
1. **Web3 Invisible UX** - No crypto jargon, seamless wallet integration
2. **Escrow-Based Resale** - Industry-first for NFT coupons
3. **Professional Demo Videos** - 5 comprehensive video walkthroughs
4. **Production-Ready Code** - 13 epics, 95 tasks, 34 tests
5. **Complete Feature Set** - Everything from minting to redemption to resale

**Real-world use case:**
Bought a restaurant coupon but can't make it? List it at 80% discount—someone else gets a deal, you recover value. Everyone wins.

---

## 🌟 Highlights

**Unique Innovations:**
- 🎟️ First tradable coupon NFTs on Solana
- 💰 Secondary market creates price discovery
- 🔄 Dynamic pricing based on demand
- 🏪 Merchant-controlled campaigns
- ⛓️ On-chain redemption verification

**Technical Achievements:**
- NFT metadata with expiry logic
- Marketplace integration (Metaplex Auction House)
- Real-time redemption system
- Merchant dashboard with analytics

**Lessons Learned:**
- NFT utility > NFT art (coupons are perfect utility)
- Secondary markets need liquidity bootstrapping
- Merchant onboarding is harder than tech
- Mobile-first design critical for local deals

---

## 🗺️ Roadmap

**Phase 1: Hackathon MVP** ✅
- [x] NFT minting contracts
- [x] Basic marketplace
- [x] Merchant dashboard
- [x] Consumer frontend

**Phase 2: Beta Launch** 🚧 (Q1 2026)
- [ ] Partner with 10 local merchants (Indonesia)
- [ ] Mobile app (iOS + Android)
- [ ] Advanced marketplace features
- [ ] Marketing campaign

**Phase 3: Scale** 📋 (Q2-Q3 2026)
- [ ] 100+ merchants across Jakarta
- [ ] Integrate with major wallets
- [ ] Loyalty rewards program
- [ ] Expand to other cities

**Phase 4: Platform** 📋 (Q4 2026)
- [ ] White-label solution for other platforms
- [ ] API for third-party integrations
- [ ] Cross-chain support (Polygon, Base)

---

## 🤝 Contributing

Contributions welcome! We're building for real-world adoption.

**Priority areas:**
- 🏪 Merchant onboarding UX
- 📱 Mobile app development
- 🌐 Localization (Indonesian + English)
- 📈 Analytics dashboard improvements

---

## 📄 License

MIT License

---

## 🔗 Links

- 🌐 [rectorspace.com](https://rectorspace.com)
- 🐙 [@rz1989s](https://github.com/rz1989s)
- 🏛️ [RECTOR-LABS](https://github.com/RECTOR-LABS)

---

<div align="center">

**🏆 1ST PLACE WINNER - MonkeDAO Cypherpunk Track**

**Built with Bismillah** 🕌

*"Waste not, for Allah loves not the wasteful." - Quran 7:31*

*Alhamdulillah - From Bismillah to victory.*

---

[🏛️ RECTOR LABS](https://github.com/RECTOR-LABS) | Building for Eternity | 2025

[![1st Place](https://img.shields.io/badge/🏆_1ST_PLACE-$5,000_USDC-gold?style=flat)](https://superteam.fun)
[![Solana](https://img.shields.io/badge/Solana-14F195?style=flat&logo=solana&logoColor=black)](https://solana.com)
[![NFT](https://img.shields.io/badge/NFT-Utility-F9C846?style=flat)](https://github.com/RECTOR-LABS)

</div>
