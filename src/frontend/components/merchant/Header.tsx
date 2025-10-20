'use client';

import { WalletButton } from '@/components/shared/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Store, AlertCircle, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface MerchantProfile {
  business_name: string;
  wallet_address: string;
  logo_url?: string;
}

export function Header() {
  const { publicKey } = useWallet();
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchantProfile = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/merchant/profile?wallet=${publicKey.toBase58()}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.merchant) {
            setMerchant(data.merchant);
          }
        }
      } catch (error) {
        console.error('Error fetching merchant profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantProfile();
  }, [publicKey]);

  return (
    <header className="sticky top-0 z-30 bg-monke-primary border-b-2 border-monke-accent shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Business Info */}
        <div className="flex items-center space-x-3">
          {merchant ? (
            <>
              {merchant.logo_url ? (
                <img
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  className="w-10 h-10 rounded-lg object-cover border-2 border-monke-neon"
                />
              ) : (
                <div className="w-10 h-10 bg-monke-neon border-2 border-monke-neon rounded-lg flex items-center justify-center">
                  <Store size={20} className="text-monke-primary" />
                </div>
              )}
              <div>
                <h2 className="text-sm font-bold text-monke-cream">
                  {merchant.business_name}
                </h2>
                <p className="text-xs text-monke-cream/70">Merchant Account</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="w-10 h-10 bg-monke-accent rounded-lg" />
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-monke-accent rounded" />
                    <div className="w-16 h-2 bg-monke-accent rounded" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-monke-accent/30 px-4 py-2 rounded-lg border border-monke-neon/30">
                    <AlertCircle className="w-4 h-4 text-monke-neon" />
                    <span className="text-sm text-monke-cream font-semibold">
                      Merchant Registration Required
                    </span>
                  </div>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 bg-monke-neon hover:bg-monke-neon/90 text-monke-primary px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <span className="text-sm">Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation & Wallet */}
        <div className="flex items-center space-x-3">
          {/* Quick Navigation Links */}
          <Link
            href="/"
            className="flex items-center gap-2 text-monke-cream/80 hover:text-monke-neon transition-colors px-3 py-2 rounded-lg hover:bg-monke-accent/20 cursor-pointer"
            title="Back to Homepage"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium hidden md:inline">Home</span>
          </Link>
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-monke-cream/80 hover:text-monke-neon transition-colors px-3 py-2 rounded-lg hover:bg-monke-accent/20 cursor-pointer"
            title="View Marketplace"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium hidden md:inline">Marketplace</span>
          </Link>

          {/* Wallet Connection */}
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
