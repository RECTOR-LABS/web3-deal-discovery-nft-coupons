'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Users,
  Store,
  Link2,
  TestTube,
  Shield,
  Star
} from 'lucide-react';
import Image from 'next/image';

// Screenshot data organized by category
const screenshotCategories = [
  {
    id: 'user-journey',
    label: 'User Journey',
    icon: Users,
    description: 'Browse → Filter → Claim → Redeem',
    screenshots: [
      { src: '/screenshots/user-journey/01-homepage.png', caption: 'Homepage - Guest browsing enabled' },
      { src: '/screenshots/user-journey/02-marketplace.png', caption: 'Marketplace - Full deal catalog' },
      { src: '/screenshots/user-journey/03-search.png', caption: 'Search - Find deals by keyword' },
      { src: '/screenshots/user-journey/04-category-filter.png', caption: 'Category Filter - Food, Travel, Entertainment' },
      { src: '/screenshots/user-journey/05-deal-details.png', caption: 'Deal Details - Reviews, voting, sharing' },
      { src: '/screenshots/user-journey/06-wallet-connected.png', caption: 'Wallet Connected - Phantom/Solflare' },
      { src: '/screenshots/user-journey/07-deal-claim.png', caption: 'Claim Flow - NFT purchase transaction' },
      { src: '/screenshots/user-journey/08-my-coupons.png', caption: 'My Coupons - User\'s claimed NFTs' },
      { src: '/screenshots/user-journey/09-qr-code.png', caption: 'QR Code - Redemption with signature' },
      { src: '/screenshots/user-journey/10-voting.png', caption: 'Social Features - Epic 6 voting system' },
    ],
  },
  {
    id: 'merchant',
    label: 'Merchant Dashboard',
    icon: Store,
    description: 'Register → Create → Analytics → Redeem',
    screenshots: [
      { src: '/screenshots/merchant/01-registration.png', caption: 'Registration - Merchant onboarding' },
      { src: '/screenshots/merchant/02-registration-form.png', caption: 'Registration Form - Profile setup' },
      { src: '/screenshots/merchant/03-dashboard-home.png', caption: 'Dashboard - Merchant control center' },
      { src: '/screenshots/merchant/04-full-dashboard.png', caption: 'Full Dashboard - Analytics & deals' },
      { src: '/screenshots/merchant/05-create-deal.png', caption: 'Create Deal - NFT coupon form' },
      { src: '/screenshots/merchant/06-deal-form-filled.png', caption: 'Deal Form - Completed fields' },
      { src: '/screenshots/merchant/07-deal-preview.png', caption: 'Deal Preview - Before minting' },
      { src: '/screenshots/merchant/08-my-deals.png', caption: 'My Deals - Merchant\'s active coupons' },
      { src: '/screenshots/merchant/09-analytics.png', caption: 'Analytics - Views, claims, revenue' },
      { src: '/screenshots/merchant/10-analytics-success.png', caption: 'Analytics Dashboard - Full metrics' },
      { src: '/screenshots/merchant/11-settings.png', caption: 'Settings - Profile & preferences' },
      { src: '/screenshots/merchant/12-redemption-history.png', caption: 'Redemption History - Epic 10 tracking' },
    ],
  },
  {
    id: 'nft-blockchain',
    label: 'Web3 & NFTs',
    icon: Link2,
    description: 'On-chain proof and smart contracts',
    screenshots: [
      { src: '/screenshots/nft-blockchain/01-nft-minted.png', caption: 'NFT Minted - Coupon created on-chain' },
      { src: '/screenshots/nft-blockchain/02-mint-confirmation.png', caption: 'Mint Confirmation - Transaction success' },
      { src: '/screenshots/nft-blockchain/03-transaction-details.png', caption: 'Transaction Details - Solana Explorer' },
      { src: '/screenshots/nft-blockchain/04-explorer-nft.png', caption: 'Explorer NFT - Metadata on Solana' },
      { src: '/screenshots/nft-blockchain/05-contract-verified.png', caption: 'Smart Contract - Program verified' },
      { src: '/screenshots/nft-blockchain/06-deployment.png', caption: 'Deployment - Vanity address creation' },
      { src: '/screenshots/nft-blockchain/07-wallet-adapter.png', caption: 'Wallet Adapter - Phantom/Solflare selection' },
    ],
  },
  {
    id: 'testing',
    label: 'Testing Evidence',
    icon: TestTube,
    description: 'Quality assurance - M-01 through M-10',
    screenshots: [
      { src: '/screenshots/testing/01-m01-auth.png', caption: 'M-01: Authentication required validation' },
      { src: '/screenshots/testing/02-m01-form.png', caption: 'M-01: Registration form testing' },
      { src: '/screenshots/testing/03-m02-dashboard.png', caption: 'M-02: Dashboard access test' },
      { src: '/screenshots/testing/04-m03-deal-creation.png', caption: 'M-03: Deal creation flow test' },
      { src: '/screenshots/testing/05-m03-nft-mint.png', caption: 'M-03: NFT minting test' },
      { src: '/screenshots/testing/06-m04-my-deals.png', caption: 'M-04: My Deals display test' },
      { src: '/screenshots/testing/07-m05-analytics.png', caption: 'M-05: Analytics dashboard test' },
      { src: '/screenshots/testing/08-m06-settings.png', caption: 'M-06: Settings update test' },
      { src: '/screenshots/testing/09-m08-qr.png', caption: 'M-08: QR code generation test' },
      { src: '/screenshots/testing/10-m10-redemptions.png', caption: 'M-10: Redemption history test' },
    ],
  },
  {
    id: 'auth-ux',
    label: 'Auth & UX',
    icon: Shield,
    description: 'Web3 abstraction and user experience',
    screenshots: [
      { src: '/screenshots/auth-ux/01-homepage-overview.png', caption: 'Homepage - Complete overview' },
      { src: '/screenshots/auth-ux/02-post-signin.png', caption: 'Post-Signin - Authenticated state' },
      { src: '/screenshots/auth-ux/03-auth-redirect.png', caption: 'Auth Redirect - Protected routes' },
      { src: '/screenshots/auth-ux/04-deal-modal.png', caption: 'Deal Modal - Preview popup' },
      { src: '/screenshots/auth-ux/05-loading-state.png', caption: 'Loading State - Skeleton UI' },
    ],
  },
  {
    id: 'highlights',
    label: 'Highlights',
    icon: Star,
    description: 'Best screenshots showcasing completeness',
    screenshots: [
      { src: '/screenshots/highlights/01-stunning-homepage.png', caption: 'Stunning Homepage - Groupon-style marketplace' },
      { src: '/screenshots/highlights/02-merchant-ui.png', caption: 'Merchant UI - Complete dashboard' },
      { src: '/screenshots/highlights/03-full-marketplace.png', caption: 'Full Marketplace - Browse & filter' },
      { src: '/screenshots/highlights/04-blockchain-proof.png', caption: 'Blockchain Proof - Smart contract verified' },
      { src: '/screenshots/highlights/05-redemption-flow.png', caption: 'Redemption Flow - QR code generation' },
      { src: '/screenshots/highlights/06-social-features.png', caption: 'Social Features - Epic 6 voting' },
    ],
  },
];

