import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      className="fixed w-full top-0 z-50 bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-md border-b border-purple-500/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🎯</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">InterviewHub</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105">
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-purple-500/20 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            className="md:hidden mt-4 pb-4 border-t border-purple-500/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-3">
              <a href="#features" className="px-4 py-2 text-gray-300 hover:bg-purple-500/20 rounded transition">Features</a>
              <a href="#pricing" className="px-4 py-2 text-gray-300 hover:bg-purple-500/20 rounded transition">Pricing</a>
              <a href="#faq" className="px-4 py-2 text-gray-300 hover:bg-purple-500/20 rounded transition">FAQ</a>
              <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-center font-semibold">Start Free</Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
