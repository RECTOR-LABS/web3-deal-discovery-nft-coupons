'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';

export default function PrivyLoginButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

  // Get Solana wallet from Privy's embedded wallets
  const solanaWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  useEffect(() => {
    if (authenticated && solanaWallet) {
      console.log('Solana wallet address:', solanaWallet.address);
    }
  }, [authenticated, solanaWallet]);

  if (!ready) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (authenticated && user) {
    return (
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-2 bg-[#f2eecb] px-4 py-2 rounded-lg border-2 border-[#174622]/20">
          <User className="w-5 h-5 text-[#174622]" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#0d2a13]">
              {user.email?.address || 'User'}
            </span>
            {solanaWallet && (
              <span className="text-xs font-mono text-[#174622]">
                {solanaWallet.address.slice(0, 4)}...{solanaWallet.address.slice(-4)}
              </span>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 px-6 py-3 bg-[#00ff4d] hover:bg-[#00ff4d]/90 text-[#0d2a13] rounded-lg font-bold transition-colors shadow-lg"
    >
      <LogIn className="w-5 h-5" />
      <span>Sign In</span>
    </button>
  );
}
