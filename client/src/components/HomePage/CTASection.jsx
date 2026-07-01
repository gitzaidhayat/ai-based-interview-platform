import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl -z-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Content */}
        <motion.h2 
          className="text-5xl md:text-6xl font-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Ready for Your Dream Job?
          </span>
        </motion.h2>

        <motion.p 
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Join thousands who used InterviewHub to ace their interviews and land jobs at top tech companies
        </motion.p>

        {/* Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/register">
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-xl text-lg hover:shadow-purple-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Practice
            </motion.button>
          </Link>
          <motion.button
            className="px-10 py-4 border-2 border-purple-500/50 text-white rounded-xl font-bold text-lg hover:bg-purple-500/10"
            whileHover={{ scale: 1.05 }}
          >
            Schedule Demo
          </motion.button>
        </motion.div>

        <motion.p 
          className="text-gray-400 mt-8 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ✓ No credit card required • ✓ Instant access • ✓ Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
