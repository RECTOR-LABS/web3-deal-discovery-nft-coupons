# Changelog

All notable changes to the Web3 Deal Discovery & NFT Coupons platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2025-10-20

### Added - Pitch Deck Enhancements & Deployment Infrastructure
- **Screenshot Carousel Component:**
  - Interactive carousel displaying 39 production screenshots (`app/pitch-deck/components/ScreenshotCarousel.tsx`)
  - 6 themed categories: User Journey, Merchant Dashboard, NFT/Blockchain, Testing, Auth/UX, Highlights
  - Auto-play functionality with 5-second intervals
  - Keyboard navigation (arrow keys) and touch support
  - Lightbox modal for full-size viewing
  - Dot indicators and thumbnail strip navigation
  - Organized screenshot directory structure (`public/screenshots/` with 6 subdirectories)

- **Code Evidence Component:**
  - Reusable component for displaying source code file references (`app/pitch-deck/components/CodeEvidence.tsx`)
  - Type-coded badges for 5 file types: contract, frontend, API, library, config
  - Color-coded gradient backgrounds per file type
  - Hover effects and animations
  - Integrated into 4 pitch deck sections showing 36 real source files

- **Real Blockchain Verification:**
  - Replaced placeholder links with actual transaction addresses in ResourcesHub
  - NFT mint transaction: `5iyFVpW4YUR4VcZmgCVfVRtJfPCXzMSpEpvXQd4yjSSnveQ1XeuyqiXrRW3WUtREdhmpPQkAyvaBhxWW3Dr9Dz9u`
  - NFT mint address: `9e6QS6JVbKHhnhRgtfUdpd9cDo6htL3j4rNRzuGwjhZv`
  - Linked to Solana Explorer devnet for verification

- **Deployment Infrastructure:**
  - Comprehensive Vercel deployment guide (`docs/deployment/VERCEL-DEPLOYMENT-GUIDE.md`, 12 KB)
  - Quick deployment checklist (`docs/deployment/QUICK-DEPLOY-CHECKLIST.md`, 3.3 KB)
  - Environment variable preparation script (`scripts/prepare-vercel-env.sh`)
  - Detailed instructions for CLI and Dashboard deployment methods
  - Special handling for Arweave wallet configuration in serverless environment
  - Post-deployment verification checklist
  - Common issues troubleshooting guide

### Changed
- **Pitch Deck Page:**
  - Added screenshot carousel to hero section with gradient divider
  - Integrated scroll-to-screenshots functionality with error handling
  - Hidden video section until demo video is ready
  - Updated sticky navigation with "Screenshots" section
  - Improved visual hierarchy and user flow

- **Pitch Deck Components:**
  - Added CodeEvidence sections to ProblemSolution, InnovationShowcase, TechStack, and FeaturesMatrix
  - Enhanced blockchain verification section with real transaction links
  - Improved cursor pointer consistency across all interactive elements

### Fixed
- **ESLint Compliance:**
  - Escaped apostrophes in `MerchantOnboarding.tsx` ("What's Included")
  - Escaped apostrophes in `CouponGuide.tsx` ("Here's everything")
  - Replaced `<a>` tag with Next.js `<Link>` component in CouponGuide for internal navigation

- **Runtime Errors:**
  - Fixed scroll indicator error by creating dedicated `scrollToScreenshots()` function
  - Improved error handling with try-catch blocks

### Documentation
- Updated CLAUDE.md with Epic 12 completion status and deployment readiness
- Updated Epic 11 status with deployment guide locations
- Documented new components: ScreenshotCarousel and CodeEvidence
- Added deployment preparation instructions for Vercel

### Bundle Size
- Pitch deck page: 27.8 kB (increased from 20 kB due to carousel and code evidence features)
- Total screenshots: 39 files organized in 6 categories
- Code evidence: 36 source files referenced across 4 sections

## [0.3.0] - 2025-10-20

