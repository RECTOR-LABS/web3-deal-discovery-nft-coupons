'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react';

// Video data with YouTube embed IDs
const videos = [
  {
    id: 'JT6OMqcxveI',
    title: 'Merchant Registration Flow',
    description: 'Complete merchant onboarding process with profile setup',
    category: 'Merchant',
  },
  {
    id: 'CH0v4vM9dgI',
    title: 'Free Coupon Claim Flow',
    description: 'User claims FREE coupon, NFT minting to wallet',
    category: 'User',
  },
  {
    id: 'XyHb1V9Shlo',
    title: 'Paid Coupon Purchase Flow',
    description: 'User purchases PAID coupon with SOL, escrow PDA custody',
    category: 'User',
  },
  {
    id: 'Z53dbXadgjY',
    title: 'Resale Marketplace E2E',
    description: 'List for resale + Purchase from escrow (Epic 13)',
    category: 'Marketplace',
  },
  {
    id: 'h_GxmLjRsTc',
    title: 'Merchant Redemption Flow',
    description: 'QR code scan, verification, NFT burn on-chain',
    category: 'Merchant',
  },
];

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  }, []);

  const handleVideoClick = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  }, []);

  const currentVideo = videos[currentIndex];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-[#f2eecb] mb-3">
          Live Demo Videos
        </h3>
        <p className="text-[#f2eecb]/70 text-lg">
          5 comprehensive demonstrations showing every feature
        </p>
      </motion.div>

      {/* Main Video Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-[#0d2a13] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#00ff4d]/30 mb-6"
      >
        {/* Video Info Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0d2a13]/95 to-transparent z-10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#f2eecb] font-bold text-lg">{currentVideo.title}</h4>
              <p className="text-[#f2eecb]/60 text-sm">{currentVideo.description}</p>
            </div>
            <span className="px-3 py-1 bg-[#00ff4d] text-[#0d2a13] text-xs font-bold rounded-full">
              {currentVideo.category}
            </span>
          </div>
        </div>

        {/* YouTube Embed */}
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img
                    src={`https://img.youtube.com/vi/${currentVideo.id}/maxresdefault.jpg`}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 bg-[#00ff4d] rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Play className="w-10 h-10 text-[#0d2a13] ml-1" fill="currentColor" />
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center -translate-y-1/2 pointer-events-none z-20">
          <motion.button
            onClick={handlePrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="pointer-events-auto w-12 h-12 bg-[#00ff4d]/90 hover:bg-[#00ff4d] rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-[#0d2a13]" />
          </motion.button>
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="pointer-events-auto w-12 h-12 bg-[#00ff4d]/90 hover:bg-[#00ff4d] rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6 text-[#0d2a13]" />
          </motion.button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => handleVideoClick(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-12 bg-[#00ff4d]'
                  : 'w-8 bg-[#f2eecb]/30 hover:bg-[#f2eecb]/50'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Video Thumbnail Grid */}
      <div className="grid grid-cols-5 gap-4">
        {videos.map((video, index) => (
          <motion.button
            key={video.id}
            onClick={() => handleVideoClick(index)}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? 'border-[#00ff4d] shadow-lg shadow-[#00ff4d]/50'
                : 'border-[#f2eecb]/20 hover:border-[#00ff4d]/50'
            }`}
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 flex items-center justify-center ${
              index === currentIndex ? 'bg-[#00ff4d]/20' : 'bg-black/40 hover:bg-black/60'
            } transition-all`}>
              {index === currentIndex && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 bg-[#00ff4d] rounded-full flex items-center justify-center"
                >
                  <Play className="w-4 h-4 text-[#0d2a13] ml-0.5" fill="currentColor" />
                </motion.div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d2a13] to-transparent p-2">
              <p className="text-[#f2eecb] text-xs font-semibold truncate">{video.title}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Watch on YouTube Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <a
          href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#f2eecb] hover:text-[#00ff4d] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-sm font-semibold">Watch on YouTube</span>
        </a>
      </motion.div>
    </div>
  );
}
