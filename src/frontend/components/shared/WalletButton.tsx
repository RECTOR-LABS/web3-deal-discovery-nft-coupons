'use client';

import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

/**
 * Wallet connection button component
 * Uses Solana Wallet Adapter's built-in multi-button for wallet selection
 * Supports: Phantom, Solflare, Backpack wallets
 */
export const WalletButton: FC = () => {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering wallet button after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-10 w-32 bg-monke-neon/20 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <WalletMultiButton className="!bg-monke-accent hover:!bg-monke-neon !rounded-lg !px-6 !py-3 !text-monke-cream !font-bold !transition-all !shadow-lg hover:!shadow-xl hover:!text-monke-primary" />
    </div>
  );
};