### Added - Advanced Observability & DevOps
- **Structured Logging System:**
  - Pino logger with production-ready configuration (`lib/logger.ts`)
  - Module-specific loggers (API, Database, Blockchain, Auth)
  - JSON-formatted logs with timestamps and metadata
  - Environment-aware log levels (debug in dev, info in production)
  - Request ID tracing in middleware for distributed tracing

- **Custom Business Metrics:**
  - Sentry custom metrics integration (`lib/metrics.ts`)
  - 15+ predefined metric types (NFT lifecycle, deal events, user events, social events)
  - Performance tracking (API latency, database query latency)
  - Distribution metrics for discount percentages and ratings
  - Error tracking with detailed context

- **CI/CD Pipeline:**
  - GitHub Actions workflow with 8 automated jobs (`.github/workflows/ci-cd.yml`)
  - Lint and TypeScript type checking
  - Unit and integration test execution with coverage
  - Frontend build verification
  - Solana contract builds (main branch only)
  - Security audits (npm audit + TruffleHog secret scanning)
  - Vercel production deployments (main branch)
  - Vercel preview deployments (PRs and dev branch)
  - Slack notifications on pipeline failures

- **Testing Infrastructure:**
  - E2E testing framework with Playwright (`e2e/` directory)
  - API route unit tests (`app/api/__tests__/`)
  - Codecov integration for test coverage tracking

- **Database Enhancements:**
  - Production database indexes (`migrations/production-indexes.sql`)
  - Row-level security policies (`migrations/row-level-security-policies.sql`)
  - Supabase local development configuration (`supabase/config.toml`)

- **Performance & Optimization:**
  - Content Security Policy (CSP) headers for enhanced security
  - Package import optimization with modular imports (lucide-react)
  - Transpiled Solana wallet adapter packages for better performance
  - Load testing configuration (`load-test.yml`)

- **DevOps Tooling:**
  - Database backup/restore testing script (`scripts/test-backup-restore.sh`)
  - GDPR cookie consent component (`components/shared/CookieConsent.tsx`)

- **Documentation:**
  - Implementation completion report (`docs/IMPLEMENTATION-COMPLETE-2025-10-20.md`)
  - Production readiness fixes documentation (`docs/PRODUCTION-READINESS-FIXES-2025-10-20.md`)
  - Production readiness audit report (`docs/production-readiness-audit-2025-10-20.md`)
  - Bundle optimization guide (`docs/guides/BUNDLE-OPTIMIZATION.md`)
  - Legal review checklist (`docs/guides/LEGAL-REVIEW-CHECKLIST.md`)
  - Sentry alerts setup guide (`docs/operations/SENTRY-ALERTS-SETUP.md`)

### Changed
- **Health Check Endpoint:**
  - Added structured logging and metrics tracking
  - Request timing for performance monitoring
  - Enhanced error context with detailed debugging info

- **Middleware Enhancements:**
  - Request ID generation with `crypto.randomUUID()`
  - X-Request-ID header for request tracing
  - Improved API request logging with request IDs

- **Next.js Configuration:**
  - Content Security Policy headers for XSS protection
  - Modularized imports for tree-shaking optimization
  - Transpiled Solana packages for compatibility

- **Test Configuration:**
  - Jest config optimizations
  - Test setup refinements for better reliability

### Dependencies
- Added `pino` for structured logging
- Added `pino-pretty` for development log formatting

### Infrastructure Impact
- **Production Grade:** Enterprise-level observability and monitoring
- **CI/CD Automation:** Fully automated testing, building, and deployment pipeline
- **Performance:** Optimized bundle size and runtime performance
- **Security:** Enhanced with CSP headers and comprehensive security scanning
- **Developer Experience:** Improved debugging with structured logs and request tracing

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
- **v0.3.0** (2025-10-20): Advanced observability - Structured logging, custom metrics, CI/CD pipeline, E2E testing
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
