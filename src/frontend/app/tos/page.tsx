import Link from 'next/link';
import { FileText, Home } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#f2eecb]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-[#00ff4d]" />
            <h1 className="text-5xl font-black">Terms of Service</h1>
          </div>
          <p className="text-xl text-[#f2eecb]">
            Legal agreement governing your use of DealCoupon
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
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using DealCoupon (&quot;the Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Platform. These Terms apply to all users, including merchants, customers, and visitors.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">2. Definitions</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>NFT Coupon:</strong> Non-fungible token representing a promotional deal on the Solana blockchain</li>
              <li><strong>Merchant:</strong> Business or individual creating and distributing NFT coupons</li>
              <li><strong>User:</strong> Individual browsing, claiming, or redeeming NFT coupons</li>
              <li><strong>Resale Marketplace:</strong> Secondary market for trading NFT coupons between users</li>
              <li><strong>Staking:</strong> Locking SOL tokens to earn rewards and cashback</li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">3. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old to use DealCoupon. By using the Platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
            </p>
          </section>

          {/* Account Responsibilities */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">4. Wallet and Account Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are solely responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Maintaining the security of your Solana wallet and private keys</li>
              <li>All transactions made from your wallet address</li>
              <li>Ensuring the accuracy of information you provide (merchant profiles, reviews, etc.)</li>
              <li>Compliance with applicable laws in your jurisdiction</li>
              <li>Paying any applicable gas fees for blockchain transactions</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Important:</strong> DealCoupon does not have access to your private keys and cannot recover lost wallets or reverse transactions.
            </p>
          </section>

          {/* Platform Services */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">5. Platform Services</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">5.1 For Users</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Browse and claim NFT coupons from merchants</li>
                  <li>Redeem coupons at participating merchant locations</li>
                  <li>Trade coupons on the resale marketplace (subject to 2.5% platform fee)</li>
                  <li>Stake SOL for rewards and tier-based cashback</li>
                  <li>Earn loyalty badges and access exclusive deals</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">5.2 For Merchants</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create and mint NFT coupons on Solana</li>
                  <li>Manage deal inventory and expiration dates</li>
                  <li>Verify and redeem coupons via QR code scanning</li>
                  <li>Access analytics and customer insights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Fees and Payments */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">6. Fees and Payments</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Platform Fee:</strong> 2.5% fee on all resale marketplace transactions (deducted from seller proceeds)</li>
              <li><strong>Gas Fees:</strong> Users pay Solana network fees for blockchain transactions (minting, transfers, redemptions)</li>
              <li><strong>Staking:</strong> No fee for staking or unstaking SOL</li>
              <li><strong>Merchant Fees:</strong> Currently free for merchants to create deals (subject to change with notice)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              All fees are non-refundable. DealCoupon reserves the right to modify fees with 30 days&apos; notice.
            </p>
          </section>

          {/* NFT Ownership */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">7. NFT Coupon Ownership and Usage</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you claim or purchase an NFT coupon:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You own the NFT and can transfer or resell it (subject to platform terms)</li>
              <li>The NFT grants you the right to redeem the associated discount offer</li>
              <li>Redemption burns (destroys) the NFT permanently</li>
              <li>Expired or redeemed NFTs have no value</li>
              <li>Merchants reserve the right to honor or refuse redemption in their sole discretion</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">8. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use the Platform for illegal activities or to defraud merchants or users</li>
              <li>Create fake accounts, reviews, or ratings</li>
              <li>Manipulate or exploit platform features (e.g., staking rewards, referrals)</li>
              <li>Attempt to reverse engineer, hack, or disrupt the Platform</li>
              <li>Violate intellectual property rights of DealCoupon or third parties</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Scrape or harvest user data without permission</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              DealCoupon and its original content, features, and functionality are owned by RECTOR-LABS and licensed under the MIT License. User-generated content (merchant profiles, deal images, reviews) remains the property of the respective creators, but by uploading, you grant DealCoupon a non-exclusive, worldwide license to use, display, and distribute this content on the Platform.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">10. Disclaimers and Limitations</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">10.1 &quot;As-Is&quot; Service</h3>
                <p>
                  DealCoupon is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, express or implied. We do not guarantee uninterrupted, error-free, or secure operation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">10.2 Merchant Responsibility</h3>
                <p>
                  DealCoupon is a platform connecting merchants and users. We are not responsible for merchant product quality, fulfillment, or customer service. Disputes should be resolved directly with merchants.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">10.3 Blockchain Risks</h3>
                <p>
                  You acknowledge the risks of blockchain technology, including irreversible transactions, smart contract bugs, network congestion, and wallet loss.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#174622] mb-2">10.4 No Investment Advice</h3>
                <p>
                  DealCoupon does not provide financial or investment advice. Staking, NFT trading, and cryptocurrency activities carry risk.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, DealCoupon and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption, arising from your use of the Platform, even if advised of the possibility of such damages. Our total liability shall not exceed $100 USD.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">12. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless DealCoupon, its affiliates, and their respective officers, directors, and employees from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Platform, violation of these Terms, or infringement of third-party rights.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">13. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your access to the Platform at any time, with or without cause or notice, for violations of these Terms or other conduct we deem harmful. You may stop using the Platform at any time. Termination does not affect NFT ownership on the blockchain.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">14. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed">
              Any disputes arising from these Terms or your use of DealCoupon shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to a jury trial and class action lawsuits.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">15. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law principles.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">16. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of the Platform after changes constitutes acceptance of the new Terms. Material changes will be communicated via email or platform notification.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-3xl font-bold text-[#0d2a13] mb-4">17. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions or concerns about these Terms of Service, please contact us:
            </p>
            <ul className="space-y-2 text-gray-700 mt-4">
              <li><strong>Telegram:</strong> <a href="https://t.me/RZ1989sol" target="_blank" rel="noopener noreferrer" className="text-[#00ff4d] hover:underline">@RZ1989sol</a></li>
              <li><strong>GitHub:</strong> <a href="https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/issues" target="_blank" rel="noopener noreferrer" className="text-[#00ff4d] hover:underline">Open an Issue</a></li>
            </ul>
          </section>

          {/* Acknowledgment */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 italic">
              By using DealCoupon, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/privacy-policy"
            className="px-6 py-3 bg-[#0d2a13] text-[#f2eecb] font-semibold rounded-lg hover:bg-[#174622] transition-colors"
          >
            View Privacy Policy
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
