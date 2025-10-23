'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Target, Code, Award, ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Import section components
import VideoCarousel from './components/VideoCarousel';
import StickyNavigation from './components/StickyNavigation';
import FloatingCTA from './components/FloatingCTA';
import ProblemSolution from './components/ProblemSolution';
import InnovationShowcase from './components/InnovationShowcase';
import TechStack from './components/TechStack';
import FeaturesMatrix from './components/FeaturesMatrix';
import UXShowcase from './components/UXShowcase';
import ScalabilitySection from './components/ScalabilitySection';
import TeamSection from './components/TeamSection';
import ResourcesHub from './components/ResourcesHub';
import ScreenshotCarousel from './components/ScreenshotCarousel';

export default function PitchDeckPage() {
  const [activeSection, setActiveSection] = useState('hero');

  // Smooth scroll handler
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Scroll to screenshots handler
  const scrollToScreenshots = () => {
    try {
      const element = document.getElementById('screenshots');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Scroll error:', error);
    }
  };

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f2eecb]">
      {/* SEO Metadata handled by metadata export below */}

      {/* Sticky Navigation */}
      <StickyNavigation activeSection={activeSection} />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center px-4 py-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] opacity-95" />

        {/* Ambient Glow Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff4d] rounded-full blur-[120px] opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff4d] rounded-full blur-[120px] opacity-10 animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* MonkeDAO Logo */}
            <motion.img
              src="/monkedao-logo.svg"
              alt="MonkeDAO"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-16 h-16 mb-8 mx-auto"
            />

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-[#f2eecb] mb-6 leading-tight">
              Web3 Deal Discovery
              <br />
              <span className="text-[#00ff4d]">Groupon Meets DeFi</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-[#f2eecb]/80 mb-8 max-w-3xl mx-auto">
              User-owned, borderless marketplace where every coupon is an NFT.
              <br />
              Fully functional, production-ready submission.
            </p>

            {/* Stats Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <StatBadge icon={CheckCircle} label="13/13 Epics Complete" highlight />
              <StatBadge icon={Target} label="95/95 Tasks Delivered" />
              <StatBadge icon={Award} label="95/100 Production Score" />
              <StatBadge icon={Code} label="34 Tests Passing" />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              whileHover={{ scale: 1.1, color: '#00ff4d' }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex flex-col items-center text-[#00ff4d]/60 cursor-pointer hover:text-[#00ff4d]"
              onClick={scrollToScreenshots}
            >
              <span className="text-sm mb-2">See Visual Proof</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>

          {/* Video Demo Carousel - 5 Demo Videos */}
          <motion.div
            id="video"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="scroll-mt-20"
          >
            <VideoCarousel />
          </motion.div>

          {/* Visual Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-4xl mx-auto mt-16 mb-8"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-[#00ff4d]/30 to-transparent" />
          </motion.div>

          {/* Screenshot Gallery - Visual Proof Inside Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8"
          >
            <ScreenshotCarousel />
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <ProblemSolution />

      {/* Innovation Showcase */}
      <InnovationShowcase />

      {/* Technical Stack */}
      <TechStack />

      {/* Features Matrix */}
      <FeaturesMatrix />

      {/* UX Showcase */}
      <UXShowcase />

      {/* Scalability & Feasibility */}
      <ScalabilitySection />

      {/* Team & Process */}
      <TeamSection />

      {/* Resources Hub */}
      <ResourcesHub />

      {/* Floating CTA Buttons */}
      <FloatingCTA />

      {/* Footer */}
      <footer className="bg-[#0d2a13] text-[#f2eecb]/60 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            Built with ❤️ for MonkeDAO Cypherpunk Hackathon 2025
          </p>
          <p className="text-xs mt-2 text-[#00ff4d]">
            Bismillah! Tawfeeq min Allah. 🚀
          </p>
        </div>
      </footer>
    </div>
  );
}

// Stats Badge Component
function StatBadge({
  icon: Icon,
  label,
  highlight = false
}: {
  icon: React.ElementType;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        flex items-center gap-2 px-5 py-3 rounded-full
        backdrop-blur-sm border-2 font-semibold text-sm
        transition-all duration-300 hover:scale-105
        ${highlight
          ? 'bg-[#00ff4d]/20 border-[#00ff4d] text-[#00ff4d]'
          : 'bg-[#f2eecb]/10 border-[#f2eecb]/30 text-[#f2eecb]'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </div>
  );
}

// SEO metadata is handled in layout.tsx
