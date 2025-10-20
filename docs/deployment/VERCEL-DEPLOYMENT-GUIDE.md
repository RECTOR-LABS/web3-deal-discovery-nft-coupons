# Vercel Manual Deployment Guide

**Project:** Web3 Deal Discovery (DealCoupon)
**Framework:** Next.js 15.5.6
**Target:** Production Deployment
**Date:** October 2025

---

## 📋 Pre-Deployment Checklist

### 1. ✅ Verify Local Build Success
```bash
cd src/frontend
npm run build
```
**Expected:** Build completes without errors (✅ Already passing)

### 2. ✅ Run Type Checks
```bash
npm run typecheck
```
**Expected:** No TypeScript errors (✅ Already passing)

### 3. ✅ Verify Tests Pass
```bash
npm test
```
**Expected:** All tests pass (✅ 3/3 passing)

---

## 🔑 Environment Variables Preparation

### Required Variables (MUST SET)

Copy these from your local `.env.local`:

#### **Solana & Smart Contract**
```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_NFT_PROGRAM_ID=RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7
```

#### **Database (Supabase)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://mdxrtyqsusczmmpgspgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```
⚠️ **Security:** Service role key should be kept secret, never commit to Git

#### **Authentication (Privy) - OPTIONAL**
```bash
NEXT_PUBLIC_PRIVY_APP_ID=<your_privy_app_id>
```
⚠️ **Note:** Current version uses Solana Wallet Adapter, Privy is optional

#### **File Storage (Arweave)**
```bash
ARWEAVE_GATEWAY=https://arweave.net
NEXT_PUBLIC_ARWEAVE_GATEWAY=https://arweave.net
```
⚠️ **Important:** `ARWEAVE_WALLET_PATH` cannot be used in Vercel (see workaround below)

#### **Payment (MoonPay Commerce)**
```bash
NEXT_PUBLIC_MOONPAY_PUBLIC_KEY=<your_moonpay_public_key>
MOONPAY_SECRET_KEY=<your_moonpay_secret_key>
```

#### **API Integrations (RapidAPI)**
```bash
RAPIDAPI_KEY=<your_rapidapi_key>
```
⚠️ **Fallback:** If not set, mock data will be used (see `DISABLE_RAPIDAPI`)

### Optional Variables (Production Enhancements)

#### **Security**
```bash
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://www.your-custom-domain.com
```
Default: All origins allowed in development

#### **Error Monitoring (Sentry)**
```bash
NEXT_PUBLIC_SENTRY_DSN=<your_sentry_dsn>
SENTRY_AUTH_TOKEN=<your_sentry_auth_token>
```
Recommended for production error tracking

#### **Feature Flags**
```bash
DISABLE_RAPIDAPI=true
```
Set to `true` to use mock data instead of RapidAPI (useful if API key not available)

---

## 🚀 Deployment Steps

### Option A: Deploy via Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```
Follow prompts to authenticate

#### 3. Navigate to Frontend Directory
```bash
cd src/frontend
```

#### 4. Deploy to Production
```bash
vercel --prod
```

#### 5. Follow Interactive Prompts
```
? Set up and deploy "~/web3-deal-discovery-nft-coupons/src/frontend"? [Y/n] Y
? Which scope do you want to deploy to? <your-vercel-account>
? Link to existing project? [Y/n] n
? What's your project's name? dealcoupon
? In which directory is your code located? ./
? Want to modify these settings? [y/N] N
```

#### 6. Set Environment Variables
```bash
# After first deployment, set environment variables:
vercel env add NEXT_PUBLIC_SOLANA_NETWORK production
# Enter value: devnet

vercel env add NEXT_PUBLIC_SOLANA_RPC_ENDPOINT production
# Enter value: https://api.devnet.solana.com

# Repeat for all required variables...
```

Or use `.env.production` file:
```bash
vercel env pull .env.production
```

#### 7. Redeploy with Environment Variables
```bash
vercel --prod
```

---

### Option B: Deploy via Vercel Dashboard (Web UI)

#### 1. Create Vercel Account
- Visit: https://vercel.com/signup
- Sign up with GitHub (recommended) or email

