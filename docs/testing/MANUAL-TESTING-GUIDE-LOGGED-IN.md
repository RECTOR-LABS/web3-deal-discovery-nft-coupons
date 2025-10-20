# Manual Testing Guide - Logged-In User Features

**Last Updated:** 2025-10-19
**Tester:** RECTOR
**Platform:** Web3 Deal Discovery (DealCoupon)
**Test Environment:** localhost:3000 (Development)

---

## 📋 Testing Overview

This guide provides comprehensive manual testing for **logged-in user features** across all 10 completed Epics. Follow each section sequentially and check off items as you test.

**Estimated Time:** 60-90 minutes

---

## 🔧 Pre-Requisites

### Setup Checklist
- [ ] Dev server running (`npm run dev`)
- [ ] Browser: Chrome/Brave (for wallet extensions)
- [ ] Wallet installed: Phantom OR Solflare
- [ ] Wallet funded: ~0.5 SOL (devnet)
- [ ] `.env.local` configured with all required keys
- [ ] Database: Supabase connection working

### Get Devnet SOL (If Needed)
```bash
# Option 1: Solana CLI
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet

# Option 2: Web faucet
# Visit: https://faucet.solana.com/
```

---

## 🔐 Authentication Setup

### Test 1: Connect Wallet (Solana Wallet Adapter)

**Steps:**
1. [ ] Visit `http://localhost:3000`
2. [ ] Click "Select Wallet" button in top-right header
3. [ ] Select Phantom (or Solflare) from wallet list
4. [ ] Approve connection in wallet popup
5. [ ] Verify header changes to show wallet address (truncated)

**Expected Results:**
- ✅ Wallet connection modal appears
- ✅ Wallet list shows Phantom + Solflare
- ✅ Connection approved in wallet
- ✅ Header shows connected wallet address
- ✅ Navigation expands to show: My Coupons, Profile

**Bugs/Issues Found:**
```
(Write any issues here)
```

---

## Epic 1: NFT Coupons (Blockchain Integration)

### Test 2: View Smart Contract Connection

**Steps:**
1. [ ] Stay on homepage (logged in)
2. [ ] Open browser DevTools → Console
3. [ ] Check for Solana connection logs
4. [ ] Verify no RPC errors

**Expected Results:**
- ✅ No RPC connection errors
- ✅ Network: devnet
- ✅ Program ID visible in config: `RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7`

**Bugs/Issues Found:**
```

```

---

## Epic 2: Merchant Dashboard (If You Have Merchant Account)

### Test 3: Access Merchant Dashboard

