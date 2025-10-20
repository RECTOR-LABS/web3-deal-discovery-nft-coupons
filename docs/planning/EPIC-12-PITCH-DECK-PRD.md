# Epic 12: Hackathon Pitch Deck Page - PRD

**Epic ID:** 12
**Epic Name:** Interactive Pitch Deck for Hackathon Submission
**Owner:** RECTOR
**Created:** 2025-10-20
**Target Completion:** Before Epic 11 (Deployment & Submission)
**Status:** Planning Complete, Ready for Implementation

---

## Executive Summary

Create a comprehensive, interactive single-page pitch deck at `/pitch-deck` that showcases our MonkeDAO Cypherpunk Hackathon submission to judges. The page must cover all submission requirements, address every judging criterion, and present our platform in an eye-catching, professional manner that demonstrates why we deserve 1st place.

**Key Objectives:**
- ✅ Address all 5 judging criteria comprehensively
- ✅ Provide all required submission materials in one place
- ✅ Create memorable, interactive experience for judges
- ✅ Showcase 100% feature completion (10/10 Epics)
- ✅ Demonstrate production-ready quality (95/100 score)

---

## Background & Context

### Hackathon Requirements

**From:** docs/planning/hackathon-original.md

**Submission Checklist:**
- ✅ Deployed application or detailed prototype
- ✅ GitHub repository with clear instructions
- ⏳ Short video (3-5 minutes) demonstrating functionality
- ⏳ Brief write-up explaining design choices and technical implementation
- ✅ API for integration or easy integration design

**Judging Criteria (Weighted):**
1. **Innovation & Creativity** (25%) - Novel Web3 technology leverage
2. **Technical Implementation** (25%) - Code quality, architecture, smart contracts
3. **User Experience** (25%) - Ease of use, Web3 abstraction
4. **Feasibility & Scalability** (15%) - Real-world adoption potential
5. **Completeness** (10%) - Feature coverage

### Our Competitive Position

**Strengths:**
- 10/10 Epics completed (100% feature coverage)
- All core + bonus features implemented
- Production-ready (95/100 production score)
- Real API integrations (RapidAPI ✅, Arweave Architecture ✅, MoonPay ✅)
- Web3 invisible UX (wallet adapter, no jargon)
- Professional DevOps (Sentry, rate limiting, security headers)

**Competition:**
- 0 submissions as of project start
- High opportunity for top placement

