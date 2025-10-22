'use client';

import { motion } from 'framer-motion';
import {
  Rocket,
  Users,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
  DollarSign,
  BarChart3,
  Gift
} from 'lucide-react';
import Link from 'next/link';

export default function MerchantOnboarding() {
  const benefits = [
    {
      icon: Users,
      title: 'Reach More Customers',
      description: 'Access our growing community of deal-seekers and crypto enthusiasts on Solana',
      color: '#3b82f6',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'NFT coupons prevent fraud and duplication - each coupon is unique and verifiable',
      color: '#10b981',
      bgColor: 'bg-green-50',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track views, claims, and redemptions with detailed merchant dashboard',
      color: '#8b5cf6',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'QR code scanning with on-chain verification - no manual validation needed',
      color: '#f59e0b',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Globe,
      title: 'Global Marketplace',
      description: 'Your deals are visible to anyone, anywhere - no geographical limits',
      color: '#06b6d4',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: Gift,
      title: 'No Platform Fees',
      description: 'Create and distribute coupons for FREE - only pay minimal Solana network fees',
      color: '#ec4899',
      bgColor: 'bg-pink-50',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Connect Wallet',
      description: 'Use Phantom or Solflare to connect your Solana wallet',
      time: '30 seconds',
    },
    {
      number: 2,
      title: 'Complete Registration',
      description: 'Enter your business details and upload your logo',
      time: '2 minutes',
    },
    {
      number: 3,
      title: 'Create Your First Deal',
      description: 'Set discount, expiry date, and upload deal image',
      time: '3 minutes',
    },
    {
      number: 4,
      title: 'Start Getting Customers',
      description: 'Users discover, claim, and redeem your NFT coupons',
      time: 'Instant',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2eecb] via-white to-[#f2eecb] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#00ff4d] rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#0d2a13] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0d2a13] to-[#174622] text-white px-6 py-3 rounded-full mb-6 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-[#00ff4d]" />
            <span className="font-bold">Become a Merchant</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black text-[#0d2a13] mb-6">
            Grow Your Business with <br />
            <span className="bg-gradient-to-r from-[#0d2a13] via-[#174622] to-[#00ff4d] bg-clip-text text-transparent">
              Web3 Digital Coupons
            </span>
          </h1>
          <p className="text-xl text-[#174622] max-w-3xl mx-auto leading-relaxed">
            Join DealCoupon and start creating NFT coupons on Solana. Attract more customers,
            prevent fraud, and grow your business with blockchain technology.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-[#0d2a13] text-center mb-3"
          >
            Why Merchants Love DealCoupon
          </motion.h2>
          <p className="text-center text-[#174622] mb-8">
            Powerful features designed to help your business succeed
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: `0 20px 40px ${benefit.color}20` }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#f2eecb] hover:border-[#00ff4d] transition-all"
                >
                  <div
                    className={`${benefit.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon style={{ color: benefit.color }} className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0d2a13] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[#174622] leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff4d] rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white text-center mb-3">
              Get Started in Minutes
            </h2>
            <p className="text-center text-[#f2eecb] mb-10">
              Simple 4-step process to launch your first deal
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-[#00ff4d]/30">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                        className="h-full bg-[#00ff4d] origin-left"
                      />
                    </div>
                  )}

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#00ff4d]/30 hover:bg-white/20 transition-all">
                    <div className="w-16 h-16 bg-[#00ff4d] rounded-full flex items-center justify-center text-[#0d2a13] font-black text-2xl mb-4 shadow-lg">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#f2eecb] text-sm mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-[#00ff4d] text-xs font-semibold">
                      <Zap className="w-3 h-3" />
                      {step.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-[#f2eecb]"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-[#0d2a13] mb-3">
              Transparent Pricing
            </h2>
            <p className="text-[#174622] text-lg">
              No hidden fees. No subscriptions. Just pay network costs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Registration Cost */}
            <div className="bg-gradient-to-br from-[#f2eecb] to-white rounded-2xl p-6 border-2 border-[#00ff4d]">
              <DollarSign className="w-12 h-12 text-[#00ff4d] mb-4" />
              <h3 className="text-2xl font-bold text-[#0d2a13] mb-2">
                Registration
              </h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-[#0d2a13]">~0.002</span>
                <span className="text-xl text-[#174622]">SOL</span>
              </div>
              <p className="text-[#174622] text-sm">
                One-time account creation cost (~$0.40 USD). Covers Solana blockchain storage rent and transaction fees.
              </p>
            </div>

            {/* Per Deal Cost */}
            <div className="bg-gradient-to-br from-[#f2eecb] to-white rounded-2xl p-6 border-2 border-[#0d2a13]">
              <Rocket className="w-12 h-12 text-[#0d2a13] mb-4" />
              <h3 className="text-2xl font-bold text-[#0d2a13] mb-2">
                Per Deal
              </h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-[#0d2a13]">FREE</span>
              </div>
              <p className="text-[#174622] text-sm">
                Create unlimited deals at no cost. Users pay ~0.001 SOL when claiming your coupons.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-[#00ff4d]/10 border border-[#00ff4d]/30 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#00ff4d] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#0d2a13] mb-2">What&apos;s Included</h4>
                <ul className="space-y-2 text-[#174622] text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00ff4d] rounded-full" />
                    Unlimited deal creation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00ff4d] rounded-full" />
                    Real-time analytics dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00ff4d] rounded-full" />
                    QR code redemption system
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00ff4d] rounded-full" />
                    Blockchain verification & security
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00ff4d] rounded-full" />
                    Global marketplace exposure
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-[#0d2a13] via-[#174622] to-[#0d2a13] rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-[#f2eecb] text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of merchants already using DealCoupon to attract customers and grow sales
          </p>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(0, 255, 77, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-[#00ff4d] hover:bg-[#00cc3d] text-[#0d2a13] font-black text-xl px-10 py-5 rounded-xl transition-all shadow-xl cursor-pointer"
            >
              <Rocket className="w-6 h-6" />
              <span>Register as Merchant</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
          <p className="text-[#f2eecb]/70 text-sm mt-4">
            Takes less than 5 minutes • No credit card required
          </p>
        </motion.div>
      </div>
    </div>
  );
}
