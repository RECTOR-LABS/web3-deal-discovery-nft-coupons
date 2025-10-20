# Project Timeline & Milestones

**Project:** Web3 Deal Discovery & Loyalty Platform with NFT Coupons
**Hackathon:** Cypherpunk - MonkeDAO Track
**Submission Deadline:** ~October 30, 2025 (14 days from Oct 16, 2025)
**Winner Announcement:** November 14, 2025

---

## Timeline Overview

**Total Duration:** 14 days
**Development Sprint:** 12 days (Oct 16 - Oct 28)
**Buffer/Polish:** 2 days (Oct 28 - Oct 30)
**Submission:** October 30, 2025 (24-48h before deadline)

---

## Phase 1: Foundation (Days 1-3)
**Duration:** October 16-18, 2025 (3 days)
**Goal:** Solid architecture + core smart contracts
**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

### Day 1: October 16, 2025 (Setup & Architecture)
- [ ] **Morning: Environment Setup**
  - [ ] Install Solana CLI
  - [ ] Install Anchor framework
  - [ ] Install Rust and cargo
  - [ ] Set up Solana wallet (Phantom/Solflare)
  - [ ] Fund wallet with devnet SOL
  - [ ] Initialize git repository

- [ ] **Afternoon: Project Architecture**
  - [ ] Design system architecture diagram
  - [ ] Define tech stack (finalize choices)
  - [ ] Design database schema
  - [ ] Plan API structure
  - [ ] Set up project structure (frontend + contracts)

- [ ] **Evening: Smart Contract Design**
  - [ ] Design NFT coupon data structure
  - [ ] Plan smart contract functions (mint, transfer, redeem, burn)
  - [ ] Research Metaplex integration approach

**Milestone:** Architecture documented, development environment ready

---

### Day 2: October 17, 2025 (Smart Contracts I)
- [ ] **Morning: NFT Coupon Contract**
  - [ ] Initialize Anchor project
  - [ ] Create NFT coupon program
  - [ ] Implement mint function
  - [ ] Define metadata structure

- [ ] **Afternoon: Contract Functions**
  - [ ] Implement transfer logic
  - [ ] Implement redemption/burn mechanism
  - [ ] Add merchant controls (issuance limits)
  - [ ] Write unit tests

- [ ] **Evening: Metaplex Integration**
  - [ ] Integrate Metaplex Token Metadata
  - [ ] Test NFT creation
  - [ ] Verify metadata on-chain

**Milestone:** NFT coupon smart contracts functional and tested

---

### Day 3: October 18, 2025 (Frontend Foundation)
- [ ] **Morning: Frontend Setup**
  - [ ] Initialize Next.js project
  - [ ] Install dependencies (Tailwind, Solana Wallet Adapter)
  - [ ] Set up folder structure
  - [ ] Configure Tailwind CSS

- [ ] **Afternoon: Wallet Integration**
  - [ ] Implement Solana Wallet Adapter
  - [ ] Create wallet connection UI
  - [ ] Test wallet connection (Phantom, Solflare, Backpack)
  - [ ] Handle connection states and errors

- [ ] **Evening: Database & API Setup**
  - [ ] Set up Supabase/PostgreSQL
  - [ ] Create initial database tables (merchants, deals, users)
  - [ ] Set up Next.js API routes
  - [ ] Implement basic CRUD operations

**Milestone:** Wallet connection working, database ready, smart contracts deployed to devnet

**Phase 1 Deliverable:** Working smart contracts + wallet integration

---

## Phase 2: Core Features (Days 4-8)
**Duration:** October 19-23, 2025 (5 days)
**Goal:** MVP with must-have features
**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

### Day 4: October 19, 2025 (Merchant Dashboard I)
- [ ] **Morning: Authentication**
  - [ ] Implement merchant registration
  - [ ] Add role-based access control
  - [ ] Create merchant profile pages

- [ ] **Afternoon: Dashboard UI**
  - [ ] Design merchant dashboard layout
  - [ ] Create navigation and sidebar
  - [ ] Build analytics overview page

- [ ] **Evening: Create Deal Form**
  - [ ] Build promotion creation form
  - [ ] Add form validation
  - [ ] Implement image upload

**Milestone:** Merchant can register and access dashboard

---

