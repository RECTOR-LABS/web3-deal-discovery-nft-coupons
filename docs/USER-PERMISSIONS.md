# User Permissions - Guest vs Logged-In Users

**Last Updated:** 2025-10-19

This document outlines the differences in functionality between guest users and authenticated users.

---

## Quick Comparison

| Feature | Guest User | Logged-In User |
|---------|-----------|----------------|
| View Homepage | ✅ Yes | ✅ Yes |
| Search Deals | ✅ Yes | ✅ Yes |
| Filter by Category | ✅ Yes | ✅ Yes |
| View Deal Details | ✅ Yes | ✅ Yes |
| Browse Marketplace | ✅ Yes | ✅ Yes |
| **Claim Deals** | ❌ No - Prompted to login | ✅ Yes - Mints NFT |
| **My Coupons Page** | ❌ No - Redirected to login | ✅ Yes |
| **Generate QR Codes** | ❌ No | ✅ Yes |
| **Redeem Coupons** | ❌ No | ✅ Yes (as merchant) |
| **Vote on Deals** | ❌ No | ✅ Yes |
| **Submit Reviews** | ❌ No | ✅ Yes |
| **Staking** | ❌ No - Redirected to login | ✅ Yes |
| **View Profile** | ❌ No - Redirected to login | ✅ Yes |
| **Loyalty Tiers** | ❌ No | ✅ Yes |
| **Merchant Dashboard** | ❌ No - Redirected to login | ✅ Yes (if merchant) |
| **Create Deals** | ❌ No | ✅ Yes (if merchant) |

---

## Detailed Breakdown

### 🌍 Guest User (Not Authenticated)

#### What Guests CAN Do (Groupon-like Browsing):

**Homepage (`/`):**
- ✅ View trending deals (top 6 by discount)
- ✅ View all deals grid (first 12)
- ✅ Search deals by keyword
- ✅ Filter deals by category (All, Food, Retail, Travel, etc.)
- ✅ Select location from dropdown
- ✅ Click deal cards to view details
- ✅ See deal images, titles, discounts, descriptions
- ✅ See "Partner Deal" badges (external deals from RapidAPI)

**Marketplace (`/marketplace`):**
- ✅ Browse all active deals
- ✅ Use advanced filters (search, category, sort, distance)
- ✅ View deals on map (if geolocation enabled)
- ✅ See activity feed (recent claims, reviews)
- ✅ Click deal cards to view full details

**Deal Details (`/marketplace/[id]`):**
- ✅ View full deal description
- ✅ See merchant information
- ✅ View reviews and ratings
- ✅ See vote counts (upvotes/downvotes)
- ✅ View deal expiration date
- ✅ See how many people bought this deal

#### What Guests CANNOT Do (Requires Login):

**Claiming & Ownership:**
- ❌ **Claim deals** → Shows "Sign In to Claim" button
- ❌ **Mint NFT coupons** → Requires wallet
- ❌ **View My Coupons** → Redirected to `/?error=auth_required`
- ❌ **Generate QR codes** → No coupon ownership

**Social Features:**
- ❌ **Vote on deals** (upvote/downvote) → Prompted to login
- ❌ **Submit reviews** → Prompted to login
- ❌ **Share referral links** → No referral tracking

**Advanced Features:**
- ❌ **Staking NFTs** → Redirected to login
- ❌ **View profile/loyalty tier** → Redirected to login
- ❌ **Earn cashback** → No wallet to receive rewards
- ❌ **Unlock tier-exclusive deals** → No tier (default: Bronze)

**Merchant Features:**
- ❌ **Access merchant dashboard** → Redirected to `/?error=auth_required`
- ❌ **Create deals** → No merchant account
- ❌ **Redeem coupons** → Cannot access redemption scanner

---

### 🔐 Logged-In User (Authenticated)

#### Everything Guests Can Do, PLUS:

**Claiming & NFT Ownership:**
- ✅ **Claim deals** → Mints NFT coupon to embedded Solana wallet
- ✅ **View My Coupons** (`/coupons`) → See all owned NFT coupons
- ✅ **Generate QR codes** → Each coupon has unique QR for redemption
- ✅ **Track coupon status** → See if used, expired, or available
- ✅ **Transfer/resell coupons** (if implemented) → Trade NFTs

**Social Engagement:**
- ✅ **Vote on deals** → Upvote/downvote to help others
- ✅ **Submit reviews** → Rate deals 1-5 stars + write review
- ✅ **Edit own reviews** → Update/delete your reviews
- ✅ **Share referral links** → Earn bonus when friends claim deals
- ✅ **Track referral rewards** → See who claimed via your link

**Advanced Features:**
- ✅ **Staking** (`/staking`) → Stake NFT coupons for 5-15% APY
- ✅ **Earn cashback** → Receive rewards to wallet
- ✅ **View profile** (`/profile`) → See stats, tier, badges
- ✅ **Loyalty tiers** → Bronze → Silver → Gold → Platinum
- ✅ **Unlock tier-exclusive deals** → Higher tiers see special offers
- ✅ **Earn NFT badges** → Collect achievement badges

**Merchant Capabilities (If Registered as Merchant):**
- ✅ **Access merchant dashboard** (`/dashboard`)
- ✅ **Create deals** → Upload images, set discount, expiry, limits
- ✅ **Mint NFT coupons** → Deploy deals on-chain
- ✅ **View analytics** → See views, claims, redemptions
- ✅ **Redeem coupons** (`/dashboard/redeem`) → Scan QR, burn NFTs
- ✅ **Manage settings** → Update business profile, hours, location

---

## Route Protection Summary

### Public Routes (No Auth Required):
- `/` - Homepage (Groupon-style)
- `/marketplace` - Deal marketplace
- `/marketplace/[id]` - Deal details
- `/test-payment` - Payment widget test

