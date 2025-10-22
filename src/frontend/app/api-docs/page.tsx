'use client';

import { useEffect } from 'react';

export default function ApiDocsPage() {
  useEffect(() => {
    // Dynamically load Scalar API documentation library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f2eecb]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-black mb-4">
            DealCoupon API Documentation
          </h1>
          <p className="text-xl text-[#f2eecb]">
            Complete REST API reference for Web3 Deal Discovery & Loyalty Platform
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="/"
              className="px-6 py-3 bg-[#f2eecb] text-[#0d2a13] font-bold rounded-lg hover:bg-[#f2eecb]/90 transition-colors"
            >
              ← Back to Homepage
            </a>
            <a
              href="/openapi.yaml"
              download
              className="px-6 py-3 bg-[#00ff4d] text-[#0d2a13] font-bold rounded-lg hover:bg-[#00cc3d] transition-colors"
            >
              Download OpenAPI Spec
            </a>
            <a
              href="https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* API Reference using Scalar */}
      <div className="max-w-7xl mx-auto">
        <script
          id="api-reference"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              spec: {
                url: '/openapi.yaml',
              },
              theme: 'purple',
              layout: 'modern',
              showSidebar: true,
            }),
          }}
        />
      </div>

      {/* Integration Examples */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white border-2 border-monke-border rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-[#0d2a13] mb-6">
            Quick Start Integration
          </h2>

          <div className="space-y-8">
            {/* JavaScript Example */}
            <div>
              <h3 className="text-xl font-bold text-[#174622] mb-3">
                JavaScript / TypeScript
              </h3>
              <div className="bg-[#0d2a13] text-[#f2eecb] p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`// Fetch active resale listings
const response = await fetch('https://your-domain.com/api/resale/listings?category=Food&sort=price_asc');
const data = await response.json();

console.log(data.listings); // Array of resale listings`}</pre>
              </div>
            </div>

            {/* Python Example */}
            <div>
              <h3 className="text-xl font-bold text-[#174622] mb-3">Python</h3>
              <div className="bg-[#0d2a13] text-[#f2eecb] p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`import requests

# Get user loyalty tier
response = requests.get(
    'https://your-domain.com/api/user/tier',
    params={'wallet': 'YOUR_WALLET_ADDRESS'}
)
tier_info = response.json()
print(tier_info['tierInfo']['currentTier'])  # Bronze, Silver, Gold, or Diamond`}</pre>
              </div>
            </div>

            {/* cURL Example */}
            <div>
              <h3 className="text-xl font-bold text-[#174622] mb-3">cURL</h3>
              <div className="bg-[#0d2a13] text-[#f2eecb] p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`# List NFT coupon for resale
curl -X POST https://your-domain.com/api/resale/list \\
  -H "Content-Type: application/json" \\
  -d '{
    "nft_mint": "YOUR_NFT_MINT_ADDRESS",
    "seller_wallet": "YOUR_WALLET_ADDRESS",
    "price_sol": 0.5
  }'`}</pre>
              </div>
            </div>
          </div>

          {/* API Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f2eecb]/50 p-6 rounded-lg border-2 border-[#0d2a13]/10">
              <h4 className="font-bold text-[#0d2a13] mb-2">🔒 Secure</h4>
              <p className="text-[#174622]">
                Solana wallet signature authentication for protected endpoints
              </p>
            </div>
            <div className="bg-[#f2eecb]/50 p-6 rounded-lg border-2 border-[#0d2a13]/10">
              <h4 className="font-bold text-[#0d2a13] mb-2">⚡ Fast</h4>
              <p className="text-[#174622]">
                Rate limiting and caching for optimal performance
              </p>
            </div>
            <div className="bg-[#f2eecb]/50 p-6 rounded-lg border-2 border-[#0d2a13]/10">
              <h4 className="font-bold text-[#0d2a13] mb-2">📊 RESTful</h4>
              <p className="text-[#174622]">
                Standard HTTP methods with JSON request/response
              </p>
            </div>
            <div className="bg-[#f2eecb]/50 p-6 rounded-lg border-2 border-[#0d2a13]/10">
              <h4 className="font-bold text-[#0d2a13] mb-2">🔄 Real-time</h4>
              <p className="text-[#174622]">
                Live data from Solana blockchain and Supabase
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
