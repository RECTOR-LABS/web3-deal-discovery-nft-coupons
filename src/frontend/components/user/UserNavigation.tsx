'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Tag, ShoppingBag, User, TrendingUp } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';

const PrivyLoginButton = dynamic(
  async () => (await import('@/components/shared/PrivyLoginButton')).default,
  { ssr: false }
);

export default function UserNavigation() {
  const pathname = usePathname();
  const { authenticated } = usePrivy();

  // Guest-friendly links (no authentication required) - Groupon-like experience
  const guestLinks = [
    { href: '/marketplace', label: 'Browse Deals', icon: ShoppingBag },
  ];

  // Authenticated user links (full navigation)
  const authLinks = [
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/coupons', label: 'My Coupons', icon: Tag },
    { href: '/staking', label: 'Staking', icon: TrendingUp },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  // Show appropriate links based on authentication status
  const navLinks = authenticated ? authLinks : guestLinks;

  return (
    <nav className="bg-[#0d2a13] border-b border-[#174622]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/marketplace" className="flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-[#00ff4d]" />
            <span className="text-[#f2eecb] text-xl font-bold">
              DealCoupon
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
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

          {/* Sign In Button */}
          <div className="flex items-center" style={{ outline: 'none', border: 'none' }}>
            <PrivyLoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
