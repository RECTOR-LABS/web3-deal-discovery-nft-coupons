'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, QrCode, Sparkles, CheckCircle, AlertCircle, Gift } from 'lucide-react';

export default function CouponGuide() {
  const steps = [
    {
      icon: ShoppingBag,
      title: 'Browse & Claim Deals',
      description: 'Explore amazing deals from merchants on our marketplace. When you find a deal you like, click "Claim Deal" to mint your coupon NFT.',
      tips: ['Filter by category to find what you need', 'Check deal expiry dates before claiming', 'Look for exclusive tier-based offers'],
      color: '#00ff4d',
    },
    {
      icon: Gift,
      title: 'Coupon in Your Wallet',
      description: 'Once claimed, your coupon is stored as an NFT in your Solana wallet. It\'s yours - you own it on the blockchain!',
      tips: ['View all your coupons on this page', 'Filter by status: Active, Expired, or Redeemed', 'Coupons are transferable (can be gifted or sold)'],
      color: '#4ecdc4',
    },
    {
      icon: QrCode,
      title: 'Generate QR Code',
      description: 'When you\'re ready to redeem at the merchant, click on your coupon and tap "Generate QR Code". This creates a secure, one-time redemption code.',
      tips: ['QR codes are cryptographically signed', 'Each QR code can only be used once', 'Show QR code to merchant within expiry time'],
      color: '#ffa07a',
    },
    {
      icon: CheckCircle,
      title: 'Merchant Scans & Redeems',
      description: 'Show your QR code to the merchant. They\'ll scan it with their dashboard, verify the discount, and process the redemption.',
      tips: ['Merchant confirms discount amount', 'NFT gets burned on-chain (proof of redemption)', 'You save money instantly!'],
      color: '#9C27B0',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#f3efcd]">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0d2a13] to-[#174622] text-white px-6 py-3 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-[#00ff4d]" />
          <span className="font-bold">How to Use Your Coupons</span>
        </div>
        <h2 className="text-4xl font-black text-[#0d2a13] mb-3">
          4 Simple Steps to Save Money
        </h2>
        <p className="text-[#174622] text-lg max-w-2xl mx-auto">
          Your coupons are NFTs on Solana - secure, transferable, and easy to redeem. Here's everything you need to know:
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Step Number Badge */}
              <div
                className="absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg shadow-lg z-10"
                style={{ backgroundColor: step.color }}
              >
                {index + 1}
              </div>

              {/* Card */}
              <div className="bg-gradient-to-br from-white to-[#f2eecb] rounded-2xl p-6 border-2 border-transparent group-hover:border-[#00ff4d] transition-all duration-300 h-full shadow-md group-hover:shadow-xl">
                {/* Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  <h3 className="text-xl font-black text-[#0d2a13]">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[#174622] mb-4 leading-relaxed">
                  {step.description}
                </p>

                {/* Tips */}
                <div className="space-y-2">
                  {step.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-2">
                      <div className="mt-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: step.color }}
                        />
                      </div>
                      <p className="text-sm text-[#174622]">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Important Notes */}
      <div className="bg-gradient-to-r from-[#0d2a13] to-[#174622] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-[#00ff4d] flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold mb-2">Important Information</h4>
            <div className="space-y-2 text-sm text-[#f2eecb]">
              <p>
                <strong className="text-white">Expiration:</strong> Check expiry dates before redeeming. Expired coupons cannot be used.
              </p>
              <p>
                <strong className="text-white">One-Time Use:</strong> Each coupon can only be redeemed once. After redemption, the NFT is burned (permanently removed).
              </p>
              <p>
                <strong className="text-white">Ownership:</strong> You own your coupons! You can transfer them to friends or sell them on NFT marketplaces.
              </p>
              <p>
                <strong className="text-white">Blockchain Proof:</strong> All redemptions are recorded on Solana blockchain - transparent and tamper-proof.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-[#174622] mb-4">
          Need help? Our coupons are designed to be simple and secure.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-[#00ff4d] hover:bg-[#00cc3d] text-[#0d2a13] font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Deals
          </a>
        </div>
      </div>
    </div>
  );
}
