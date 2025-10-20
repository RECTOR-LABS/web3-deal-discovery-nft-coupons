'use client';

import { motion } from 'framer-motion';
import { Server, Database, Zap, Globe, CheckCircle, AlertCircle } from 'lucide-react';

export default function ScalabilitySection() {
  const infrastructure = [
    { component: 'Frontend', provider: 'Vercel (Next.js 15, edge functions)', icon: Globe },
    { component: 'Database', provider: 'Supabase PostgreSQL (us-east-1)', icon: Database },
    { component: 'Blockchain', provider: 'Solana Devnet (mainnet ready)', icon: Zap },
    { component: 'Storage', provider: 'Arweave (production-ready) + Supabase fallback', icon: Server },
  ];

  const monitoring = [
    { tool: 'Sentry', purpose: 'Error tracking (client/server/edge)' },
    { tool: 'Vercel Analytics', purpose: 'Usage metrics' },
    { tool: 'Speed Insights', purpose: 'Core Web Vitals' },
    { tool: 'Health checks', purpose: '/api/health endpoint' },
  ];

  const security = [
    'CORS headers (configurable origins)',
    'Rate limiting (3 tiers: strict/moderate/lenient)',
    'Security headers (X-Frame-Options, CSP, etc.)',
    'Input validation (Zod schemas)',
  ];

  const devops = [
    'Docker support (multi-stage build)',
    'Database backups (automated + manual)',
    'Git hooks (Husky + lint-staged)',
    'Bundle analyzer (performance optimization)',
  ];

  const dbOptimizations = [
    'Indexed columns (merchant_id, deal_id, user_wallet)',
    'Views for common queries (merchants_with_location)',
    'Functions for calculations (calculate_distance_miles)',
    'Connection pooling (Supabase default)',
  ];

  const rpcStrategy = [
    { env: 'Development', provider: 'Solana devnet RPC' },
    { env: 'Production', provider: 'Helius/QuickNode (100K requests/day)' },
    { env: 'Fallback', provider: 'Retry logic + backup endpoints' },
  ];

  const apis = [
    {
      name: 'RapidAPI (Get Promo Codes)',
      status: '✅ Live',
      details: ['1M+ coupons, 10K+ merchants', '1-hour cache (Redis/Vercel KV)', 'Mock fallback', '"Partner Deal" badges'],
    },
    {
      name: 'Arweave (Permanent Storage)',
      status: '✅ Architecture Ready',
      details: ['Production-ready (server-side API)', 'Requires mainnet AR tokens (~$5-10)', '100% Supabase fallback working', 'Wallet: sY6VBEWpDPmN6oL9Zt_8KjJMR1PWexpmWKEAojtbwsc'],
      note: 'See docs/ARWEAVE-INTEGRATION-NOTE.md',
    },
    {
      name: 'MoonPay Commerce (Payments)',
      status: '✅ Configured',
      details: ['8 paylinks ($1, $2, $5, $10, $15, $20, $25, $50)', 'Solana USDC payments', '@heliofi/checkout-react widget', 'Test page: /test-payment'],
    },
  ];

  return (
    <section id="scalability" className="py-20 px-4 bg-[#f2eecb] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d2a13] mb-4">
            Feasibility & Scalability
          </h2>
          <p className="text-xl text-[#0d2a13]/70 max-w-3xl mx-auto">
            Production-ready infrastructure built for growth
          </p>
        </motion.div>

        {/* Deployed Infrastructure */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Deployed Infrastructure
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {infrastructure.map((item, index) => (
              <motion.div
                key={item.component}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d2a13]/10 flex items-start gap-4"
              >
                <div className="p-3 bg-[#00ff4d]/20 rounded-xl">
                  <item.icon className="w-6 h-6 text-[#0d2a13]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0d2a13] mb-1">{item.component}</h4>
                  <p className="text-sm text-[#0d2a13]/70">{item.provider}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Monitoring Stack */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border-2 border-[#0d2a13]/10"
          >
            <h3 className="text-2xl font-bold text-[#0d2a13] mb-6">Monitoring Stack</h3>
            <ul className="space-y-3">
              {monitoring.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[#0d2a13]">{item.tool}:</span>
                    <span className="text-[#0d2a13]/70"> {item.purpose}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg border-2 border-[#0d2a13]/10"
          >
            <h3 className="text-2xl font-bold text-[#0d2a13] mb-6">Security Measures</h3>
            <ul className="space-y-3">
              {security.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-[#0d2a13]/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Scalability Design */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Scalability Strategy
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d2a13]/10"
            >
              <h4 className="font-bold text-[#0d2a13] mb-4">Database Optimization</h4>
              <ul className="space-y-2">
                {dbOptimizations.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[#0d2a13]/70">
                    <div className="w-1.5 h-1.5 bg-[#00ff4d] rounded-full mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d2a13]/10"
            >
              <h4 className="font-bold text-[#0d2a13] mb-4">RPC Provider Strategy</h4>
              <div className="space-y-3">
                {rpcStrategy.map((item, index) => (
                  <div key={index} className="bg-[#00ff4d]/10 rounded-lg p-3">
                    <span className="font-semibold text-[#0d2a13] text-sm">{item.env}:</span>
                    <p className="text-xs text-[#0d2a13]/70 mt-1">{item.provider}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d2a13]/10"
            >
              <h4 className="font-bold text-[#0d2a13] mb-4">DevOps Practices</h4>
              <ul className="space-y-2">
                {devops.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[#0d2a13]/70">
                    <CheckCircle className="w-4 h-4 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Real API Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Real API Integrations
          </h3>
          <div className="space-y-6">
            {apis.map((api, index) => (
              <motion.div
                key={api.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#0d2a13]/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-[#0d2a13]">{api.name}</h4>
                  <span className="text-sm font-bold text-[#00ff4d] bg-[#00ff4d]/10 px-4 py-1 rounded-full">
                    {api.status}
                  </span>
                </div>
                <ul className="grid md:grid-cols-2 gap-3 mb-3">
                  {api.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#0d2a13]/70">
                      <CheckCircle className="w-4 h-4 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
                {api.note && (
                  <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3 mt-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Note for Judges:</span> {api.note}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
