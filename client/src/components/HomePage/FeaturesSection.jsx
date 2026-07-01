import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🤖',
    title: 'AI Interview Bot',
    description: 'Intelligent AI that adapts to your responses like a real interviewer'
  },
  {
    icon: '📊',
    title: 'Instant Feedback',
    description: 'Get detailed scores on communication, technical skills & confidence'
  },
  {
    icon: '🎯',
    title: 'Personalized Path',
    description: 'Custom learning based on your weaknesses and target roles'
  },
  {
    icon: '🔄',
    title: 'Unlimited Practice',
    description: 'Practice as many times as you want at your own pace'
  },
  {
    icon: '📈',
    title: 'Track Progress',
    description: 'Visualize improvement over time with detailed analytics'
  },
  {
    icon: '🏆',
    title: 'Success Stories',
    description: 'Join thousands who got offers from top companies'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-6 bg-gradient-to-b from-black via-purple-900/10 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to ace any interview
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-purple-500/50 transition cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.1)' }}
            >
              <motion.div 
                className="text-5xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
