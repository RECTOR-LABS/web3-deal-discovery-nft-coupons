'use client';

import { motion } from 'framer-motion';
import { Rocket, Github, Youtube, FileText, Book, Shield, ExternalLink, MessageCircle } from 'lucide-react';

export default function ResourcesHub() {
  const primaryLinks = [
    {
      icon: Rocket,
      label: 'Live Demo',
      url: 'https://dealcoupon.rectorspace.com',
      description: 'Try the production application',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Github,
      label: 'GitHub Repository',
      url: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons',
      description: 'Source code & documentation',
      color: 'from-gray-700 to-gray-900',
    },
    {
      icon: Youtube,
      label: 'Demo Video',
      url: 'https://youtube.com/watch?v=demo', // Replace with actual video
      description: '3-5 minute walkthrough',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: FileText,
      label: 'Technical Write-up',
      url: '/technical-writeup.pdf',
      description: '2-4 page technical document',
      color: 'from-blue-500 to-blue-600',
    },
  ];

  const documentation = [
    { name: 'README.md', description: 'Project overview', url: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/blob/main/README.md' },
    { name: 'CLAUDE.md', description: 'Development context', url: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/blob/main/CLAUDE.md' },
    { name: 'API Documentation', description: 'Endpoints reference', url: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/tree/main/docs/api' },
    { name: 'Manual Testing Guide', description: '27 user tests', url: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/blob/main/docs/testing/MANUAL-TESTING-GUIDE-LOGGED-IN.md' },
    { name: 'Merchant Testing Guide', description: '10 merchant tests', url: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/blob/main/docs/testing/MERCHANT-TESTING-GUIDE.md' },
    { name: 'Audit Reports', description: 'Epic 1-10 audits', url: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/tree/main/docs/audits' },
  ];

  const blockchain = [
    {
      name: 'Program Address',
      value: 'RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7',
      url: 'https://explorer.solana.com/address/RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7?cluster=devnet',
    },
    {
      name: 'Example NFT Mint',
      value: '5iyFVpW...3Dr9Dz9u',
      url: 'https://explorer.solana.com/tx/5iyFVpW4YUR4VcZmgCVfVRtJfPCXzMSpEpvXQd4yjSSnveQ1XeuyqiXrRW3WUtREdhmpPQkAyvaBhxWW3Dr9Dz9u?cluster=devnet',
    },
    {
      name: 'NFT Mint Address',
      value: '9e6QS6J...GwjhZv',
      url: 'https://explorer.solana.com/address/9e6QS6JVbKHhnhRgtfUdpd9cDo6htL3j4rNRzuGwjhZv?cluster=devnet',
    },
    {
      name: 'Redeem Instruction',
      value: 'View smart contract code',
      url: 'https://github.com/RECTOR-LABS/web3-deal-discovery-nft-coupons/blob/main/src/contracts/programs/nft_coupon/src/instructions/redeem_coupon.rs',
    },
  ];

  const contact = [
    { icon: Github, label: 'GitHub', value: '@rz1989s', url: 'https://github.com/rz1989s' },
    { icon: MessageCircle, label: 'Telegram', value: '@RZ1989sol', url: 'https://t.me/RZ1989sol' },
  ];

  return (
    <section id="resources" className="py-20 px-4 bg-[#f2eecb] scroll-mt-20">
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
            Resources Hub
          </h2>
          <p className="text-xl text-[#0d2a13]/70 max-w-3xl mx-auto">
            Everything you need to evaluate our submission
          </p>
        </motion.div>

        {/* Primary Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {primaryLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d2a13]/10 hover:border-[#00ff4d]/50 transition-all duration-300 cursor-pointer"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${link.color} mb-4`}>
                <link.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0d2a13] mb-2 flex items-center gap-2">
                {link.label}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-[#0d2a13]/70">{link.description}</p>
            </motion.a>
          ))}
        </div>

        {/* Documentation Links */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            <Book className="w-8 h-8 inline-block mr-2" />
            Documentation
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentation.map((doc, index) => (
              <motion.a
                key={doc.name}
                href={doc.url}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow border border-[#0d2a13]/10 hover:border-[#00ff4d]/50 transition-all group"
              >
                <div>
                  <h4 className="font-semibold text-[#0d2a13] group-hover:text-[#00ff4d] transition-colors">{doc.name}</h4>
                  <p className="text-xs text-[#0d2a13]/60">{doc.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#0d2a13]/40 group-hover:text-[#00ff4d] transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Blockchain Verification */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            <Shield className="w-8 h-8 inline-block mr-2" />
            Blockchain Verification
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 shadow-lg border-2 border-[#0d2a13]/10"
          >
            <div className="space-y-4">
              {blockchain.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#0d2a13] mb-1">{item.name}</h4>
                      <code className="text-xs text-[#0d2a13]/70 bg-gray-100 px-2 py-1 rounded">
                        {item.value}
                      </code>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#00ff4d] hover:text-[#00ff4d]/80 transition-colors text-sm font-medium"
                    >
                      View <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact & Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-[#0d2a13] text-center mb-12">
            Contact & Support
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {contact.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d2a13]/10 hover:border-[#00ff4d]/50 transition-all text-center"
              >
                <div className="inline-flex p-4 bg-[#00ff4d]/20 rounded-xl mb-4">
                  <item.icon className="w-6 h-6 text-[#0d2a13]" />
                </div>
                <h4 className="font-bold text-[#0d2a13] mb-2">{item.label}</h4>
                <p className="text-sm text-[#0d2a13]/70">{item.value}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
