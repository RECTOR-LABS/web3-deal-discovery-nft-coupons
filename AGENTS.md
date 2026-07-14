<!-- Satellite context file — extends the global hub (~/.claude/CLAUDE.md | ~/.pi/agent/AGENTS.md). Host-neutral; project-specific only. Do not duplicate hub standards here. -->

# Web3 Deal Discovery — NFT Coupons

> Web3 deal discovery platform: NFT coupons on Solana. "Groupon meets DeFi."

**🏆 HACKATHON WINNER — 1ST PLACE** — MonkeDAO Cypherpunk Track (Superteam Earn), December 2025. $5,000 USDC + Gen3 Monke NFT (12-month locked).

## Quick Facts

- **Track:** Cypherpunk — MonkeDAO (Superteam Earn)
- **Status:** WINNER ✅ | 100% Complete | 13 Epics | 95 Tasks | v0.5.0
- **Stack:** Solana + Anchor | Next.js 15 + Tailwind v4 | Supabase PostgreSQL | Solana Wallet Adapter

## Tech Stack

- **Blockchain:** Solana + Anchor 0.32.1 + Metaplex v5.0.0
- **Backend:** Next.js 15 API + Supabase PostgreSQL + Privy Auth (later → Solana Wallet Adapter Phantom/Solflare)
- **Frontend:** Next.js 15 + TypeScript strict + Tailwind v4 + React-Leaflet
- **Storage:** Arweave (permanent) + Supabase Storage (fallback)
- **Payments:** MoonPay Commerce (Helio) — USDC on Solana
- **External APIs:** RapidAPI (Get Promo Codes)
- **Monitoring:** Sentry + Vercel Analytics + Speed Insights
- **Security:** CORS, Rate Limiting, Security Headers, Health Checks
- **Testing:** Jest/RTL (34 tests: 3 unit + 27 manual + 4 E2E), Playwright, ESLint, Husky

## Deployed Infrastructure

**Smart Contracts (Devnet):** `RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7` — Metaplex v5.0.0, **9 production instructions:** `initialize_merchant` · `create_coupon` · `claim_coupon` (FREE) · `purchase_coupon` (PAID w/ escrow PDA) · `redeem_coupon` (burn NFT) · `update_coupon_status` · `list_for_resale` · `purchase_from_resale` (Epic 13, escrow) · `transfer_coupon` (deprecated).

**Frontend:** Next.js 15.5.6, 19 pages incl. `/marketplace/resale` + `/api-docs` (Scalar UI, OpenAPI 3.0, 25 endpoints). Monitoring (Sentry + Vercel Analytics), security (CORS/Rate Limit/CSP), CI/CD (GitHub Actions 8-job pipeline).

**Database:** Supabase (`mdxrtyqsusczmmpgspgn`, us-east-1) — 11 tables (merchants, deals, events, users, reviews, votes, resale_listings, referrals, staking, cashback_transactions, badges) + 2 views + `calculate_distance_miles()` function. Production: indexes, RLS policies.

## Common Commands

```bash
# Contracts (src/contracts/)
anchor build && anchor test
anchor deploy  # devnet (solana config set --url devnet)

# Frontend (src/frontend/)
npm run dev              # localhost:3000
npm run build
npm run build:analyze
npm test                 # 27 passing
npm run test:coverage
npm run typecheck
npm run prepare          # Husky git hooks

# Deploy
vercel deploy --prod
anchor deploy --provider.cluster mainnet
```

## Epic Status (13/13 complete + audited, 95/95 tasks)