**Steps:**
1. [ ] Visit `/dashboard` (if you're registered as merchant)
2. [ ] If not merchant, visit `/register` first
3. [ ] Verify dashboard loads

**Expected Results:**
- ✅ Dashboard accessible (if merchant)
- ✅ Redirected to homepage if not merchant
- ✅ Navigation shows dashboard link

**Bugs/Issues Found:**
```

```

### Test 4: Create a Test Deal (Merchant Only)

**Steps:**
1. [ ] Go to `/dashboard/deals/create`
2. [ ] Fill in deal form:
   - Title: "Manual Test Deal - 50% OFF"
   - Description: "Testing deal creation flow"
   - Category: Food & Beverage
   - Discount: 50%
   - Original Price: $20
   - Discounted Price: $10
   - Expiry: 7 days from now
   - Max Claims: 10
3. [ ] Upload image (any JPG/PNG)
4. [ ] Click "Create Deal"
5. [ ] Verify deal appears in your deals list

**Expected Results:**
- ✅ Form validation works
- ✅ Image upload successful
- ✅ Deal created in database
- ✅ Deal appears in `/dashboard/deals`
- ✅ Deal appears in marketplace

**Bugs/Issues Found:**
```

```

---

## Epic 3: User Marketplace

### Test 5: Browse Marketplace as Logged-In User

**Steps:**
1. [ ] Go to `/marketplace`
2. [ ] Verify all deals display
3. [ ] Use search: Type "test"
4. [ ] Filter by category: Select "Food & Beverage"
5. [ ] Change sort order: "Highest Discount"
6. [ ] Verify vote buttons are clickable (not grayed out)

**Expected Results:**
- ✅ All deals load
- ✅ Search filters results
- ✅ Category filter works
- ✅ Sort changes order
- ✅ Vote buttons functional (not disabled)

**Bugs/Issues Found:**
```

```

### Test 6: View Deal Details

**Steps:**
1. [ ] Click any deal card from marketplace
2. [ ] Verify deal details page loads
3. [ ] Check all sections:
   - Deal image
   - Title & description
   - Discount badge
   - Merchant info
   - Expiry date
   - Reviews section
   - Vote buttons
4. [ ] Verify "Claim This Deal" button visible

**Expected Results:**
- ✅ Deal details page loads
- ✅ All metadata displays correctly
- ✅ "Claim This Deal" button visible (not "Sign In" button)
- ✅ Reviews section shows existing reviews
- ✅ Vote buttons functional

**Bugs/Issues Found:**
```

```

### Test 7: Claim a Deal (NFT Minting)

**Steps:**
1. [ ] From deal details page, click "Claim This Deal"
2. [ ] Verify wallet prompt appears
3. [ ] Approve transaction in Phantom/Solflare
4. [ ] Wait for transaction confirmation
5. [ ] Verify success message
6. [ ] Go to `/coupons` (My Coupons)
7. [ ] Verify claimed deal appears in your coupons list

**Expected Results:**
- ✅ Wallet transaction prompt appears
- ✅ Transaction fee shown (~0.001-0.01 SOL)
- ✅ Transaction confirmed on-chain
- ✅ Success message: "Deal claimed successfully!"
- ✅ NFT appears in `/coupons` page
- ✅ Coupon shows "Available" status
- ✅ QR code button visible

**Bugs/Issues Found:**
```

```

---

## Epic 4: Redemption Flow

### Test 8: Generate QR Code

**Steps:**
1. [ ] Go to `/coupons` (My Coupons)
2. [ ] Find your claimed coupon
3. [ ] Click "Generate QR Code" button
4. [ ] Verify QR code modal appears
5. [ ] Check QR code contains:
   - Coupon ID
   - User wallet signature
   - Deal details
6. [ ] Click "Download QR" (optional)

**Expected Results:**
- ✅ QR code modal opens
- ✅ QR code renders clearly
- ✅ QR contains valid redemption data
- ✅ Download works (optional)
- ✅ Close button works

**Bugs/Issues Found:**
```

```

### Test 9: Redeem Coupon (Merchant View)

**Steps:**
1. [ ] Go to `/dashboard/redeem` (merchant only)
2. [ ] Click "Scan QR Code"
3. [ ] Allow camera access
4. [ ] Scan the QR code from Test 8 (use phone to display QR)
5. [ ] Verify coupon details appear
6. [ ] Click "Redeem Coupon"
7. [ ] Approve burn transaction in wallet
8. [ ] Verify success message
9. [ ] Go back to `/coupons` and verify coupon status = "Redeemed"

**Expected Results:**
- ✅ Camera scanner opens
- ✅ QR code scanned successfully
- ✅ Coupon details preview shown
- ✅ Redemption transaction confirmed
- ✅ NFT burned on-chain
- ✅ Coupon status updated to "Redeemed"
- ✅ Coupon no longer shows "Generate QR" button

**Bugs/Issues Found:**
```

```

---

## Epic 5: Deal Aggregator (External APIs)

### Test 10: View Partner Deals

**Steps:**
1. [ ] Go to homepage `/`
2. [ ] Scroll to see deals grid
3. [ ] Look for deals with "Partner Deal" blue badge
4. [ ] Click a partner deal
5. [ ] Verify "View on Partner Site" button appears
6. [ ] Click button (opens external URL)

**Expected Results:**
- ✅ Partner deals visible with blue badge
- ✅ External deals mixed with platform deals
- ✅ External link button works
- ✅ Opens in new tab
- ✅ No vote buttons on external deals

**Bugs/Issues Found:**
```

```

---

## Epic 6: Social Layer

### Test 11: Vote on Deals (Upvote/Downvote)

**Steps:**
1. [ ] Go to `/marketplace`
2. [ ] Find any platform deal (not partner deal)
3. [ ] Click upvote button (thumbs up)
4. [ ] Verify vote count increases
5. [ ] Click upvote again (should remove vote)
6. [ ] Verify vote count decreases
7. [ ] Click downvote button (thumbs down)
8. [ ] Verify vote count adjusts
9. [ ] Refresh page
10. [ ] Verify your vote persists

**Expected Results:**
- ✅ Upvote button turns green when active
- ✅ Downvote button turns red when active
- ✅ Vote count updates immediately (optimistic)
- ✅ Removing vote works (click again)
- ✅ Changing vote works (upvote → downvote)
- ✅ Votes persist after refresh
- ✅ Only 1 vote per user per deal

**Bugs/Issues Found:**
```

```

### Test 12: Submit Review

**Steps:**
1. [ ] Go to any deal details page `/marketplace/[id]`
2. [ ] Scroll to reviews section
3. [ ] Click "Write a Review" button
4. [ ] Fill review form:
   - Rating: 5 stars
   - Comment: "Great deal! Saved $20 on pizza."
5. [ ] Click "Submit Review"
6. [ ] Verify review appears in reviews list
7. [ ] Verify your wallet address shown as reviewer

**Expected Results:**
- ✅ Review form appears
- ✅ Star rating selector works
- ✅ Comment textarea accepts input
- ✅ Submit button enabled when valid
- ✅ Review saved to database
- ✅ Review appears immediately
- ✅ Wallet address shown (truncated)
- ✅ Timestamp shown

**Bugs/Issues Found:**
```

```

### Test 13: Activity Feed

**Steps:**
1. [ ] Go to `/marketplace`
2. [ ] Look for "Recent Activity" section (right sidebar)
3. [ ] Verify recent claims, reviews, votes appear
4. [ ] Check formatting and timestamps

**Expected Results:**
- ✅ Activity feed visible
- ✅ Shows recent platform activity
- ✅ Timestamps are relative ("2 hours ago")
- ✅ User wallets truncated
- ✅ Deal titles visible

**Bugs/Issues Found:**
```

```

---

## Epic 7: Web3 Abstraction

### Test 14: No Crypto Jargon

**Steps:**
1. [ ] Browse homepage and marketplace
2. [ ] Check all labels and buttons
3. [ ] Verify terminology used:
   - "Coupon" (not "NFT")
   - "Claim" (not "Mint")
   - "Redeem" (not "Burn")
   - "My Coupons" (not "My Tokens")

**Expected Results:**
- ✅ User-friendly language everywhere
- ✅ No blockchain jargon visible
- ✅ Web3 invisible to non-technical users
- ✅ Transactions feel like normal app actions

**Bugs/Issues Found:**
```

```

---

## Epic 8: Staking & Cashback

### Test 15: Stake NFT Coupons

**Steps:**
1. [ ] Go to `/staking`
2. [ ] Verify staking dashboard loads
3. [ ] Check sections:
   - Available to Stake (your unclaimed coupons)
   - Currently Staking (if any)
   - Rewards Earned
   - APY rate (5-15% based on tier)
4. [ ] Click "Stake" on an available coupon
5. [ ] Approve transaction
6. [ ] Verify coupon moves to "Currently Staking"
7. [ ] Check estimated rewards calculation

**Expected Results:**
- ✅ Staking page accessible
- ✅ Available coupons listed
- ✅ Stake button functional
- ✅ Transaction confirmed
- ✅ Coupon status updated
- ✅ APY rate displays correctly
- ✅ Rewards calculation visible

**Bugs/Issues Found:**
```

```

### Test 16: Unstake Coupons

**Steps:**
1. [ ] From staking page, find staked coupon
2. [ ] Click "Unstake" button
3. [ ] Approve transaction
4. [ ] Verify coupon returns to available
5. [ ] Check if rewards were distributed

**Expected Results:**
- ✅ Unstake button visible
- ✅ Transaction confirmed
- ✅ Coupon moved back to available
- ✅ Rewards calculated and shown
- ✅ Rewards sent to wallet (if applicable)

**Bugs/Issues Found:**
```

```

### Test 17: Cashback History

**Steps:**
1. [ ] On staking page, find "Cashback History" section
2. [ ] Verify past cashback transactions listed
3. [ ] Check columns: Date, Amount, Type, Status

**Expected Results:**
- ✅ Cashback history table visible
- ✅ Transactions listed chronologically
- ✅ Amounts shown correctly
- ✅ Status indicators clear

**Bugs/Issues Found:**
```

```

---

## Epic 9: Loyalty System

### Test 18: View Profile & Loyalty Tier

**Steps:**
1. [ ] Go to `/profile`
2. [ ] Check profile sections:
   - Wallet address
   - Current tier (Bronze/Silver/Gold/Platinum)
   - XP progress bar
   - Tier benefits
   - Stats (deals claimed, reviews written, etc.)
3. [ ] Verify tier badge displays correctly

**Expected Results:**
- ✅ Profile page loads
- ✅ Wallet address shown
- ✅ Current tier visible with icon
- ✅ XP progress bar shows progress to next tier
- ✅ Tier benefits listed
- ✅ Stats accurate

**Bugs/Issues Found:**
```

```

### Test 19: View NFT Badges

**Steps:**
1. [ ] On profile page, scroll to "NFT Badges" section
2. [ ] Verify earned badges display
3. [ ] Check badge types:
   - First Claim
   - Deal Hunter (5 claims)
   - Super Saver (10 claims)
   - Social Butterfly (5 reviews)
   - Voting Veteran (10 votes)
   - Staking Pro
   - Referral Champion
   - Platinum Member
4. [ ] Click a badge to view details

**Expected Results:**
- ✅ Badges section visible
- ✅ Earned badges highlighted
- ✅ Locked badges grayed out
- ✅ Badge details modal works
- ✅ Requirements shown for locked badges

**Bugs/Issues Found:**
```

```

### Test 20: Unlock Tier-Exclusive Deals

**Steps:**
1. [ ] Go to `/marketplace`
2. [ ] Look for deals with tier requirement badges (Silver+, Gold+, Platinum)
3. [ ] If you're Bronze tier:
   - Verify exclusive deals show lock icon
   - Click locked deal
   - Verify "Upgrade to [Tier]" message appears
4. [ ] If you have higher tier:
   - Verify you can access exclusive deals
   - Claim an exclusive deal

**Expected Results:**
- ✅ Tier-exclusive deals marked with badge
- ✅ Lock icon shows if user lacks access
- ✅ Upgrade prompt shown for locked deals
- ✅ Users with required tier can claim
- ✅ Exclusive deals filtered correctly

**Bugs/Issues Found:**
```

```

---

## Epic 10: Geo Discovery

### Test 21: Enable Geolocation

**Steps:**
1. [ ] Go to `/marketplace`
2. [ ] Click "Enable Location" button (if visible)
3. [ ] Allow browser location access
4. [ ] Verify distance filter appears
5. [ ] Adjust distance slider (1-50 miles)
6. [ ] Verify deals filtered by proximity

**Expected Results:**
- ✅ Location permission prompt appears
- ✅ Permission granted
- ✅ Distance filter slider appears
- ✅ Deals filtered by distance
- ✅ Distance shown on deal cards ("2.5 miles away")
- ✅ No deals outside range

**Bugs/Issues Found:**
```

```

### Test 22: View Deals on Map

**Steps:**
1. [ ] With geolocation enabled, click "Map View" tab
2. [ ] Verify interactive map loads (Leaflet)
3. [ ] Check map markers for each deal
4. [ ] Click a marker
5. [ ] Verify deal popup appears
6. [ ] Click "View Deal" in popup
7. [ ] Verify navigates to deal details

**Expected Results:**
- ✅ Map view tab works
- ✅ Map renders correctly
- ✅ Markers placed at deal locations
- ✅ User location marker visible (blue)
- ✅ Deal popups open on click
- ✅ Deal images and info shown in popup
- ✅ "View Deal" link works

**Bugs/Issues Found:**
```

```

---

## Cross-Epic Features

### Test 23: Navigation (Logged-In State)

**Steps:**
1. [ ] Check header navigation shows:
   - DealCoupon logo (links to `/`)
   - Search bar
   - Location dropdown
   - My Coupons link
   - Profile link
   - Wallet button (connected state)
2. [ ] Click each nav link
3. [ ] Verify all pages load correctly

**Expected Results:**
- ✅ All nav links visible
- ✅ Links navigate correctly
- ✅ Active page highlighted
- ✅ Wallet shows connected (truncated address)

**Bugs/Issues Found:**
```

```

### Test 24: Logout & Reconnect

**Steps:**
1. [ ] Click wallet button in header
2. [ ] Click "Disconnect" in wallet dropdown
3. [ ] Verify logout successful
4. [ ] Verify navigation reverts to guest state
5. [ ] Try accessing `/coupons` (should redirect)
6. [ ] Reconnect wallet
7. [ ] Verify logged back in

**Expected Results:**
- ✅ Disconnect button visible
- ✅ Wallet disconnects
- ✅ Nav shows "Select Wallet" again
- ✅ Protected routes redirect to homepage
- ✅ Reconnect works smoothly
- ✅ User state restored

**Bugs/Issues Found:**
```

```

---

## Performance & Polish

### Test 25: Loading States

**Steps:**
1. [ ] Visit various pages and observe:
   - Deal cards loading skeleton
   - Vote buttons loading state
   - Reviews loading
   - Staking page loading
2. [ ] Verify spinners/skeletons appear during loads

**Expected Results:**
- ✅ Loading indicators visible
- ✅ No blank screens
- ✅ Smooth transitions
- ✅ Loading states styled consistently

**Bugs/Issues Found:**
```

```

### Test 26: Error Handling

**Steps:**
1. [ ] Try claiming a deal with insufficient SOL
2. [ ] Try staking without any coupons
3. [ ] Try voting on same deal multiple times
4. [ ] Try accessing invalid deal ID: `/marketplace/invalid-id`

**Expected Results:**
- ✅ Error messages clear and helpful
- ✅ Insufficient funds error shown
- ✅ Empty state messages when no data
- ✅ 404 page for invalid routes
- ✅ No crashes or white screens

**Bugs/Issues Found:**
```

```

### Test 27: Mobile Responsiveness

**Steps:**
1. [ ] Resize browser to mobile width (375px)
2. [ ] Test all pages on mobile view:
   - Homepage
   - Marketplace
   - Deal details
   - My Coupons
   - Profile
   - Staking
3. [ ] Verify layout adapts correctly

**Expected Results:**
- ✅ All pages responsive
- ✅ No horizontal scroll
- ✅ Buttons/text readable
- ✅ Touch targets adequate (44px min)
- ✅ Wallet connect modal mobile-friendly

**Bugs/Issues Found:**
```

```

---

## 🐛 Bug Report Summary

### Critical Bugs (Blockers)
```
1.
2.
3.
```

### Major Bugs (Functionality Issues)
```
1.
2.
3.
```

### Minor Bugs (Polish/UX)
```
1.
2.
3.
```

### Suggestions for Improvement
```
1.
2.
3.
```

---

## ✅ Final Testing Checklist

### Core Flows
- [ ] Can connect wallet successfully
- [ ] Can browse deals as logged-in user
- [ ] Can claim a deal (NFT minting works)
- [ ] Can view claimed coupons
- [ ] Can generate QR code
- [ ] Can redeem coupon (merchant flow)

### Social Features
- [ ] Can vote on deals
- [ ] Can submit reviews
- [ ] Can view activity feed

### Advanced Features
- [ ] Can stake coupons
- [ ] Can view loyalty tier
- [ ] Can unlock tier-exclusive deals
- [ ] Can view NFT badges

### Geo Features
- [ ] Can enable geolocation
- [ ] Can filter deals by distance
- [ ] Can view deals on map

### Edge Cases
- [ ] Error handling works
- [ ] Loading states display
- [ ] Mobile responsive
- [ ] Logout/reconnect works

---

## 📊 Test Results Summary

**Total Tests:** 27
**Passed:** ___
**Failed:** ___
**Blocked:** ___
**Test Coverage:** ___%

**Overall Status:** 🟢 PASS | 🟡 PARTIAL | 🔴 FAIL

---

## 📝 Notes & Observations

```
(Add any additional notes, observations, or recommendations here)






```

---

**Testing Completed By:** RECTOR
**Date:** 2025-10-19
**Environment:** localhost:3000 (devnet)
**Browser:** Chrome/Brave
**Wallet:** Phantom/Solflare

---

**Bismillah! May Allah make this testing easy and successful.** 🎉
