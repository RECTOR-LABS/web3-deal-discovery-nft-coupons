# Track Requirements Checklist

**Hackathon:** Cypherpunk - MonkeDAO Track
**Project:** Web3 Deal Discovery & Loyalty Platform with NFT Coupons
**Last Updated:** October 16, 2025

---

## Core Features Checklist

### 1. NFT Promotions / Coupons ⭐ CRITICAL
- [ ] Design NFT metadata structure
  - [ ] Include discount percentage
  - [ ] Include expiry date
  - [ ] Include merchant ID
  - [ ] Include redemption rules
  - [ ] Include category/tags
- [ ] Implement smart contract for NFT minting
  - [ ] Use Metaplex Token Metadata standard
  - [ ] Implement transferability
  - [ ] Add redemption/burn mechanism
- [ ] Store metadata on permanent storage (Arweave/IPFS)
- [ ] Test NFT minting flow end-to-end
- [ ] Handle NFT lifecycle (mint → transfer → redeem → burn)

**Completion Criteria:** NFT coupons can be minted with full metadata and transferred between wallets.

---

### 2. Merchant Dashboard ⭐ CRITICAL
- [ ] Design merchant dashboard UI/UX
  - [ ] Wireframe key screens (create deal, analytics, settings)
  - [ ] Mobile-responsive design
- [ ] Implement authentication
  - [ ] Wallet connection (Solana Wallet Adapter)
  - [ ] Optional: Email/social login (Privy/Dynamic)
  - [ ] Role-based access control (merchant vs user)
- [ ] Build "Create Promotion" flow
  - [ ] Form: title, description, discount %, expiry, quantity
  - [ ] Image upload for deal visual
  - [ ] Preview before minting
  - [ ] Mint NFT on submission
- [ ] Build merchant analytics
  - [ ] Views, purchases, redemptions
  - [ ] Revenue tracking
  - [ ] Performance comparison
- [ ] Merchant profile management
  - [ ] Business info, logo, contact
  - [ ] Active/expired deals listing

**Completion Criteria:** Merchant can create a promotion that automatically mints NFT coupons visible in the marketplace.

---

### 3. User Wallet & Marketplace ⭐ CRITICAL
- [ ] Design user marketplace UI/UX
  - [ ] Browse/search deals interface
  - [ ] Deal detail page
  - [ ] My Coupons wallet view
  - [ ] Mobile-first design
- [ ] Implement wallet integration
  - [ ] Connect wallet (Phantom, Solflare, Backpack)
  - [ ] Display user's NFT coupons
  - [ ] Show SOL balance
- [ ] Build marketplace functionality
  - [ ] Browse available deals (grid/list view)
  - [ ] Filter by category, discount, expiry
  - [ ] Search functionality
  - [ ] Sort by newest, discount %, ending soon
- [ ] Implement purchase flow
  - [ ] "Claim Deal" / "Buy Coupon" button
  - [ ] Transaction confirmation modal
  - [ ] Success/failure feedback
  - [ ] NFT appears in user wallet
- [ ] Build re-listing feature
  - [ ] List owned NFT for resale
  - [ ] Set resale price
  - [ ] Delist option
  - [ ] Marketplace fee structure (2-5%)

**Completion Criteria:** User can browse deals, purchase NFT coupons, and re-list them for resale.

---

### 4. Redemption Verification Flow ⭐ CRITICAL
- [ ] Design redemption UX
  - [ ] User flow: select coupon → generate QR → merchant scans
  - [ ] Merchant flow: scan QR → verify → confirm redemption
  - [ ] Error handling (expired, already redeemed, invalid)
- [ ] Implement QR code generation
  - [ ] QR contains: NFT mint address, user signature, timestamp
  - [ ] Display QR in user's "My Coupons" view
- [ ] Build merchant scanning interface
  - [ ] QR scanner (use device camera)
  - [ ] Verify NFT ownership off-chain (fast check)
  - [ ] Display deal details for merchant approval
- [ ] Implement on-chain redemption
  - [ ] Burn NFT on redemption (single-use enforcement)
  - [ ] OR mark as redeemed in NFT metadata (multi-use coupons)
  - [ ] Record redemption event on-chain
- [ ] Handle edge cases
  - [ ] Network failures during redemption
  - [ ] Concurrent redemption attempts
  - [ ] Expired coupons
  - [ ] Fraudulent QR codes

**Completion Criteria:** User can present QR code, merchant can scan and verify, NFT is redeemed on-chain with single-use guarantee.

---

## Should-Have Features (Competitive Advantage)

