'use client';

import { motion } from 'framer-motion';
import { Coins, Flame, Eye, Database, CheckCircle, X } from 'lucide-react';

export default function InnovationShowcase() {
  const innovations = [
    {
      icon: Coins,
      title: 'NFT Ownership (Metaplex v5.0.0)',
      features: [
        'Transferable coupons as SPL tokens',
        'Metadata: name, image, discount%, expiry, merchant ID',
        'Resale marketplace enabled',
        'Standard: Metaplex v1.1 compatible',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Flame,
      title: 'On-Chain Redemption',
      features: [
        'Smart contract: redeem_coupon instruction',
        'NFT burning for single-use enforcement',
        'Transaction signature as permanent proof',
        'Event logging: database + blockchain',
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Eye,
      title: 'Web3 Invisible UX',
      features: [
        'Solana Wallet Adapter (Phantom/Solflare)',
        'No crypto jargon ("Coupon" not "NFT")',
        'Guest browsing (login only for claiming)',
        'Groupon-style familiar interface',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Database,
      title: 'Decentralized Storage',
      features: [
        'Arweave permanent metadata (production-ready)',
        'Server-side API routes for security',
        'Supabase fallback (100% functional)',
        'Demo note: Requires AR tokens (~$5-10)',
      ],
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const challenges = [
    {
      challenge: 'NFT Representation',
      solution: 'Metaplex v1.1 standard with detailed metadata schema',
    },
    {
      challenge: 'Redemption Flow',
      solution: 'QR code + signature → off-chain verify → on-chain burn',
    },
    {
      challenge: 'UX Abstraction',
      solution: 'Wallet adapter + guest browsing + email login fallback',
    },
    {
      challenge: 'Merchant Onboarding',
      solution: 'Simple dashboard, zero blockchain knowledge required',
    },
    {
      challenge: 'Marketplace Liquidity',
      solution: 'Resale listings + RapidAPI partner deals + social sharing',
    },
  ];

  const comparison = [
    {
      feature: 'Ownership',
      groupon: 'Centralized platform control',
      dealcoupon: 'User-owned NFTs',
      grouponBad: true,
    },
    {
      feature: 'Transferability',
      groupon: 'Non-transferable, locked',
      dealcoupon: 'Fully transferable, tradable',
      grouponBad: true,
    },
    {
      feature: 'Verification',
      groupon: 'Trust-based system',
      dealcoupon: 'Cryptographic proof',
      grouponBad: false,
    },
    {
      feature: 'Liquidity',
      groupon: 'No secondary market',
      dealcoupon: 'Resale marketplace',
      grouponBad: true,
    },
    {
      feature: 'Analytics',
      groupon: 'Limited merchant insights',
      dealcoupon: 'Real-time on-chain data',
      grouponBad: false,
    },
    {
      feature: 'Global Access',
      groupon: 'Geo-restricted',
      dealcoupon: 'Borderless, worldwide',
      grouponBad: true,
    },
  ];

  return (
    <section id="innovation" className="py-20 px-4 bg-[#f2eecb] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d2a13] mb-4">
            Innovation & Web3 Integration
          </h2>
          <p className="text-xl text-[#0d2a13]/70 max-w-3xl mx-auto">
            Leveraging blockchain for unprecedented user value
          </p>
        </motion.div>

        {/* Innovation Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {innovations.map((innovation, index) => (
            <motion.div
              key={innovation.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#0d2a13]/10 hover:border-[#00ff4d]/50 transition-all duration-300"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${innovation.color} mb-6`}>
                <innovation.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0d2a13] mb-4">{innovation.title}</h3>
              <ul className="space-y-3">
                {innovation.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#0d2a13]/70">
                    <CheckCircle className="w-5 h-5 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Web3 Integration Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Web3 Integration Challenges Solved
          </h3>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#0d2a13]/10">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#0d2a13]/10">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4">
                <h4 className="font-bold text-[#0d2a13] text-center py-2">Challenge</h4>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                <h4 className="font-bold text-[#0d2a13] text-center py-2">Our Solution</h4>
              </div>
            </div>
            {challenges.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#0d2a13]/10 hover:bg-[#00ff4d]/5 transition-colors"
              >
                <div className="p-6 flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-[#0d2a13] font-medium">{item.challenge}</span>
                </div>
                <div className="p-6 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-[#0d2a13]/80">{item.solution}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Differentiation Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Groupon vs DealCoupon: Key Differences
          </h3>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#0d2a13]/10">
            <div className="grid grid-cols-3 divide-x divide-[#0d2a13]/10 bg-gradient-to-r from-[#0d2a13] to-[#174622]">
              <div className="p-4">
                <h4 className="font-bold text-[#f2eecb] text-center">Feature</h4>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-[#f2eecb] text-center">Groupon</h4>
              </div>
              <div className="p-4 bg-[#00ff4d]/20">
                <h4 className="font-bold text-[#f2eecb] text-center">DealCoupon</h4>
              </div>
            </div>
            {comparison.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 divide-x divide-[#0d2a13]/10 hover:bg-[#00ff4d]/5 transition-colors"
              >
                <div className="p-6 font-semibold text-[#0d2a13]">{row.feature}</div>
                <div className="p-6 flex items-center gap-2">
                  <X className={`w-5 h-5 flex-shrink-0 ${row.grouponBad ? 'text-red-500' : 'text-yellow-500'}`} />
                  <span className="text-[#0d2a13]/70">{row.groupon}</span>
                </div>
                <div className="p-6 flex items-center gap-2 bg-[#00ff4d]/5">
                  <CheckCircle className="w-5 h-5 text-[#00ff4d] flex-shrink-0" />
                  <span className="text-[#0d2a13] font-medium">{row.dealcoupon}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
