'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  BarChart3,
  Settings,
  Menu,
  X,
  QrCode,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Deal', href: '/dashboard/create', icon: PlusCircle },
  { name: 'My Deals', href: '/dashboard/deals', icon: Package },
  { name: 'Redeem Coupon', href: '/dashboard/redeem', icon: QrCode },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-monke-neon text-monke-primary rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen w-64 bg-monke-primary border-r-2 border-monke-accent shadow-xl
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b-2 border-monke-accent">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-monke-neon rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-monke-primary font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-monke-cream">DealCoupon</h1>
                <p className="text-xs text-monke-cream/70">Merchant Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Fix: Dashboard should only be active on exact match, others can have sub-paths
              const isActive = item.href === '/dashboard'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? 'bg-monke-neon text-monke-primary shadow-lg shadow-monke-neon/30'
                        : 'text-monke-cream/80 hover:bg-monke-accent hover:text-monke-cream'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-monke-accent">
            <div className="text-xs text-monke-cream/60 text-center">
              <p>⚡ Powered by Solana</p>
              <p className="mt-1">🐵 MonkeDAO Track</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
