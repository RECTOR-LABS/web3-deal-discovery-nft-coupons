import Link from 'next/link';
import { Shield, Home } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f2eecb]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-[#00ff4d]" />
            <h1 className="text-5xl font-black">Privacy Policy</h1>
          </div>
          <p className="text-xl text-[#f2eecb]">
            How we collect, use, and protect your information
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#f2eecb] text-[#0d2a13] font-bold rounded-lg hover:bg-[#f2eecb]/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Homepage
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-8">
          {/* Last Updated */}
          <div className="text-sm text-gray-600">
            <strong>Last Updated:</strong> October 22, 2025
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to DealCoupon (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Web3 deal discovery and NFT loyalty platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">2.1 Blockchain Data</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Solana wallet addresses (public keys)</li>
                  <li>Transaction signatures and on-chain activity</li>
                  <li>NFT ownership and transfer history</li>
                  <li>Staking positions and reward claims</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">2.2 User-Provided Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Merchant business profiles (name, location, contact information)</li>
                  <li>Deal metadata (titles, descriptions, images)</li>
                  <li>Reviews and ratings</li>
                  <li>Referral information</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">2.3 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Browser type and version</li>
                  <li>IP address and general location data</li>
                  <li>Pages visited and time spent on platform</li>
                  <li>Error logs and performance metrics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide and maintain our platform services</li>
              <li>Process NFT coupon redemptions and transfers</li>
              <li>Calculate and distribute staking rewards and cashback</li>
              <li>Enable marketplace features (browse, claim, resale)</li>
              <li>Communicate platform updates and deal notifications</li>
              <li>Improve user experience and platform performance</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your data in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Public Blockchain:</strong> Wallet addresses and transaction data are publicly visible on Solana</li>
              <li><strong>Service Providers:</strong> Third-party services (Supabase, Vercel, Sentry) process data on our behalf</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Row-level security policies on database tables</li>
              <li>Rate limiting and CORS protection</li>
              <li>Regular security audits and monitoring (Sentry)</li>
              <li>Secure storage of images on Arweave and Supabase</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">6. Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Correction:</strong> Update inaccurate information</li>
              <li><strong>Deletion:</strong> Request removal of your data (subject to blockchain immutability)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at{' '}
              <a href="https://t.me/RZ1989sol" target="_blank" rel="noopener noreferrer" className="text-[#00ff4d] hover:underline">
                @RZ1989sol on Telegram
              </a>.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Vercel Analytics and Speed Insights for performance monitoring</li>
              <li><strong>Wallet Adapter:</strong> Local storage for wallet connection preferences</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform integrates with the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Solana Blockchain:</strong> Decentralized transaction processing</li>
              <li><strong>Supabase:</strong> Database and authentication</li>
              <li><strong>Arweave:</strong> Permanent NFT metadata storage</li>
              <li><strong>Vercel:</strong> Hosting and analytics</li>
              <li><strong>Sentry:</strong> Error monitoring</li>
              <li><strong>RapidAPI:</strong> External deal aggregation</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Each service has its own privacy policy governing data handling.
            </p>
          </section>

          {/* Children&apos;s Privacy */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a minor, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of the platform after changes constitutes acceptance of the new policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul className="space-y-2 text-gray-700 mt-4">
              <li><strong>Telegram:</strong> <a href="https://t.me/RZ1989sol" target="_blank" rel="noopener noreferrer" className="text-[#00ff4d] hover:underline">@RZ1989sol</a></li>
              <li><strong>GitHub:</strong> <a href="https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/issues" target="_blank" rel="noopener noreferrer" className="text-[#00ff4d] hover:underline">Open an Issue</a></li>
            </ul>
          </section>

          {/* Acknowledgment */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 italic">
              By using DealCoupon, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
            </p>
          </section>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/tos"
            className="px-6 py-3 bg-[#0d2a13] text-[#f2eecb] font-semibold rounded-lg hover:bg-[#174622] transition-colors"
          >
            View Terms of Service
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white border-2 border-[#0d2a13] text-[#0d2a13] font-semibold rounded-lg hover:bg-[#f2eecb] transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
