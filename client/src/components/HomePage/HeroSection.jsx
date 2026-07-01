import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full w-fit"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm">✨ AI-Powered Interview Prep</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent block mb-2">
                Get Job-Ready
              </span>
              <span className="text-white">in Days, Not Months</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
              Practice real interviews with AI, get instant feedback, and boost your confidence. Join 10,000+ professionals who cracked their dream jobs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-xl"
              >
                <Link to="/register">Start Practice Now</Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 border-2 border-purple-500/50 text-white rounded-xl font-bold hover:bg-purple-500/10 transition"
              >
                Watch Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-purple-500/20">
              <motion.div 
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-2xl font-bold text-purple-400">10K+</p>
                <p className="text-sm text-gray-400">Users Practicing</p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-2xl font-bold text-pink-400">500+</p>
                <p className="text-sm text-gray-400">Questions</p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-2xl font-bold text-blue-400">4.9★</p>
                <p className="text-sm text-gray-400">Rating</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Interactive Demo */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 p-8 flex flex-col justify-between">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                  <div>
                    <p className="font-semibold text-white">InterviewHub AI</p>
                    <p className="text-xs text-purple-300">Senior SWE Role</p>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="space-y-4">
                <motion.div 
                  className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-gray-300 mb-3">💬 "Tell me about a time you led a complex project"</p>
                  <p className="text-sm text-purple-300 italic">Your answer is being analyzed...</p>
                </motion.div>

                {/* Scores */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <motion.div 
                    className="text-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="text-2xl font-bold text-green-400">9.2</p>
                    <p className="text-xs text-gray-400">Technical</p>
                  </motion.div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">8.7</p>
                    <p className="text-xs text-gray-400">Clarity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-400">9.0</p>
                    <p className="text-xs text-gray-400">Overall</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Orbs */}
            <motion.div
              className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -top-8 -left-8 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