### Day 5: October 20, 2025 (Merchant Dashboard II)
- [ ] **Morning: Deal Minting**
  - [ ] Connect form to smart contract
  - [ ] Implement NFT minting on deal creation
  - [ ] Upload metadata to Arweave/IPFS
  - [ ] Show transaction status

- [ ] **Afternoon: Merchant Analytics**
  - [ ] Display active deals
  - [ ] Show views, purchases, redemptions
  - [ ] Create simple charts/graphs
  - [ ] Export data functionality (optional)

- [ ] **Evening: Testing & Polish**
  - [ ] Test full merchant flow
  - [ ] Fix bugs
  - [ ] Improve UX

**Milestone:** Merchant can create promotions that mint NFT coupons

---

### Day 6: October 21, 2025 (User Marketplace I)
- [ ] **Morning: Marketplace UI**
  - [ ] Design marketplace layout (grid/list)
  - [ ] Create deal card component
  - [ ] Build deal detail page
  - [ ] Add loading states

- [ ] **Afternoon: Browse & Search**
  - [ ] Fetch deals from database
  - [ ] Implement search functionality
  - [ ] Add category filters
  - [ ] Add sort options (newest, discount %, ending soon)

- [ ] **Evening: My Coupons View**
  - [ ] Fetch user's NFT coupons from wallet
  - [ ] Display owned coupons
  - [ ] Show coupon details (expiry, discount, merchant)

**Milestone:** Users can browse deals and see their owned coupons

---

### Day 7: October 22, 2025 (User Marketplace II)
- [ ] **Morning: Purchase Flow**
  - [ ] Implement "Claim Deal" / "Buy Coupon" button
  - [ ] Create transaction confirmation modal
  - [ ] Handle transaction (call smart contract)
  - [ ] Show success/failure feedback

- [ ] **Afternoon: Re-listing Feature**
  - [ ] Build "List for Resale" functionality
  - [ ] Create listing form (set price)
  - [ ] Implement delist option
  - [ ] Add marketplace fee logic (2-5%)

- [ ] **Evening: Testing**
  - [ ] Test purchase flow end-to-end
  - [ ] Test re-listing and buying resold coupons
  - [ ] Fix edge cases

**Milestone:** Users can purchase and re-list NFT coupons

---

### Day 8: October 23, 2025 (Redemption Flow)
- [ ] **Morning: QR Code Generation**
  - [ ] Implement QR code generation for coupons
  - [ ] Include NFT mint address, user signature, timestamp
  - [ ] Display QR in "My Coupons" view
  - [ ] Add "Redeem at Merchant" button

- [ ] **Afternoon: Merchant Scanning**
  - [ ] Build QR scanner interface (use device camera)
  - [ ] Implement QR decode logic
  - [ ] Verify NFT ownership off-chain
  - [ ] Display deal details for merchant approval

- [ ] **Evening: On-Chain Redemption**
  - [ ] Implement burn/redeem function call
  - [ ] Record redemption event on-chain
  - [ ] Handle redemption confirmation
  - [ ] Test single-use enforcement

**Milestone:** End-to-end redemption flow working (user → QR → merchant scan → on-chain redeem)

**Phase 2 Deliverable:** MVP with all core features (mint → purchase → redeem)

---

## Phase 3: Differentiation (Days 9-11)
**Duration:** October 24-26, 2025 (3 days)
**Goal:** Stand out with polish + bonus features
**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

### Day 9: October 24, 2025 (Web3 Abstraction & API Integration)
- [ ] **Morning: Web3 Abstraction**
  - [ ] Integrate Privy/Dynamic for email login
  - [ ] Create embedded wallets
  - [ ] Hide crypto terminology in UI
  - [ ] Test onboarding flow for non-crypto users

- [ ] **Afternoon: API Integration**
  - [ ] Choose one API (RapidAPI, Skyscanner, etc.)
  - [ ] Implement API fetching logic
  - [ ] Normalize data to platform format
  - [ ] Display aggregated deals in marketplace

- [ ] **Evening: Fiat On-Ramp (Optional)**
  - [ ] Integrate Stripe for credit card payments
  - [ ] Auto-convert fiat to SOL for transactions
  - [ ] Test payment flow

**Milestone:** Non-crypto users can onboard easily; real deals from external API visible

---