1. NFT Coupons (contracts deployed, audit ✅) · 2. Merchant Dashboard · 3. User Marketplace · 4. Redemption Flow (QR → off-chain verify → on-chain burn) · 5. Deal Aggregator (RapidAPI, 1hr cache) · 6. Social Layer (reviews/voting/sharing/referrals) · 7. Web3 Abstraction (external wallet, no jargon) · 8. Staking/Cashback (12% APY, tier 5-15%) · 9. Loyalty System (4 tiers, 8 NFT badges) · 10. Geo Discovery (Leaflet map, distance filter 1-50mi) · 11. Deployment (Vercel) · 12. Pitch Deck (`/pitch-deck`, 5 demo videos) · 13. Resale Marketplace (escrow PDA, atomic swap, E2E).

Audit reports in `docs/audits/` (10 reports, Epic 1-10). Quality: Epic 8 B+ (85), Epic 9 A- (88), Epic 10 A (90).

## Architecture

**3-Layer Stack:** Blockchain (Solana/Anchor — NFT ownership, redemption state) · Backend (Next.js API + Supabase — merchant profiles, analytics, API aggregation) · Frontend (Next.js 15 + Tailwind — Merchant Dashboard & User Marketplace).

**Key paths:** `docs/planning/` (PRD, TIMELINE, TRACK-REQUIREMENTS) · `src/contracts/` (Anchor programs, tests, Anchor.toml) · `src/frontend/{app,components,lib}/`.

## Key Design Patterns

1. **Hybrid architecture:** on-chain (NFT ownership, redemption) + off-chain (metadata, analytics)
2. **Redemption flow:** QR w/ signature → merchant scans → verify off-chain → burn NFT on-chain
3. **Web3 abstraction:** email/social login, no crypto jargon ("NFT" → "Coupon")
4. **NFT metadata:** Metaplex v1.1 standard (name, image, discount%, expiry, category)

## Integrations

- **RapidAPI** "Get Promo Codes" (1M+ coupons, 10K+ merchants) — 1hr cache, mock fallback, "Partner Deal" badges. `app/api/deals/aggregated/route.ts`
- **Arweave** (AR.IO Testnet, wallet `sY6VBEWpDPmN6oL9Zt_8KjJMR1PWexpmWKEAojtbwsc`) — permanent NFT image/metadata storage; Supabase fallback. `lib/storage/{arweave,upload}.ts`
- **MoonPay Commerce (Helio)** — 8 paylinks ($1-$50 USDC), Solana, `@heliofi/checkout-react@^4.0.0`. `lib/payments/paylink-config.ts`

## Environment (.env.local)

Required: `NEXT_PUBLIC_SOLANA_NETWORK=devnet` · `NEXT_PUBLIC_NFT_PROGRAM_ID` · `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_ROLE_KEY` · `NEXT_PUBLIC_PRIVY_APP_ID` · `RAPIDAPI_KEY` · `ARWEAVE_*` · `NEXT_PUBLIC_MOONPAY_PUBLIC_KEY` · `MOONPAY_SECRET_KEY`. (See `.env.example`.)

## MonkeDAO Branding

Colors: `#0d2a13` (forest green) · `#f2eecb` (cream) · `#00ff4d` (neon accent). Fonts: Inter, Poppins, Taviraj. 8px border radius, forest/jungle palette. Brand kit: https://monkedao.io/brand-kit

## Demo Videos (YouTube)

1. Merchant Registration (JT6OMqcxveI) · 2. Free Coupon Claim (CH0v4vM9dgI) · 3. Paid Coupon Purchase (XyHb1V9Shlo) · 4. Resale Marketplace E2E (Z53dbXadgjY) · 5. Merchant Redemption (h_GxmLjRsTc)

## Key Files

`README.md` · `CHANGELOG.md` · `LICENSE` · `SECURITY.md` · `docs/planning/{PRD,TIMELINE,TRACK-REQUIREMENTS}.md` · `docs/audits/` · `docs/production-readiness-report.md` · `src/contracts/programs/nft_coupon/src/lib.rs` · `lib/{rate-limit,logger,metrics}.ts` · `app/api/health/route.ts` · `sentry.{client,server,edge}.config.ts` · `vercel.json` · `Dockerfile`.