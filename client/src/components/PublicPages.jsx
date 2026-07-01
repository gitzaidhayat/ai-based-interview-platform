import React from 'react';
import { Link } from 'react-router-dom';

function PublicTopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <span className="text-xl font-bold text-gray-900">InterviewAI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function PublicLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicTopNav />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="mb-10 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </section>
        <section className="grid gap-6 md:grid-cols-2">{children}</section>
      </main>
    </div>
  );
}

export function AboutPage() {
  return (
    <PublicLayout
      title="About InterviewAI"
      subtitle="We help candidates and recruiters run smarter interviews with AI-powered assessment."
    >
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Our Mission</h2>
        <p className="text-gray-600">
          InterviewAI is built to make interview preparation and hiring more efficient, fair, and data-driven.
        </p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">What We Offer</h2>
        <p className="text-gray-600">
          AI-generated interview questions, structured scoring, and actionable feedback for both candidates and teams.
        </p>
      </div>
    </PublicLayout>
  );
}

export function PricingPage() {
  return (
    <PublicLayout
      title="Simple Pricing"
      subtitle="Choose a plan that fits your hiring or interview practice needs."
    >
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-medium text-blue-600">Starter</p>
        <h2 className="mb-2 text-3xl font-bold text-gray-900">$0</h2>
        <p className="mb-4 text-gray-600">Great for individual candidates.</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 5 mock interviews/month</li>
          <li>• Basic AI feedback</li>
          <li>• Progress tracking</li>
        </ul>
      </div>
      <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-medium text-blue-600">Pro</p>
        <h2 className="mb-2 text-3xl font-bold text-gray-900">$29</h2>
        <p className="mb-4 text-gray-600">Best for recruiters and growing teams.</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Unlimited interviews</li>
          <li>• Advanced analytics</li>
          <li>• Candidate comparison tools</li>
        </ul>
      </div>
    </PublicLayout>
  );
}

export function ContactPage() {
  return (
    <PublicLayout
      title="Contact Us"
      subtitle="Have questions? Our team is ready to help."
    >
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Get in touch</h2>
        <p className="text-gray-600">Email: support@interviewai.com</p>
        <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Office Hours</h2>
        <p className="text-gray-600">Monday - Friday: 9:00 AM to 6:00 PM</p>
        <p className="text-gray-600">Saturday: 10:00 AM to 2:00 PM</p>
      </div>
    </PublicLayout>
  );
}
