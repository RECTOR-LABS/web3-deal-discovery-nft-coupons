import Link from 'next/link';
import { Github, Twitter, FileText, Shield, Scale, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0d2a13] text-[#f2eecb] border-t border-[#174622]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/dealcoupon-logo.svg" alt="DealCoupon" className="w-8 h-8" />
              <span className="text-xl font-bold">DealCoupon</span>
            </div>
            <p className="text-sm text-[#f2eecb]/70">
              Web3 deal discovery platform. &quot;Groupon meets DeFi&quot; - NFT coupons on Solana.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#f2eecb]/60">
              <span>Built for MonkeDAO 🐵</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[#00ff4d]">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="hover:text-[#00ff4d] transition-colors">
                  Browse Deals
                </Link>
              </li>
              <li>
                <Link href="/marketplace/resale" className="hover:text-[#00ff4d] transition-colors">
                  Resale Marketplace
                </Link>
              </li>
              <li>
                <Link href="/staking" className="hover:text-[#00ff4d] transition-colors">
                  Staking & Rewards
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#00ff4d] transition-colors">
                  Merchant Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[#00ff4d]">Developers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/api-docs" className="hover:text-[#00ff4d] transition-colors flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  API Documentation
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00ff4d] transition-colors flex items-center gap-1"
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/openapi.yaml"
                  download
                  className="hover:text-[#00ff4d] transition-colors"
                >
                  OpenAPI Spec
                </a>
              </li>
              <li>
                <Link href="/pitch-deck" className="hover:text-[#00ff4d] transition-colors">
                  Pitch Deck
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-semibold mb-4 text-[#00ff4d]">Legal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-[#00ff4d] transition-colors flex items-center gap-1"
                >
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/tos"
                  className="hover:text-[#00ff4d] transition-colors flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00ff4d] transition-colors flex items-center gap-1"
                >
                  <Scale className="w-4 h-4" />
                  MIT License
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/RZ1989sol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00ff4d] transition-colors flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-[#174622] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[#f2eecb]/60">
            © {currentYear} DealCoupon. Built with ❤️ for the Solana ecosystem. MIT License.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00ff4d] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/RZ1989sol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00ff4d] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://earn.superteam.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-[#00ff4d] transition-colors"
            >
              Superteam Earn
            </a>
          </div>
        </div>

        {/* Islamic Expression */}
        <div className="mt-4 text-center text-xs text-[#f2eecb]/50">
          Bismillah! Alhamdulillah! Tawfeeq min Allah. 🤲
        </div>
      </div>
    </footer>
  );
}
