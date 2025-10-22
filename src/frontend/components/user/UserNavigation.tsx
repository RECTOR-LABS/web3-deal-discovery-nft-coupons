'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Tag, ShoppingBag, User, TrendingUp, LayoutDashboard, Repeat, BookOpen, Menu, X } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';

// Dynamic import to avoid SSR issues with wallet button
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function UserNavigation() {
  const pathname = usePathname();
  const { connected } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Guest-friendly links (no authentication required) - Groupon-like experience
  const guestLinks = [
    { href: '/marketplace', label: 'Browse Deals', icon: ShoppingBag },
    { href: '/marketplace/resale', label: 'Resale', icon: Repeat },
    { href: '/staking', label: 'Staking', icon: TrendingUp },
    { href: '/api-docs', label: 'API Docs', icon: BookOpen },
  ];

  // Authenticated user links (full navigation)
  const authLinks = [
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/marketplace/resale', label: 'Resale', icon: Repeat },
    { href: '/coupons', label: 'My Coupons', icon: Tag },
    { href: '/staking', label: 'Staking', icon: TrendingUp },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/api-docs', label: 'API Docs', icon: BookOpen },
  ];

  // Show appropriate links based on wallet connection status
  const navLinks = connected ? authLinks : guestLinks;

  return (
    <nav className="bg-[#0d2a13] border-b border-[#174622]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Links to Homepage */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer flex-shrink-0">
            <img src="/dealcoupon-logo.svg" alt="DealCoupon" className="w-8 h-8" />
            <span className="text-[#f2eecb] text-xl font-bold">
              DealCoupon
            </span>
          </Link>

          {/* Desktop Navigation Links - Compact */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${
                    isActive
                      ? 'bg-[#00ff4d] text-[#0d2a13] font-semibold'
                      : 'text-[#f2eecb] hover:bg-[#174622]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Wallet + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Connect Wallet Button */}
            <div className="wallet-adapter-button-container flex-shrink-0">
              <WalletMultiButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#f2eecb] hover:bg-[#174622] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#174622] py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#00ff4d] text-[#0d2a13] font-semibold'
                      : 'text-[#f2eecb] hover:bg-[#174622]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
