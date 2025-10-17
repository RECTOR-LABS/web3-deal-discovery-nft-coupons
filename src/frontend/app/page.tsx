'use client';

import { WalletButton } from '@/components/shared/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <main className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            DealCoupon
          </h1>
          <p className="text-xl text-monke-accent">
            Web3 Deal Discovery & Loyalty Platform
          </p>
          <p className="text-sm text-foreground/70">
            Powered by Solana • MonkeDAO Track
          </p>
        </div>

        <div className="p-8 border-2 border-monke-border rounded-lg bg-white/50 backdrop-blur">
          <div className="space-y-6">
            <div className="flex justify-center">
              <WalletButton />
            </div>

            {connected && publicKey ? (
              <div className="space-y-4 text-left">
                <div className="p-4 bg-monke-neon/10 border border-monke-neon rounded-lg">
                  <p className="text-sm font-medium text-monke-primary mb-2">
                    ✅ Wallet Connected
                  </p>
                  <p className="text-xs font-mono text-foreground/70 break-all">
                    {publicKey.toBase58()}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-monke-cream border border-monke-border rounded-lg">
                    <p className="text-2xl font-bold text-monke-primary">0</p>
                    <p className="text-xs text-foreground/70">Coupons Owned</p>
                  </div>
                  <div className="p-4 bg-monke-cream border border-monke-border rounded-lg">
                    <p className="text-2xl font-bold text-monke-primary">0</p>
                    <p className="text-xs text-foreground/70">Deals Created</p>
                  </div>
                  <div className="p-4 bg-monke-cream border border-monke-border rounded-lg">
                    <p className="text-2xl font-bold text-monke-primary">0</p>
                    <p className="text-xs text-foreground/70">Redemptions</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm text-foreground/70">
                  Connect your wallet to get started
                </p>
                <p className="text-xs text-foreground/50">
                  Supports: Phantom • Solflare • Backpack
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-foreground/50">
          <p>Smart Contract Deployed: <span className="font-mono">REC6Vw...1P1b1</span></p>
          <p className="mt-1">Network: Devnet</p>
        </div>
      </main>
    </div>
  );
}
