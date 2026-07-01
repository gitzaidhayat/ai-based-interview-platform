import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started',
    features: ['5 practice interviews/month', 'Basic AI feedback', 'Email support'],
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Most popular choice',
    features: ['Unlimited interviews', 'Advanced AI feedback', 'Priority support', 'Interview analytics', 'All interview types'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams & organizations',
    features: ['Everything in Pro', 'Team management', 'SSO & security', 'Dedicated support', 'Custom integrations'],
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Simple Pricing
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Choose the plan that fits your goals</p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative p-8 rounded-3xl border transition-all ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-500/50 transform md:scale-105 md:z-10' 
                  : 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={!plan.popular ? { y: -10 } : {}}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                >
                  MOST POPULAR
                </motion.div>
              )}

              {/* Plan Name & Price */}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  {plan.price}
                </span>
                {plan.period && <span className="text-gray-400">{plan.period}</span>}
              </div>

              {/* CTA Button */}
              <Link to="/register">
                <motion.button
                  className={`w-full py-3 rounded-xl font-bold mb-8 transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-purple-500/50'
                      : 'border-2 border-purple-500/30 text-white hover:bg-purple-500/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </Link>

              {/* Features List */}
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center gap-3 text-gray-300 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <span className="text-purple-400">✓</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
