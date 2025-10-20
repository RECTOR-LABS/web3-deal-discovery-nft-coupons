# Quick Deployment Checklist

**Target:** Vercel Production
**Time:** ~15 minutes

---

## Step 1: Prepare Environment Variables

Copy these from your local `.env.local`:

### ✅ Required (MUST SET)
```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_NFT_PROGRAM_ID=RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7

NEXT_PUBLIC_SUPABASE_URL=https://mdxrtyqsusczmmpgspgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy_from_local_env>
SUPABASE_SERVICE_ROLE_KEY=<copy_from_local_env>

ARWEAVE_GATEWAY=https://arweave.net
NEXT_PUBLIC_ARWEAVE_GATEWAY=https://arweave.net
```

### ⚠️ Optional (Recommended)
```bash
RAPIDAPI_KEY=<copy_from_local_env>
NEXT_PUBLIC_MOONPAY_PUBLIC_KEY=<copy_from_local_env>
MOONPAY_SECRET_KEY=<copy_from_local_env>
```

### 🔧 Feature Flags (If Needed)
```bash
DISABLE_RAPIDAPI=true  # Use mock data if no RapidAPI key
DISABLE_ARWEAVE=true   # Use Supabase only for uploads
```

---

## Step 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Login
vercel login

# Navigate to frontend
cd src/frontend

# Deploy to production
vercel --prod

# Follow prompts:
# - Project name: dealcoupon
# - Root directory: ./
# - Settings: default (press Enter)
```

---

## Step 3: Add Environment Variables in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project: **dealcoupon**
3. Click: **Settings** → **Environment Variables**
4. Add each variable from Step 1:
   - Key: `NEXT_PUBLIC_SOLANA_NETWORK`
   - Value: `devnet`
   - Environment: **Production**
   - Click **Save**
5. Repeat for all required variables

---

## Step 4: Redeploy with Environment Variables

```bash
# In src/frontend directory
vercel --prod
```

Wait 2-5 minutes for deployment to complete.

---

## Step 5: Verify Deployment

### 5.1 Check Health Endpoint
```bash
curl https://your-deployment-url.vercel.app/api/health
```
**Expected:** `{"status":"healthy"}`

### 5.2 Visit Key Pages
- ✅ Homepage: `/`
- ✅ Marketplace: `/marketplace`
- ✅ Pitch Deck: `/pitch-deck`

### 5.3 Test Wallet Connection
- Click "Select Wallet"
- Connect Phantom
- Should connect successfully

---

## 🎯 Submission URLs

After deployment:
- **Live Demo:** `https://dealcoupon-xxx.vercel.app/`
- **Pitch Deck:** `https://dealcoupon-xxx.vercel.app/pitch-deck`
- **GitHub:** `https://github.com/rz1989s/web3-deal-discovery-nft-coupons`

---

## ⚠️ Special Note: Arweave Wallet

**Problem:** `arweave-wallet.json` file not accessible in Vercel

**Quick Fix:**
```bash
# Option 1: Add wallet as environment variable
cat ../../arweave-wallet.json
# Copy output, then in Vercel Dashboard:
# Add env var: ARWEAVE_WALLET_JSON = <paste_json_here>

# Option 2: Use Supabase only (simpler)
# Add env var: DISABLE_ARWEAVE = true
```

---

## 🐛 Common Issues

**Build fails?**
- Check Node.js version: Settings → General → Node.js Version → **22.x**

**Database errors?**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not anon key)

**Wallet connection fails?**
- Check console for CORS errors
- Add production URL to `ALLOWED_ORIGINS`

---

## ✅ Done!

**Deployment Status:** 🟢 Live
**Next Step:** Submit to MonkeDAO Hackathon

**Bismillah!** 🚀
