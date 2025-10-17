# Product Requirements Document (PRD)

**Project:** Web3 Deal Discovery & Loyalty Platform with NFT Coupons
**Hackathon:** Cypherpunk - MonkeDAO Track
**Prize Pool:** $6,500 USDC + Gen3 Monke NFTs
**Deadline:** October 30, 2025
**Created:** October 17, 2025
**Last Updated:** October 17, 2025

---

## Executive Summary

**Vision:** Reinvent Groupon with Web3 principles - merchants mint NFT coupons, users collect and trade them, redemption is verified on-chain. Think "DeFi for Discounts."

**Core Innovation:** Promotional discounts as tradable NFT assets on Solana blockchain, enabling secondary markets and true ownership of deals.

**Target Users:**
- **Merchants:** Small to medium businesses wanting to create promotional campaigns
- **Consumers:** Deal hunters seeking discounts and tradeable coupon assets
- **Traders:** Users interested in secondary market for unused coupons

**Success Metrics:**
- End-to-end flow working (mint → purchase → redeem)
- Mobile-responsive, polished UI
- At least ONE external API integration (deal aggregator)
- Professional demo video and documentation
- Submission 24-48h before deadline

---

## Technical Architecture

### Technology Stack

**Blockchain Layer:**
- Network: Solana (Devnet for development, Mainnet-beta optional)
- Framework: Anchor 0.28+ (Rust)
- Token Standard: Metaplex Token Metadata v1.1
- Storage: Arweave or IPFS for NFT metadata/images

**Backend:**
- Framework: Next.js 14+ (React with App Router)
- Database: PostgreSQL via Supabase
- Authentication: Privy or Dynamic (Web3 + email/social login)
- API Routes: Next.js serverless functions

**Frontend:**
- Framework: Next.js 14+ with TypeScript
- Styling: Tailwind CSS (utility-first, rapid development)
- UI Components: shadcn/ui or Radix UI
- State Management: Zustand or React Context
- Wallet Integration: Solana Wallet Adapter (Phantom, Solflare, Backpack)

