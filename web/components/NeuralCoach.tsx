import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, MessageSquare, Shield, Zap, ChevronRight } from 'lucide-react';

interface NeuralCoachProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NeuralCoach: React.FC<NeuralCoachProps> = ({ isOpen, onClose }) => {
    const [currentStage, setCurrentStage] = useState<'idle' | 'analyzing' | 'roleplay'>('idle');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-8 right-8 w-96 glass-card overflow-hidden z-[100] border-accent-gold/20"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-accent-gold animate-pulse" />
                            <span className="font-bold tracking-tighter uppercase text-xs">Neural Coach v3</span>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {currentStage === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight">Ready for Orchestration.</h3>
                                    <p className="text-sm text-[#A1A1AA] leading-relaxed">
                                        I have indexed your Professional Vault. We can now simulate interview scenarios for your open applications.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => setCurrentStage('analyzing')}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 text-left">
                                            <Zap className="w-4 h-4 text-accent-gold" />
                                            <div>
                                                <div className="text-sm font-bold">Roleplay Session</div>
                                                <div className="text-[10px] text-[#A1A1AA] uppercase tracking-widest">Active Application</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>

                                    <button className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3 text-left">
                                            <Shield className="w-4 h-4 text-accent-gold" />
                                            <div>
                                                <div className="text-sm font-bold">ATS Audit</div>
                                                <div className="text-[10px] text-[#A1A1AA] uppercase tracking-widest">Shadow-Ban Check</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStage === 'analyzing' && (
                            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-2 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin" />
                                <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent-gold">Synchronizing Neural Vault...</div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">System Online</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
