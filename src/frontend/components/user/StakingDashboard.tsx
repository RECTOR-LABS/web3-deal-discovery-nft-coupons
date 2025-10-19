'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, Gift, Clock } from 'lucide-react';

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

interface StakingDashboardProps {
  stakingInfo: StakingInfo | null;
  walletAddress: string;
  onUpdate: () => void;
}

export default function StakingDashboard({ stakingInfo, walletAddress, onUpdate }: StakingDashboardProps) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const stakedAmount = stakingInfo?.staking?.stakedAmount || 0;
  const _pendingRewards = stakingInfo?.staking?.pendingRewards || 0;
  const totalRewards = stakingInfo?.staking?.totalRewards || 0;
  const apyPercentage = stakingInfo?.staking?.apyPercentage || 12;
  const lifetimeCashback = stakingInfo?.cashback?.lifetimeCashback || 0;

  // Convert lamports to DEAL tokens (9 decimals)
  const toTokens = (lamports: number) => (lamports / 1e9).toFixed(2);
  const toLamports = (tokens: string) => Math.floor(parseFloat(tokens) * 1e9);

  async function handleStake() {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/staking/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: walletAddress,
          amount: toLamports(stakeAmount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        setStakeAmount('');
        onUpdate();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ Failed to stake tokens');
    } finally {
      setLoading(false);
    }
  }

  async function handleUnstake() {
    if (stakedAmount === 0) {
      setMessage('No tokens to unstake');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/staking/unstake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: walletAddress }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Unstaked ${toTokens(data.unstaked.principal)} DEAL + ${toTokens(data.unstaked.rewards)} rewards`);
        onUpdate();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ Failed to unstake tokens');
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimRewards() {
    if (totalRewards === 0) {
      setMessage('No rewards to claim');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/staking/claim-rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: walletAddress }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        onUpdate();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ Failed to claim rewards');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Staked Amount */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-[#00ff4d]" />
            <span className="text-sm font-semibold text-gray-500">Staked</span>
          </div>
          <p className="text-3xl font-bold text-[#0d2a13]">{toTokens(stakedAmount)}</p>
          <p className="text-sm text-gray-600 mt-1">DEAL Tokens</p>
        </div>

        {/* APY */}
        <div className="bg-gradient-to-br from-[#0d2a13] to-[#174622] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-[#00ff4d]" />
            <span className="text-sm font-semibold text-[#f2eecb]">APY</span>
          </div>
          <p className="text-3xl font-bold text-white">{apyPercentage}%</p>
          <p className="text-sm text-[#f2eecb] mt-1">Annual Yield</p>
        </div>

        {/* Pending Rewards */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Gift className="w-8 h-8 text-[#00ff4d]" />
            <span className="text-sm font-semibold text-gray-500">Rewards</span>
          </div>
          <p className="text-3xl font-bold text-[#0d2a13]">{toTokens(totalRewards)}</p>
          <p className="text-sm text-gray-600 mt-1">Pending DEAL</p>
        </div>

        {/* Lifetime Cashback */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-[#00ff4d]" />
            <span className="text-sm font-semibold text-gray-500">Cashback</span>
          </div>
          <p className="text-3xl font-bold text-[#0d2a13]">{toTokens(lifetimeCashback)}</p>
          <p className="text-sm text-gray-600 mt-1">Lifetime DEAL</p>
        </div>
      </div>

      {/* Stake/Unstake Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stake Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0d2a13] mb-4">Stake DEAL Tokens</h2>
          <p className="text-gray-600 mb-4">
            Earn {apyPercentage}% APY on your staked tokens. No lockup period - unstake anytime!
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount to Stake
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="1000"
                min="0"
                step="1"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00ff4d]"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum: 1 DEAL</p>
            </div>

            <button
              onClick={handleStake}
              disabled={loading || !stakeAmount}
              className="w-full bg-gradient-to-r from-[#0d2a13] to-[#174622] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing...' : 'Stake Tokens'}
            </button>
          </div>
        </div>

        {/* Unstake & Claim Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0d2a13] mb-4">Manage Stake</h2>

          <div className="space-y-4">
            {/* Current Stake Info */}
            <div className="bg-[#f2eecb] rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Currently Staked:</p>
              <p className="text-2xl font-bold text-[#0d2a13]">{toTokens(stakedAmount)} DEAL</p>
              {stakingInfo?.staking?.lastStakeTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Since: {new Date(stakingInfo.staking.lastStakeTime).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Claim Rewards Button */}
            <button
              onClick={handleClaimRewards}
              disabled={loading || totalRewards === 0}
              className="w-full bg-[#00ff4d] text-[#0d2a13] font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Claim {toTokens(totalRewards)} DEAL Rewards
            </button>

            {/* Unstake Button */}
            <button
              onClick={handleUnstake}
              disabled={loading || stakedAmount === 0}
              className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Unstake All + Claim Rewards
            </button>

            <p className="text-xs text-gray-500 text-center">
              Unstaking will withdraw all staked tokens plus accumulated rewards
            </p>
          </div>
        </div>
      </div>

      {/* Recent Cashback History */}
      {stakingInfo?.cashback?.recentTransactions && stakingInfo.cashback.recentTransactions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0d2a13] mb-4">Recent Cashback Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tier</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Cashback</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                </tr>
              </thead>
              <tbody>
                {stakingInfo.cashback.recentTransactions.map((tx: CashbackTransaction, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-[#f2eecb] text-[#0d2a13] text-xs font-semibold rounded">
                        {tx.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[#00ff4d]">
                      +{toTokens(tx.cashback_amount)} DEAL
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-600">
                      {tx.cashback_rate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gradient-to-r from-[#0d2a13] to-[#174622] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">How Staking Works</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-[#00ff4d] mr-2">•</span>
            <span>Stake DEAL tokens to earn 12% APY rewards calculated per second</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#00ff4d] mr-2">•</span>
            <span>No lockup period - unstake anytime and keep all earned rewards</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#00ff4d] mr-2">•</span>
            <span>Earn cashback on coupon redemptions (5-15% based on your loyalty tier)</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#00ff4d] mr-2">•</span>
            <span>Claim rewards separately or withdraw everything with one click</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