### 5. Deal Aggregator Feed
- [ ] Research API options (Skyscanner, Booking.com, RapidAPI, Shopify)
- [ ] Implement at least ONE external API integration
  - [ ] Fetch live deals from API
  - [ ] Normalize data to platform format
  - [ ] Display in marketplace feed
  - [ ] Handle API rate limits and errors
- [ ] Create aggregator feed UI
  - [ ] Mix platform-native and aggregated deals
  - [ ] Label source ("Partner Deal" vs "Platform Deal")
- [ ] Implement caching strategy
  - [ ] Cache API responses (reduce costs)
  - [ ] Refresh periodically (hourly or daily)

**Completion Criteria:** Marketplace shows at least one live deal from external API alongside platform-minted NFTs.

---

### 6. Social Discovery Layer
- [ ] Design social features UI
  - [ ] Comments section on deal pages
  - [ ] Rating/review system (stars + text)
  - [ ] Share buttons (Twitter, Telegram, copy link)
- [ ] Implement community features
  - [ ] Upvote/downvote deals (Reddit-style)
  - [ ] User-generated tags
  - [ ] "Deal of the Day" voting
  - [ ] Trending deals algorithm
- [ ] Build engagement hooks
  - [ ] Share-to-earn referral system
  - [ ] Social proof ("X people claimed this")
  - [ ] Activity feed ("Recent Claims", "Top Savers")
- [ ] Integrate viral mechanics
  - [ ] Referral tracking (on-chain or off-chain)
  - [ ] Referral rewards (bonus NFTs, discounts)
  - [ ] Shareable deal cards with embed preview

**Completion Criteria:** Users can comment, rate, and share deals; platform has social engagement features driving virality.

---

## Nice-to-Have Features (Bonus Points)

### 7. Reward Staking / Cashback
- [ ] Design token economics (if creating platform token)
- [ ] Implement staking smart contract
  - [ ] Stake NFT coupons for rewards
  - [ ] Unstake mechanism
  - [ ] Reward distribution logic
- [ ] Build cashback system
  - [ ] Track redemptions for cashback eligibility
  - [ ] Distribute rewards (SOL, USDC, or platform token)
- [ ] Create staking UI
  - [ ] Stake/unstake interface
  - [ ] Display APY and rewards
  - [ ] Claim rewards button

**Completion Criteria:** Users can stake NFT coupons and earn rewards (platform token or cashback).

---

### 8. On-Chain Reputation / Loyalty System (Bonus Challenge)
- [ ] Design NFT badge system
  - [ ] Milestone badges (10 deals, 50 deals, $500 saved)
  - [ ] Loyalty tiers (Bronze, Silver, Gold)
  - [ ] Special event badges
- [ ] Implement badge minting
  - [ ] Auto-mint on milestone achievement
  - [ ] Badge metadata and visuals
- [ ] Build reputation dashboard
  - [ ] Display user badges
  - [ ] Show stats (total savings, deals claimed, redemptions)
  - [ ] Leaderboards (top savers, most active)
- [ ] Integrate reputation benefits
  - [ ] Early access to flash sales
  - [ ] Exclusive deals for high-tier users
  - [ ] Marketplace visibility boost

**Completion Criteria:** Users earn NFT badges for milestones; badges provide tangible benefits.

---

### 9. Geo-Based Discovery (Bonus Challenge)
- [ ] Implement location detection
  - [ ] Browser geolocation API
  - [ ] User can set location manually
- [ ] Add geo-filtering to marketplace
  - [ ] "Deals near me" filter
  - [ ] Distance-based sorting
  - [ ] Map view of nearby deals
- [ ] Merchant location management
  - [ ] Add location to merchant profile
  - [ ] Support multiple locations (chains)
  - [ ] Geo-verification for redemption (optional)

**Completion Criteria:** Users can discover deals based on their location with "Near Me" filtering.

---

### 10. Group Deals / Pooled Discounts (Bonus Challenge)
- [ ] Design group deal mechanics
  - [ ] Tiered discounts (10 people = 20% off, 50 people = 40% off)
  - [ ] Minimum participants threshold
  - [ ] Time-limited pooling window
- [ ] Implement pooling smart contract
  - [ ] Collect commitments from users
  - [ ] Unlock discount tier when threshold met
  - [ ] Refund if threshold not met
- [ ] Build group deal UI
  - [ ] Show progress to next tier ("5 more people needed")
  - [ ] Countdown timer
  - [ ] Invite friends feature
  - [ ] Share group deal link

**Completion Criteria:** Users can join group deals that unlock higher discounts when more participants join.

---

## Web3 Integration Challenges - Solutions Checklist

