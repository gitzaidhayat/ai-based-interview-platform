import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How does the AI interviewer work?',
    answer: 'Our AI uses advanced NLP and machine learning to understand your answers and ask follow-up questions just like a real interviewer would. It evaluates your technical knowledge, communication skills, and problem-solving approach.'
  },
  {
    question: 'Can I practice any type of interview?',
    answer: 'Yes! We support all interview types: behavioral, technical, system design, case studies, product management, data science, and more. Choose your role and difficulty level.'
  },
  {
    question: 'Is my data safe and private?',
    answer: 'Absolutely. All your practice sessions are encrypted and stored securely. We never share your data with third parties. Your privacy is our top priority.'
  },
  {
    question: 'How much improvement can I expect?',
    answer: 'Most users see 30-50% improvement in their interview scores within 2-3 weeks of regular practice. Results vary based on consistency and starting level.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no questions asked. No long-term contracts required.'
  },
  {
    question: 'Do you offer a refund?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with the Pro plan, we\'ll refund you completely.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="relative py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Common Questions
            </span>
          </h2>
          <p className="text-gray-400 text-lg">We got you covered</p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-purple-500/50 transition cursor-pointer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {/* Question */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg">{faq.question}</h3>
                <motion.span
                  className="text-2xl text-purple-400"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </div>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-purple-500/20"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <a href="mailto:support@interviewhub.com" className="text-purple-400 hover:text-purple-300 font-semibold transition">
            Contact our support team →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