export default function ScreenshotCarousel() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  const currentCategory = screenshotCategories[activeTab];
  const totalSlides = currentCategory.screenshots.length;

  // Navigation callbacks (defined before useEffect that uses them)
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  }, [totalSlides]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  }, [totalSlides]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, activeTab]);

  // Reset index when changing tabs
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false);
        return;
      }

      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  const openLightbox = (src: string) => {
    setLightboxImage(src);
    setLightboxOpen(true);
    setIsAutoPlaying(false);
  };

  return (
    <section id="screenshots" className="py-0 px-0">
      <div className="max-w-7xl mx-auto">
        {/* Simplified Header - No redundant headline since we're inside hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-base text-[#f2eecb]/70 mb-6">
            <span className="text-[#00ff4d] font-semibold">39 Production Screenshots</span> · Browse all 10 Epics below
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {screenshotCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(idx)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                  transition-all duration-300 hover:scale-105 cursor-pointer
                  ${
                    activeTab === idx
                      ? 'bg-[#00ff4d] text-[#0d2a13] shadow-lg shadow-[#00ff4d]/30'
                      : 'bg-[#f2eecb]/10 text-[#f2eecb] border-2 border-[#f2eecb]/30 hover:bg-[#f2eecb]/20'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                <span className="text-xs opacity-70">({category.screenshots.length})</span>
              </button>
            );
          })}
        </div>

        {/* Category Description */}
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-[#f2eecb]/60 mb-8"
        >
          {currentCategory.description}
        </motion.p>

        {/* Carousel Container */}
        <div className="relative bg-[#0d2a13]/50 rounded-xl p-6 backdrop-blur-sm border-2 border-[#00ff4d]/20">
          {/* Main Screenshot Display */}
          <div className="relative aspect-video bg-[#0d2a13] rounded-lg overflow-hidden mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full cursor-pointer group"
                onClick={() => openLightbox(currentCategory.screenshots[currentIndex].src)}
              >
                <Image
                  src={currentCategory.screenshots[currentIndex].src}
                  alt={currentCategory.screenshots[currentIndex].caption}
                  fill
                  className="object-contain"
                  priority
                />
                {/* Expand Icon Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <Maximize2 className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#00ff4d]/90 hover:bg-[#00ff4d] text-[#0d2a13] p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#00ff4d]/90 hover:bg-[#00ff4d] text-[#0d2a13] p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption */}
          <motion.p
            key={`caption-${activeTab}-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center text-[#f2eecb] mb-6 text-lg"
          >
            {currentCategory.screenshots[currentIndex].caption}
          </motion.p>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mb-4">
            {currentCategory.screenshots.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsAutoPlaying(false);
                }}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer
                  ${
                    idx === currentIndex
                      ? 'bg-[#00ff4d] w-8'
                      : 'bg-[#f2eecb]/30 hover:bg-[#f2eecb]/50'
                  }
                `}
                aria-label={`Go to screenshot ${idx + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="text-center">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-[#f2eecb]/60 hover:text-[#00ff4d] transition-colors cursor-pointer"
            >
              {isAutoPlaying ? '⏸ Pause' : '▶ Auto-play'} ({currentIndex + 1}/{totalSlides})
            </button>
          </div>
        </div>

        {/* Thumbnail Strip (Mobile Hidden) */}
        <div className="hidden lg:flex gap-3 mt-6 overflow-x-auto pb-4">
          {currentCategory.screenshots.map((screenshot, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={`
                relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer
                ${
                  idx === currentIndex
                    ? 'border-[#00ff4d] shadow-lg shadow-[#00ff4d]/30 scale-105'
                    : 'border-[#f2eecb]/20 hover:border-[#f2eecb]/50 opacity-60 hover:opacity-100'
                }
              `}
            >
              <Image
                src={screenshot.src}
                alt={screenshot.caption}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt="Full size screenshot"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
