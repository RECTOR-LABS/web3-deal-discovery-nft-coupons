'use client';

import { motion } from 'framer-motion';
import { Eye, Users, Smartphone, Palette, ArrowRight, CheckCircle } from 'lucide-react';

export default function UXShowcase() {
  const uxPillars = [
    {
      icon: Eye,
      title: 'Web3 Invisible',
      description: 'Zero crypto jargon in the interface',
      features: [
        '"Coupon" not "NFT"',
        'Wallet connection = "Connect"',
        'Email/social login fallback',
        'Feels like Groupon',
      ],
    },
    {
      icon: Users,
      title: 'Guest Browsing',
      description: 'Browse first, login when needed',
      features: [
        'Groupon-style marketplace',
        'Search without authentication',
        'Login prompt only when claiming',
        'Lower barrier to entry',
      ],
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Optimized for all devices',
      features: [
        'Responsive Tailwind breakpoints',
        'Touch-optimized interactions',
        'QR scanner camera-ready',
        '320px → 1920px support',
      ],
    },
    {
      icon: Palette,
      title: 'MonkeDAO Branding',
      description: 'Consistent visual identity',
      features: [
        'Forest green (#0d2a13)',
        'Neon accent (#00ff4d)',
        'Jungle-themed elements',
        'Professional polish',
      ],
    },
  ];

  const userFlow = [
    {
      step: 1,
      title: 'Browse',
      description: 'Explore marketplace without login',
    },
    {
      step: 2,
      title: 'Filter',
      description: 'Search by category/location',
    },
    {
      step: 3,
      title: 'Claim',
      description: 'Connect wallet to claim deal',
    },
    {
      step: 4,
      title: 'Redeem',
      description: 'Generate QR & present to merchant',
    },
  ];

  const merchantFlow = [
    {
      step: 1,
      title: 'Register',
      description: 'Connect wallet & create profile',
    },
    {
      step: 2,
      title: 'Create Deal',
      description: 'Upload image, set discount/expiry',
    },
    {
      step: 3,
      title: 'Monitor',
      description: 'View analytics dashboard',
    },
    {
      step: 4,
      title: 'Redeem',
      description: 'Scan customer QR to burn NFT',
    },
  ];

  const wcagCompliance = [
    { item: 'Semantic HTML', checked: true },
    { item: 'Keyboard navigation', checked: true },
    { item: 'Alt text for images', checked: true },
    { item: 'ARIA labels', checked: true },
  ];

  const performanceMetrics = [
    { metric: 'Vercel Speed Insights', value: 'Integrated ✅' },
    { metric: 'Bundle size optimized', value: '<250KB initial' },
    { metric: 'Lazy loading images', value: 'Enabled ✅' },
    { metric: 'YouTube Lite embed', value: 'Saves bandwidth ✅' },
  ];

  return (
    <section id="ux" className="py-20 px-4 bg-gradient-to-br from-[#0d2a13] to-[#174622] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#f2eecb] mb-4">
            User Experience & Design
          </h2>
          <p className="text-xl text-[#f2eecb]/70 max-w-3xl mx-auto">
            Web3 power with Web2 simplicity
          </p>
        </motion.div>

        {/* UX Pillars */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {uxPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]/30 hover:border-[#00ff4d] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#00ff4d]/20 rounded-xl">
                  <pillar.icon className="w-8 h-8 text-[#00ff4d]" />
                </div>
                <h3 className="text-2xl font-bold text-[#f2eecb]">{pillar.title}</h3>
              </div>
              <p className="text-[#f2eecb]/80 mb-4">{pillar.description}</p>
              <ul className="space-y-2">
                {pillar.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#f2eecb]/70">
                    <CheckCircle className="w-4 h-4 text-[#00ff4d] flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* User Flow */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#f2eecb] text-center mb-12">
            User Journey
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {userFlow.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Arrow connector */}
                {index < userFlow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-[#00ff4d]" />
                  </div>
                )}
                <div className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-xl p-6 border border-[#00ff4d]/30 text-center">
                  <div className="w-12 h-12 bg-[#00ff4d] text-[#0d2a13] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold text-[#f2eecb] mb-2">{item.title}</h4>
                  <p className="text-sm text-[#f2eecb]/70">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Merchant Flow */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#f2eecb] text-center mb-12">
            Merchant Journey
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {merchantFlow.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < merchantFlow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-[#00ff4d]" />
                  </div>
                )}
                <div className="bg-[#00ff4d]/10 backdrop-blur-sm rounded-xl p-6 border border-[#00ff4d] text-center">
                  <div className="w-12 h-12 bg-[#f2eecb] text-[#0d2a13] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold text-[#f2eecb] mb-2">{item.title}</h4>
                  <p className="text-sm text-[#f2eecb]/70">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Accessibility & Performance */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]/30"
          >
            <h3 className="text-2xl font-bold text-[#f2eecb] mb-6">WCAG Compliance</h3>
            <div className="space-y-3">
              {wcagCompliance.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-[#00ff4d]" />
                  <span className="text-[#f2eecb]">{item.item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]/30"
          >
            <h3 className="text-2xl font-bold text-[#f2eecb] mb-6">Performance</h3>
            <div className="space-y-3">
              {performanceMetrics.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-[#f2eecb]/80">{item.metric}</span>
                  <span className="text-[#00ff4d] font-semibold">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
