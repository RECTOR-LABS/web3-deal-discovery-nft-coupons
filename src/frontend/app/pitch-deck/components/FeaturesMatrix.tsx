'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Coins, LayoutDashboard, ShoppingCart, QrCode, Zap, Share2, DollarSign, Award, MapPin } from 'lucide-react';

export default function FeaturesMatrix() {
  const coreFeatures = [
    {
      icon: Coins,
      title: 'NFT Promotions/Coupons',
      details: [
        'Metaplex v5.0.0 minting',
        'Metadata: discount%, expiry, merchant ID, category',
        'Transferable SPL tokens',
        'On-chain ownership verification',
      ],
    },
    {
      icon: LayoutDashboard,
      title: 'Merchant Dashboard',
      details: [
        'Registration & profile management',
        'Deal creation with image upload',
        'Analytics (views, claims, redemptions)',
        'QR redemption scanner',
      ],
    },
    {
      icon: ShoppingCart,
      title: 'User Wallet & Marketplace',
      details: [
        'Browse deals (guest + authenticated)',
        'Filter by category, location, discount',
        'My Coupons page (claimed NFTs)',
        'QR code generation for redemption',
      ],
    },
    {
      icon: QrCode,
      title: 'Redemption Verification Flow',
      details: [
        'QR code with cryptographic signature',
        'Merchant scanner (camera + manual)',
        'Off-chain verify → On-chain burn',
        'Event logging (database + blockchain)',
      ],
    },
    {
      icon: Zap,
      title: 'Deal Aggregator Feed',
      details: [
        'RapidAPI integration (1M+ coupons)',
        '1-hour cache, mock fallback',
        '"Partner Deal" badges',
        'External API pagination',
      ],
    },
    {
      icon: Share2,
      title: 'Social Discovery Layer',
      details: [
        'Reviews (star ratings, comments)',
        'Voting (upvote/downvote deals)',
        'Sharing (Twitter, copy link)',
        'Referral system (invite friends)',
      ],
    },
  ];

  const bonusFeatures = [
    {
      icon: DollarSign,
      title: 'Reward Staking/Cashback',
      score: 'B+ (85/100)',
      details: [
        '12% base APY',
        'Tier-based multipliers (5-15%)',
        'Auto-distribution on purchases',
      ],
    },
    {
      icon: Award,
      title: 'NFT Badges/Loyalty System',
      score: 'A- (88/100)',
      details: [
        '4 tiers (Bronze → Diamond)',
        '8 NFT badges (achievements)',
        'Exclusive deals by tier',
        'Auto-minting on milestone',
      ],
    },
    {
      icon: MapPin,
      title: 'Geo-based Discovery',
      score: 'A (90/100)',
      details: [
        '"Deals Near Me" filter',
        'Distance calc (1-50 miles)',
        'Interactive map (Leaflet)',
        'Merchant location pins',
      ],
    },
  ];

  const epics = [
    { number: 1, name: 'NFT Coupons', tasks: '8/8', audit: 'Pass', color: 'text-green-500' },
    { number: 2, name: 'Merchant Dashboard', tasks: '9/9', audit: 'Pass', color: 'text-green-500' },
    { number: 3, name: 'User Marketplace', tasks: '8/8', audit: 'Pass', color: 'text-green-500' },
    { number: 4, name: 'Redemption Flow', tasks: '7/7', audit: 'Pass', color: 'text-green-500' },
    { number: 5, name: 'Deal Aggregator', tasks: '6/6', audit: 'Pass', color: 'text-green-500' },
    { number: 6, name: 'Social Layer', tasks: '10/10', audit: 'Pass', color: 'text-green-500' },
    { number: 7, name: 'Web3 Abstraction', tasks: '9/9', audit: 'Pass', color: 'text-green-500' },
    { number: 8, name: 'Staking/Cashback', tasks: '9/9', audit: 'B+ (85)', color: 'text-blue-500' },
    { number: 9, name: 'Loyalty System', tasks: '9/9', audit: 'A- (88)', color: 'text-blue-500' },
    { number: 10, name: 'Geo Discovery', tasks: '9/9', audit: 'A (90)', color: 'text-blue-500' },
  ];

  const totalTasks = 84;
  const completedTasks = 84;

  return (
    <section id="features" className="py-20 px-4 bg-[#f2eecb] scroll-mt-20">
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
            Features Completeness
          </h2>
          <p className="text-xl text-[#0d2a13]/70 max-w-3xl mx-auto">
            10/10 Epics delivered with comprehensive testing
          </p>
        </motion.div>

        {/* Circular Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-20"
        >
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#0d2a13"
                strokeWidth="8"
                fill="none"
                opacity="0.1"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                stroke="#00ff4d"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-[#0d2a13]">{completedTasks}</div>
              <div className="text-3xl text-[#0d2a13]/60">/ {totalTasks}</div>
              <div className="text-lg text-[#00ff4d] font-semibold mt-2">Tasks Complete</div>
            </div>
          </div>
        </motion.div>

        {/* Core Features Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Core Features (100% Complete)
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d2a13]/10 hover:border-[#00ff4d]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#00ff4d]/20 rounded-xl">
                    <feature.icon className="w-6 h-6 text-[#0d2a13]" />
                  </div>
                  <CheckCircle className="w-6 h-6 text-[#00ff4d]" />
                </div>
                <h4 className="text-lg font-bold text-[#0d2a13] mb-3">{feature.title}</h4>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#0d2a13]/70">
                      <div className="w-1.5 h-1.5 bg-[#00ff4d] rounded-full mt-1.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bonus Features */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Bonus Features (Advanced Functionality)
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {bonusFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="bg-gradient-to-br from-[#00ff4d]/10 to-[#0d2a13]/5 rounded-2xl p-6 shadow-lg border-2 border-[#00ff4d]/30 hover:border-[#00ff4d] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#00ff4d]/20 rounded-xl">
                    <feature.icon className="w-6 h-6 text-[#0d2a13]" />
                  </div>
                  <span className="text-sm font-bold text-[#00ff4d] bg-[#0d2a13] px-3 py-1 rounded-full">
                    {feature.score}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#0d2a13] mb-3">{feature.title}</h4>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#0d2a13]/70">
                      <CheckCircle className="w-4 h-4 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Epic Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Epic Progress Tracker
          </h3>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#0d2a13]/10">
            <div className="grid grid-cols-4 gap-px bg-[#0d2a13]/10">
              <div className="bg-[#0d2a13] p-4 font-bold text-[#f2eecb] text-center">Epic</div>
              <div className="bg-[#0d2a13] p-4 font-bold text-[#f2eecb] text-center">Name</div>
              <div className="bg-[#0d2a13] p-4 font-bold text-[#f2eecb] text-center">Tasks</div>
              <div className="bg-[#0d2a13] p-4 font-bold text-[#f2eecb] text-center">Audit</div>
            </div>
            {epics.map((epic, index) => (
              <motion.div
                key={epic.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-4 gap-px bg-[#0d2a13]/5 hover:bg-[#00ff4d]/10 transition-colors"
              >
                <div className="bg-white p-4 text-center font-bold text-[#0d2a13]">
                  {epic.number}
                </div>
                <div className="bg-white p-4 text-[#0d2a13]">{epic.name}</div>
                <div className="bg-white p-4 text-center">
                  <span className={`font-bold ${epic.color}`}>{epic.tasks}</span>
                </div>
                <div className="bg-white p-4 text-center">
                  <span className={`inline-flex items-center gap-1 font-semibold ${epic.color}`}>
                    <CheckCircle className="w-4 h-4" />
                    {epic.audit}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-[#0d2a13] font-semibold text-lg">
              🎯 All Epics Complete • 84/84 Tasks Delivered • Ready for Submission
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
