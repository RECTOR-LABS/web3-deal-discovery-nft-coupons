'use client';

import Link from 'next/link';
import { WalletButton } from '@/components/shared/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background via-background to-monke-primary/5">
      <main className="max-w-4xl w-full space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-6 py-4 md:py-8">
          {/* MonkeDAO Logo */}
          <div className="flex justify-center">
            <img
              src="/monkedao-logo.svg"
              alt="MonkeDAO"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>

          {/* Main Title with Gradient */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-monke-cream via-white to-monke-neon bg-clip-text text-transparent drop-shadow-lg">
                DealCoupon
              </span>
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-monke-neon to-transparent rounded-full shadow-lg shadow-monke-neon/50" />
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-semibold text-monke-cream drop-shadow-md">
            Web3 Deal Discovery & Loyalty Platform
          </p>

          {/* Badges */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-monke-neon/30 border-2 border-monke-neon rounded-full shadow-lg shadow-monke-neon/20">
              <span className="text-sm font-bold text-white">⚡ Powered by Solana</span>
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-monke-cream/20 border-2 border-monke-cream rounded-full shadow-lg">
              <span className="text-sm font-bold text-monke-cream">🐵 MonkeDAO Track</span>
            </span>
          </div>
        </div>

        <div className="p-8 md:p-10 border border-foreground/10 rounded-2xl bg-background/50 backdrop-blur-sm shadow-lg">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <WalletButton />
              </div>
            </div>

            {connected && publicKey ? (
              <div className="space-y-4 text-left">
                <div className="p-4 bg-monke-cream border-2 border-monke-border rounded-lg shadow-lg">
                  <p className="text-sm font-bold text-monke-primary mb-2">
                    ✅ Wallet Connected
                  </p>
                  <p className="text-xs font-mono text-monke-primary font-bold break-all">
                    {publicKey.toBase58()}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-monke-cream border border-monke-border rounded-lg">
                    <p className="text-2xl font-bold text-monke-primary">0</p>
                    <p className="text-xs text-monke-primary/80 font-medium">Coupons Owned</p>
                  </div>
                  <div className="p-4 bg-monke-cream border border-monke-border rounded-lg">
                    <p className="text-2xl font-bold text-monke-primary">0</p>
                    <p className="text-xs text-monke-primary/80 font-medium">Deals Created</p>
                  </div>
                  <div className="p-4 bg-monke-cream border border-monke-border rounded-lg">
                    <p className="text-2xl font-bold text-monke-primary">0</p>
                    <p className="text-xs text-monke-primary/80 font-medium">Redemptions</p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <p className="text-sm font-medium text-monke-cream text-center">
                    What would you like to do?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/register"
                      className="px-6 py-3 bg-monke-cream text-monke-primary font-bold rounded-lg hover:bg-white transition-all shadow-md hover:shadow-lg text-center cursor-pointer border-2 border-monke-cream"
                    >
                      🏪 Register as Merchant
                    </Link>
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 bg-monke-cream text-monke-primary font-bold rounded-lg hover:bg-white transition-all shadow-md hover:shadow-lg text-center cursor-pointer border-2 border-monke-cream"
                    >
                      📊 Merchant Dashboard
                    </Link>
                  </div>
                  <Link
                    href="/marketplace"
                    className="block w-full px-6 py-3 bg-monke-cream text-monke-primary font-bold rounded-lg hover:bg-white transition-all shadow-md hover:shadow-lg text-center cursor-pointer border-2 border-monke-cream"
                  >
                    🛍️ Browse Deals Marketplace
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm text-foreground/70">
                  Connect your wallet to get started
                </p>
                <p className="text-xs text-foreground/50">
                  Supports: Phantom • Solflare
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
