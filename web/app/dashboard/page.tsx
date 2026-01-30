"use client";

import React, { useState, useEffect } from 'react';
import { Save, User, Briefcase, Award, Star, Plus, Trash2 } from 'lucide-react';

export default function Dashboard() {
    const [profile, setProfile] = useState<any>({
        personalInfo: { firstName: '', lastName: '', summary: '' },
        skills: [],
        experiences: [],
        starStories: []
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('skillsyncc_profile');
        if (saved) setProfile(JSON.parse(saved));
    }, []);

    const saveProfile = () => {
        setSaving(true);
        localStorage.setItem('skillsyncc_profile', JSON.stringify(profile));

        // Broadcast for extension sync
        const channel = new BroadcastChannel('skillsyncc_sync');
        channel.postMessage({ type: 'PROFILE_UPDATED', profile });
        channel.close();

        setTimeout(() => {
            setSaving(false);
            alert('Vault Synchronized Successfully!');
        }, 1000);
    };

    const addSkill = (skill: string) => {
        if (skill && !profile.skills.includes(skill)) {
            setProfile({ ...profile, skills: [...profile.skills, skill] });
        }
    };

    return (
        <main className="min-h-screen bg-retro-dark pt-24 px-6 pb-20">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Professional Vault</h1>
                        <p className="text-retro-gold/40 font-bold uppercase tracking-widest text-xs">Skillsyncc Cloud Management</p>
                    </div>
                    <button
                        onClick={saveProfile}
                        className="retro-button flex items-center gap-3"
                    >
                        {saving ? 'Synchronizing...' : <><Save className="w-5 h-5" /> Sync All Systems</>}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        <section className="glass-card p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="text-retro-gold w-6 h-6" />
                                <h3 className="font-black uppercase tracking-tight">Identity</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                <input
                                    placeholder="First Name"
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-retro-gold outline-none text-white"
                                    value={profile.personalInfo.firstName}
                                    onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, firstName: e.target.value } })}
                                />
                                <input
                                    placeholder="Last Name"
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-retro-gold outline-none text-white"
                                    value={profile.personalInfo.lastName}
                                    onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, lastName: e.target.value } })}
                                />
                                <textarea
                                    placeholder="Professional Summary (Expert Tone)"
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm h-32 resize-none focus:border-retro-gold outline-none text-white"
                                    value={profile.personalInfo.summary}
                                    onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, summary: e.target.value } })}
                                />
                            </div>
                        </section>

                        <section className="glass-card p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Award className="text-retro-gold w-6 h-6" />
                                <h3 className="font-black uppercase tracking-tight">Core Expertise</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {profile.skills.map((s: string, i: number) => (
                                    <div key={i} className="px-3 py-1 bg-retro-gold/10 border border-retro-gold/20 rounded-lg text-xs font-bold text-retro-gold flex items-center gap-2">
                                        {s} <Trash2 className="w-3 h-3 cursor-pointer" onClick={() => setProfile({ ...profile, skills: profile.skills.filter((sk: any) => sk !== s) })} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    id="skill-input"
                                    placeholder="Add expert skill..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-retro-gold outline-none text-white"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addSkill((e.target as HTMLInputElement).value);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }}
                                />
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <section className="glass-card p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="text-retro-gold w-6 h-6" />
                                    <h3 className="font-black uppercase tracking-tight text-xl">Technical History</h3>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {profile.experiences.length === 0 ? (
                                    <div className="text-center py-10 text-retro-gold/20 font-bold uppercase italic">No experiences logged in Vault</div>
                                ) : (
                                    profile.experiences.map((exp: any, i: number) => (
                                        <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                            <h4 className="font-black text-lg">{exp.title} <span className="text-retro-gold/50 text-sm italic font-medium ml-2">@ {exp.company}</span></h4>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="glass-card p-8 bg-gradient-to-br from-retro-gold/5 to-transparent">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Star className="text-retro-gold w-6 h-6" />
                                    <h3 className="font-black uppercase tracking-tight text-xl">STAR Mappings</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.starStories.length === 0 ? (
                                    <div className="md:col-span-2 text-center py-10 text-retro-gold/20 font-bold uppercase italic">Log STAR stories for expert interview prep</div>
                                ) : (
                                    profile.starStories.map((s: any, i: number) => (
                                        <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                            <div className="text-sm font-medium opacity-60 line-clamp-2">{s.situation}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
