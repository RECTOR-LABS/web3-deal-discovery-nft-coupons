# Supabase JWT Custom Claims Verification

**Critical for RLS Policies:** Row-Level Security policies depend on `auth.jwt() ->> 'wallet_address'` claim.

**Status:** ⚠️ Requires verification before production deployment

---

## Why This Matters

Your RLS policies in `migrations/row-level-security-policies.sql` use:
```sql
auth.jwt() ->> 'wallet_address'
```

This extracts the user's wallet address from JWT claims to enforce multi-tenant isolation. **If this isn't configured, all RLS policies will fail.**

---

## Verification Steps

### Step 1: Check Current JWT Structure

Run this query in Supabase SQL Editor:

```sql
-- Check if wallet_address exists in current JWT
SELECT
  auth.uid() as user_id,
  auth.jwt() as full_jwt,
  auth.jwt() ->> 'wallet_address' as extracted_wallet_address;
```

**Expected Result:**
- `extracted_wallet_address` should show a Solana wallet address (e.g., `HAtD...Ube5`)
- If NULL, custom claims are not configured

---

### Step 2: Test RLS Policy (Safe Read Test)

```sql
-- This should return merchants matching YOUR wallet address
SELECT * FROM merchants
WHERE wallet_address = auth.jwt() ->> 'wallet_address';
```

**Expected Behavior:**
- Returns your merchant profile if you're a merchant
- Returns empty if you haven't registered as merchant
- **Fails with error** if JWT claims not configured

---

### Step 3: Configure Custom JWT Claims (If Needed)

**Option A: Using Supabase Auth Hooks (Recommended)**

1. Go to Supabase Dashboard → Authentication → Hooks
2. Create a new hook: **"Custom Access Token"**
3. Add this function:

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

interface JWTPayload {
  user_id: string
  // Add wallet_address to JWT claims
}

serve(async (req) => {
  try {
    const { user } = await req.json()

    // Extract wallet address from user metadata
    const wallet_address = user.user_metadata?.wallet_address || null

    return new Response(
      JSON.stringify({
        claims: {
          wallet_address: wallet_address
        }
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})
```

4. Deploy the hook
5. Test with a new login

**Option B: Set user_metadata on Registration**

When users connect their wallet, store wallet address in user metadata:

```typescript
// In your auth flow (after wallet connection)
const { data, error } = await supabase.auth.updateUser({
  data: {
    wallet_address: connectedWallet.publicKey.toString()
  }
})
```

Then configure JWT hook (Option A) to expose this metadata as claim.

**Option C: Database Trigger (Alternative)**

Create a trigger that updates `auth.users` metadata when wallet is connected:

```sql
-- Function to sync wallet address to user metadata
CREATE OR REPLACE FUNCTION sync_wallet_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Update auth.users with wallet address in raw_user_meta_data
  UPDATE auth.users
  SET raw_user_meta_data =
    jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{wallet_address}',
      to_jsonb(NEW.wallet_address)
    )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on users table
CREATE TRIGGER on_user_wallet_connected
  AFTER INSERT OR UPDATE OF wallet_address ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_wallet_to_auth();
```

---

### Step 4: Verify JWT After Configuration

After configuring custom claims, verify with:

```sql
-- Should now return your wallet address
SELECT auth.jwt() ->> 'wallet_address' as my_wallet;
```

**Test RLS Policies:**
```sql
-- Test merchant access (should work now)
INSERT INTO merchants (wallet_address, business_name, email)
VALUES (
  auth.jwt() ->> 'wallet_address',
  'Test Store',
  'test@example.com'
);

-- Verify you can read your own merchant
SELECT * FROM merchants;

-- Clean up test
DELETE FROM merchants WHERE business_name = 'Test Store';
```

---

## Production Checklist

Before deploying to production:

- [ ] JWT custom claims configured (Option A, B, or C)
- [ ] Test query: `SELECT auth.jwt() ->> 'wallet_address'` returns wallet address
- [ ] RLS policies tested with actual user account
- [ ] Merchant registration flow tested end-to-end
- [ ] Deal creation by merchant succeeds
- [ ] User can only see their own data (multi-tenant isolation works)
- [ ] Anonymous users can browse public deals (SELECT policies work)
- [ ] Document which configuration option you chose

---

## Troubleshooting

### Issue: `auth.jwt() ->> 'wallet_address'` returns NULL

**Cause:** Custom claims not configured or wallet address not in user metadata

**Fix:**
1. Check `auth.users.raw_user_meta_data` for wallet address:
   ```sql
   SELECT id, raw_user_meta_data FROM auth.users;
   ```
2. If missing, update user metadata (Option B above)
3. Configure JWT hook to expose as claim (Option A above)

### Issue: RLS policies block legitimate access

**Cause:** JWT claim doesn't match wallet address format or value

**Fix:**
1. Verify wallet address format in database matches JWT claim
2. Ensure consistent casing (some wallets use different cases)
3. Test with: `SELECT wallet_address FROM merchants WHERE wallet_address = auth.jwt() ->> 'wallet_address';`

### Issue: Anonymous users blocked from browsing

**Cause:** Missing `TO anon` in SELECT policies

**Fix:** Already included in policies - check if RLS is enabled on views:
```sql
-- Views need RLS too
ALTER TABLE merchants_with_location ENABLE ROW LEVEL SECURITY;
```

---

## Alternative: Disable RLS (NOT RECOMMENDED for Production)

**Only for development/testing:**

```sql
-- WARNING: This disables all security
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
-- ... repeat for all tables
```

**Never use this in production!**

---

## Documentation Links

- [Supabase JWT Structure](https://supabase.com/docs/guides/auth/auth-helpers/nextjs#understanding-the-jwt)
- [Custom JWT Claims](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks)

---

## Quick Verification Command

Run this single command to verify everything:

```sql
-- Comprehensive JWT verification
SELECT
  auth.uid() as user_id,
  auth.role() as user_role,
  auth.jwt() ->> 'wallet_address' as jwt_wallet_address,
  (SELECT wallet_address FROM users WHERE id = auth.uid()) as db_wallet_address,
  CASE
    WHEN auth.jwt() ->> 'wallet_address' IS NULL
    THEN '❌ JWT claim missing - configure custom claims'
    WHEN auth.jwt() ->> 'wallet_address' = (SELECT wallet_address FROM users WHERE id = auth.uid())
    THEN '✅ JWT claim matches database - RLS will work'
    ELSE '⚠️ JWT claim mismatch - verify configuration'
  END as status;
```

**Expected Output:**
```
user_id: <uuid>
user_role: authenticated
jwt_wallet_address: HAtD...Ube5
db_wallet_address: HAtD...Ube5
status: ✅ JWT claim matches database - RLS will work
```

---

**Last Updated:** 2025-10-20
**Author:** RECTOR
**Status:** Verification Required