**Development Tools:**
- Version Control: Git
- Package Manager: npm
- Deployment: Vercel (frontend), Solana CLI (contracts)

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  User Interface                      │
│  (Next.js Frontend - Merchant Dashboard + User App) │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Backend Services                        │
│  (Next.js API Routes + PostgreSQL Database)         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│           Blockchain Layer (Solana)                  │
│  (Anchor Smart Contracts + Metaplex NFT Standard)   │
└─────────────────────────────────────────────────────┘
```

**Data Flow:**
- **On-chain:** NFT ownership, redemption state, merchant controls
- **Off-chain:** Deal metadata cache, merchant profiles, analytics, user preferences

---

## Epic 1: NFT Promotions / Coupons ⭐ CRITICAL

**Priority:** Highest
**Objective:** Enable NFT-based coupon creation and lifecycle management
**Target Timeline:** Day 1-2 (October 16-17, 2025)
**Dependencies:** None (foundation)

### Story 1.1: NFT Metadata Structure Design

**As a** platform architect
**I want** a standardized NFT metadata schema
**So that** all coupons contain necessary information and display correctly in wallets

**Business Value:** Foundation for entire NFT coupon system

**Technical Approach:**
- Use Metaplex Token Metadata v1.1 standard
- JSON structure stored on Arweave/IPFS
- Render-friendly for wallet applications

#### Tasks

**Task 1.1.1: Define Discount Percentage Field**
- **Description:** Add discount percentage to NFT metadata attributes
- **Acceptance Criteria:**
  - Field: `discount_percentage` (integer, 0-100)
  - Validation: On-chain validation in smart contract
  - Display: Shows as "50% OFF" in wallet
  - Format: `{"trait_type": "Discount", "value": "50%"}`
- **Technical Notes:** Store as integer for calculations, display with % symbol
- **Estimated Effort:** 30 minutes

**Task 1.1.2: Define Expiry Date Field**
- **Description:** Add expiration timestamp to metadata
- **Acceptance Criteria:**
  - Field: `expiry_date` (Unix timestamp)
  - Validation: Enforced during redemption (block.timestamp check)
  - Display: Human-readable date in UI (e.g., "Dec 31, 2025")
  - Format: `{"trait_type": "Expiry", "value": "2025-12-31"}`
- **Technical Notes:** Store as Unix timestamp, convert to readable format in frontend
- **Estimated Effort:** 30 minutes

**Task 1.1.3: Define Merchant ID Field**
- **Description:** Link NFT to merchant wallet address
- **Acceptance Criteria:**
  - Field: `merchant_id` (Solana wallet address)
  - Validation: Must match merchant account PDA
  - Display: Merchant business name (fetched from database)
  - Format: `{"trait_type": "Merchant ID", "value": "0x..."}`
- **Technical Notes:** Store wallet address, resolve to business name off-chain
- **Estimated Effort:** 45 minutes

**Task 1.1.4: Define Redemption Rules Field**
- **Description:** Specify how coupon can be redeemed
- **Acceptance Criteria:**
  - Field: `redemption_limit` (integer, default 1 for single-use)
  - Options: Single-use (burn on redeem) or multi-use (decrement counter)
  - Validation: On-chain enforcement
  - Format: `{"trait_type": "Redemptions Remaining", "value": "1"}`
- **Technical Notes:** Default to single-use for MVP, support multi-use in future
- **Estimated Effort:** 1 hour

**Task 1.1.5: Define Category/Tags Field**
- **Description:** Categorize deals for filtering and discovery
- **Acceptance Criteria:**
  - Field: `category` (string, predefined list)
  - Categories: "Food & Beverage", "Retail", "Services", "Travel", "Entertainment", "Other"
  - Display: Filter tags in marketplace
  - Format: `{"trait_type": "Category", "value": "Food & Beverage"}`
- **Technical Notes:** Enforce enum on frontend, store as string on-chain
- **Estimated Effort:** 45 minutes

**Story 1.1 Acceptance Criteria:**
- ✅ Complete metadata JSON schema documented
- ✅ All 5 required fields defined with validation rules
- ✅ Sample metadata renders correctly in Phantom wallet
- ✅ Schema validated against Metaplex Token Metadata v1.1 spec

**Story 1.1 Total Effort:** 3-4 hours

---

### Story 1.2: Smart Contract Implementation

**As a** merchant
**I want** to mint NFT coupons via smart contract
**So that** customers can claim, own, and redeem them on-chain

**Business Value:** Core blockchain functionality enabling decentralized coupon ownership

**Technical Approach:**
- Anchor framework (Rust)
- Metaplex Token Metadata program integration
- Program-Derived Addresses (PDAs) for merchant accounts
- SPL Token standard for NFT minting

#### Tasks

**Task 1.2.1: Implement Metaplex Token Metadata Standard**
- **Description:** Integrate Metaplex CPI calls for NFT minting
- **Acceptance Criteria:**
  - Import Metaplex Token Metadata program
  - Implement `create_metadata_accounts_v3` CPI call
  - NFT metadata follows Metaplex standard
  - Metadata account initialized on-chain
  - Test: Mint NFT and verify metadata on Solana Explorer
- **Technical Notes:**
  ```rust
  use mpl_token_metadata::instruction::create_metadata_accounts_v3;
  ```
- **Estimated Effort:** 2-3 hours
- **Dependencies:** Metaplex Rust SDK

**Task 1.2.2: Implement Transferability Logic**
- **Description:** Enable NFT transfers between wallets
- **Acceptance Criteria:**
  - Use SPL Token `transfer` instruction
  - Ownership tracked via token account
  - Transfer restrictions: None (fully transferable)
  - Test: Transfer NFT between two wallets successfully
- **Technical Notes:** Standard SPL Token transfer, no custom logic needed
- **Estimated Effort:** 1-2 hours

**Task 1.2.3: Implement Redemption/Burn Mechanism**
- **Description:** Single-use enforcement via NFT burn
- **Acceptance Criteria:**
  - Instruction: `redeem_coupon(nft_mint: Pubkey)`
  - Validates: NFT ownership, not expired, not already redeemed
  - Action: Burns NFT (closes token account)
  - Emits: Redemption event with merchant ID and user wallet
  - Test: Redeem NFT, verify token account closed
  - Test: Attempt double-redeem, expect error
- **Technical Notes:**
  ```rust
  pub fn redeem_coupon(ctx: Context<RedeemCoupon>) -> Result<()> {
      require!(ctx.accounts.nft_token_account.amount == 1, ErrorCode::NotOwner);
      require!(!is_expired(), ErrorCode::CouponExpired);
      // Burn NFT
      token::burn(ctx.accounts.into_burn_context(), 1)?;
      Ok(())
  }
  ```
- **Estimated Effort:** 3-4 hours
- **Critical Path:** Core redemption logic

**Task 1.2.4: Implement Metadata Upload to Arweave/IPFS**
- **Description:** Store NFT metadata permanently off-chain
- **Acceptance Criteria:**
  - Upload JSON metadata to Arweave or IPFS
  - Return URI for metadata
  - Metadata URI stored in NFT metadata account
  - Test: Fetch metadata via URI, verify all fields present
- **Technical Notes:**
  - Use Arweave CLI or Bundlr for uploads
  - Metadata format:
    ```json
    {
      "name": "50% Off - Coffee Shop",
      "description": "50% discount on all drinks",
      "image": "https://arweave.net/image_id",
      "attributes": [...]
    }
    ```
- **Estimated Effort:** 2 hours
- **Dependencies:** Arweave wallet with AR tokens or IPFS API

**Task 1.2.5: Test NFT Minting Flow End-to-End**
- **Description:** Comprehensive integration test
- **Acceptance Criteria:**
  - Test script: Mint NFT from merchant account
  - Verify: Metadata on-chain matches expected schema
  - Verify: NFT appears in user wallet (Phantom)
  - Verify: Transfer NFT to another wallet
  - Verify: Redeem NFT and confirm burn
  - All tests pass on Devnet
- **Technical Notes:**
  ```bash
  anchor test --skip-local-validator
  ```
- **Estimated Effort:** 2-3 hours
- **Blockers:** Requires Devnet SOL and test wallets

**Story 1.2 Acceptance Criteria:**
- ✅ Smart contract deployed to Solana Devnet
- ✅ NFT minting working via Anchor CLI or frontend
- ✅ NFTs transferable between wallets
- ✅ Redemption burns NFT and prevents double-spend
- ✅ Metadata uploaded to Arweave/IPFS
- ✅ All integration tests passing

**Story 1.2 Total Effort:** 10-14 hours (1.5-2 days)

---

**Epic 1 Acceptance Criteria:**
- ✅ NFT metadata schema complete and documented
- ✅ Smart contract deployed and functional on Devnet
- ✅ End-to-end NFT lifecycle working (mint → transfer → redeem → burn)
- ✅ NFTs display correctly in Phantom/Solflare wallets
- ✅ All unit and integration tests passing

**Epic 1 Total Effort:** 13-18 hours (~2 days)

---

## Epic 2: Merchant Dashboard ⭐ CRITICAL

**Priority:** Highest
**Objective:** Enable merchants to create deals and track analytics
**Target Timeline:** Day 4-5 (October 19-20, 2025)
**Dependencies:** Epic 1 (smart contracts must be deployed)

### Story 2.1: Authentication & Dashboard Foundation

**As a** merchant
**I want** to securely access my dashboard
**So that** I can manage my promotional deals

**Business Value:** Gateway for merchants to use the platform

**Technical Approach:**
- Solana Wallet Adapter for wallet-based auth
- Optional: Privy/Dynamic for email/social login
- Role-based access control (merchant vs user)
- Next.js middleware for route protection

#### Tasks

**Task 2.1.1: Implement Wallet Connection (Solana Wallet Adapter)**
- **Description:** Enable merchants to connect via Phantom/Solflare/Backpack
- **Acceptance Criteria:**
  - Wallet adapter configured in Next.js layout
  - "Connect Wallet" button functional
  - Supports: Phantom, Solflare, Backpack
  - Wallet state persists across page navigation
  - Disconnect functionality works
  - Test: Connect wallet, navigate pages, verify persistence
- **Technical Notes:**
  ```tsx
  import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
  import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
  ```
- **Estimated Effort:** 2-3 hours

**Task 2.1.2: Optional Email/Social Login (Privy/Dynamic)**
- **Description:** Web3 abstraction for mainstream users
- **Acceptance Criteria:**
  - Privy or Dynamic SDK integrated
  - Email login functional
  - Social login (Google, Twitter) functional
  - Embedded wallet created automatically
  - Users can authenticate without crypto wallet
  - Test: Login via email, verify embedded wallet created
- **Technical Notes:**
  ```tsx
  import { PrivyProvider } from '@privy-io/react-auth';
  ```
- **Estimated Effort:** 3-4 hours
- **Priority:** Medium (can defer to Epic 7 if time-constrained)

**Task 2.1.3: Role-Based Access Control (Merchant vs User)**
- **Description:** Differentiate merchant and user accounts
- **Acceptance Criteria:**
  - Database table: `users` with `role` field ('merchant' | 'user')
  - Merchant registration flow creates merchant account
  - Route protection: `/dashboard/*` requires merchant role
  - Middleware checks role before rendering merchant pages
  - Test: Access merchant dashboard as user, expect redirect
- **Technical Notes:**
  ```typescript
  // middleware.ts
  export async function middleware(request: NextRequest) {
    const user = await getUser();
    if (user.role !== 'merchant') {
      return NextResponse.redirect('/marketplace');
    }
  }
  ```
- **Estimated Effort:** 2-3 hours

**Task 2.1.4: Design Merchant Dashboard UI/UX**
- **Description:** Wireframe and design dashboard layout
- **Acceptance Criteria:**
  - Wireframes for: Dashboard home, Create Deal, Analytics, Settings
  - Mobile-responsive design
  - Consistent with MonkeDAO brand colors (optional)
  - Component structure planned (Sidebar, Header, Main Content)
  - Design approved (self-review or quick feedback)
- **Technical Notes:** Use Figma or sketch on paper, focus on functionality over polish
- **Estimated Effort:** 2 hours

**Task 2.1.5: Build Dashboard Layout and Navigation**
- **Description:** Implement base layout with navigation
- **Acceptance Criteria:**
  - Sidebar navigation with links: Dashboard, Create Deal, My Deals, Analytics, Settings
  - Header with wallet connection status and disconnect button
  - Responsive: Sidebar collapses to hamburger on mobile
  - Active route highlighting
  - Test: Navigate between all pages, verify layout persists
- **Technical Notes:**
  ```tsx
  // app/(merchant)/layout.tsx
  export default function MerchantLayout({ children }) {
    return (
      <div className="flex">
        <Sidebar />
        <main>{children}</main>
      </div>
    );
  }
  ```
- **Estimated Effort:** 3-4 hours

**Story 2.1 Acceptance Criteria:**
- ✅ Merchants can connect wallet (Phantom/Solflare/Backpack)
- ✅ Merchant registration flow functional
- ✅ Dashboard accessible only to merchant accounts
- ✅ Navigation and layout implemented
- ✅ Mobile-responsive design

**Story 2.1 Total Effort:** 12-16 hours (1.5-2 days)

---

### Story 2.2: Create Promotion Flow

**As a** merchant
**I want** to create promotional deals easily
**So that** NFT coupons are automatically minted for customers

**Business Value:** Core merchant functionality, enables deal creation

**Technical Approach:**
- Multi-step form: Deal info → Image upload → Preview → Mint
- Frontend validates inputs
- Backend calls smart contract to mint NFT
- Metadata uploaded to Arweave/IPFS

#### Tasks

**Task 2.2.1: Build Deal Creation Form**
- **Description:** Form for merchant to input deal details
- **Acceptance Criteria:**
  - Form fields:
    - Title (text, required, max 100 chars)
    - Description (textarea, required, max 500 chars)
    - Discount percentage (number, required, 0-100)
    - Expiry date (date picker, required, future date)
    - Quantity (number, optional, default unlimited)
    - Category (select, required, predefined options)
  - Validation: All required fields, future expiry date, valid percentage
  - Error messages for invalid inputs
  - Test: Submit form with invalid data, verify errors
- **Technical Notes:**
  ```tsx
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import * as z from 'zod';

  const dealSchema = z.object({
    title: z.string().min(1).max(100),
    discount: z.number().min(0).max(100),
    // ...
  });
  ```
- **Estimated Effort:** 3-4 hours

**Task 2.2.2: Implement Image Upload for Deal Visual**
- **Description:** Upload deal image to display in marketplace
- **Acceptance Criteria:**
  - Image upload input (drag-drop or file picker)
  - Image preview after upload
  - Upload to Arweave/IPFS or cloud storage (e.g., Supabase Storage)
  - Max file size: 5MB
  - Accepted formats: PNG, JPG, WebP
  - Returns image URL for metadata
  - Test: Upload image, verify URL returned
- **Technical Notes:**
  ```tsx
  const uploadImage = async (file: File) => {
    // Upload to Arweave or Supabase Storage
    const { data } = await supabase.storage.from('deal-images').upload(filename, file);
    return data.publicUrl;
  };
  ```
- **Estimated Effort:** 2-3 hours

**Task 2.2.3: Add Preview Before Minting**
- **Description:** Show deal preview before final submission
- **Acceptance Criteria:**
  - Preview modal or page showing:
    - Deal card as it will appear in marketplace
    - All entered details (title, description, discount, expiry, image)
    - "Edit" button to go back to form
    - "Confirm & Mint" button to proceed
  - Test: Preview updates when form changes
- **Technical Notes:**
  ```tsx
  <DealCardPreview deal={formData} />
  ```
- **Estimated Effort:** 2 hours

**Task 2.2.4: Connect Form to Smart Contract**
- **Description:** Mint NFT on form submission
- **Acceptance Criteria:**
  - On "Confirm & Mint", call smart contract `mint_coupon` instruction
  - Pass: merchant wallet, metadata URI, coupon config
  - Transaction signing via wallet adapter
  - Loading state during transaction
  - Success/error handling
  - Test: Submit form, verify NFT minted on-chain
- **Technical Notes:**
  ```tsx
  const mintCoupon = async (dealData) => {
    const metadataUri = await uploadMetadata(dealData);
    const tx = await program.methods
      .mintCoupon(metadataUri)
      .accounts({ merchant: wallet.publicKey })
      .rpc();
    return tx;
  };
  ```
- **Estimated Effort:** 4-5 hours
- **Critical Path:** Core minting integration

**Task 2.2.5: Implement Transaction Status and Feedback**
- **Description:** User feedback during and after minting
- **Acceptance Criteria:**
  - Loading spinner during transaction
  - Success message: "Deal created successfully! NFT minted."
  - Error message: Display specific error (e.g., "Insufficient SOL for gas")
  - Link to Solana Explorer to view transaction
  - Redirect to "My Deals" page after success
  - Test: Mint deal, verify feedback messages
- **Technical Notes:**
  ```tsx
  import { toast } from 'sonner';

  toast.success('Deal created!', {
    action: {
      label: 'View on Explorer',
      onClick: () => window.open(explorerUrl)
    }
  });
  ```
- **Estimated Effort:** 2 hours

**Story 2.2 Acceptance Criteria:**
- ✅ Merchant can fill deal creation form
- ✅ Image upload working (to Arweave/IPFS or cloud)
- ✅ Preview shows deal before minting
- ✅ NFT minted on-chain when form submitted
- ✅ Transaction feedback (loading, success, error) functional
- ✅ Deal appears in marketplace after minting

**Story 2.2 Total Effort:** 13-17 hours (~2 days)

---

### Story 2.3: Merchant Analytics

**As a** merchant
**I want** to track deal performance
**So that** I can optimize my promotions

**Business Value:** Merchant retention through data-driven insights

**Technical Approach:**
- Event tracking in database (views, purchases, redemptions)
- Simple charts using Recharts or Chart.js
- Real-time updates via Supabase subscriptions (optional)

#### Tasks

**Task 2.3.1: Track and Display Deal Metrics**
- **Description:** Show views, purchases, and redemptions per deal
- **Acceptance Criteria:**
  - Database events table tracks:
    - `view` event when deal opened
    - `purchase` event when NFT claimed
    - `redemption` event when NFT redeemed
  - Analytics page displays per deal:
    - Total views
    - Total purchases (NFTs claimed)
    - Total redemptions
    - Conversion rate (purchases / views)
  - Test: Create deal, view it, purchase it, verify metrics increment
- **Technical Notes:**
  ```sql
  CREATE TABLE events (
    id UUID PRIMARY KEY,
    event_type TEXT NOT NULL,
    deal_id UUID REFERENCES deals(id),
    user_wallet TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- **Estimated Effort:** 3-4 hours

**Task 2.3.2: Track Revenue**
- **Description:** Show total revenue generated from deal sales
- **Acceptance Criteria:**
  - If deals have price (not free), track revenue
  - Display: Total revenue in SOL or USDC
  - Display: Revenue per deal
  - Test: Purchase paid deal, verify revenue tracked
- **Technical Notes:** For MVP, most deals may be free (claim-only). Defer if not selling coupons.
- **Estimated Effort:** 2 hours (defer if deals are free)

**Task 2.3.3: Performance Comparison Charts**
- **Description:** Visual charts comparing deal performance
- **Acceptance Criteria:**
  - Bar chart: Purchases per deal
  - Line chart: Purchases over time
  - Pie chart: Redemptions by category (optional)
  - Charts responsive and interactive
  - Test: Create multiple deals, verify charts render
- **Technical Notes:**
  ```tsx
  import { BarChart, Bar, XAxis, YAxis } from 'recharts';

  <BarChart data={dealStats}>
    <Bar dataKey="purchases" fill="#8884d8" />
  </BarChart>
  ```
- **Estimated Effort:** 3-4 hours

**Task 2.3.4: Merchant Profile Management**
- **Description:** Edit merchant business info
- **Acceptance Criteria:**
  - Form to edit: Business name, description, logo URL, contact
  - Save to database (merchants table)
  - Display merchant info on deal pages
  - Test: Update profile, verify changes reflected
- **Technical Notes:**
  ```sql
  CREATE TABLE merchants (
    id UUID PRIMARY KEY,
    wallet_address TEXT UNIQUE,
    business_name TEXT,
    description TEXT,
    logo_url TEXT
  );
  ```
- **Estimated Effort:** 2-3 hours

**Story 2.3 Acceptance Criteria:**
- ✅ Analytics page shows views, purchases, redemptions per deal
- ✅ Revenue tracked (if applicable)
- ✅ Charts visualize deal performance
- ✅ Merchant can edit profile info
- ✅ Profile info displays on merchant's deals

**Story 2.3 Total Effort:** 10-13 hours (1-1.5 days)

---

**Epic 2 Acceptance Criteria:**
- ✅ Merchants can register and access dashboard
- ✅ Merchants can create deals that mint NFT coupons
- ✅ Deal creation flow smooth and intuitive
- ✅ Analytics show meaningful metrics
- ✅ Mobile-responsive design

**Epic 2 Total Effort:** 35-46 hours (~3-4 days, parallel with Epic 1 Day 3)

---

## Epic 3: User Wallet & Marketplace ⭐ CRITICAL

**Priority:** Highest
**Objective:** Enable users to discover, purchase, and manage NFT coupons
**Target Timeline:** Day 6-7 (October 21-22, 2025)
**Dependencies:** Epic 1 (NFTs must be mintable), Epic 2 (deals must exist)

### Story 3.1: Marketplace Browse & Discovery

**As a** user
**I want** to browse available deals
**So that** I can find promotions I'm interested in

**Business Value:** Core user experience, drives engagement

**Technical Approach:**
- Fetch deals from database (off-chain metadata cache)
- Grid or list view with filters and search
- Infinite scroll or pagination
- Deal detail page with full information

#### Tasks

**Task 3.1.1: Design Marketplace UI (Grid/List View)**
- **Description:** Layout for browsing deals
- **Acceptance Criteria:**
  - Grid view: 2-3 columns on desktop, 1 on mobile
  - List view option (toggle)
  - Deal cards show: image, title, discount %, expiry, merchant name
  - Hover effects and visual polish
  - Loading skeletons during fetch
  - Test: View marketplace, verify responsive layout
- **Technical Notes:**
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
  </div>
  ```
- **Estimated Effort:** 3-4 hours

**Task 3.1.2: Create Deal Card Component**
- **Description:** Reusable card for displaying deals
- **Acceptance Criteria:**
  - Card displays: image, title, discount badge, expiry countdown, merchant logo
  - Click to navigate to deal detail page
  - Visual indicator for expiring soon (e.g., red badge if <3 days)
  - Accessible (keyboard navigation, ARIA labels)
  - Test: Render card with various deal data
- **Technical Notes:**
  ```tsx
  export function DealCard({ deal }: { deal: Deal }) {
    return (
      <Link href={`/deals/${deal.id}`}>
        <Card>
          <Image src={deal.image} alt={deal.title} />
          <Badge>{deal.discount}% OFF</Badge>
          <h3>{deal.title}</h3>
          <p>Expires: {formatExpiry(deal.expiry)}</p>
        </Card>
      </Link>
    );
  }
  ```
- **Estimated Effort:** 2-3 hours

**Task 3.1.3: Build Deal Detail Page**
- **Description:** Full page showing deal information
- **Acceptance Criteria:**
  - Displays: large image, full description, discount, expiry, merchant info
  - "Claim Coupon" or "Buy Coupon" button (prominent CTA)
  - Share buttons (Twitter, Telegram, copy link)
  - Related deals section (optional)
  - Breadcrumb navigation
  - Test: Open deal detail, verify all info displayed
- **Technical Notes:**
  ```tsx
  // app/deals/[id]/page.tsx
  export default async function DealPage({ params }) {
    const deal = await getDealById(params.id);
    return <DealDetailView deal={deal} />;
  }
  ```
- **Estimated Effort:** 3-4 hours

**Task 3.1.4: Implement Search Functionality**
- **Description:** Search deals by title or description
- **Acceptance Criteria:**
  - Search input at top of marketplace
  - Real-time search (updates as user types) or submit button
  - Searches: title and description fields
  - No results message if no matches
  - Test: Search for keyword, verify filtered results
- **Technical Notes:**
  ```tsx
  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(query.toLowerCase()) ||
    deal.description.toLowerCase().includes(query.toLowerCase())
  );
  ```
- **Estimated Effort:** 2 hours

**Task 3.1.5: Add Category Filters**
- **Description:** Filter deals by category
- **Acceptance Criteria:**
  - Filter chips or dropdown: All, Food & Beverage, Retail, Services, Travel, Entertainment
  - Click category to filter deals
  - Active category highlighted
  - Test: Select category, verify only matching deals shown
- **Technical Notes:**
  ```tsx
  const categories = ['All', 'Food & Beverage', 'Retail', 'Services', 'Travel', 'Entertainment'];
  const filteredDeals = selectedCategory === 'All'
    ? deals
    : deals.filter(d => d.category === selectedCategory);
  ```
- **Estimated Effort:** 2 hours

**Task 3.1.6: Add Sort Options**
- **Description:** Sort deals by criteria
- **Acceptance Criteria:**
  - Sort dropdown: Newest, Highest Discount %, Ending Soon
  - Sorts update deal list
  - Default: Newest first
  - Test: Change sort, verify order changes
- **Technical Notes:**
  ```tsx
  const sortedDeals = [...deals].sort((a, b) => {
    if (sortBy === 'discount') return b.discount - a.discount;
    if (sortBy === 'expiry') return a.expiry - b.expiry;
    return b.createdAt - a.createdAt; // newest
  });
  ```
- **Estimated Effort:** 2 hours

**Story 3.1 Acceptance Criteria:**
- ✅ Marketplace displays deals in grid/list view
- ✅ Deal cards show key information
- ✅ Deal detail page functional
- ✅ Search works
- ✅ Category filters work
- ✅ Sort options work
- ✅ Mobile-responsive

**Story 3.1 Total Effort:** 14-17 hours (~2 days)

---

### Story 3.2: Wallet Integration & My Coupons

**As a** user
**I want** to view my owned NFT coupons
**So that** I can see what deals I have

**Business Value:** Core user functionality, NFT ownership visibility

**Technical Approach:**
- Fetch NFTs from user's wallet using Solana RPC
- Filter by NFT program (our coupon program)
- Display with metadata

#### Tasks

**Task 3.2.1: Connect Wallet (Phantom, Solflare, Backpack)**
- **Description:** Same as Task 2.1.1 but for user pages
- **Acceptance Criteria:**
  - Wallet adapter in user-facing pages
  - "Connect Wallet" button in header
  - Same as merchant wallet connection (reuse component)
  - Test: Connect wallet on marketplace page
- **Technical Notes:** Reuse wallet adapter from merchant dashboard
- **Estimated Effort:** 1 hour (reuse existing)

**Task 3.2.2: Fetch User's NFT Coupons from Wallet**
- **Description:** Query Solana for NFTs owned by connected wallet
- **Acceptance Criteria:**
  - Query token accounts owned by user
  - Filter for NFTs from our coupon program
  - Fetch metadata for each NFT
  - Parse metadata JSON (discount, expiry, merchant, etc.)
  - Test: Connect wallet with NFTs, verify coupons displayed
- **Technical Notes:**
  ```tsx
  import { Metaplex } from '@metaplex-foundation/js';

  const metaplex = new Metaplex(connection);
  const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
  const coupons = nfts.filter(nft => nft.updateAuthority.equals(COUPON_PROGRAM_ID));
  ```
- **Estimated Effort:** 3-4 hours

**Task 3.2.3: Display Owned Coupons**
- **Description:** UI showing user's NFT coupons
- **Acceptance Criteria:**
  - "My Coupons" page accessible from nav
  - Grid of owned coupons (similar to marketplace cards)
  - Shows: image, discount, expiry, merchant
  - Empty state if no coupons: "You don't have any coupons yet. Browse deals!"
  - Test: View My Coupons with and without NFTs
- **Technical Notes:**
  ```tsx
  // app/(user)/my-coupons/page.tsx
  export default function MyCoupons() {
    const { coupons, isLoading } = useFetchUserCoupons();
    return <CouponGrid coupons={coupons} />;
  }
  ```
- **Estimated Effort:** 2-3 hours

**Task 3.2.4: Show Coupon Details (Expiry, Discount, Merchant)**
- **Description:** Detail view for owned coupon
- **Acceptance Criteria:**
  - Click coupon to see detail modal or page
  - Displays: full metadata, "Redeem at Merchant" button, expiry countdown
  - If expired: Show "Expired" badge, disable redeem button
  - Test: View coupon detail, verify all metadata shown
- **Technical Notes:**
  ```tsx
  <CouponDetail coupon={selectedCoupon} />
  ```
- **Estimated Effort:** 2 hours

**Story 3.2 Acceptance Criteria:**
- ✅ Users can connect wallet
- ✅ "My Coupons" page displays owned NFTs
- ✅ Coupon metadata parsed and displayed correctly
- ✅ Empty state handled gracefully
- ✅ Detail view functional

**Story 3.2 Total Effort:** 8-10 hours (1 day)

---

### Story 3.3: Purchase & Re-listing Flow

**As a** user
**I want** to purchase and re-sell NFT coupons
**So that** I can participate in the secondary marketplace

**Business Value:** Enables secondary market, key Web3 differentiator

**Technical Approach:**
- Purchase: Transfer NFT or mint new NFT to user
- Re-listing: List NFT on marketplace with price
- Marketplace fee: 2-5% on resales

#### Tasks

**Task 3.3.1: Implement "Claim Deal" / "Buy Coupon" Button**
- **Description:** Button to acquire NFT coupon
- **Acceptance Criteria:**
  - Button on deal detail page
  - If free: "Claim Coupon" (transfers NFT or mints to user)
  - If paid: "Buy Coupon for X SOL" (purchase flow)
  - Requires wallet connection
  - Test: Click claim, verify NFT transferred to wallet
- **Technical Notes:**
  ```tsx
  const claimCoupon = async (dealId: string) => {
    const tx = await program.methods
      .claimCoupon()
      .accounts({ user: wallet.publicKey, deal: dealPubkey })
      .rpc();
    return tx;
  };
  ```
- **Estimated Effort:** 3-4 hours

**Task 3.3.2: Create Transaction Confirmation Modal**
- **Description:** Modal before transaction to confirm details
- **Acceptance Criteria:**
  - Modal shows: deal title, discount, expiry, gas fee estimate
  - "Confirm" button to proceed
  - "Cancel" button to abort
  - Test: Click claim, verify modal appears
- **Technical Notes:**
  ```tsx
  <Dialog open={showConfirm}>
    <DialogContent>
      <h2>Confirm Purchase</h2>
      <p>Deal: {deal.title}</p>
      <p>Gas fee: ~0.000005 SOL</p>
      <Button onClick={handleConfirm}>Confirm</Button>
    </DialogContent>
  </Dialog>
  ```
- **Estimated Effort:** 2 hours

**Task 3.3.3: Handle On-Chain Transaction**
- **Description:** Execute transaction and handle states
- **Acceptance Criteria:**
  - Loading state during transaction
  - Success: NFT appears in "My Coupons"
  - Error: Display error message (e.g., insufficient SOL)
  - Transaction link to Solana Explorer
  - Test: Complete transaction, verify NFT received
- **Technical Notes:**
  ```tsx
  try {
    setLoading(true);
    const signature = await claimCoupon(deal.id);
    toast.success('Coupon claimed!');
    router.push('/my-coupons');
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
  ```
- **Estimated Effort:** 2-3 hours

**Task 3.3.4: Build "List for Resale" Functionality**
- **Description:** Allow users to resell owned NFTs
- **Acceptance Criteria:**
  - "List for Resale" button on coupon detail in "My Coupons"
  - Form: Set price in SOL
  - Listing creates entry in database (resale marketplace)
  - NFT marked as listed (escrow or approval logic)
  - Test: List coupon, verify appears in resale section
- **Technical Notes:**
  ```sql
  CREATE TABLE resale_listings (
    id UUID PRIMARY KEY,
    nft_mint TEXT,
    seller_wallet TEXT,
    price_sol NUMERIC,
    listed_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- **Estimated Effort:** 4-5 hours

**Task 3.3.5: Implement Marketplace Fee Logic (2-5%)**
- **Description:** Deduct platform fee on resales
- **Acceptance Criteria:**
  - Fee: 2.5% of sale price (configurable)
  - On purchase: Seller receives 97.5%, platform receives 2.5%
  - Fee wallet configured in smart contract or backend
  - Test: Buy resold NFT, verify fee deducted
- **Technical Notes:**
  ```rust
  let fee = (price * FEE_BPS) / 10000; // 250 bps = 2.5%
  let seller_amount = price - fee;
  ```
- **Estimated Effort:** 3-4 hours

**Story 3.3 Acceptance Criteria:**
- ✅ Users can claim/buy NFT coupons from marketplace
- ✅ Transaction confirmation modal functional
- ✅ NFT appears in user wallet after purchase
- ✅ Users can list owned NFTs for resale
- ✅ Marketplace fee deducted on resales
- ✅ Resale listings visible in marketplace

**Story 3.3 Total Effort:** 14-18 hours (~2 days)

---

**Epic 3 Acceptance Criteria:**
- ✅ Users can browse deals in marketplace
- ✅ Search, filter, and sort functional
- ✅ Users can connect wallet and view owned NFTs
- ✅ Users can claim/purchase NFT coupons
- ✅ Re-listing and secondary market functional
- ✅ Mobile-responsive, polished UI

**Epic 3 Total Effort:** 36-45 hours (~3-4 days)

---

## Epic 4: Redemption Verification Flow ⭐ CRITICAL

**Priority:** Highest
**Objective:** Enable on-chain redemption with QR code verification
**Target Timeline:** Day 8 (October 23, 2025)
**Dependencies:** Epic 1 (burn mechanism), Epic 3 (user owns NFTs)

### Story 4.1: QR Code Generation & Scanning

**As a** user
**I want** to generate QR codes for my coupons
**So that** merchants can verify and redeem them

**Business Value:** Core redemption UX, bridges digital and physical

**Technical Approach:**
- QR contains: NFT mint address, user signature, timestamp
- Merchant scans QR via device camera
- Off-chain verification (fast), then on-chain burn

#### Tasks

**Task 4.1.1: Implement QR Code Generation**
- **Description:** Generate QR for coupon redemption
- **Acceptance Criteria:**
  - QR contains JSON: `{ nftMint, userWallet, signature, timestamp }`
  - Signature proves ownership (user signs message with wallet)
  - QR displayed in "My Coupons" coupon detail
  - "Show QR to Merchant" button
  - Test: Generate QR, scan with phone, verify data
- **Technical Notes:**
  ```tsx
  import QRCode from 'qrcode.react';
  import { useWallet } from '@solana/wallet-adapter-react';

  const generateQR = async (nftMint: string) => {
    const message = `Redeem coupon: ${nftMint}`;
    const signature = await wallet.signMessage(new TextEncoder().encode(message));
    const qrData = JSON.stringify({
      nftMint,
      userWallet: wallet.publicKey.toBase58(),
      signature: Buffer.from(signature).toString('base64'),
      timestamp: Date.now()
    });
    return qrData;
  };

  <QRCode value={qrData} size={256} />
  ```
- **Estimated Effort:** 3-4 hours

**Task 4.1.2: Display QR in "My Coupons" View**
- **Description:** Show QR code modal when user wants to redeem
- **Acceptance Criteria:**
  - Button: "Redeem at Merchant" on coupon detail
  - Clicks opens modal with QR code
  - Instructions: "Show this QR code to the merchant to redeem your coupon"
  - Modal includes: deal title, discount, expiry
  - Test: Click redeem, verify QR modal appears
- **Technical Notes:**
  ```tsx
  <Dialog open={showQR}>
    <DialogContent>
      <h2>Redeem Coupon</h2>
      <QRCode value={qrData} />
      <p>Show this code to the merchant</p>
    </DialogContent>
  </Dialog>
  ```
- **Estimated Effort:** 2 hours

**Task 4.1.3: Build Merchant QR Scanner Interface**
- **Description:** Camera-based QR scanner for merchants
- **Acceptance Criteria:**
  - Page: `/dashboard/scan-coupon`
  - Uses device camera to scan QR
  - Parses QR data (NFT mint, signature, etc.)
  - Displays: user wallet, deal details, discount
  - Buttons: "Confirm Redemption" or "Cancel"
  - Test: Scan user QR, verify deal details shown
- **Technical Notes:**
  ```tsx
  import { Html5QrcodeScanner } from 'html5-qrcode';

  const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 });
  scanner.render(onScanSuccess, onScanError);
  ```
- **Estimated Effort:** 4-5 hours

**Task 4.1.4: Verify NFT Ownership Off-Chain (Fast Check)**
- **Description:** Quick verification before on-chain redemption
- **Acceptance Criteria:**
  - After scanning QR, verify:
    - User wallet still owns NFT (query token account)
    - NFT not expired (check expiry timestamp)
    - Signature valid (verify user signed with their wallet)
  - If invalid: Show error, don't proceed
  - If valid: Show confirmation UI
  - Test: Scan valid QR, verify passes. Scan invalid QR, verify error.
- **Technical Notes:**
  ```tsx
  const verifyOwnership = async (nftMint: string, userWallet: string) => {
    const tokenAccount = await connection.getTokenAccountsByOwner(
      new PublicKey(userWallet),
      { mint: new PublicKey(nftMint) }
    );
    return tokenAccount.value.length > 0;
  };
  ```
- **Estimated Effort:** 3-4 hours

**Story 4.1 Acceptance Criteria:**
- ✅ User can generate QR code for owned coupon
- ✅ QR displayed in modal with instructions
- ✅ Merchant scanner page functional
- ✅ Scanner decodes QR and shows deal details
- ✅ Off-chain verification prevents invalid redemptions

**Story 4.1 Total Effort:** 12-15 hours (1.5 days)

---

### Story 4.2: On-Chain Redemption

**As a** merchant
**I want** to redeem coupons on-chain
**So that** single-use enforcement is guaranteed

**Business Value:** Trustless redemption, prevents fraud

**Technical Approach:**
- Merchant confirms redemption
- Smart contract burns NFT
- Redemption event emitted on-chain

#### Tasks

**Task 4.2.1: Implement Burn/Redeem Function Call**
- **Description:** Call smart contract to redeem coupon
- **Acceptance Criteria:**
  - On "Confirm Redemption", call `redeem_coupon` instruction
  - Pass: NFT mint address, merchant wallet
  - NFT burned (token account closed)
  - Transaction signed by merchant wallet
  - Test: Redeem coupon, verify NFT burned on-chain
- **Technical Notes:**
  ```tsx
  const redeemCoupon = async (nftMint: string) => {
    const tx = await program.methods
      .redeemCoupon()
      .accounts({
        nftMint: new PublicKey(nftMint),
        merchant: wallet.publicKey,
        nftTokenAccount: userNftTokenAccount
      })
      .rpc();
    return tx;
  };
  ```
- **Estimated Effort:** 3-4 hours

**Task 4.2.2: Record Redemption Event On-Chain**
- **Description:** Emit event for analytics
- **Acceptance Criteria:**
  - Smart contract emits event: `RedemptionEvent { nft_mint, merchant, user, timestamp }`
  - Event logged on-chain (viewable on Solana Explorer)
  - Backend listens for event and records in database (optional)
  - Test: Redeem coupon, verify event emitted
- **Technical Notes:**
  ```rust
  #[event]
  pub struct RedemptionEvent {
      pub nft_mint: Pubkey,
      pub merchant: Pubkey,
      pub user: Pubkey,
      pub timestamp: i64,
  }

  emit!(RedemptionEvent {
      nft_mint: ctx.accounts.nft_mint.key(),
      merchant: ctx.accounts.merchant.key(),
      user: ctx.accounts.user.key(),
      timestamp: clock.unix_timestamp,
  });
  ```
- **Estimated Effort:** 2-3 hours

**Task 4.2.3: Handle Edge Cases**
- **Description:** Error handling for redemption failures
- **Acceptance Criteria:**
  - Edge case: Coupon expired → Show error "Coupon expired, cannot redeem"
  - Edge case: Coupon already redeemed → Show error "Already redeemed"
  - Edge case: Network failure → Show error "Transaction failed, try again"
  - Edge case: Merchant not authorized → Show error "Unauthorized merchant"
  - Test: Simulate each edge case, verify error messages
- **Technical Notes:**
  ```rust
  require!(!is_expired(coupon), ErrorCode::CouponExpired);
  require!(token_account.amount == 1, ErrorCode::AlreadyRedeemed);
  ```
- **Estimated Effort:** 2-3 hours

**Task 4.2.4: Test Concurrent Redemption Prevention**
- **Description:** Ensure NFT can't be double-redeemed
- **Acceptance Criteria:**
  - Test: Two merchants try to redeem same NFT simultaneously
  - Expected: First transaction succeeds, second fails (NFT already burned)
  - Verify: Solana's atomic transaction guarantees prevent double-spend
  - Test: Rapid-fire redemption attempts, verify only one succeeds
- **Technical Notes:** Solana's atomic transactions handle this natively, but test to confirm
- **Estimated Effort:** 2 hours (testing)

**Story 4.2 Acceptance Criteria:**
- ✅ Merchant can redeem coupon on-chain
- ✅ NFT burned after redemption
- ✅ Redemption event emitted and logged
- ✅ Edge cases handled gracefully
- ✅ Double-redemption prevented

**Story 4.2 Total Effort:** 9-12 hours (1-1.5 days)

---

**Epic 4 Acceptance Criteria:**
- ✅ User can generate QR code for redemption
- ✅ Merchant can scan QR and verify coupon
- ✅ On-chain redemption working (burn NFT)
- ✅ Single-use enforcement guaranteed
- ✅ Edge cases handled (expired, already redeemed, network errors)
- ✅ End-to-end redemption flow tested

**Epic 4 Total Effort:** 21-27 hours (~2-3 days)

---

## Epic 5: Deal Aggregator Feed (Should-Have)

**Priority:** Medium (Competitive Advantage)
**Objective:** Integrate external deal APIs to enrich marketplace
**Target Timeline:** Day 9 (October 24, 2025)
**Dependencies:** Epic 3 (marketplace UI exists)

### Story 5.1: External API Integration

**As a** platform
**I want** to show deals from external sources
**So that** users have more options and the platform appears richer

**Business Value:** Demonstrates feasibility, enriches content, differentiator

**Technical Approach:**
- Choose ONE API: RapidAPI, Skyscanner, or Booking.com
- Fetch deals, normalize to platform format
- Mix with platform-native NFT deals
- Cache responses to reduce API costs

#### Tasks

**Task 5.1.1: Research and Choose API**
- **Description:** Evaluate API options and select one
- **Acceptance Criteria:**
  - Evaluated: RapidAPI (general deals), Skyscanner (travel), Booking.com (hotels)
  - Selected API based on: free tier availability, ease of integration, data quality
  - API key obtained
  - API docs reviewed
  - Test: Make sample API request, verify response
- **Technical Notes:**
  - RapidAPI: Multiple deal APIs available, easy to test
  - Skyscanner: Good for travel deals, may require partnership
- **Estimated Effort:** 1-2 hours

**Task 5.1.2: Implement API Fetching Logic**
- **Description:** Create API wrapper to fetch deals
- **Acceptance Criteria:**
  - API route: `/api/deals/aggregated`
  - Fetches deals from external API
  - Handles rate limits and errors
  - Returns JSON array of deals
  - Test: Call API route, verify deals returned
- **Technical Notes:**
  ```tsx
  // app/api/deals/aggregated/route.ts
  export async function GET() {
    const response = await fetch('https://api.example.com/deals', {
      headers: { 'X-API-Key': process.env.RAPIDAPI_KEY }
    });
    const deals = await response.json();
    return NextResponse.json(deals);
  }
  ```
- **Estimated Effort:** 2-3 hours

**Task 5.1.3: Normalize Data to Platform Format**
- **Description:** Map external API response to internal deal schema
- **Acceptance Criteria:**
  - External deals mapped to: `{ title, description, discount, expiry, image, category, source }`
  - Field: `source` = "Partner Deal" (to distinguish from platform NFTs)
  - Missing fields: Use defaults (e.g., category = "Other")
  - Test: Fetch and normalize, verify consistent format
- **Technical Notes:**
  ```tsx
  const normalizeDeal = (externalDeal: any) => ({
    id: externalDeal.id,
    title: externalDeal.name,
    description: externalDeal.details,
    discount: parseDiscount(externalDeal.savings),
    expiry: new Date(externalDeal.endDate),
    image: externalDeal.imageUrl,
    category: mapCategory(externalDeal.type),
    source: 'external'
  });
  ```
- **Estimated Effort:** 2 hours

**Task 5.1.4: Display Aggregated Deals in Marketplace**
- **Description:** Mix external deals with platform NFT deals
- **Acceptance Criteria:**
  - Marketplace shows both platform and external deals
  - External deals labeled: "Partner Deal" badge
  - External deals: Clicking redirects to external site (no NFT purchase)
  - Platform deals: Clicking opens purchase flow
  - Test: View marketplace, verify both types displayed
- **Technical Notes:**
  ```tsx
  const allDeals = [...platformDeals, ...externalDeals];
  ```
- **Estimated Effort:** 2 hours

**Task 5.1.5: Implement Caching Strategy**
- **Description:** Cache API responses to reduce costs
- **Acceptance Criteria:**
  - Cache: In-memory (for dev) or Redis (for prod)
  - TTL: 1 hour for deal data
  - On cache miss: Fetch from API and cache
  - On cache hit: Return cached data
  - Test: Verify API called only once per hour
- **Technical Notes:**
  ```tsx
  import { unstable_cache } from 'next/cache';

  const getAggregatedDeals = unstable_cache(
    async () => fetchFromAPI(),
    ['aggregated-deals'],
    { revalidate: 3600 } // 1 hour
  );
  ```
- **Estimated Effort:** 2-3 hours

**Story 5.1 Acceptance Criteria:**
- ✅ One external API integrated (RapidAPI, Skyscanner, or Booking.com)
- ✅ Deals fetched and normalized to platform format
- ✅ Marketplace displays both platform and external deals
- ✅ External deals clearly labeled
- ✅ Caching implemented to reduce API costs

**Story 5.1 Total Effort:** 9-12 hours (1-1.5 days)

---

**Epic 5 Acceptance Criteria:**
- ✅ At least ONE external API integrated
- ✅ Marketplace shows live deals from external source
- ✅ External deals distinguished from platform NFTs
- ✅ Caching prevents excessive API calls
- ✅ Feature demonstrates feasibility and scalability

**Epic 5 Total Effort:** 9-12 hours (~1 day)

---

## Epic 6: Social Discovery Layer (Should-Have)

**Priority:** Medium (Competitive Advantage)
**Objective:** Add social and viral features to drive engagement
**Target Timeline:** Day 10 (October 25, 2025)
**Dependencies:** Epic 3 (marketplace and deal pages exist)

### Story 6.1: Community Features

**As a** user
**I want** to interact with deals socially
**So that** I can share and discover through community feedback

**Business Value:** Increases engagement, virality, and user retention

**Technical Approach:**
- Comments stored in database
- Upvote/downvote system
- Share buttons with social meta tags
- Referral tracking (optional)

#### Tasks

**Task 6.1.1: Add Rating/Review System**
- **Description:** Allow users to rate and review deals
- **Acceptance Criteria:**
  - 5-star rating system on deal page
  - Text review optional
  - Ratings stored in database
  - Average rating displayed on deal cards
  - Test: Submit rating, verify saved and displayed
- **Technical Notes:**
  ```sql
  CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deals(id),
    user_wallet TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- **Estimated Effort:** 3-4 hours

**Task 6.1.2: Implement Upvote/Downvote**
- **Description:** Reddit-style voting for deals
- **Acceptance Criteria:**
  - Upvote/downvote buttons on deal cards
  - Vote count displayed
  - One vote per user per deal
  - Votes stored in database
  - Test: Upvote deal, verify count increments
- **Technical Notes:**
  ```sql
  CREATE TABLE votes (
    id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deals(id),
    user_wallet TEXT,
    vote_type TEXT CHECK (vote_type IN ('up', 'down')),
    UNIQUE (deal_id, user_wallet)
  );
  ```
- **Estimated Effort:** 2-3 hours

**Task 6.1.3: Add Share Buttons (Twitter, Telegram, Copy Link)**
- **Description:** Enable users to share deals
- **Acceptance Criteria:**
  - Share buttons on deal detail page
  - Twitter: Opens tweet with deal link and pre-filled text
  - Telegram: Opens Telegram with deal link
  - Copy link: Copies URL to clipboard
  - Test: Click each share button, verify works
- **Technical Notes:**
  ```tsx
  const shareOnTwitter = (deal: Deal) => {
    const text = `Check out this deal: ${deal.title} - ${deal.discount}% off!`;
    const url = `${window.location.origin}/deals/${deal.id}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
  };
  ```
- **Estimated Effort:** 2 hours

**Task 6.1.4: Build Referral Tracking System**
- **Description:** Track when users share and others claim via their link
- **Acceptance Criteria:**
  - Referral code: `?ref={userWallet}` in URL
  - Track clicks and conversions in database
  - Display: "X people claimed via your referral"
  - Test: Share link with ref, claim deal, verify tracked
- **Technical Notes:**
  ```sql
  CREATE TABLE referrals (
    id UUID PRIMARY KEY,
    referrer_wallet TEXT,
    referee_wallet TEXT,
    deal_id UUID REFERENCES deals(id),
    claimed_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- **Estimated Effort:** 3-4 hours

**Task 6.1.5: Create Activity Feed**
- **Description:** Show recent platform activity
- **Acceptance Criteria:**
  - Feed shows: "User X claimed Deal Y", "Z people claimed this deal"
  - Real-time updates (optional via WebSocket or polling)
  - Located on homepage or sidebar
  - Test: Claim deal, verify appears in activity feed
- **Technical Notes:**
  ```tsx
  const recentActivity = await db.query(`
    SELECT user_wallet, deal_id, action, created_at
    FROM events
    WHERE action = 'purchase'
    ORDER BY created_at DESC
    LIMIT 20
  `);
  ```
- **Estimated Effort:** 2-3 hours

**Story 6.1 Acceptance Criteria:**
- ✅ Users can rate and review deals
- ✅ Upvote/downvote functional
- ✅ Share buttons work (Twitter, Telegram, copy link)
- ✅ Referral tracking functional
- ✅ Activity feed displays recent claims

**Story 6.1 Total Effort:** 12-16 hours (1.5-2 days)

---

**Epic 6 Acceptance Criteria:**
- ✅ Rating/review system live
- ✅ Upvote/downvote working
- ✅ Share buttons functional
- ✅ Referral tracking implemented
- ✅ Activity feed showing engagement
- ✅ Features drive social interaction

**Epic 6 Total Effort:** 12-16 hours (~1.5 days)

---

## Epic 7: Web3 Abstraction (Bonus)

**Priority:** Low (Nice-to-Have, but high judging impact)
**Objective:** Make Web3 invisible to mainstream users
**Target Timeline:** Day 9 (October 24, 2025) - parallel with Epic 5
**Dependencies:** None (can integrate early)

### Story 7.1: Mainstream User Onboarding

**As a** mainstream user
**I want** to use the platform without crypto knowledge
**So that** I can access deals easily

**Business Value:** Lowers barrier to entry, expands user base, major differentiator

**Technical Approach:**
- Privy or Dynamic for email/social login
- Embedded wallets (users don't see wallet)
- Optional: Fiat payments via Stripe
- Hide crypto terminology in UI

#### Tasks

**Task 7.1.1: Implement Email/Social Login (Privy/Dynamic)**
- **Description:** Add Web3 abstraction authentication
- **Acceptance Criteria:**
  - Privy or Dynamic SDK integrated
  - Login options: Email, Google, Twitter
  - Embedded wallet created automatically
  - Users don't see private keys
  - Test: Login via email, verify wallet created
- **Technical Notes:**
  ```tsx
  import { PrivyProvider, usePrivy } from '@privy-io/react-auth';

  export default function App({ children }) {
    return (
      <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}>
        {children}
      </PrivyProvider>
    );
  }
  ```
- **Estimated Effort:** 3-4 hours

**Task 7.1.2: Create Embedded Wallets**
- **Description:** Auto-generate Solana wallet for users
- **Acceptance Criteria:**
  - On login, embedded wallet created (Privy/Dynamic handles)
  - Wallet private key stored securely (not exposed to user)
  - User can send transactions without seeing wallet
  - Test: Login, verify wallet exists in Privy dashboard
- **Technical Notes:** Privy/Dynamic SDKs handle wallet creation automatically
- **Estimated Effort:** 1 hour (configuration)

**Task 7.1.3: Hide Crypto Terminology**
- **Description:** Rename Web3 terms for mainstream users
- **Acceptance Criteria:**
  - "NFT" → "Coupon" or "Deal Pass"
  - "Mint" → "Create Deal"
  - "Wallet" → "My Coupons" or "My Account"
  - "Redeem NFT" → "Use Coupon"
  - UI copy updated throughout app
  - Test: Review all pages, verify no crypto jargon
- **Technical Notes:** UI/copy changes, no backend changes
- **Estimated Effort:** 2 hours

**Task 7.1.4: Support Fiat Payments (Stripe)**
- **Description:** Allow credit card payments for coupons
- **Acceptance Criteria:**
  - Stripe integration for payment processing
  - User pays in USD, backend converts to SOL
  - SOL used to pay for transaction fees or NFT purchase
  - Payment flow: Enter card → Confirm → Receive coupon
  - Test: Purchase with credit card, verify NFT received
- **Technical Notes:**
  ```tsx
  import { loadStripe } from '@stripe/stripe-js';

  const handlePayment = async (amount: number) => {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
    const { clientSecret } = await response.json();
    // Complete payment with Stripe
  };
  ```
- **Estimated Effort:** 4-5 hours
- **Note:** Optional, can defer if time-constrained

**Task 7.1.5: Sponsor Gas Fees**
- **Description:** Platform or merchant pays transaction fees
- **Acceptance Criteria:**
  - User doesn't see "Insufficient SOL for gas" errors
  - Platform wallet acts as fee payer
  - Solana's fee payer mechanism used
  - Test: User with 0 SOL can claim coupon
- **Technical Notes:**
  ```rust
  // Smart contract uses fee payer account
  #[account(mut)]
  pub fee_payer: Signer<'info>,
  ```
- **Estimated Effort:** 3-4 hours
- **Note:** Requires platform to fund fee payer wallet

**Story 7.1 Acceptance Criteria:**
- ✅ Email/social login functional
- ✅ Embedded wallets created automatically
- ✅ No crypto jargon in UI
- ✅ (Optional) Fiat payments working
- ✅ (Optional) Gas fees sponsored

**Story 7.1 Total Effort:** 13-16 hours (1.5-2 days)

---

**Epic 7 Acceptance Criteria:**
- ✅ Mainstream users can onboard without crypto wallet
- ✅ Email/social login working
- ✅ UI free of crypto terminology
- ✅ User experience feels like Web2 app
- ✅ (Optional) Fiat payments and gas sponsorship

**Epic 7 Total Effort:** 13-16 hours (~2 days)

**Note:** High impact on judging ("User Experience" = 25% of score), prioritize if time allows

---

## Epic 8-10: Advanced Bonus Features (Optional)

**Priority:** Lowest (Only if ahead of schedule)
**Target Timeline:** Day 11 (October 26, 2025)
**Decision:** Pick ONE feature if time permits

### Options

**Epic 8: Reward Staking / Cashback**
- Token economics design
- Staking smart contract
- Cashback distribution system

**Epic 9: On-Chain Reputation / Loyalty System**
- NFT badge system for milestones
- Loyalty tiers (Bronze, Silver, Gold)
- Exclusive deals for high-tier users

**Epic 10: Geo-Based Discovery**
- Location detection via browser geolocation
- "Deals near me" filter
- Map view of nearby deals

**Recommendation:** Choose Epic 9 (On-Chain Reputation) if implementing
- Most aligned with Web3 value prop
- NFT badges are quick to implement (reuse NFT minting logic)
- Gamification drives engagement

**Total Effort:** 8-12 hours (~1 day for chosen feature)

---

## Epic 11: Submission Preparation ⭐ CRITICAL

**Priority:** Highest
**Objective:** Professional presentation and submission
**Target Timeline:** Day 12-14 (October 27-30, 2025)
**Dependencies:** All core features complete

### Story 11.1: Deployment

**As a** developer
**I want** to deploy the application to production
**So that** judges can access a live demo

**Business Value:** Required for submission

#### Tasks

**Task 11.1.1: Deploy Frontend to Vercel**
- **Description:** Production deployment of Next.js app
- **Acceptance Criteria:**
  - Vercel project created
  - GitHub repo connected
  - Environment variables configured (RPC endpoint, API keys, etc.)
  - Auto-deploy on push to main branch
  - Live URL accessible
  - Test: Visit production URL, verify app loads
- **Technical Notes:**
  ```bash
  vercel --prod
  ```
- **Estimated Effort:** 1-2 hours

**Task 11.1.2: Deploy Smart Contracts to Solana**
- **Description:** Deploy to Devnet or Mainnet-beta
- **Acceptance Criteria:**
  - Decision: Devnet (free) or Mainnet-beta (more credible but costs SOL)
  - Deploy via Anchor CLI
  - Program ID recorded and added to frontend env vars
  - Verify deployment on Solana Explorer
  - Test: Call program from frontend on production
- **Technical Notes:**
  ```bash
  # Devnet
  solana config set --url devnet
  anchor deploy

  # Mainnet (optional)
  solana config set --url mainnet-beta
  anchor deploy
  ```
- **Estimated Effort:** 1 hour

**Task 11.1.3: Test Live Deployment**
- **Description:** End-to-end testing on production
- **Acceptance Criteria:**
  - Test all flows: merchant create deal, user purchase, redemption
  - Verify wallet connection works
  - Verify transactions succeed on Solana
  - Check mobile responsiveness
  - No console errors
  - Test: Complete full user journey on production
- **Technical Notes:** Manual testing on staging environment before prod
- **Estimated Effort:** 2-3 hours

**Story 11.1 Total Effort:** 4-6 hours

---

### Story 11.2: GitHub & Documentation

**As a** judge
**I want** clear documentation and code
**So that** I can understand and evaluate the project

**Business Value:** Required for submission, impacts judging

#### Tasks

**Task 11.2.1: Write Comprehensive README.md**
- **Description:** Update README with setup and usage instructions
- **Acceptance Criteria:**
  - Sections: Project description, Tech stack, Features, Setup instructions, Environment variables, Deployment, License
  - Setup instructions: Step-by-step for running locally
  - Screenshots or GIFs demonstrating features
  - Links to: Live demo, demo video, technical write-up
  - Test: Follow README instructions on fresh machine, verify works
- **Technical Notes:**
  ```markdown
  # Web3 Deal Discovery & Loyalty Platform

  ## Overview
  ...

  ## Tech Stack
  ...

  ## Setup Instructions
  1. Clone repo
  2. Install dependencies: `npm install`
  3. Configure env vars
  4. Run: `npm run dev`
  ```
- **Estimated Effort:** 2-3 hours

**Task 11.2.2: Add Screenshots/GIFs**
- **Description:** Visual documentation of features
- **Acceptance Criteria:**
  - Screenshots: Marketplace, deal detail, merchant dashboard, QR redemption
  - Optional: GIFs showing flows (create deal, purchase, redeem)
  - Added to README and/or docs/ folder
  - Test: Verify images load in README
- **Technical Notes:** Use macOS Screenshot tool or CloudApp for GIFs
- **Estimated Effort:** 1 hour

**Task 11.2.3: Clean Up Code**
- **Description:** Remove development artifacts
- **Acceptance Criteria:**
  - Remove: console.log statements, commented code, TODOs
  - Add: Code comments for complex logic
  - Format: Run Prettier on all files
  - Lint: Run ESLint, fix errors
  - Test: `npm run lint` passes
- **Technical Notes:**
  ```bash
  npm run lint:fix
  npm run format
  ```
- **Estimated Effort:** 1-2 hours

**Task 11.2.4: Write Technical Write-Up (2-4 pages)**
- **Description:** Detailed technical documentation
- **Acceptance Criteria:**
  - Sections:
    - Design choices (Why Solana? Why Metaplex?)
    - Tech stack justification
    - Architecture diagram
    - Smart contract design
    - Database schema
    - API integrations
    - Security considerations
    - Web3 integration challenges and solutions
    - User flows (diagrams)
    - Innovations and differentiators
  - Format: PDF or Markdown
  - Length: 2-4 pages
  - Test: Share with someone unfamiliar, get feedback
- **Technical Notes:** Use Notion, Google Docs, or Markdown
- **Estimated Effort:** 3-4 hours

**Story 11.2 Total Effort:** 7-10 hours

---

### Story 11.3: Demo Video

**As a** judge
**I want** to see the product in action
**So that** I can evaluate it without running it myself

**Business Value:** Critical for judging, first impression

#### Tasks

**Task 11.3.1: Write Video Script**
- **Description:** Plan video content
- **Acceptance Criteria:**
  - Script structure:
    - Intro (30s): Problem statement, solution overview
    - Demo (2-3 min): Merchant flow, user flow, redemption flow
    - Innovation (1 min): Key differentiators (Web3 abstraction, API integration, social features)
    - Outro (30s): Call-to-action, links
  - Script written and reviewed
  - Test: Read script aloud, ensure <5 min
- **Technical Notes:** Google Docs or text file
- **Estimated Effort:** 1 hour

**Task 11.3.2: Record Screen Capture (3-5 min)**
- **Description:** Record app usage
- **Acceptance Criteria:**
  - Recording software: Loom, OBS, or QuickTime
  - Resolution: 1080p minimum
  - Audio: Clear voiceover (use good mic or re-record audio)
  - Captures:
    - Merchant creating deal
    - User browsing and purchasing
    - QR redemption flow
    - Key differentiators (social features, API deals, Web3 abstraction if implemented)
  - Length: 3-5 minutes (max)
  - Test: Watch recording, verify quality
- **Technical Notes:**
  - OBS Studio (free, powerful)
  - Loom (easy, cloud-based)
- **Estimated Effort:** 2-3 hours (including retakes)

**Task 11.3.3: Edit Video**
- **Description:** Polish recording
- **Acceptance Criteria:**
  - Editing software: iMovie, DaVinci Resolve, or online editor
  - Edits: Cut awkward pauses, smooth transitions
  - Captions/text overlays: Highlight key features
  - Background music: Subtle, non-distracting (optional)
  - Export: 1080p MP4
  - Test: Watch final video, verify pacing and clarity
- **Technical Notes:**
  - iMovie (Mac, simple)
  - DaVinci Resolve (free, powerful)
- **Estimated Effort:** 2-3 hours

**Task 11.3.4: Upload to YouTube**
- **Description:** Host video publicly
- **Acceptance Criteria:**
  - Upload to YouTube (unlisted or public)
  - Title: "Web3 Deal Discovery & Loyalty Platform - Hackathon Demo"
  - Description: Project description, links (GitHub, live demo)
  - Thumbnail: Custom thumbnail (optional but recommended)
  - Test: Verify video plays, links work
- **Technical Notes:** YouTube or Vimeo
- **Estimated Effort:** 30 min

**Story 11.3 Total Effort:** 5.5-7.5 hours

---

### Story 11.4: Submission

**As a** participant
**I want** to submit my project
**So that** I can compete for prizes

**Business Value:** Required to win

#### Tasks

**Task 11.4.1: Submit via Superteam Earn**
- **Description:** Fill submission form on hackathon page
- **Acceptance Criteria:**
  - URL: https://earn.superteam.fun/listing/build-a-web3-deal-discovery-and-loyalty-platform-with-nft-coupons
  - Form fields:
    - Project title: "Web3 Deal Discovery & Loyalty Platform"
    - Description: Concise summary (2-3 paragraphs)
    - Live demo URL: Vercel deployment
    - GitHub repo URL: Public repo
    - Video URL: YouTube link
    - Documentation: Technical write-up (PDF or link)
    - Team members: Your name/info
  - Review before final submit
  - Test: Verify all links work
- **Technical Notes:** Submit 24-48h before deadline for buffer
- **Estimated Effort:** 1 hour

**Task 11.4.2: Confirm Submission Received**
- **Description:** Verify submission successful
- **Acceptance Criteria:**
  - Confirmation email received (if sent)
  - Submission visible on Superteam Earn page
  - Screenshot saved for records
  - Test: Check submission status
- **Technical Notes:** Follow up if no confirmation within 24h
- **Estimated Effort:** 15 min

**Story 11.4 Total Effort:** 1-2 hours

---

**Epic 11 Acceptance Criteria:**
- ✅ Frontend deployed to production (Vercel)
- ✅ Smart contracts deployed (Devnet or Mainnet)
- ✅ Live demo tested and functional
- ✅ GitHub repo with comprehensive README
- ✅ Code cleaned up and commented
- ✅ Technical write-up complete (2-4 pages)
- ✅ Demo video recorded and uploaded (3-5 min)
- ✅ Submission form filled and submitted
- ✅ Submission confirmed

**Epic 11 Total Effort:** 17.5-25.5 hours (~2-3 days)

---

## Summary: Total Effort Estimates

| Epic | Priority | Effort | Days |
|------|----------|--------|------|
| Epic 1: NFT Coupons | ⭐ Critical | 13-18 hours | ~2 days |
| Epic 2: Merchant Dashboard | ⭐ Critical | 35-46 hours | ~3-4 days |
| Epic 3: User Marketplace | ⭐ Critical | 36-45 hours | ~3-4 days |
| Epic 4: Redemption Flow | ⭐ Critical | 21-27 hours | ~2-3 days |
| Epic 5: Deal Aggregator | 🟡 Medium | 9-12 hours | ~1 day |
| Epic 6: Social Features | 🟡 Medium | 12-16 hours | ~1.5 days |
| Epic 7: Web3 Abstraction | 🟢 Low | 13-16 hours | ~2 days |
| Epic 8-10: Bonus Feature | 🟢 Low | 8-12 hours | ~1 day |
| Epic 11: Submission | ⭐ Critical | 17.5-25.5 hours | ~2-3 days |

**Total (All Epics):** 164.5-217.5 hours

**Realistic Timeline (14 days @ 12-16 hours/day):**
- **Critical Path (Must-Have):** Epics 1, 2, 3, 4, 11 = ~125-162 hours (~10-12 days)
- **Differentiators (Should-Have):** Epics 5, 6 = ~21-28 hours (~2 days)
- **Bonus (Nice-to-Have):** Epics 7, 8-10 = ~21-28 hours (~2 days)

**Recommended Approach:**
1. Days 1-8: Complete critical path (Epics 1-4)
2. Days 9-11: Add differentiators (Epics 5-6) + ONE bonus feature (Epic 7 or 9)
3. Days 12-14: Submission prep (Epic 11) + buffer for polish and fixes

---

## Non-Functional Requirements

### Performance
- Page load time: <3 seconds on 3G
- Marketplace loads: <2 seconds on 4G
- Transaction confirmation: <30 seconds on Solana Devnet

### Security
- No private keys stored in frontend code
- All API keys in environment variables
- Input validation on all forms
- SQL injection prevention (use parameterized queries)
- XSS prevention (React handles by default)

### Accessibility
- Keyboard navigation functional
- ARIA labels on interactive elements
- Color contrast meets WCAG AA standards
- Mobile-friendly touch targets (min 44x44px)

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile: iOS Safari, Chrome Android

### Mobile Responsiveness
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
- Mobile-first design approach
- Touch-friendly UI elements

---

## Success Metrics & Judging Criteria

**Hackathon Judging (Estimated Weights):**
- **User Experience (25%):** Web3 abstraction, mobile design, polish
- **Technical Implementation (25%):** Code quality, smart contracts, architecture
- **Innovation & Creativity (25%):** Unique features, differentiators
- **Feasibility & Scalability (15%):** Real-world viability, API integrations
- **Completeness (10%):** All requirements addressed, demo quality

**Winning Strategy:**
- **Must-Have:** All 4 critical epics functional (Epics 1-4)
- **Competitive Edge:** At least ONE differentiator (Epic 5 or 6)
- **Winning Edge:** Web3 abstraction (Epic 7) OR bonus feature (Epic 8-10)
- **Presentation:** Professional demo video + live demo + technical write-up

---

## Risk Mitigation

### Technical Risks

**Risk: Smart Contract Complexity**
- **Mitigation:** Start with simple mint/burn, add features incrementally
- **Fallback:** Use existing Metaplex examples as templates

**Risk: Wallet Integration Issues**
- **Mitigation:** Test on multiple browsers and wallets early
- **Fallback:** Focus on Phantom wallet only if time-constrained

**Risk: API Rate Limits**
- **Mitigation:** Implement caching from day 1
- **Fallback:** Use mock data if API unavailable

### Timeline Risks

**Risk: Falling Behind Schedule**
- **Mitigation:** Daily checkpoints (see TIMELINE.md)
- **Fallback:** Cut Epic 7 and bonus features, focus on core MVP

**Risk: Scope Creep**
- **Mitigation:** Refer to this PRD, stick to defined tasks
- **Fallback:** TIMELINE.md has checkpoint decision points (cut features if needed)

### Submission Risks

**Risk: Demo Video Quality**
- **Mitigation:** Record early (Day 12-13), allow time for retakes
- **Fallback:** Simple screen recording with clear narration better than overly produced video

**Risk: Last-Minute Bugs**
- **Mitigation:** Submit 24-48h early, use buffer days for fixes
- **Fallback:** Known bugs documented in README if not fixed in time

---

## Appendix

### A. NFT Metadata Schema (Full Example)

```json
{
  "name": "50% Off - Artisan Coffee Roasters",
  "description": "50% discount on all specialty coffee beans. Valid at all locations.",
  "image": "https://arweave.net/abc123...",
  "external_url": "https://example.com/deals/123",
  "attributes": [
    {
      "trait_type": "Discount",
      "value": "50%"
    },
    {
      "trait_type": "Merchant",
      "value": "Artisan Coffee Roasters"
    },
    {
      "trait_type": "Merchant ID",
      "value": "5tQp7B8z9cX2gW1hF4mK..."
    },
    {
      "trait_type": "Expiry",
      "value": "2025-12-31"
    },
    {
      "trait_type": "Redemptions Remaining",
      "value": "1"
    },
    {
      "trait_type": "Category",
      "value": "Food & Beverage"
    },
    {
      "trait_type": "Created At",
      "value": "2025-10-17"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/abc123...",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

### B. Database Schema (PostgreSQL)

```sql
-- Merchants
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals (metadata cache)
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id),
  nft_mint_address TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  discount_percentage INTEGER,
  expiry_date TIMESTAMPTZ,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events (analytics)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'view', 'purchase', 'redemption'
  deal_id UUID REFERENCES deals(id),
  user_wallet TEXT,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Users (optional)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT CHECK (role IN ('merchant', 'user')),
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  user_wallet TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  user_wallet TEXT,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (deal_id, user_wallet)
);

-- Resale Listings
CREATE TABLE resale_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_mint TEXT UNIQUE NOT NULL,
  seller_wallet TEXT,
  price_sol NUMERIC,
  listed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_wallet TEXT,
  referee_wallet TEXT,
  deal_id UUID REFERENCES deals(id),
  claimed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### C. Environment Variables Template

```bash
# .env.local (Frontend)

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_NFT_PROGRAM_ID=<your-deployed-program-id>

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Authentication (Privy/Dynamic)
NEXT_PUBLIC_PRIVY_APP_ID=<your-privy-app-id>
PRIVY_APP_SECRET=<your-privy-secret>

# File Storage (Arweave)
ARWEAVE_WALLET_KEY=<your-arweave-wallet-key>

# Payment (Stripe - optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-key>
STRIPE_SECRET_KEY=<your-stripe-secret>

# API Integrations (Deal Aggregators)
RAPIDAPI_KEY=<your-rapidapi-key>
SKYSCANNER_API_KEY=<your-skyscanner-key>

# Analytics (Posthog - optional)
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-key>
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### D. Smart Contract Functions Reference

```rust
// Key Instructions

#[program]
pub mod nft_coupon {
    pub fn initialize_merchant(ctx: Context<InitializeMerchant>) -> Result<()>
    pub fn mint_coupon(ctx: Context<MintCoupon>, metadata_uri: String) -> Result<()>
    pub fn claim_coupon(ctx: Context<ClaimCoupon>) -> Result<()>
    pub fn list_for_resale(ctx: Context<ListResale>, price: u64) -> Result<()>
    pub fn redeem_coupon(ctx: Context<RedeemCoupon>) -> Result<()>
    pub fn verify_ownership(ctx: Context<VerifyOwnership>) -> Result<bool>
}
```

---

**Document Version:** 1.0
**Created:** October 17, 2025
**Last Updated:** October 17, 2025
**Next Review:** End of Day 3 (October 18, 2025)

Bismillah! May Allah grant tawfeeq and barakah in this implementation. Alhamdulillah for excellent planning! 🚀
