'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ExternalLink, X } from 'lucide-react';

export default function FloatingPitchDeckButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // Hide on pitch-deck page
  if (pathname === '/pitch-deck') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors cursor-pointer z-10"
            title="Hide button"
          >
            <X className="w-3 h-3" />
          </motion.button>

          {/* Main Button */}
          <Link href="/pitch-deck">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 255, 77, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-2xl backdrop-blur-sm transition-all duration-300 bg-[#00ff4d] text-[#0d2a13] hover:bg-[#00ff4d]/90 cursor-pointer"
            >
              <Rocket className="w-5 h-5" />
              <span className="hidden sm:inline">View Pitch Deck</span>
              <span className="sm:hidden">Pitch Deck</span>
              <ExternalLink className="w-4 h-4" />
            </motion.div>
          </Link>

          {/* Pulsing Glow Effect */}
          <div className="absolute inset-0 bg-[#00ff4d] rounded-full blur-xl opacity-30 animate-pulse pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