#### 2. Import Git Repository
- Click **"Add New..."** → **"Project"**
- Select **"Import Git Repository"**
- Choose: `rz1989s/web3-deal-discovery-nft-coupons` (or your fork)
- Click **"Import"**

#### 3. Configure Project Settings

**Framework Preset:** Next.js (auto-detected ✅)

**Root Directory:** `src/frontend` ⚠️ **IMPORTANT**

**Build Command:**
```bash
npm run build
```

**Install Command:**
```bash
npm install
```

**Output Directory:** `.next` (default)

**Node.js Version:** 22.x (recommended)

#### 4. Add Environment Variables

Go to **"Environment Variables"** section, add each variable:

| Key | Value | Scope |
|-----|-------|-------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet` | Production |
| `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT` | `https://api.devnet.solana.com` | Production |
| `NEXT_PUBLIC_NFT_PROGRAM_ID` | `RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | `<your_supabase_url>` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<your_anon_key>` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `<your_service_role_key>` | Production (Secret) |
| `RAPIDAPI_KEY` | `<your_rapidapi_key>` | Production (Secret) |
| `NEXT_PUBLIC_MOONPAY_PUBLIC_KEY` | `<your_moonpay_public_key>` | Production |
| `MOONPAY_SECRET_KEY` | `<your_moonpay_secret_key>` | Production (Secret) |
| `ARWEAVE_GATEWAY` | `https://arweave.net` | Production |
| `NEXT_PUBLIC_ARWEAVE_GATEWAY` | `https://arweave.net` | Production |

⚠️ **Security:** Mark sensitive keys (service role, secrets) as **"Secret"** in Vercel

#### 5. Deploy
- Click **"Deploy"**
- Wait 2-5 minutes for build
- Deployment URL: `https://dealcoupon-xxx.vercel.app`

---

## ⚠️ Special Considerations

### 1. Arweave Wallet Configuration

**Problem:** Vercel serverless functions cannot read local files (`arweave-wallet.json`)

**Solutions:**

#### Option A: Store Wallet JSON as Environment Variable (Recommended)
```bash
# Read wallet file content
cat ../../arweave-wallet.json

# In Vercel dashboard, add new env var:
ARWEAVE_WALLET_JSON=<paste_entire_json_content_here>
```

Then update `lib/storage/arweave.ts`:
```typescript
// Before:
const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));

// After:
const wallet = process.env.ARWEAVE_WALLET_JSON
  ? JSON.parse(process.env.ARWEAVE_WALLET_JSON)
  : JSON.parse(fs.readFileSync(walletPath, 'utf-8')); // fallback for local dev
```

#### Option B: Use Supabase Fallback Only
Set environment variable:
```bash
DISABLE_ARWEAVE=true
```
All uploads will use Supabase Storage (already functional)

### 2. Database Configuration (Supabase)

**No changes needed** - Supabase is cloud-hosted and accessible from Vercel ✅

### 3. CORS Configuration

Update `ALLOWED_ORIGINS` after deployment:
```bash
ALLOWED_ORIGINS=https://dealcoupon-xxx.vercel.app,https://your-custom-domain.com
```

### 4. Custom Domain (Optional)

#### Add Custom Domain:
1. Vercel Dashboard → Project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter domain: `dealcoupon.rectorspace.com`
4. Follow DNS configuration instructions:
   - Add CNAME record: `dealcoupon.rectorspace.com` → `cname.vercel-dns.com`
5. Wait for DNS propagation (5-60 minutes)

---

## ✅ Post-Deployment Verification

### 1. Check Health Endpoint
```bash
curl https://your-deployment-url.vercel.app/api/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-20T...",
  "checks": {
    "database": "connected",
    "solana": "connected"
  }
}
```

### 2. Test Key Pages
- ✅ Homepage: `https://your-url.vercel.app/`
- ✅ Marketplace: `https://your-url.vercel.app/marketplace`
- ✅ Pitch Deck: `https://your-url.vercel.app/pitch-deck`
- ✅ Dashboard: `https://your-url.vercel.app/dashboard`

### 3. Test Wallet Connection
- Visit homepage
- Click **"Select Wallet"**
- Connect Phantom/Solflare
- Verify connection successful

