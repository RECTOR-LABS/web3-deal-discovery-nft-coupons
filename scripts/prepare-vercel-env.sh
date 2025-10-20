#!/bin/bash

# Prepare Environment Variables for Vercel Deployment
# Usage: ./scripts/prepare-vercel-env.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Vercel Environment Variables Preparation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env.local exists
if [ ! -f "src/frontend/.env.local" ]; then
  echo "❌ Error: .env.local not found in src/frontend/"
  echo "Please create .env.local first"
  exit 1
fi

echo "✅ Found .env.local"
echo ""

# Create output file
OUTPUT_FILE="vercel-env-variables.txt"
echo "Creating: $OUTPUT_FILE"
echo ""

# Write header
cat > "$OUTPUT_FILE" << 'EOF'
# Vercel Environment Variables
# Copy these values to Vercel Dashboard → Settings → Environment Variables
# Generated:
EOF

date >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Required variables
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
echo "REQUIRED VARIABLES (MUST SET)" >> "$OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

REQUIRED_VARS=(
  "NEXT_PUBLIC_SOLANA_NETWORK"
  "NEXT_PUBLIC_SOLANA_RPC_ENDPOINT"
  "NEXT_PUBLIC_NFT_PROGRAM_ID"
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "ARWEAVE_GATEWAY"
  "NEXT_PUBLIC_ARWEAVE_GATEWAY"
)

echo "📝 Required Variables:"
echo ""

for var in "${REQUIRED_VARS[@]}"; do
  value=$(grep "^${var}=" src/frontend/.env.local | cut -d '=' -f2- || echo "")
  if [ -n "$value" ]; then
    echo "  ✅ $var"
    echo "$var=$value" >> "$OUTPUT_FILE"
  else
    echo "  ⚠️  $var (NOT SET)"
    echo "# $var=<NOT_SET>" >> "$OUTPUT_FILE"
  fi
done

echo "" >> "$OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
echo "OPTIONAL VARIABLES (RECOMMENDED)" >> "$OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

OPTIONAL_VARS=(
  "RAPIDAPI_KEY"
  "NEXT_PUBLIC_MOONPAY_PUBLIC_KEY"
  "MOONPAY_SECRET_KEY"
  "NEXT_PUBLIC_PRIVY_APP_ID"
  "ALLOWED_ORIGINS"
  "NEXT_PUBLIC_SENTRY_DSN"
  "SENTRY_AUTH_TOKEN"
)

echo ""
echo "📝 Optional Variables:"
echo ""

for var in "${OPTIONAL_VARS[@]}"; do
  value=$(grep "^${var}=" src/frontend/.env.local | cut -d '=' -f2- || echo "")
  if [ -n "$value" ]; then
    echo "  ✅ $var"
    echo "$var=$value" >> "$OUTPUT_FILE"
  else
    echo "  ⚠️  $var (not set - using fallback)"
    echo "# $var=<NOT_SET>" >> "$OUTPUT_FILE"
  fi
done

echo "" >> "$OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
echo "FEATURE FLAGS (IF NEEDED)" >> "$OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "# Uncomment if needed:" >> "$OUTPUT_FILE"
echo "# DISABLE_RAPIDAPI=true" >> "$OUTPUT_FILE"
echo "# DISABLE_ARWEAVE=true" >> "$OUTPUT_FILE"

# Handle Arweave wallet
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  ARWEAVE WALLET SPECIAL HANDLING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Vercel cannot read local files. Choose ONE option:"
echo ""
echo "Option 1: Store wallet JSON as environment variable"
echo "  1. Copy entire arweave-wallet.json content"
echo "  2. In Vercel Dashboard, add:"
echo "     Key: ARWEAVE_WALLET_JSON"
echo "     Value: <paste_json_content>"
echo ""
echo "Option 2: Disable Arweave (use Supabase only)"
echo "  In Vercel Dashboard, add:"
echo "     Key: DISABLE_ARWEAVE"
echo "     Value: true"
echo ""

if [ -f "arweave-wallet.json" ]; then
  echo "" >> "$OUTPUT_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
  echo "ARWEAVE WALLET (OPTION 1)" >> "$OUTPUT_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "# To use Arweave in Vercel, add this variable:" >> "$OUTPUT_FILE"
  echo "# ARWEAVE_WALLET_JSON=" >> "$OUTPUT_FILE"
  cat arweave-wallet.json >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "# OR disable Arweave and use Supabase only:" >> "$OUTPUT_FILE"
  echo "# DISABLE_ARWEAVE=true" >> "$OUTPUT_FILE"

  echo "✅ Arweave wallet found and added to output file"
else
  echo "⚠️  arweave-wallet.json not found in root directory"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Environment variables saved to: $OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Review $OUTPUT_FILE"
echo "2. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "3. Select your project: dealcoupon"
echo "4. Go to: Settings → Environment Variables"
echo "5. Copy variables from $OUTPUT_FILE to Vercel Dashboard"
echo "6. Mark secrets as 'Secret' (service keys, API keys)"
echo "7. Deploy: vercel --prod"
echo ""
echo "🔒 SECURITY REMINDER:"
echo "   - DO NOT commit $OUTPUT_FILE to Git"
echo "   - Keep secrets secure"
echo "   - Use 'Secret' checkbox in Vercel for sensitive values"
echo ""
echo "Bismillah! 🚀"