### Protected Routes (Require Authentication):
- `/coupons` - My Coupons (user)
- `/profile` - User profile
- `/staking` - NFT staking
- `/dashboard` - Merchant dashboard (merchant only)
- `/dashboard/*` - All dashboard pages (merchant only)
- `/register` - Merchant registration

### Behavior When Guest Accesses Protected Route:
1. Middleware intercepts request
2. Redirects to homepage: `/?error=auth_required&redirect=/original-path`
3. User sees login prompt
4. After login → Redirected back to original path

---

## Header Differences

### Guest User Header:
```
[DealCoupon Logo]  [Search] [Location] [Search Btn]  [Sign In]
------------------------------------------------------------
[All] [Food & Beverage] [Retail] [Travel] [Entertainment]
```

### Logged-In User Header:
```
[DealCoupon Logo]  [Search] [Location] [Search Btn]  [My Coupons] [Profile] [Logout]
------------------------------------------------------------
[All] [Food & Beverage] [Retail] [Travel] [Entertainment]
```

---

## Authentication Methods (For Logging In)

### Enabled:
- ✅ **Email** (Magic link via Privy)
- ✅ **Wallet** (Phantom, Solflare, etc.)

### Disabled (Require Privy Dashboard Setup):
- ❌ Google OAuth
- ❌ Twitter OAuth

---

## User Journey Examples

### Example 1: Guest Discovers Deal
1. Guest visits `http://localhost:3000`
2. Sees trending deals on homepage
3. Searches for "pizza"
4. Clicks on "50% off Pizza" deal
5. Views deal details page
6. Clicks "Claim This Deal"
7. **Prompted to Sign In** ⚠️
8. Signs in with email
9. Returns to deal page
10. Claims deal → NFT minted ✅
11. Goes to My Coupons → Sees NFT ✅

### Example 2: Logged-In User Claims & Redeems
1. User browses marketplace
2. Filters by "Food & Beverage"
3. Finds "30% off Burger" deal
4. Clicks "Claim This Deal" → NFT minted instantly ✅
5. Goes to `/coupons` (My Coupons)
6. Sees burger coupon
7. Clicks "Generate QR Code"
8. Shows QR to merchant
9. Merchant scans via `/dashboard/redeem`
10. NFT burned, deal redeemed ✅

### Example 3: Guest Tries to Access My Coupons Directly
1. Guest navigates to `/coupons`
2. Middleware detects no auth
3. Redirects to `/?error=auth_required&redirect=/coupons`
4. Shows login modal
5. After login → Redirected to `/coupons` ✅

---

## Key Differences in UX

| Feature | Guest Experience | Logged-In Experience |
|---------|-----------------|---------------------|
| Deal Cards | "Claim This Deal" button | "Claim This Deal" (works immediately) |
| Click Claim | Shows login modal | Mints NFT to wallet |
| Vote Buttons | Grayed out / Prompt to login | Functional upvote/downvote |
| Reviews Section | Read-only | Can submit/edit reviews |
| Navigation | Minimal (Browse Deals, Sign In) | Full (Marketplace, My Coupons, Staking, Profile) |
| Footer CTA | "Sign In Now" banner visible | No CTA (already logged in) |

---

## Technical Implementation

### Authentication Check:
```typescript
// In components/pages
const { authenticated } = usePrivy();

if (!authenticated) {
  // Show "Sign In" prompt
} else {
  // Allow claiming, voting, etc.
}
```

### Middleware Protection:
```typescript
// middleware.ts
export const config = {
  matcher: [
    '/dashboard/:path*',  // Merchant only
    '/merchant/:path*',   // Merchant only
    '/coupons/:path*',    // User only
    '/api/:path*',        // CORS headers
  ],
};
```

### Route Guards:
```typescript
// Automatic redirects for protected routes
if (pathname.startsWith('/dashboard') || pathname.startsWith('/merchant')) {
  if (!isAuthenticated) {
    redirect to '/?error=auth_required&redirect=[original-path]'
  }
}
```

---

## Benefits of This Approach

### For Product Success (Groupon Model):
1. **Low Barrier to Entry** - Guests can browse without signup
2. **Trust Building** - See real deals before committing
3. **Discovery First** - Search and explore freely
4. **Conversion Funnel** - Only ask for login when claiming

### For Web3 Adoption:
1. **Gradual Onboarding** - No wallet required to browse
2. **Embedded Wallets** - Privy creates wallet automatically on signup
3. **No Crypto Jargon** - "Coupons" not "NFTs" (until claimed)
4. **Email Login** - Familiar UX, crypto under the hood

---

## Summary

**Guest Users = Window Shoppers** (Browse, search, discover)
**Logged-In Users = Active Buyers** (Claim, own, redeem, earn)

The key insight: **Guests can see the value** (browse deals) **before committing** (signing up). This matches Groupon's proven conversion funnel and reduces friction for Web3 adoption.

---

**Next Steps for Testing:**
1. Test as guest - browse, search, try to claim (should prompt login)
2. Login with email - verify full access
3. Claim a deal - verify NFT minted
4. Try protected routes - verify redirects work

**Testing Documentation:**
- Guest User Testing: `docs/testing/GUEST-USER-UI-TEST-RESULTS.md`
- Regular User Testing: `docs/testing/MANUAL-TESTING-GUIDE-LOGGED-IN.md` (27 tests)
- Merchant Testing: `docs/testing/MERCHANT-TESTING-GUIDE.md` (10 tests)
- Automated Testing: `docs/testing/AUTOMATED-TEST-RESULTS.md`
- Testing Index: `docs/testing/README.md`

**Bismillah! This approach maximizes user acquisition while protecting premium features.** 🎉