### Day 10: October 25, 2025 (Social Features & Polish)
- [ ] **Morning: Social Discovery Layer**
  - [ ] Add rating/review system to deal pages
  - [ ] Implement upvote/downvote functionality
  - [ ] Add share buttons (Twitter, Telegram, copy link)
  - [ ] Create comment section

- [ ] **Afternoon: Engagement Features**
  - [ ] Build referral tracking system
  - [ ] Add "Deal of the Day" voting
  - [ ] Show social proof ("X people claimed")
  - [ ] Create activity feed (recent claims, top savers)

- [ ] **Evening: UI/UX Polish**
  - [ ] Refine design (consistent spacing, colors, fonts)
  - [ ] Add animations and transitions
  - [ ] Improve mobile responsiveness
  - [ ] Accessibility audit (keyboard nav, ARIA labels)

**Milestone:** Social features live, UI polished and user-friendly

---

### Day 11: October 26, 2025 (Bonus Features & Testing)
- [ ] **Morning: Choose ONE Bonus Feature**
  - Option A: On-chain reputation system (NFT badges)
  - Option B: Geo-based discovery ("Deals near me")
  - Option C: Group deals / pooled discounts
  - [ ] Implement chosen bonus feature

- [ ] **Afternoon: Comprehensive Testing**
  - [ ] Test all user flows manually
  - [ ] Test on different browsers (Chrome, Firefox, Safari)
  - [ ] Test on mobile devices (iOS, Android)
  - [ ] Test with real wallets (not mocks)
  - [ ] Identify and fix critical bugs

- [ ] **Evening: Performance Optimization**
  - [ ] Optimize image loading (lazy loading, WebP)
  - [ ] Reduce bundle size (code splitting)
  - [ ] Improve page load times
  - [ ] Optimize database queries

**Milestone:** Bonus feature implemented, all features tested and polished

**Phase 3 Deliverable:** Differentiated product with social features, API integration, and bonus feature

---

## Phase 4: Submission (Days 12-14)
**Duration:** October 27-30, 2025 (4 days with buffer)
**Goal:** Professional presentation and submission
**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

### Day 12: October 27, 2025 (Deployment & Documentation)
- [ ] **Morning: Production Deployment**
  - [ ] Deploy frontend to Vercel
  - [ ] Deploy smart contracts to Solana Mainnet-beta (or keep devnet)
  - [ ] Configure environment variables for production
  - [ ] Test live deployment thoroughly
  - [ ] Set up custom domain (optional)

- [ ] **Afternoon: GitHub Repo Prep**
  - [ ] Clean up code (remove TODOs, commented code)
  - [ ] Add code comments for complex logic
  - [ ] Write comprehensive README.md
  - [ ] Add screenshots/GIFs to README
  - [ ] Include LICENSE file
  - [ ] Push all changes to GitHub

- [ ] **Evening: Technical Write-Up**
  - [ ] Explain design choices
  - [ ] Document technical implementation
  - [ ] Address Web3 integration challenges
  - [ ] Describe user flows
  - [ ] Highlight innovations

**Milestone:** Project deployed to production, GitHub repo polished, write-up drafted

---

### Day 13: October 28, 2025 (Demo Video)
- [ ] **Morning: Video Script**
  - [ ] Write script (intro, demo, innovation, outro)
  - [ ] Plan screen recordings (which flows to show)
  - [ ] Prepare talking points
  - [ ] Practice delivery

- [ ] **Afternoon: Record Video**
  - [ ] Record screen capture (Loom, OBS, QuickTime)
  - [ ] Record voiceover or narration
  - [ ] Capture all key features (merchant + user flows)
  - [ ] Show redemption flow demo
  - [ ] Highlight differentiators

- [ ] **Evening: Edit Video**
  - [ ] Edit footage (cut, transitions, pacing)
  - [ ] Add captions/text overlays
  - [ ] Add background music (subtle, non-distracting)
  - [ ] Export in 1080p
  - [ ] Upload to YouTube (unlisted or public)
  - [ ] Test playback

**Milestone:** Demo video completed and uploaded

---

### Day 14: October 29, 2025 (Final Review & Submission)
- [ ] **Morning: Final Quality Check**
  - [ ] Test live demo one last time
  - [ ] Verify all links work (GitHub, video, docs)
  - [ ] Proofread all documentation
  - [ ] Check for typos and errors
  - [ ] Ensure submission checklist is complete

