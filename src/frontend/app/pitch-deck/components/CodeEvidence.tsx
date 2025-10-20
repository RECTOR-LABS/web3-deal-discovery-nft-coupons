'use client';

import { motion } from 'framer-motion';
import { FileCode, Folder } from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  type: 'contract' | 'frontend' | 'api' | 'lib' | 'config';
}

interface CodeEvidenceProps {
  title?: string;
  files: CodeFile[];
}

const typeColors = {
  contract: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
  frontend: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  api: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  lib: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  config: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
};

const typeLabels = {
  contract: 'Smart Contract',
  frontend: 'Frontend',
  api: 'API Route',
  lib: 'Library',
  config: 'Configuration',
};

export default function CodeEvidence({ title = '📁 Code Evidence', files }: CodeEvidenceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-12 bg-[#0d2a13]/30 backdrop-blur-sm rounded-2xl p-6 border border-[#00ff4d]/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <Folder className="w-6 h-6 text-[#00ff4d]" />
        <h3 className="text-xl font-bold text-[#f2eecb]">{title}</h3>
        <span className="text-xs text-[#f2eecb]/50 ml-auto">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`
              relative group cursor-pointer
              bg-gradient-to-br ${typeColors[file.type]}
              backdrop-blur-sm rounded-lg p-4 border
              transition-all duration-300
              hover:shadow-lg hover:shadow-[#00ff4d]/10
            `}
          >
            {/* Type Badge */}
            <div className="absolute -top-2 -right-2 bg-[#0d2a13] border border-[#00ff4d]/30 rounded-full px-2 py-0.5">
              <span className="text-[10px] text-[#00ff4d] font-mono uppercase">
                {typeLabels[file.type]}
              </span>
            </div>

            {/* File Icon & Name */}
            <div className="flex items-start gap-2 mb-2">
              <FileCode className="w-4 h-4 text-[#00ff4d] flex-shrink-0 mt-0.5" />
              <code className="text-sm font-mono text-[#f2eecb] font-semibold break-all">
                {file.name}
              </code>
            </div>

            {/* File Path */}
            <div className="text-[10px] font-mono text-[#f2eecb]/40 truncate group-hover:text-[#f2eecb]/60 transition-colors">
              {file.path}
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-[#00ff4d]/0 group-hover:bg-[#00ff4d]/5 rounded-lg transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-xs text-[#f2eecb]/40 text-center mt-6 font-mono">
        All source code available in GitHub repository
      </p>
    </motion.div>
  );
}
