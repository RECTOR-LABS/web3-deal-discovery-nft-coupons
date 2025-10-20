'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Camera,
  CheckCircle,
  Shield,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export default function InteractiveRedemptionGuide() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Customer Shows QR Code',
      description: 'Customer opens their claimed coupon in the DealCoupon app and generates a unique QR code',
      icon: Smartphone,
      color: '#3b82f6',
      details: [
        'Customer navigates to "My Coupons" section',
        'Selects the deal they want to redeem',
        'Taps "Generate QR Code" button',
        'QR code appears on their phone screen',
      ],
      animation: 'phone-shake',
    },
    {
      title: 'You Scan the QR Code',
      description: 'Use your merchant dashboard scanner to scan the customer\'s QR code',
      icon: Camera,
      color: '#10b981',
      details: [
        'Open your Merchant Dashboard',
        'Navigate to "Redeem Coupon" page',
        'Click "Scan QR Code" button',
        'Point your device camera at customer\'s QR code',
      ],
      animation: 'scan-pulse',
    },
    {
      title: 'System Verifies On-Chain',
      description: 'Blockchain automatically verifies NFT ownership and coupon validity',
      icon: Shield,
      color: '#8b5cf6',
      details: [
        'System checks NFT exists on Solana blockchain',
        'Verifies customer owns the NFT coupon',
        'Confirms coupon hasn\'t expired',
        'Ensures coupon hasn\'t been used before',
      ],
      animation: 'shield-glow',
    },
    {
      title: 'Coupon is Burned',
      description: 'NFT is permanently burned on-chain to prevent reuse',
      icon: QrCode,
      color: '#f59e0b',
      details: [
        'Smart contract executes burn function',
        'NFT is removed from customer\'s wallet',
        'Transaction recorded on Solana blockchain',
        'Permanent proof of redemption created',
      ],
      animation: 'burn-fade',
    },
    {
      title: 'Discount Applied!',
      description: 'Customer receives their discount and you process the transaction',
      icon: CheckCircle,
      color: '#00ff4d',
      details: [
        'Dashboard shows redemption success',
        'Discount amount is displayed',
        'Customer receives confirmation',
        'You provide the service/product at discounted price',
      ],
      animation: 'success-bounce',
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff4d] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00ff4d] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00ff4d] text-[#0d2a13] px-4 py-2 rounded-full font-bold mb-4">
            <Sparkles className="w-5 h-5" />
            Interactive Guide
          </div>
          <h3 className="text-3xl font-black text-white mb-2">
            How Redemption Works
          </h3>
          <p className="text-[#f2eecb] text-lg">
            Step-by-step guide to redeeming NFT coupons
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all cursor-pointer ${
                    index === currentStep
                      ? 'bg-[#00ff4d] text-[#0d2a13] scale-110 shadow-lg'
                      : index < currentStep
                      ? 'bg-[#00ff4d]/30 text-white'
                      : 'bg-white/20 text-white/50'
                  }`}
                >
                  {index + 1}
                </button>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#00ff4d]"
                      initial={{ width: '0%' }}
                      animate={{ width: index < currentStep ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-[#00ff4d]/30 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Icon & Title */}
              <div className="flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{
                    scale: currentStepData.animation === 'phone-shake' ? [1, 1.05, 1] :
                          currentStepData.animation === 'scan-pulse' ? [1, 1.1, 1] :
                          currentStepData.animation === 'shield-glow' ? [1, 1.05, 1] :
                          currentStepData.animation === 'burn-fade' ? [1, 0.95, 1] :
                          [1, 1.15, 1],
                    rotate: currentStepData.animation === 'phone-shake' ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeInOut',
                  }}
                  className="mb-6"
                >
                  <div
                    className="w-32 h-32 rounded-2xl flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: currentStepData.color }}
                  >
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                </motion.div>

                <h4 className="text-2xl font-black text-white mb-3">
                  Step {currentStep + 1}: {currentStepData.title}
                </h4>
                <p className="text-[#f2eecb] text-lg">
                  {currentStepData.description}
                </p>
              </div>

              {/* Right: Details List */}
              <div className="space-y-3">
                <h5 className="text-white font-bold text-lg mb-4">What Happens:</h5>
                {currentStepData.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/10"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[#0d2a13] text-sm"
                      style={{ backgroundColor: currentStepData.color }}
                    >
                      {index + 1}
                    </div>
                    <p className="text-[#f2eecb] leading-relaxed">{detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              currentStep === 0
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-white font-semibold">
            {currentStep + 1} / {steps.length}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              currentStep === steps.length - 1
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-[#00ff4d] text-[#0d2a13] hover:bg-[#00cc3d] cursor-pointer shadow-lg'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-[#00ff4d]/10 border border-[#00ff4d]/30 rounded-xl p-6">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#00ff4d]" />
            Quick Tips
          </h4>
          <ul className="space-y-2 text-[#f2eecb] text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#00ff4d] mt-1">•</span>
              <span>Redemption happens in real-time with instant blockchain verification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00ff4d] mt-1">•</span>
              <span>Each coupon can only be redeemed once - NFT burn prevents fraud</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00ff4d] mt-1">•</span>
              <span>All redemptions are recorded on-chain for transparent analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00ff4d] mt-1">•</span>
              <span>No manual tracking needed - system handles everything automatically</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
