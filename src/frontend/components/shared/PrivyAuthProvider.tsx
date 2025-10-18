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
          logo: '/logo.png', // TODO: Add MonkeDAO-themed logo
          walletChainType: 'solana-only', // Solana-only application
        },
        // Enable email and social logins
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
        // External wallet configuration for Solana
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        // Embedded wallet configuration
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Auto-create wallet for email/social users
          requireUserPasswordOnCreate: false, // No password needed - seamless UX
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
