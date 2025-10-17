'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

/**
 * Wallet connection button component
 * Uses Solana Wallet Adapter's built-in multi-button for wallet selection
 * Supports: Phantom, Solflare, Backpack wallets
 */
export const WalletButton: FC = () => {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton className="!bg-monke-primary hover:!bg-monke-accent !rounded-lg !px-4 !py-2 !text-monke-cream !font-medium !transition-colors" />

      {connected && publicKey && (
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-monke-neon rounded-full animate-pulse" />
          <span className="text-monke-primary font-mono">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
};
