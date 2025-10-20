'use client';

import { motion } from 'framer-motion';
import { Rocket, Github, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function FloatingCTA() {
  const [isExpanded, setIsExpanded] = useState(true);

  const buttons = [
    {
      icon: Rocket,
      label: 'Live Demo',
      href: 'https://dealcoupon.rectorspace.com',
      color: 'bg-[#00ff4d] text-[#0d2a13] hover:bg-[#00ff4d]/90 cursor-pointer',
      external: true,
    },
    {
      icon: Github,
      label: 'GitHub Repo',
      href: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons',
      color: 'bg-[#0d2a13] text-[#00ff4d] hover:bg-[#0d2a13]/90 border-2 border-[#00ff4d] cursor-pointer',
      external: true,
    },
    {
      icon: FileText,
      label: 'Technical Report',
      href: '/technical-writeup.pdf',
      color: 'bg-[#174622] text-[#f2eecb] hover:bg-[#174622]/90 cursor-pointer',
      external: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end"
    >
      {/* Desktop: All buttons visible */}
      <div className="hidden md:flex flex-col gap-3">
        {buttons.map((button, index) => (
          <motion.a
            key={button.label}
            href={button.href}
            target={button.external ? '_blank' : undefined}
            rel={button.external ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-full
              font-semibold shadow-2xl backdrop-blur-sm
              transition-all duration-300
              ${button.color}
            `}
          >
            <button.icon className="w-5 h-5" />
            <span>{button.label}</span>
            {button.external && <ExternalLink className="w-4 h-4" />}
          </motion.a>
        ))}
      </div>

      {/* Mobile: Expandable menu */}
      <div className="md:hidden">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col gap-2 mb-3"
          >
            {buttons.map((button, index) => (
              <motion.a
                key={button.label}
                href={button.href}
                target={button.external ? '_blank' : undefined}
                rel={button.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  text-sm font-semibold shadow-xl backdrop-blur-sm
                  ${button.color}
                `}
              >
                <button.icon className="w-4 h-4" />
                <span className="text-xs">{button.label}</span>
                {button.external && <ExternalLink className="w-3 h-3" />}
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            w-14 h-14 rounded-full bg-[#00ff4d] text-[#0d2a13]
            flex items-center justify-center shadow-2xl
            ml-auto
          "
        >
          {isExpanded ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <Rocket className="w-6 h-6" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