### 4. Test Deal Browsing (Guest)
- Browse marketplace without login
- Verify deals load
- Check filters work

### 5. Test Deal Claiming (Requires Wallet)
- Connect wallet
- Claim a test deal
- Verify NFT minting transaction
- Check "My Coupons" page

### 6. Check Console Logs
- Open DevTools → Console
- Look for errors (there should be none)
- Expected logs:
  - `GET /.identity 404` (1-2 times - harmless wallet adapter detection)
  - `RapidAPI disabled...` (if DISABLE_RAPIDAPI=true)

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Fails - Module Not Found
**Cause:** Missing dependency or wrong Node.js version
**Solution:**
```bash
# Set Node.js version in Vercel:
# Dashboard → Settings → General → Node.js Version → 22.x
```

### Issue 2: Environment Variables Not Working
**Cause:** Variables not set in Vercel dashboard
**Solution:**
- Verify all variables added in **Project Settings → Environment Variables**
- Redeploy after adding variables

### Issue 3: Database Connection Fails
**Cause:** Supabase service role key incorrect
**Solution:**
- Check Supabase Dashboard → Settings → API
- Copy **service_role** key (not anon key)
- Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel

### Issue 4: Solana RPC Rate Limiting
**Cause:** Public RPC endpoint has low rate limits
**Solution:**
- Upgrade to Helius or QuickNode RPC (recommended for production)
- Update `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT` to paid RPC URL

### Issue 5: Arweave Uploads Fail
**Cause:** Wallet JSON not accessible in Vercel
**Solution:**
- Use Option A (environment variable) or Option B (disable Arweave) above

### Issue 6: 404 on API Routes
**Cause:** Root directory not set correctly
**Solution:**
- Vercel Settings → General → Root Directory → `src/frontend`
- Redeploy

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Auto-Enabled)
- Dashboard → Project → **"Analytics"**
- Real-time visitor tracking
- Page performance metrics

### Sentry Error Monitoring (Optional)
If `NEXT_PUBLIC_SENTRY_DSN` set:
- Visit: https://sentry.io/organizations/your-org/issues/
- Monitor errors in real-time
- Receive email alerts for crashes

### Vercel Logs
- Dashboard → Project → **"Deployments"** → Click deployment → **"Logs"**
- View build logs and runtime logs

---

## 🔄 CI/CD Setup (Bonus)

### Automatic Deployments from GitHub

1. **Connect GitHub Repository**
   - Vercel Dashboard → Project → Settings → Git
   - Connect to `rz1989s/web3-deal-discovery-nft-coupons`

2. **Configure Auto-Deploy Branches**
   - **Production Branch:** `main` → Auto-deploy to production
   - **Preview Branch:** `dev` → Auto-deploy to preview URL

3. **Every Git Push Triggers:**
   - ✅ Automatic build
   - ✅ Automatic deployment (if build passes)
   - ✅ Preview URL for PRs

---

## 📝 Final Checklist Before Going Live

- [ ] All environment variables set in Vercel
- [ ] Health check endpoint returns "healthy"
- [ ] Homepage loads without errors
- [ ] Wallet connection works (Phantom/Solflare)
- [ ] Marketplace deals display correctly
- [ ] Pitch deck page loads (`/pitch-deck`)
- [ ] Custom domain configured (if applicable)
- [ ] CORS origins updated for production domain
- [ ] Sentry error monitoring configured (optional)
- [ ] Analytics enabled and working
- [ ] Console logs checked (no critical errors)
- [ ] Test deal claiming flow end-to-end

---

## 🎯 Submission URLs for Hackathon

After successful deployment, use these URLs:

**Live Demo:** `https://your-deployment-url.vercel.app/`
**Pitch Deck:** `https://your-deployment-url.vercel.app/pitch-deck`
**GitHub Repo:** `https://github.com/rz1989s/web3-deal-discovery-nft-coupons`

---

## 🆘 Need Help?

**Vercel Documentation:** https://vercel.com/docs
**Next.js Deployment Guide:** https://nextjs.org/docs/deployment
**Vercel Support:** https://vercel.com/support

---

**Bismillah! May Allah make this deployment smooth and successful.** 🚀

**Last Updated:** October 2025
**Deployment Status:** Ready for Production ✅
