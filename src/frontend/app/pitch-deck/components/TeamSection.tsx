'use client';

import { motion } from 'framer-motion';
import { Code, Rocket, CheckCircle, Calendar, GitBranch, TestTube } from 'lucide-react';

export default function TeamSection() {
  const timeline = [
    { day: '1-2', phase: 'Planning', tasks: 'PRD, TIMELINE, TRACK-REQUIREMENTS' },
    { day: '3-5', phase: 'Epic 1-3', tasks: 'NFT Coupons, Merchant Dashboard, User Marketplace' },
    { day: '6-8', phase: 'Epic 4-6', tasks: 'Redemption, Aggregator, Social Layer' },
    { day: '9-11', phase: 'Epic 7-9', tasks: 'Web3 Abstraction, Staking, Loyalty' },
    { day: '12-13', phase: 'Epic 10', tasks: 'Geo Discovery' },
    { day: '14', phase: 'Testing', tasks: 'Merchant testing (M-08 through M-10)' },
    { day: '15', phase: 'Epic 11 Prep', tasks: 'Pitch deck, deployment planning' },
  ];

  const gitWorkflow = [
    'Feature branches (epic-X-feature-name)',
    'Conventional commits (feat/fix/docs/refactor)',
    'Pull request self-reviews',
    'Main branch protection',
  ];

  const testing = [
    { type: 'Unit tests', status: 'Jest + React Testing Library', count: '3 passing' },
    { type: 'Manual QA', status: '27 user tests + 10 merchant tests', count: '37 passing' },
    { type: 'E2E', status: 'Playwright MCP + Supabase MCP', count: '2 passing' },
    { type: 'Self-audits', status: 'Documented (docs/audits/)', count: '10 reports' },
  ];

  const codeReview = [
    'Self-audits documented',
    'Code quality scores (85-90/100)',
    'Issue tracking (GitHub issues)',
    'Continuous improvement',
  ];

  return (
    <section id="team" className="py-20 px-4 bg-gradient-to-br from-[#0d2a13] to-[#174622] scroll-mt-20">
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
            Team & Development Process
          </h2>
          <p className="text-xl text-[#f2eecb]/70 max-w-3xl mx-auto">
            Built with excellence and systematic execution
          </p>
        </motion.div>

        {/* Developer Profile - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          className="bg-gradient-to-br from-[#f2eecb]/10 via-[#00ff4d]/5 to-[#f2eecb]/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]/40 shadow-2xl mb-20 max-w-4xl mx-auto relative overflow-hidden"
        >
          {/* Ambient Glow Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-[#00ff4d]/10 via-transparent to-transparent opacity-50 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Profile Picture */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#00ff4d] rounded-2xl blur-xl opacity-30 animate-pulse" />
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-[#00ff4d]/50 shadow-2xl">
                <img
                  src="/rector.png"
                  alt="RECTOR"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online Badge */}
              <div className="absolute -bottom-2 -right-2 bg-[#00ff4d] rounded-full p-2 border-4 border-[#0d2a13] shadow-lg">
                <Rocket className="w-5 h-5 text-[#0d2a13]" />
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-black text-[#f2eecb] mb-2 tracking-tight"
              >
                RECTOR
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 bg-[#00ff4d]/20 px-4 py-2 rounded-full mb-6 border border-[#00ff4d]/30"
              >
                <Code className="w-4 h-4 text-[#00ff4d]" />
                <p className="text-lg font-semibold text-[#00ff4d]">Senior Full-Stack Developer</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="grid gap-3 text-[#f2eecb]/90"
              >
                <motion.div
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="flex items-start gap-3 bg-[#0d2a13]/30 p-3 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                  <p className="text-sm"><span className="font-bold text-[#f2eecb]">Skills:</span> Blockchain (Solana/Anchor), Full-Stack (Next.js/React), DevOps (Docker/Vercel)</p>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="flex items-start gap-3 bg-[#0d2a13]/30 p-3 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                  <p className="text-sm"><span className="font-bold text-[#f2eecb]">Location:</span> Global (Remote)</p>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="flex items-start gap-3 bg-[#0d2a13]/30 p-3 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                  <p className="text-sm"><span className="font-bold text-[#f2eecb]">Approach:</span> 100% working standard, production-first mindset</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff4d]/10 rounded-bl-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00ff4d]/10 rounded-tr-full blur-2xl" />
        </motion.div>

        {/* Development Timeline */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#f2eecb] text-center mb-12">
            <Calendar className="w-8 h-8 inline-block mr-2" />
            15-Day Development Sprint
          </h3>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-xl p-6 border border-[#00ff4d]/30 grid md:grid-cols-3 gap-4"
              >
                <div className="font-bold text-[#00ff4d] text-lg">Day {item.day}</div>
                <div className="font-semibold text-[#f2eecb]">{item.phase}</div>
                <div className="text-[#f2eecb]/70">{item.tasks}</div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-[#f2eecb] text-lg">
              <Rocket className="w-5 h-5 inline-block mr-2" />
              <span className="font-semibold">Methodology:</span> Agile (Epic → Story → Task)
            </p>
            <p className="text-[#f2eecb]/70 mt-2">
              Comprehensive documentation: PRD, execution plans, audit reports
            </p>
          </motion.div>
        </div>

        {/* Code Quality Practices */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <GitBranch className="w-8 h-8 text-[#00ff4d]" />
              <h3 className="text-2xl font-bold text-[#f2eecb]">Git Workflow</h3>
            </div>
            <ul className="space-y-3">
              {gitWorkflow.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-[#f2eecb]/80">
                  <CheckCircle className="w-5 h-5 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <TestTube className="w-8 h-8 text-[#00ff4d]" />
              <h3 className="text-2xl font-bold text-[#f2eecb]">Testing</h3>
            </div>
            <div className="space-y-3">
              {testing.map((item, index) => (
                <div key={index} className="bg-[#0d2a13]/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#f2eecb] text-sm">{item.type}</span>
                    <span className="text-[#00ff4d] text-xs font-bold">{item.count}</span>
                  </div>
                  <p className="text-xs text-[#f2eecb]/70">{item.status}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#f2eecb]/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff4d]/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-8 h-8 text-[#00ff4d]" />
              <h3 className="text-2xl font-bold text-[#f2eecb]">Code Review</h3>
            </div>
            <ul className="space-y-3">
              {codeReview.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-[#f2eecb]/80">
                  <CheckCircle className="w-5 h-5 text-[#00ff4d] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
