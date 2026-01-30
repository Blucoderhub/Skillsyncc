"use client";

import React, { useState } from 'react';
import { Sparkles, Brain, Zap, ShieldCheck, Download, UserPlus, ArrowRight, Search, Target, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState('ext');

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">
                        S
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Skillsyncc</span>
                </div>
                <div className="hidden md:flex gap-8 items-center font-medium text-gray-700">
                    <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</a>
                    <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
                    <button className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                        Login
                    </button>
                </div>
                <div className="md:hidden">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                        <span className="text-gray-700">☰</span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Hire pro-actively</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                            Automate Your Job Search
                        </span>
                        <br />Stop Manual Application Filling
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 font-light mb-10 max-w-3xl">
                        Let AI fill out applications, optimize your resume, and find the best matches. Join thousands who've landed their dream jobs faster.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                        <button className="w-full sm:w-auto weekday-button flex items-center justify-center gap-2 px-8 py-4 text-base">
                            Get Started Free <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 glass-container font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                            <Download className="w-4 h-4" /> Install Extension
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 py-12 px-6 max-w-7xl mx-auto mb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {[
                        { value: "300mn+", label: "Talent Database" },
                        { value: "30-40%", label: "Response Rate" },
                        { value: "50%+", label: "Best Fits" },
                        { value: "24/7", label: "Follow-ups" }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="text-center p-6 glass-container text-center"
                        >
                            <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How Skillsyncc Transforms Your Job Search</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Our AI-powered platform automates everything from application filling to follow-ups</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Target className="w-8 h-8 text-emerald-600" />,
                            title: "Smart Matching",
                            desc: "AI analyzes job descriptions and matches with your skills and experience."
                        },
                        {
                            icon: <Zap className="w-8 h-8 text-emerald-600" />,
                            title: "Auto-Fill Forms",
                            desc: "One-click application filling with your pre-filled information."
                        },
                        {
                            icon: <Search className="w-8 h-8 text-emerald-600" />,
                            title: "Resume Optimization",
                            desc: "Real-time resume optimization based on job requirements."
                    }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="glass-container p-8 text-center group"
                        >
                            <div className="mb-6 flex justify-center">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto text-center my-20">
                <div className="glass-container p-12 md:p-16 rounded-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Job Search?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of professionals who've landed their dream jobs faster with our AI-powered platform.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="weekday-button px-8 py-4 text-lg">
                            Start Free Trial
                        </button>
                        <button className="px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-xl font-medium hover:shadow-sm transition-all">
                            Book a Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-gray-200 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-left">
                            <div className="text-xl font-bold mb-2">Skillsyncc</div>
                            <div className="text-gray-600 text-sm">© 2026 Skillsyncc. All rights reserved.</div>
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
                            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-emerald-600 transition-colors">Security</a>
                            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
