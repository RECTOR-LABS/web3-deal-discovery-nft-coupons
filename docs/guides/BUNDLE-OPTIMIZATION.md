# Bundle Size Optimization Guide

**Date:** 2025-10-20
**Current Build Size:** 189 MB
**Target:** < 100 MB (47% reduction)

---

## Current Analysis

```bash
# Run bundle analyzer
npm run build:analyze

# Check current size
du -sh .next
# Output: 189M
```

**Main Bloat Sources:**
1. Solana Web3.js (~2.5 MB) - Required for blockchain interaction
2. Wallet Adapters (~1.8 MB) - Multiple wallet support
3. React Leaflet + Leaflet (~800 KB) - Maps functionality
4. Framer Motion (~600 KB) - Animations
5. Recharts (~500 KB) - Analytics charts

---

## Optimization Strategies

### 1. Dynamic Imports for Wallet Adapters

**Current (Static):**
```typescript
// components/shared/WalletProvider.tsx
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
```

**Optimized (Dynamic):**
```typescript
// components/shared/WalletProvider.tsx
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const wallets = useMemo(() => [], []);

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAdapters, setWalletAdapters] = useState([]);

  useEffect(() => {
    // Dynamically import only when needed
    import('@solana/wallet-adapter-wallets').then((mod) => {
      setWalletAdapters([
        new mod.PhantomWalletAdapter(),
        new mod.SolflareWalletAdapter(),
      ]);
    });
  }, []);

  return (
    <WalletProvider wallets={walletAdapters} autoConnect={false}>
      {children}
    </WalletProvider>
  );
}
```

**Savings:** ~1.5 MB (loaded on-demand)

---

### 2. Code Split Heavy Components

**Maps (React Leaflet):**
```typescript
// app/(user)/marketplace/page.tsx
import dynamic from 'next/dynamic';

// Lazy load map component
const DealMap = dynamic(() => import('@/components/user/DealMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg">Loading map...</div>,
});

export default function MarketplacePage() {
  return (
    <div>
      {/* Other content loads immediately */}
      <DealList deals={deals} />

      {/* Map loads only when scrolled into view */}
      <DealMap deals={deals} />
    </div>
  );
}
```

**Savings:** ~800 KB (loaded on scroll)

---

### 3. Remove Unused Dependencies

**Audit Current Dependencies:**
```bash
npx depcheck
```

**Potentially Removable:**
- `@heliofi/checkout-react` - If not using MoonPay widget
- `pino-pretty` - Dev-only, should be in devDependencies
- Unused wallet adapters (keep only Phantom + Solflare)

---

### 4. Tree Shaking Optimization

**next.config.ts:**
```typescript
const nextConfig: NextConfig = {
  // Existing config...

  // Enable modern module output
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    '@solana/wallet-adapter-wallets': {
      transform: '@solana/wallet-adapter-wallets/lib/{{member}}',
    },
  },

  // Optimize packages
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
  ],
};
```

---

### 5. Image Optimization

**Use Next.js Image Component:**
```typescript
// Before
<img src="/deals/burger.jpg" alt="Burger Deal" />

// After (optimized)
import Image from 'next/image';

<Image
  src="/deals/burger.jpg"
  alt="Burger Deal"
  width={400}
  height={300}
  quality={75}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

**Savings:** ~30% reduction in image size

---

### 6. Limit Chart.js Bundle

**Before:**
```typescript
import { Line, Bar, Pie } from 'recharts';
```

**After (tree-shaken):**
```typescript
// Only import what you need
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
```

---

## Implementation Plan

### Week 1: Quick Wins (30% reduction)

1. **Day 1:** Move `pino-pretty` to devDependencies
   ```bash
   npm uninstall pino-pretty
   npm install --save-dev pino-pretty
   ```

2. **Day 2:** Dynamic import wallet adapters
   ```bash
   # Test wallet connection still works
   npm run dev
   ```

3. **Day 3:** Code split maps component
   ```bash
   # Verify maps load correctly
   ```

### Week 2: Deep Optimization (additional 17%)

4. **Day 4-5:** Audit and remove unused dependencies
   ```bash
   npx depcheck
   npm uninstall <unused-packages>
   ```

5. **Day 6-7:** Configure modularized imports
   ```bash
   # Update next.config.ts
   npm run build
   npm run build:analyze
   ```

---

## Measurement & Validation

**Before Each Change:**
```bash
npm run build
du -sh .next > before.txt
```

**After Each Change:**
```bash
npm run build
du -sh .next > after.txt
diff before.txt after.txt
```

**Track Progress:**
```markdown
| Optimization | Before | After | Savings |
|--------------|--------|-------|---------|
| Baseline     | 189 MB | -     | -       |
| pino-pretty  | 189 MB | 187 MB| 2 MB    |
| Wallet dynamic| 187 MB | 180 MB| 7 MB    |
| Map lazy load| 180 MB | 175 MB| 5 MB    |
| Unused deps  | 175 MB | 165 MB| 10 MB   |
| Tree shaking | 165 MB | 150 MB| 15 MB   |
| **Total**    | 189 MB | 150 MB| **39 MB**|
```

---

## Production Verification

After optimizations:

1. **Test All Features:**
   - Wallet connection (Phantom, Solflare)
   - Map loading
   - Charts rendering
   - Image loading

2. **Performance Metrics:**
   ```bash
   # Lighthouse audit
   npm run build
   npm start
   # Open Chrome DevTools → Lighthouse → Run audit
   ```

3. **Bundle Analysis:**
   ```bash
   npm run build:analyze
   # Review webpack bundle analyzer
   ```

**Target Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 300ms

---

## Continuous Monitoring

**Add to CI/CD:**
```yaml
# .github/workflows/ci-cd.yml
- name: Check bundle size
  run: |
    npm run build
    SIZE=$(du -sh .next | awk '{print $1}')
    echo "Bundle size: $SIZE"
    # Fail if > 100MB
    if [ "${SIZE%M}" -gt 100 ]; then
      echo "Bundle size exceeds 100MB!"
      exit 1
    fi
```

---

## References

- Next.js Bundle Analyzer: https://www.npmjs.com/package/@next/bundle-analyzer
- Dynamic Imports: https://nextjs.org/docs/advanced-features/dynamic-import
- Tree Shaking: https://webpack.js.org/guides/tree-shaking/
- Image Optimization: https://nextjs.org/docs/basic-features/image-optimization

---

**Estimated Total Savings:** 39 MB (21% reduction)
**Timeline:** 2 weeks
**Risk:** Low (all changes are backwards compatible)
