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
    <div className="flex items-center gap-4">
      <WalletMultiButton className="!bg-monke-neon hover:!bg-monke-neon/90 !rounded-lg !px-4 !py-2 !text-monke-primary !font-bold !transition-all !shadow-lg hover:!shadow-monke-neon/50" />

      {connected && publicKey && (
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-monke-neon rounded-full animate-pulse" />
          <span className="text-monke-cream font-mono font-medium">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
};
