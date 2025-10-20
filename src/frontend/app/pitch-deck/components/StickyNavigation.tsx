'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

interface StickyNavigationProps {
  activeSection: string;
}

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'innovation', label: 'Innovation' },
  { id: 'tech', label: 'Tech Stack' },
  { id: 'features', label: 'Features' },
  { id: 'ux', label: 'UX' },
  { id: 'scalability', label: 'Scalability' },
  { id: 'team', label: 'Team' },
  { id: 'resources', label: 'Resources' },
];

export default function StickyNavigation({ activeSection }: StickyNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky nav height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sticky Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0d2a13]/95 backdrop-blur-md border-b border-[#00ff4d]/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-[#f2eecb] font-bold text-xl cursor-pointer"
              >
                <img src="/dealcoupon-logo.svg" alt="DealCoupon" className="w-10 h-10" />
                <span className="hidden sm:inline">DealCoupon</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer
                    ${activeSection === section.id
                      ? 'bg-[#00ff4d] text-[#0d2a13]'
                      : 'text-[#f2eecb]/80 hover:text-[#00ff4d] hover:bg-[#00ff4d]/10'
                    }
                  `}
                >
                  {section.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[#f2eecb] p-2 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-[#0d2a13]/98 backdrop-blur-lg border-b border-[#00ff4d]/20 lg:hidden overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 cursor-pointer
                    ${activeSection === section.id
                      ? 'bg-[#00ff4d] text-[#0d2a13]'
                      : 'text-[#f2eecb]/80 hover:text-[#00ff4d] hover:bg-[#00ff4d]/10'
                    }
                  `}
                >
                  {section.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from being hidden under nav */}
      <div className="h-[72px]" />
    </>
  );
}
