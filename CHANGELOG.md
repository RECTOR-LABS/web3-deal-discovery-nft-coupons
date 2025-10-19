# Changelog

All notable changes to the Web3 Deal Discovery & NFT Coupons platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-10-19

### Added - Production Readiness (Score: 95+/100)
- **Security Infrastructure:**
  - Rate limiting system with 3-tier configuration (strict/moderate/lenient)
  - CORS headers in middleware with configurable allowed origins
  - Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
  - Health check endpoint at `/api/health` (database + Solana RPC checks)
  - Global error boundary with Sentry integration (`app/error.tsx`)

- **Monitoring & Analytics:**
  - Sentry error tracking (client/server/edge configurations)
  - Vercel Analytics integration for usage tracking
  - Vercel Speed Insights for performance monitoring
  - Comprehensive Sentry setup guide (`docs/operations/SENTRY-SETUP.md`)

- **DevOps & Infrastructure:**
  - Docker support with multi-stage production build (`Dockerfile`, `.dockerignore`)
  - Bundle analyzer configuration (`npm run build:analyze`)
  - Husky git hooks with lint-staged pre-commit checks
  - Health check endpoint for production monitoring
  - Vercel deployment configuration (`vercel.json`)

- **Database Operations:**
  - Database backup and restore procedures (`docs/operations/BACKUP-RESTORE.md`)
  - Schema migration exports (`migrations/` with README)

- **Legal & Documentation:**
  - MIT LICENSE
  - SECURITY.md for vulnerability disclosure policy
  - CONTRIBUTING.md with development guidelines
  - CHANGELOG.md for version tracking
  - Privacy Policy draft (`docs/legal/PRIVACY-POLICY.md`)
  - Terms of Service draft (`docs/legal/TERMS-OF-SERVICE.md`)
  - Production readiness audit report (`docs/production-readiness-report.md`)

- **Configuration & Tooling:**
  - `.env.example` template for all environment variables
  - 8 new production dependencies (@sentry/nextjs, @vercel/analytics, @vercel/speed-insights, @next/bundle-analyzer, husky, lint-staged)

### Changed
- **Security Improvements:**
  - Restricted image sources from wildcard to specific domains (Unsplash, Arweave, Supabase)
  - Removed API key references from log messages
  - Applied rate limiting to public API endpoints
  - Enhanced middleware with CORS and security headers

- **Configuration Updates:**
  - Updated Next.js config with security headers and bundle analyzer
  - Enhanced middleware to handle CORS for all API routes
  - Added comprehensive lint-staged configuration

### Fixed
- 22 production readiness issues (7 high-priority, 8 medium-priority, 6 low-priority)
- API key exposure in logs
- Wildcard image source security risk
- Missing health check endpoint
- Lack of rate limiting on public endpoints

## [1.0.0] - 2025-10-19

### Epic 10 - Geo Discovery ✅
- Interactive map with Leaflet/React-Leaflet
- Distance-based filtering (1-50 miles)
- Geolocation API integration
- Distance calculation utilities

### Epic 9 - Loyalty System ✅
- 4-tier loyalty system (Bronze, Silver, Gold, Platinum)
- 8 NFT badge types with achievement triggers
- Exclusive deals for high-tier users
- Automatic badge minting and tier upgrades

### Epic 8 - Staking & Cashback ✅
- USDC staking with 12% base APY
- Tier-based cashback (5-15% based on loyalty tier)
- Auto-distribution of rewards
- Cashback tracking and analytics

### Epic 7 - Web3 Abstraction ✅
- Privy authentication (email, social, wallet)
- Embedded wallet creation
- No crypto jargon UI
- Seamless onboarding experience

### Epic 6 - Social Layer ✅
- Review system with 5-star ratings
- Deal voting (upvote/downvote)
- Social sharing integration
- Referral system
- Activity feed

### Epic 5 - Deal Aggregation ✅
- RapidAPI "Get Promo Codes" integration
- 1-hour caching for performance
- "Partner Deal" badges in marketplace
- Mock data fallback for development

### Epic 4 - Redemption Flow ✅
- QR code generation for coupons
- Mobile QR code scanning
- Off-chain signature verification
- On-chain NFT burning
- Event logging for analytics

### Epic 3 - User Marketplace ✅
- Browse deals with filters (category, distance, discount)
- Search functionality
- "My Coupons" page
- QR code display
- 27 passing tests

### Epic 2 - Merchant Dashboard ✅
- Merchant registration and profiles
- Deal creation and management
- Analytics and insights
- Settings and preferences

### Epic 1 - NFT Coupons ✅
- Solana smart contract with Anchor
- Metaplex v5.0.0 integration
- 4 instructions: init, create, redeem, update_status
- Deployed to devnet: `REC6VwdAzaaNdrUCWbXmqqN8ryoSAphQkft2BX1P1b1`

### Infrastructure
- Next.js 15.5.6 with App Router
- TypeScript strict mode
- Tailwind CSS v4
- Supabase PostgreSQL (11 tables)
- Arweave permanent storage
- MoonPay Commerce payment integration

## [0.1.0] - 2025-10-01

### Added
- Initial project setup
- Basic project structure
- PRD and planning documents
- Development environment configuration

---

## Version History Summary

- **v1.0.0** (2025-10-19): Feature complete - All 10 Epics implemented and audited
- **v0.2.0** (2025-10-19): Production readiness - Security, monitoring, DevOps (95+/100 score)
- **v0.1.0** (2025-10-01): Initial setup and planning

---

## Upcoming

### Epic 11 - Production Deployment
- [ ] Deploy to Vercel production
- [ ] Demo video (3-5 minutes)
- [ ] Hackathon submission package
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Mainnet deployment

---

**Note**: This changelog follows semantic versioning. Pre-1.0 versions may include breaking changes without major version bumps.
