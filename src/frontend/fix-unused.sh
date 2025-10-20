#!/bin/bash

# analytics - remove TrendingUp, LineChart, Line
sed -i '' 's/, TrendingUp, Eye/, Eye/' app/(merchant)/dashboard/analytics/page.tsx
sed -i '' 's/, LineChart, Line//' app/(merchant)/dashboard/analytics/page.tsx

# create - remove connected
sed -i '' 's/const { publicKey, connected } = useWallet();/const { publicKey } = useWallet();/' app/(merchant)/dashboard/create/page.tsx

# deals - remove Calendar, Percent
sed -i '' 's/, Calendar, Percent//' app/(merchant)/dashboard/deals/page.tsx
# deals - replace merchantId with _merchantId
sed -i '' 's/\[merchantId, setMerchantId\]/[_merchantId, setMerchantId]/' app/(merchant)/dashboard/deals/page.tsx

# test-db - replace tables with _tables
sed -i '' 's/data: tables,/data: _tables,/' app/api/test-db/route.ts

# mint - replace data with _data
sed -i '' 's/{ data, error/{ data: _data, error/' lib/solana/mint.ts

# upload - replace data with _data
sed -i '' 's/{ data, error/{ data: _data, error/' lib/storage/upload.ts

# middleware - replace request with _request
sed -i '' 's/(request: NextRequest)/()/g' middleware.ts

echo "Done fixing unused variables"