### Challenge 1: NFT Coupon Representation
- [ ] Choose metadata standard (Metaplex Token Metadata ✅)
- [ ] Define comprehensive metadata schema
- [ ] Include all required attributes (discount, expiry, merchant, etc.)
- [ ] Test metadata rendering in wallets (Phantom, Solflare)
- [ ] Ensure compatibility with NFT marketplaces

**Documentation:** Explain metadata choices in submission write-up.

---

### Challenge 2: Redemption Flow Design
- [ ] Decide: Off-chain + on-chain attestation OR pure smart-contract logic
- [ ] Implement chosen approach
- [ ] Test redemption flow for speed and reliability
- [ ] Handle network failures gracefully
- [ ] Ensure single-use enforcement (prevent double-spend)

**Documentation:** Diagram redemption flow in submission write-up.

---

### Challenge 3: Web3 Abstraction for Mainstream Users
- [ ] Implement email/social login (Privy, Dynamic, or Magic)
- [ ] Create embedded wallets (users don't see wallet)
- [ ] Support fiat payments (Stripe → auto-buy SOL)
- [ ] Hide crypto terminology
  - [ ] "NFT" → "Coupon"
  - [ ] "Mint" → "Create Deal"
  - [ ] "Wallet" → "My Coupons"
- [ ] Sponsor gas fees (merchant or platform covers)
  - [ ] Use Solana's fee payer mechanism
  - [ ] OR bundle fees into deal pricing

**Documentation:** Explain UX abstraction strategy in submission write-up.

---

### Challenge 4: Small Business Onboarding
- [ ] Create dead-simple merchant onboarding flow
  - [ ] 3-step wizard: Business Info → First Deal → Launch
  - [ ] No crypto knowledge required
- [ ] Automate NFT issuance
  - [ ] Merchant fills form → platform mints NFT
  - [ ] Merchant never touches smart contracts
- [ ] Support existing catalogs
  - [ ] CSV import for bulk deals
  - [ ] Shopify/WooCommerce API integration (optional)
- [ ] Provide merchant education
  - [ ] Onboarding tooltips
  - [ ] FAQ / Help Center
  - [ ] Video tutorial (optional)

**Documentation:** Explain merchant onboarding strategy in submission write-up.

---

### Challenge 5: Marketplace for Unused Coupons
- [ ] Implement listing/delisting functionality
- [ ] Set marketplace fee structure (2-5% on resales)
- [ ] Build price discovery mechanism
  - [ ] Fixed price listings
  - [ ] OR Dutch auction (price decreases over time)
- [ ] Implement search and filtering
  - [ ] By discount %, category, expiry
  - [ ] Sort by lowest price, ending soon
- [ ] Handle expiry edge cases
  - [ ] Auto-delist expired coupons
  - [ ] Notify buyers of near-expiry coupons
  - [ ] Refund policy for expired post-purchase (optional)

**Documentation:** Explain marketplace mechanics in submission write-up.

---

## Submission Requirements Checklist

### 1. Deployed Application / Prototype
- [ ] Deploy frontend (Vercel, Netlify, or similar)
- [ ] Deploy smart contracts (Solana Devnet or Mainnet-beta)
- [ ] Ensure live demo is accessible
- [ ] Test all features in deployed environment
- [ ] Public URL ready for judges

**Deliverable:** Live demo URL

---

### 2. GitHub Repository
- [ ] Create public GitHub repository
- [ ] Push all code (frontend, backend, contracts)
- [ ] Write comprehensive README.md
  - [ ] Project description
  - [ ] Tech stack
  - [ ] Setup instructions (step-by-step)
  - [ ] Environment variables needed
  - [ ] How to run locally
  - [ ] Deployment instructions
- [ ] Add screenshots/GIFs to README
- [ ] Include LICENSE file
- [ ] Clean up code (remove commented code, TODOs)
- [ ] Add code comments for complex logic

**Deliverable:** GitHub repo URL with clear instructions

---

### 3. Demo Video (3-5 minutes)
- [ ] Write video script
  - [ ] Intro: Problem statement (30 sec)
  - [ ] Demo: Core features (2-3 min)
  - [ ] Innovation: Key differentiators (1 min)
  - [ ] Outro: Call-to-action (30 sec)
- [ ] Record screen capture
  - [ ] Use Loom, OBS, or QuickTime
  - [ ] 1080p resolution minimum
  - [ ] Clear audio (use good microphone)
- [ ] Edit video
  - [ ] Add captions/text overlays
  - [ ] Smooth transitions
  - [ ] Background music (optional, subtle)
  - [ ] Keep under 5 minutes
- [ ] Upload to YouTube (unlisted or public)
- [ ] Test video playback

**Deliverable:** YouTube video URL

---

### 4. Written Documentation / Write-Up
- [ ] Explain design choices
  - [ ] Why Solana? Why Metaplex?
  - [ ] Tech stack justification
  - [ ] Architecture decisions
- [ ] Document technical implementation
  - [ ] Smart contract architecture
  - [ ] Database schema
  - [ ] API integrations
  - [ ] Security considerations
- [ ] Address Web3 integration challenges
  - [ ] How each challenge was solved
  - [ ] Trade-offs made
  - [ ] Future improvements
- [ ] Describe user flows
  - [ ] User journey: discover → purchase → redeem
  - [ ] Merchant journey: onboard → create deal → track analytics
- [ ] Highlight innovations
  - [ ] What's unique about your solution?
  - [ ] How does it improve on existing platforms?

**Deliverable:** PDF or Markdown document (2-4 pages)

---

### 5. API Exposure / Integration Design
- [ ] Decide: Public API or integration-friendly architecture?
- [ ] If public API:
  - [ ] Document API endpoints
  - [ ] Provide API key mechanism
  - [ ] Write API usage examples
- [ ] If integration-friendly:
  - [ ] Explain how others can integrate
  - [ ] Provide webhooks or SDKs (optional)
  - [ ] Document data models

**Deliverable:** API documentation or integration guide

---

### 6. Submit via Superteam Earn
- [ ] Go to hackathon page: https://earn.superteam.fun/listing/build-a-web3-deal-discovery-and-loyalty-platform-with-nft-coupons
- [ ] Click "Submit Now"
- [ ] Fill submission form
  - [ ] Project title
  - [ ] Description
  - [ ] Live demo URL
  - [ ] GitHub repo URL
  - [ ] Video URL
  - [ ] Documentation URL/attachment
  - [ ] Team members (if applicable)
- [ ] Review submission before final submit
- [ ] Submit at least 24-48 hours before deadline (buffer for issues)
- [ ] Confirm submission received

**Deliverable:** Submission confirmation

---

## Quality Assurance Checklist

### Code Quality
- [ ] No console errors in browser
- [ ] No TypeScript errors (if using TypeScript)
- [ ] Linter passing (ESLint, Prettier)
- [ ] No hardcoded secrets or private keys
- [ ] Environment variables documented
- [ ] Code is readable and well-structured

### User Experience
- [ ] All buttons and links work
- [ ] Forms have validation and error messages
- [ ] Loading states for async operations
- [ ] Mobile-responsive design
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Fast load times (<3 seconds)

### Blockchain Integration
- [ ] Smart contracts deployed and verified
- [ ] Wallet connection works (Phantom, Solflare, Backpack)
- [ ] Transactions succeed on-chain
- [ ] NFT metadata displays correctly in wallets
- [ ] Gas fees are reasonable or sponsored
- [ ] Handle transaction failures gracefully

### Testing
- [ ] Test all user flows manually
- [ ] Test merchant flows manually
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test with real wallet (not just mocks)
- [ ] Test edge cases (network failures, expired coupons, etc.)

---

## Progress Tracking

**Legend:**
- [ ] Not Started
- [⏳] In Progress
- [✅] Completed
- [⚠️] Blocked
- [❌] Skipped

**Current Phase:** [ ] Phase 1: Foundation | [ ] Phase 2: Core Features | [ ] Phase 3: Differentiation | [ ] Phase 4: Submission

**Overall Completion:** 0% (update as features are completed)

---

## Notes & Decisions Log

_Use this section to document key decisions, blockers, and learnings during development._

### Date: [YYYY-MM-DD]
**Decision:** [What was decided]
**Reason:** [Why this decision was made]
**Impact:** [How it affects the project]

---

## Resources & References

### Solana Development
- Solana Docs: https://docs.solana.com/
- Anchor Framework: https://www.anchor-lang.com/
- Solana Cookbook: https://solanacookbook.com/

### Metaplex
- Metaplex Docs: https://docs.metaplex.com/
- Token Metadata Standard: https://docs.metaplex.com/programs/token-metadata/

### APIs
- RapidAPI (Deals): https://rapidapi.com/
- Skyscanner API: https://developers.skyscanner.net/
- Booking.com API: https://www.booking.com/affiliate-program/

### UX Inspiration
- Groupon: https://www.groupon.com/
- Honey (browser extension): https://www.joinhoney.com/
- RedFlagDeals: https://www.redflagdeals.com/

---

**Last Updated:** October 16, 2025
**Next Review:** [Set milestone review dates]