- [ ] **Afternoon: Submission Preparation**
  - [ ] Gather all assets (URLs, documents)
  - [ ] Fill out Superteam Earn submission form
  - [ ] Write compelling project description
  - [ ] Add team member info (if applicable)
  - [ ] Review submission before final submit

- [ ] **Evening: Submit & Buffer**
  - [ ] Submit via Superteam Earn
  - [ ] Confirm submission received
  - [ ] Save confirmation email/screenshot
  - [ ] Announce on Twitter/social (optional)
  - [ ] Relax and celebrate! 🎉

**Milestone:** Submission completed 24-48h before deadline

**Phase 4 Deliverable:** Complete submission package (demo, video, docs, GitHub)

---

### Buffer Day: October 30, 2025 (Final Deadline Day)
**Use this day for:**
- [ ] Emergency bug fixes (if needed)
- [ ] Last-minute polish
- [ ] Resubmission if issues found
- [ ] Rest and recovery

**Submission Deadline:** End of October 30, 2025

---

## Post-Submission (November 1-14, 2025)

### Week 1: November 1-7, 2025
- [ ] Monitor Superteam Earn for updates
- [ ] Engage with community (answer questions if any)
- [ ] Share project on social media
- [ ] Connect with other participants
- [ ] Consider open-sourcing if not already

### Week 2: November 8-14, 2025
- [ ] Prepare for winner announcement (November 14)
- [ ] Review other submissions (learn and network)
- [ ] Plan next steps (win or not):
  - [ ] If win: Engage with MonkeDAO community
  - [ ] If not: Open source, portfolio piece, continue building

**Winner Announcement:** November 14, 2025

---

## Milestone Tracker

| Phase | Start Date | End Date | Status | Completion |
|-------|------------|----------|--------|------------|
| Phase 1: Foundation | Oct 16 | Oct 18 | [ ] | 0% |
| Phase 2: Core Features | Oct 19 | Oct 23 | [ ] | 0% |
| Phase 3: Differentiation | Oct 24 | Oct 26 | [ ] | 0% |
| Phase 4: Submission | Oct 27 | Oct 30 | [ ] | 0% |

**Overall Project Completion:** 0%

---

## Risk Mitigation Checkpoints

### End of Day 3 (Oct 18) - Phase 1 Checkpoint
**Question:** Are smart contracts working and wallet connected?
- [ ] If YES → Proceed to Phase 2
- [ ] If NO → Spend Day 4 fixing foundation (push timeline back 1 day)

### End of Day 8 (Oct 23) - Phase 2 Checkpoint
**Question:** Does end-to-end flow work (mint → purchase → redeem)?
- [ ] If YES → Proceed to Phase 3
- [ ] If NO → Cut bonus features, focus on core functionality

### End of Day 11 (Oct 26) - Phase 3 Checkpoint
**Question:** Is the project submission-ready (all must-haves working)?
- [ ] If YES → Proceed to submission prep
- [ ] If NO → Skip bonus features, submit MVP + great demo video

### Day 12 (Oct 27) - Final Go/No-Go
**Question:** Can you submit a working product?
- [ ] If YES → Proceed with submission
- [ ] If NO → Assess whether to pivot, simplify, or withdraw

---

## Daily Standup Template

_Use this for daily progress tracking_

**Date:** [YYYY-MM-DD]

**Today's Goal:**
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**Completed Yesterday:**
- ✅ Task A
- ✅ Task B

**Blockers:**
- [ ] Issue 1
- [ ] Issue 2

**Tomorrow's Focus:**
- [ ] Next task 1
- [ ] Next task 2

**Mood:** [ ] On Track | [ ] Slightly Behind | [ ] Struggling | [ ] Ahead of Schedule

---

## Notes & Adjustments

_Document any timeline changes or scope adjustments here_

### [Date]: [Adjustment]
**Reason:** [Why the change was made]
**Impact:** [How it affects timeline]
**New Plan:** [Adjusted approach]

---

**Created:** October 16, 2025
**Last Updated:** October 16, 2025
**Next Review:** End of Day 3 (Oct 18, 2025)

Bismillah! May Allah grant barakah in this timeline and ease in execution. Tawfeeq min Allah! 🚀
