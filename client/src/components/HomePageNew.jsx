import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', href: '#features' },
  { label: 'About', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = ({ isOpen, setIsOpen }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-bold text-gray-900">InterviewAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 md:hidden">
            <div className="px-4 py-3 space-y-3">
              {navLinks.map((link) => (
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="pt-3 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center mt-2"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </header>
);

const HeroSection = () => (
  <section className="relative bg-white py-20 lg:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-12 items-center lg:grid-cols-2">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              AI-Powered Interview
              <br />
              <span className="text-blue-600">Practice Platform</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Practice your interview skills with our AI-powered platform. Get real-time feedback, improve your responses, and ace your next interview.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors text-center"
            >
              View Demo
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white"></div>
              <div className="h-8 w-8 rounded-full bg-gray-400 border-2 border-white"></div>
              <div className="h-8 w-8 rounded-full bg-gray-500 border-2 border-white"></div>
              <div className="h-8 w-8 rounded-full bg-gray-600 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-white font-medium">+5k</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">10,000+</span> users practicing daily
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative">
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
            {/* Dashboard mockup */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Interview Session</h3>
                    <p className="text-sm text-gray-500">Practice Mode</p>
                  </div>
                </div>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Question 1 of 10</p>
                  <p className="text-gray-700">"Tell me about yourself and your experience."</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-blue-600 rounded-full"></div>
                  <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
                  <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1 bg-blue-100 text-blue-700 rounded-lg py-2 px-3 text-sm font-medium text-center">
                    Recording
                  </div>
                  <div className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2 px-3 text-sm font-medium text-center">
                    Analyzing
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Live Feedback</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">95%</span>
                <span className="text-sm text-gray-600">Match Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="py-20 bg-gray-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Everything you need to succeed
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our AI-powered platform provides comprehensive tools to help you master your interview skills
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: "🎯",
            title: "AI-Powered Questions",
            description: "Get personalized interview questions based on your industry and experience level",
            bgColor: "bg-blue-100"
          },
          {
            icon: "📊",
            title: "Real-time Feedback",
            description: "Receive instant analysis on your answers, tone, and communication skills",
            bgColor: "bg-green-100"
          },
          {
            icon: "🎥",
            title: "Video Practice",
            description: "Record and review your mock interviews to identify areas for improvement",
            bgColor: "bg-purple-100"
          },
          {
            icon: "📈",
            title: "Progress Tracking",
            description: "Monitor your improvement over time with detailed analytics and insights",
            bgColor: "bg-orange-100"
          },
          {
            icon: "🤝",
            title: "Industry Specific",
            description: "Practice with questions tailored to tech, finance, healthcare, and more",
            bgColor: "bg-red-100"
          },
          {
            icon: "🏆",
            title: "Success Guarantee",
            description: "Join thousands who've landed their dream jobs after practicing with us",
            bgColor: "bg-indigo-100"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center text-2xl mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-20 bg-blue-600">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-4 text-center">
        {[
          { number: "10,000+", label: "Active Users" },
          { number: "95%", label: "Success Rate" },
          { number: "500+", label: "Interview Questions" },
          { number: "50+", label: "Industries Covered" }
        ].map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold text-white">
              {stat.number}
            </div>
            <div className="text-blue-100">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold">InterviewAI</span>
          </div>
          <p className="text-gray-400 text-sm">
            Master your interview skills with AI-powered practice and real-time feedback.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-white">Product</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-white">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-white">Legal</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-gray-400 text-sm">
          © 2024 InterviewAI. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default function HomePageNew() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar isOpen={mobileOpen} setIsOpen={setMobileOpen} />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <Footer />
    </div>
  );
}