**Strategy:**
- Lead with UX excellence (25% of score)
- Emphasize completeness (10/10 Epics vs competitors' partial implementations)
- Highlight production readiness (real deployments, not prototypes)
- Interactive demo (not just static slides)

---

## Success Metrics

**Must-Have (P0):**
- All judging criteria addressed with evidence
- All submission requirements provided (demo, GitHub, video, write-up)
- Page loads in <2 seconds
- Mobile responsive (judges may review on phones)
- MonkeDAO branding consistent

**Nice-to-Have (P1):**
- Interactive feature demos (live marketplace embed)
- Animated progress indicators (Epic completion)
- Downloadable PDF technical write-up
- Video embed with fallback

---

## Stories & Tasks

### **Story 12.1: Hero Section & Quick Access**

**User Story:** As a judge, I want to immediately understand the project and access key resources, so I can evaluate efficiently.

**Acceptance Criteria:**
- Hero headline captures attention within 3 seconds
- Demo video embedded and auto-plays on mute
- Quick stats visible above fold (10 Epics ✅ | 84 Tasks ✅ | Production Ready)
- Sticky navigation works on scroll
- CTAs prominent and functional

#### Tasks

**T12.1.1: Create /pitch-deck Route**
- Create `src/frontend/app/pitch-deck/page.tsx`
- Set up client component with TypeScript
- Import dependencies (Framer Motion, Lucide icons)
- Configure metadata (title, description, Open Graph)

**T12.1.2: Implement Hero Section**
- Headline: "Web3 Deal Discovery - Groupon Meets DeFi"
- Subtitle: "MonkeDAO Cypherpunk Hackathon Submission"
- **Premium Video Component** (stunning, professional design):
  - **Cinematic Container:**
    - Custom gradient border with neon green glow (`#00ff4d`)
    - Multi-layer box-shadow for depth (ambient lighting effect)
    - 16px rounded corners with overflow handling
    - Backdrop blur effect for premium aesthetic
  - **Interactive Elements:**
    - Large centered play button overlay (pulsing animation)
    - Hover effects (scale transform 1.02, increased glow intensity)
    - Loading skeleton with shimmer animation
    - Progress indicator during video load
  - **Visual Enhancements (Framer Motion):**
    - Fade-in + scale entrance animation (0.95 → 1.0)
    - Parallax effect on scroll (subtle depth)
    - Staggered appearance with hero text (0.2s delay)
    - Ambient green glow radiating from video container
    - Decorative jungle-themed SVG corners (MonkeDAO branding)
  - **MonkeDAO Branding Integration:**
    - Forest green gradient frame: `linear-gradient(135deg, #0d2a13, #00ff4d)`
    - Neon accent glow on hover: `box-shadow: 0 0 30px rgba(0, 255, 77, 0.5)`
    - Jungle texture overlay (subtle, non-intrusive)
  - **Professional Polish:**
    - 16:9 aspect ratio lock (responsive across devices)
    - Custom controls styling (react-player theme override)
    - Muted autoplay with visible unmute button overlay
    - Captions/subtitles support for accessibility
    - High-quality fallback poster image (gradient overlay + "Watch Demo" CTA)
  - **Performance Optimized:**
    - Lazy load (Intersection Observer - only when scrolled into view)
    - YouTube Lite implementation (iframe loads on user interaction)
    - Mobile-optimized (touch-friendly controls, 44px tap targets)
  - **Component Structure:**
    - Dedicated `VideoHero.tsx` component (reusable, modular)
    - Props: videoUrl, posterImage, autoplay, muted, controls
- Stats badges:
  - 10/10 Epics Complete ✅
  - 84/84 Tasks Delivered
  - 95/100 Production Score
  - 27 Unit Tests Passing
- MonkeDAO logo + forest green gradient background

**T12.1.3: Sticky Navigation Menu**
- Sections: Problem | Solution | Innovation | Tech Stack | Features | UX | Scalability | Team | Resources
- Smooth scroll behavior (scroll-smooth, scroll-margin-top)
- Active section highlighting
- Mobile hamburger menu

**T12.1.4: Floating CTA Buttons**
- "🚀 Live Demo" → Production URL (opens new tab)
- "💻 GitHub Repo" → Repository link
- "📄 Download Technical Report" → PDF download
- Fixed position (bottom-right on desktop, bottom full-width on mobile)

**Technical Notes:**
- Use Framer Motion for fade-in animations + parallax effects
- Video embed: Custom `VideoHero.tsx` component with YouTube Lite optimization
  - Ambient glow effect using absolute positioned div with blur-3xl
  - Custom play overlay with Lucide `PlayCircle` icon
  - Intersection Observer for lazy loading trigger
  - React Player with custom wrapper styling
- Sticky nav: position: sticky with z-index: 50
- **Competitive Advantage:** Premium video presentation differentiates from basic YouTube embeds used by most hackathon submissions

---

### **Story 12.2: Problem Statement & Solution Overview**

**User Story:** As a judge evaluating innovation, I want to understand the problem and solution approach, so I can score creativity.

**Acceptance Criteria:**
- Problem clearly articulated (Groupon pain points)
- Solution differentiation obvious (Web3 advantages)
- Mission alignment with hackathon brief

#### Tasks

**T12.2.1: Problem Statement Section**
- Title: "The Problem: Trapped Value in Traditional Discount Platforms"
- Pain points grid (3 columns):
  - **Users:** Non-transferable coupons, trapped value, no resale
  - **Merchants:** Limited analytics, no control, centralized dependency
  - **Market:** Inefficient liquidity, fraud risk, geographic limitations
- Visual: Comparison icons (⛓️ Locked vs 🔓 Free)

**T12.2.2: Solution Overview**
- Title: "Our Solution: User-Owned, Borderless Deal Marketplace"
- Key pillars (4 cards):
  - **NFT Ownership:** Every deal is a transferable, tradable digital asset
  - **On-Chain Redemption:** Verifiable burns, permanent audit trail
  - **Web3 Invisible UX:** Email/wallet login, no crypto jargon
  - **Merchant Control:** Dashboard for creation, analytics, redemption
- Visual: Before/After comparison table

**T12.2.3: Mission Alignment**
- Quote from hackathon brief:
  - "Build the next evolution of Groupon - but user-owned, borderless, and Web3-powered"
- Checkmarks showing how we address each requirement:
  - ✅ Promotions as verifiable NFTs
  - ✅ Redemption tracked on-chain
  - ✅ Ownership transferable/tradable
  - ✅ Merchants retain control
  - ✅ Users discover/collect/share globally

---

### **Story 12.3: Innovation & Web3 Integration Showcase**

**User Story:** As a judge scoring innovation, I want to see creative Web3 leveraging, so I can evaluate originality.

**Acceptance Criteria:**
- 4+ specific innovations highlighted
- Web3 integration challenges addressed with solutions
- Differentiation vs traditional platforms clear

#### Tasks

**T12.3.1: Innovation Highlights Grid**
- 4 innovation cards (hover effects):
  1. **NFT Ownership (Metaplex v5.0.0)**
     - Transferable coupons as SPL tokens
     - Metadata standard (name, image, discount%, expiry, merchant ID)
     - Resale marketplace enabled
  2. **On-Chain Redemption**
     - Smart contract instruction: `redeem_coupon`
     - NFT burning for single-use enforcement
     - Transaction signature as proof
  3. **Web3 Invisible UX**
     - Solana Wallet Adapter (Phantom/Solflare)
     - No crypto jargon ("Coupon" not "NFT")
     - Guest browsing (login only for claiming)
  4. **Decentralized Storage**
     - Arweave permanent metadata storage (production-ready architecture)
     - Server-side API routes for wallet access
     - Supabase fallback (100% functional)
     - **Demo Note:** Requires AR tokens (~$5-10) to activate live uploads

**T12.3.2: Web3 Integration Challenges Answered**
- Table format (Challenge | Our Solution):
  - **NFT Representation** → Metaplex v1.1 standard, detailed metadata
  - **Redemption Flow** → QR code + signature → off-chain verify → on-chain burn
  - **UX Abstraction** → Wallet adapter, guest browsing, email login fallback
  - **Merchant Onboarding** → Simple dashboard, no blockchain knowledge required
  - **Marketplace Liquidity** → Resale listings, RapidAPI partner deals, social sharing

**T12.3.3: Differentiation Table**
- Comparison: Groupon vs DealCoupon (our platform)
- Rows:
  - Ownership → Centralized vs User-owned (NFT)
  - Transferability → No vs Yes (blockchain)
  - Verification → Trust-based vs Cryptographic
  - Liquidity → None vs Resale marketplace
  - Analytics → Limited vs Real-time on-chain
  - Global Access → Geo-restricted vs Borderless
- Visual styling: Red ❌ for Groupon, Green ✅ for DealCoupon

---

### **Story 12.4: Technical Architecture & Implementation**

**User Story:** As a judge evaluating technical quality, I want to see architecture and code standards, so I can score implementation.

**Acceptance Criteria:**
- Tech stack clearly visualized
- Smart contract details provided
- Architecture diagram comprehensible
- Code quality metrics shown

#### Tasks

**T12.4.1: Tech Stack Visualization**
- 3-layer diagram:
  - **Layer 1 - Blockchain:** Solana + Anchor 0.32.1 + Metaplex v5.0.0
  - **Layer 2 - Backend:** Next.js 15 API + Supabase PostgreSQL + Wallet Adapter
  - **Layer 3 - Frontend:** Next.js 15 + TypeScript strict + Tailwind v4
- Integrations badges:
  - RapidAPI (Get Promo Codes - 1M+ deals)
  - Arweave (Architecture ready - see judge's note)
  - MoonPay Commerce (USDC payments)
  - Sentry (Error monitoring)
  - Vercel (Analytics + Speed Insights)

**T12.4.2: Smart Contract Details**
- Program ID: `RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7` (vanity address)
- 4 Instructions:
  1. `initialize_merchant` - Register merchant account
  2. `create_coupon` - Mint NFT coupon with metadata
  3. `redeem_coupon` - Burn NFT, emit redemption event
  4. `update_coupon_status` - Modify active/expired status
- Deployment: Solana Devnet (ready for mainnet)
- Framework: Anchor 0.32.1 + Metaplex v5.0.0

**T12.4.3: Architecture Diagram**
- Flowchart showing:
  - User → Frontend (Next.js) → Wallet Adapter → Solana RPC
  - Merchant → Dashboard → API Routes → Supabase + Solana
  - Redemption → QR Scan → Verify Signature → Burn NFT → Event Log
- Hybrid design: On-chain (NFT state) + Off-chain (metadata, analytics)

**T12.4.4: Code Quality Metrics**
- TypeScript strict mode ✅
- ESLint compliance ✅
- 27 unit tests passing (Jest + React Testing Library) ✅
- Production readiness: 95/100
  - CORS headers ✅
  - Rate limiting ✅
  - Security headers ✅
  - Error monitoring (Sentry) ✅
  - Health checks ✅
- Git workflow: Feature branches, conventional commits, self-audits

---

### **Story 12.5: Features Completeness Matrix**

**User Story:** As a judge scoring completeness, I want to see feature coverage, so I can evaluate thoroughness.

**Acceptance Criteria:**
- All 6 core features shown as complete
- Bonus features highlighted
- Epic progress tracker accurate

#### Tasks

**T12.5.1: Core Features Checklist**
- Interactive checkboxes (all checked):
  1. ✅ **NFT Promotions/Coupons**
     - Metaplex v5.0.0 minting
     - Metadata: discount%, expiry, merchant ID, category
     - Transferable SPL tokens
  2. ✅ **Merchant Dashboard**
     - Registration, profile management
     - Deal creation with image upload
     - Analytics (views, claims, redemptions)
     - QR redemption scanner
  3. ✅ **User Wallet & Marketplace**
     - Browse deals (guest + authenticated)
     - Filter by category, location, discount
     - My Coupons page (claimed NFTs)
     - QR code generation
  4. ✅ **Deal Aggregator Feed**
     - RapidAPI integration (1M+ coupons)
     - 1-hour cache, mock fallback
     - "Partner Deal" badges
     - External API pagination
  5. ✅ **Social Discovery Layer**
     - Reviews (star ratings, comments)
     - Voting (upvote/downvote deals)
     - Sharing (Twitter, copy link)
     - Referral system (invite friends)
  6. ✅ **Redemption Verification Flow**
     - QR code with cryptographic signature
     - Merchant scanner (camera + manual entry)
     - Off-chain verification → On-chain burn
     - Event logging (database + blockchain)

**T12.5.2: Bonus Features (Extras)**
- 3 advanced features implemented:
  1. ✅ **Reward Staking/Cashback**
     - 12% base APY
     - Tier-based multipliers (5-15%)
     - Auto-distribution on deal purchases
     - Audit: B+ (85/100)
  2. ✅ **NFT Badges/Loyalty System**
     - 4 tiers (Bronze → Silver → Gold → Diamond)
     - 8 NFT badges (achievements)
     - Exclusive deals unlocked by tier
     - Auto-minting on milestone
     - Audit: A- (88/100)
  3. ✅ **Geo-based Discovery**
     - "Deals Near Me" filter
     - Distance calculation (1-50 miles)
     - Interactive map (React-Leaflet)
     - Merchant location pins
     - Audit: A (90/100)

**T12.5.3: Epic Progress Tracker**
- Table showing 10 Epics:

| Epic | Name | Status | Tasks | Audit Score |
|------|------|--------|-------|-------------|
| 1 | NFT Coupons | ✅ Complete | 8/8 | ✅ Pass |
| 2 | Merchant Dashboard | ✅ Complete | 9/9 | ✅ Pass |
| 3 | User Marketplace | ✅ Complete | 8/8 | ✅ Pass |
| 4 | Redemption Flow | ✅ Complete | 7/7 | ✅ Pass |
| 5 | Deal Aggregator | ✅ Complete | 6/6 | ✅ Pass |
| 6 | Social Layer | ✅ Complete | 10/10 | ✅ Pass |
| 7 | Web3 Abstraction | ✅ Complete | 9/9 | ✅ Pass |
| 8 | Staking/Cashback | ✅ Complete | 9/9 | B+ (85/100) |
| 9 | Loyalty System | ✅ Complete | 9/9 | A- (88/100) |
| 10 | Geo Discovery | ✅ Complete | 9/9 | A (90/100) |

- Circular progress indicator: 84/84 tasks (100%)

---

### **Story 12.6: User Experience & Design Showcase**

**User Story:** As a judge scoring UX, I want to see design quality and Web3 abstraction, so I can evaluate user experience.

**Acceptance Criteria:**
- UX highlights clearly communicated
- User flows visualized
- Screenshots gallery functional
- Performance metrics shown

#### Tasks

**T12.6.1: UX Highlights Section**
- 4 UX pillars:
  1. **Web3 Invisible**
     - No crypto jargon ("Coupon" not "NFT")
     - Wallet connection = "Connect"
     - Email/social login fallback (optional)
  2. **Guest Browsing**
     - Groupon-style marketplace homepage
     - Browse/search without authentication
     - Login prompted only when claiming
  3. **Mobile-First Design**
     - Responsive Tailwind breakpoints
     - Touch-optimized interactions
     - QR scanner camera-ready
  4. **MonkeDAO Branding**
     - Forest green (#0d2a13) + cream (#f2eecb)
     - Neon accent (#00ff4d)
     - Jungle-themed visual elements

**T12.6.2: User Flow Diagrams**
- 3 illustrated flows:
  1. **User Journey:**
     - Browse marketplace (guest)
     - Filter by category/location
     - Click "Claim Deal"
     - Connect wallet (Phantom/Solflare)
     - NFT minted to wallet
     - View in "My Coupons"
     - Generate QR code
     - Present to merchant
     - NFT burned → Deal redeemed
  2. **Merchant Journey:**
     - Connect wallet
     - Register as merchant
     - Create deal (upload, set discount, expiry)
     - Approve NFT mint transaction
     - View analytics (views, claims, redemptions)
     - Scan customer QR code
     - Approve burn transaction
     - Redemption logged
  3. **Redemption Flow Detail:**
     - User: Generate QR (coupon ID + signature)
     - Merchant: Scan QR with camera
     - System: Verify signature off-chain
     - Merchant: Approve burn transaction
     - Blockchain: Execute `redeem_coupon` instruction
     - Database: Log event (timestamp, user wallet, deal ID)

**T12.6.3: Screenshots Gallery**
- Lightbox gallery (click to enlarge):
  - Homepage (marketplace grid, trending deals)
  - Deal details page (discount badge, claim button)
  - Merchant dashboard (overview stats)
  - Create deal form (image upload, metadata)
  - My Coupons (NFT list, QR generation)
  - QR redemption scanner (camera interface)
  - Analytics charts (bar chart, pie chart)
  - Redemption history (table with filters)

**T12.6.4: Accessibility & Performance**
- WCAG compliance checkmarks:
  - ✅ Semantic HTML
  - ✅ Keyboard navigation
  - ✅ Alt text for images
  - ✅ ARIA labels
- Performance metrics:
  - Vercel Speed Insights integration
  - Bundle size optimized (<250KB initial load)
  - Lazy loading images
  - YouTube Lite embed (saves bandwidth)

---

### **Story 12.7: Feasibility & Scalability Evidence**

**User Story:** As a judge evaluating feasibility, I want to see real-world readiness, so I can score adoption potential.

**Acceptance Criteria:**
- Production readiness demonstrated
- Scalability strategy outlined
- Real integrations proven
- Merchant onboarding simplicity shown

#### Tasks

**T12.7.1: Production Readiness Highlights**
- Infrastructure deployed:
  - Frontend: Vercel (Next.js 15, edge functions)
  - Database: Supabase (PostgreSQL, us-east-1)
  - Blockchain: Solana Devnet (mainnet ready)
  - Storage: Arweave (production-ready) + Supabase (active fallback)
- Monitoring stack:
  - Sentry (error tracking - client/server/edge)
  - Vercel Analytics (usage metrics)
  - Speed Insights (Core Web Vitals)
  - Health checks (/api/health endpoint)
- Security measures:
  - CORS headers (configurable origins)
  - Rate limiting (3 tiers: strict/moderate/lenient)
  - Security headers (X-Frame-Options, CSP, etc.)
  - Input validation (Zod schemas)
- DevOps practices:
  - Docker support (multi-stage build)
  - Database backups (automated + manual guides)
  - Git hooks (Husky + lint-staged)
  - Bundle analyzer (performance optimization)

**T12.7.2: Scalability Design**
- Database optimization:
  - Indexed columns (merchant_id, deal_id, user_wallet)
  - Views for common queries (merchants_with_location)
  - Functions for distance calculations (calculate_distance_miles)
  - Connection pooling (Supabase default)
- RPC provider strategy:
  - Development: Solana devnet RPC
  - Production: Helius/QuickNode (100K requests/day)
  - Retry logic for failed transactions
  - Fallback RPC endpoints
- CDN for static assets:
  - Vercel Edge Network (global distribution)
  - Image optimization (Next.js Image component)
  - Arweave architecture (server-side API) + Supabase fallback for metadata
- Horizontal scaling:
  - Stateless API routes (Next.js serverless)
  - Database read replicas (Supabase Pro)
  - Edge caching (Vercel KV for sessions)

**T12.7.3: Real API Integrations**
- 3 external APIs live:
  1. **RapidAPI (Get Promo Codes)**
     - 1M+ coupons, 10K+ merchants
     - 1-hour cache (Redis/Vercel KV)
     - Mock fallback for dev/testing
     - "Partner Deal" badges in UI
  2. **Arweave (Permanent Storage)**
     - ✅ Architecture: Production-ready (server-side API routes)
     - ⏳ Live uploads: Requires mainnet AR tokens (~$5-10 to fund)
     - ✅ Fallback: Supabase working 100% (metadata publicly accessible)
     - Wallet: `sY6VBEWpDPmN6oL9Zt_8KjJMR1PWexpmWKEAojtbwsc`
     - NFT metadata + images (permanent URLs)
     - **Judge's Note:** See `docs/ARWEAVE-INTEGRATION-NOTE.md` for technical details
     - **Why Demo Uses Supabase:** Arweave requires AR tokens to pay for permanent storage (like AWS S3 but permanent). Architecture is complete; adding tokens activates live uploads.
  3. **MoonPay Commerce (USDC Payments)**
     - 8 paylinks ($1, $2, $5, $10, $15, $20, $25, $50)
     - Solana USDC payments
     - Widget: @heliofi/checkout-react
     - Test page: /test-payment

**T12.7.4: Merchant Onboarding Simplicity**
- Registration: 3-minute form (no blockchain knowledge)
- Deal creation: 5 clicks (upload → metadata → mint)
- NFT minting: One-click wallet approval
- Analytics: Auto-generated (no configuration)
- QR scanner: Camera-ready (no setup)

---

### **Story 12.8: Team & Development Process**

**User Story:** As a judge evaluating effort, I want to know who built this and how, so I can understand the work quality.

**Acceptance Criteria:**
- Team profile clear
- Development timeline shown
- Code quality practices documented

#### Tasks

**T12.8.1: Team Section**
- Developer profile card:
  - Name: RECTOR
  - Role: Senior Full-Stack Developer
  - Skills: Blockchain (Solana/Anchor), Full-Stack (Next.js/React), DevOps (Docker/Vercel)
  - GitHub: [Link to profile]
  - Location: Global (Remote)

**T12.8.2: Development Timeline**
- 14-day sprint (Oct 6 - Oct 20, 2025):
  - Day 1-2: Planning (PRD, TIMELINE, TRACK-REQUIREMENTS)
  - Day 3-5: Epic 1-3 (NFT Coupons, Merchant Dashboard, User Marketplace)
  - Day 6-8: Epic 4-6 (Redemption, Aggregator, Social)
  - Day 9-11: Epic 7-9 (Web3 Abstraction, Staking, Loyalty)
  - Day 12-13: Epic 10 (Geo Discovery)
  - Day 14: Merchant testing (M-08 through M-10)
  - Day 15: Epic 11 prep (Pitch deck, deployment)
- Methodology: Agile (Epic → Story → Task)
- Documentation: Comprehensive (PRD, execution plans, audit reports)

**T12.8.3: Code Quality Practices**
- Git workflow:
  - Feature branches (epic-X-feature-name)
  - Conventional commits (feat/fix/docs/refactor)
  - Pull request self-reviews
  - Main branch protection
- Testing:
  - Unit tests (Jest + React Testing Library)
  - Manual QA (27 user tests, 10 merchant tests)
  - Automated E2E (Playwright MCP + Supabase MCP)
  - Self-audits for each Epic (10 audit reports)
- Code review:
  - Self-audits documented (docs/audits/)
  - Code quality scores (85-90/100)
  - Issue tracking (GitHub issues)
  - Continuous improvement (refactoring after audits)

---

### **Story 12.9: Links & Resources Hub**

**User Story:** As a judge, I want quick access to all submission materials, so I can evaluate thoroughly.

**Acceptance Criteria:**
- Primary links prominent
- Documentation accessible
- Blockchain verification easy
- Contact information provided

#### Tasks

**T12.9.1: Primary Links (Large CTA Buttons)**
- 4 main CTAs (button-sized, icon + label):
  1. 🚀 **Live Demo** → Production URL
  2. 💻 **GitHub Repository** → Source code
  3. 🎥 **Demo Video** → YouTube link
  4. 📄 **Technical Write-up** → PDF download

**T12.9.2: Documentation Links**
- Quick links grid:
  - README.md (Project overview)
  - CLAUDE.md (Development context)
  - API Documentation (Endpoints reference)
  - User Guides:
    - Manual Testing Guide (27 user tests)
    - Merchant Testing Guide (10 merchant tests)
    - Guest User UI Test Results
  - Audit Reports (Epic 1-10)

**T12.9.3: Blockchain Verification**
- Solana Explorer links:
  - Program Address: `RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7`
  - Example NFT mint transaction
  - Example redemption (burn) transaction
- Arweave links:
  - Example metadata URL
  - Example image URL

**T12.9.4: Contact & Support**
- Contact methods:
  - GitHub: [@RECTOR] (issues, discussions)
  - Telegram: [Handle if available]
  - Email: [Contact email]
- Support resources:
  - GitHub Issues (bug reports)
  - CONTRIBUTING.md (contribution guide)
  - SECURITY.md (vulnerability disclosure)

---

### **Story 12.10: Technical Write-up PDF Generation**

**User Story:** As a judge, I want a detailed technical document, so I can review offline and understand design decisions.

**Acceptance Criteria:**
- 2-4 page PDF document
- Diagrams included
- Code snippets provided
- Professional formatting

#### Tasks

**T12.10.1: Generate Technical Write-up Document (2-4 pages)**
- Sections:
  1. **Executive Summary** (0.5 page)
     - Problem statement
     - Solution overview
     - Key innovations
  2. **Architecture & Design** (1 page)
     - 3-layer stack diagram
     - Hybrid on-chain/off-chain design
     - Database schema
     - Smart contract structure
  3. **Web3 Integration Challenges** (0.5 page)
     - NFT representation (Metaplex standard)
     - Redemption flow (QR + signature → burn)
     - UX abstraction (wallet adapter)
     - Merchant onboarding (no-code approach)
     - Marketplace liquidity (resale + aggregation)
  4. **Implementation Details** (1 page)
     - Tech stack breakdown
     - Code quality practices
     - Testing strategy
     - Production readiness measures
  5. **UX/UI Design Philosophy** (0.5 page)
     - Web3 invisible principles
     - Guest-first approach
     - MonkeDAO branding
     - Mobile-first responsive
  6. **Scalability & Future Roadmap** (0.5 page)
     - Database optimization
     - RPC strategy (Helius/QuickNode)
     - Mainnet deployment plan
     - Feature roadmap (v2.0 ideas)
  7. **Conclusion** (0.25 page)
     - Summary of achievements
     - Competitive advantages
     - Call to action (try the demo)

**T12.10.2: Include Diagrams**
- Architecture diagram (3-layer stack)
- User flow diagram (Browse → Claim → Redeem)
- Database schema (ERD)
- Redemption flow (sequence diagram)

**T12.10.3: Add Code Snippets**
- NFT minting function (Anchor program):
  ```rust
  pub fn create_coupon(ctx: Context<CreateCoupon>, metadata: CouponMetadata) -> Result<()> {
      // Mint NFT with Metaplex
      // ...
  }
  ```
- Redemption verification (API route):
  ```typescript
  export async function POST(request: Request) {
      // Verify signature
      // Burn NFT
      // Log event
  }
  ```
- QR generation (Frontend):
  ```typescript
  const qrData = {
      couponId: deal.id,
      signature: signedMessage,
      timestamp: Date.now()
  };
  ```

**Technical Notes:**
- Use Markdown → PDF conversion (md-to-pdf or similar)
- Or manually create in Google Docs → Export PDF
- Styling: MonkeDAO branding (forest green headers, cream background)
- File size: <5MB for easy download

---

### **Story 12.11: Interactive Elements & Polish**

**User Story:** As a judge, I want an engaging experience, so the pitch deck stands out from competitors.

**Acceptance Criteria:**
- Smooth scroll animations
- Interactive demos functional
- Progress indicators animated
- MonkeDAO branding consistent
- SEO optimized

#### Tasks

**T12.11.1: Scroll Animations (Framer Motion)**
- Fade-in on scroll for each section
- Stagger animation for grid items
- Parallax effect for hero background
- Smooth scroll behavior (CSS: scroll-smooth)

**T12.11.2: Interactive Demos**
- Embedded marketplace preview:
  - iframe of live marketplace (or screenshot with click-through)
  - "Try it live" button → opens demo in new tab
- Feature tour (click-through walkthrough):
  - Step 1: Browse deals
  - Step 2: Claim coupon
  - Step 3: Generate QR
  - Step 4: Redeem
- Screenshot lightbox gallery:
  - Click to enlarge
  - Navigation arrows (prev/next)
  - Close button (Esc key support)

**T12.11.3: Progress Indicators**
- Circular progress for Epic completion:
  - Animated from 0% → 100%
  - Green stroke (#00ff4d)
  - Large "84/84" label in center
- Feature completion checkmarks:
  - Animate checkmarks on scroll into view
  - Green checkmark icon (✅)
  - Staggered appearance (0.1s delay each)
- Timeline visualization:
  - Horizontal timeline (Day 1 → Day 15)
  - Milestones marked (Epic 1-10 completion)
  - Current date indicator (if before deadline)

**T12.11.4: MonkeDAO Branding**
- Color palette:
  - Primary: #0d2a13 (forest green)
  - Background: #f2eecb (cream)
  - Accent: #00ff4d (neon green)
  - Text: #0d2a13 (dark green)
- Gradient backgrounds:
  - Hero: linear-gradient(135deg, #0d2a13 0%, #174622 100%)
  - Section dividers: subtle green gradients
- Jungle-themed accents:
  - Leaf SVG icons
  - Monke emoji (🐵) in headings
  - Forest texture backgrounds (subtle)

**T12.11.5: SEO & Metadata**
- Meta tags:
  ```html
  <title>DealCoupon - MonkeDAO Hackathon Pitch Deck</title>
  <meta name="description" content="Web3 Deal Discovery Platform - Groupon Meets DeFi. MonkeDAO Cypherpunk Hackathon Submission." />
  ```
- Open Graph tags (social sharing):
  ```html
  <meta property="og:title" content="DealCoupon - Hackathon Pitch Deck" />
  <meta property="og:description" content="10/10 Epics Complete | Production-Ready Deal Marketplace" />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:url" content="https://dealcoupon.xyz/pitch-deck" />
  ```
- Twitter Card tags:
  ```html
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="DealCoupon - MonkeDAO Hackathon" />
  ```
- Favicon: MonkeDAO logo or custom D icon

---

### **Story 12.12: Responsive Design & Testing**

**User Story:** As a judge reviewing on mobile, I want the pitch deck to work perfectly, so I can evaluate anywhere.

**Acceptance Criteria:**
- Mobile responsive (320px → 1920px)
- Cross-browser compatible (Chrome, Firefox, Safari)
- Performance optimized (<2s load)

#### Tasks

**T12.12.1: Mobile Responsive Design**
- Tailwind breakpoints:
  - sm: 640px (mobile landscape)
  - md: 768px (tablet)
  - lg: 1024px (desktop)
  - xl: 1280px (large desktop)
- Responsive adjustments:
  - Hero: Single column on mobile, video below headline
  - Navigation: Hamburger menu on mobile, full nav on desktop
  - CTAs: Full-width buttons on mobile, inline on desktop
  - Grids: 1 column (mobile) → 2 columns (tablet) → 3-4 columns (desktop)
  - Screenshots: Stack vertically on mobile, grid on desktop
- Touch optimization:
  - Larger tap targets (min 44x44px)
  - Swipe gestures for galleries
  - No hover-only interactions

**T12.12.2: Browser Compatibility Testing**
- Chrome (latest)
- Firefox (latest)
- Safari (macOS + iOS)
- Edge (Chromium)
- Video embed fallbacks:
  - YouTube iframe (primary)
  - Static thumbnail with "Play on YouTube" link (fallback)
- PDF download tested:
  - Chrome: Direct download
  - Safari: Open in new tab
  - Mobile: Share sheet

**T12.12.3: Performance Optimization**
- Lazy load images:
  - Next.js Image component with loading="lazy"
  - Intersection Observer for screenshots
- Video embed optimization:
  - YouTube Lite component (loads iframe on click)
  - Saves ~500KB initial load
- Bundle size:
  - Code splitting (React.lazy for heavy components)
  - Tree shaking (import only used icons)
  - Minimize dependencies
- Target metrics:
  - First Contentful Paint: <1.5s
  - Largest Contentful Paint: <2.5s
  - Time to Interactive: <3.0s
  - Total bundle size: <300KB (gzipped)

---

## Technical Stack

**Dependencies:**
- framer-motion@^11.0.0 (animations)
- react-player@^2.14.0 (YouTube embed)
- qrcode.react@^3.1.0 (QR generation demo)
- lucide-react@^0.300.0 (icons)

**File Structure:**
```
src/frontend/app/pitch-deck/
├── page.tsx (main component)
├── components/
│   ├── HeroSection.tsx
│   ├── VideoHero.tsx (premium video component - stunning design)
│   ├── ProblemSolution.tsx
│   ├── InnovationShowcase.tsx
│   ├── TechStack.tsx
│   ├── FeaturesMatrix.tsx
│   ├── UXShowcase.tsx
│   ├── ScalabilitySection.tsx
│   ├── TeamSection.tsx
│   ├── ResourcesHub.tsx
│   └── CTAButtons.tsx
└── assets/
    ├── architecture-diagram.svg
    ├── user-flow.svg
    ├── screenshots/ (8-10 images)
    └── technical-writeup.pdf
```

---

## Implementation Timeline

**Estimated Effort:** 4-6 hours

**Breakdown:**
- Story 12.1-12.3 (Hero, Problem, Innovation): 1.5 hours
- Story 12.4-12.6 (Tech, Features, UX): 1.5 hours
- Story 12.7-12.9 (Scalability, Team, Resources): 1 hour
- Story 12.10 (Technical Write-up PDF): 1 hour
- Story 12.11-12.12 (Polish, Testing): 1 hour

**Critical Path:**
1. Create basic structure (page.tsx + sections)
2. Implement content for each section
3. Add animations and interactivity
4. Generate technical write-up PDF
5. Test responsive design
6. Deploy and verify

---

## Success Criteria Summary

**Must-Have (P0):**
- ✅ All 5 judging criteria addressed
- ✅ All submission requirements provided
- ✅ Page loads in <2 seconds
- ✅ Mobile responsive
- ✅ MonkeDAO branding consistent

**Should-Have (P1):**
- ✅ Interactive demos (marketplace embed)
- ✅ Animated progress indicators
- ✅ Downloadable PDF write-up
- ✅ **Premium video component** (stunning design with ambient glow, animations, MonkeDAO branding)

**Nice-to-Have (P2):**
- Click-through feature tour
- Live chat widget (support)
- Analytics tracking (page views, time on page)

---

## Risks & Mitigations

**Risk:** Video embed fails on some browsers
**Mitigation:** Fallback to static thumbnail + YouTube link

**Risk:** PDF generation complex
**Mitigation:** Use Google Docs → PDF export as manual fallback

**Risk:** Page too long (judges lose interest)
**Mitigation:** Sticky nav for quick jumping, concise sections

**Risk:** Mobile performance poor (large images)
**Mitigation:** Lazy loading, Next.js Image optimization, WebP format

---

## Approval & Next Steps

**Approved by:** RECTOR
**Date:** 2025-10-20
**Status:** Ready for Implementation

**Next Actions:**
1. Create page structure (`app/pitch-deck/page.tsx`)
2. Implement sections sequentially (Story 12.1 → 12.12)
3. Generate technical write-up PDF
4. Test on multiple devices/browsers
5. Deploy to staging → production
6. Share with judges via Superteam Earn

---

**Bismillah! Tawfeeq min Allah.** 🚀
