import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    image: '👩‍💻',
    quote: 'InterviewHub helped me get my offer at Google. The AI feedback was spot-on!',
    rating: 5
  },
  {
    name: 'Alex Rodriguez',
    role: 'Product Manager',
    company: 'Meta',
    image: '👨‍💼',
    quote: 'I practiced on here and felt so prepared for the real interview. Highly recommend!',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Data Scientist',
    company: 'Amazon',
    image: '👩‍🔬',
    quote: 'The personalized feedback helped me improve my communication skills dramatically.',
    rating: 5
  },
  {
    name: 'James Park',
    role: 'Full Stack Dev',
    company: 'Microsoft',
    image: '👨‍💻',
    quote: 'Best interview prep tool I\'ve used. Worth every penny of the Pro plan.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-black via-purple-900/10 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Thousands got jobs at top companies</p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 hover:border-purple-500/50 transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-sm italic mb-6 min-h-20">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <p className="font-bold text-white text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.role} @ {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
