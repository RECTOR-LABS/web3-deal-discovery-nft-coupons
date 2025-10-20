'use client';

import { motion } from 'framer-motion';
import { Lock, Unlock, TrendingDown, Database, AlertCircle, CheckCircle, Zap, Shield } from 'lucide-react';

export default function ProblemSolution() {
  const problems = [
    {
      title: 'Users',
      icon: Lock,
      points: [
        'Non-transferable coupons',
        'Trapped value (can\'t resell)',
        'No secondary market',
        'Expiry = total loss',
      ],
    },
    {
      title: 'Merchants',
      icon: Database,
      points: [
        'Limited analytics',
        'No direct control',
        'Platform dependency',
        'High commission fees',
      ],
    },
    {
      title: 'Market',
      icon: TrendingDown,
      points: [
        'Inefficient liquidity',
        'Fraud risk (fake coupons)',
        'Geographic limitations',
        'Centralized gatekeepers',
      ],
    },
  ];

  const solutions = [
    {
      title: 'NFT Ownership',
      icon: Unlock,
      description: 'Every deal is a transferable, tradable digital asset on Solana blockchain',
      benefits: ['Resell unused coupons', 'Gift to friends', 'Trade on marketplace'],
    },
    {
      title: 'On-Chain Redemption',
      icon: CheckCircle,
      description: 'Verifiable burns with permanent audit trail and cryptographic proof',
      benefits: ['No double-spend', 'Transparent history', 'Zero fraud risk'],
    },
    {
      title: 'Web3 Invisible UX',
      icon: Zap,
      description: 'Email/wallet login with no crypto jargon - feels like Groupon',
      benefits: ['Guest browsing', 'One-click claiming', 'No blockchain knowledge needed'],
    },
    {
      title: 'Merchant Control',
      icon: Shield,
      description: 'Dashboard for creation, analytics, and redemption management',
      benefits: ['Real-time data', 'Direct customer relationship', 'Full autonomy'],
    },
  ];

  const missionPoints = [
    { label: 'Promotions as verifiable NFTs', checked: true },
    { label: 'Redemption tracked on-chain', checked: true },
    { label: 'Ownership transferable/tradable', checked: true },
    { label: 'Merchants retain control', checked: true },
    { label: 'Users discover/collect/share globally', checked: true },
  ];

  return (
    <>
      {/* Problem Statement Section */}
      <section id="problem" className="py-20 px-4 bg-[#f2eecb] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0d2a13] mb-4">
              The Problem
            </h2>
            <p className="text-xl text-[#0d2a13]/70 max-w-3xl mx-auto">
              Trapped Value in Traditional Discount Platforms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#0d2a13]/10 hover:border-[#00ff4d]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <problem.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0d2a13]">{problem.title}</h3>
                </div>
                <ul className="space-y-3">
                  {problem.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#0d2a13]/70">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Before/After Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-8 bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center">
                <Lock className="w-16 h-16 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#0d2a13]">Locked Value</p>
              </div>
              <div className="text-4xl text-[#00ff4d]">→</div>
              <div className="text-center">
                <Unlock className="w-16 h-16 text-[#00ff4d] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#0d2a13]">Free Market</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section id="solution" className="py-20 px-4 bg-gradient-to-br from-[#0d2a13] to-[#174622] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#f2eecb] mb-4">
              Our Solution
            </h2>
            <p className="text-xl text-[#f2eecb]/70 max-w-3xl mx-auto">
              User-Owned, Borderless Deal Marketplace
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]/30 hover:border-[#00ff4d] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#00ff4d]/20 rounded-xl">
                    <solution.icon className="w-8 h-8 text-[#00ff4d]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f2eecb]">{solution.title}</h3>
                </div>
                <p className="text-[#f2eecb]/80 mb-4">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#f2eecb]/70">
                      <CheckCircle className="w-4 h-4 text-[#00ff4d] flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Mission Alignment */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#00ff4d]/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]"
          >
            <h3 className="text-2xl font-bold text-[#f2eecb] mb-6 text-center">
              🎯 Mission: Build the next evolution of Groupon - user-owned, borderless, Web3-powered
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {missionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 bg-[#0d2a13]/50 rounded-lg p-4"
                >
                  <CheckCircle className="w-6 h-6 text-[#00ff4d] flex-shrink-0" />
                  <span className="text-[#f2eecb] text-sm font-medium">{point.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
