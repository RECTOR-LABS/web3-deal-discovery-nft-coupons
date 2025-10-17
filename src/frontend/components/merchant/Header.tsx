'use client';

import { WalletButton } from '@/components/shared/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-white border-b-2 border-monke-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Business Info */}
        <div className="flex items-center space-x-3">
          {merchant ? (
            <>
              {merchant.logo_url ? (
                <img
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  className="w-10 h-10 rounded-lg object-cover border-2 border-monke-border"
                />
              ) : (
                <div className="w-10 h-10 bg-monke-cream border-2 border-monke-border rounded-lg flex items-center justify-center">
                  <Store size={20} className="text-monke-primary" />
                </div>
              )}
              <div>
                <h2 className="text-sm font-bold text-monke-primary">
                  {merchant.business_name}
                </h2>
                <p className="text-xs text-foreground/60">Merchant Account</p>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              {loading ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="w-10 h-10 bg-monke-cream rounded-lg" />
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-monke-cream rounded" />
                    <div className="w-16 h-2 bg-monke-cream rounded" />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-foreground/60">
                  Please complete registration
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-4">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
