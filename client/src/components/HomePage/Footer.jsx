import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const links = {
    'Product': ['Features', 'Pricing', 'FAQ', 'Blog'],
    'Company': ['About', 'Careers', 'Contact', 'Press'],
    'Legal': ['Privacy', 'Terms', 'Security', 'Cookies'],
    'Social': ['Twitter', 'LinkedIn', 'GitHub', 'Discord']
  };

  return (
    <footer className="relative border-t border-purple-500/20 py-16 px-6 bg-gradient-to-t from-purple-900/10 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                🎯
              </div>
              <span className="font-bold text-white">InterviewHub</span>
            </div>
            <p className="text-sm text-gray-400">Master interviews with AI-powered practice</p>
          </motion.div>

          {/* Links */}
          {Object.entries(links).map(([category, items], i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <h4 className="font-semibold text-white mb-4 text-sm">{category}</h4>
              <ul className="space-y-2">
                {items.map((item, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-purple-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <p className="text-sm text-gray-500">© 2024 InterviewHub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-white transition">GitHub</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
