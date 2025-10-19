'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

export default function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

  if (!appId) {
    console.error('Missing NEXT_PUBLIC_PRIVY_APP_ID environment variable');
  }

  // Configure Solana wallet connectors
  const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: true,
  });

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // UI customization
        appearance: {
          theme: 'light',
          accentColor: '#00ff4d', // MonkeDAO neon green
          // logo: '/logo.png', // TODO: Add MonkeDAO-themed logo (disabled to fix 404)
          walletChainType: 'solana-only', // Solana-only application
        },
        // Enable email, Google OAuth, and wallet login
        loginMethods: ['email', 'google', 'wallet'],
        // External wallet configuration for Solana
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        // Embedded wallet configuration (correct structure per Privy types)
        embeddedWallets: {
          solana: {
            createOnLogin: 'all-users', // Auto-create for all users (email/social/wallet)
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
