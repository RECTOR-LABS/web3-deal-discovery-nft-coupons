'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, DollarSign, Sparkles } from 'lucide-react';

export default function StakingSimulator() {
  const [stakeAmount, setStakeAmount] = useState(1000);
  const [timePeriod, setTimePeriod] = useState(30); // days
  const [apyPercentage] = useState(12);

  // Calculate rewards based on APY and time
  const calculateRewards = useCallback(() => {
    const secondsPerYear = 365 * 24 * 60 * 60;
    const timeInSeconds = timePeriod * 24 * 60 * 60;
    const rewards = (stakeAmount * apyPercentage * timeInSeconds) / (secondsPerYear * 100);
    return Math.round(rewards * 100) / 100; // Round to 2 decimals
  }, [stakeAmount, timePeriod, apyPercentage]);

  const [projectedRewards, setProjectedRewards] = useState(() => {
    const secondsPerYear = 365 * 24 * 60 * 60;
    const timeInSeconds = 30 * 24 * 60 * 60; // initial timePeriod
    const rewards = (1000 * 12 * timeInSeconds) / (secondsPerYear * 100); // initial stakeAmount and APY
    return Math.round(rewards * 100) / 100;
  });

  useEffect(() => {
    setProjectedRewards(calculateRewards());
  }, [stakeAmount, timePeriod, calculateRewards]);

  // Calculate daily, monthly, yearly earnings
  const dailyEarnings = (stakeAmount * apyPercentage) / (365 * 100);
  const monthlyEarnings = (stakeAmount * apyPercentage) / (12 * 100);
  const yearlyEarnings = (stakeAmount * apyPercentage) / 100;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#00ff4d] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#00ff4d] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#00ff4d] p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-[#0d2a13]" />
          </div>
          <h3 className="text-2xl font-black text-white">Interactive Staking Calculator</h3>
        </div>
        <p className="text-[#f2eecb] mb-8 text-sm">
          Adjust the sliders to see how much you can earn by staking DEAL tokens
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Stake Amount Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-white font-semibold">
                  <DollarSign className="w-5 h-5 text-[#00ff4d]" />
                  Stake Amount
                </label>
                <span className="text-[#00ff4d] text-xl font-bold">{formatCurrency(stakeAmount)} DEAL</span>
              </div>
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-full h-3 bg-[#f2eecb]/20 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-[#f2eecb]/60 mt-1">
                <span>100</span>
                <span>50,000</span>
                <span>100,000</span>
              </div>
            </div>

            {/* Time Period Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-white font-semibold">
                  <Calendar className="w-5 h-5 text-[#00ff4d]" />
                  Staking Period
                </label>
                <span className="text-[#00ff4d] text-xl font-bold">{timePeriod} days</span>
              </div>
              <input
                type="range"
                min="1"
                max="365"
                step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-3 bg-[#f2eecb]/20 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-[#f2eecb]/60 mt-1">
                <span>1 day</span>
                <span>6 months</span>
                <span>1 year</span>
              </div>
            </div>

            {/* APY Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-[#00ff4d]/30">
              <div className="flex items-center justify-between">
                <span className="text-[#f2eecb] font-semibold">Annual Percentage Yield</span>
                <span className="text-[#00ff4d] text-2xl font-black">{apyPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            {/* Projected Rewards - Hero Stat */}
            <motion.div
              key={projectedRewards}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-[#00ff4d]" />
                <span className="text-gray-600 font-semibold">Projected Rewards</span>
              </div>
              <p className="text-5xl font-black text-[#0d2a13] mb-2">
                {formatCurrency(projectedRewards)}
              </p>
              <p className="text-sm text-gray-600">
                DEAL tokens in {timePeriod} {timePeriod === 1 ? 'day' : 'days'}
              </p>
            </motion.div>

            {/* Total Return */}
            <div className="bg-[#00ff4d]/20 backdrop-blur-sm rounded-xl p-4 border-2 border-[#00ff4d]">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Total Return</span>
                <span className="text-white text-2xl font-bold">
                  {formatCurrency(stakeAmount + projectedRewards)} DEAL
                </span>
              </div>
              <p className="text-xs text-[#f2eecb] mt-1">
                Original stake + rewards
              </p>
            </div>

            {/* Earnings Breakdown */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-[#f2eecb] text-xs mb-1">Daily</p>
                <p className="text-white font-bold text-sm">{formatCurrency(dailyEarnings)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-[#f2eecb] text-xs mb-1">Monthly</p>
                <p className="text-white font-bold text-sm">{formatCurrency(monthlyEarnings)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-[#f2eecb] text-xs mb-1">Yearly</p>
                <p className="text-white font-bold text-sm">{formatCurrency(yearlyEarnings)}</p>
              </div>
            </div>

            {/* ROI Percentage */}
            <div className="bg-gradient-to-r from-[#00ff4d]/20 to-[#00ff4d]/10 backdrop-blur-sm rounded-xl p-4 border border-[#00ff4d]/30">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Return on Investment</span>
                <span className="text-[#00ff4d] text-2xl font-black">
                  {((projectedRewards / stakeAmount) * 100).toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-[#f2eecb] mt-1">
                Over {timePeriod} day period
              </p>
            </div>
          </div>
        </div>

        {/* Info Bullets */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h4 className="text-white font-bold mb-3">How It Works</h4>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-[#f2eecb]">
            <li className="flex items-start">
              <span className="text-[#00ff4d] mr-2">✓</span>
              <span>Rewards calculated per second, compounded continuously</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00ff4d] mr-2">✓</span>
              <span>No lockup period - unstake anytime</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00ff4d] mr-2">✓</span>
              <span>Earn 5-15% cashback based on loyalty tier</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00ff4d] mr-2">✓</span>
              <span>Claim rewards separately or withdraw all at once</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CSS for custom slider */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #00ff4d;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 255, 77, 0.5);
          transition: all 0.2s;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(0, 255, 77, 0.7);
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #00ff4d;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 255, 77, 0.5);
          transition: all 0.2s;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(0, 255, 77, 0.7);
        }
      `}</style>
    </div>
  );
}
