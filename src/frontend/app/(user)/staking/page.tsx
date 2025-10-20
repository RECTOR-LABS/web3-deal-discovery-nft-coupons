'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import StakingDashboard from '@/components/user/StakingDashboard';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

interface CashbackTransaction {
  created_at: string;
  tier: string;
  cashback_amount: number;
  cashback_rate: number;
}

interface StakingInfo {
  staking: {
    stakedAmount: number;
    pendingRewards: number;
    totalRewards: number;
    apyPercentage: number;
    lastStakeTime?: string;
  };
  cashback: {
    lifetimeCashback: number;
    recentTransactions?: CashbackTransaction[];
  };
}

export default function StakingPage() {
  const { publicKey, connected } = useWallet();
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStakingInfo() {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/staking/info?wallet=${publicKey.toBase58()}`);

        if (!response.ok) {
          console.error('Failed to fetch staking info:', response.status);
          setStakingInfo({
            staking: {
              stakedAmount: 0,
              pendingRewards: 0,
              totalRewards: 0,
              apyPercentage: 12,
            },
            cashback: {
              lifetimeCashback: 0,
              recentTransactions: [],
            },
          });
          setLoading(false);
          return;
        }

        const data = await response.json();
        setStakingInfo(data);
      } catch (error) {
        console.error('Failed to fetch staking info:', error);
        // Set default data on error
        setStakingInfo({
          staking: {
            stakedAmount: 0,
            pendingRewards: 0,
            totalRewards: 0,
            apyPercentage: 12,
          },
          cashback: {
            lifetimeCashback: 0,
            recentTransactions: [],
          },
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStakingInfo();
  }, [connected, publicKey]);

  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen bg-[#f2eecb] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-[#0d2a13] mb-4">DEAL Token Staking</h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to stake DEAL tokens and earn 12% APY rewards
          </p>
          <div className="wallet-adapter-button-container">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2eecb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0d2a13] mx-auto mb-4"></div>
          <p className="text-[#0d2a13] font-semibold">Loading staking info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2eecb] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0d2a13] mb-2">DEAL Token Staking</h1>
          <p className="text-gray-700">
            Stake your DEAL tokens to earn 12% APY rewards. Unstake anytime with no lockup period.
          </p>
        </div>

        {/* Staking Dashboard */}
        <StakingDashboard
          stakingInfo={stakingInfo}
          walletAddress={publicKey.toBase58()}
          onUpdate={() => {
            // Refresh staking info
            fetch(`/api/staking/info?wallet=${publicKey.toBase58()}`)
              .then((res) => {
                if (res.ok) {
                  return res.json();
                }
                // Return default data if fetch fails
                return {
                  staking: {
                    stakedAmount: 0,
                    pendingRewards: 0,
                    totalRewards: 0,
                    apyPercentage: 12,
                  },
                  cashback: {
                    lifetimeCashback: 0,
                    recentTransactions: [],
                  },
                };
              })
              .then(setStakingInfo)
              .catch((err) => console.error('Failed to refresh staking info:', err));
          }}
        />
      </div>
    </div>
  );
}
