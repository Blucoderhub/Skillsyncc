"use client";

import React, { useState } from 'react';
import { Sparkles, Brain, Zap, ShieldCheck, Download, ArrowRight, Target, TrendingUp, Cpu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { NeuralCoach } from '../components/NeuralCoach';

export default function LandingPage() {
    const [isCoachOpen, setIsCoachOpen] = useState(false);

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0A0A0B] text-[#F5F5F7] neural-grid">
            <NeuralCoach isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} />

            {/* Navigation */}
            <nav className="relative z-50 flex justify-between items-center px-6 md:px-12 py-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        S
                    </div>
                    <span className="text-2xl font-bold tracking-tighter founders-gradient">Skillsyncc</span>
                </div>
                <div className="hidden md:flex gap-10 items-center font-medium text-[#A1A1AA]">
                    <a href="#features" className="hover:text-white transition-colors">Intelligence</a>
                    <a href="#vault" className="hover:text-white transition-colors">The Vault</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Elite</a>
                    <button className="premium-button text-sm">
                        Enterprise Access
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-24 pb-32 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium mb-8 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span className="tracking-widest uppercase opacity-80">Founders Edition v3.0</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tighter">
                        <span className="accent-text">The World's Most</span>
                        <br />
                        <span className="founders-gradient">Advanced AI Career Copilot.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#A1A1AA] font-light mb-12 leading-relaxed">
                        Skillsyncc orchestrates your professional identity using Neural Synergy™ logic.
                        No more forms. No more generic resumes. Just elite career acceleration.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-xl mx-auto">
                        <button
                            onClick={() => setIsCoachOpen(true)}
                            className="w-full sm:w-auto premium-button flex items-center justify-center gap-2 group"
                        >
                            Initialize Growth <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="w-full sm:w-auto secondary-button flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Install Extension
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section with Glass Cards */}
            <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: <Brain className="w-5 h-5" />, value: "98.2%", label: "Semantic Precision" },
                        { icon: <TrendingUp className="w-5 h-5" />, value: "4.2x", label: "Interview Multiplier" },
                        { icon: <Globe className="w-5 h-5" />, value: "50+", label: "Platforms Supported" },
                        { icon: <ShieldCheck className="w-5 h-5" />, value: "AES-256", label: "Vault Security" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            className="glass-card p-8 flex flex-col items-center text-center group hover:border-white/20 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-xs uppercase tracking-widest text-[#A1A1AA] font-semibold">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Intelligence Section */}
            <section id="features" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Engineered for Excellence.</h2>
                    <p className="text-[#A1A1AA] max-w-2xl mx-auto text-lg leading-relaxed">
                        We didn't just build a scraper. We built a neural engine that understands the nuances of technical architecture and career trajectory.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: <Target className="w-8 h-8 text-[#FFD700]" />,
                            title: "Neural Synergy™",
                            desc: "Deep logical alignment that finds architectural overlaps between your history and the job requirements."
                        },
                        {
                            icon: <Cpu className="w-8 h-8 text-[#FFD700]" />,
                            title: "Obsidian Vault",
                            desc: "Encrypt and manage your STAR stories and technical achievements in a world-class interface."
                        },
                        {
                            icon: <Zap className="w-8 h-8 text-[#FFD700]" />,
                            title: "Edge Orchestration",
                            desc: "The floating dock lives where you work, injecting intelligence directly into Workday, Greenhouse, and more."
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-4"
                        >
                            <div className="mb-8">{feature.icon}</div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-[#A1A1AA] leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-20 border-t border-white/5 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-left">
                        <div className="text-2xl font-bold mb-4 founders-gradient tracking-tighter">Skillsyncc</div>
                        <div className="text-[#71717A] text-sm">Design inspired by excellence. Built for the elite.</div>
                    </div>
                    <div className="flex flex-wrap gap-10 text-sm font-medium text-[#71717A]">
                        <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Protocol</a>
                        <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Security</a>
                        <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Contact</a>
                    </div>
                </div>
                <div className="mt-20 text-[#3F3F46] text-xs text-center border-t border-white/5 pt-10">
                    © 2026 SKILLSYNCC PLATFORM. ALL RIGHTS RESERVED. FOUNDERS EDITION.
                </div>
            </footer>
        </main>
    );
}
